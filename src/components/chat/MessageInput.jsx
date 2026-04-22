// src/components/chat/MessageInput.jsx
import React, { useState, useRef, useCallback } from 'react';
import { EmojiIcon, AttachIcon, SendIcon } from '../ui/Icons';

const EMOJIS = ['😊','🎉','👍','🔥','✨','💡','🙌','👀','😄','🚀','❤️','😂','💯','🤔','🥳','⚡','🎯','💎'];

export default function MessageInput({ onSend, placeholder = 'Type a message…' }) {
  const [text,      setText]     = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const taRef   = useRef(null);
  const canSend = text.trim().length > 0;

  const handleSend = useCallback(() => {
    if (!canSend) return;
    onSend(text); setText(''); setShowEmoji(false);
    if (taRef.current) taRef.current.style.height = 'auto';
    taRef.current?.focus();
  }, [text, canSend, onSend]);

  const onKey = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };

  const onInput = e => {
    setText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  return (
    <div className="px-4 py-3 glass border-t border-border flex-shrink-0 relative">
      {/* Emoji picker */}
      {showEmoji && (
        <div className="absolute bottom-[calc(100%+8px)] left-4 bg-bg-3 border border-border-bright rounded-2xl p-3 shadow-card-lg animate-fade-up z-20 card-top-shine">
          <div className="flex flex-wrap gap-1 w-[228px]">
            {EMOJIS.map(e => (
              <button key={e} onClick={() => { setText(t => t + e); setShowEmoji(false); taRef.current?.focus(); }}
                className="w-[34px] h-[34px] text-[18px] rounded-xl hover:bg-surface-2 hover:scale-125 transition-all duration-150 flex items-center justify-center">
                {e}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-end gap-2.5">
        {/* Input box */}
        <div className={`flex-1 flex items-end rounded-2xl border transition-all duration-200 bg-bg-2
          ${canSend
            ? 'border-accent/40 shadow-[0_0_0_3px_rgba(139,92,246,0.10)]'
            : 'border-border hover:border-border-bright focus-within:border-accent/40 focus-within:shadow-[0_0_0_3px_rgba(139,92,246,0.10)]'
          }`}>

          <textarea ref={taRef}
            className="flex-1 bg-transparent text-text-0 text-[14px] px-4 py-3 resize-none min-h-[46px] max-h-[120px] overflow-y-auto leading-[1.6] outline-none placeholder:text-text-2"
            placeholder={placeholder}
            value={text} onChange={onInput} onKeyDown={onKey} rows={1}
          />

          {/* Action buttons */}
          <div className="flex items-center gap-0.5 pr-2 pb-2">
            <button onClick={() => setShowEmoji(s => !s)}
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${showEmoji ? 'bg-accent/15 text-accent-light' : 'text-text-2 hover:text-text-0 hover:bg-surface-2'}`}>
              <EmojiIcon size={17} />
            </button>
            <button className="w-8 h-8 rounded-xl flex items-center justify-center text-text-2 hover:text-text-0 hover:bg-surface-2 transition-all">
              <AttachIcon size={17} />
            </button>
          </div>
        </div>

        {/* Send button */}
        <button onClick={handleSend} disabled={!canSend}
          className={`w-[46px] h-[46px] rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-200
            ${canSend
              ? 'bg-grad-accent text-white shadow-accent hover:brightness-110 hover:shadow-accent-lg active:scale-95'
              : 'bg-bg-3 border border-border text-text-2 cursor-not-allowed opacity-50'
            }`}>
          <SendIcon size={16} />
        </button>
      </div>

      <p className="mt-2 text-center text-[11px] text-text-3 select-none">
        <span className="inline-flex items-center gap-0.5 bg-surface-1 border border-border px-1.5 py-0.5 rounded-md text-[10px] text-text-2 font-mono">↵</span>
        {' '}send &nbsp;·&nbsp;{' '}
        <span className="inline-flex items-center gap-0.5 bg-surface-1 border border-border px-1.5 py-0.5 rounded-md text-[10px] text-text-2 font-mono">⇧↵</span>
        {' '}new line
      </p>
    </div>
  );
}