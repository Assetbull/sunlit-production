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
          STEP 01 OF 07
        </span>
        <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#1f1b17]">
          Inverter System Sizing & Surge Assessment
        </h2>
        <p className="font-sans text-sm text-[#40493d] mt-1 leading-relaxed">
          Accurately size pure sine wave inverters, calculate motor startup surge capacity, power factor derating, and safety margins.
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#bfcaba]/40 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#f6ece6] text-[#00490e] flex items-center justify-center font-bold border border-[#bfcaba]/30">
            <SunlitIcon name="speed" size={20} />
          </div>
          <h3 className="font-headline font-bold text-sm text-[#1f1b17]">Continuous kW Rating</h3>
          <p className="font-sans text-xs text-[#707a6c] leading-relaxed">
            Determines exact active power (kW) and apparent power (kVA) to sustain active equipment load.
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#bfcaba]/40 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#f6ece6] text-[#00490e] flex items-center justify-center font-bold border border-[#bfcaba]/30">
            <SunlitIcon name="bolt" size={20} />
          </div>
          <h3 className="font-headline font-bold text-sm text-[#1f1b17]">Motor Surge Buffer</h3>
          <p className="font-sans text-xs text-[#707a6c] leading-relaxed">
            Evaluates 3× to 5× inrush startup surge current for air conditioners, deep freezers, and pumps.
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#bfcaba]/40 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#f6ece6] text-[#00490e] flex items-center justify-center font-bold border border-[#bfcaba]/30">
            <SunlitIcon name="tune" size={20} />
          </div>
          <h3 className="font-headline font-bold text-sm text-[#1f1b17]">Power Factor & Headroom</h3>
          <p className="font-sans text-xs text-[#707a6c] leading-relaxed">
            Applies 0.8 power factor and 25% safety reserve expansion margin for long-term inverter lifespan.
          </p>
        </div>
      </div>

      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-[#fcf2eb] to-[#f6ece6] border border-[#bfcaba]/40 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-[#00490e] uppercase tracking-wider block">
            Veridian Standards V2.1
          </span>
          <p className="font-headline font-bold text-sm text-[#1f1b17]">
            Ready to size your inverter system?
          </p>
          <p className="font-sans text-xs text-[#707a6c]">
            Takes under 2 minutes. Configures continuous loads, surge multipliers, and inverter topology.
          </p>
        </div>

        <button
          type="button"
          onClick={onNext}
          aria-label="Get Started"
          className="inline-flex items-center gap-2 bg-[#00490e] hover:bg-[#0f631b] text-white px-6 py-3 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md shrink-0 group cursor-pointer"
        >
          <span>Get Started</span>
          <SunlitIcon name="arrow_forward" size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
