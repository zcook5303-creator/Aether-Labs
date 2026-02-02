import React from 'react';
import { Plus, MessageSquare, Trash2, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { ScrollArea } from '../../components/ui/scroll-area';

export default function Sidebar({ chats, currentChatId, onNewChat, onSelectChat, onDeleteChat }) {
  return (
    <aside 
      className="w-[280px] h-full bg-black/50 backdrop-blur-xl border-r border-white/5 flex flex-col"
      data-testid="sidebar"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-heading text-lg font-semibold tracking-tight">Aether Labs</h1>
            <p className="text-xs text-muted-foreground">AI Assistant</p>
          </div>
        </div>
        
        <Button
          onClick={onNewChat}
          className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-all duration-200"
          data-testid="new-chat-button"
        >
          <Plus size={18} className="mr-2" />
          New Chat
        </Button>
      </div>

      {/* Chat list */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {chats.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <MessageSquare size={32} className="mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No conversations yet</p>
              <p className="text-xs text-muted-foreground/70 mt-1">Start a new chat to begin</p>
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
      <div className="p-4 border-t border-white/5">
        <p className="text-xs text-muted-foreground/50 text-center">
          Powered by GPT-5.2
        </p>
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
        w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl text-left cursor-pointer
        transition-all duration-200
        ${isActive 
          ? 'bg-white/10 border border-white/10' 
          : 'hover:bg-white/5 border border-transparent'
        }
      `}
      data-testid={`chat-item-${chat.id}`}
    >
      <MessageSquare size={16} className="text-muted-foreground shrink-0" />
      <span className="flex-1 truncate text-sm">
        {chat.title || 'New Chat'}
      </span>
      <button
        onClick={handleDelete}
        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/10 rounded-lg transition-all duration-200"
        data-testid={`delete-chat-${chat.id}`}
        aria-label="Delete chat"
      >
        <Trash2 size={14} className="text-muted-foreground hover:text-red-400" />
      </button>
    </div>
  );
}
