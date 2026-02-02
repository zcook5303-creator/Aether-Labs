import React, { useState, useRef, useEffect } from 'react';
import { Loader2, ArrowUp } from 'lucide-react';
import { ScrollArea } from '../../components/ui/scroll-area';
import MessageBubble from './MessageBubble';

export default function ChatArea({ chat, loading, sendingMessage, onSendMessage }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || sendingMessage) return;
    
    onSendMessage(input.trim());
    setInput('');
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center" data-testid="chat-loading">
        <Loader2 className="w-6 h-6 animate-spin text-white/40" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#050505]" data-testid="chat-area">
      {/* Messages - ChatGPT style full width */}
      <ScrollArea className="flex-1">
        <div className="pb-4">
          {chat?.messages?.map((message, index) => (
            <MessageBubble 
              key={message.id || index} 
              message={message}
            />
          ))}
          
          {sendingMessage && (
            <div className="py-6 bg-[#0a0a0a]" data-testid="typing-indicator">
              <div className="max-w-3xl mx-auto px-4 md:px-6">
                <div className="flex gap-4 md:gap-6">
                  <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0">
                    <span className="text-white text-sm font-semibold">A</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white mb-1.5">Aether</p>
                    <div className="flex gap-1.5 pt-1">
                      <span className="w-2 h-2 bg-white/40 rounded-full typing-dot"></span>
                      <span className="w-2 h-2 bg-white/40 rounded-full typing-dot"></span>
                      <span className="w-2 h-2 bg-white/40 rounded-full typing-dot"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input area - ChatGPT style */}
      <div className="p-4 bg-[#050505]">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="relative bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-lg">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Message Aether..."
              rows={1}
              className="w-full bg-transparent px-4 py-3.5 pr-14 text-[15px] resize-none placeholder:text-white/30 focus:outline-none max-h-[200px]"
              disabled={sendingMessage}
              data-testid="message-input"
            />
            <button
              type="submit"
              disabled={!input.trim() || sendingMessage}
              className="absolute right-3 bottom-3 p-1.5 rounded-lg bg-white text-black disabled:bg-white/20 disabled:text-white/40 disabled:cursor-not-allowed transition-colors"
              data-testid="send-button"
            >
              {sendingMessage ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <ArrowUp size={18} strokeWidth={2.5} />
              )}
            </button>
          </div>
          <p className="text-[11px] text-white/30 text-center mt-2">
            Aether can make mistakes. Consider checking important information.
          </p>
        </form>
      </div>
    </div>
  );
}
