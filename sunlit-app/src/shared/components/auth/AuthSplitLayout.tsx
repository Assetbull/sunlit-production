'use client';

import React from 'react';
import Link from 'next/link';
import { Sun, ShieldCheck } from 'lucide-react';

interface AuthSplitLayoutProps {
  visualImage: string;
  imageAlt?: string;
  brandTitle?: string;
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
  brandTitle = 'Sunlit Energy',
  headline = 'Powering Africa’s Intelligent Energy Future.',
  subheadline = 'The sovereign grid system designed for stability, precision, and sustainability.',
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

        {/* Brand Anchor Header Top Left */}
        <div className="absolute top-10 left-10 z-10">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-white hover:opacity-90 transition-opacity"
          >
            <div className="w-10 h-10 rounded-xl bg-[#0f631b] flex items-center justify-center text-[#aef4a5] shadow-sm border border-[#aef4a5]/20">
              <Sun size={22} className="stroke-[2.5]" />
            </div>
            <span className="font-headline text-2xl font-bold tracking-tight text-white drop-shadow-sm">
              {brandTitle}
            </span>
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
        {/* Mobile Brand Header */}
        <div className="lg:hidden mb-8 text-center flex flex-col items-center gap-2">
          <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-90 transition-opacity">
            <div className="w-9 h-9 rounded-lg bg-primary-container flex items-center justify-center text-white shadow-sm">
              <Sun size={20} />
            </div>
            <span className="font-headline text-xl font-bold tracking-tight text-primary">
              Sunlit Energy
            </span>
          </Link>
        </div>

        {/* Card Container */}
        <div
          className={`w-full ${cardMaxWidth} bg-surface-container-lowest rounded-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05),0_0_10px_rgba(0,0,0,0.02)] border border-outline-variant/30 p-8 sm:p-10 relative overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.2,0,0,1)]`}
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
