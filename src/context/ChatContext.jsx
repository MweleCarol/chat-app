// ============================================================
// src/context/ChatContext.jsx
// Global chat state: conversations, active conv, messages.
// ============================================================

import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import { chatService } from '../services/chatService';
import { useAuth     } from './AuthContext';

const ChatContext = createContext(null);

const initialState = {
  conversations:    [],
  activeConvId:     null,
  messages:         {},       // { [convId]: Message[] }
  typingUsers:      {},       // { [convId]: string[] }
  contacts:         [],
  sidebarOpen:      false,    // mobile sidebar toggle
};

function chatReducer(state, action) {
  switch (action.type) {
    case 'SET_CONVERSATIONS':
      return { ...state, conversations: action.conversations };
    case 'SET_ACTIVE_CONV':
      return { ...state, activeConvId: action.convId, sidebarOpen: false };
    case 'SET_MESSAGES':
      return { ...state, messages: { ...state.messages, [action.convId]: action.messages } };
    case 'SET_TYPING': {
      const prev = state.typingUsers[action.convId] || [];
      const next = action.isTyping
        ? [...new Set([...prev, action.userId])]
        : prev.filter(id => id !== action.userId);
      return { ...state, typingUsers: { ...state.typingUsers, [action.convId]: next } };
    }
    case 'SET_CONTACTS':
      return { ...state, contacts: action.contacts };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'CLOSE_SIDEBAR':
      return { ...state, sidebarOpen: false };
    default:
      return state;
  }
}

export function ChatProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [state, dispatch]         = useReducer(chatReducer, initialState);
  const unsubConvRef              = useRef(null);
  const unsubMsgRefs              = useRef({});
  const unsubTypingRefs           = useRef({});

  // Load conversations when user changes
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // Contacts
    dispatch({ type: 'SET_CONTACTS', contacts: chatService.getContacts() });

    // Conversations (initial)
    dispatch({ type: 'SET_CONVERSATIONS', conversations: chatService.getConversations(user.id) });

    // Subscribe to conversation updates
    unsubConvRef.current = chatService.onConversations(convs => {
      dispatch({ type: 'SET_CONVERSATIONS', conversations: convs });
    });

    return () => {
      unsubConvRef.current?.();
    };
  }, [isAuthenticated, user]);

  // Subscribe to messages + typing when active conversation changes
  useEffect(() => {
    const { activeConvId } = state;
    if (!activeConvId || !user) return;

    // Load messages
    dispatch({ type: 'SET_MESSAGES', convId: activeConvId, messages: chatService.getMessages(activeConvId) });
    chatService.markAsRead(activeConvId, user.id);

    // Subscribe
    unsubMsgRefs.current[activeConvId]    = chatService.onMessages(activeConvId, msgs => {
      dispatch({ type: 'SET_MESSAGES', convId: activeConvId, messages: msgs });
    });
    unsubTypingRefs.current[activeConvId] = chatService.onTyping(activeConvId, ({ userId, isTyping }) => {
      dispatch({ type: 'SET_TYPING', convId: activeConvId, userId, isTyping });
    });

    return () => {
      unsubMsgRefs.current[activeConvId]?.();
      unsubTypingRefs.current[activeConvId]?.();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.activeConvId, user]);

  const selectConversation = useCallback((convId) => {
    dispatch({ type: 'SET_ACTIVE_CONV', convId });
  }, []);

  const sendMessage = useCallback((text) => {
    if (!state.activeConvId || !user || !text.trim()) return;
    chatService.sendMessage(state.activeConvId, user.id, text);
  }, [state.activeConvId, user]);

  const startConversation = useCallback((contactId) => {
    if (!user) return;
    const convId = chatService.createConversation(user.id, contactId);
    dispatch({ type: 'SET_CONVERSATIONS', conversations: chatService.getConversations(user.id) });
    dispatch({ type: 'SET_ACTIVE_CONV', convId });
    return convId;
  }, [user]);

  const toggleSidebar  = useCallback(() => dispatch({ type: 'TOGGLE_SIDEBAR' }), []);
  const closeSidebar   = useCallback(() => dispatch({ type: 'CLOSE_SIDEBAR' }), []);

  const activeMessages = state.messages[state.activeConvId] || [];
  const activeTyping   = state.typingUsers[state.activeConvId] || [];
  const activeConv     = state.conversations.find(c => c.id === state.activeConvId) || null;

  const value = {
    ...state,
    activeConv,
    activeMessages,
    activeTyping,
    selectConversation,
    sendMessage,
    startConversation,
    toggleSidebar,
    closeSidebar,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within <ChatProvider>');
  return ctx;
}