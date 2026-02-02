import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
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
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center" data-testid="chat-loading">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full" data-testid="chat-area">
      {/* Messages */}
      <ScrollArea className="flex-1 px-4">
        <div className="max-w-3xl mx-auto py-6 space-y-6">
          {chat?.messages?.map((message, index) => (
            <MessageBubble 
              key={message.id || index} 
              message={message}
              isLast={index === chat.messages.length - 1}
            />
          ))}
          
          {sendingMessage && (
            <div className="flex items-start gap-4" data-testid="typing-indicator">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-sm px-5 py-3">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full typing-dot"></span>
                  <span className="w-2 h-2 bg-indigo-400 rounded-full typing-dot"></span>
                  <span className="w-2 h-2 bg-indigo-400 rounded-full typing-dot"></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="border-t border-white/5 bg-black/60 backdrop-blur-xl p-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="relative flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Message Aether..."
                rows={1}
                className="w-full bg-white/5 border border-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 rounded-2xl px-4 py-3 pr-12 text-base resize-none placeholder:text-white/30 transition-all duration-300 outline-none"
                disabled={sendingMessage}
                data-testid="message-input"
              />
            </div>
            <Button
              type="submit"
              disabled={!input.trim() || sendingMessage}
              className="h-12 w-12 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 transition-all duration-300"
              data-testid="send-button"
            >
              {sendingMessage ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Send size={20} />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground/50 text-center mt-3">
            Aether can make mistakes. Consider checking important information.
          </p>
        </form>
      </div>
    </div>
  );
}
