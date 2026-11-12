import React, { useState, useEffect } from 'react';
import { StudioLogo } from './StudioLogo';

interface StartupAnimationProps {
  onFinish?: () => void;
}

export const StartupAnimation: React.FC<StartupAnimationProps> = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isFading, setIsFading] = useState<boolean>(false);

  useEffect(() => {
    // 1. Start fading out after 1.5s
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 1500);

    // 2. Unmount after fade completes at 2.0s
    const unmountTimer = setTimeout(() => {
      setIsVisible(false);
      if (onFinish) onFinish();
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
    };
  }, [onFinish]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#F9F6F0] text-[#2D251E] transition-opacity duration-500 ease-out select-none pointer-events-auto ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background ambient warm aura */}
      <div className="relative flex flex-col items-center">
        {/* Animated breathing rings */}
        <div className="absolute -inset-10 rounded-full bg-[#EADCCE]/40 animate-ping opacity-30 pointer-events-none" />
        <div className="absolute -inset-6 rounded-full bg-[#F2E9DC]/60 animate-pulse pointer-events-none" />

        {/* Center studio logo emblem */}
        <div className="relative w-28 h-28 rounded-full bg-[#FAF6F0] p-1 flex items-center justify-center shadow-[0_10px_35px_rgba(103,81,55,0.22)] ring-4 ring-[#E6D7C3] transform transition-transform duration-700 hover:scale-105 overflow-hidden">
          <StudioLogo size="2xl" variant="transparent" className="w-full h-full" />
        </div>

        {/* Studio Branding */}
        <div className="mt-6 text-center space-y-1">
          <h1 className="font-serif font-bold text-3xl tracking-tight text-[#2D251E]">
            RC Pilates
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#7B6244] font-semibold">
            Fitness &amp; Reformer Studio
          </p>
        </div>

        {/* Mindful subtext */}
        <p className="mt-8 text-xs text-[#A68B69] font-light italic">
          Mindful Movement • Deeply Tailored
        </p>

        {/* Subtle breathing progress bar */}
        <div className="mt-6 w-32 h-1 rounded-full bg-[#E6D7C3] overflow-hidden">
          <div className="h-full bg-[#675137] rounded-full animate-[progress_1.6s_ease-in-out_infinite]" style={{ width: '60%' }} />
        </div>
      </div>
    </div>
  );
};
