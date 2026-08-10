'use client';

import React from 'react';
import { SunlitIcon } from '@/shared/components/ui/SunlitIcon';

interface Step01Props {
  onNext: () => void;
}

export function Step01Introduction({ onNext }: Step01Props) {
  return (
    <div className="flex flex-col gap-8 py-2">
      {/* Hero Header */}
      <div className="flex flex-col gap-4">
        <div className="inline-flex items-center gap-2 bg-[#f6ece6] px-4 py-2 rounded-full w-max border border-[#bfcaba]/40">
          <SunlitIcon name="timer" size={16} className="text-[#00490e]" />
          <span className="font-sans text-xs font-semibold text-[#40493d] uppercase tracking-wider">
            Estimated time 2–3 minutes
          </span>
        </div>

        <h1 className="font-headline font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#1f1b17] tracking-tight leading-tight">
          Battery Capacity <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00490e] to-[#0f631b]">
            Storage & Autonomy Sizer
          </span>
        </h1>

        <p className="font-sans text-base sm:text-lg text-[#40493d] max-w-2xl leading-relaxed">
          Determine required battery bank capacity (kWh / Ah), nominal voltage, usable energy reserve, depth of discharge (DoD), and battery module configurations for solar backup in Nigeria.
        </p>
      </div>

      {/* Feature Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#bfcaba]/40 shadow-xs flex flex-col justify-between hover:border-[#00490e]/40 transition-all">
          <div className="w-10 h-10 rounded-full bg-[#ceee93]/50 flex items-center justify-center text-[#00490e] mb-4 border border-[#00490e]/20">
            <SunlitIcon name="battery_charging_full" size={20} />
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#00490e] uppercase tracking-wider block mb-1">
              Metric 01
            </span>
            <h3 className="font-headline font-bold text-lg text-[#1f1b17]">Gross Installed Capacity</h3>
            <p className="font-sans text-xs text-[#40493d] mt-1 leading-relaxed">
              Total nominal kWh energy storage required to deliver autonomy.
            </p>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#bfcaba]/40 shadow-xs flex flex-col justify-between hover:border-[#00490e]/40 transition-all">
          <div className="w-10 h-10 rounded-full bg-[#f6ece6] flex items-center justify-center text-[#00490e] mb-4 border border-[#bfcaba]/30">
            <SunlitIcon name="verified" size={20} />
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#00490e] uppercase tracking-wider block mb-1">
              Metric 02
            </span>
            <h3 className="font-headline font-bold text-lg text-[#1f1b17]">Usable Energy Reserve</h3>
            <p className="font-sans text-xs text-[#40493d] mt-1 leading-relaxed">
              Depth of Discharge (80% LiFePO4 DoD limit) protecting battery cycle life.
            </p>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#bfcaba]/40 shadow-xs flex flex-col justify-between hover:border-[#00490e]/40 transition-all">
          <div className="w-10 h-10 rounded-full bg-[#fcf2eb] flex items-center justify-center text-[#00490e] mb-4 border border-[#bfcaba]/30">
            <SunlitIcon name="grid_view" size={20} />
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#00490e] uppercase tracking-wider block mb-1">
              Metric 03
            </span>
            <h3 className="font-headline font-bold text-lg text-[#1f1b17]">Module Architecture</h3>
            <p className="font-sans text-xs text-[#40493d] mt-1 leading-relaxed">
              Series-parallel configuration (e.g. 5.12 kWh 48V LiFePO4 wall-mount modules).
            </p>
          </div>
        </div>
      </div>

      {/* Highlights Banner & Action */}
      <div className="bg-[#fcf2eb] rounded-2xl p-4 sm:p-6 border border-[#bfcaba]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-4 text-xs font-semibold text-[#1f1b17]">
          <div className="flex items-center gap-2">
            <SunlitIcon name="check_circle" size={16} className="text-[#00490e]" />
            <span>DoD & Temperature Derating</span>
          </div>
          <div className="flex items-center gap-2">
            <SunlitIcon name="check_circle" size={16} className="text-[#00490e]" />
            <span>Critical Backup Goal Filters</span>
          </div>
          <div className="flex items-center gap-2">
            <SunlitIcon name="check_circle" size={16} className="text-[#00490e]" />
            <span>Inverter Sizer Integration</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onNext}
          aria-label="Start Battery Capacity Setup"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#00490e] hover:bg-[#0f631b] text-white px-8 py-3.5 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md group cursor-pointer"
        >
          <span>Start Battery Capacity Setup</span>
          <SunlitIcon name="arrow_forward" size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
