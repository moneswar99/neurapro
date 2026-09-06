import React from 'react';

interface NeuraMorphixLogoProps {
  className?: string;
  size?: number;
}

export const NeuraMorphixLogo: React.FC<NeuraMorphixLogoProps> = ({
  className = '',
  size = 40,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} drop-shadow-[0_0_12px_rgba(56,189,248,0.5)] transition-transform duration-300 hover:scale-105 select-none`}
    >
      <defs>
        {/* Main Ribbon Gradient */}
        <linearGradient id="nmx-infinity-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="35%" stopColor="#a855f7" />
          <stop offset="65%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>

        {/* Glow Filter */}
        <filter id="nmx-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Futuristic 3D Infinity Ribbon Path */}
      <g filter="url(#nmx-glow)">
        {/* Back Loop Shade */}
        <path
          d="M 30,50 C 15,30 15,70 30,70 C 45,70 55,30 70,30 C 85,30 85,70 70,70 C 55,70 45,30 30,30 C 15,30 15,70 30,50 Z"
          fill="none"
          stroke="url(#nmx-infinity-grad)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Inner Highlight Loop */}
        <path
          d="M 30,50 C 15,32 15,68 30,68 C 45,68 55,32 70,32 C 85,32 85,68 70,68 C 55,68 45,32 30,32 C 15,32 15,68 30,50 Z"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeOpacity="0.4"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
};
