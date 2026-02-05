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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [messageDensity, setMessageDensity] = useState('comfortable');
  const [fontSize, setFontSize] = useState('medium');
  const [showTyping, setShowTyping] = useState(true);

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    // Load settings from localStorage
    try {
      const storedTheme = localStorage.getItem('aether-theme');
      const storedDensity = localStorage.getItem('aether-message-density');
      const storedFontSize = localStorage.getItem('aether-font-size');
      const storedShowTyping = localStorage.getItem('aether-show-typing');

      if (storedTheme === 'light' || storedTheme === 'dark') {
        setTheme(storedTheme);
      }
      if (storedDensity === 'comfortable' || storedDensity === 'compact') {
        setMessageDensity(storedDensity);
      }
      if (storedFontSize === 'small' || storedFontSize === 'medium' || storedFontSize === 'large') {
        setFontSize(storedFontSize);
      }
      if (storedShowTyping === 'true' || storedShowTyping === 'false') {
        setShowTyping(storedShowTyping === 'true');
      }
    } catch (e) {
      console.error('Error loading settings from localStorage', e);
    }
  }, []);

  useEffect(() => {
    // Apply theme class to documentElement for Tailwind dark mode compatibility
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

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
      {settingsOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setSettingsOpen(false)}>
          <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl max-w-md w-full p-6 text-white" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-heading text-lg font-semibold">Settings</h2>
              <button onClick={() => setSettingsOpen(false)} className="text-white/60 hover:text-white">✕</button>
            </div>

            <div className="space-y-5 text-sm">
              {/* Theme */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">Appearance</p>
                  <p className="text-xs text-white/50">Switch between dark and light mode.</p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <button
                    onClick={() => {
                      setTheme('dark');
                      localStorage.setItem('aether-theme', 'dark');
                    }}
                    className={`px-3 py-1 rounded-full border text-xs ${theme === 'dark' ? 'bg-white text-black border-white' : 'border-white/30 text-white/70'}`}
                  >
                    Dark
                  </button>
                  <button
                    onClick={() => {
                      setTheme('light');
                      localStorage.setItem('aether-theme', 'light');
                    }}
                    className={`px-3 py-1 rounded-full border text-xs ${theme === 'light' ? 'bg-white text-black border-white' : 'border-white/30 text-white/70'}`}
                  >
                    Light
                  </button>
                </div>
              </div>

              {/* Message Density */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">Message Density</p>
                  <p className="text-xs text-white/50">Choose how spaced out messages feel.</p>
                </div>
                <select
                  value={messageDensity}
                  onChange={(e) => {
                    setMessageDensity(e.target.value);
                    localStorage.setItem('aether-message-density', e.target.value);
                  }}
                  className="bg-[#151515] border border-white/20 rounded-md px-2 py-1 text-xs"
                >
                  <option value="comfortable">Comfortable</option>
                  <option value="compact">Compact</option>
                </select>
              </div>

              {/* Font Size */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">Font Size</p>
                  <p className="text-xs text-white/50">Adjust chat text size.</p>
                </div>
                <select
                  value={fontSize}
                  onChange={(e) => {
                    setFontSize(e.target.value);
                    localStorage.setItem('aether-font-size', e.target.value);
                  }}
                  className="bg-[#151515] border border-white/20 rounded-md px-2 py-1 text-xs"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>

              {/* Typing Indicator */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">Typing Dots</p>
                  <p className="text-xs text-white/50">Show or hide Aether's typing animation.</p>
                </div>
                <button
                  onClick={() => {
                    const next = !showTyping;
                    setShowTyping(next);
                    localStorage.setItem('aether-show-typing', String(next));
                  }}
                  className={`px-3 py-1 rounded-full border text-xs ${showTyping ? 'bg-white text-black border-white' : 'border-white/30 text-white/70'}`}
                >
                  {showTyping ? 'On' : 'Off'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
          onOpenSettings={() => { setSettingsOpen(true); setSidebarOpen(false); }}
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
            showTyping={showTyping}
            messageDensity={messageDensity}
            fontSize={fontSize}
            theme={theme}
          />
        ) : (
          <WelcomeScreen onNewChat={handleNewChat} />
        )}
      </main>
    </div>
  );
}
