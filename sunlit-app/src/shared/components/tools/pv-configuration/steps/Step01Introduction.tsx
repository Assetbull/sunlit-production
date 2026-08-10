'use client';

import React from 'react';

interface Step01Props {
  onNext: () => void;
}

export function Step01Introduction({ onNext }: Step01Props) {
  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Step Header */}
      <div>
        <span className="text-xs font-semibold text-[#00490e] uppercase tracking-wider block mb-1">
          Step 01 of 08
        </span>
        <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#191d17]">
          PV String Layout & Energy Yield Configurator
        </h2>
        <p className="font-sans text-sm text-[#41493e] mt-1">
          Model annual clean energy generation (kWh/yr), specific yield (kWh/kWp/yr), monthly generation profiles, thermal/soiling derating, and tilt orientation scenarios.
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-[#c0c9bb]/40 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#aef4a5]/40 text-[#00490e] flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-xl">query_stats</span>
          </div>
          <h3 className="font-headline font-bold text-sm text-[#191d17]">Annual & Specific Yield</h3>
          <p className="font-sans text-xs text-[#717a6d]">
            Simulates annual kWh generation and specific yield (kWh/kWp/yr) using regional GHI irradiance profiles.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-[#c0c9bb]/40 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#dce6d5] text-[#151e14] flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-xl">waterfall_chart</span>
          </div>
          <h3 className="font-headline font-bold text-sm text-[#191d17]">Loss Breakdown Waterfall</h3>
          <p className="font-sans text-xs text-[#717a6d]">
            Quantifies STC temperature derating, dust soiling, ohmic cable drop, and inverter conversion losses.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-[#c0c9bb]/40 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#d8e3fb] text-[#101c2d] flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-xl">compare_arrows</span>
          </div>
          <h3 className="font-headline font-bold text-sm text-[#191d17]">Scenario Matrix</h3>
          <p className="font-sans text-xs text-[#717a6d]">
            Compares 15° True South fixed mount vs 0° flat roof vs custom azimuth configurations side-by-side.
          </p>
        </div>
      </div>

      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-[#f2f5ec] to-[#ecefe6] border border-[#c0c9bb]/40 rounded-2xl p-5 flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-bold text-[#00490e] uppercase tracking-wider block">
            Veridian Yield Engine V2.1
          </span>
          <p className="font-headline font-bold text-sm text-[#191d17]">
            Ready to configure PV array orientation & yield?
          </p>
          <p className="font-sans text-xs text-[#717a6d]">
            Takes under 2 minutes. Simulates annual energy production, monthly generation, and tilt optimization.
          </p>
        </div>

        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 bg-[#00490e] hover:bg-[#003006] text-white px-6 py-3 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md shrink-0 group"
        >
          <span>Start Configuration</span>
          <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}
