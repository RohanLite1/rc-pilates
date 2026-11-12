import React from 'react';

export interface StudioLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'transparent' | 'solid';
  className?: string;
  alt?: string;
  withRing?: boolean;
}

const sizeMap = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
  xl: 'w-20 h-20',
  '2xl': 'w-28 h-28'
};

export const StudioLogo: React.FC<StudioLogoProps> = ({
  size = 'md',
  variant = 'transparent',
  className = '',
  alt = 'RC Pilates & Fitness Studio Official Logo',
  withRing = false
}) => {
  const src = variant === 'transparent' ? '/logo-transparent.png' : '/logo.png';
  const sizeClass = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 rounded-full select-none overflow-hidden ${
        withRing ? 'ring-2 ring-[#D5C0A4]/70 shadow-xs' : ''
      } ${sizeClass} ${className}`}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain pointer-events-none drop-shadow-xs"
        loading="eager"
        decoding="async"
      />
    </div>
  );
};

