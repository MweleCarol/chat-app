const uuidv4 = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });

const STORAGE_KEYS = {
  USERS:        'pulse_users',
  CURRENT_USER: 'pulse_current_user',
  SESSION:      'pulse_session',
};

// ── Helpers ───────────────────────────────────────────────
function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || {};
  } catch {
    return {};
  }
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

function hashPassword(pw) {
  // Simple deterministic hash (NOT for production — use bcrypt server-side)
  let hash = 0;
  for (let i = 0; i < pw.length; i++) {
    hash = ((hash << 5) - hash) + pw.charCodeAt(i);
    hash |= 0;
  }
  return `h_${Math.abs(hash).toString(36)}`;
}

function createSession(user) {
  const token = uuidv4();
  const session = { token, userId: user.id, expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 };
  localStorage.setItem(STORAGE_KEYS.SESSION,      JSON.stringify(session));
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(sanitize(user)));
  return { user: sanitize(user), token };
}

function sanitize(user) {
  // Never expose password hash to components
  const { passwordHash: _, ...safe } = user;
  return safe;
}

// ── Public API ────────────────────────────────────────────
export const authService = {
  /**
   * Register a new user.
   * Returns { user, token } or throws an Error with a message.
   */
  register({ username, email, password }) {
    // Validation
    if (!username || username.trim().length < 2)  throw new Error('Username must be at least 2 characters.');
    if (!email    || !email.includes('@'))         throw new Error('Please enter a valid email address.');
    if (!password || password.length < 6)          throw new Error('Password must be at least 6 characters.');

    const users = getUsers();

    if (Object.values(users).some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with this email already exists.');
    }
    if (Object.values(users).some(u => u.username.toLowerCase() === username.toLowerCase())) {
      throw new Error('That username is already taken. Try another.');
    }

    const user = {
      id:           uuidv4(),
      username:     username.trim(),
      email:        email.toLowerCase().trim(),
      passwordHash: hashPassword(password),
      avatar:       username.trim().slice(0, 2).toUpperCase(),
      color:        `hsl(${Math.floor(Math.random() * 360)}, 65%, 60%)`,
      bio:          '',
      online:       true,
      createdAt:    new Date().toISOString(),
      updatedAt:    new Date().toISOString(),
    };

    users[user.id] = user;
    saveUsers(users);
    return createSession(user);
  },

  /**
   * Log in an existing user.
   */
  login({ email, password }) {
    if (!email || !password) throw new Error('Please fill in all fields.');

    const users = getUsers();
    const user  = Object.values(users).find(u => u.email.toLowerCase() === email.toLowerCase().trim());

    if (!user)                                             throw new Error('No account found with that email.');
    if (user.passwordHash !== hashPassword(password))     throw new Error('Incorrect password. Please try again.');

    user.online    = true;
    user.updatedAt = new Date().toISOString();
    users[user.id] = user;
    saveUsers(users);

    return createSession(user);
  },

  /**
   * Log out the current user.
   */
  logout() {
    const session = this.getSession();
    if (session) {
      const users = getUsers();
      if (users[session.userId]) {
        users[session.userId].online = false;
        saveUsers(users);
      }
    }
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  /**
   * Get the current session (if valid).
   */
  getSession() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (!raw) return null;
      const session = JSON.parse(raw);
      if (session.expiresAt < Date.now()) {
        this.logout();
        return null;
      }
      return session;
    } catch {
      return null;
    }
  },

  /**
   * Get the persisted current user.
   */
  getCurrentUser() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (!raw) return null;
      const user = JSON.parse(raw);
      // Re-fetch from "db" so any updates are reflected
      const users = getUsers();
      return users[user.id] ? sanitize(users[user.id]) : null;
    } catch {
      return null;
    }
  },

  /**
   * Update current user's profile.
   */
  updateProfile({ userId, username, bio, color }) {
    const users = getUsers();
    const user  = users[userId];
    if (!user) throw new Error('User not found.');

    if (username && username.trim().length < 2)  throw new Error('Username must be at least 2 characters.');
    if (username) {
      const taken = Object.values(users).some(
        u => u.id !== userId && u.username.toLowerCase() === username.trim().toLowerCase()
      );
      if (taken) throw new Error('That username is already taken.');
    }

    if (username) { user.username = username.trim(); user.avatar = username.trim().slice(0, 2).toUpperCase(); }
    if (bio  !== undefined) user.bio   = bio;
    if (color !== undefined) user.color = color;
    user.updatedAt = new Date().toISOString();

    users[userId] = user;
    saveUsers(users);

    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(sanitize(user)));
    return sanitize(user);
  },

  /**
   * Change password.
   */
  changePassword({ userId, currentPassword, newPassword }) {
    if (!newPassword || newPassword.length < 6) throw new Error('New password must be at least 6 characters.');

    const users = getUsers();
    const user  = users[userId];
    if (!user) throw new Error('User not found.');
    if (user.passwordHash !== hashPassword(currentPassword)) throw new Error('Current password is incorrect.');

    user.passwordHash = hashPassword(newPassword);
    user.updatedAt    = new Date().toISOString();
    users[userId]     = user;
    saveUsers(users);
    return true;
  },

  /**
   * Get all registered users (for chat list / contacts).
   */
  getAllUsers() {
    return Object.values(getUsers()).map(sanitize);
  },

  isAuthenticated() {
    return !!this.getSession() && !!this.getCurrentUser();
  },
};