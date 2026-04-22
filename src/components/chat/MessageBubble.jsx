// src/components/chat/MessageBubble.jsx
import React from 'react';
import { chatService, MESSAGE_STATUS } from '../../services/chatService';
import { CheckIcon, CheckCheckIcon } from '../ui/Icons';

function StatusTick({ status }) {
  if (status === MESSAGE_STATUS.SENDING) return (
    <span className="text-white/40 flex items-center">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="9" strokeDasharray="32" strokeDashoffset="8" opacity="0.5" />
      </svg>
    </span>
  );
  if (status === MESSAGE_STATUS.SENT)      return <span className="text-white/50"><CheckIcon size={12} /></span>;
  if (status === MESSAGE_STATUS.DELIVERED) return <span className="text-white/60"><CheckCheckIcon size={14} /></span>;
  if (status === MESSAGE_STATUS.READ)      return <span className="text-cyan-300/80"><CheckCheckIcon size={14} /></span>;
  return null;
}

export default function MessageBubble({ message, isMine, isFirst, isLast, senderUser }) {
  return (
    <div className={`flex items-end gap-2 ${isMine ? 'flex-row-reverse' : 'flex-row'} mb-0.5`}>
      {/* Avatar slot — always reserve space for alignment */}
      <div className={`w-[28px] flex-shrink-0 ${(!isMine && isLast) ? 'visible' : 'invisible'}`}>
        {!isMine && isLast && (
          <div
            className="w-[28px] h-[28px] rounded-full flex items-center justify-center text-[10px] font-bold font-display text-white"
            style={{ background: senderUser?.color || '#8b5cf6' }}
          >
            {senderUser?.avatar || '?'}
          </div>
        )}
      </div>

      {/* Bubble + timestamp */}
      <div className={`flex flex-col gap-1 max-w-[68%] ${isMine ? 'items-end' : 'items-start'}`}>
        {!isMine && isFirst && senderUser && (
          <span className="text-[11px] text-text-2 pl-1 font-medium">{senderUser.username}</span>
        )}

        <div className={`
          px-4 py-2.5 text-[14px] leading-[1.6] break-words
          animate-bubble-in
          ${isMine
            ? `bubble-mine text-white
               ${isFirst  ? 'rounded-[18px] rounded-br-[6px]'  : 'rounded-[18px] rounded-br-[6px]'}
               ${!isFirst ? 'rounded-tr-[6px]' : ''}
              `
            : `bg-bg-3 border border-border-bright text-text-0
               ${isFirst  ? 'rounded-[18px] rounded-bl-[6px]'  : 'rounded-[18px] rounded-bl-[6px]'}
               ${!isFirst ? 'rounded-tl-[6px]' : ''}
              `
          }
        `}>
          {message.text}
        </div>

        {isLast && (
          <div className={`flex items-center gap-1.5 px-1 ${isMine ? 'flex-row' : ''}`}>
            <span className="text-[11px] text-text-2">{chatService.fmtMsgTime(message.time)}</span>
            {isMine && <StatusTick status={message.status} />}
          </div>
        )}
      </div>
    </div>
  );
}