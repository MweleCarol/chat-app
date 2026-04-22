// src/components/chat/MessageBubble.jsx
import React from 'react';
import { chatService, MESSAGE_STATUS } from '../../services/chatService';
import { CheckIcon, CheckCheckIcon }   from '../ui/Icons';

function StatusTick({ status }) {
  if (status === MESSAGE_STATUS.SENDING) return (
    <span className="text-text-2">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="8" opacity="0.4" />
      </svg>
    </span>
  );
  if (status === MESSAGE_STATUS.SENT) return (
    <span className="text-text-2"><CheckIcon size={13} /></span>
  );
  if (status === MESSAGE_STATUS.DELIVERED) return (
    <span className="text-text-2"><CheckCheckIcon size={15} /></span>
  );
  if (status === MESSAGE_STATUS.READ) return (
    <span className="text-accent"><CheckCheckIcon size={15} /></span>
  );
  return null;
}

export default function MessageBubble({ message, isMine, isFirst, isLast, senderUser }) {
  return (
    <div className={`flex items-end gap-2 mb-0.5 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar slot */}
      <div className={`w-[26px] h-[26px] flex-shrink-0 ${(!isMine && isLast) ? 'visible' : 'invisible'}`}>
        {!isMine && isLast && (
          <div
            className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[9px] font-bold font-display text-white"
            style={{ background: senderUser?.color || '#444' }}
          >
            {senderUser?.avatar || '?'}
          </div>
        )}
      </div>

      {/* Bubble + meta */}
      <div className={`flex flex-col max-w-[68%] ${isMine ? 'items-end' : 'items-start'}`}>
        {!isMine && isFirst && senderUser && (
          <span className="text-[11px] text-text-2 mb-1 pl-0.5">{senderUser.username}</span>
        )}

        <div className={`
          px-3.5 py-2.5 text-[14px] leading-[1.55] break-words animate-bubble-in
          ${isMine
            ? 'bubble-mine text-white rounded-[18px] rounded-br-[5px]'
            : 'bg-bg-3 text-text-0 border border-border rounded-[18px] rounded-bl-[5px]'
          }
        `}>
          {message.text}
        </div>

        {isLast && (
          <div className={`flex items-center gap-1 mt-1 ${isMine ? 'flex-row-reverse' : ''}`}>
            <span className="text-[11px] text-text-2">{chatService.fmtMsgTime(message.time)}</span>
            {isMine && <StatusTick status={message.status} />}
          </div>
        )}
      </div>
    </div>
  );
}