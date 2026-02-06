import React, { useState, useRef, useEffect } from 'react';
import { Loader2, ArrowUp, Image, X } from 'lucide-react';
import { ScrollArea } from '../../components/ui/scroll-area';
import MessageBubble from './MessageBubble';
import { chatApi } from '../../lib/api';

export default function ChatArea({ chat, loading, sendingMessage, onSendMessage, showTyping = true, messageDensity = 'comfortable', fontSize = 'medium', theme = 'dark' }) {
  const [input, setInput] = useState('');
  const [showImageGen, setShowImageGen] = useState(false);
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
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
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
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

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim() || imageLoading) return;
    setImageLoading(true);
    setGeneratedImage(null);
    try {
      const result = await chatApi.generateImage(imagePrompt);
      setGeneratedImage(result.image_base64);
    } catch (error) {
      console.error('Image generation error:', error);
    } finally {
      setImageLoading(false);
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
    <div
      className={`flex-1 flex flex-col h-full ${theme === 'light' ? 'bg-white text-black' : 'bg-[#050505] text-white'}`}
      data-testid="chat-area"
    >
      {/* Messages */}
      <ScrollArea className="flex-1">
        <div className={`max-w-3xl mx-auto px-4 ${messageDensity === 'compact' ? 'py-3 space-y-2' : 'py-6 space-y-4'} ${fontSize === 'small' ? 'text-[13px]' : fontSize === 'large' ? 'text-[17px]' : 'text-[15px]'}`}>
          {chat?.messages?.map((message, index) => (
            <MessageBubble key={message.id || index} message={message} />
          ))}
          
          {sendingMessage && showTyping && (
            <div className="flex justify-start mb-4" data-testid="typing-indicator">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0">
                  <span className="text-white text-sm font-semibold">A</span>
                </div>
                <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-white/40 rounded-full typing-dot"></span>
                    <span className="w-2 h-2 bg-white/40 rounded-full typing-dot"></span>
                    <span className="w-2 h-2 bg-white/40 rounded-full typing-dot"></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className={`p-4 ${theme === 'light' ? 'bg-zinc-100' : 'bg-[#050505]'}`}>
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="relative bg-[#1a1a1a] border border-white/10 rounded-2xl">
            <div className="flex items-center gap-2 px-3 pt-3">
              <button
                type="button"
                onClick={() => setShowImageGen(true)}
                className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                title="Generate Image"
                data-testid="image-gen-button"
              >
                <Image size={20} />
              </button>
            </div>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Message Aether..."
              rows={1}
              className="w-full bg-transparent px-4 py-3 pr-14 text-[15px] resize-none placeholder:text-white/30 focus:outline-none max-h-[200px]"
              disabled={sendingMessage}
              data-testid="message-input"
            />
            <button
              type="submit"
              disabled={!input.trim() || sendingMessage}
              className="absolute right-3 bottom-3 p-1.5 rounded-lg bg-indigo-600 text-white disabled:bg-white/10 disabled:text-white/30 disabled:cursor-not-allowed transition-colors"
              data-testid="send-button"
            >
              {sendingMessage ? <Loader2 size={18} className="animate-spin" /> : <ArrowUp size={18} strokeWidth={2.5} />}
            </button>
          </div>
          <p className="text-[11px] text-white/30 text-center mt-2">Aether can make mistakes. Check important info.</p>
        </form>
      </div>

      {/* Image Generation Modal */}
      {showImageGen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => { setShowImageGen(false); setGeneratedImage(null); setImagePrompt(''); }}>
          <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading text-lg font-semibold text-white">Generate AI Image</h2>
              <button onClick={() => { setShowImageGen(false); setGeneratedImage(null); setImagePrompt(''); }}><X size={20} className="text-white/50" /></button>
            </div>
            <div className="space-y-4">
              <textarea
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="Describe the image you want to create..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 resize-none h-24"
                disabled={imageLoading}
              />
              <button
                onClick={handleGenerateImage}
                disabled={!imagePrompt.trim() || imageLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white font-medium transition-colors"
              >
                {imageLoading ? <><Loader2 size={20} className="animate-spin" />Generating...</> : <><Image size={20} />Generate Image</>}
              </button>
              {generatedImage && (
                <div className="mt-4">
                  <img src={`data:image/png;base64,${generatedImage}`} alt="Generated" className="w-full rounded-xl border border-white/10" />
                  <a href={`data:image/png;base64,${generatedImage}`} download="aether-image.png" className="block text-center text-indigo-400 text-sm mt-2 hover:underline">Download Image</a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
