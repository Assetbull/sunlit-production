'use client';

import React from 'react';
import { SharedCalculationResult } from '@/lib/engineering/types';
import { SunlitIcon } from '@/shared/components/ui/SunlitIcon';

interface Step04Props {
  calculationResult: SharedCalculationResult | null;
  onNext: () => void;
  onBack: () => void;
}

export function Step04AnnualYieldResult({ calculationResult, onNext, onBack }: Step04Props) {
  const resData = calculationResult?.engineering_results || {};
  const annualKwh = resData.annualEnergyYieldKwh ?? 12410;
  const specificYield = resData.specificYieldKwhKwp ?? 1611.7;
  const prPercent = resData.performanceRatioPercent ?? 84.5;
  const dailyAvg = resData.dailyAverageGenKwh ?? 34.0;
  const kwp = resData.systemCapacityKwp ?? 7.7;
  const region = resData.locationRegion ?? 'Abuja (FCT)';

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Header Banner */}
      <div className="border-b border-[#bfcaba]/40 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#00490e] bg-[#ceee93]/40 px-2.5 py-0.5 rounded-full border border-[#00490e]/20">
            Veridian Yield Engine
          </span>
          <span className="text-xs text-[#707a6c] font-medium">• Step 04 of 08</span>
        </div>
        <h2 className="font-headline font-extrabold text-2xl sm:text-4xl text-[#00490e] tracking-tight">
          Annual Energy Yield & Performance Results
        </h2>
        <p className="font-sans text-xs sm:text-sm text-[#40493d] mt-1">
          Simulated annual clean solar energy generation (kWh/yr), specific yield (kWh/kWp/yr), and system Performance Ratio (PR %).
        </p>
      </div>

      {/* Primary Metric Card */}
      <div className="bg-gradient-to-br from-white via-[#fff8f5] to-[#f6ece6] border border-[#00490e]/30 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#bfcaba]/30 pb-4">
          <div>
            <span className="text-[11px] font-bold text-[#00490e] uppercase tracking-wider block">
              Total Simulated Annual Energy Generation
            </span>
            <div className="font-headline font-extrabold text-4xl sm:text-5xl text-[#00490e] mt-1 tracking-tight">
              {annualKwh.toLocaleString()}{' '}
              <span className="text-lg font-bold text-[#40493d]">kWh / Year</span>
            </div>
          </div>

          <div className="bg-[#00490e] text-[#8cdd86] font-headline font-bold text-xs px-4 py-2 rounded-full shadow-xs">
            {kwp} kWp Installed Capacity in {region}
          </div>
        </div>

        {/* Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-sans">
          <div className="bg-white/90 p-3.5 rounded-xl border border-[#bfcaba]/30 shadow-xs">
            <span className="text-[#707a6c] font-medium block mb-0.5">Specific Yield</span>
            <span className="font-headline font-bold text-base text-[#00490e]">
              {specificYield} kWh/kWp/yr
            </span>
            <span className="text-[10px] text-[#707a6c] block mt-0.5">Energy per kWp capacity</span>
          </div>

          <div className="bg-white/90 p-3.5 rounded-xl border border-[#bfcaba]/30 shadow-xs">
            <span className="text-[#707a6c] font-medium block mb-0.5">Performance Ratio (PR)</span>
            <span className="font-headline font-bold text-base text-[#0f631b]">
              {prPercent}%
            </span>
            <span className="text-[10px] text-[#707a6c] block mt-0.5">Net system efficiency</span>
          </div>

          <div className="bg-white/90 p-3.5 rounded-xl border border-[#bfcaba]/30 shadow-xs">
            <span className="text-[#707a6c] font-medium block mb-0.5">Daily Average Yield</span>
            <span className="font-headline font-bold text-base text-[#1f1b17]">
              {dailyAvg} kWh/day
            </span>
            <span className="text-[10px] text-[#707a6c] block mt-0.5">Annual daily mean</span>
          </div>

          <div className="bg-white/90 p-3.5 rounded-xl border border-[#bfcaba]/30 shadow-xs">
            <span className="text-[#707a6c] font-medium block mb-0.5">Carbon Offset</span>
            <span className="font-headline font-bold text-base text-[#1f1b17]">
              {(annualKwh * 0.0007).toFixed(1)} Tons CO₂/yr
            </span>
            <span className="text-[10px] text-[#707a6c] block mt-0.5">Clean energy benefit</span>
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
          aria-label="Continue to 12-Month Yield Chart"
          className="inline-flex items-center gap-2 bg-[#00490e] hover:bg-[#0f631b] text-white px-8 py-3 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md group cursor-pointer"
        >
          <span>Continue to 12-Month Yield Chart</span>
          <SunlitIcon name="arrow_forward" size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
