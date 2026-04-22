// src/components/auth/AuthPage.jsx
import React, { useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button, Input, Divider } from '../ui';
import { EmailIcon, LockIcon, UserIcon } from '../ui/Icons';

function validateLogin({ email, password }) {
  const e = {};
  if (!email || !email.includes('@')) e.email    = 'Enter a valid email.';
  if (!password)                      e.password = 'Password is required.';
  return e;
}

function validateRegister({ username, email, password, confirmPassword }) {
  const e = {};
  if (!username || username.trim().length < 2) e.username        = 'At least 2 characters.';
  if (!email    || !email.includes('@'))        e.email           = 'Enter a valid email.';
  if (!password || password.length < 6)         e.password        = 'At least 6 characters.';
  if (password  !== confirmPassword)            e.confirmPassword = 'Passwords do not match.';
  return e;
}

function LoginForm({ onSwitch }) {
  const { login } = useAuth();
  const [f, setF]           = useState({ email: '', password: '' });
  const [errs, setErrs]     = useState({});
  const [apiErr, setApiErr] = useState('');
  const [loading, setLoad]  = useState(false);
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));

  const submit = useCallback(async e => {
    e.preventDefault(); setApiErr('');
    const errs = validateLogin(f);
    if (Object.keys(errs).length) { setErrs(errs); return; }
    setErrs({}); setLoad(true);
    try   { await login(f); }
    catch (err) { setApiErr(err.message); }
    finally     { setLoad(false); }
  }, [f, login]);

  return (
    <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
      <Input label="Email"    type="email"    placeholder="you@example.com" value={f.email}    onChange={set('email')}    icon={<EmailIcon size={15}/>} error={errs.email}    autoComplete="email" />
      <Input label="Password" type="password" placeholder="Your password"   value={f.password} onChange={set('password')} icon={<LockIcon  size={15}/>} error={errs.password} autoComplete="current-password" />
      {apiErr && <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 text-danger rounded-xl px-4 py-3 text-[13px] animate-fade-up"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>{apiErr}</div>}
      <Button type="submit" size="lg" isLoading={loading} className="mt-1">Continue</Button>
      <Divider label="or" />
      <p className="text-center text-[13px] text-text-1">
        No account?{' '}
        <button type="button" onClick={onSwitch} className="text-accent-light font-semibold hover:underline underline-offset-2 transition-all">Create one free</button>
      </p>
      <div className="flex items-center gap-3 bg-surface-1 border border-border rounded-xl px-4 py-3">
        <div className="w-7 h-7 rounded-lg bg-accent/15 flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <p className="text-[12px] text-text-2"><span className="text-text-1 font-medium">Demo:</span> demo@pulse.chat · demo1234</p>
      </div>
    </form>
  );
}

function RegisterForm({ onSwitch }) {
  const { register } = useAuth();
  const [f, setF]           = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [errs, setErrs]     = useState({});
  const [apiErr, setApiErr] = useState('');
  const [loading, setLoad]  = useState(false);
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));

  const submit = useCallback(async e => {
    e.preventDefault(); setApiErr('');
    const errs = validateRegister(f);
    if (Object.keys(errs).length) { setErrs(errs); return; }
    setErrs({}); setLoad(true);
    try   { await register(f); }
    catch (err) { setApiErr(err.message); }
    finally     { setLoad(false); }
  }, [f, register]);

  return (
    <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
      <Input label="Username"         type="text"     placeholder="yourname"           value={f.username}        onChange={set('username')}        icon={<UserIcon  size={15}/>} error={errs.username}        autoComplete="username" />
      <Input label="Email"            type="email"    placeholder="you@example.com"    value={f.email}           onChange={set('email')}           icon={<EmailIcon size={15}/>} error={errs.email}           autoComplete="email" />
      <Input label="Password"         type="password" placeholder="Min. 6 characters"  value={f.password}        onChange={set('password')}        icon={<LockIcon  size={15}/>} error={errs.password}        autoComplete="new-password" />
      <Input label="Confirm Password" type="password" placeholder="Repeat password"     value={f.confirmPassword} onChange={set('confirmPassword')} icon={<LockIcon  size={15}/>} error={errs.confirmPassword} autoComplete="new-password" />
      {apiErr && <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 text-danger rounded-xl px-4 py-3 text-[13px] animate-fade-up"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>{apiErr}</div>}
      <Button type="submit" size="lg" isLoading={loading} className="mt-1">Create Account</Button>
      <Divider label="or" />
      <p className="text-center text-[13px] text-text-1">
        Already have an account?{' '}
        <button type="button" onClick={onSwitch} className="text-accent-light font-semibold hover:underline underline-offset-2">Sign in</button>
      </p>
    </form>
  );
}

export default function AuthPage() {
  const [mode, setMode] = useState('login');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 bg-bg-0 relative overflow-hidden">
      {/* Background mesh */}
      <div className="fixed inset-0 bg-grad-mesh pointer-events-none" />
      <div className="fixed top-[-30%] left-[-10%] w-[600px] h-[600px] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-5%] w-[500px] h-[500px] rounded-full bg-accent-pink/5 blur-[100px] pointer-events-none" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-auth animate-fade-up">
        {/* Glass card */}
        <div className="bg-bg-1/90 backdrop-blur-xl border border-border-bright rounded-3xl shadow-card-lg overflow-hidden card-top-shine">
          {/* Header band */}
          <div className="px-8 pt-8 pb-6">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-9 h-9 rounded-xl bg-grad-accent flex items-center justify-center shadow-accent">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <span className="font-display text-[22px] font-bold tracking-tight grad-text">Pulse</span>
            </div>

            {/* Heading */}
            <div className="mb-6">
              <h1 className="font-display text-[26px] font-bold text-text-0 leading-tight">
                {mode === 'login' ? 'Welcome back' : 'Create account'}
              </h1>
              <p className="text-text-1 text-[14px] mt-1.5">
                {mode === 'login' ? 'Sign in to continue to Pulse' : 'Join Pulse and start chatting'}
              </p>
            </div>

            {/* Tab pills */}
            <div className="flex gap-1 p-1 bg-bg-3 rounded-2xl mb-6">
              {['login', 'register'].map(m => (
                <button key={m} onClick={() => setMode(m)}
                  className={`flex-1 py-2 rounded-xl text-[13px] font-medium transition-all duration-200
                    ${mode === m
                      ? 'bg-grad-accent text-white shadow-accent'
                      : 'text-text-1 hover:text-text-0'
                    }`}>
                  {m === 'login' ? 'Sign In' : 'Register'}
                </button>
              ))}
            </div>

            {/* Form */}
            <div key={mode} className="animate-fade-up">
              {mode === 'login'
                ? <LoginForm    onSwitch={() => setMode('register')} />
                : <RegisterForm onSwitch={() => setMode('login')}    />
              }
            </div>
          </div>
        </div>

        <p className="text-center mt-5 text-[11px] text-text-3 tracking-wider uppercase">
          Pulse · Secure · Private · Fast
        </p>
      </div>
    </div>
  );
}