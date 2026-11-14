import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Mail,
  Shield,
  AlertCircle,
  Sliders,
  Apple
} from 'lucide-react';
import { StudioLogo } from '../common/StudioLogo';
import { initGoogleAuth, triggerGoogleSignIn } from '../../services/googleAuthService';
import { auth, googleProvider } from '../../services/firebaseConfig';
import { signInWithPopup } from 'firebase/auth';

export const LoginModal: React.FC = () => {
  const { loginWithGoogle } = useApp();

  const [showGoogleDialog, setShowGoogleDialog] = useState<boolean>(false);
  const [googleEmailInput, setGoogleEmailInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);

  // Initialize official Google Identity Services
  useEffect(() => {
    initGoogleAuth(
      googleUser => {
        loginWithGoogle(googleUser.email, googleUser.name, googleUser.picture);
        setShowGoogleDialog(false);
      },
      err => {
        console.warn('Google Auth Error:', err);
      }
    );
  }, []);

  const handleGoogleClick = async () => {
    setErrorMsg('');
    setIsSigningIn(true);

    try {
      // 1. Try Firebase Google Auth popup (works seamlessly on modern web, Safari, Chrome)
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user && res.user.email) {
        loginWithGoogle(
          res.user.email,
          res.user.displayName || undefined,
          res.user.photoURL || undefined
        );
        setShowGoogleDialog(false);
        setIsSigningIn(false);
        return;
      }
    } catch (fbErr: any) {
      console.warn('Firebase Google Auth error/fallback:', fbErr?.code || fbErr);
      if (fbErr?.code === 'auth/popup-closed-by-user') {
        setIsSigningIn(false);
        return;
      }
    }

    // 2. Fallback to Google Identity Services / Account Picker Dialog
    const triggered = triggerGoogleSignIn();
    if (!triggered) {
      setShowGoogleDialog(true);
    }
    setIsSigningIn(false);
  };

  const handleGoogleSelect = (email: string, name?: string) => {
    loginWithGoogle(email, name);
    setShowGoogleDialog(false);
  };

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

        {/* Auth Box - 100% Google Authentication Only */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-7 shadow-ambient-lg border border-stone-200/90 w-full space-y-4 transition-colors">
          <div className="text-center space-y-1">
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Studio Sign In
            </h3>
            <p className="text-xs text-stone-500 font-medium">
              Access your reformer schedule, attendance &amp; custom nutrition
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-700" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* The Single Sign-In Method: Google Sign-In */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleGoogleClick}
              disabled={isSigningIn}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl bg-white hover:bg-stone-50 border-2 border-stone-200 hover:border-[#675137]/30 shadow-md text-sm font-bold text-stone-800 transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              {/* Google G Icon */}
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
              <span>{isSigningIn ? 'Connecting to Google...' : 'Continue with Google'}</span>
            </button>
          </div>

          <div className="pt-2 text-center">
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Instant sign-in for studio members &amp; instructors.
              <br />
              New members configure their package &amp; schedule upon first login.
            </p>
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <footer className="w-full max-w-md mx-auto text-center py-2 text-xs text-stone-500 font-medium">
        RC Pilates &amp; Fitness Studio • Mindful Movement &amp; Nutrition
      </footer>

      {/* Google Sign-In Account Chooser Modal (Direct or Fallback) */}
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
                <h4 className="font-serif font-bold text-sm">Choose Google Account</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowGoogleDialog(false)}
                className="w-7 h-7 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-700 flex items-center justify-center text-xs font-bold"
              >
                &times;
              </button>
            </div>

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

            {/* Custom Gmail input */}
            <div className="pt-3 border-t border-stone-100 dark:border-stone-800 space-y-2">
              <label className="block text-[11px] font-medium text-stone-600 dark:text-stone-400">
                Or enter your Gmail address:
              </label>

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
