// src/components/chat/MessageInput.jsx
import React, { useState, useRef, useCallback } from 'react';
import { EmojiIcon, AttachIcon, SendIcon } from '../ui/Icons';

const EMOJIS = ['😊','🎉','👍','🔥','✨','💡','🙌','👀','😄','🚀','❤️','😂','💯','🤔','🥳'];

export default function MessageInput({ onSend, placeholder = 'Type a message…' }) {
  const [text,       setText]      = useState('');
  const [showEmoji,  setShowEmoji] = useState(false);
  const textareaRef  = useRef(null);
  const canSend      = text.trim().length > 0;

  const handleSend = useCallback(() => {
    if (!canSend) return;
    onSend(text);
    setText('');
    setShowEmoji(false);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    textareaRef.current?.focus();
  }, [text, canSend, onSend]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleInput = (e) => {
    setText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  const insertEmoji = (emoji) => {
    setText(t => t + emoji);
    setShowEmoji(false);
    textareaRef.current?.focus();
  };

  return (
    <div className="px-5 py-3.5 border-t border-border glass-header flex-shrink-0 relative">

      {/* Emoji picker */}
      {showEmoji && (
        <div className="absolute bottom-[calc(100%+8px)] left-5 flex flex-wrap gap-1 p-2.5 bg-bg-2 border border-border-bright rounded-[10px] shadow-darker w-[240px] animate-fade-in z-10">
          {EMOJIS.map(e => (
            <button
              key={e}
              onClick={() => insertEmoji(e)}
              className="w-[34px] h-[34px] text-[18px] rounded-[7px] hover:bg-bg-3 hover:scale-125 transition-all flex items-center justify-center"
            >
              {e}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2.5">
        {/* Textarea wrapper */}
        <div className={`
          flex-1 flex items-end bg-bg-2 border rounded-[22px] transition-all duration-150
          ${canSend
            ? 'border-accent ring-2 ring-accent/20'
            : 'border-border focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20'
          }
        `}>
          <textarea
            ref={textareaRef}
            className="flex-1 bg-transparent text-text-0 text-[14px] px-4 py-3 resize-none min-h-[44px] max-h-[120px] overflow-y-auto leading-[1.55] outline-none placeholder:text-text-2"
            placeholder={placeholder}
            value={text}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            rows={1}
          />

          {/* Inner action buttons */}
          <div className="flex items-center gap-1 pr-2 pb-[7px]">
            <button
              onClick={() => setShowEmoji(s => !s)}
              title="Emoji"
              className={`
                w-[30px] h-[30px] rounded-[8px] flex items-center justify-center transition-all
                ${showEmoji ? 'text-accent bg-accent/20' : 'text-text-2 hover:text-text-0 hover:bg-bg-3'}
              `}
            >
              <EmojiIcon size={17} />
            </button>
            <button
              title="Attach file"
              className="w-[30px] h-[30px] rounded-[8px] flex items-center justify-center text-text-2 hover:text-text-0 hover:bg-bg-3 transition-all"
            >
              <AttachIcon size={17} />
            </button>
          </div>
        </div>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!canSend}
          title="Send (Enter)"
          className={`
            w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0
            transition-all duration-200
            ${canSend
              ? 'bg-accent text-white shadow-glow hover:bg-[#8b7dff] hover:shadow-glow-lg hover:scale-110 active:scale-95'
              : 'bg-bg-3 border border-border text-text-2 cursor-not-allowed opacity-40'
            }
          `}
        >
          <SendIcon size={17} />
        </button>
      </div>

      {/* Hint */}
      <p className="mt-1.5 text-center text-[11px] text-text-3">
        <kbd className="font-body text-[10px] bg-bg-3 border border-border px-1.5 py-0.5 rounded text-text-2">Enter</kbd>
        {' '}to send ·{' '}
        <kbd className="font-body text-[10px] bg-bg-3 border border-border px-1.5 py-0.5 rounded text-text-2">Shift+Enter</kbd>
        {' '}for new line
      </p>
    </div>
  );
}