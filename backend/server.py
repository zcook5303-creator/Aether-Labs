from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Emergent LLM Key
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

# Models
class Message(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    role: str  # 'user' or 'assistant'
    content: str
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class Chat(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str = "New Chat"
    messages: List[Message] = []
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ChatCreate(BaseModel):
    title: Optional[str] = "New Chat"

class MessageCreate(BaseModel):
    content: str

class ChatResponse(BaseModel):
    id: str
    title: str
    messages: List[Message]
    created_at: str
    updated_at: str

class ChatListItem(BaseModel):
    id: str
    title: str
    created_at: str
    updated_at: str

# Routes
@api_router.get("/")
async def root():
    return {"message": "Aether Labs API"}

@api_router.post("/chats", response_model=ChatResponse)
async def create_chat(chat_input: ChatCreate):
    chat = Chat(title=chat_input.title or "New Chat")
    doc = chat.model_dump()
    await db.chats.insert_one(doc)
    return ChatResponse(**doc)

@api_router.get("/chats", response_model=List[ChatListItem])
async def get_chats():
    chats = await db.chats.find({}, {"_id": 0, "messages": 0}).sort("updated_at", -1).to_list(100)
    return [ChatListItem(**c) for c in chats]

@api_router.get("/chats/{chat_id}", response_model=ChatResponse)
async def get_chat(chat_id: str):
    chat = await db.chats.find_one({"id": chat_id}, {"_id": 0})
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    return ChatResponse(**chat)

@api_router.delete("/chats/{chat_id}")
async def delete_chat(chat_id: str):
    result = await db.chats.delete_one({"id": chat_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Chat not found")
    return {"message": "Chat deleted"}

@api_router.put("/chats/{chat_id}/title")
async def update_chat_title(chat_id: str, title: str):
    result = await db.chats.update_one(
        {"id": chat_id},
        {"$set": {"title": title, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Chat not found")
    return {"message": "Title updated"}

@api_router.post("/chats/{chat_id}/messages", response_model=Message)
async def send_message(chat_id: str, message_input: MessageCreate):
    # Get existing chat
    chat = await db.chats.find_one({"id": chat_id}, {"_id": 0})
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    # Create user message
    user_message = Message(role="user", content=message_input.content)
    
    # Add user message to chat
    await db.chats.update_one(
        {"id": chat_id},
        {
            "$push": {"messages": user_message.model_dump()},
            "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}
        }
    )
    
    # Generate AI response using GPT-5.2
    try:
        # Get chat history for context
        chat_history = chat.get("messages", [])
        
        # Build conversation context
        system_message = """You are Aether, an advanced AI assistant created by Aether Labs. 
Aether Labs was founded by Zachary Cook, an online engineering student passionate about AI technology.
You are helpful, harmless, and honest. You can assist with coding, writing, analysis, math, 
and general questions. Format your responses using markdown when appropriate - use code blocks 
for code, bullet points for lists, and headers for organization. When asked about who made you, 
your creator, or the founder of Aether Labs, mention that Zachary Cook founded Aether Labs."""
        
        llm_chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=chat_id,
            system_message=system_message
        ).with_model("openai", "gpt-5.2")
        
        # Send message and get response
        llm_user_message = UserMessage(text=message_input.content)
        ai_response_text = await llm_chat.send_message(llm_user_message)
        
        # Create AI message
        ai_message = Message(role="assistant", content=ai_response_text)
        
        # Auto-generate title if this is first message
        if len(chat_history) == 0:
            # Generate a short title from the first message
            title_prompt = f"Generate a very short title (max 5 words) for a conversation that starts with: '{message_input.content[:100]}'. Reply with only the title, no quotes."
            title_chat = LlmChat(
                api_key=EMERGENT_LLM_KEY,
                session_id=f"{chat_id}_title",
                system_message="You generate short conversation titles. Reply with only the title, nothing else."
            ).with_model("openai", "gpt-5.2")
            new_title = await title_chat.send_message(UserMessage(text=title_prompt))
            new_title = new_title.strip().strip('"')[:50]
            
            await db.chats.update_one(
                {"id": chat_id},
                {
                    "$push": {"messages": ai_message.model_dump()},
                    "$set": {
                        "title": new_title,
                        "updated_at": datetime.now(timezone.utc).isoformat()
                    }
                }
            )
        else:
            await db.chats.update_one(
                {"id": chat_id},
                {
                    "$push": {"messages": ai_message.model_dump()},
                    "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}
                }
            )
        
        return ai_message
        
    except Exception as e:
        logger.error(f"Error generating AI response: {e}")
        error_message = Message(
            role="assistant", 
            content="I apologize, but I encountered an error processing your request. Please try again."
        )
        await db.chats.update_one(
            {"id": chat_id},
            {"$push": {"messages": error_message.model_dump()}}
        )
        return error_message

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
