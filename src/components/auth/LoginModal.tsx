import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Lock,
  Mail,
  ArrowRight,
  Shield,
  AlertCircle,
  Sliders,
  Apple,
  UserPlus
} from 'lucide-react';
import { SignUpWizardModal } from './SignUpWizardModal';
import { StudioLogo } from '../common/StudioLogo';

export const LoginModal: React.FC = () => {
  const { loginWithGoogle, loginWithCredentials } = useApp();

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showGoogleDialog, setShowGoogleDialog] = useState<boolean>(false);
  const [googleEmailInput, setGoogleEmailInput] = useState<string>('');

  // Form states
  const [usernameOrEmail, setUsernameOrEmail] = useState<string>('radhika_instructor');
  const [password, setPassword] = useState<string>('password123');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const res = loginWithCredentials(usernameOrEmail, password);
    if (!res.success) {
      setErrorMsg(res.error || 'Login failed. Please check credentials.');
    }
  };

  const handleGoogleSelect = (email: string, name?: string) => {
    loginWithGoogle(email, name);
    setShowGoogleDialog(false);
  };

  // If user chooses Sign Up, launch the 3-step setup wizard
  if (authMode === 'signup') {
    return <SignUpWizardModal onCancel={() => setAuthMode('signin')} />;
  }

  return (
    <div className="w-full min-h-screen flex flex-col justify-between p-4 sm:p-6 md:p-8 bg-[#F9F6F0] text-[#2D251E] select-none transition-colors duration-200">
      {/* Top Studio Brand Bar */}
      <header className="w-full max-w-md mx-auto pt-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <StudioLogo size="sm" variant="transparent" withRing className="bg-[#FAF6F0]" />
          <div>
            <span className="font-serif font-bold text-lg text-stone-900 tracking-tight block leading-tight">
              RC Pilates
            </span>
            <span className="text-xs text-stone-500 font-medium">Fitness &amp; Reformer Studio</span>
          </div>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
          Mindful Sanctuary
        </span>
      </header>

      {/* Main Landing & Login Container */}
      <div className="w-full max-w-md mx-auto my-auto py-6 space-y-6">
        {/* Landing Hero Message with Official Studio Logo */}
        <div className="text-center space-y-3">
          <div className="flex justify-center pb-2">
            <div className="relative p-2 rounded-full bg-white ring-4 ring-[#E6D7C3]/90 shadow-[0_8px_30px_rgba(103,81,55,0.14)]">
              <StudioLogo size="xl" variant="transparent" />
            </div>
          </div>

          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight leading-tight">
              Mindful Movement, Deeply Tailored
            </h1>
            <p className="text-sm text-stone-600 font-light max-w-xs mx-auto leading-relaxed mt-1">
              Reformer pilates, customized studio diet plans, and personal instructor alignment.
            </p>
          </div>

          {/* Value Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-semibold text-stone-700">
            <span className="flex items-center gap-1.5 bg-white/90 px-3 py-1.5 rounded-full border border-stone-200 shadow-xs">
              <Sliders className="w-3.5 h-3.5 text-emerald-700" />
              <span>Custom Reformer</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white/90 px-3 py-1.5 rounded-full border border-stone-200 shadow-xs">
              <Apple className="w-3.5 h-3.5 text-amber-700" />
              <span>Tailored Nutrition</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white/90 px-3 py-1.5 rounded-full border border-stone-200 shadow-xs">
              <Shield className="w-3.5 h-3.5 text-emerald-700" />
              <span>Master Instructors</span>
            </span>
          </div>
        </div>

        {/* Auth Box */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-6 shadow-ambient-lg border border-stone-200/90 w-full space-y-4 transition-colors">
          {/* Sign In vs Sign Up Tabs */}
          <div className="flex bg-[#F2E9DC] p-1.5 rounded-2xl border border-stone-200/80">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signin');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                authMode === 'signin'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setErrorMsg('');
              }}
              className="flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 text-emerald-900 hover:text-emerald-950 font-semibold"
            >
              <UserPlus className="w-3.5 h-3.5 text-emerald-700" />
              <span>Sign Up (Wizard)</span>
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-700" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Option 1: Gmail / Google Login Button */}
          <div>
            <button
              type="button"
              onClick={() => setShowGoogleDialog(true)}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-white hover:bg-stone-50 border border-stone-200 shadow-xs text-sm font-bold text-stone-800 transition-all active:scale-[0.99]"
            >
              {/* Google G Icon */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.9c2.28-2.1 3.645-5.18 3.645-9.14z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.36 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.97 0 12c0 2.03.45 3.84 1.24 5.42l4.04-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-stone-200" />
            <span className="text-xs font-semibold text-stone-500">
              Or with studio username &amp; password
            </span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>

          {/* Option 2: Username & Password Form */}
          <form onSubmit={handleCredentialsSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Username or Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3.5 text-stone-400" />
                <input
                  type="text"
                  value={usernameOrEmail}
                  onChange={e => setUsernameOrEmail(e.target.value)}
                  placeholder="e.g. radhika_instructor or elena_client"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#FAF8F5] border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 text-stone-900"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-semibold text-stone-600">
                  Password
                </label>
                <span className="text-[10px] text-stone-400">Demo password: password123</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF8F5] border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 text-stone-900"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-2xl bg-[#675137] hover:bg-[#52402B] text-white font-semibold text-xs shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
            >
              <span>Sign In to RC Pilates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* New User Callout */}
          <div className="p-3 rounded-2xl bg-[#F6F1EA] border border-[#E3D7C7] flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#4A3B2C]">New to RC Pilates?</p>
              <p className="text-[11px] text-[#786B5D]">Set up profile, height, weight &amp; goals</p>
            </div>
            <button
              type="button"
              onClick={() => setAuthMode('signup')}
              className="px-3.5 py-1.5 rounded-xl bg-[#675137] hover:bg-[#52402B] text-white text-xs font-bold shadow-xs transition-transform active:scale-95"
            >
              Start Sign Up &rarr;
            </button>
          </div>

          {/* Quick Demo Switcher Pills */}
          <div className="pt-3 border-t border-stone-100 text-center">
            <p className="text-xs text-stone-500 mb-2 font-semibold">1-Tap Quick Demo:</p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  loginWithGoogle('rohan.sethi12126@gmail.com', 'Radhika Chopra');
                }}
                className="text-xs font-bold text-[#675137] bg-[#F2E9DC] hover:bg-[#EAE0D2] px-3.5 py-1.5 rounded-full border border-[#D5C0A4] flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Shield className="w-3.5 h-3.5 text-[#675137]" />
                <span>Instructor (Radhika Chopra)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  loginWithGoogle('elena.vance@gmail.com', 'Elena Vance');
                }}
                className="text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 px-3.5 py-1.5 rounded-full border border-stone-200 flex items-center gap-1.5 transition-all shadow-xs"
              >
                <User className="w-3.5 h-3.5 text-stone-600" />
                <span>Client (Elena Vance)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <footer className="w-full max-w-md mx-auto text-center py-2 text-xs text-stone-500 font-medium">
        RC Pilates &amp; Fitness Studio • Mindful Movement &amp; Nutrition
      </footer>

      {/* Simulated Google Sign-In Account Chooser Modal */}
      {showGoogleDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#1C231E] rounded-3xl p-5 w-full max-w-sm shadow-2xl border border-stone-200 dark:border-stone-800 animate-in zoom-in-95 text-stone-900 dark:text-stone-100">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800 mb-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.9c2.28-2.1 3.645-5.18 3.645-9.14z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.36 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.97 0 12c0 2.03.45 3.84 1.24 5.42l4.04-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <h3 className="font-semibold text-sm">Sign in with Google</h3>
              </div>
              <button
                onClick={() => setShowGoogleDialog(false)}
                className="text-stone-400 hover:text-stone-700 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-300 mb-3">
              Choose your Gmail account to access RC Pilates Studio:
            </p>

            <div className="space-y-2 mb-4">
              {/* Whitelisted Instructor: rohan.sethi12126@gmail.com */}
              <button
                type="button"
                onClick={() => handleGoogleSelect('rohan.sethi12126@gmail.com', 'Radhika Chopra')}
                className="w-full flex items-center gap-3 p-3 rounded-2xl bg-[#F2E9DC] hover:bg-[#EAE0D2] border border-[#D5C0A4] transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-[#675137] text-white flex items-center justify-center font-serif text-xs font-bold ring-2 ring-[#D5C0A4] shrink-0">
                  RC
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-[#2D251E] truncate">
                      Rohan Sethi (Radhika Chopra)
                    </p>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#FAF6F0] text-[#675137] border border-[#D5C0A4] font-bold shrink-0">
                      Instructor
                    </span>
                  </div>
                  <p className="text-[11px] text-[#786B5D] truncate">
                    rohan.sethi12126@gmail.com
                  </p>
                </div>
              </button>

              {/* Client Account: Elena Vance */}
              <button
                type="button"
                onClick={() => handleGoogleSelect('elena.vance@gmail.com', 'Elena Vance')}
                className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-stone-50 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 transition-colors text-left"
              >
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&q=80"
                  alt="Elena"
                  className="w-9 h-9 rounded-full object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-semibold text-stone-900 dark:text-stone-100">Elena Vance</p>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-medium">
                      Client
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">elena.vance@gmail.com</p>
                </div>
              </button>

              {/* Client Account: Marcus Reid */}
              <button
                type="button"
                onClick={() => handleGoogleSelect('marcus.reid@gmail.com', 'Marcus Reid')}
                className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-stone-50 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 transition-colors text-left"
              >
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&q=80"
                  alt="Marcus"
                  className="w-9 h-9 rounded-full object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-semibold text-stone-900 dark:text-stone-100">Marcus Reid</p>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-medium">
                      Client
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">marcus.reid@gmail.com</p>
                </div>
              </button>
            </div>

            {/* Custom Gmail input & New Client Demo Button */}
            <div className="pt-3 border-t border-stone-100 dark:border-stone-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-medium text-stone-600 dark:text-stone-400">
                  Or sign in with any custom Gmail:
                </label>
                <button
                  type="button"
                  onClick={() => setGoogleEmailInput('priya.sharma@gmail.com')}
                  className="text-[10px] text-[#675137] font-bold hover:underline"
                >
                  Try New Client
                </button>
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
                  <input
                    type="email"
                    value={googleEmailInput}
                    onChange={e => setGoogleEmailInput(e.target.value)}
                    placeholder="e.g. user@gmail.com"
                    className="w-full pl-8 pr-2 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#675137] text-stone-900"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (googleEmailInput.trim()) {
                      handleGoogleSelect(googleEmailInput.trim());
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#675137] hover:bg-[#52402B] text-white text-xs font-bold shadow-xs transition-colors"
                >
                  Continue
                </button>
              </div>
              <p className="text-[10px] text-stone-400 font-medium">
                Tip: Whitelisted Gmail <strong className="text-[#675137]">rohan.sethi12126@gmail.com</strong> logs in as Instructor. Any other Gmail logs in as a Client.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
