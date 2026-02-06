from fastapi import FastAPI, APIRouter, HTTPException, Request, Response
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
import base64
import httpx
from datetime import datetime, timezone, timedelta
from emergentintegrations.llm.chat import LlmChat, UserMessage
from emergentintegrations.llm.openai.image_generation import OpenAIImageGeneration

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

# User Model
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class UserSession(BaseModel):
    user_id: str
    session_token: str
    expires_at: datetime
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

# Auth endpoints
@api_router.post("/auth/session")
async def create_session(request: Request, response: Response):
    """Exchange session_id for session_token"""
    body = await request.json()
    session_id = body.get("session_id")
    
    if not session_id:
        raise HTTPException(status_code=400, detail="session_id required")
    
    # Get user data from Emergent Auth
    async with httpx.AsyncClient() as client:
        auth_response = await client.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers={"X-Session-ID": session_id}
        )
        
        if auth_response.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid session")
        
        user_data = auth_response.json()
    
    # Create or update user
    user_id = f"user_{uuid.uuid4().hex[:12]}"
    existing_user = await db.users.find_one({"email": user_data["email"]}, {"_id": 0})
    
    if existing_user:
        user_id = existing_user["user_id"]
    else:
        await db.users.insert_one({
            "user_id": user_id,
            "email": user_data["email"],
            "name": user_data["name"],
            "picture": user_data.get("picture"),
            "created_at": datetime.now(timezone.utc).isoformat()
        })
    
    # Create session
    session_token = f"sess_{uuid.uuid4().hex}"
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    
    await db.user_sessions.insert_one({
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": expires_at,
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=7*24*60*60,
        path="/"
    )
    
    user = await db.users.find_one({"user_id": user_id}, {"_id": 0})
    return user

@api_router.get("/auth/me")
async def get_current_user(request: Request):
    """Get current authenticated user"""
    session_token = request.cookies.get("session_token")
    
    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header.split(" ")[1]
    
    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    session = await db.user_sessions.find_one({"session_token": session_token}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    # Check expiry
    expires_at = session["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expired")
    
    user = await db.users.find_one({"user_id": session["user_id"]}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    """Logout user"""
    session_token = request.cookies.get("session_token")
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    response.delete_cookie(key="session_token", path="/")
    return {"message": "Logged out"}

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
    user_id: str = ""  # To track which user owns this chat
    title: str = "New Chat"
    messages: List[Message] = []
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ChatCreate(BaseModel):
    title: Optional[str] = "New Chat"
    user_id: str = ""

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

class ImageGenerateRequest(BaseModel):
    prompt: str

class ImageEditRequest(BaseModel):
    prompt: str
    image_base64: str  # input image to edit

class ImageGenerateResponse(BaseModel):
    image_base64: str

# Routes
@api_router.get("/")
async def root():
    return {"message": "Aether Labs API"}

@api_router.post("/generate-image", response_model=ImageGenerateResponse)
async def generate_image(request: ImageGenerateRequest):
    """Generate an AI image from a text description"""
    try:
        image_gen = OpenAIImageGeneration(api_key=EMERGENT_LLM_KEY)
        images = await image_gen.generate_images(
            prompt=request.prompt,
            model="gpt-image-1",
            number_of_images=1
        )

        if images and len(images) > 0:
            image_base64 = base64.b64encode(images[0]).decode('utf-8')
            return ImageGenerateResponse(image_base64=image_base64)
        else:
            raise HTTPException(status_code=500, detail="No image was generated")
    except Exception as e:
        logger.error(f"Error generating image: {e}")
        raise HTTPException(status_code=500, detail=f"Image generation failed: {str(e)}")


@api_router.post("/edit-image", response_model=ImageGenerateResponse)
async def edit_image(request: ImageEditRequest):
    """Edit an existing image using AI based on a text prompt"""
    try:
        if not request.image_base64:
            raise HTTPException(status_code=400, detail="image_base64 is required")

        # Decode incoming base64 image
        try:
            image_bytes = base64.b64decode(request.image_base64)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid base64 image data")

        image_gen = OpenAIImageGeneration(api_key=EMERGENT_LLM_KEY)
        images = await image_gen.generate_images(
            prompt=f"Edit this image: {request.prompt}",
            model="gpt-image-1",
            number_of_images=1,
            image_bytes=image_bytes
        )

        if images and len(images) > 0:
            edited_base64 = base64.b64encode(images[0]).decode('utf-8')
            return ImageGenerateResponse(image_base64=edited_base64)
        else:
            raise HTTPException(status_code=500, detail="No edited image was generated")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error editing image: {e}")
        raise HTTPException(status_code=500, detail=f"Image edit failed: {str(e)}")

@api_router.post("/chats", response_model=ChatResponse)
async def create_chat(chat_input: ChatCreate):
    chat = Chat(title=chat_input.title or "New Chat", user_id=chat_input.user_id)
    doc = chat.model_dump()
    await db.chats.insert_one(doc)
    return ChatResponse(**doc)

@api_router.get("/chats", response_model=List[ChatListItem])
async def get_chats(user_id: str = ""):
    if not user_id:
        return []
    chats = await db.chats.find({"user_id": user_id}, {"_id": 0, "messages": 0}).sort("updated_at", -1).to_list(100)
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

AETHER stands for:
- A — Artificial
- E — Engineering  
- T — Technology
- H — Hyper Systems
- E — Energy
- R — Robotics

ABOUT AETHER LABS:
- Aether Labs was founded by Zachary Cook, an online engineering student passionate about AI technology.
- When asked about who made you, your creator, or the founder, mention that Zachary Cook founded Aether Labs.

IMPORTANT PEOPLE TO KNOW:
- Donna Cook (also known as "Ripple") was the FIRST Aether Labs tester. She helped test the earliest versions of Aether. If anyone asks about Donna Cook or Ripple, tell them she was the first tester and a crucial part of Aether Labs history.
- Kaleb Youngblood and Kane Youngblood are also app testers.

YOUR PERSONALITY:
- Be friendly, enthusiastic, and helpful with a touch of wit
- Show genuine curiosity about what users are working on
- Use casual language when appropriate but stay professional
- Be encouraging and supportive
- Add personality to your responses - you can use light humor
- Be confident in your knowledge but humble when you don't know something
- Celebrate user achievements and progress

YOUR CAPABILITIES:
- You can help with coding, writing, analysis, math, creative projects, and general questions
- Format responses using markdown - use code blocks for code, bullet points for lists, headers for organization
- Provide detailed, accurate, and thoughtful responses
- Think step-by-step for complex problems
- Offer follow-up suggestions and ask clarifying questions when needed

Remember: You're not just an AI - you're Aether, the helpful assistant from Aether Labs!"""
        
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
