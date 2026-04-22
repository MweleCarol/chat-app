// src/components/profile/ProfileModal.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { useAuth }                from '../../context/AuthContext';
import { Modal, Button, Input, Avatar, Toast } from '../ui';

const COLOR_PALETTE = [
  '#7c6dfa','#fa6d9a','#43d9ad','#fbbf24','#60a5fa',
  '#f87171','#a78bfa','#34d399','#fb923c','#e879f9',
];

/* ── Password sub-form ───────────────────────────────────── */
function PasswordSection({ onSave }) {
  const [f, setF]           = useState({ cur: '', next: '', conf: '' });
  const [errs, setErrs]     = useState({});
  const [loading, setLoad]  = useState(false);

  const set = (k) => (e) => setF(p => ({ ...p, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const er = {};
    if (!f.cur)                          er.cur  = 'Required.';
    if (!f.next || f.next.length < 6)    er.next = 'Min 6 characters.';
    if (f.next !== f.conf)               er.conf = 'Passwords do not match.';
    if (Object.keys(er).length) { setErrs(er); return; }
    setErrs({});
    setLoad(true);
    try {
      await onSave({ currentPassword: f.cur, newPassword: f.next });
      setF({ cur: '', next: '', conf: '' });
    } catch (err) {
      setErrs({ cur: err.message });
    } finally {
      setLoad(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-3.5">
      <h4 className="font-display text-[14px] font-bold text-text-0">Change Password</h4>
      <Input label="Current Password" type="password" placeholder="Your current password" value={f.cur}  onChange={set('cur')}  error={errs.cur}  autoComplete="current-password" />
      <Input label="New Password"     type="password" placeholder="At least 6 characters"  value={f.next} onChange={set('next')} error={errs.next} autoComplete="new-password" />
      <Input label="Confirm Password" type="password" placeholder="Repeat new password"    value={f.conf} onChange={set('conf')} error={errs.conf} autoComplete="new-password" />
      <div>
        <Button type="submit" variant="secondary" size="sm" isLoading={loading}>
          Update Password
        </Button>
      </div>
    </form>
  );
}

/* ── ProfileModal ────────────────────────────────────────── */
export default function ProfileModal({ isOpen, onClose }) {
  const { user, updateProfile, changePassword } = useAuth();

  const [username, setUsername] = useState('');
  const [bio,      setBio]      = useState('');
  const [color,    setColor]    = useState('');
  const [errs,     setErrs]     = useState({});
  const [loading,  setLoad]     = useState(false);
  const [toast,    setToast]    = useState(null);

  // Sync fields when modal opens
  useEffect(() => {
    if (isOpen && user) {
      setUsername(user.username || '');
      setBio(user.bio           || '');
      setColor(user.color       || '#7c6dfa');
      setErrs({});
    }
  }, [isOpen, user]);

  const saveProfile = useCallback(async (e) => {
    e.preventDefault();
    const er = {};
    if (!username.trim() || username.trim().length < 2) er.username = 'At least 2 characters.';
    if (Object.keys(er).length) { setErrs(er); return; }
    setErrs({});
    setLoad(true);
    try {
      await updateProfile({ username, bio, color });
      setToast({ message: 'Profile updated successfully!', type: 'success' });
    } catch (err) {
      setErrs({ username: err.message });
    } finally {
      setLoad(false);
    }
  }, [username, bio, color, updateProfile]);

  const handlePasswordSave = useCallback(async ({ currentPassword, newPassword }) => {
    await changePassword({ currentPassword, newPassword });
    setToast({ message: 'Password changed successfully!', type: 'success' });
  }, [changePassword]);

  // Live preview of edits
  const previewUser = { ...user, username, color, avatar: username.slice(0, 2).toUpperCase() };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
        <div className="flex flex-col gap-5">

          {/* ── Avatar preview ──────────────────────────────── */}
          <div className="flex items-center gap-4 p-4 bg-bg-3 border border-border rounded-[10px]">
            <Avatar user={previewUser} size={68} />
            <div className="min-w-0">
              <div className="font-display text-[16px] font-semibold truncate">
                {username || 'Your Name'}
              </div>
              <div className="text-[13px] text-text-1 mt-0.5">{user?.email}</div>
            </div>
          </div>

          {/* ── Color palette ────────────────────────────────── */}
          <div>
            <p className="text-[11px] font-semibold text-text-1 uppercase tracking-[0.06em] mb-2.5">
              Avatar Color
            </p>
            <div className="flex flex-wrap gap-2">
              {COLOR_PALETTE.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`
                    w-[30px] h-[30px] rounded-full border-2 transition-all hover:scale-115
                    ${color === c
                      ? 'border-white scale-125 shadow-[0_0_0_3px_rgba(124,109,250,0.4)]'
                      : 'border-transparent'
                    }
                  `}
                  style={{ background: c }}
                  title={c}
                />
              ))}
            </div>
          </div>

          {/* ── Profile form ─────────────────────────────────── */}
          <form onSubmit={saveProfile} className="flex flex-col gap-3.5">
            <h4 className="font-display text-[14px] font-bold text-text-0">Profile Info</h4>

            <Input
              label="Username"
              type="text"
              placeholder="Your display name"
              value={username}
              onChange={e => setUsername(e.target.value)}
              error={errs.username}
              autoComplete="username"
            />

            {/* Bio textarea */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-text-1 uppercase tracking-[0.06em]">
                Bio
              </label>
              <textarea
                className="w-full px-3.5 py-2.5 bg-bg-2 border border-border rounded-[10px] text-text-0 font-body text-[14px] resize-y min-h-[80px] transition-all outline-none placeholder:text-text-2 focus:border-accent focus:ring-2 focus:ring-accent/20"
                placeholder="Tell people a little about yourself…"
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={3}
                maxLength={160}
              />
              <span className="text-[11px] text-text-2 text-right">{bio.length}/160</span>
            </div>

            <Button type="submit" size="lg" isLoading={loading}>
              Save Changes
            </Button>
          </form>

          {/* ── Divider ──────────────────────────────────────── */}
          <div className="h-px bg-border" />

          {/* ── Password ─────────────────────────────────────── */}
          <PasswordSection onSave={handlePasswordSave} />
        </div>
      </Modal>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}