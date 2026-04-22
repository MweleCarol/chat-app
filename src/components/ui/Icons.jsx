// src/components/ui/Icons.jsx — Centralised SVG icon components

import React from 'react';

const ic = (d, extraProps = {}) => ({ size = 16, ...rest }) => (
  <svg
    width={size} height={size}
    viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round"
    {...extraProps} {...rest}
  >
    {typeof d === 'string' ? <path d={d} /> : d}
  </svg>
);

export const EmailIcon      = ic(<><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></>);
export const LockIcon       = ic(<><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>);
export const UserIcon       = ic(<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>);
export const SearchIcon     = ic(<><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></>);
export const EditIcon       = ic('M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z');
export const MenuIcon       = ic(<><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>);
export const BackIcon       = ic('M19 12H5M12 5l-7 7 7 7');
export const CloseIcon      = ic('M18 6L6 18M6 6l12 12');
export const PhoneIcon      = ic('M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.07 3.37 2 2 0 0 1 3.04 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z');
export const VideoIcon      = ic(<><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></>);
export const InfoIcon       = ic(<><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></>);
export const SendIcon       = (props) => <svg {...props} width={props.size||17} height={props.size||17} viewBox="0 0 24 24" fill="currentColor"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg>;
export const EmojiIcon      = ic(<><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="3"/><line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="3"/></>);
export const AttachIcon     = ic('M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48');
export const CheckIcon      = ic('M20 6L9 17l-5-5', { strokeWidth: '2.5' });
export const CheckCheckIcon = ic(<><path d="M17 6L9 14l-4-4"/><path d="M21 6L13 14"/></>, { strokeWidth: '2.5' });
export const ChevDownIcon   = ic('M6 9l6 6 6-6', { strokeWidth: '2.5' });
export const LogoutIcon     = ic(<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>);
export const ProfileIcon    = UserIcon;
export const ChatBubbleIcon = ic('M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z');