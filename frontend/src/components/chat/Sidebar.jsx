import React from 'react';
import { Plus, MessageSquare, Trash2, Sparkles, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { ScrollArea } from '../../components/ui/scroll-area';

export default function Sidebar({ chats, currentChatId, onNewChat, onSelectChat, onDeleteChat, onClose }) {
  return (
    <aside 
      className="w-[280px] h-full bg-[#0A0A0A] flex flex-col"
      data-testid="sidebar"
    >
      {/* Header */}
      <div className="p-3 flex items-center justify-between">
        <Button
          onClick={onNewChat}
          variant="ghost"
          className="flex-1 justify-start gap-2 text-sm font-normal hover:bg-white/5 h-10"
          data-testid="new-chat-button"
        >
          <Plus size={18} />
          New chat
        </Button>
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="md:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </div>

      {/* Chat list */}
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-0.5">
          {chats.length === 0 ? (
            <div className="px-3 py-8 text-center">
              <MessageSquare size={28} className="mx-auto mb-3 text-white/20" />
              <p className="text-sm text-white/40">No conversations yet</p>
            </div>
          ) : (
            <>
              <p className="px-3 py-2 text-xs text-white/40 font-medium">Recent</p>
              {chats.map((chat) => (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  isActive={chat.id === currentChatId}
                  onSelect={() => onSelectChat(chat.id)}
                  onDelete={() => onDeleteChat(chat.id)}
                />
              ))}
            </>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-white/5">
        <div className="flex items-center gap-2 px-2 py-2 text-xs text-white/30">
          <Sparkles size={14} />
          <span>Powered by GPT-5.2</span>
        </div>
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
      className={`
        group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer
        transition-colors duration-150
        ${isActive 
          ? 'bg-white/10' 
          : 'hover:bg-white/5'
        }
      `}
      data-testid={`chat-item-${chat.id}`}
    >
      <MessageSquare size={16} className="text-white/40 shrink-0" />
      <span className="flex-1 truncate text-sm text-white/80">
        {chat.title || 'New Chat'}
      </span>
      <button
        onClick={handleDelete}
        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition-all"
        data-testid={`delete-chat-${chat.id}`}
        aria-label="Delete chat"
      >
        <Trash2 size={14} className="text-white/40 hover:text-red-400" />
      </button>
    </div>
  );
}
