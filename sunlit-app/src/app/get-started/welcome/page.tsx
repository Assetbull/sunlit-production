'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, Activity, Cpu, ArrowRight, Loader2 } from 'lucide-react';
import { AuthSplitLayout } from '@/shared/components/auth/AuthSplitLayout';
import { SunlitLogo } from '@/shared/components/brand/SunlitLogo';
import { authService } from '@/services/auth.service';
import { dashboardPathForRole } from '@/shared/auth/sunlit-roles';

const GETTING_STARTED_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB8CHo-RIdxMCR2m-QqDj5Hrs9n-ltHCscV7DCPasixHORcYI6GUV60ZnSE2TsZuDiMtyBs_123u6Sl-TzfF1cUni7omn7fKHUBTBqV57ska9y98VpZYERa8o2arcRzr-LtsNyJf00fL4U8K5flm2xiCTXuXVB0Pd6FgSC4eXq3PQIO4o2FjwaxoX9OkJXEp0U22fmDUuIPuZrnqe-Qv_ZfI6b8rgBs78NWrF0rw0bPVighRAPCIDTZ';

function GettingStartedWelcomeInner() {
  const router = useRouter();
  const [userName, setUserName] = useState('Dr. Eleanor Vance');
  const [targetDashboard, setTargetDashboard] = useState('/dashboard/project-owner');

  useEffect(() => {
    const session = authService.getSession();
    if (session) {
      if (session.name) setUserName(session.name);
      setTargetDashboard(dashboardPathForRole(session.role));
    }
  }, []);

  const handleContinue = () => {
    router.push(targetDashboard);
  };

  const floatingStatusCard = (
    <div className="absolute bottom-12 left-12 p-5 sm:p-6 rounded-xl bg-surface/20 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
      <div className="flex items-center gap-3.5">
        <div className="w-8 h-8 rounded-lg bg-[#a4f69c] flex items-center justify-center text-[#002203]">
          <Zap size={18} className="fill-current" />
        </div>
        <div className="font-mono text-xs text-white tracking-widest uppercase font-semibold">
          System Status: Active
        </div>
      </div>
    </div>
  );

  return (
    <AuthSplitLayout
      visualImage={GETTING_STARTED_IMAGE}
      imageAlt="Modern renewable energy solar infrastructure"
      headline="Welcome to Sunlit Energy"
      subheadline="Your project workspace is ready. Access installer proposals, system designs, and milestone escrow details."
      floatingCard={floatingStatusCard}
      cardMaxWidth="max-w-[540px]"
    >
      <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-500">
        {/* Card Brand Header */}
        <div className="flex items-center gap-2">
          <SunlitLogo variant="horizontal" theme="light" height={28} />
        </div>

        {/* Header Content */}
        <header className="space-y-1.5">
          <h1 className="font-headline text-3xl sm:text-4xl font-bold text-on-surface tracking-tight">
            Welcome Back
          </h1>
          <h2 className="font-headline text-xl sm:text-2xl font-bold text-primary-container">
            {userName}
          </h2>
          <p className="font-body text-sm sm:text-base text-on-surface-variant pt-2 leading-relaxed">
            Your workspace is active. You can track project milestones, review installer bids, and monitor system performance from one place.
          </p>
        </header>

        {/* Benefits Grid */}
        <div className="flex flex-col gap-3.5 pt-2">
          {/* Benefit 1: Telemetry */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-surface border border-surface-container-highest hover:border-outline-variant hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-all duration-300">
            <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-white shrink-0 shadow-sm">
              <Activity size={20} />
            </div>
            <div className="flex flex-col space-y-0.5">
              <span className="font-label text-sm font-semibold text-on-surface">
                Real-time System Overview
              </span>
              <span className="font-body text-xs sm:text-sm text-on-surface-variant">
                Live monitoring of energy generation, battery charge, and load consumption.
              </span>
            </div>
          </div>

          {/* Benefit 2: Performance Insights */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-surface border border-surface-container-highest hover:border-outline-variant hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-all duration-300">
            <div className="w-10 h-10 rounded-lg bg-[#ceee93] flex items-center justify-center text-[#536d22] shrink-0 shadow-sm">
              <Cpu size={20} />
            </div>
            <div className="flex flex-col space-y-0.5">
              <span className="font-label text-sm font-semibold text-on-surface">
                Performance Insights
              </span>
              <span className="font-body text-xs sm:text-sm text-on-surface-variant">
                Monthly yield summaries, load forecasting, and estimated generator fuel savings.
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-outline-variant/30 flex justify-end">
          <button
            type="button"
            onClick={handleContinue}
            className="bg-primary-container hover:bg-primary text-white font-label text-sm sm:text-base px-8 py-3.5 sm:py-4 rounded-lg flex items-center gap-2 transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] shadow-[0_4px_12px_rgba(15,99,27,0.15)] hover:shadow-[0_8px_24px_rgba(15,99,27,0.25)] hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <span>Continue</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </AuthSplitLayout>
  );
}

export default function GettingStartedWelcomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="flex items-center gap-3 text-primary-container font-semibold">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading Workspace...</span>
          </div>
        </div>
      }
    >
      <GettingStartedWelcomeInner />
    </Suspense>
  );
}
