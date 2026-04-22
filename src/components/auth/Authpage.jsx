// src/components/auth/AuthPage.jsx
import React, { useState, useCallback } from 'react';
import { useAuth }          from '../../context/AuthContext';
import { Button, Input, Divider } from '../ui';
import { EmailIcon, LockIcon, UserIcon } from '../ui/Icons';

/* ── Validation ──────────────────────────────────────────── */
function validateLogin({ email, password }) {
  const e = {};
  if (!email || !email.includes('@')) e.email    = 'Enter a valid email.';
  if (!password)                      e.password = 'Password is required.';
  return e;
}

function validateRegister({ username, email, password, confirmPassword }) {
  const e = {};
  if (!username || username.trim().length < 2)   e.username        = 'At least 2 characters.';
  if (!email    || !email.includes('@'))          e.email           = 'Enter a valid email.';
  if (!password || password.length < 6)           e.password        = 'At least 6 characters.';
  if (password  !== confirmPassword)              e.confirmPassword = 'Passwords do not match.';
  return e;
}

/* ── Login Form ──────────────────────────────────────────── */
function LoginForm({ onSwitch }) {
  const { login } = useAuth();
  const [f, setF]           = useState({ email: '', password: '' });
  const [errs, setErrs]     = useState({});
  const [apiErr, setApiErr] = useState('');
  const [loading, setLoad]  = useState(false);

  const set = (k) => (e) => setF(p => ({ ...p, [k]: e.target.value }));

  const submit = useCallback(async (e) => {
    e.preventDefault();
    setApiErr('');
    const errs = validateLogin(f);
    if (Object.keys(errs).length) { setErrs(errs); return; }
    setErrs({});
    setLoad(true);
    try   { await login(f); }
    catch (err) { setApiErr(err.message); }
    finally     { setLoad(false); }
  }, [f, login]);

  return (
    <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
      <Input label="Email"    type="email"    placeholder="you@example.com" value={f.email}    onChange={set('email')}    icon={<EmailIcon size={15}/>} error={errs.email}    autoComplete="email" />
      <Input label="Password" type="password" placeholder="Your password"   value={f.password} onChange={set('password')} icon={<LockIcon  size={15}/>} error={errs.password} autoComplete="current-password" />

      {apiErr && (
        <div className="bg-red-500/12 border border-red-500/30 text-red-400 rounded-[7px] px-3.5 py-2.5 text-[13px] animate-fade-in">
          {apiErr}
        </div>
      )}

      <Button type="submit" size="lg" isLoading={loading}>Sign In</Button>
      <Divider label="or" />

      <p className="text-center text-[13px] text-text-1">
        Don't have an account?{' '}
        <button type="button" onClick={onSwitch} className="text-accent font-medium hover:underline underline-offset-2">
          Create one
        </button>
      </p>

      <div className="text-center text-[12px] text-text-2 bg-bg-2 border border-dashed border-border-bright rounded-[7px] px-3 py-2">
        <span className="text-text-1 font-semibold">Demo:</span> demo@pulse.chat / demo1234
      </div>
    </form>
  );
}

/* ── Register Form ───────────────────────────────────────── */
function RegisterForm({ onSwitch }) {
  const { register } = useAuth();
  const [f, setF]           = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [errs, setErrs]     = useState({});
  const [apiErr, setApiErr] = useState('');
  const [loading, setLoad]  = useState(false);

  const set = (k) => (e) => setF(p => ({ ...p, [k]: e.target.value }));

  const submit = useCallback(async (e) => {
    e.preventDefault();
    setApiErr('');
    const errs = validateRegister(f);
    if (Object.keys(errs).length) { setErrs(errs); return; }
    setErrs({});
    setLoad(true);
    try   { await register(f); }
    catch (err) { setApiErr(err.message); }
    finally     { setLoad(false); }
  }, [f, register]);

  return (
    <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
      <Input label="Username"         type="text"     placeholder="coolname123"         value={f.username}        onChange={set('username')}        icon={<UserIcon  size={15}/>} error={errs.username}        autoComplete="username" />
      <Input label="Email"            type="email"    placeholder="you@example.com"    value={f.email}           onChange={set('email')}           icon={<EmailIcon size={15}/>} error={errs.email}           autoComplete="email" />
      <Input label="Password"         type="password" placeholder="At least 6 chars"   value={f.password}        onChange={set('password')}        icon={<LockIcon  size={15}/>} error={errs.password}        autoComplete="new-password" />
      <Input label="Confirm Password" type="password" placeholder="Repeat password"     value={f.confirmPassword} onChange={set('confirmPassword')} icon={<LockIcon  size={15}/>} error={errs.confirmPassword} autoComplete="new-password" />

      {apiErr && (
        <div className="bg-red-500/12 border border-red-500/30 text-red-400 rounded-[7px] px-3.5 py-2.5 text-[13px] animate-fade-in">
          {apiErr}
        </div>
      )}

      <Button type="submit" size="lg" isLoading={loading}>Create Account</Button>
      <Divider label="or" />

      <p className="text-center text-[13px] text-text-1">
        Already have an account?{' '}
        <button type="button" onClick={onSwitch} className="text-accent font-medium hover:underline underline-offset-2">
          Sign in
        </button>
      </p>
    </form>
  );
}

/* ── AuthPage ────────────────────────────────────────────── */
export default function AuthPage() {
  const [mode, setMode] = useState('login');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-bg-0 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="fixed -top-48 -left-48 w-[600px] h-[600px] rounded-full bg-auth-glow1 pointer-events-none" />
      <div className="fixed -bottom-48 -right-24 w-[500px] h-[500px] rounded-full bg-auth-glow2 pointer-events-none" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-auth bg-bg-1 border border-border-bright rounded-2xl px-8 py-9 shadow-darker animate-scale-in">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-7">
          <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse-dot" />
          <span className="font-display text-[28px] font-extrabold tracking-tight">Pulse</span>
        </div>

        {/* Tabs */}
        <div className="relative flex bg-bg-2 rounded-[10px] p-1 mb-7 gap-0">
          <button
            className={`relative z-10 flex-1 h-9 text-[13px] font-medium rounded-[7px] transition-colors ${mode === 'login' ? 'text-text-0' : 'text-text-1'}`}
            onClick={() => setMode('login')}
          >
            Sign In
          </button>
          <button
            className={`relative z-10 flex-1 h-9 text-[13px] font-medium rounded-[7px] transition-colors ${mode === 'register' ? 'text-text-0' : 'text-text-1'}`}
            onClick={() => setMode('register')}
          >
            Create Account
          </button>
          {/* Sliding indicator */}
          <div
            className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-bg-4 border border-border-bright rounded-[7px] transition-transform duration-200 ease-in-out"
            style={{ transform: `translateX(${mode === 'login' ? '0' : '100%'})` }}
          />
        </div>

        {/* Form */}
        <div className="animate-fade-in" key={mode}>
          {mode === 'login'
            ? <LoginForm    onSwitch={() => setMode('register')} />
            : <RegisterForm onSwitch={() => setMode('login')}    />
          }
        </div>
      </div>

      <p className="relative z-10 mt-6 text-[12px] text-text-3">Pulse Chat · Built with React + Tailwind</p>
    </div>
  );
}