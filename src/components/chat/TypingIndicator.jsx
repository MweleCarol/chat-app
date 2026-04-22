// src/components/chat/TypingIndicator.jsx
import React from 'react';

export default function TypingIndicator({ typingUsers, contacts }) {
  if (!typingUsers || typingUsers.length === 0) return null;
  const user = contacts?.find(c => c.id === typingUsers[0]);

  return (
    <div className="flex items-end gap-2 pb-3 animate-fade-up">
      {user && (
        <div className="w-[28px] h-[28px] rounded-full flex items-center justify-center text-[10px] font-bold font-display text-white flex-shrink-0"
          style={{ background: user.color || '#8b5cf6' }} title={user.username}>
          {user.avatar}
        </div>
      )}
      <div className="bg-bg-3 border border-border-bright rounded-[18px] rounded-bl-[6px] px-4 py-3 flex gap-1.5 items-center">
        <span className="w-[5px] h-[5px] rounded-full bg-text-1 animate-typing-1 block" />
        <span className="w-[5px] h-[5px] rounded-full bg-text-1 animate-typing-2 block" />
        <span className="w-[5px] h-[5px] rounded-full bg-text-1 animate-typing-3 block" />
      </div>
      {user && <span className="text-[12px] text-text-2 self-end mb-1.5 italic">{user.username} is typing…</span>}
    </div>
  );
}