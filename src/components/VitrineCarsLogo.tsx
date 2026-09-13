import React from 'react';

interface VitrineCarsLogoProps {
  className?: string;
}

export const VitrineCarsLogo: React.FC<VitrineCarsLogoProps> = ({ className = 'h-6 w-auto' }) => {
  return (
    <svg
      viewBox="0 0 440 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Vitrine Cars"
    >
      <defs>
        {/* Badge Background Gradient */}
        <linearGradient id="vcBadgeBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2575FC" />
          <stop offset="50%" stopColor="#0052D4" />
          <stop offset="100%" stopColor="#00359E" />
        </linearGradient>

        {/* Glass Reflection */}
        <linearGradient id="vcBadgeGlass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        {/* Badge Inner Border */}
        <linearGradient id="vcBadgeBorder" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.4" />
        </linearGradient>

        {/* Vitrine Text Metallic White Gradient */}
        <linearGradient id="vcVitrineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="70%" stopColor="#F8FAFC" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>

        {/* CARS Vibrant Cyan-Blue Gradient */}
        <linearGradient id="vcCarsGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00D2FF" />
          <stop offset="50%" stopColor="#0088FF" />
          <stop offset="100%" stopColor="#0055FF" />
        </linearGradient>

        {/* Drop Shadow & Neon Glow */}
        <filter id="vcGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="6" floodColor="#0070F3" floodOpacity="0.5" />
        </filter>

        <filter id="vcDividerGlow" x="-50%" y="-20%" width="200%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#38BDF8" floodOpacity="0.7" />
        </filter>
      </defs>

      {/* Left Icon Badge */}
      <g filter="url(#vcGlow)">
        {/* Outer Rounded Square */}
        <rect
          x="8"
          y="8"
          width="84"
          height="84"
          rx="22"
          fill="url(#vcBadgeBg)"
          stroke="url(#vcBadgeBorder)"
          strokeWidth="2"
        />

        {/* Top Glass Highlight */}
        <path
          d="M 8 30 C 8 17.85 17.85 8 30 8 L 70 8 C 82.15 8 92 17.85 92 30 L 92 36 L 22 92 L 14 92 C 10.69 92 8 89.31 8 86 Z"
          fill="url(#vcBadgeGlass)"
        />

        {/* Wheels */}
        <circle cx="36" cy="57" r="5" fill="#FFFFFF" />
        <circle cx="64" cy="57" r="5" fill="#FFFFFF" />
        <circle cx="36" cy="57" r="2.2" fill="#0052D4" />
        <circle cx="64" cy="57" r="2.2" fill="#0052D4" />

        {/* Car Silhouette Line */}
        <path
          d="M 23 56 
             L 28 56 
             A 7.5 7.5 0 0 1 43.5 56 
             L 56.5 56 
             A 7.5 7.5 0 0 1 72 56 
             L 77 56 
             Q 79 53 78 48 
             L 67 46 
             L 55 35 
             Q 46 34 38 35 
             L 29 45 
             L 23 47 
             Q 21 51 23 56 Z"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Vertical Divider */}
      <line
        x1="108"
        y1="22"
        x2="108"
        y2="78"
        stroke="#38BDF8"
        strokeWidth="3"
        strokeLinecap="round"
        filter="url(#vcDividerGlow)"
      />

      {/* VITRINE Text */}
      <text
        x="122"
        y="65"
        fontFamily="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
        fontWeight="900"
        fontSize="48"
        letterSpacing="-1.5"
        fill="url(#vcVitrineGrad)"
      >
        VITRINE
      </text>

      {/* CARS Text */}
      <text
        x="312"
        y="65"
        fontFamily="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
        fontWeight="900"
        fontSize="48"
        letterSpacing="-1.5"
        fill="url(#vcCarsGrad)"
      >
        CARS
      </text>
    </svg>
  );
};
