// src/components/chat/ChatWindow.jsx
import React, { useEffect, useRef, Fragment } from 'react';
import { useAuth }         from '../../context/AuthContext';
import { useChat }         from '../../context/ChatContext';
import { IconButton }      from '../ui';
import { BackIcon, PhoneIcon, VideoIcon, InfoIcon, ChatBubbleIcon } from '../ui/Icons';
import MessageBubble   from './MessageBubble';
import MessageInput    from './MessageInput';
import TypingIndicator from './TypingIndicator';

function DateDivider({ date }) {
  const d    = new Date(date);
  const now  = new Date();
  const diff = Math.floor((now - d) / 86400000);
  const label = diff === 0 ? 'Today' : diff === 1 ? 'Yesterday'
    : d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <div className="flex items-center gap-3 py-3 my-1">
      <div className="flex-1 h-px bg-border" />
      <span className="text-[11px] font-medium text-text-2 bg-bg-0 px-3 py-1 rounded-full border border-border">{label}</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 p-10 animate-fade-up">
      {/* Decorative icon */}
      <div className="relative">
        <div className="w-20 h-20 rounded-3xl bg-accent/8 border border-accent/15 flex items-center justify-center">
          <ChatBubbleIcon size={32} className="text-accent-light opacity-60" />
        </div>
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-grad-accent flex items-center justify-center text-white text-[10px] font-bold shadow-accent">✦</div>
      </div>
      <div className="text-center">
        <h2 className="font-display text-[20px] font-bold text-text-0 mb-1.5">No chat selected</h2>
        <p className="text-[14px] text-text-1 leading-relaxed max-w-[220px]">
          Pick a conversation from the sidebar to start messaging
        </p>
      </div>
      <div className="flex items-center gap-2 text-[12px] text-text-2 mt-2">
        <div className="w-1.5 h-1.5 rounded-full bg-online animate-pulse-dot" />
        <span>4 contacts online</span>
      </div>
    </div>
  );
}

export default function ChatWindow() {
  const { user }  = useAuth();
  const {
    activeConv,
    activeConvId:   activeId,
    activeMessages: activeMsgs,
    activeTyping,
    contacts,
    sendMessage,
    toggleSidebar: toggleSb,
  }               = useChat();

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMsgs, activeTyping]);

  if (!activeId || !activeConv) {
    return (
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <EmptyState />
      </main>
    );
  }

  const other       = activeConv.type === 'direct' ? activeConv.participants?.find(p => p?.id !== user?.id) : null;
  const displayName = activeConv.name || other?.username || 'Unknown';
  const color       = other?.color || '#8b5cf6';
  const initials    = activeConv.name ? activeConv.name[0] : (other?.avatar || '??');
  const isOnline    = other?.online ?? false;

  const resolveUser = id => {
    if (id === user?.id) return user;
    return contacts?.find(c => c.id === id) || { id, avatar: '?', color: '#8b5cf6' };
  };

  const grouped = activeMsgs.map((msg, i) => {
    const prev     = activeMsgs[i - 1];
    const next     = activeMsgs[i + 1];
    const isFirst  = !prev || prev.senderId !== msg.senderId;
    const isLast   = !next || next.senderId !== msg.senderId;
    const showDate = !prev || new Date(prev.time).toDateString() !== new Date(msg.time).toDateString();
    return { msg, isFirst, isLast, showDate };
  });

  return (
    <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
      {/* ── Chat Header ─────────────────────────────────────── */}
      <header className="flex items-center gap-3 px-5 py-3 glass border-b border-border flex-shrink-0 z-10">
        <IconButton className="md:hidden" onClick={toggleSb} title="Back">
          <BackIcon size={16} />
        </IconButton>

        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold font-display text-white"
               style={{ background: color }}>
            {initials}
          </div>
          {isOnline && <div className="absolute bottom-0 right-0 w-[10px] h-[10px] rounded-full bg-online online-glow" />}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="font-display font-semibold text-[15px] text-text-0 truncate leading-tight">{displayName}</div>
          <div className="text-[12px] mt-0.5 flex items-center gap-1.5">
            {isOnline
              ? <><span className="w-1.5 h-1.5 rounded-full bg-online animate-pulse-dot inline-block" /><span className="text-online">Active now</span></>
              : <span className="text-text-2">Offline</span>
            }
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <IconButton title="Voice call"><PhoneIcon size={15} /></IconButton>
          <IconButton title="Video call"><VideoIcon size={15} /></IconButton>
          <IconButton title="Details"><InfoIcon size={15} /></IconButton>
        </div>
      </header>

      {/* ── Messages ────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-3 flex flex-col gap-0.5">
        {activeMsgs.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-text-2 py-16">
            <div className="w-12 h-12 rounded-2xl bg-surface-1 border border-border flex items-center justify-center">
              <span className="text-2xl">👋</span>
            </div>
            <p className="text-[14px] text-text-1 font-medium">Say hello to {displayName}!</p>
          </div>
        )}

        {grouped.map(({ msg, isFirst, isLast, showDate }) => (
          <Fragment key={msg.id}>
            {showDate && <DateDivider date={msg.time} />}
            <MessageBubble
              message={msg}
              isMine={msg.senderId === user?.id}
              isFirst={isFirst}
              isLast={isLast}
              senderUser={resolveUser(msg.senderId)}
            />
          </Fragment>
        ))}

        <TypingIndicator typingUsers={activeTyping} contacts={contacts} />
        <div ref={bottomRef} />
      </div>

      {/* ── Input ───────────────────────────────────────────── */}
      <MessageInput onSend={sendMessage} placeholder={`Message ${displayName}…`} />
    </main>
  );
}