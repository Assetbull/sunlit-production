'use client';

import Link from 'next/link';
import { ArrowRight, Zap, Calculator, Search, CalendarDays, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  onWaitlistOpen: () => void;
}

export function HeroSection({ onWaitlistOpen }: HeroSectionProps) {
  return (
    <section
      className="relative min-h-[auto] md:min-h-[820px] flex items-center pt-8 pb-16 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-28 overflow-hidden bg-[#FFF8F5]"
    >
      {/* Decorative background ambient glows */}
      <div
        className="absolute top-0 right-0 w-[320px] sm:w-[500px] lg:w-[700px] h-[320px] sm:h-[500px] lg:h-[700px] rounded-full pointer-events-none"
        style={{
          background: 'rgba(204, 235, 145, 0.18)',
          filter: 'blur(80px)',
          transform: 'translate(25%, -25%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-[260px] sm:w-[400px] lg:w-[500px] h-[260px] sm:h-[400px] lg:h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'rgba(230, 230, 220, 0.35)',
          filter: 'blur(80px)',
          transform: 'translate(-25%, 25%)',
        }}
      />

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Content Column */}
          <div className="lg:col-span-7 flex flex-col items-start gap-5 sm:gap-6">
            {/* AI Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#F0EDE3]/90 border border-[#BFCABA]/30 rounded-full">
              <Zap size={14} className="text-[#4D661C] fill-[#4D661C]" />
              <span className="font-sans font-semibold text-xs text-[#40493D] tracking-wide">
                AI-Ready Renewable Energy Platform
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-[#1F1B17] tracking-tight leading-[1.1]">
              Power Your Property with Intelligent{' '}
              <span className="text-[#00490E]">Renewable Energy</span>
            </h1>

            {/* Body */}
            <p className="font-sans text-sm sm:text-base lg:text-lg text-[#40493D] leading-relaxed max-w-2xl">
              Compare verified solar installers, EPC contractors and renewable energy
              experts to design, install and manage residential, commercial and
              industrial renewable energy projects across Nigeria.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto pt-1">
              <a
                href="/tools/solar-system-sizing"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#00490E] hover:bg-[#003006] text-white font-sans font-semibold text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Get Free Solar Quote
                <ArrowRight size={16} />
              </a>
              <a
                href="/services"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-[#BFCABA]/80 bg-transparent hover:bg-[#F0EDE3]/80 text-[#1F1B17] font-sans font-medium text-sm transition-all"
              >
                Explore Solutions
              </a>
            </div>

            {/* Quick Actions */}
            <div className="border-t border-[#E5E0DD] pt-5 w-full mt-2">
              <p className="font-sans font-bold text-[11px] uppercase tracking-wider text-[#707A6C] mb-3">
                Quick Actions
              </p>
              <div className="flex flex-wrap gap-2.5">
                {[
                  { icon: <Calculator size={14} />, label: 'Solar Cost Calculator', href: '/tools/solar-system-sizing' },
                  { icon: <Search size={14} />, label: 'Compare Installers', href: '/services' },
                  { icon: <CalendarDays size={14} />, label: 'Book Consultation', href: '/contact' },
                ].map(item => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E5E0DD] hover:border-[#00490E] rounded-full text-xs font-sans font-medium text-[#1F1B17] hover:text-[#00490E] transition-all shadow-xs"
                  >
                    <span className="text-[#00490E]">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Visual Column (Visible & Fully Responsive on ALL Viewports) */}
          <div className="lg:col-span-5 relative w-full mt-4 lg:mt-0">
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] lg:h-[560px] rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-xl border border-[#E5E0DD] bg-[#F0EDE3]">
              <div
                className="w-full h-full bg-cover bg-center transition-transform duration-700 hover:scale-105"
                style={{
                  backgroundImage:
                    'url(https://lh3.googleusercontent.com/aida-public/AB6AXuCxOu026tgdXiFsW9WwJMEX1pfzjnymeEdlVmfxFdDXIwCzaoeaaKsEKJ8b7MLvkiy6ob0mAWsMbl_AGmc3fQdoM8aTxDGsN-eGwjreQH-dx-YGqA62Rjw1lfoC5JNGcjGG2hMqYcp1FH659GCGxuuCtRZIxD_YUyTMvdEUul2uTa-GVmNSCWDPnRCUDdbammv1ZEK4EBJyV0BEijC1Y3cWwTK9BwcgRzWkMdItoXl1XBzbOmZ9kzMk)',
                }}
                role="img"
                aria-label="Solar professionals installing panels on a premium property in Nigeria"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Floating Card — Pro Installer */}
            <div className="absolute top-4 sm:top-8 left-3 sm:-left-6 bg-white/95 backdrop-blur-md border border-[#E5E0DD] rounded-xl p-3 sm:p-4 shadow-lg flex flex-col gap-1.5 w-[160px] sm:w-[200px]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#ECEFE6] flex items-center justify-center text-[#00490E] shrink-0">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <p className="font-display font-bold text-xs sm:text-sm text-[#1F1B17] leading-tight">
                    Pro Installer
                  </p>
                  <p className="text-[10px] sm:text-xs text-[#00490E] font-medium">Verified</p>
                </div>
              </div>
              <div className="h-1.5 bg-[#F0EDE3] rounded-full overflow-hidden mt-1">
                <div className="h-full bg-[#00490E] rounded-full w-[88%]" />
              </div>
              <p className="text-[10px] text-[#707A6C] text-right font-medium">92% Match</p>
            </div>

            {/* Floating Card — Energy Stats */}
            <div className="absolute bottom-4 sm:bottom-8 right-3 sm:-right-6 bg-white/95 backdrop-blur-md border border-[#E5E0DD] rounded-xl p-3 sm:p-4 shadow-lg w-[150px] sm:w-[190px]">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] uppercase font-bold text-[#707A6C]">Daily Yield</span>
                <span className="text-[10px] font-bold text-[#00490E] bg-[#ECEFE6] px-1.5 py-0.5 rounded-full">
                  Optimal
                </span>
              </div>
              <p className="font-display font-bold text-xl sm:text-2xl text-[#00490E]">
                24.5 <span className="text-xs font-normal text-[#40493D]">kWh</span>
              </p>
              <p className="text-[10px] text-[#707A6C] mt-0.5">Est. Peak Generation</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
