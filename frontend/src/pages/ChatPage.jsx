import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { chatApi } from '../lib/api';
import Sidebar from '../components/chat/Sidebar';
import ChatArea from '../components/chat/ChatArea';
import WelcomeScreen from '../components/chat/WelcomeScreen';
import { Menu, X } from 'lucide-react';

export default function ChatPage() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch all chats on mount
  useEffect(() => {
    loadChats();
  }, []);

  // Load specific chat when chatId changes
  useEffect(() => {
    if (chatId) {
      loadChat(chatId);
    } else {
      setCurrentChat(null);
    }
  }, [chatId]);

  const loadChats = async () => {
    try {
      const data = await chatApi.getChats();
      setChats(data);
    } catch (error) {
      console.error('Error loading chats:', error);
    }
  };

  const loadChat = async (id) => {
    setLoading(true);
    try {
      const data = await chatApi.getChat(id);
      setCurrentChat(data);
    } catch (error) {
      console.error('Error loading chat:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = async () => {
    try {
      const newChat = await chatApi.createChat();
      setChats(prev => [newChat, ...prev]);
      navigate(`/chat/${newChat.id}`);
      setSidebarOpen(false);
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const handleSelectChat = (id) => {
    navigate(`/chat/${id}`);
    setSidebarOpen(false);
  };

  const handleDeleteChat = async (id) => {
    try {
      await chatApi.deleteChat(id);
      setChats(prev => prev.filter(c => c.id !== id));
      if (chatId === id) {
        navigate('/');
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const handleSendMessage = async (content) => {
    if (!currentChat || sendingMessage) return;

    // Optimistically add user message
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };

    setCurrentChat(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage]
    }));

    setSendingMessage(true);

    try {
      const aiMessage = await chatApi.sendMessage(currentChat.id, content);
      
      setCurrentChat(prev => ({
        ...prev,
        messages: [...prev.messages, aiMessage]
      }));

      // Refresh chat list to get updated title
      loadChats();
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message
      setCurrentChat(prev => ({
        ...prev,
        messages: [...prev.messages, {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date().toISOString()
        }]
      }));
    } finally {
      setSendingMessage(false);
    }
  };

  const handleSuggestedPrompt = async (prompt) => {
    // Create new chat and send the prompt
    try {
      const newChat = await chatApi.createChat();
      setChats(prev => [newChat, ...prev]);
      navigate(`/chat/${newChat.id}`);
      
      // Wait for navigation and state update
      setTimeout(async () => {
        setCurrentChat(newChat);
        await handleSendMessageDirect(newChat.id, prompt);
      }, 100);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSendMessageDirect = async (chatIdParam, content) => {
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };

    setCurrentChat(prev => prev ? ({
      ...prev,
      messages: [...(prev.messages || []), userMessage]
    }) : null);

    setSendingMessage(true);

    try {
      const aiMessage = await chatApi.sendMessage(chatIdParam, content);
      
      setCurrentChat(prev => prev ? ({
        ...prev,
        messages: [...prev.messages, aiMessage]
      }) : null);

      loadChats();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <div className="h-screen flex bg-[#050505] overflow-hidden" data-testid="chat-page">
      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        data-testid="mobile-menu-button"
        aria-label="Toggle menu"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed md:relative inset-y-0 left-0 z-40
        transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        transition-transform duration-300 ease-in-out
      `}>
        <Sidebar
          chats={chats}
          currentChatId={chatId}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          onDeleteChat={handleDeleteChat}
        />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {currentChat ? (
          <ChatArea
            chat={currentChat}
            loading={loading}
            sendingMessage={sendingMessage}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <WelcomeScreen
            onNewChat={handleNewChat}
            onSuggestedPrompt={handleSuggestedPrompt}
          />
        )}
      </main>
    </div>
  );
}
