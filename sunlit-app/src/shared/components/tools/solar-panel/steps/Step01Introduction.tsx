'use client';

import React from 'react';
import { SunlitIcon } from '@/shared/components/ui/SunlitIcon';

interface Step01Props {
  onNext: () => void;
}

export function Step01Introduction({ onNext }: Step01Props) {
  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Step Header */}
      <div>
        <span className="text-[11px] font-bold text-[#00490e] uppercase tracking-wider block mb-1">
          STEP 01 OF 09
        </span>
        <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#1f1b17]">
          Solar Panel Array Sizing Calculator
        </h2>
        <p className="font-sans text-sm text-[#40493d] mt-1 leading-relaxed">
          Calculate required PV array capacity (kWp), recommended module quantity, roof surface area (m²), and annual solar energy production.
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#bfcaba]/40 shadow-xs space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#ceee93]/50 text-[#00490e] flex items-center justify-center font-bold border border-[#00490e]/20">
            <SunlitIcon name="solar_power" size={20} />
          </div>
          <h3 className="font-headline font-bold text-base text-[#1f1b17]">Kilowatt-Peak (kWp) Capacity</h3>
          <p className="font-sans text-xs text-[#707a6c] leading-relaxed">
            Sizes PV array capacity required to meet your daily property energy demand target.
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#bfcaba]/40 shadow-xs space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#f6ece6] text-[#00490e] flex items-center justify-center font-bold border border-[#bfcaba]/30">
            <SunlitIcon name="wb_sunny" size={20} />
          </div>
          <h3 className="font-headline font-bold text-base text-[#1f1b17]">Peak Sun Hours (PSH)</h3>
          <p className="font-sans text-xs text-[#707a6c] leading-relaxed">
            Applies regional solar irradiance data across Nigerian locations (Abuja, Lagos, Kano, Port Harcourt).
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#bfcaba]/40 shadow-xs space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#fcf2eb] text-[#00490e] flex items-center justify-center font-bold border border-[#bfcaba]/30">
            <SunlitIcon name="grid_view" size={20} />
          </div>
          <h3 className="font-headline font-bold text-base text-[#1f1b17]">String & Layout Config</h3>
          <p className="font-sans text-xs text-[#707a6c] leading-relaxed">
            Determines series/parallel string arrangements, panel tilt angles, and roof footprint (m²).
          </p>
        </div>
      </div>

      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-[#fcf2eb] to-[#f6ece6] border border-[#bfcaba]/40 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-[#00490e] uppercase tracking-wider block">
            VERIDIAN SOLAR STANDARDS V2.1
          </span>
          <p className="font-headline font-bold text-base text-[#1f1b17]">
            Ready to size your solar panel array?
          </p>
          <p className="font-sans text-xs text-[#707a6c]">
            Takes under 2 minutes. Configures energy demand, panel wattage, solar resource, and string layout.
          </p>
        </div>

        <button
          type="button"
          onClick={onNext}
          aria-label="Get Started"
          className="inline-flex items-center gap-2 bg-[#00490e] hover:bg-[#0f631b] text-white px-7 py-3 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md shrink-0 group cursor-pointer"
        >
          <span>Get Started</span>
          <SunlitIcon name="arrow_forward" size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
