'use client';

import React from 'react';

interface Step01Props {
  onNext: () => void;
}

export function Step01Introduction({ onNext }: Step01Props) {
  return (
    <div className="flex flex-col gap-8 py-2">
      {/* Hero Badge & Headline */}
      <div className="flex flex-col gap-4">
        <div className="inline-flex items-center gap-2 bg-[#eeeee9] px-4 py-2 rounded-full w-max border border-[#c0c9bb]/30">
          <span className="material-symbols-outlined text-sm text-[#00490e]" style={{ fontVariationSettings: "'FILL' 1" }}>
            timer
          </span>
          <span className="font-sans text-xs font-semibold text-[#41493e] uppercase tracking-wider">
            Estimated time 2–3 minutes
          </span>
        </div>

        <h1 className="font-headline font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#1a1c19] tracking-tight leading-tight">
          Appliance Load <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#003006] to-[#2b6b2c]">
            Energy Demand Calculator
          </span>
        </h1>

        <p className="font-sans text-base sm:text-lg text-[#41493e] max-w-2xl leading-relaxed">
          Manage and configure connected electrical equipment for precision solar array sizing, peak surge demand estimation, and daily kWh energy consumption calculations in Nigeria.
        </p>
      </div>

      {/* Bento Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-[#c0c9bb]/30 shadow-sm flex flex-col justify-between hover:border-[#00490e]/40 transition-all">
          <div className="w-10 h-10 rounded-full bg-[#aef4a5]/40 flex items-center justify-center text-[#00490e] mb-4">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              bolt
            </span>
          </div>
          <div>
            <span className="text-xs font-semibold text-[#00490e] uppercase tracking-wider block mb-1">
              Metric 01
            </span>
            <h3 className="font-headline font-bold text-lg text-[#1a1c19]">Connected Active Power</h3>
            <p className="font-sans text-xs text-[#41493e] mt-1">
              Aggregated baseline wattage of all operating property appliances.
            </p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-[#c0c9bb]/30 shadow-sm flex flex-col justify-between hover:border-[#00490e]/40 transition-all">
          <div className="w-10 h-10 rounded-full bg-[#e8e1de] flex items-center justify-center text-[#686461] mb-4">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              speed
            </span>
          </div>
          <div>
            <span className="text-xs font-semibold text-[#00490e] uppercase tracking-wider block mb-1">
              Metric 02
            </span>
            <h3 className="font-headline font-bold text-lg text-[#1a1c19]">Peak Surge Demand</h3>
            <p className="font-sans text-xs text-[#41493e] mt-1">
              Motor and inductive startup surge multiplier analysis for inverter headroom.
            </p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-[#c0c9bb]/30 shadow-sm flex flex-col justify-between hover:border-[#00490e]/40 transition-all">
          <div className="w-10 h-10 rounded-full bg-[#dbe5da] flex items-center justify-center text-[#151e17] mb-4">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              analytics
            </span>
          </div>
          <div>
            <span className="text-xs font-semibold text-[#00490e] uppercase tracking-wider block mb-1">
              Metric 03
            </span>
            <h3 className="font-headline font-bold text-lg text-[#1a1c19]">Daily kWh Consumption</h3>
            <p className="font-sans text-xs text-[#41493e] mt-1">
              Total daily energy demand used directly for battery autonomy sizing.
            </p>
          </div>
        </div>
      </div>

      {/* Highlights Banner & Action */}
      <div className="bg-[#f4f4ee] rounded-2xl p-4 sm:p-6 border border-[#c0c9bb]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-4 text-xs font-semibold text-[#1a1c19]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00490e] text-base">check_circle</span>
            <span>Pre-loaded Appliance Database</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00490e] text-base">check_circle</span>
            <span>Real-time Surge Math</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00490e] text-base">check_circle</span>
            <span>Direct Solar Sizer Export</span>
          </div>
        </div>

        <button
          onClick={onNext}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#00490e] hover:bg-[#003006] text-white px-8 py-3.5 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md group"
        >
          <span>Start Appliance Load Setup</span>
          <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}
