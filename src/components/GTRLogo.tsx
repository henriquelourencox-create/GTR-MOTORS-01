import React, { useState } from 'react';

interface GTRLogoProps {
  className?: string;
  showSlogan?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'compact' | 'badge';
}

export const GTRLogo: React.FC<GTRLogoProps> = ({
  className = '',
  showSlogan = false,
  size = 'md',
}) => {
  const [imgError, setImgError] = useState(false);
  const driveImgSrc = 'https://lh3.googleusercontent.com/d/1paXGwpJPj4Qstt9Gx8VSZEREOGHazVqL=w600';

  const sizeConfigs = {
    sm: {
      badge: 'h-8 w-8 rounded-lg',
      logoHeight: 'h-7',
      title: 'text-base sm:text-lg',
      subtitle: 'text-[8px] tracking-[0.25em]',
    },
    md: {
      badge: 'h-10 w-10 rounded-xl',
      logoHeight: 'h-9',
      title: 'text-xl sm:text-2xl',
      subtitle: 'text-[9px] tracking-[0.3em]',
    },
    lg: {
      badge: 'h-12 w-12 rounded-xl',
      logoHeight: 'h-11',
      title: 'text-2xl sm:text-3xl',
      subtitle: 'text-[10px] tracking-[0.35em]',
    },
  };

  const config = sizeConfigs[size] || sizeConfigs.md;

  return (
    <div className={`flex items-center select-none group cursor-pointer ${className}`}>
      {/* Brand Icon Emblem - Clean High-Res Image with soft rounded corners */}
      <div className="relative flex items-center justify-center shrink-0">
        <div className="relative flex items-center justify-center p-0.5">
          {!imgError ? (
            <img
              src={driveImgSrc}
              alt="GTR MOTORS"
              className="h-10 sm:h-12 w-auto max-w-[200px] object-contain rounded-lg filter drop-shadow-[0_2px_10px_rgba(213,1,4,0.3)] group-hover:scale-105 transition-transform duration-300"
              onError={() => setImgError(true)}
              referrerPolicy="no-referrer"
              loading="eager"
            />
          ) : (
            <div className="bg-[#d50104] px-3 py-1.5 rounded-lg flex items-center justify-center shadow-lg">
              <span className="font-black italic text-white text-base tracking-tight">GTR MOTORS</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

