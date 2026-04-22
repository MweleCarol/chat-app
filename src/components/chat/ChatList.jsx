// src/components/chat/ChatList.jsx
import React, { useState, useMemo } from 'react';
import { useAuth }       from '../../context/AuthContext';
import { useChat }       from '../../context/ChatContext';
import { Avatar, Badge, IconButton } from '../ui';
import { SearchIcon, EditIcon } from '../ui/Icons';
import { chatService } from '../../services/chatService';

/* ── Online contact ring ─────────────────────────────────── */
function OnlineContact({ user, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 flex-shrink-0 hover:scale-105 transition-transform"
      title={`Chat with ${user.username}`}
    >
      <Avatar user={user} size={44} ring />
      <span className="text-[11px] text-text-1 max-w-[44px] truncate text-center">
        {user.username.split(' ')[0]}
      </span>
    </button>
  );
}

/* ── Conversation item ───────────────────────────────────── */
function ConvItem({ conv, isActive, currentUserId, onClick }) {
  const other   = conv.type === 'direct' ? conv.participants?.find(p => p?.id !== currentUserId) : null;
  const name    = conv.name || other?.username || 'Unknown';
  const color   = other?.color || '#7c6dfa';
  const initials = conv.name ? conv.name[0] : (other?.avatar || '??');
  const preview = conv.lastMessage
    ? (conv.lastMessage.senderId === currentUserId ? 'You: ' : '') + conv.lastMessage.text
    : 'No messages yet';

  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-4 py-2.5 relative text-left
        transition-colors
        ${isActive ? 'bg-bg-3' : 'hover:bg-bg-2'}
      `}
    >
      {/* Active bar */}
      {isActive && <div className="absolute left-0 top-[15%] h-[70%] w-[3px] bg-accent rounded-r" />}

      {/* Avatar */}
      <div className="relative flex-shrink-0 w-[46px] h-[46px] rounded-full flex items-center justify-center font-bold font-display text-white text-[13px]"
           style={{ background: color }}>
        {initials}
        {other?.online && (
          <div className="absolute bottom-[1px] right-[1px] w-[11px] h-[11px] rounded-full bg-online border-2 border-bg-1" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-0.5">
          <span className="text-[14px] font-medium truncate">{name}</span>
          <span className="text-[11px] text-text-2 flex-shrink-0 ml-2">
            {chatService.fmtTime(conv.lastMessage?.time)}
          </span>
        </div>
        <div className="flex justify-between items-center gap-2">
          <span className="text-[12px] text-text-1 truncate">{preview}</span>
          <Badge count={conv.unread} />
        </div>
      </div>
    </button>
  );
}

/* ── ChatList ────────────────────────────────────────────── */
export default function ChatList() {
  const { user }                                                   = useAuth();
  const { convs, activeId, selectConv, startConv, contacts, sidebarOpen, closeSb } = useChat();
  const [search,    setSearch]   = useState('');
  const [showCp,    setShowCp]   = useState(false);

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
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[39] md:hidden"
          onClick={closeSb}
        />
      )}

      <aside className={`
        w-sidebar min-w-sidebar bg-bg-1 border-r border-border
        flex flex-col h-full flex-shrink-0 overflow-hidden z-40
        transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        fixed top-14 left-0 bottom-0 shadow-darker
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2.5">
          <h2 className="font-display text-[17px] font-bold">Messages</h2>
          <IconButton
            active={showCp}
            onClick={() => setShowCp(s => !s)}
            title="New conversation"
          >
            <EditIcon size={15} />
          </IconButton>
        </div>

        {/* Contact picker */}
        {showCp && (
          <div className="mx-2.5 mb-2 bg-bg-2 border border-border-bright rounded-[10px] p-2 animate-slide-left max-h-[200px] overflow-y-auto">
            <p className="text-[11px] font-semibold text-text-2 uppercase tracking-[0.07em] px-1.5 pb-2 pt-1">
              Start new chat
            </p>
            {contacts.map(c => (
              <button
                key={c.id}
                onClick={() => { startConv(c.id); setShowCp(false); }}
                className="flex items-center gap-2.5 w-full p-2 rounded-[8px] hover:bg-bg-3 transition-colors text-left"
              >
                <Avatar user={c} size={34} showDot />
                <div className="min-w-0">
                  <div className="text-[13px] font-medium">{c.username}</div>
                  <div className="text-[12px] text-text-2 truncate">{c.bio || (c.online ? 'Active now' : 'Offline')}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Search */}
        <div className="px-3 pb-2.5 relative">
          <span className="absolute left-[24px] top-1/2 -translate-y-[60%] text-text-2 flex items-center pointer-events-none">
            <SearchIcon size={14} />
          </span>
          <input
            className="w-full h-[38px] pl-9 pr-8 bg-bg-2 border border-border rounded-[7px] text-text-0 text-[13px] placeholder:text-text-2 transition-all focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            placeholder="Search conversations…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="absolute right-[20px] top-1/2 -translate-y-[60%] text-text-2 hover:text-text-0 text-[16px] leading-none"
              onClick={() => setSearch('')}
            >×</button>
          )}
        </div>

        {/* Online strip */}
        {online.length > 0 && !search && (
          <>
            <p className="px-4 pb-2 text-[11px] font-semibold text-text-2 uppercase tracking-[0.07em]">Active now</p>
            <div className="flex gap-2.5 px-3.5 pb-3.5 overflow-x-auto scrollbar-none flex-shrink-0">
              {online.map(u => (
                <OnlineContact key={u.id} user={u} onClick={() => startConv(u.id)} />
              ))}
            </div>
          </>
        )}

        {/* Section label */}
        <p className="px-4 pb-2 text-[11px] font-semibold text-text-2 uppercase tracking-[0.07em] flex-shrink-0">
          {search ? 'Results' : 'Recent'}
        </p>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto pb-2">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-text-2 text-[13px]">
              <SearchIcon size={28} />
              <p>No conversations found</p>
            </div>
          ) : (
            filtered.map(conv => (
              <ConvItem
                key={conv.id}
                conv={conv}
                isActive={conv.id === activeId}
                currentUserId={user?.id}
                onClick={() => selectConv(conv.id)}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border flex items-center gap-2.5 flex-shrink-0">
          <Avatar user={user} size={34} />
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-medium truncate">{user?.username}</div>
            <div className="flex items-center gap-1.5 text-[12px] text-online">
              <span className="w-[7px] h-[7px] rounded-full bg-online online-glow animate-pulse-dot inline-block" />
              Online
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}