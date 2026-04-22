<<<<<<< HEAD
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
=======
# Pulse Chat — React Application

A full-featured chat application built with modern React, featuring authentication,
persistent state, real-time-like messaging, and a polished dark UI.

---

## Quick Start

### Option A — Standalone (no build step)
Open `pulse-chat-standalone.html` directly in any browser. Everything is included.

**Demo credentials:** `demo@pulse.chat` / `demo1234`

### Option B — Create React App project
```bash
cd pulse-react
npm install
npm start
```

---

## Folder Structure

```
src/
├── styles/
│   └── globals.css          # Design tokens (CSS vars), animations, resets
│
├── services/
│   ├── authService.js       # Auth logic — register, login, logout, updateProfile
│   └── chatService.js       # Chat logic — messages, conversations, pub/sub
│
├── context/
│   ├── AuthContext.jsx      # Global auth state (useReducer + localStorage)
│   └── ChatContext.jsx      # Global chat state (conversations, messages, typing)
│
├── components/
│   ├── ui/
│   │   ├── index.jsx        # Avatar, Button, Input, Modal, Toast, Badge, Spinner
│   │   └── ui.module.css
│   │
│   ├── auth/
│   │   ├── AuthPage.jsx     # Login + Register with tab animation
│   │   └── AuthPage.module.css
│   │
│   ├── layout/
│   │   ├── Navbar.jsx       # Top bar: logo + user dropdown
│   │   ├── Navbar.module.css
│   │   ├── ChatLayout.jsx   # Shell: Navbar + Sidebar + ChatWindow
│   │   └── ChatLayout.module.css
│   │
│   ├── chat/
│   │   ├── ChatList.jsx         # Sidebar: search, online strip, conv list
│   │   ├── ChatList.module.css
│   │   ├── ChatWindow.jsx       # Main chat area: header, messages, input
│   │   ├── ChatWindow.module.css
│   │   ├── MessageBubble.jsx    # Single message bubble with status ticks
│   │   ├── MessageBubble.module.css
│   │   ├── MessageInput.jsx     # Textarea + emoji picker + send button
│   │   ├── MessageInput.module.css
│   │   ├── TypingIndicator.jsx  # Animated three-dot typing bubble
│   │   └── TypingIndicator.module.css
│   │
│   └── profile/
│       ├── ProfileModal.jsx     # Edit username, bio, color + change password
│       └── ProfileModal.module.css
│
├── App.jsx    # Root: AuthProvider → AppRouter → ChatProvider → ChatLayout
└── index.js   # ReactDOM createRoot entry point
```

---

## Key Architecture Decisions

### 1. Authentication & Persistence
**File:** `src/services/authService.js`

- User accounts stored in `localStorage['pulse_users']` as a JSON object keyed by user ID.
- Passwords are one-way hashed (simple hash for demo — use bcrypt server-side in production).
- Sessions stored separately with a 7-day expiry timestamp.
- `sanitize()` helper **always strips passwordHash** before returning user objects to components.
- **To swap to a real API:** replace the body of `register()`, `login()`, `updateProfile()` etc. with `fetch()` calls. No component changes needed.

### 2. State Management
**Files:** `src/context/AuthContext.jsx`, `src/context/ChatContext.jsx`

Two React Contexts using `useReducer` (not Redux — no extra dependency needed at this scale):

| Context    | State                                      | Actions                                      |
|------------|--------------------------------------------|----------------------------------------------|
| AuthContext | `user`, `token`, `isAuthenticated`, `isLoading` | `login`, `register`, `logout`, `updateProfile`, `changePassword` |
| ChatContext | `conversations`, `activeConvId`, `messages`, `typingUsers`, `contacts`, `sidebarOpen` | `selectConversation`, `sendMessage`, `startConversation`, `toggleSidebar` |

**Why two contexts?** Auth state changes infrequently. Putting it separately means ChatContext re-renders don't force Auth consumers to re-render.

### 3. Chat Service — Pub/Sub Pattern
**File:** `src/services/chatService.js`

Components never poll localStorage. Instead:
- `onConversations(cb)` → subscribes to conversation list changes
- `onMessages(convId, cb)` → subscribes to messages for a specific conv
- `onTyping(convId, cb)` → subscribes to typing indicators

When `sendMessage()` is called, it:
1. Writes to localStorage
2. Calls `emit('messages', convId, ...)` → all message subscribers update
3. Calls `emit('conversations', ...)` → sidebar re-renders with new last message
4. Schedules status updates (sending → sent → delivered)
5. Schedules a simulated bot reply with typing indicator

**React Native portability:** The only platform-specific dependency is `localStorage`.
Replace it with `AsyncStorage` from `@react-native-async-storage/async-storage`:
```js
// Web
function load() { return JSON.parse(localStorage.getItem(KEY)) || {} }
// React Native
async function load() { return JSON.parse(await AsyncStorage.getItem(KEY)) || {} }
```

### 4. Form Validation
All forms validate **client-side first** with per-field errors, then call the service which
does **server-side-style validation** (duplicate email check, username conflicts, etc.).
The two-layer approach catches errors early while remaining authoritative.

### 5. Profile Updates — Live Reflection
When the user saves their profile:
1. `authService.updateProfile()` writes to localStorage and updates `pulse_current_user`
2. `AuthContext` dispatches `UPDATE_USER` → `currentUser` state updates
3. Every component reading `user` from `useAuth()` re-renders with the new name/color/avatar

This means the Navbar avatar, sidebar footer, and all message bubbles update instantly.

### 6. CSS Architecture
CSS Modules (`*.module.css`) for component-scoped styles.
Design tokens as CSS custom properties in `globals.css` — swap the entire theme by changing
values in `:root {}`.

---

## Swapping to a Real Backend

```js
// authService.js — replace localStorage calls with:
async login({ email, password }) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error((await res.json()).message);
  const { user, token } = await res.json();
  localStorage.setItem('pulse_session', JSON.stringify({ token, userId: user.id, expiresAt: ... }));
  return { user, token };
},

// chatService.js — replace pub/sub with WebSocket:
onMessages(convId, cb) {
  const ws = new WebSocket(`wss://yourapi.com/ws/conv/${convId}`);
  ws.onmessage = (e) => cb(JSON.parse(e.data).messages);
  return () => ws.close();
},
```

---

## Responsive Behaviour

| Breakpoint | Behaviour |
|------------|-----------|
| > 768px    | Sidebar always visible (300px fixed width) |
| ≤ 768px    | Sidebar slides in from left as an overlay; hamburger in Navbar + back button in chat header |
>>>>>>> origin/main
