'use client';

import React from 'react';

interface Step01Props {
  onNext: () => void;
}

export function Step01Introduction({ onNext }: Step01Props) {
  return (
    <div className="flex flex-col gap-8 py-2">
      {/* Hero Header */}
      <div className="flex flex-col gap-4">
        <div className="inline-flex items-center gap-2 bg-[#ecefe6] px-4 py-2 rounded-full w-max border border-[#c0c9bb]/30">
          <span className="material-symbols-outlined text-sm text-[#00490e]" style={{ fontVariationSettings: "'FILL' 1" }}>
            timer
          </span>
          <span className="font-sans text-xs font-semibold text-[#41493e] uppercase tracking-wider">
            Estimated time 2–3 minutes
          </span>
        </div>

        <h1 className="font-headline font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#191d17] tracking-tight leading-tight">
          Battery Capacity <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#003006] to-[#2b6b2c]">
            Storage & Autonomy Sizer
          </span>
        </h1>

        <p className="font-sans text-base sm:text-lg text-[#41493e] max-w-2xl leading-relaxed">
          Determine required battery bank capacity (kWh / Ah), nominal voltage, usable energy reserve, depth of discharge (DoD), and battery module configurations for solar backup in Nigeria.
        </p>
      </div>

      {/* Feature Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-[#c0c9bb]/30 shadow-sm flex flex-col justify-between hover:border-[#00490e]/40 transition-all">
          <div className="w-10 h-10 rounded-full bg-[#aef4a5]/40 flex items-center justify-center text-[#00490e] mb-4">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              battery_charging_full
            </span>
          </div>
          <div>
            <span className="text-xs font-semibold text-[#00490e] uppercase tracking-wider block mb-1">
              Metric 01
            </span>
            <h3 className="font-headline font-bold text-lg text-[#191d17]">Gross Installed Capacity</h3>
            <p className="font-sans text-xs text-[#41493e] mt-1">
              Total nominal kWh energy storage required to deliver autonomy.
            </p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-[#c0c9bb]/30 shadow-sm flex flex-col justify-between hover:border-[#00490e]/40 transition-all">
          <div className="w-10 h-10 rounded-full bg-[#dce6d5] flex items-center justify-center text-[#586154] mb-4">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              shield
            </span>
          </div>
          <div>
            <span className="text-xs font-semibold text-[#00490e] uppercase tracking-wider block mb-1">
              Metric 02
            </span>
            <h3 className="font-headline font-bold text-lg text-[#191d17]">Usable Energy Reserve</h3>
            <p className="font-sans text-xs text-[#41493e] mt-1">
              Depth of Discharge (80% LiFePO4 DoD limit) protecting battery cycle life.
            </p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-[#c0c9bb]/30 shadow-sm flex flex-col justify-between hover:border-[#00490e]/40 transition-all">
          <div className="w-10 h-10 rounded-full bg-[#d8e3fb] flex items-center justify-center text-[#101c2d] mb-4">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              grid_view
            </span>
          </div>
          <div>
            <span className="text-xs font-semibold text-[#00490e] uppercase tracking-wider block mb-1">
              Metric 03
            </span>
            <h3 className="font-headline font-bold text-lg text-[#191d17]">Module Architecture</h3>
            <p className="font-sans text-xs text-[#41493e] mt-1">
              Series-parallel configuration (e.g. 5.12 kWh 48V LiFePO4 wall-mount modules).
            </p>
          </div>
        </div>
      </div>

      {/* Highlights Banner & Action */}
      <div className="bg-[#f2f5ec] rounded-2xl p-4 sm:p-6 border border-[#c0c9bb]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-4 text-xs font-semibold text-[#191d17]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00490e] text-base">check_circle</span>
            <span>DoD & Temperature Derating</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00490e] text-base">check_circle</span>
            <span>Critical Backup Goal Filters</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00490e] text-base">check_circle</span>
            <span>Inverter Sizer Integration</span>
          </div>
        </div>

        <button
          onClick={onNext}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#00490e] hover:bg-[#003006] text-white px-8 py-3.5 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md group"
        >
          <span>Start Battery Capacity Setup</span>
          <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}
