// src/App.jsx — Root component
import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ChatProvider }          from './context/ChatContext';
import AuthPage   from './components/auth/AuthPage';
import ChatLayout from './components/layout/ChatLayout';

function AppRouter() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-bg-0">
        <div className="w-9 h-9 rounded-full border-[3px] border-accent/30 border-t-accent animate-spin-slow" />
      </div>
    );
  }

  if (!isAuthenticated) return <AuthPage />;

  return (
    <ChatProvider>
      <ChatLayout />
    </ChatProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}