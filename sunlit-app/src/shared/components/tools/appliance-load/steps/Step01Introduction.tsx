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
        <div className="inline-flex items-center gap-2 bg-[#f6ece6] px-4 py-2 rounded-full w-max border border-[#bfcaba]/40">
          <SunlitIcon name="timer" size={16} className="text-[#00490e]" />
          <span className="font-sans text-xs font-semibold text-[#40493d] uppercase tracking-wider">
            ESTIMATED TIME 2–3 MINUTES
          </span>
        </div>

        <h1 className="font-headline font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#1f1b17] tracking-tight leading-tight">
          Appliance Load <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00490e] to-[#0f631b]">
            Energy Demand Calculator
          </span>
        </h1>

        <p className="font-sans text-base sm:text-lg text-[#40493d] max-w-2xl leading-relaxed">
          Manage and configure connected electrical equipment for precision solar array sizing, peak surge demand estimation, and daily kWh energy consumption calculations in Nigeria.
        </p>
      </div>

      {/* Bento Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#bfcaba]/40 shadow-xs flex flex-col justify-between hover:border-[#00490e]/40 transition-all">
          <div className="w-10 h-10 rounded-full bg-[#ceee93]/40 flex items-center justify-center text-[#00490e] mb-4">
            <SunlitIcon name="bolt" size={20} />
          </div>
          <div>
            <span className="text-xs font-bold text-[#00490e] uppercase tracking-wider block mb-1">
              METRIC 01
            </span>
            <h3 className="font-headline font-bold text-lg text-[#1f1b17]">Connected Active Power</h3>
            <p className="font-sans text-xs text-[#40493d] mt-1 leading-relaxed">
              Aggregated baseline wattage of all operating property appliances.
            </p>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#bfcaba]/40 shadow-xs flex flex-col justify-between hover:border-[#00490e]/40 transition-all">
          <div className="w-10 h-10 rounded-full bg-[#f6ece6] flex items-center justify-center text-[#40493d] mb-4 border border-[#bfcaba]/30">
            <SunlitIcon name="speed" size={20} />
          </div>
          <div>
            <span className="text-xs font-bold text-[#00490e] uppercase tracking-wider block mb-1">
              METRIC 02
            </span>
            <h3 className="font-headline font-bold text-lg text-[#1f1b17]">Peak Surge Demand</h3>
            <p className="font-sans text-xs text-[#40493d] mt-1 leading-relaxed">
              Motor and inductive startup surge multiplier analysis for inverter headroom.
            </p>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#bfcaba]/40 shadow-xs flex flex-col justify-between hover:border-[#00490e]/40 transition-all">
          <div className="w-10 h-10 rounded-full bg-[#343f52]/10 flex items-center justify-center text-[#343f52] mb-4 border border-[#343f52]/20">
            <SunlitIcon name="analytics" size={20} />
          </div>
          <div>
            <span className="text-xs font-bold text-[#00490e] uppercase tracking-wider block mb-1">
              METRIC 03
            </span>
            <h3 className="font-headline font-bold text-lg text-[#1f1b17]">Daily kWh Consumption</h3>
            <p className="font-sans text-xs text-[#40493d] mt-1 leading-relaxed">
              Total daily energy demand used directly for battery autonomy sizing.
            </p>
          </div>
        </div>
      </div>

      {/* Highlights Banner & Action */}
      <div className="bg-[#fcf2eb] rounded-2xl p-4 sm:p-6 border border-[#bfcaba]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-4 text-xs font-semibold text-[#1f1b17]">
          <div className="flex items-center gap-2">
            <SunlitIcon name="check_circle" size={18} className="text-[#00490e]" />
            <span>Pre-loaded Appliance Database</span>
          </div>
          <div className="flex items-center gap-2">
            <SunlitIcon name="check_circle" size={18} className="text-[#00490e]" />
            <span>Real-time Surge Math</span>
          </div>
          <div className="flex items-center gap-2">
            <SunlitIcon name="check_circle" size={18} className="text-[#00490e]" />
            <span>Direct Solar Sizer Export</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onNext}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#00490e] hover:bg-[#0f631b] text-white px-8 py-3.5 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md group cursor-pointer"
        >
          <span>Start Appliance Load Setup</span>
          <SunlitIcon name="arrow_forward" size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
