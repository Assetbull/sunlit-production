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
          Step 01 of 07
        </span>
        <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#191d17]">
          Inverter System Sizing & Surge Assessment
        </h2>
        <p className="font-sans text-sm text-[#41493e] mt-1">
          Accurately size pure sine wave inverters, calculate motor startup surge capacity, power factor derating, and safety margins.
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-[#c0c9bb]/40 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#aef4a5]/40 text-[#00490e] flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-xl">speed</span>
          </div>
          <h3 className="font-headline font-bold text-sm text-[#191d17]">Continuous kW Rating</h3>
          <p className="font-sans text-xs text-[#717a6d]">
            Determines exact active power (kW) and apparent power (kVA) to sustain active equipment load.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-[#c0c9bb]/40 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#dce6d5] text-[#151e14] flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-xl">bolt</span>
          </div>
          <h3 className="font-headline font-bold text-sm text-[#191d17]">Motor Surge Buffer</h3>
          <p className="font-sans text-xs text-[#717a6d]">
            Evaluates 3× to 5× inrush startup surge current for air conditioners, deep freezers, and pumps.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-[#c0c9bb]/40 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#d8e3fb] text-[#101c2d] flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-xl">tune</span>
          </div>
          <h3 className="font-headline font-bold text-sm text-[#191d17]">Power Factor & Headroom</h3>
          <p className="font-sans text-xs text-[#717a6d]">
            Applies 0.8 power factor and 25% safety reserve expansion margin for long-term inverter lifespan.
          </p>
        </div>
      </div>

      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-[#f2f5ec] to-[#ecefe6] border border-[#c0c9bb]/40 rounded-2xl p-5 flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-bold text-[#00490e] uppercase tracking-wider block">
            Veridian Standards V2.1
          </span>
          <p className="font-headline font-bold text-sm text-[#191d17]">
            Ready to size your inverter system?
          </p>
          <p className="font-sans text-xs text-[#717a6d]">
            Takes under 2 minutes. Configures continuous loads, surge multipliers, and inverter topology.
          </p>
        </div>

        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 bg-[#00490e] hover:bg-[#003006] text-white px-6 py-3 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md shrink-0 group"
        >
          <span>Get Started</span>
          <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}
