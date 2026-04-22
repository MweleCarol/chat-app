// src/components/chat/ChatList.jsx
import React, { useState, useMemo } from 'react';
import { useAuth }       from '../../context/AuthContext';
import { useChat }       from '../../context/ChatContext';
import { Avatar, Badge, IconButton } from '../ui';
import { SearchIcon, EditIcon } from '../ui/Icons';
import { chatService } from '../../services/chatService';

function OnlineContact({ user, onClick }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1.5 flex-shrink-0 group" title={user.username}>
      <div className="transition-transform duration-200 group-hover:scale-105">
        <Avatar user={user} size={42} ring />
      </div>
      <span className="text-[10px] text-text-2 max-w-[42px] truncate group-hover:text-text-1 transition-colors">
        {user.username.split(' ')[0]}
      </span>
    </button>
  );
}

function ConvItem({ conv, isActive, currentUserId, onClick }) {
  const other    = conv.type === 'direct' ? conv.participants?.find(p => p?.id !== currentUserId) : null;
  const name     = conv.name || other?.username || 'Unknown';
  const color    = other?.color || '#8b5cf6';
  const initials = conv.name ? conv.name[0] : (other?.avatar || '??');
  const preview  = conv.lastMessage
    ? (conv.lastMessage.senderId === currentUserId ? 'You: ' : '') + conv.lastMessage.text
    : 'Start a conversation';
  const isUnread = conv.unread > 0;

  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 relative text-left rounded-xl mx-2 transition-all duration-150 group
        ${isActive
          ? 'bg-accent/10 border border-accent/15'
          : 'hover:bg-surface-1 border border-transparent'
        }`}
      style={{ width: 'calc(100% - 16px)' }}
    >
      {/* Active accent bar */}
      {isActive && <div className="absolute left-0 top-[18%] h-[64%] w-[3px] bg-grad-accent rounded-r" />}

      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-[44px] h-[44px] rounded-full flex items-center justify-center font-bold font-display text-white text-[13px] flex-shrink-0"
             style={{ background: color }}>
          {initials}
        </div>
        {other?.online && (
          <div className="absolute bottom-0 right-0 w-[10px] h-[10px] rounded-full bg-online online-glow" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-0.5">
          <span className={`text-[14px] truncate ${isUnread ? 'font-semibold text-text-0' : 'font-medium text-text-0'}`}>{name}</span>
          <span className={`text-[11px] flex-shrink-0 ml-2 ${isUnread ? 'text-accent-light' : 'text-text-2'}`}>
            {chatService.fmtTime(conv.lastMessage?.time)}
          </span>
        </div>
        <div className="flex justify-between items-center gap-2">
          <span className={`text-[12px] truncate ${isUnread ? 'text-text-1' : 'text-text-2'}`}>{preview}</span>
          <Badge count={conv.unread} />
        </div>
      </div>
    </button>
  );
}

export default function ChatList() {
  const { user } = useAuth();
  const {
    conversations: convs,
    activeConvId:  activeId,
    selectConversation: selectConv,
    startConversation:  startConv,
    contacts,
    sidebarOpen,
    closeSidebar: closeSb,
  } = useChat();

  const [search,  setSearch]  = useState('');
  const [showCp,  setShowCp]  = useState(false);

  const online   = useMemo(() => contacts.filter(c => c.online), [contacts]);
  const filtered = useMemo(() => {
    if (!search.trim()) return convs;
    const q = search.toLowerCase();
    return convs.filter(c => {
      const other = c.participants?.find(p => p?.id !== user?.id);
      const name  = c.name || other?.username || '';
      return name.toLowerCase().includes(q) || c.lastMessage?.text?.toLowerCase().includes(q);
    });
  }, [convs, search, user]);

  return (
    <>
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[39] md:hidden" onClick={closeSb} />}

      <aside className={`
        w-sidebar min-w-sidebar bg-bg-1/95 backdrop-blur-xl border-r border-border
        flex flex-col h-full flex-shrink-0 overflow-hidden z-40
        transition-transform duration-300 ease-in-out
        fixed top-14 left-0 bottom-0 md:relative md:top-0 md:translate-x-0
        ${sidebarOpen ? 'translate-x-0 shadow-card-lg' : '-translate-x-full md:translate-x-0'}
      `}>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-5 pb-3">
          <h2 className="font-display text-[17px] font-bold text-text-0">Messages</h2>
          <IconButton active={showCp} onClick={() => setShowCp(s => !s)} title="New chat">
            <EditIcon size={15} />
          </IconButton>
        </div>

        {/* Contact picker */}
        {showCp && (
          <div className="mx-3 mb-3 bg-bg-3 border border-border-bright rounded-2xl overflow-hidden animate-slide-right">
            <div className="px-3 pt-3 pb-1 text-[11px] font-semibold text-text-2 uppercase tracking-widest">Start new chat</div>
            <div className="max-h-[190px] overflow-y-auto pb-1.5">
              {contacts.map(c => (
                <button key={c.id} onClick={() => { startConv(c.id); setShowCp(false); }}
                  className="flex items-center gap-3 w-full px-3 py-2 hover:bg-surface-2 transition-colors text-left">
                  <Avatar user={c} size={32} showDot />
                  <div className="min-w-0">
                    <div className="text-[13px] font-medium truncate">{c.username}</div>
                    <div className={`text-[11px] ${c.online ? 'text-online' : 'text-text-2'}`}>{c.online ? '● Active now' : 'Offline'}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search */}
        <div className="px-3 pb-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-2 pointer-events-none flex items-center">
              <SearchIcon size={14} />
            </span>
            <input
              className="w-full h-9 pl-9 pr-8 bg-bg-3 border border-border rounded-xl text-text-0 text-[13px] placeholder:text-text-2 transition-all focus:outline-none focus:border-accent focus:bg-bg-2 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)]"
              placeholder="Search…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-2 hover:text-text-0 w-5 h-5 flex items-center justify-center rounded-full hover:bg-surface-2 transition-all text-[14px] leading-none"
                onClick={() => setSearch('')}>×</button>
            )}
          </div>
        </div>

        {/* Online strip */}
        {online.length > 0 && !search && (
          <div className="mb-2">
            <p className="px-4 pb-2 text-[10px] font-semibold text-text-2 uppercase tracking-widest">Active Now</p>
            <div className="flex gap-3 px-4 pb-2 overflow-x-auto scrollbar-none">
              {online.map(u => <OnlineContact key={u.id} user={u} onClick={() => startConv(u.id)} />)}
            </div>
          </div>
        )}

        {/* Conversations */}
        {!search && <p className="px-4 pb-2 text-[10px] font-semibold text-text-2 uppercase tracking-widest">Recent</p>}

        <div className="flex-1 overflow-y-auto space-y-0.5 pb-2">
          {filtered.length === 0
            ? <div className="flex flex-col items-center gap-2 py-10 text-text-2 text-[13px]"><SearchIcon size={24} /><p>No results</p></div>
            : filtered.map(conv => (
                <ConvItem key={conv.id} conv={conv} isActive={conv.id === activeId}
                  currentUserId={user?.id} onClick={() => selectConv(conv.id)} />
              ))
          }
        </div>

        {/* Footer */}
        <div className="mx-3 mb-3 mt-1 p-3 bg-surface-1 border border-border rounded-2xl flex items-center gap-3">
          <div className="relative">
            <Avatar user={user} size={34} />
            <div className="absolute bottom-0 right-0 w-[9px] h-[9px] rounded-full bg-online online-glow" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold truncate text-text-0">{user?.username}</div>
            <div className="text-[11px] text-online">● Active</div>
          </div>
        </div>
      </aside>
    </>
  );
}