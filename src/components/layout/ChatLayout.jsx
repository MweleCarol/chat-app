// src/components/layout/ChatLayout.jsx
import React from 'react';
import Navbar     from './Navbar';
import ChatList   from '../chat/ChatList';
import ChatWindow from '../chat/ChatWindow';

export default function ChatLayout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-bg-0">
      {/* Ambient background glow */}
      <div className="fixed inset-0 bg-grad-mesh pointer-events-none z-0" />
      <div className="fixed top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-accent/4 blur-[100px] pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col h-screen">
        <Navbar />
        <div className="flex flex-1 overflow-hidden relative">
          <ChatList   />
          <ChatWindow />
        </div>
      </div>
    </div>
  );
}