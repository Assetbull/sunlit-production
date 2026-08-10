'use client';

import React from 'react';

interface Step02Props {
  systemCapacityKwp: number;
  locationRegion: string;
  peakSunHours: number;
  onChangeCapacity: (kwp: number) => void;
  onChangeLocation: (location: string, psh: number) => void;
  onNext: () => void;
  onBack: () => void;
}

const REGION_OPTIONS: { name: string; psh: number; description: string }[] = [
  { name: 'Abuja (FCT)', psh: 5.2, description: 'North Central Belt — 5.2 kWh/m²/day GHI' },
  { name: 'Lagos State', psh: 4.8, description: 'South West Coastal — 4.8 kWh/m²/day GHI' },
  { name: 'Kano State', psh: 6.0, description: 'Far North Sahel — Peak solar resource (6.0 kWh/m²/day)' },
  { name: 'Port Harcourt (Rivers)', psh: 4.5, description: 'Niger Delta — High seasonal cloud cover' },
  { name: 'Ibadan (Oyo)', psh: 4.9, description: 'South West Belt — Balanced annual GHI' },
  { name: 'Enugu State', psh: 4.7, description: 'South East Belt — Moderate solar irradiance' },
];

export function Step02ProjectLocation({
  systemCapacityKwp,
  locationRegion,
  peakSunHours,
  onChangeCapacity,
  onChangeLocation,
  onNext,
  onBack,
}: Step02Props) {
  return (
    <div className="flex flex-col gap-6 py-2">
      <div>
        <span className="text-xs font-semibold text-[#00490e] uppercase tracking-wider block mb-1">
          Step 02 of 08
        </span>
        <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#191d17]">
          Project Location & PV System Capacity
        </h2>
        <p className="font-sans text-sm text-[#41493e] mt-1">
          Enter installed PV array capacity (kWp) and select project location region to retrieve Peak Sun Hours (PSH).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Capacity Input Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#c0c9bb]/40 shadow-sm space-y-4">
          <h4 className="font-headline font-bold text-sm text-[#00490e] uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-base">solar_power</span>
            <span>Installed Array Capacity</span>
          </h4>

          <div className="space-y-2">
            <label className="font-sans font-bold text-xs text-[#191d17] block">
              Installed PV Capacity (kWp)
            </label>
            <div className="relative">
              <input
                type="number"
                min={0.5}
                max={10000}
                step={0.1}
                value={systemCapacityKwp}
                onChange={(e) => onChangeCapacity(Math.max(0.1, Number(e.target.value)))}
                className="w-full bg-[#ecefe6] border border-[#c0c9bb]/60 rounded-xl px-4 py-3 font-headline font-bold text-2xl text-[#191d17] outline-none focus:ring-2 focus:ring-[#00490e]"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono font-bold text-xs text-[#717a6d]">
                KWP NOMINAL
              </span>
            </div>
            <p className="font-sans text-[11px] text-[#717a6d]">
              Equivalent to approx. {Math.ceil((systemCapacityKwp * 1000) / 550)} × 550W Tier-1 solar panel modules.
            </p>
          </div>

          {/* Presets */}
          <div className="pt-2">
            <span className="text-[11px] font-bold text-[#717a6d] uppercase block mb-1.5">
              Quick System Capacity Presets
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs font-sans font-bold">
              <button
                type="button"
                onClick={() => onChangeCapacity(5.5)}
                className="p-2 bg-[#ecefe6] hover:bg-[#aef4a5]/40 rounded-xl border border-[#c0c9bb]/40 text-[#191d17] text-center"
              >
                5.5 kWp (Residential)
              </button>
              <button
                type="button"
                onClick={() => onChangeCapacity(15.0)}
                className="p-2 bg-[#ecefe6] hover:bg-[#aef4a5]/40 rounded-xl border border-[#c0c9bb]/40 text-[#191d17] text-center"
              >
                15 kWp (Villa / Estate)
              </button>
              <button
                type="button"
                onClick={() => onChangeCapacity(50.0)}
                className="p-2 bg-[#ecefe6] hover:bg-[#aef4a5]/40 rounded-xl border border-[#c0c9bb]/40 text-[#191d17] text-center"
              >
                50 kWp (Commercial C&I)
              </button>
            </div>
          </div>
        </div>

        {/* Location Region Selection */}
        <div className="space-y-3">
          <label className="font-headline font-bold text-sm text-[#00490e] uppercase tracking-wider block">
            Select Location Region
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {REGION_OPTIONS.map((reg) => {
              const isSelected = locationRegion === reg.name;

              return (
                <div
                  key={reg.name}
                  onClick={() => onChangeLocation(reg.name, reg.psh)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? 'bg-[#f2f5ec] border-[#00490e] shadow-sm'
                      : 'bg-white/80 backdrop-blur-md border-[#c0c9bb]/40 hover:bg-[#ecefe6]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-headline font-bold text-sm text-[#191d17]">{reg.name}</h4>
                    <span
                      className={`material-symbols-outlined text-lg ${
                        isSelected ? 'text-[#00490e]' : 'text-[#c0c9bb]'
                      }`}
                    >
                      {isSelected ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-xs text-[#00490e]">
                    {reg.psh} PSH Hours/Day
                  </span>
                  <p className="font-sans text-[11px] text-[#717a6d]">{reg.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#c0c9bb]/30">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-[#c0c9bb] text-[#191d17] font-sans text-sm font-semibold hover:bg-[#ecefe6] transition-all"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 bg-[#00490e] hover:bg-[#003006] text-white px-7 py-2.5 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md group"
        >
          <span>Continue to Roof Tilt & Orientation</span>
          <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}
