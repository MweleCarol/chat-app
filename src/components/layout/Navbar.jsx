// src/components/layout/Navbar.jsx
import React, { useState } from 'react';
import { useAuth }      from '../../context/AuthContext';
import { useChat }      from '../../context/ChatContext';
import { Avatar, IconButton } from '../ui';
import { MenuIcon, ProfileIcon, LogoutIcon, ChevDownIcon } from '../ui/Icons';
import ProfileModal from '../profile/ProfileModal';

export default function Navbar() {
  const { user, logout }       = useAuth();
  const { toggleSidebar: toggleSb, sidebarOpen } = useChat();
  const [menuOpen, setMenu]    = useState(false);
  const [showProfile, setProf] = useState(false);

  return (
    <>
      <nav className="h-14 px-4 bg-bg-1 border-b border-border flex items-center gap-3 flex-shrink-0 relative z-50">
        {/* Hamburger — mobile only */}
        <IconButton
          className="md:hidden"
          active={sidebarOpen}
          onClick={toggleSb}
          title="Toggle sidebar"
        >
          <MenuIcon size={17} />
        </IconButton>

        {/* Logo */}
        <div className="flex items-center gap-2 font-display text-[20px] font-extrabold tracking-tight flex-1">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse-dot" />
          Pulse
        </div>

        {/* Avatar + dropdown trigger */}
        <div className="relative">
          <button
            className="flex items-center gap-1.5 py-1 px-1.5 rounded-[10px] hover:bg-bg-3 transition-colors"
            onClick={() => setMenu(m => !m)}
          >
            <Avatar user={user} size={32} />
            <span className="text-text-2 flex items-center"><ChevDownIcon size={12} /></span>
          </button>

          {menuOpen && (
            <>
              {/* Click-away overlay */}
              <div className="fixed inset-0 z-[98]" onClick={() => setMenu(false)} />

              {/* Menu */}
              <div className="absolute top-[calc(100%+8px)] right-0 w-[230px] bg-bg-2 border border-border-bright rounded-[10px] shadow-darker z-[99] overflow-hidden animate-scale-in origin-top-right">
                {/* User info */}
                <div className="flex items-center gap-2.5 px-4 py-3.5">
                  <Avatar user={user} size={36} />
                  <div className="min-w-0">
                    <div className="text-[14px] font-semibold truncate">{user?.username}</div>
                    <div className="text-[12px] text-text-2 truncate">{user?.email}</div>
                  </div>
                </div>

                <hr className="border-border m-0" />

                <button
                  className="flex items-center gap-2.5 w-full px-4 py-3 text-[13px] text-text-1 hover:bg-bg-3 hover:text-text-0 transition-colors text-left"
                  onClick={() => { setProf(true); setMenu(false); }}
                >
                  <ProfileIcon size={15} /> Edit Profile
                </button>
                <button
                  className="flex items-center gap-2.5 w-full px-4 py-3 text-[13px] text-text-1 hover:bg-bg-3 hover:text-red-400 transition-colors text-left"
                  onClick={logout}
                >
                  <LogoutIcon size={15} /> Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </nav>

      <ProfileModal isOpen={showProfile} onClose={() => setProf(false)} />
    </>
  );
}