// src/components/layout/ChatLayout.jsx
import React from 'react';
import Navbar     from './Navbar';
import ChatList   from '../chat/ChatList';
import ChatWindow from '../chat/ChatWindow';

export default function ChatLayout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-bg-0">
      <Navbar />
      <div className="flex flex-1 overflow-hidden relative">
        <ChatList   />
        <ChatWindow />
      </div>
    </div>
  );
}