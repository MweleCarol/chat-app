// ============================================================
// src/context/AuthContext.jsx
// Global auth state via React Context + useReducer.
// Provides: currentUser, login, register, logout, updateProfile
// ============================================================

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { authService } from '../services/authService';
import { chatService  } from '../services/chatService';

// ── State shape ───────────────────────────────────────────
const initialState = {
  user:         null,
  token:        null,
  isLoading:    true,   // true while we rehydrate from localStorage
  isAuthenticated: false,
};

// ── Reducer ───────────────────────────────────────────────
function authReducer(state, action) {
  switch (action.type) {
    case 'RESTORE':
      return { ...state, user: action.user, token: action.token, isAuthenticated: !!action.user, isLoading: false };
    case 'LOGIN':
    case 'REGISTER':
      return { ...state, user: action.user, token: action.token, isAuthenticated: true, isLoading: false };
    case 'LOGOUT':
      return { ...initialState, isLoading: false };
    case 'UPDATE_USER':
      return { ...state, user: action.user };
    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Rehydrate session on mount
  useEffect(() => {
    const session = authService.getSession();
    const user    = authService.getCurrentUser();
    if (session && user) {
      chatService.init(user.id); // seed demo data
      dispatch({ type: 'RESTORE', user, token: session.token });
    } else {
      dispatch({ type: 'RESTORE', user: null, token: null });
    }
  }, []);

  const register = useCallback(async (credentials) => {
    const result = authService.register(credentials);
    chatService.init(result.user.id);
    dispatch({ type: 'REGISTER', user: result.user, token: result.token });
    return result;
  }, []);

  const login = useCallback(async (credentials) => {
    const result = authService.login(credentials);
    chatService.init(result.user.id);
    dispatch({ type: 'LOGIN', user: result.user, token: result.token });
    return result;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    dispatch({ type: 'LOGOUT' });
  }, []);

  const updateProfile = useCallback((updates) => {
    const updated = authService.updateProfile({ userId: state.user.id, ...updates });
    dispatch({ type: 'UPDATE_USER', user: updated });
    return updated;
  }, [state.user]);

  const changePassword = useCallback((data) => {
    return authService.changePassword({ userId: state.user.id, ...data });
  }, [state.user]);

  const value = {
    ...state,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ── Hook ──────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}