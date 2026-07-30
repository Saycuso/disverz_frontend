"use client";

interface BrandLogoProps {
  className?: string;
}

export function BrandLogo({ className = "w-8 h-8" }: BrandLogoProps) {
  return (
    <svg 
      viewBox="0 0 40 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <defs>
        {/* Disverz Signature Gradient */}
        <linearGradient id="disverz-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff5500" /> {/* Brand Orange */}
          <stop offset="100%" stopColor="#a855f7" /> {/* Brand Purple */}
        </linearGradient>
        
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer Flame Shell */}
      <path 
        d="M20 4C20 4 8 14 8 24C8 30.627 13.373 36 20 36C26.627 36 32 30.627 32 24C32 14 20 4 20 4Z" 
        stroke="url(#disverz-grad)" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* The Live Pulse Line */}
      <path 
        d="M9 24 H 14 L 17 15 L 22 32 L 26 24 H 31" 
        stroke="url(#disverz-grad)" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        filter="url(#glow)"
      />
    </svg>
  );
}