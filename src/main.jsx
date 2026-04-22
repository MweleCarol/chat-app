import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// Seed demo account so the login hint works on first load
(function seedDemo() {
  try {
    const users = JSON.parse(localStorage.getItem('pulse_users')) || {};
    const hasDemo = Object.values(users).some(u => u.email === 'demo@pulse.chat');
    if (!hasDemo) {
      function h(pw) {
        let hash = 0;
        for (let i = 0; i < pw.length; i++) {
          hash = ((hash << 5) - hash) + pw.charCodeAt(i);
          hash |= 0;
        }
        return 'h_' + Math.abs(hash).toString(36);
      }
      const id = 'demo-user-001';
      users[id] = {
        id,
        username:     'DemoUser',
        email:        'demo@pulse.chat',
        passwordHash: h('demo1234'),
        avatar:       'DU',
        color:        '#7c6dfa',
        bio:          'The built-in demo account',
        online:       false,
        createdAt:    new Date().toISOString(),
      };
      localStorage.setItem('pulse_users', JSON.stringify(users));
    }
  } catch {}
})();

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);