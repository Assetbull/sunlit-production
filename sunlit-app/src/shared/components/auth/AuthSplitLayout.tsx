'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { SunlitLogo } from '@/shared/components/brand/SunlitLogo';

interface AuthSplitLayoutProps {
  visualImage: string;
  imageAlt?: string;
  headline?: string;
  subheadline?: string;
  badgeText?: string;
  floatingCard?: React.ReactNode;
  cardMaxWidth?: string;
  cardAccentColor?: string;
  children: React.ReactNode;
}

export function AuthSplitLayout({
  visualImage,
  imageAlt = 'Sunlit Energy renewable energy infrastructure',
  headline = 'Reliable solar energy projects, managed from start to finish.',
  subheadline = 'Connecting Nigerian property owners with verified installers and milestone escrow protection.',
  badgeText,
  floatingCard,
  cardMaxWidth = 'max-w-[480px]',
  cardAccentColor = 'from-[#0f631b] to-[#00490e]',
  children,
}: AuthSplitLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-background text-on-surface antialiased">
      {/* Left Panel: Editorial Visual & Overlay (Hidden on Mobile/Tablet) */}
      <section
        className="hidden lg:flex lg:w-1/2 relative bg-surface-variant overflow-hidden"
        aria-label="Brand Visuals"
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out hover:scale-105"
          style={{ backgroundImage: `url('${visualImage}')` }}
          role="img"
          aria-label={imageAlt}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#003006]/95 via-[#003006]/60 to-transparent z-0" />

        {/* Brand Anchor Header Top Left (Official Sunlit Logo) */}
        <div className="absolute top-10 left-10 z-10">
          <Link
            href="/"
            className="flex items-center hover:opacity-95 transition-opacity"
            aria-label="Sunlit Energy Home"
          >
            <SunlitLogo variant="horizontal" theme="dark" height={36} />
          </Link>
        </div>

        {/* Floating Custom Card or Bottom Text */}
        <div className="relative z-10 flex flex-col justify-end p-12 xl:p-16 h-full w-full max-w-[640px] text-white">
          {floatingCard ? (
            floatingCard
          ) : (
            <div className="space-y-4">
              {badgeText && (
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0f631b]/90 text-[#aef4a5] text-xs font-semibold uppercase tracking-wider border border-[#aef4a5]/20 backdrop-blur-md">
                  <ShieldCheck size={14} />
                  <span>{badgeText}</span>
                </div>
              )}
              <h1 className="font-headline text-3xl xl:text-4xl font-extrabold text-white leading-tight drop-shadow-sm">
                {headline}
              </h1>
              <p className="font-body text-base xl:text-lg text-[#aef4a5]/90 max-w-lg leading-relaxed">
                {subheadline}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Right Panel: Interactive Canvas */}
      <section className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-10 md:p-12 lg:p-16 bg-background relative overflow-y-auto min-h-screen">
        {/* Mobile Brand Header (Official Sunlit Logo) */}
        <div className="lg:hidden mb-8 text-center flex flex-col items-center gap-2">
          <Link href="/" className="flex items-center hover:opacity-90 transition-opacity" aria-label="Sunlit Energy Home">
            <SunlitLogo variant="horizontal" theme="light" height={32} />
          </Link>
        </div>

        {/* Card Container */}
        <div
          className={`w-full ${cardMaxWidth} bg-surface rounded-xl shadow-[0_20px_50px_rgba(0,48,6,0.06),0_2px_8px_rgba(0,48,6,0.04)] border border-outline-variant/60 p-8 sm:p-10 relative overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.2,0,0,1)]`}
        >
          {/* Top Accent Gradient Bar */}
          {cardAccentColor && (
            <div
              className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${cardAccentColor}`}
            />
          )}

          {children}
        </div>
      </section>
    </div>
  );
}
