import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  AlertCircle,
  Sliders,
  Apple
} from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { StudioLogo } from '../common/StudioLogo';
import { initGoogleAuth, triggerGoogleSignIn, GOOGLE_CLIENT_ID } from '../../services/googleAuthService';
import { auth as camAuth, AuthProvider } from 'capacitor-auth-manager';

// Initialize capacitor-auth-manager once with studio Google OAuth Client ID
try {
  camAuth.configure({
    providers: {
      [AuthProvider.GOOGLE]: {
        clientId: GOOGLE_CLIENT_ID,
        serverClientId: GOOGLE_CLIENT_ID,
        webFlow: 'popup',
        androidFlow: 'auto'
      }
    },
    persistence: 'local'
  });
} catch (e) {
  console.warn('camAuth configure notice:', e);
}

export const LoginModal: React.FC = () => {
  const { loginWithGoogle } = useApp();

  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);

  // Initialize official Google Identity Services (GIS) on web
  useEffect(() => {
    initGoogleAuth(
      googleUser => {
        loginWithGoogle(googleUser.email, googleUser.name, googleUser.picture);
      },
      err => {
        console.warn('Google Auth Error:', err);
      }
    );
  }, []);

  const handleGoogleClick = async () => {
    setErrorMsg('');

    // A. Native Android APK: Native Google Play Services Account Chooser Bottom-Sheet
    if (Capacitor.isNativePlatform()) {
      setIsSigningIn(true);
      try {
        const result = await camAuth.signIn(AuthProvider.GOOGLE);
        if (result?.user?.email) {
          loginWithGoogle(
            result.user.email,
            result.user.displayName || undefined,
            result.user.photoURL || undefined
          );
          setIsSigningIn(false);
          return;
        }
      } catch (nativeErr: any) {
        console.warn('Native Google sign-in note:', nativeErr);
        const errMsg = nativeErr?.message || '';
        // If user cancelled, don't show an error
        if (
          nativeErr?.code !== 'CANCELED' &&
          !errMsg.toLowerCase().includes('cancel') &&
          nativeErr?.code !== '12501'
        ) {
          setErrorMsg(errMsg || 'Google Sign-In failed. Please try again.');
        }
        setIsSigningIn(false);
        return;
      }
      setIsSigningIn(false);
      return;
    }

    // B. Web Platform (Vercel, Safari, Chrome):
    // Synchronously open Google Identity Services OAuth popup in the click gesture
    try {
      const triggered = triggerGoogleSignIn();
      if (!triggered) {
        // If GIS token client wasn't initialized yet, try camAuth popup
        setIsSigningIn(true);
        const result = await camAuth.signIn(AuthProvider.GOOGLE);
        if (result?.user?.email) {
          loginWithGoogle(
            result.user.email,
            result.user.displayName || undefined,
            result.user.photoURL || undefined
          );
        }
        setIsSigningIn(false);
      }
    } catch (webErr: any) {
      console.warn('Web Google sign-in note:', webErr);
      const errMsg = webErr?.message || '';
      if (!errMsg.toLowerCase().includes('cancel') && !errMsg.toLowerCase().includes('closed')) {
        setErrorMsg('Google Sign-In was unable to complete. Please try again.');
      }
      setIsSigningIn(false);
    }
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

        {/* Auth Box - Official Google Authentication */}
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

          {/* The Single Sign-In Action: Official Google Sign-In */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleGoogleClick}
              disabled={isSigningIn}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl bg-white hover:bg-stone-50 border-2 border-stone-200 hover:border-[#675137]/30 shadow-md text-sm font-bold text-stone-800 transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              {/* Google G Logo */}
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
    </div>
  );
};
