'use client';

import React from 'react';

export interface SunlitLogoProps {
  variant?: 'horizontal' | 'stacked' | 'mark';
  theme?: 'light' | 'dark' | 'auto';
  height?: number;
  showTagline?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function SunlitLogo({
  variant = 'horizontal',
  theme = 'light',
  height = 32,
  showTagline = false,
  className = '',
  style = {},
}: SunlitLogoProps) {
  const isDark = theme === 'dark';

  // Mark only (Hexagonal "S")
  if (variant === 'mark') {
    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        height={height}
        width={height}
        className={className}
        style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
        aria-label="Sunlit Energy Mark"
      >
        <defs>
          <linearGradient id="logo-mark-green" x1="10%" y1="100%" x2="90%" y2="0%">
            <stop offset="0%" stopColor={isDark ? '#48A136' : '#388E3C'} />
            <stop offset="45%" stopColor={isDark ? '#52C41A' : '#48A136'} />
            <stop offset="100%" stopColor={isDark ? '#8CE03E' : '#76B947'} />
          </linearGradient>
          <linearGradient id="logo-mark-slate" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isDark ? '#F1F5F9' : '#2D3748'} />
            <stop offset="100%" stopColor={isDark ? '#CBD5E1' : '#1A202C'} />
          </linearGradient>
        </defs>
        <path
          d="M 50,6 L 88,28 L 88,48 L 50,70 L 32,59.5 L 43.5,52.5 L 50,56.5 L 74,42.5 L 74,36 L 50,22 L 26,36 L 26,45 L 12,37 L 12,28 Z"
          fill="url(#logo-mark-slate)"
        />
        <path
          d="M 50,94 L 12,72 L 12,52 L 50,30 L 68,40.5 L 56.5,47.5 L 50,43.5 L 26,57.5 L 26,64 L 50,78 L 74,64 L 74,55 L 88,63 L 88,72 Z"
          fill="url(#logo-mark-green)"
        />
      </svg>
    );
  }

  // Stacked Lockup (Logomark + SUNLIT + ENERGY + Tagline)
  if (variant === 'stacked') {
    const width = Math.round((height * 320) / 280);
    return (
      <svg
        viewBox="0 0 320 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        height={height}
        width={width}
        className={className}
        style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
        aria-label="Sunlit Energy — Powering Africa. Empowering Futures."
      >
        <defs>
          <linearGradient id="logo-stacked-green" x1="10%" y1="100%" x2="90%" y2="0%">
            <stop offset="0%" stopColor={isDark ? '#48A136' : '#388E3C'} />
            <stop offset="45%" stopColor={isDark ? '#52C41A' : '#48A136'} />
            <stop offset="100%" stopColor={isDark ? '#8CE03E' : '#76B947'} />
          </linearGradient>
          <linearGradient id="logo-stacked-slate" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isDark ? '#F1F5F9' : '#2D3748'} />
            <stop offset="100%" stopColor={isDark ? '#CBD5E1' : '#1A202C'} />
          </linearGradient>
        </defs>

        <g transform="translate(105, 10) scale(1.1)">
          <path
            d="M 50,6 L 88,28 L 88,48 L 50,70 L 32,59.5 L 43.5,52.5 L 50,56.5 L 74,42.5 L 74,36 L 50,22 L 26,36 L 26,45 L 12,37 L 12,28 Z"
            fill="url(#logo-stacked-slate)"
          />
          <path
            d="M 50,94 L 12,72 L 12,52 L 50,30 L 68,40.5 L 56.5,47.5 L 50,43.5 L 26,57.5 L 26,64 L 50,78 L 74,64 L 74,55 L 88,63 L 88,72 Z"
            fill="url(#logo-stacked-green)"
          />
        </g>

        <text x="160" y="180" textAnchor="middle" fontFamily="'Manrope', 'Montserrat', 'Inter', sans-serif" fontSize="44" fontWeight="800" letterSpacing="2">
          <tspan fill={isDark ? '#FFFFFF' : '#1A202C'}>SUN</tspan>
          <tspan fill={isDark ? '#52C41A' : '#48A136'}>LIT</tspan>
        </text>

        <line x1="30" y1="210" x2="80" y2="210" stroke={isDark ? '#52C41A' : '#48A136'} strokeWidth="1.5" opacity="0.7" />
        <text x="160" y="215" textAnchor="middle" fontFamily="'Manrope', 'Montserrat', 'Inter', sans-serif" fontSize="16" fontWeight="700" fill={isDark ? '#E2E8F0' : '#1A202C'} letterSpacing="10">
          ENERGY
        </text>
        <line x1="240" y1="210" x2="290" y2="210" stroke={isDark ? '#52C41A' : '#48A136'} strokeWidth="1.5" opacity="0.7" />

        <text x="160" y="250" textAnchor="middle" fontFamily="'Manrope', 'Montserrat', 'Inter', sans-serif" fontSize="9.5" fontWeight="700" letterSpacing="2.5">
          <tspan fill={isDark ? '#CBD5E1' : '#1A202C'}>POWERING AFRICA. </tspan>
          <tspan fill={isDark ? '#52C41A' : '#48A136'}>EMPOWERING FUTURES.</tspan>
        </text>
      </svg>
    );
  }

  // Horizontal Lockup (Default: Mark + SUNLIT + ENERGY)
  const width = Math.round((height * 380) / 90);

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', flexShrink: 0 }}>
      <svg
        viewBox="0 0 380 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        height={height}
        width={width}
        className={className}
        style={{ display: 'block', flexShrink: 0, ...style }}
        aria-label="Sunlit Energy"
      >
        <defs>
          <linearGradient id="logo-horiz-green" x1="10%" y1="100%" x2="90%" y2="0%">
            <stop offset="0%" stopColor={isDark ? '#48A136' : '#388E3C'} />
            <stop offset="45%" stopColor={isDark ? '#52C41A' : '#48A136'} />
            <stop offset="100%" stopColor={isDark ? '#8CE03E' : '#76B947'} />
          </linearGradient>
          <linearGradient id="logo-horiz-slate" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isDark ? '#F1F5F9' : '#2D3748'} />
            <stop offset="100%" stopColor={isDark ? '#CBD5E1' : '#1A202C'} />
          </linearGradient>
        </defs>

        <g transform="translate(6, 5) scale(0.8)">
          <path
            d="M 50,6 L 88,28 L 88,48 L 50,70 L 32,59.5 L 43.5,52.5 L 50,56.5 L 74,42.5 L 74,36 L 50,22 L 26,36 L 26,45 L 12,37 L 12,28 Z"
            fill="url(#logo-horiz-slate)"
          />
          <path
            d="M 50,94 L 12,72 L 12,52 L 50,30 L 68,40.5 L 56.5,47.5 L 50,43.5 L 26,57.5 L 26,64 L 50,78 L 74,64 L 74,55 L 88,63 L 88,72 Z"
            fill="url(#logo-horiz-green)"
          />
        </g>

        <text x="96" y="50" fontFamily="'Manrope', 'Montserrat', 'Inter', sans-serif" fontSize="44" fontWeight="800" letterSpacing="1">
          <tspan fill={isDark ? '#FFFFFF' : '#1A202C'}>SUN</tspan>
          <tspan fill={isDark ? '#52C41A' : '#48A136'}>LIT</tspan>
        </text>

        <text x="98" y="74" fontFamily="'Manrope', 'Montserrat', 'Inter', sans-serif" fontSize="15" fontWeight="700" fill={isDark ? '#E2E8F0' : '#1A202C'} letterSpacing="9">
          ENERGY
        </text>
      </svg>

      {showTagline && (
        <div
          style={{
            fontFamily: "'Manrope', 'Inter', sans-serif",
            fontSize: '9px',
            fontWeight: 700,
            letterSpacing: '1.5px',
            marginTop: '4px',
            color: isDark ? '#CBD5E1' : '#1A202C',
            textTransform: 'uppercase',
          }}
        >
          <span>Powering Africa. </span>
          <span style={{ color: isDark ? '#52C41A' : '#48A136' }}>Empowering Futures.</span>
        </div>
      )}
    </div>
  );
}
