import React from 'react';
import Link from 'next/link';

interface BrandLogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
  href?: string;
}

export default function BrandLogo({
  variant = 'light',
  size = 'md',
  showSubtitle = true,
  className = '',
  href = '/',
}: BrandLogoProps) {
  const isLight = variant === 'light';

  // Sizing definitions
  const dimensions = {
    sm: { icon: 32, title: 'text-xs sm:text-sm font-black', sub: 'text-[9px]' },
    md: { icon: 38, title: 'text-sm sm:text-base lg:text-lg font-black', sub: 'text-[9px] sm:text-[10px]' },
    lg: { icon: 48, title: 'text-lg sm:text-xl md:text-2xl font-black', sub: 'text-xs' },
  }[size];

  const content = (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Architectural Navy & White Emblem */}
      <div
        className="relative flex items-center justify-center rounded-xl overflow-hidden shadow-md flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
        style={{
          width: dimensions.icon,
          height: dimensions.icon,
          background: 'linear-gradient(135deg, #07101E 0%, #0B192C 50%, #152A4A 100%)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
        }}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4/5 h-4/5 text-white"
        >
          {/* Subtle grid background */}
          <path
            d="M6 42H42"
            stroke="#38BDF8"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.4"
          />
          {/* Main Tower Silhouette */}
          <path
            d="M18 42V10L30 6V42"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Second Tower Silhouette */}
          <path
            d="M30 18L40 22V42"
            stroke="#38BDF8"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Low Rise Side Tower */}
          <path
            d="M8 26L18 22"
            stroke="#E0F2FE"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M8 26V42"
            stroke="#E0F2FE"
            strokeWidth="2"
          />
          {/* Architectural Window Elements */}
          <line x1="22" y1="14" x2="26" y2="14" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="22" y1="19" x2="26" y2="19" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="22" y1="24" x2="26" y2="24" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="22" y1="29" x2="26" y2="29" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="22" y1="34" x2="26" y2="34" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
          {/* Sun / Target Dot */}
          <circle cx="12" cy="12" r="2.5" fill="#38BDF8" />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-black tracking-tight uppercase font-sans whitespace-nowrap ${dimensions.title} ${
              isLight ? 'text-white' : 'text-brand-navy'
            }`}
          >
            RENTALS IN <span className={isLight ? 'text-sky-400' : 'text-sky-600'}>KENYA</span>
          </span>
        </div>
        {showSubtitle && (
          <span
            className={`font-medium tracking-widest uppercase hidden sm:block ${dimensions.sub} ${
              isLight ? 'text-sky-200/80' : 'text-slate-500'
            }`}
          >
            Airbnb & Rental Investments
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}
