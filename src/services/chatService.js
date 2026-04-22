const uuidv4 = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });

export const MESSAGE_STATUS = {
  SENDING:   'sending',
  SENT:      'sent',
  DELIVERED: 'delivered',
  READ:      'read',
  FAILED:    'failed',
};

export const MESSAGE_TYPES = {
  TEXT:   'text',
  SYSTEM: 'system',
};

const STORAGE_KEY = 'pulse_chat_data';

// ── Seed data factory ─────────────────────────────────────
function seedContacts(currentUserId) {
  const bots = [
    { id: 'bot-alex',   username: 'Alex Rivera', avatar: 'AR', color: '#FF6584', online: true,  bio: 'Product designer @ Vercel' },
    { id: 'bot-sam',    username: 'Sam Chen',    avatar: 'SC', color: '#43D9AD', online: false, bio: 'Full-stack engineer' },
    { id: 'bot-maya',   username: 'Maya Patel',  avatar: 'MP', color: '#FFB547', online: true,  bio: 'UX researcher & writer' },
    { id: 'bot-jordan', username: 'Jordan Kim',  avatar: 'JK', color: '#4FC3F7', online: true,  bio: 'iOS developer' },
  ];

  const now = Date.now();
  const conversations = {};
  const messages = {};

  bots.forEach((bot, i) => {
    const convId = `conv-seed-${bot.id}`;
    const seedMsgs = getSeedMessages(convId, currentUserId, bot.id, now - (i + 1) * 3600000);
    conversations[convId] = {
      id:           convId,
      type:         'direct',
      participants: [currentUserId, bot.id],
      name:         null,
      unread:       i === 0 ? 2 : 0,
      createdAt:    new Date(now - (i + 1) * 86400000).toISOString(),
      updatedAt:    new Date(now - (i + 1) * 3600000).toISOString(),
    };
    messages[convId] = seedMsgs;
  });

  return { contacts: bots, conversations, messages };
}

function getSeedMessages(convId, myId, botId, baseTime) {
  const pairs = [
    [botId, "Hey! Are you free this weekend?"],
    [myId,  "Yeah, Saturday works for me!"],
    [botId, "Perfect! Let's meet at the usual spot around 3pm?"],
    [botId, "Sounds great! See you then 🎉"],
  ];
  return pairs.map(([s, text], i) => ({
    id:       uuidv4(),
    convId,
    senderId: s,
    text,
    type:     MESSAGE_TYPES.TEXT,
    status:   MESSAGE_STATUS.READ,
    time:     new Date(baseTime + i * 2 * 60000).toISOString(),
  }));
}

// ── Storage helpers ───────────────────────────────────────
function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { contacts: [], conversations: {}, messages: {} };
  } catch {
    return { contacts: [], conversations: {}, messages: {} };
  }
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ── Pub/sub listeners ─────────────────────────────────────
const listeners = { messages: {}, conversations: [], contacts: [] };

function emit(type, key, data) {
  if (type === 'messages' && key) (listeners.messages[key] || []).forEach(cb => cb(data));
  else if (type === 'conversations')  listeners.conversations.forEach(cb => cb(data));
  else if (type === 'contacts')       listeners.contacts.forEach(cb => cb(data));
}

// ── Bot reply bank ────────────────────────────────────────
const BOT_REPLIES = [
  "That sounds awesome! 🙌", "Got it, thanks!", "Let me think about that...",
  "Absolutely! I'll get on it.", "Interesting! Tell me more 👀", "Haha, for sure 😄",
  "On it! Give me a sec ⚡", "Makes sense to me 👍", "Love it! ✨", "Sounds like a plan!",
  "Count me in 🚀", "Great idea! Let's do it.", "Noted! I'll circle back soon.",
  "Appreciate that! 🙏", "Just saw this — totally agree.",
];

// ── Public API ────────────────────────────────────────────
export const chatService = {
  /**
   * Initialise data for a user (seeds demo contacts on first login).
   */
  init(currentUserId) {
    const data = load();
    const hasData = Object.keys(data.conversations).some(id =>
      (data.conversations[id].participants || []).includes(currentUserId)
    );
    if (!hasData) {
      const seeded = seedContacts(currentUserId);
      data.contacts   = [...data.contacts.filter(c => !c.id.startsWith('bot-')), ...seeded.contacts];
      Object.assign(data.conversations, seeded.conversations);
      Object.assign(data.messages,      seeded.messages);
      save(data);
    }
    return data;
  },

  // ── Contacts ────────────────────────────────────────────
  getContacts() {
    return load().contacts;
  },

  // ── Conversations ────────────────────────────────────────
  getConversations(userId) {
    const data = load();
    return Object.values(data.conversations)
      .filter(c => c.participants.includes(userId))
      .map(conv => {
        const msgs = data.messages[conv.id] || [];
        const last = msgs[msgs.length - 1] || null;
        const participants = conv.participants.map(pid =>
          pid === userId ? { id: pid, isMe: true } : (data.contacts.find(c => c.id === pid) || { id: pid })
        );
        return { ...conv, participants, lastMessage: last };
      })
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  },

  getConversation(convId) {
    const data = load();
    return data.conversations[convId] || null;
  },

  // ── Messages ─────────────────────────────────────────────
  getMessages(convId) {
    return (load().messages[convId] || []).slice();
  },

  sendMessage(convId, senderId, text) {
    const data = load();
    const msg = {
      id:       uuidv4(),
      convId,
      senderId,
      text:     text.trim(),
      type:     MESSAGE_TYPES.TEXT,
      status:   MESSAGE_STATUS.SENDING,
      time:     new Date().toISOString(),
    };

    if (!data.messages[convId]) data.messages[convId] = [];
    data.messages[convId].push(msg);
    if (data.conversations[convId]) {
      data.conversations[convId].updatedAt = msg.time;
      data.conversations[convId].unread = 0;
    }
    save(data);

    emit('messages',      convId, this.getMessages(convId));
    emit('conversations', null,   this.getConversations(senderId));

    // Status progression
    setTimeout(() => this._updateMsgStatus(convId, msg.id, MESSAGE_STATUS.SENT,      senderId), 500);
    setTimeout(() => this._updateMsgStatus(convId, msg.id, MESSAGE_STATUS.DELIVERED, senderId), 1300);

    // Bot reply
    const conv = data.conversations[convId];
    const botId = conv?.participants.find(id => id !== senderId);
    if (botId?.startsWith('bot-')) {
      this._simulateBotReply(convId, botId, senderId);
    }

    return msg;
  },

  markAsRead(convId, userId) {
    const data = load();
    const msgs = data.messages[convId] || [];
    let changed = false;
    msgs.forEach(m => {
      if (m.senderId !== userId && m.status !== MESSAGE_STATUS.READ) {
        m.status = MESSAGE_STATUS.READ;
        changed = true;
      }
    });
    if (data.conversations[convId]) data.conversations[convId].unread = 0;
    if (changed) {
      save(data);
      emit('messages',      convId, this.getMessages(convId));
      emit('conversations', null,   this.getConversations(userId));
    }
  },

  createConversation(userId, contactId) {
    const data = load();
    // Check if already exists
    const existing = Object.values(data.conversations).find(c =>
      c.type === 'direct' &&
      c.participants.includes(userId) &&
      c.participants.includes(contactId)
    );
    if (existing) return existing.id;

    const convId = uuidv4();
    data.conversations[convId] = {
      id:           convId,
      type:         'direct',
      participants: [userId, contactId],
      name:         null,
      unread:       0,
      createdAt:    new Date().toISOString(),
      updatedAt:    new Date().toISOString(),
    };
    save(data);
    emit('conversations', null, this.getConversations(userId));
    return convId;
  },

  // ── Subscriptions ────────────────────────────────────────
  onMessages(convId, cb) {
    if (!listeners.messages[convId]) listeners.messages[convId] = [];
    listeners.messages[convId].push(cb);
    return () => { listeners.messages[convId] = listeners.messages[convId].filter(x => x !== cb); };
  },

  onConversations(cb) {
    listeners.conversations.push(cb);
    return () => { listeners.conversations = listeners.conversations.filter(x => x !== cb); };
  },

  // ── Typing ───────────────────────────────────────────────
  _typingListeners: {},
  onTyping(convId, cb) {
    if (!this._typingListeners[convId]) this._typingListeners[convId] = [];
    this._typingListeners[convId].push(cb);
    return () => { this._typingListeners[convId] = (this._typingListeners[convId] || []).filter(x => x !== cb); };
  },
  _emitTyping(convId, data) {
    (this._typingListeners[convId] || []).forEach(cb => cb(data));
  },

  // ── Private ──────────────────────────────────────────────
  _updateMsgStatus(convId, msgId, status, userId) {
    const data = load();
    const msgs = data.messages[convId] || [];
    const msg  = msgs.find(m => m.id === msgId);
    if (msg) {
      msg.status = status;
      save(data);
      emit('messages', convId, this.getMessages(convId));
      emit('conversations', null, this.getConversations(userId));
    }
  },

  _simulateBotReply(convId, botId, userId) {
    const delay = 1800 + Math.random() * 2200;
    setTimeout(() => this._emitTyping(convId, { userId: botId, isTyping: true }),  delay - 700);
    setTimeout(() => {
      this._emitTyping(convId, { userId: botId, isTyping: false });
      const data = load();
      const reply = {
        id:       uuidv4(),
        convId,
        senderId: botId,
        text:     BOT_REPLIES[Math.floor(Math.random() * BOT_REPLIES.length)],
        type:     MESSAGE_TYPES.TEXT,
        status:   MESSAGE_STATUS.DELIVERED,
        time:     new Date().toISOString(),
      };
      if (!data.messages[convId]) data.messages[convId] = [];
      data.messages[convId].push(reply);
      if (data.conversations[convId]) {
        data.conversations[convId].updatedAt = reply.time;
        data.conversations[convId].unread    = (data.conversations[convId].unread || 0) + 1;
      }
      save(data);
      emit('messages',      convId, this.getMessages(convId));
      emit('conversations', null,   this.getConversations(userId));
    }, delay);
  },

  // ── Formatting utils ─────────────────────────────────────
  fmtTime(dateStr) {
    if (!dateStr) return '';
    const d    = new Date(dateStr);
    const now  = new Date();
    const diff = (now - d) / 1000;
    if (diff < 60)     return 'now';
    if (diff < 3600)   return Math.floor(diff / 60) + 'm';
    if (diff < 86400)  return Math.floor(diff / 3600) + 'h';
    const days = Math.floor(diff / 86400);
    if (days < 7)      return d.toLocaleDateString(undefined, { weekday: 'short' });
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  },

  fmtMsgTime(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  },
};