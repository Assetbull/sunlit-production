'use client';

import { Store, Users, Lock, LayoutDashboard, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ServicesGridProps {
  onWaitlistOpen: () => void;
}

export function ServicesGrid({ onWaitlistOpen }: ServicesGridProps) {
  return (
    <section className="py-24 bg-surface relative" id="platform">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="mb-16 max-w-2xl">
          <h2 className="text-display-lg-mobile md:text-display-lg font-headline-xl text-on-surface mb-4 font-extrabold tracking-tight">
            One Intelligent Platform for Every Project Phase
          </h2>
          <p className="text-body-lg font-body-lg text-on-surface-variant leading-relaxed">
            Experience a seamless transition to solar. From initial discovery to final commissioning, our platform orchestrates every detail with engineered precision.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Card 1: Vetted Marketplace (Large) */}
          <div className="md:col-span-2 lg:col-span-2 bg-surface-container-lowest rounded-[24px] p-8 md:p-10 shadow-sm border border-surface-container-highest flex flex-col justify-between group overflow-hidden relative min-h-[360px]">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Store size={24} className="text-primary" />
              </div>
              <h3 className="text-2xl font-extrabold text-on-surface mb-3">Vetted Marketplace</h3>
              <p className="text-body-md text-on-surface-variant max-w-md leading-relaxed">
                Access a curated network of tier-one solar installers, engineers, and suppliers. Every professional undergoes rigorous compliance and quality verification.
              </p>
            </div>
            <div className="mt-8 relative z-10">
              <button
                onClick={onWaitlistOpen}
                className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:gap-3 transition-all cursor-pointer"
              >
                Browse Marketplace Network <ArrowRight size={16} />
              </button>
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:scale-125 transition-all duration-500 pointer-events-none" />
          </div>

          {/* Card 2: CrewLink */}
          <div className="md:col-span-1 lg:col-span-1 bg-surface-container-low rounded-[24px] p-6 shadow-sm border border-surface-container-highest flex flex-col justify-between group min-h-[220px]">
            <div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-on-surface">CrewLink</h3>
                <div className="w-10 h-10 rounded-full bg-secondary-container/50 flex items-center justify-center">
                  <Users size={20} className="text-secondary" />
                </div>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Real-time team coordination and site tracking for certified installers.
              </p>
            </div>
            <button
              onClick={onWaitlistOpen}
              className="mt-4 text-primary text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all cursor-pointer"
            >
              Explore CrewLink <ArrowRight size={14} />
            </button>
          </div>

          {/* Card 3: Secure Escrow */}
          <div className="md:col-span-1 lg:col-span-1 bg-surface-container-lowest rounded-[24px] p-6 shadow-sm border border-surface-container-highest flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-on-surface">Secure Escrow</h3>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Lock size={20} className="text-primary" />
                </div>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Milestone-based payouts ensure your funds are protected until work is verified.
              </p>
            </div>
            <Link
              href="/faq"
              className="mt-4 text-primary text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all"
            >
              How Escrow Works <ArrowRight size={14} />
            </Link>
          </div>

          {/* Card 4: Project Dashboard */}
          <div className="md:col-span-2 lg:col-span-2 bg-surface-container-lowest rounded-[24px] p-6 md:p-8 shadow-sm border border-surface-container-highest flex flex-col md:flex-row items-center gap-6 overflow-hidden relative min-h-[220px]">
            <div className="flex-1 relative z-10">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <LayoutDashboard size={20} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-2">Project Dashboard</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
                Track milestones, documentation, telemetry, and communication in one unified view.
              </p>
              <button
                onClick={onWaitlistOpen}
                className="text-primary text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all cursor-pointer"
              >
                Get Started <ArrowRight size={14} />
              </button>
            </div>

            {/* Dashboard Mockup Visual */}
            <div className="w-full md:w-1/2 h-36 bg-surface-container rounded-xl p-3 shadow-inner flex flex-col gap-2 border border-surface-container-highest">
              <div className="h-3 w-3/4 bg-primary/20 rounded" />
              <div className="h-3 w-1/2 bg-stone-300 rounded" />
              <div className="h-16 w-full bg-white rounded mt-auto flex items-end p-2 gap-1 border border-stone-200">
                <div className="w-1/4 h-1/3 bg-emerald-200 rounded-t" />
                <div className="w-1/4 h-2/3 bg-emerald-400 rounded-t" />
                <div className="w-1/4 h-full bg-emerald-700 rounded-t" />
                <div className="w-1/4 h-4/5 bg-emerald-500 rounded-t" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
