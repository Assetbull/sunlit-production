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
        <div className="inline-flex items-center gap-2 bg-[#ecefe6] px-4 py-2 rounded-full w-max border border-[#c0c9bb]/30">
          <span className="material-symbols-outlined text-sm text-[#00490e]" style={{ fontVariationSettings: "'FILL' 1" }}>
            timer
          </span>
          <span className="font-sans text-xs font-semibold text-[#41493e] uppercase tracking-wider">
            Estimated time 3–5 minutes
          </span>
        </div>

        <h1 className="font-headline font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#191d17] tracking-tight leading-tight">
          Solar System <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#003006] to-[#2b6b2c]">
            Sizing Calculator
          </span>
        </h1>

        <p className="font-sans text-base sm:text-lg text-[#41493e] max-w-2xl leading-relaxed">
          Design the right solar system for your property energy needs. Estimate solar array capacity, battery storage, inverter rating, and expected energy production tailored for Nigeria.
        </p>
      </div>

      {/* Bento Grid Feature Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Output Card 1 */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-[#c0c9bb]/30 shadow-sm flex flex-col justify-between hover:border-[#00490e]/40 transition-all">
          <div className="w-10 h-10 rounded-full bg-[#aef4a5]/40 flex items-center justify-center text-[#00490e] mb-4">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              solar_power
            </span>
          </div>
          <div>
            <span className="text-xs font-semibold text-[#00490e] uppercase tracking-wider block mb-1">
              Step Output 1
            </span>
            <h3 className="font-headline font-bold text-lg text-[#191d17]">Solar Array kWp</h3>
            <p className="font-sans text-xs text-[#41493e] mt-1">
              Optimized solar panel capacity based on daily irradiance and load profile.
            </p>
          </div>
        </div>

        {/* Output Card 2 */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-[#c0c9bb]/30 shadow-sm flex flex-col justify-between hover:border-[#00490e]/40 transition-all">
          <div className="w-10 h-10 rounded-full bg-[#dce6d5] flex items-center justify-center text-[#5e675a] mb-4">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              battery_charging_full
            </span>
          </div>
          <div>
            <span className="text-xs font-semibold text-[#00490e] uppercase tracking-wider block mb-1">
              Step Output 2
            </span>
            <h3 className="font-headline font-bold text-lg text-[#191d17]">Battery Autonomy</h3>
            <p className="font-sans text-xs text-[#41493e] mt-1">
              Lithium storage required to maintain seamless power through grid blackouts.
            </p>
          </div>
        </div>

        {/* Output Card 3 */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-[#c0c9bb]/30 shadow-sm flex flex-col justify-between hover:border-[#00490e]/40 transition-all">
          <div className="w-10 h-10 rounded-full bg-[#d8e3fb] flex items-center justify-center text-[#101c2d] mb-4">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              memory
            </span>
          </div>
          <div>
            <span className="text-xs font-semibold text-[#00490e] uppercase tracking-wider block mb-1">
              Step Output 3
            </span>
            <h3 className="font-headline font-bold text-lg text-[#191d17]">Inverter kVA Sizing</h3>
            <p className="font-sans text-xs text-[#41493e] mt-1">
              Pure sine wave hybrid inverter rating sized for peak appliance surge loads.
            </p>
          </div>
        </div>
      </div>

      {/* Key Highlights Checklist */}
      <div className="bg-[#f2f5ec] rounded-2xl p-4 sm:p-6 border border-[#c0c9bb]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-4 text-xs font-semibold text-[#191d17]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00490e] text-base">check_circle</span>
            <span>Deterministic Math</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00490e] text-base">check_circle</span>
            <span>Nigerian DISCO Tariffs</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00490e] text-base">check_circle</span>
            <span>Instant EPC Engineering Report</span>
          </div>
        </div>

        <button
          onClick={onNext}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#00490e] hover:bg-[#003006] text-white px-8 py-3.5 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md hover:shadow-lg group"
        >
          <span>Start Calculation</span>
          <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}
