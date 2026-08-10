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
          STEP 01 OF 08
        </span>
        <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#1f1b17]">
          PV String Layout & Energy Yield Configurator
        </h2>
        <p className="font-sans text-sm text-[#40493d] mt-1 leading-relaxed">
          Model annual clean energy generation (kWh/yr), specific yield (kWh/kWp/yr), monthly generation profiles, thermal/soiling derating, and tilt orientation scenarios.
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#bfcaba]/40 shadow-xs space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#ceee93]/50 text-[#00490e] flex items-center justify-center font-bold border border-[#00490e]/20">
            <SunlitIcon name="query_stats" size={20} />
          </div>
          <h3 className="font-headline font-bold text-base text-[#1f1b17]">Annual & Specific Yield</h3>
          <p className="font-sans text-xs text-[#707a6c] leading-relaxed">
            Simulates annual kWh generation and specific yield (kWh/kWp/yr) using regional GHI irradiance profiles.
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#bfcaba]/40 shadow-xs space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#f6ece6] text-[#00490e] flex items-center justify-center font-bold border border-[#bfcaba]/30">
            <SunlitIcon name="waterfall_chart" size={20} />
          </div>
          <h3 className="font-headline font-bold text-base text-[#1f1b17]">Loss Breakdown Waterfall</h3>
          <p className="font-sans text-xs text-[#707a6c] leading-relaxed">
            Quantifies STC temperature derating, dust soiling, ohmic cable drop, and inverter conversion losses.
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#bfcaba]/40 shadow-xs space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#fcf2eb] text-[#00490e] flex items-center justify-center font-bold border border-[#bfcaba]/30">
            <SunlitIcon name="compare_arrows" size={20} />
          </div>
          <h3 className="font-headline font-bold text-base text-[#1f1b17]">Scenario Matrix</h3>
          <p className="font-sans text-xs text-[#707a6c] leading-relaxed">
            Compares 15° True South fixed mount vs 0° flat roof vs custom azimuth configurations side-by-side.
          </p>
        </div>
      </div>

      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-[#fcf2eb] to-[#f6ece6] border border-[#bfcaba]/40 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-[#00490e] uppercase tracking-wider block">
            VERIDIAN YIELD ENGINE V2.1
          </span>
          <p className="font-headline font-bold text-base text-[#1f1b17]">
            Ready to configure PV array orientation & yield?
          </p>
          <p className="font-sans text-xs text-[#707a6c]">
            Takes under 2 minutes. Simulates annual energy production, monthly generation, and tilt optimization.
          </p>
        </div>

        <button
          type="button"
          onClick={onNext}
          aria-label="Start configuration"
          className="inline-flex items-center gap-2 bg-[#00490e] hover:bg-[#0f631b] text-white px-7 py-3 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md shrink-0 group cursor-pointer"
        >
          <span>Start Configuration</span>
          <SunlitIcon name="arrow_forward" size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
