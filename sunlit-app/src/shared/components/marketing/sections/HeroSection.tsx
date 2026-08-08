'use client';

import Link from 'next/link';
import { ArrowRight, Zap, ShieldCheck, Sun, Calculator, Search, Calendar } from 'lucide-react';

interface HeroSectionProps {
  onWaitlistOpen: () => void;
}

export function HeroSection({ onWaitlistOpen }: HeroSectionProps) {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      aria-label="Hero Introduction"
      className="relative min-h-[850px] flex items-center pt-12 pb-24 overflow-hidden bg-surface"
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-secondary-container/30 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-surface-container-high/50 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4 pointer-events-none" />

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center relative z-10 w-full">
        {/* Left Content */}
        <div className="lg:col-span-6 flex flex-col items-start gap-6">
          {/* AI Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-low border border-outline-variant/30 rounded-full">
            <Zap size={16} className="text-secondary fill-secondary" />
            <span className="text-label-sm font-label-sm text-on-surface-variant font-medium">
              AI-Ready Renewable Energy Platform
            </span>
          </div>

          <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg-mobile md:font-display-lg text-on-surface leading-[1.1] tracking-tight">
            Power Your Property with Intelligent <span className="text-primary">Renewable Energy</span>
          </h1>

          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-xl leading-relaxed">
            Compare verified solar installers, EPC contractors and renewable energy experts to design, install and manage residential, commercial and industrial renewable energy projects across Nigeria.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mt-2">
            <button
              onClick={onWaitlistOpen}
              className="w-full sm:w-auto bg-primary text-on-primary px-8 py-4 rounded-full text-label-sm font-label-sm hover:bg-primary-container hover:text-on-primary-container hover:shadow-lg transition-all duration-300 flex justify-center items-center gap-2 font-bold cursor-pointer"
            >
              Get Free Solar Quote
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => scrollToSection('built-for-everyone')}
              className="w-full sm:w-auto bg-transparent border border-outline-variant text-on-surface px-8 py-4 rounded-full text-label-sm font-label-sm hover:bg-surface-container hover:border-transparent transition-all duration-300 flex justify-center items-center font-semibold cursor-pointer"
            >
              Explore Solutions
            </button>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 pt-6 border-t border-surface-container-highest w-full">
            <p className="text-mono-label font-mono-label text-on-surface-variant uppercase tracking-wider mb-3 text-xs font-semibold">
              Quick Actions
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/tools/solar-system-sizing"
                className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-lowest rounded-full border border-surface-container-highest text-label-sm font-label-sm hover:border-primary transition-all duration-200 text-on-surface font-medium"
              >
                <Zap size={16} className="text-primary" /> Solar Cost Calculator
              </Link>
              <button
                onClick={onWaitlistOpen}
                className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-lowest rounded-full border border-surface-container-highest text-label-sm font-label-sm hover:border-primary transition-all duration-200 text-on-surface font-medium cursor-pointer"
              >
                <ShieldCheck size={16} className="text-primary" /> Compare Installers
              </button>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-lowest rounded-full border border-surface-container-highest text-label-sm font-label-sm hover:border-primary transition-all duration-200 text-on-surface font-medium"
              >
                <Sun size={16} className="text-primary" /> Book Consultation
              </Link>
            </div>
          </div>
        </div>

        {/* Right Visual: Interactive Marketplace Cards */}
        <div className="lg:col-span-6 relative h-[560px] w-full hidden lg:block">
          <div
            className="absolute inset-0 bg-cover bg-center rounded-[3rem] shadow-xl w-full h-full border border-surface-container-highest/60"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=1600&auto=format&fit=crop')`,
            }}
          >
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-[3rem]" />
          </div>

          {/* Floating UI Card 1: Verified Pro */}
          <div className="absolute top-10 -left-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl w-64 border border-stone-200 animate-[bounce_6s_infinite_ease-in-out]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <ShieldCheck size={20} className="text-emerald-700" />
              </div>
              <div>
                <p className="text-sm font-bold text-stone-900">Pro Installer</p>
                <p className="text-xs font-semibold text-emerald-800">Vetted & Verified</p>
              </div>
            </div>
            <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden mt-1">
              <div className="h-full bg-emerald-700 w-[95%] rounded-full" />
            </div>
            <p className="text-xs text-stone-500 mt-2 text-right font-medium">95% Match Rating</p>
          </div>

          {/* Floating UI Card 2: Est. Daily Production */}
          <div className="absolute bottom-16 -right-4 bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-xl w-60 border border-stone-200">
            <div className="flex justify-between items-center mb-2">
              <Sun size={20} className="text-emerald-700" />
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Optimal
              </span>
            </div>
            <p className="text-2xl font-bold text-stone-900">24.5 kWh</p>
            <p className="text-xs text-stone-600 mt-1">Est. Daily Solar Yield</p>
          </div>
        </div>
      </div>
    </section>
  );
}
