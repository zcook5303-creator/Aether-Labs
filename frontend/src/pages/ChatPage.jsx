import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { chatApi } from '../lib/api';
import Sidebar from '../components/chat/Sidebar';
import ChatArea from '../components/chat/ChatArea';
import WelcomeScreen from '../components/chat/WelcomeScreen';
import { Menu } from 'lucide-react';

export default function ChatPage() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadChats();
  }, []);

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
      if (chatId === id) navigate('/');
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const handleSendMessage = async (content) => {
    if (!currentChat || sendingMessage) return;

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
      loadChats();
    } catch (error) {
      console.error('Error sending message:', error);
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

  return (
    <div className="h-[100dvh] flex bg-[#050505] overflow-hidden" data-testid="chat-page">
      {/* Mobile header */}
      <div className="fixed top-0 left-0 right-0 z-50 md:hidden bg-[#050505] border-b border-white/5">
        <div className="flex items-center justify-between px-3 py-2.5">
          <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 hover:bg-white/5 rounded-lg" data-testid="mobile-menu-button">
            <Menu size={22} strokeWidth={1.5} />
          </button>
          <span className="font-heading font-medium text-sm">
            {currentChat ? (currentChat.title?.slice(0, 25) + (currentChat.title?.length > 25 ? '...' : '')) : 'Aether'}
          </span>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed md:relative inset-y-0 left-0 z-50 md:z-auto transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 ease-out`}>
        <Sidebar
          chats={chats}
          currentChatId={chatId}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          onDeleteChat={handleDeleteChat}
          onClose={() => setSidebarOpen(false)}
          onGoHome={() => navigate('/')}
        />
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col h-[100dvh] overflow-hidden pt-[52px] md:pt-0">
        {currentChat ? (
          <ChatArea
            chat={currentChat}
            loading={loading}
            sendingMessage={sendingMessage}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <WelcomeScreen onNewChat={handleNewChat} />
        )}
      </main>
    </div>
  );
}
