'use client';

import React from 'react';
import { SunlitIcon } from '@/shared/components/ui/SunlitIcon';

interface Step03Props {
  continuousWatts: number;
  surgeWatts: number;
  powerFactor: number;
  growthMargin: number;
  onChangeSurgeWatts: (watts: number) => void;
  onChangePowerFactor: (pf: number) => void;
  onChangeMargin: (margin: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step03SurgeAssessment({
  continuousWatts,
  surgeWatts,
  powerFactor,
  growthMargin,
  onChangeSurgeWatts,
  onChangePowerFactor,
  onChangeMargin,
  onNext,
  onBack,
}: Step03Props) {
  const currentMultiplier = Number((surgeWatts / (continuousWatts || 1)).toFixed(1));

  const handleMultiplierChange = (mult: number) => {
    onChangeSurgeWatts(Math.round(continuousWatts * mult));
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      <div>
        <span className="text-[11px] font-bold text-[#00490e] uppercase tracking-wider block mb-1">
          STEP 03 OF 07
        </span>
        <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#1f1b17]">
          Motor Startup Surge Demand Assessment
        </h2>
        <p className="font-sans text-sm text-[#40493d] mt-1 leading-relaxed">
          Evaluate instantaneous peak inrush currents to prevent inverter overload tripping during motor startup cycles.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Surge Multiplier Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#bfcaba]/40 shadow-xs space-y-4">
          <h4 className="font-headline font-bold text-xs text-[#00490e] uppercase tracking-wider flex items-center gap-2">
            <SunlitIcon name="bolt" size={16} />
            <span>Peak Inrush Multiplier</span>
          </h4>

          <div className="bg-[#fcf2eb] p-4 rounded-xl border border-[#bfcaba]/30 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-sans font-bold text-xs text-[#1f1b17]">
                Surge Multiplier Factor
              </span>
              <span className="font-headline font-extrabold text-xl text-[#00490e]">
                {currentMultiplier}× Peak
              </span>
            </div>
            <input
              type="range"
              min={1.0}
              max={5.0}
              step={0.1}
              value={currentMultiplier}
              onChange={(e) => handleMultiplierChange(Number(e.target.value))}
              className="w-full accent-[#00490e] cursor-pointer py-1"
            />
            <div className="flex justify-between items-center text-[11px] font-mono text-[#707a6c]">
              <span>1.0× (Resistive)</span>
              <span>2.5× (Standard)</span>
              <span>5.0× (Heavy Pumps)</span>
            </div>
          </div>

          <div className="p-4 bg-[#00490e] text-white rounded-xl flex justify-between items-center shadow-xs">
            <div>
              <span className="text-[10px] font-bold text-[#8cdd86] uppercase tracking-wider block">
                Calculated Peak Surge Rating
              </span>
              <div className="font-headline font-extrabold text-2xl mt-0.5">
                {(surgeWatts / 1000).toFixed(2)} kW Peak
              </div>
            </div>
            <span className="text-xs bg-white/10 px-3 py-1 rounded-full border border-white/20">
              5-Sec Inrush Capacity
            </span>
          </div>
        </div>

        {/* Power Factor & Safety Headroom Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#bfcaba]/40 shadow-xs space-y-4">
          <h4 className="font-headline font-bold text-xs text-[#00490e] uppercase tracking-wider flex items-center gap-2">
            <SunlitIcon name="tune" size={16} />
            <span>Power Factor & Safety Reserve</span>
          </h4>

          {/* Power Factor Select */}
          <div className="space-y-1">
            <label className="font-sans text-xs font-bold text-[#1f1b17] block mb-1">
              Electrical Power Factor (PF)
            </label>
            <select
              value={powerFactor}
              onChange={(e) => onChangePowerFactor(Number(e.target.value))}
              className="w-full bg-[#fcf2eb] border border-[#bfcaba]/60 rounded-xl px-3.5 py-2.5 font-bold text-xs text-[#1f1b17] outline-none focus:ring-2 focus:ring-[#00490e]"
            >
              <option value={0.8}>0.80 PF — Inductive Loads (Motors, Compressors, Pumps)</option>
              <option value={0.85}>0.85 PF — Commercial Mixed Residential Load</option>
              <option value={0.95}>0.95 PF — High Efficiency Resistive Load</option>
              <option value={1.0}>1.00 PF — Pure Resistive Heating / IT Load</option>
            </select>
          </div>

          {/* Safety Margin Select */}
          <div className="space-y-1">
            <label className="font-sans text-xs font-bold text-[#1f1b17] block mb-1">
              Inverter Safety Reserve Margin
            </label>
            <select
              value={growthMargin}
              onChange={(e) => onChangeMargin(Number(e.target.value))}
              className="w-full bg-[#fcf2eb] border border-[#bfcaba]/60 rounded-xl px-3.5 py-2.5 font-bold text-xs text-[#1f1b17] outline-none focus:ring-2 focus:ring-[#00490e]"
            >
              <option value={1.25}>25% Expansion Reserve (Recommended Standard)</option>
              <option value={1.2}>20% Tight Budget Margin</option>
              <option value={1.3}>30% High Growth Buffer</option>
              <option value={1.5}>50% Heavy Duty Commercial Reserve</option>
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
          aria-label="Continue to Review Plan"
          className="inline-flex items-center gap-2 bg-[#00490e] hover:bg-[#0f631b] text-white px-7 py-2.5 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md group cursor-pointer"
        >
          <span>Continue to Review Plan</span>
          <SunlitIcon name="arrow_forward" size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
