// src/components/ui/index.jsx
import React, { useEffect } from 'react';

export function Avatar({ user, size = 44, ring = false, showDot = false }) {
  const initials = user?.avatar || user?.username?.slice(0, 2).toUpperCase() || '??';
  const color    = user?.color  || '#8b5cf6';
  const fontSize = Math.round(size * 0.3);

  if (ring) {
    return (
      <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
        <div className="absolute inset-[-2px] rounded-full ring-gradient animate-rotate-ring" />
        <div className="absolute inset-[2px] rounded-full flex items-center justify-center font-bold font-display text-white z-10"
          style={{ background: color, fontSize }}>
          {initials}
        </div>
        {showDot && user?.online && (
          <div className="absolute bottom-0 right-0 w-[10px] h-[10px] rounded-full bg-online online-glow z-20" />
        )}
      </div>
    );
  }

  return (
    <div className="relative flex-shrink-0 rounded-full flex items-center justify-center font-bold font-display text-white"
      style={{ width: size, height: size, background: color, fontSize }}>
      {initials}
      {showDot && user?.online && (
        <div className="absolute bottom-0 right-0 w-[10px] h-[10px] rounded-full bg-online online-glow" />
      )}
    </div>
  );
}

export function Button({ children, variant = 'primary', size = 'md', isLoading, disabled, className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed select-none';
  const variants = {
    primary:   'bg-grad-accent text-white shadow-accent hover:brightness-110 hover:shadow-accent-lg active:scale-[0.97]',
    secondary: 'bg-surface-2 text-text-0 border border-border-bright hover:bg-surface-3 hover:border-border-strong active:scale-[0.97]',
    ghost:     'text-text-1 hover:bg-surface-2 hover:text-text-0 active:scale-[0.97]',
    danger:    'bg-red-500/10 text-danger border border-red-500/20 hover:bg-red-500/20 active:scale-[0.97]',
  };
  const sizes = {
    sm: 'h-8 px-3.5 text-[13px]',
    md: 'h-10 px-5 text-[14px]',
    lg: 'h-12 px-6 text-[15px] w-full font-semibold tracking-wide',
  };
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} disabled={disabled || isLoading} {...props}>
      {isLoading ? <span className="w-4 h-4 rounded-full border-2 border-white/25 border-t-white animate-spin-slow" /> : children}
    </button>
  );
}

export function Input({ label, error, icon, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-[11px] font-semibold text-text-1 uppercase tracking-widest">{label}</label>}
      <div className="relative group">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-2 group-focus-within:text-accent-light flex items-center pointer-events-none transition-colors duration-200">
            {icon}
          </span>
        )}
        <input className={`
            w-full h-11 bg-bg-3 border text-text-0 text-[14px] rounded-xl
            placeholder:text-text-2 transition-all duration-200
            focus:bg-bg-2 focus:border-accent focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)]
            ${icon ? 'pl-[42px] pr-3.5' : 'px-3.5'}
            ${error ? 'border-danger/50 focus:border-danger focus:shadow-[0_0_0_3px_rgba(248,113,113,0.12)]' : 'border-border hover:border-border-bright'}
            ${className}
          `} {...props} />
      </div>
      {error && (
        <span className="text-[12px] text-danger flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {error}
        </span>
      )}
    </div>
  );
}

export function IconButton({ children, title, active, className = '', ...props }) {
  return (
    <button title={title} className={`
        w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
        transition-all duration-200 active:scale-95
        ${active
          ? 'bg-accent/15 text-accent-light border border-accent/25'
          : 'bg-surface-1 text-text-1 border border-border hover:bg-surface-2 hover:text-text-0 hover:border-border-bright'
        } ${className}
      `} {...props}>
      {children}
    </button>
  );
}

export function Badge({ count }) {
  if (!count || count <= 0) return null;
  return (
    <span className="bg-grad-accent text-white rounded-full min-w-[18px] h-[18px] text-[10px] font-bold flex items-center justify-center px-1.5 flex-shrink-0">
      {count > 99 ? '99+' : count}
    </span>
  );
}

export function Spinner({ size = 24 }) {
  return <div className="rounded-full border-[2.5px] border-accent/20 border-t-accent animate-spin-slow" style={{ width: size, height: size }} />;
}

export function Toast({ message, type = 'info', onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  const styles = { info: 'bg-bg-4 border-border-strong text-text-0', success: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400', error: 'bg-red-500/10 border-red-500/25 text-danger' };
  return (
    <div className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-4 py-3.5 border rounded-2xl text-[13px] max-w-[340px] shadow-card-lg animate-fade-up card-top-shine ${styles[type]}`}>
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="opacity-40 hover:opacity-80 transition-opacity text-lg leading-none">×</button>
    </div>
  );
}

export function Divider({ label }) {
  return (
    <div className="flex items-center gap-3 text-text-2 text-[11px] font-medium uppercase tracking-widest">
      <div className="flex-1 h-px bg-border" />
      {label && <span>{label}</span>}
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

export function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (!isOpen) return;
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-[1000] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-bg-2 border border-border-bright rounded-3xl w-full max-w-[480px] shadow-card-lg animate-scale-in max-h-[90vh] overflow-y-auto card-top-shine" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-border sticky top-0 bg-bg-2/95 backdrop-blur-sm z-10 rounded-t-3xl">
          <h3 className="font-display text-[16px] font-bold">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-surface-2 text-text-1 flex items-center justify-center hover:bg-surface-3 hover:text-text-0 transition-all border border-border">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}