// src/components/layout/Navbar.jsx
import React, { useState } from 'react';
import { useAuth }      from '../../context/AuthContext';
import { useChat }      from '../../context/ChatContext';
import { Avatar, IconButton } from '../ui';
import { MenuIcon, ProfileIcon, LogoutIcon } from '../ui/Icons';
import ProfileModal from '../profile/ProfileModal';

export default function Navbar() {
  const { user, logout }       = useAuth();
  const { toggleSidebar: toggleSb, sidebarOpen } = useChat();
  const [menuOpen, setMenu]    = useState(false);
  const [showProfile, setProf] = useState(false);

  return (
    <>
      <nav className="h-14 px-4 glass border-b border-border flex items-center gap-3 flex-shrink-0 relative z-50">
        {/* Mobile hamburger */}
        <IconButton className="md:hidden" active={sidebarOpen} onClick={toggleSb} title="Menu">
          <MenuIcon size={17} />
        </IconButton>

        {/* Logo */}
        <div className="flex items-center gap-2.5 flex-1">
          <div className="w-7 h-7 rounded-lg bg-grad-accent flex items-center justify-center shadow-accent flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <span className="font-display text-[18px] font-bold tracking-tight grad-text">Pulse</span>
        </div>

        {/* User menu trigger */}
        <div className="relative">
          <button
            onClick={() => setMenu(m => !m)}
            className="flex items-center gap-2.5 py-1.5 px-2 rounded-xl hover:bg-surface-2 transition-all duration-200 group"
          >
            <Avatar user={user} size={30} />
            <div className="hidden sm:block text-left min-w-0">
              <div className="text-[13px] font-semibold text-text-0 leading-none truncate max-w-[120px]">{user?.username}</div>
              <div className="text-[11px] text-text-2 mt-0.5">Online</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
              className={`text-text-2 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`}>
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-[98]" onClick={() => setMenu(false)} />
              <div className="absolute top-[calc(100%+8px)] right-0 w-[220px] bg-bg-3 border border-border-bright rounded-2xl shadow-card-lg z-[99] overflow-hidden animate-scale-in card-top-shine">
                {/* User info header */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
                  <Avatar user={user} size={38} />
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold truncate">{user?.username}</div>
                    <div className="text-[11px] text-text-2 truncate mt-0.5">{user?.email}</div>
                  </div>
                </div>

                <div className="p-1.5">
                  <button
                    className="flex items-center gap-3 w-full px-3 py-2.5 text-[13px] text-text-1 hover:bg-surface-2 hover:text-text-0 rounded-xl transition-all"
                    onClick={() => { setProf(true); setMenu(false); }}
                  >
                    <div className="w-6 h-6 rounded-lg bg-accent/10 flex items-center justify-center">
                      <ProfileIcon size={13} className="text-accent-light" />
                    </div>
                    Edit Profile
                  </button>
                  <button
                    className="flex items-center gap-3 w-full px-3 py-2.5 text-[13px] text-text-1 hover:bg-red-500/10 hover:text-danger rounded-xl transition-all mt-0.5"
                    onClick={logout}
                  >
                    <div className="w-6 h-6 rounded-lg bg-red-500/10 flex items-center justify-center">
                      <LogoutIcon size={13} className="text-danger" />
                    </div>
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </nav>

      <ProfileModal isOpen={showProfile} onClose={() => setProf(false)} />
    </>
  );
}