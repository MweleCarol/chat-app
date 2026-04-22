// src/components/profile/ProfileModal.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Modal, Button, Input, Avatar, Toast } from '../ui';

const COLORS = [
  '#8b5cf6','#ec4899','#06b6d4','#10b981','#f59e0b',
  '#ef4444','#6366f1','#84cc16','#f97316','#e879f9',
];

function PasswordSection({ onSave }) {
  const [f, setF]          = useState({ cur: '', next: '', conf: '' });
  const [errs, setErrs]    = useState({});
  const [loading, setLoad] = useState(false);
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    const er = {};
    if (!f.cur)                       er.cur  = 'Required.';
    if (!f.next || f.next.length < 6) er.next = 'Min 6 characters.';
    if (f.next !== f.conf)            er.conf = 'Passwords do not match.';
    if (Object.keys(er).length) { setErrs(er); return; }
    setErrs({}); setLoad(true);
    try   { await onSave({ currentPassword: f.cur, newPassword: f.next }); setF({ cur: '', next: '', conf: '' }); }
    catch (err) { setErrs({ cur: err.message }); }
    finally     { setLoad(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-xl bg-surface-2 flex items-center justify-center">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <h4 className="font-display text-[14px] font-bold text-text-0">Change Password</h4>
      </div>
      <Input label="Current Password" type="password" placeholder="Your current password" value={f.cur}  onChange={set('cur')}  error={errs.cur}  autoComplete="current-password" />
      <Input label="New Password"     type="password" placeholder="At least 6 characters"  value={f.next} onChange={set('next')} error={errs.next} autoComplete="new-password" />
      <Input label="Confirm Password" type="password" placeholder="Repeat new password"    value={f.conf} onChange={set('conf')} error={errs.conf} autoComplete="new-password" />
      <Button type="submit" variant="secondary" size="sm" isLoading={loading}>Update Password</Button>
    </form>
  );
}

export default function ProfileModal({ isOpen, onClose }) {
  const { user, updateProfile, changePassword } = useAuth();
  const [username, setUsername] = useState('');
  const [bio,      setBio]      = useState('');
  const [color,    setColor]    = useState('');
  const [errs,     setErrs]     = useState({});
  const [loading,  setLoad]     = useState(false);
  const [toast,    setToast]    = useState(null);

  useEffect(() => {
    if (isOpen && user) { setUsername(user.username || ''); setBio(user.bio || ''); setColor(user.color || '#8b5cf6'); setErrs({}); }
  }, [isOpen, user]);

  const save = useCallback(async e => {
    e.preventDefault();
    const er = {};
    if (!username.trim() || username.trim().length < 2) er.username = 'At least 2 characters.';
    if (Object.keys(er).length) { setErrs(er); return; }
    setErrs({}); setLoad(true);
    try   { await updateProfile({ username, bio, color }); setToast({ message: 'Profile updated!', type: 'success' }); }
    catch (err) { setErrs({ username: err.message }); }
    finally     { setLoad(false); }
  }, [username, bio, color, updateProfile]);

  const savePw = useCallback(async data => {
    await changePassword(data);
    setToast({ message: 'Password changed!', type: 'success' });
  }, [changePassword]);

  const preview = { ...user, username, color, avatar: username.slice(0, 2).toUpperCase() };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
        <div className="space-y-5">

          {/* Avatar preview card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent/10 to-accent-pink/5 border border-accent/15 p-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar user={preview} size={64} />
                <div className="absolute inset-[-3px] rounded-full border-2 border-dashed border-accent/30 animate-rotate-ring" style={{ animationDuration: '8s' }} />
              </div>
              <div>
                <div className="font-display text-[17px] font-bold text-text-0">{username || 'Your Name'}</div>
                <div className="text-[13px] text-text-1 mt-0.5">{user?.email}</div>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-online" />
                  <span className="text-[11px] text-online">Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Color palette */}
          <div>
            <p className="text-[11px] font-semibold text-text-1 uppercase tracking-widest mb-3">Avatar Color</p>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map(c => (
                <button key={c} onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full transition-all duration-200 hover:scale-110 relative
                    ${color === c ? 'scale-125 ring-2 ring-white/60 ring-offset-2 ring-offset-bg-2' : ''}`}
                  style={{ background: c }} title={c}
                />
              ))}
            </div>
          </div>

          {/* Profile form */}
          <form onSubmit={save} className="space-y-4">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-xl bg-surface-2 flex items-center justify-center">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <h4 className="font-display text-[14px] font-bold text-text-0">Profile Info</h4>
            </div>
            <Input label="Username" type="text" placeholder="Your display name" value={username}
              onChange={e => setUsername(e.target.value)} error={errs.username} autoComplete="username" />
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-text-1 uppercase tracking-widest">Bio</label>
              <textarea
                className="w-full px-3.5 py-3 bg-bg-3 border border-border rounded-xl text-text-0 text-[14px] resize-none min-h-[80px] transition-all focus:outline-none focus:border-accent focus:bg-bg-2 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] placeholder:text-text-2"
                placeholder="What's on your mind?"
                value={bio} onChange={e => setBio(e.target.value)} rows={3} maxLength={160}
              />
              <span className="text-[11px] text-text-2 text-right">{bio.length}/160</span>
            </div>
            <Button type="submit" size="md" isLoading={loading} className="w-full">Save Changes</Button>
          </form>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Password */}
          <PasswordSection onSave={savePw} />
        </div>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}