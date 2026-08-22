'use client';

import React from 'react';
import { SunlitIcon } from '@/shared/components/ui/SunlitIcon';

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
        <span className="text-[11px] font-bold text-[#00490e] uppercase tracking-wider block mb-1">
          STEP 04 OF 09
        </span>
        <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#1f1b17]">
          Location & Solar Irradiance Resource
        </h2>
        <p className="font-sans text-sm text-[#40493d] mt-1 leading-relaxed">
          Select property location region to determine Peak Sun Hours (PSH) and thermal/dust derating factors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Region Selection Grid */}
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

        {/* Irradiance Summary Card & Losses Slider */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#bfcaba]/40 shadow-xs space-y-4">
          <h4 className="font-headline font-bold text-xs text-[#00490e] uppercase tracking-wider flex items-center gap-2">
            <SunlitIcon name="wb_sunny" size={16} />
            <span>Solar Resource & System Derating</span>
          </h4>

          <div className="bg-[#00490e] text-white p-4 rounded-2xl flex justify-between items-center shadow-md">
            <div>
              <span className="text-[10px] font-bold text-[#8cdd86] uppercase tracking-wider block">
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
            <label className="font-sans text-xs font-bold text-[#1f1b17] block mb-1">
              System Loss Derating Factor (Dust, Temperature, Cabling)
            </label>
            <select
              value={systemLossesFactor}
              onChange={(e) => onChangeLosses(Number(e.target.value))}
              className="w-full bg-[#fcf2eb] border border-[#bfcaba]/60 rounded-xl px-3.5 py-2.5 font-bold text-xs text-[#1f1b17] outline-none focus:ring-2 focus:ring-[#00490e]"
            >
              <option value={0.82}>82% Efficiency (18% Losses — Standard IEC Rating)</option>
              <option value={0.85}>85% Efficiency (15% Losses — High-Efficiency Inverter)</option>
              <option value={0.78}>78% Efficiency (22% Losses — High Ambient Temperature & Dust)</option>
            </select>
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
          aria-label="Continue to Panel Selection"
          className="inline-flex items-center gap-2 bg-[#00490e] hover:bg-[#0f631b] text-white px-7 py-2.5 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md group cursor-pointer"
        >
          <span>Continue to Panel Selection</span>
          <SunlitIcon name="arrow_forward" size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
