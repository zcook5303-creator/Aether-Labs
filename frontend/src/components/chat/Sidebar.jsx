import React from 'react';
import { Plus, MessageSquare, Trash2, X, Home } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { ScrollArea } from '../../components/ui/scroll-area';

export default function Sidebar({ chats, currentChatId, onNewChat, onSelectChat, onDeleteChat, onClose, onGoHome }) {
  return (
    <aside className="w-[260px] h-full bg-[#0f0f0f] flex flex-col" data-testid="sidebar">
      {/* Header */}
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-1">
          <Button onClick={onNewChat} className="flex-1 justify-start gap-3 text-sm font-normal bg-indigo-600 hover:bg-indigo-700 h-10 rounded-lg" data-testid="new-chat-button">
            <Plus size={18} />New Chat
          </Button>
          <button onClick={onClose} className="md:hidden p-2 hover:bg-white/5 rounded-lg"><X size={20} /></button>
        </div>
        <Button onClick={onGoHome} variant="ghost" className="w-full justify-start gap-3 text-sm font-normal hover:bg-white/5 h-10 rounded-lg text-white/60" data-testid="home-button">
          <Home size={18} />Home
        </Button>
      </div>

      {/* Chat list */}
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-0.5 py-2">
          <p className="px-3 py-2 text-xs text-white/40 font-medium">Your Chats</p>
          {chats.length === 0 ? (
            <div className="px-3 py-6 text-center">
              <MessageSquare size={24} className="mx-auto mb-2 text-white/20" />
              <p className="text-xs text-white/40">No chats yet</p>
            </div>
          ) : (
            chats.map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                isActive={chat.id === currentChatId}
                onSelect={() => onSelectChat(chat.id)}
                onDelete={() => onDeleteChat(chat.id)}
              />
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-white/5">
        <p className="text-[10px] text-white/30 text-center">Founder: Zachary Cook</p>
      </div>
    </aside>
  );
}

function ChatItem({ chat, isActive, onSelect, onDelete }) {
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <div
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
      className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}`}
      data-testid={`chat-item-${chat.id}`}
    >
      <MessageSquare size={16} className="text-white/40 shrink-0" />
      <span className="flex-1 truncate text-sm text-white/80">{chat.title || 'New Chat'}</span>
      <button onClick={handleDelete} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded" data-testid={`delete-chat-${chat.id}`}>
        <Trash2 size={14} className="text-white/40 hover:text-red-400" />
      </button>
    </div>
  );
}
