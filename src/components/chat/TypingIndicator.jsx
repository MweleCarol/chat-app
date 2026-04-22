// src/components/chat/TypingIndicator.jsx
import React from 'react';

export default function TypingIndicator({ typingUsers, contacts }) {
  if (!typingUsers || typingUsers.length === 0) return null;

  const user = contacts?.find(c => c.id === typingUsers[0]);

  return (
    <div className="flex items-end gap-2 pb-2.5 animate-bubble-in">
      {user && (
        <div
          className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[9px] font-bold font-display text-white flex-shrink-0"
          style={{ background: user.color || '#444' }}
          title={user.username}
        >
          {user.avatar}
        </div>
      )}
      <div className="bg-bg-3 border border-border rounded-[18px] rounded-bl-[5px] px-3.5 py-3 flex gap-1 items-center">
        <span className="w-1.5 h-1.5 rounded-full bg-text-1 animate-typing-1 block" />
        <span className="w-1.5 h-1.5 rounded-full bg-text-1 animate-typing-2 block" />
        <span className="w-1.5 h-1.5 rounded-full bg-text-1 animate-typing-3 block" />
      </div>
      {user && (
        <span className="text-[12px] text-text-2 self-end mb-1">{user.username} is typing…</span>
      )}
    </div>
  );
}