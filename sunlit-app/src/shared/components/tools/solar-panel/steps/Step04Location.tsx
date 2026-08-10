'use client';

import React from 'react';

interface Step04Props {
  locationRegion: string;
  peakSunHours: number;
  systemLossesFactor: number;
  onChangeLocation: (location: string, psh: number) => void;
  onChangeLosses: (losses: number) => void;
  onNext: () => void;
  onBack: () => void;
}

const REGION_OPTIONS: { name: string; psh: number; description: string }[] = [
  { name: 'Abuja (FCT)', psh: 5.2, description: 'North Central Belt — High annual GHI solar irradiance' },
  { name: 'Lagos State', psh: 4.8, description: 'South West Coastal — High humidity & cloud cover derating' },
  { name: 'Kano State', psh: 6.0, description: 'Far North Sahel — Peak solar resource (6.0+ h/day PSH)' },
  { name: 'Port Harcourt (Rivers)', psh: 4.5, description: 'Niger Delta — High rainfall & heavy seasonal overcast' },
  { name: 'Ibadan (Oyo)', psh: 4.9, description: 'South West Belt — Moderate seasonal solar generation' },
  { name: 'Enugu State', psh: 4.7, description: 'South East Belt — Balanced solar resource' },
];

export function Step04Location({
  locationRegion,
  peakSunHours,
  systemLossesFactor,
  onChangeLocation,
  onChangeLosses,
  onNext,
  onBack,
}: Step04Props) {
  return (
    <div className="flex flex-col gap-6 py-2">
      <div>
        <span className="text-xs font-semibold text-[#00490e] uppercase tracking-wider block mb-1">
          Step 04 of 09
        </span>
        <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#191d17]">
          Location & Solar Irradiance Resource
        </h2>
        <p className="font-sans text-sm text-[#41493e] mt-1">
          Select property location region to determine Peak Sun Hours (PSH) and thermal/dust derating factors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Region Selection Grid */}
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

        {/* Irradiance Summary Card & Losses Slider */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#c0c9bb]/40 shadow-sm space-y-4">
          <h4 className="font-headline font-bold text-sm text-[#00490e] uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-base">wb_sunny</span>
            <span>Solar Resource & System Derating</span>
          </h4>

          <div className="bg-[#00490e] text-white p-4 rounded-2xl flex justify-between items-center shadow-md">
            <div>
              <span className="text-[10px] font-bold text-[#aef4a5] uppercase tracking-wider block">
                Active Peak Sun Hours (PSH)
              </span>
              <div className="font-headline font-extrabold text-3xl mt-0.5">
                {peakSunHours} Hours/Day
              </div>
            </div>
            <span className="text-xs bg-white/10 px-3 py-1 rounded-full border border-white/20">
              {locationRegion} Region
            </span>
          </div>

          {/* System Losses Select */}
          <div className="space-y-1">
            <label className="font-sans text-xs font-bold text-[#191d17] block mb-1">
              System Loss Derating Factor (Dust, Temperature, Cabling)
            </label>
            <select
              value={systemLossesFactor}
              onChange={(e) => onChangeLosses(Number(e.target.value))}
              className="w-full bg-[#ecefe6] border border-[#c0c9bb]/60 rounded-xl px-3.5 py-2.5 font-bold text-xs text-[#191d17] outline-none focus:ring-2 focus:ring-[#00490e]"
            >
              <option value={0.82}>82% Efficiency (18% Losses — Standard IEC Rating)</option>
              <option value={0.85}>85% Efficiency (15% Losses — High-Efficiency Inverter)</option>
              <option value={0.78}>78% Efficiency (22% Losses — High Ambient Temperature & Dust)</option>
            </select>
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
          <span>Continue to Panel Selection</span>
          <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}
