import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Smartphone, Monitor, RotateCcw, UserCheck, Shield, Sparkles } from 'lucide-react';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const {
    isDeviceFrame,
    setIsDeviceFrame,
    currentUser,
    instructor,
    clients,
    switchUser,
    refreshState
  } = useApp();

  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-stone-200/70 text-stone-900 flex flex-col items-center justify-start p-2 sm:p-4 md:p-6 transition-all duration-300">
      {/* Top Laptop Testing Control Bar */}
      <header className="w-full max-w-4xl bg-white/95 backdrop-blur-md rounded-2xl shadow-ambient px-4 py-2.5 mb-4 flex flex-wrap items-center justify-between gap-3 border border-stone-200/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-stone-800 tracking-tight text-sm">
                RC Pilates &amp; Fitness Studio Android Testbed
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Light & Ambient
              </span>
            </div>
            <p className="text-xs text-stone-700">
              Testing locally on your laptop before Android APK export
            </p>
          </div>
        </div>

        {/* View Mode & Quick User Switcher */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* Quick Switch Persona */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
            <button
              onClick={() => switchUser(instructor)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all ${
                currentUser?.role === 'instructor'
                  ? 'bg-white shadow-sm text-emerald-900 font-semibold'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
              title="Test as Pilates Instructor (Can mark attendance, set timeslot, edit studio diet plan)"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-800" />
              <span>Instructor Sarah</span>
            </button>

            <button
              onClick={() => switchUser(clients[0])}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all ${
                currentUser?.id === clients[0].id
                  ? 'bg-white shadow-sm text-stone-900 font-semibold'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
              title="Test as Client Elena (Views class attendance, calendar, and studio diet plan)"
            >
              <UserCheck className="w-3.5 h-3.5 text-stone-800" />
              <span>Client Elena</span>
            </button>

            {clients[1] && (
              <button
                onClick={() => switchUser(clients[1])}
                className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all ${
                  currentUser?.id === clients[1].id
                    ? 'bg-white shadow-sm text-stone-900 font-semibold'
                    : 'text-stone-700 hover:text-stone-900'
                }`}
                title="Test as Client Marcus"
              >
                <span>Marcus</span>
              </button>
            )}
          </div>

          {/* Toggle Device Frame / Fullscreen */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
            <button
              onClick={() => setIsDeviceFrame(true)}
              className={`p-1.5 rounded-lg transition-all flex items-center gap-1 ${
                isDeviceFrame
                  ? 'bg-white shadow-sm text-stone-900 font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Mobile Device Mockup Frame"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Phone Frame</span>
            </button>
            <button
              onClick={() => setIsDeviceFrame(false)}
              className={`p-1.5 rounded-lg transition-all flex items-center gap-1 ${
                !isDeviceFrame
                  ? 'bg-white shadow-sm text-stone-900 font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Full Window View"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Full Window</span>
            </button>
          </div>

          {/* Reset Demo Data */}
          <button
            onClick={refreshState}
            className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 transition-colors"
            title="Reset to initial studio data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      {isDeviceFrame ? (
        /* Simulated Android Phone Frame */
        <div className="relative w-full max-w-[420px] h-[860px] bg-stone-900 rounded-[50px] p-3 shadow-2xl border-4 border-stone-800/80 ring-1 ring-black/10 flex flex-col transition-all">
          {/* Inner Screen */}
          <div className="relative w-full h-full bg-[#FAF8F5] rounded-[42px] overflow-hidden flex flex-col shadow-inner">
            {/* Android Status Bar */}
            <div className="w-full h-9 bg-transparent px-6 flex items-center justify-between text-xs text-stone-800 select-none z-50 pt-1">
              <span className="font-semibold tracking-tight text-[13px]">{time || '09:41'}</span>

              {/* Camera Notch Punch Hole */}
              <div className="w-4 h-4 rounded-full bg-stone-900/90 shadow-sm border border-stone-700/30 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-stone-800/50" />
              </div>

              {/* Status Icons */}
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-stone-700">
                <span>5G</span>
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L12 22l7.03-4.39C20.26 16.07 21 14.12 21 12c0-4.97-4.03-9-9-9z" />
                </svg>
                <div className="flex items-center gap-0.5">
                  <div className="w-5 h-2.5 border border-stone-700 rounded-sm p-0.5 flex items-center">
                    <div className="h-full bg-stone-700 rounded-2xs w-[85%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Mobile App Body */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col relative pb-6">
              {children}
            </div>

            {/* Android Home Navigation Bar */}
            <div className="w-full h-5 bg-transparent flex items-center justify-center pointer-events-none pb-1 z-50">
              <div className="w-32 h-1 bg-stone-400/60 rounded-full" />
            </div>
          </div>
        </div>
      ) : (
        /* Full Window Mode */
        <div className="w-full max-w-4xl bg-[#FAF8F5] min-h-[750px] rounded-3xl shadow-ambient-lg border border-stone-200 overflow-hidden flex flex-col relative">
          <div className="flex-1 overflow-y-auto flex flex-col">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

