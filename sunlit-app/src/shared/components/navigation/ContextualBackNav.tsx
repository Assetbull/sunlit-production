'use client';

/**
 * ContextualBackNav — Global Contextual Back Navigation Component
 *
 * Replaces oversized breadcrumb bars with a minimal, accessible, and responsive
 * contextual back link: `← Back to [Context]`.
 *
 * Design Spec:
 *   - No background container (transparent, sits naturally in page hierarchy)
 *   - Arrow: Lucide ArrowLeft (15px) with subtle left shift on hover
 *   - "Back to": Secondary muted text (#707a6c)
 *   - Destination: Emphasized text (#1a1c1b default, #00490e on hover)
 *   - Deterministic destination: Uses explicit href, direct landings always work
 *   - Accessible: semantic <nav>, aria-label, visible focus ring, prefers-reduced-motion
 */

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export interface ContextualBackNavProps {
  /** Deterministic destination URL (e.g. "/services", "/locations", "/installers", "/blog", "/tools") */
  href: string;
  /** Destination context label (e.g. "Services", "Locations", "Installer Directory", "Blog", "Home") */
  label: string;
  /** Optional custom prefix text, defaults to "Back to" */
  prefix?: string;
  /** Optional max-width constraint for the inner wrapper (e.g. "1200px", "900px", or "none") */
  maxWidth?: string;
  /** Optional container padding (defaults to '1rem 1.5rem 0') */
  padding?: string;
  /** Optional CSS class names */
  className?: string;
  /** Optional inline style overrides for the outer wrapper */
  style?: React.CSSProperties;
}

export function ContextualBackNav({
  href,
  label,
  prefix = 'Back to',
  maxWidth = '1200px',
  padding,
  className = '',
  style,
}: ContextualBackNavProps) {
  const containerPadding = padding !== undefined ? padding : '1.25rem 1.5rem 0.5rem';

  return (
    <nav
      aria-label="Contextual navigation"
      className={`w-full bg-transparent ${className}`}
      style={{
        padding: containerPadding,
        ...style,
      }}
    >
      <div
        style={{
          maxWidth: maxWidth === 'none' ? '100%' : maxWidth,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Link
          href={href}
          aria-label={`${prefix} ${label}`}
          className="group inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-150 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00490e]"
          style={{
            fontFamily: 'Inter, sans-serif',
            textDecoration: 'none',
            color: '#707a6c',
          }}
        >
          <ArrowLeft
            size={15}
            className="transition-transform duration-150 ease-out group-hover:-translate-x-1 motion-reduce:transform-none shrink-0"
            style={{ color: '#707a6c' }}
            aria-hidden="true"
          />
          <span className="text-[#707a6c] group-hover:text-[#00490e] transition-colors duration-150">
            {prefix}
          </span>
          <span className="font-semibold text-[#1a1c1b] group-hover:text-[#00490e] transition-colors duration-150">
            {label}
          </span>
        </Link>
      </div>
    </nav>
  );
}
