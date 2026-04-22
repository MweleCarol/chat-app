// src/components/ui/index.jsx — Reusable Tailwind UI primitives

import React, { useEffect } from 'react';

/* ── Avatar ──────────────────────────────────────────────── */
export function Avatar({ user, size = 44, ring = false, showDot = false }) {
  const initials = user?.avatar || user?.username?.slice(0, 2).toUpperCase() || '??';
  const color    = user?.color  || '#7c6dfa';
  const fontSize = Math.round(size * 0.29);

  if (ring) {
    return (
      <div className="relative flex-shrink-0 rounded-full" style={{ width: size, height: size }}>
        {/* Spinning gradient ring */}
        <div
          className="absolute inset-[-2px] rounded-full ring-gradient animate-rotate-ring"
          style={{ zIndex: 0 }}
        />
        {/* Avatar inner */}
        <div
          className="absolute inset-[2px] rounded-full flex items-center justify-center font-bold font-display text-white"
          style={{ background: color, fontSize, zIndex: 1 }}
        >
          {initials}
        </div>
        {showDot && user?.online && (
          <div className="absolute bottom-[1px] right-[1px] w-[11px] h-[11px] rounded-full bg-online border-2 border-bg-1 z-20" />
        )}
      </div>
    );
  }

  return (
    <div
      className="relative flex-shrink-0 rounded-full flex items-center justify-center font-bold font-display text-white"
      style={{ width: size, height: size, background: color, fontSize }}
    >
      {initials}
      {showDot && user?.online && (
        <div className="absolute bottom-[1px] right-[1px] w-[11px] h-[11px] rounded-full bg-online border-2 border-bg-1" />
      )}
    </div>
  );
}

/* ── Button ──────────────────────────────────────────────── */
const BTN_BASE = 'inline-flex items-center justify-center gap-2 font-body font-medium rounded-[10px] transition-all duration-150 disabled:opacity-45 disabled:cursor-not-allowed active:scale-[0.97]';

const BTN_VARIANTS = {
  primary:   'bg-accent text-white shadow-glow hover:bg-[#8b7dff] hover:shadow-glow-lg',
  secondary: 'bg-bg-3 text-text-0 border border-border hover:bg-bg-4 hover:border-border-bright',
  ghost:     'bg-transparent text-text-1 hover:bg-bg-3 hover:text-text-0',
  danger:    'bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25',
};

const BTN_SIZES = {
  sm: 'h-[34px] px-[14px] text-[13px]',
  md: 'h-[42px] px-[20px] text-[14px]',
  lg: 'h-[50px] px-[28px] text-[15px] w-full',
};

export function Button({ children, variant = 'primary', size = 'md', isLoading, disabled, className = '', ...props }) {
  return (
    <button
      className={`${BTN_BASE} ${BTN_VARIANTS[variant]} ${BTN_SIZES[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading
        ? <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin-slow inline-block" />
        : children
      }
    </button>
  );
}

/* ── Input ───────────────────────────────────────────────── */
export function Input({ label, error, icon, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[11px] font-semibold text-text-1 uppercase tracking-[0.06em]">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-[13px] top-1/2 -translate-y-1/2 text-text-2 flex items-center pointer-events-none">
            {icon}
          </span>
        )}
        <input
          className={`
            w-full h-[44px] bg-bg-2 border rounded-[10px] text-text-0 text-[14px]
            placeholder:text-text-2 transition-all duration-150 outline-none
            focus:border-accent focus:ring-2 focus:ring-accent/20
            ${icon ? 'pl-10 pr-3' : 'px-3'}
            ${error ? 'border-red-400' : 'border-border'}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <span className="text-[12px] text-red-400">{error}</span>}
    </div>
  );
}

/* ── IconButton ──────────────────────────────────────────── */
export function IconButton({ children, title, active, className = '', ...props }) {
  return (
    <button
      title={title}
      className={`
        w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0
        border transition-all duration-150 cursor-pointer
        ${active
          ? 'bg-accent/20 text-accent border-accent/35'
          : 'bg-bg-3 text-text-1 border-border hover:bg-bg-4 hover:text-text-0 hover:border-border-bright'
        }
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

/* ── Badge ───────────────────────────────────────────────── */
export function Badge({ count }) {
  if (!count || count <= 0) return null;
  return (
    <span className="bg-accent text-white rounded-full min-w-[18px] h-[18px] text-[11px] font-semibold flex items-center justify-center px-1.5 flex-shrink-0">
      {count > 99 ? '99+' : count}
    </span>
  );
}

/* ── Spinner ─────────────────────────────────────────────── */
export function Spinner({ size = 24 }) {
  return (
    <div
      className="rounded-full border-[3px] border-accent/30 border-t-accent animate-spin-slow"
      style={{ width: size, height: size }}
    />
  );
}

/* ── Toast ───────────────────────────────────────────────── */
const TOAST_STYLES = {
  info:    'bg-bg-3 border-border-bright text-text-0',
  success: 'bg-green-500/15 border-green-500/30 text-green-400',
  error:   'bg-red-500/15 border-red-500/30 text-red-400',
};

export function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`
      fixed bottom-6 right-6 z-[9999] flex items-center gap-2.5
      px-4 py-3 border rounded-[10px] text-[14px] max-w-[360px]
      shadow-darker animate-fade-in
      ${TOAST_STYLES[type]}
    `}>
      <span>{message}</span>
      <button onClick={onClose} className="opacity-60 hover:opacity-100 text-[18px] leading-none ml-1">×</button>
    </div>
  );
}

/* ── Divider ─────────────────────────────────────────────── */
export function Divider({ label }) {
  return (
    <div className="flex items-center gap-2.5 text-text-2 text-[12px] font-medium">
      <div className="flex-1 h-px bg-border" />
      {label && <span className="whitespace-nowrap">{label}</span>}
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

/* ── Modal ───────────────────────────────────────────────── */
export function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/65 backdrop-blur-sm z-[1000] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-bg-2 border border-border-bright rounded-2xl w-full max-w-[480px] shadow-darker animate-scale-in max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border sticky top-0 bg-bg-2 z-10">
          <h3 className="font-display text-[17px] font-bold text-text-0">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-[8px] bg-bg-3 border border-border text-text-1 flex items-center justify-center hover:bg-bg-4 hover:text-text-0 transition-all"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}