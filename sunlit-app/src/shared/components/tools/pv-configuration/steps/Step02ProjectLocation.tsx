'use client';

import React from 'react';
import { SunlitIcon } from '@/shared/components/ui/SunlitIcon';

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
        <span className="text-[11px] font-bold text-[#00490e] uppercase tracking-wider block mb-1">
          STEP 02 OF 08
        </span>
        <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#1f1b17]">
          Project Location & PV System Capacity
        </h2>
        <p className="font-sans text-sm text-[#40493d] mt-1 leading-relaxed">
          Enter installed PV array capacity (kWp) and select project location region to retrieve Peak Sun Hours (PSH).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Capacity Input Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#bfcaba]/40 shadow-xs space-y-4">
          <h4 className="font-headline font-bold text-xs text-[#00490e] uppercase tracking-wider flex items-center gap-2">
            <SunlitIcon name="solar_power" size={16} />
            <span>Installed Array Capacity</span>
          </h4>

          <div className="space-y-2">
            <label className="font-sans font-bold text-xs text-[#1f1b17] block">
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
                className="w-full bg-[#fcf2eb] border border-[#bfcaba]/60 rounded-xl px-4 py-3 font-headline font-bold text-2xl text-[#1f1b17] outline-none focus:ring-2 focus:ring-[#00490e]"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono font-bold text-xs text-[#707a6c]">
                KWP NOMINAL
              </span>
            </div>
            <p className="font-sans text-[11px] text-[#707a6c]">
              Equivalent to approx. {Math.ceil((systemCapacityKwp * 1000) / 550)} × 550W Tier-1 solar panel modules.
            </p>
          </div>

          {/* Presets */}
          <div className="pt-2">
            <span className="text-[11px] font-bold text-[#707a6c] uppercase block mb-1.5">
              Quick System Capacity Presets
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs font-sans font-bold">
              <button
                type="button"
                onClick={() => onChangeCapacity(5.5)}
                className="p-2 bg-[#f6ece6] hover:bg-[#ceee93]/40 rounded-xl border border-[#bfcaba]/40 text-[#1f1b17] text-center cursor-pointer transition-colors"
              >
                5.5 kWp (Residential)
              </button>
              <button
                type="button"
                onClick={() => onChangeCapacity(15.0)}
                className="p-2 bg-[#f6ece6] hover:bg-[#ceee93]/40 rounded-xl border border-[#bfcaba]/40 text-[#1f1b17] text-center cursor-pointer transition-colors"
              >
                15 kWp (Villa / Estate)
              </button>
              <button
                type="button"
                onClick={() => onChangeCapacity(50.0)}
                className="p-2 bg-[#f6ece6] hover:bg-[#ceee93]/40 rounded-xl border border-[#bfcaba]/40 text-[#1f1b17] text-center cursor-pointer transition-colors"
              >
                50 kWp (Commercial C&I)
              </button>
            </div>
          </div>
        </div>

        {/* Location Region Selection */}
        <div className="space-y-3">
          <label className="font-headline font-bold text-xs text-[#00490e] uppercase tracking-wider block">
            Select Location Region
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {REGION_OPTIONS.map((reg) => {
              const isSelected = locationRegion === reg.name;

              return (
                <div
                  key={reg.name}
                  onClick={() => onChangeLocation(reg.name, reg.psh)}
                  className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? 'bg-[#fcf2eb] border-[#00490e] shadow-xs'
                      : 'bg-white/90 backdrop-blur-md border-[#bfcaba]/40 hover:bg-[#f6ece6]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-headline font-bold text-sm text-[#1f1b17]">{reg.name}</h4>
                    <SunlitIcon
                      name={isSelected ? 'check_circle' : 'radio_button_unchecked'}
                      size={18}
                      className={isSelected ? 'text-[#00490e]' : 'text-[#bfcaba]'}
                    />
                  </div>
                  <span className="font-mono font-bold text-xs text-[#00490e]">
                    {reg.psh} PSH Hours/Day
                  </span>
                  <p className="font-sans text-[11px] text-[#707a6c]">{reg.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#bfcaba]/30">
        <button
          type="button"
          onClick={onBack}
          aria-label="Go Back"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-[#707a6c] text-[#1f1b17] font-sans text-sm font-semibold hover:bg-[#f6ece6] transition-all cursor-pointer"
        >
          <SunlitIcon name="arrow_back" size={16} />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          aria-label="Continue to Roof Tilt & Orientation"
          className="inline-flex items-center gap-2 bg-[#00490e] hover:bg-[#0f631b] text-white px-7 py-2.5 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md group cursor-pointer"
        >
          <span>Continue to Roof Tilt & Orientation</span>
          <SunlitIcon name="arrow_forward" size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
