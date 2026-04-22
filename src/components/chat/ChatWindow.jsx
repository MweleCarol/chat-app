// src/components/chat/ChatWindow.jsx
import React, { useEffect, useRef, Fragment } from 'react';
import { useAuth }          from '../../context/AuthContext';
import { useChat }          from '../../context/ChatContext';
import { IconButton }       from '../ui';
import { BackIcon, PhoneIcon, VideoIcon, InfoIcon, ChatBubbleIcon } from '../ui/Icons';
import MessageBubble   from './MessageBubble';
import MessageInput    from './MessageInput';
import TypingIndicator from './TypingIndicator';

/* ── Date divider ────────────────────────────────────────── */
function DateDivider({ date }) {
  const d    = new Date(date);
  const now  = new Date();
  const diff = Math.floor((now - d) / 86400000);
  const label = diff === 0 ? 'Today' : diff === 1 ? 'Yesterday'
    : d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="flex items-center gap-2.5 py-2.5 my-1.5 text-text-2 text-[12px] font-medium">
      <div className="flex-1 h-px bg-border" />
      <span>{label}</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

/* ── Empty state ─────────────────────────────────────────── */
function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3.5 text-text-2 p-10 animate-fade-in">
      <div className="w-[72px] h-[72px] rounded-[22px] bg-bg-2 border border-border flex items-center justify-center">
        <ChatBubbleIcon size={30} />
      </div>
      <h2 className="font-display text-[22px] font-bold text-text-0">Your messages</h2>
      <p className="text-[14px] text-text-1 text-center max-w-[280px] leading-[1.7]">
        Select a conversation or start a new one to begin chatting.
      </p>
    </div>
  );
}

/* ── ChatWindow ──────────────────────────────────────────── */
export default function ChatWindow() {
  const { user }     = useAuth();
  const {
    activeConv, activeId, activeMsgs, activeTyping,
    contacts, sendMessage, toggleSb,
  }                  = useChat();

  const bottomRef    = useRef(null);

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMsgs, activeTyping]);

  if (!activeId || !activeConv) {
    return (
      <main className="flex-1 flex flex-col min-w-0 bg-bg-0 overflow-hidden">
        <EmptyState />
      </main>
    );
  }

  // Resolve other participant
  const other = activeConv.type === 'direct'
    ? activeConv.participants?.find(p => p?.id !== user?.id)
    : null;

  const displayName    = activeConv.name || other?.username || 'Unknown';
  const headerColor    = other?.color || '#7c6dfa';
  const headerInitials = activeConv.name ? activeConv.name[0] : (other?.avatar || '??');
  const isOnline       = other?.online ?? false;

  // Helper: resolve a user object by ID for bubbles
  const resolveUser = (senderId) => {
    if (senderId === user?.id) return user;
    return contacts?.find(c => c.id === senderId) || { id: senderId, avatar: '?', color: '#888' };
  };

  // Group into runs: annotate first / last in each sender run + date breaks
  const grouped = activeMsgs.map((msg, i) => {
    const prev      = activeMsgs[i - 1];
    const next      = activeMsgs[i + 1];
    const isFirst   = !prev || prev.senderId !== msg.senderId;
    const isLast    = !next || next.senderId !== msg.senderId;
    const showDate  = !prev || new Date(prev.time).toDateString() !== new Date(msg.time).toDateString();
    return { msg, isFirst, isLast, showDate };
  });

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-bg-0 overflow-hidden">

      {/* ── Header ──────────────────────────────────────────── */}
      <header className="flex items-center gap-3 px-5 py-3.5 border-b border-border glass-header flex-shrink-0 z-10">
        {/* Back (mobile) */}
        <IconButton className="md:hidden" onClick={toggleSb} title="Back">
          <BackIcon size={16} />
        </IconButton>

        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div
            className="w-[42px] h-[42px] rounded-full flex items-center justify-center text-[14px] font-bold font-display text-white"
            style={{ background: headerColor }}
          >
            {headerInitials}
          </div>
          {isOnline && (
            <div className="absolute bottom-[1px] right-[1px] w-[11px] h-[11px] rounded-full bg-online border-2 border-bg-1" />
          )}
        </div>

        {/* Name + status */}
        <div className="flex-1 min-w-0">
          <div className="font-display text-[16px] font-semibold truncate">{displayName}</div>
          <div className="flex items-center gap-1.5 text-[12px] text-text-1 mt-0.5">
            {isOnline ? (
              <>
                <span className="w-[7px] h-[7px] rounded-full bg-online animate-pulse-dot online-glow inline-block" />
                Active now
              </>
            ) : 'Offline'}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <IconButton title="Voice call"><PhoneIcon size={15} /></IconButton>
          <IconButton title="Video call"><VideoIcon size={15} /></IconButton>
          <IconButton title="Info"><InfoIcon size={15} /></IconButton>
        </div>
      </header>

      {/* ── Message list ────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-2 flex flex-col gap-0.5">
        {activeMsgs.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-text-2 text-[14px]">
            No messages yet. Say hello! 👋
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
      <MessageInput
        onSend={sendMessage}
        placeholder={`Message ${displayName}…`}
      />
    </main>
  );
}