'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Compass } from 'lucide-react';
import { AuthSplitLayout } from '@/shared/components/auth/AuthSplitLayout';

const WELCOME_HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCzvevDeP1jekgdCEDtC7h-1xVQ6hbj7hNGaw1LwuYukHxmUT_-luho84P6U9U9bmHCzviwsSoKcd8dMgWTCjIQ4TPtwHLJBvW2mvMdClDEgM5-zTj5jRWtubgWLa8gBnj9ejtyQfxggsG1ClSHFfzMGFC7IGQ84nquUJC33ZWcdqOrKnxfvaMtMn9zgH_30CY9b5O2Kc5Cr5dd9htyxTtMgiZDBsN8rGLu9SFAxvVT0UEEt9ZiWCou';

export default function WelcomePage() {
  return (
    <AuthSplitLayout
      visualImage={WELCOME_HERO_IMAGE}
      headline="Your Solar Journey Starts Here"
      subheadline="Your Sunlit account gives you direct access to vetted installers, itemized project proposals, and milestone-protected escrow payments."
      badgeText="Account Activated"
      cardMaxWidth="max-w-[520px]"
    >
      <div className="flex flex-col items-center text-center space-y-6 py-4 animate-in fade-in zoom-in-95 duration-500">
        {/* Pulsing Success Badge */}
        <div className="relative w-24 h-24 rounded-full bg-surface-container-low flex items-center justify-center border border-outline-variant/30 shadow-sm">
          <div className="absolute inset-0 rounded-full border-2 border-primary-container/30 animate-ping opacity-75" />
          <div className="w-16 h-16 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container">
            <CheckCircle2 size={40} className="stroke-[2.3]" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2.5">
          <h1 className="font-headline text-3xl sm:text-4xl font-bold text-on-surface tracking-tight">
            Welcome to Sunlit
          </h1>
          <p className="font-body text-base text-on-surface-variant max-w-md mx-auto leading-relaxed">
            Your account has been created successfully. We’re excited to have you on the platform.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3.5 w-full pt-4 justify-center">
          <Link
            href="/login"
            className="flex-1 bg-primary-container hover:bg-primary text-white font-label text-sm sm:text-base py-3.5 px-6 rounded-lg transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(15,99,27,0.15)] hover:shadow-[0_8px_24px_rgba(15,99,27,0.25)] hover:-translate-y-0.5"
          >
            <span>Continue to Login</span>
            <ArrowRight size={18} />
          </Link>

          <Link
            href="/"
            className="flex-1 bg-surface-container-low hover:bg-surface-container border border-outline-variant/60 text-on-surface font-label text-sm sm:text-base py-3.5 px-6 rounded-lg transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] flex items-center justify-center gap-2"
          >
            <Compass size={18} />
            <span>Explore Sunlit</span>
          </Link>
        </div>
      </div>
    </AuthSplitLayout>
  );
}
