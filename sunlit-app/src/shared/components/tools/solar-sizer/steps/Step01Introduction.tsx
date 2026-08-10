'use client';

import React from 'react';
import { SunlitIcon } from '@/shared/components/ui/SunlitIcon';

interface Step01Props {
  onNext: () => void;
}

export function Step01Introduction({ onNext }: Step01Props) {
  return (
    <div className="flex flex-col gap-8 py-2">
      {/* Hero Badge & Headline */}
      <div className="flex flex-col gap-4">
        <div className="inline-flex items-center gap-2 bg-[#f6ece6] px-4 py-2 rounded-full w-max border border-[#bfcaba]/40 shadow-xs">
          <SunlitIcon name="timer" size={16} className="text-[#00490e]" />
          <span className="font-sans text-xs font-semibold text-[#40493d] uppercase tracking-wider">
            Estimated time 3–5 minutes
          </span>
        </div>

        <h1 className="font-headline font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#1f1b17] tracking-tight leading-tight">
          Solar System <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00490e] to-[#0f631b]">
            Sizing Calculator
          </span>
        </h1>

        <p className="font-sans text-base sm:text-lg text-[#40493d] max-w-2xl leading-relaxed">
          Design the right solar system for your property energy needs. Estimate solar array capacity, battery storage, inverter rating, and expected energy production tailored for Nigeria.
        </p>
      </div>

      {/* Bento Grid Feature Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Output Card 1 */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#bfcaba]/40 shadow-xs flex flex-col justify-between hover:border-[#00490e]/40 transition-all duration-300 hover:-translate-y-0.5">
          <div className="w-10 h-10 rounded-full bg-[#ceee93]/40 flex items-center justify-center text-[#00490e] mb-4">
            <SunlitIcon name="solar_power" size={22} />
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#00490e] uppercase tracking-wider block mb-1">
              Step Output 1
            </span>
            <h3 className="font-headline font-bold text-lg text-[#1f1b17]">Solar Array kWp</h3>
            <p className="font-sans text-xs text-[#40493d] mt-1 leading-relaxed">
              Optimized solar panel capacity based on daily irradiance and load profile.
            </p>
          </div>
        </div>

        {/* Output Card 2 */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#bfcaba]/40 shadow-xs flex flex-col justify-between hover:border-[#00490e]/40 transition-all duration-300 hover:-translate-y-0.5">
          <div className="w-10 h-10 rounded-full bg-[#f6ece6] flex items-center justify-center text-[#40493d] mb-4 border border-[#bfcaba]/30">
            <SunlitIcon name="battery_charging_full" size={22} />
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#00490e] uppercase tracking-wider block mb-1">
              Step Output 2
            </span>
            <h3 className="font-headline font-bold text-lg text-[#1f1b17]">Battery Autonomy</h3>
            <p className="font-sans text-xs text-[#40493d] mt-1 leading-relaxed">
              Lithium storage required to maintain seamless power through grid blackouts.
            </p>
          </div>
        </div>

        {/* Output Card 3 */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#bfcaba]/40 shadow-xs flex flex-col justify-between hover:border-[#00490e]/40 transition-all duration-300 hover:-translate-y-0.5">
          <div className="w-10 h-10 rounded-full bg-[#4b566a]/10 flex items-center justify-center text-[#343f52] mb-4 border border-[#4b566a]/20">
            <SunlitIcon name="memory" size={22} />
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#00490e] uppercase tracking-wider block mb-1">
              Step Output 3
            </span>
            <h3 className="font-headline font-bold text-lg text-[#1f1b17]">Inverter kVA Sizing</h3>
            <p className="font-sans text-xs text-[#40493d] mt-1 leading-relaxed">
              Pure sine wave hybrid inverter rating sized for peak appliance surge loads.
            </p>
          </div>
        </div>
      </div>

      {/* Key Highlights Checklist */}
      <div className="bg-[#fcf2eb] rounded-2xl p-4 sm:p-6 border border-[#bfcaba]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-4 text-xs font-semibold text-[#1f1b17]">
          <div className="flex items-center gap-2">
            <SunlitIcon name="check_circle" size={18} className="text-[#00490e]" />
            <span>Deterministic Math</span>
          </div>
          <div className="flex items-center gap-2">
            <SunlitIcon name="check_circle" size={18} className="text-[#00490e]" />
            <span>Nigerian DISCO Tariffs</span>
          </div>
          <div className="flex items-center gap-2">
            <SunlitIcon name="check_circle" size={18} className="text-[#00490e]" />
            <span>Instant EPC Engineering Report</span>
          </div>
        </div>

        <button
          onClick={onNext}
          aria-label="Start calculation"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#00490e] hover:bg-[#0f631b] text-white px-8 py-3.5 rounded-full font-sans text-sm font-semibold tracking-wide transition-all duration-300 shadow-md hover:shadow-lg group cursor-pointer"
        >
          <span>Start Calculation</span>
          <SunlitIcon name="arrow_forward" size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
