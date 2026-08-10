'use client';

import React from 'react';
import { SharedCalculationResult } from '@/lib/engineering/types';

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
      <div className="border-b border-[#c0c9bb]/40 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#00490e] bg-[#aef4a5]/40 px-2.5 py-0.5 rounded-full border border-[#92d78b]">
            Veridian Yield Engine
          </span>
          <span className="text-xs text-[#717a6d] font-medium">• Step 04 of 08</span>
        </div>
        <h2 className="font-headline font-extrabold text-2xl sm:text-4xl text-[#00490e] tracking-tight">
          Annual Energy Yield & Performance Results
        </h2>
        <p className="font-sans text-xs sm:text-sm text-[#41493e] mt-1">
          Simulated annual clean solar energy generation (kWh/yr), specific yield (kWh/kWp/yr), and system Performance Ratio (PR %).
        </p>
      </div>

      {/* Primary Metric Card */}
      <div className="bg-gradient-to-br from-white via-[#f7fbf1] to-[#ecefe6] border border-[#92d78b]/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#c0c9bb]/30 pb-4">
          <div>
            <span className="text-xs font-semibold text-[#00490e] uppercase tracking-wider block">
              Total Simulated Annual Energy Generation
            </span>
            <div className="font-headline font-extrabold text-4xl sm:text-5xl text-[#00490e] mt-1 tracking-tight">
              {annualKwh.toLocaleString()}{' '}
              <span className="text-lg font-bold text-[#41493e]">kWh / Year</span>
            </div>
          </div>

          <div className="bg-[#00490e] text-[#aef4a5] font-headline font-bold text-xs px-4 py-2 rounded-full shadow-sm">
            {kwp} kWp Installed Capacity in {region}
          </div>
        </div>

        {/* Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-sans">
          <div className="bg-white/80 p-3.5 rounded-xl border border-[#c0c9bb]/30">
            <span className="text-[#717a6d] font-medium block mb-0.5">Specific Yield</span>
            <span className="font-headline font-bold text-base text-[#00490e]">
              {specificYield} kWh/kWp/yr
            </span>
            <span className="text-[10px] text-[#717a6d] block mt-0.5">Energy per kWp capacity</span>
          </div>

          <div className="bg-white/80 p-3.5 rounded-xl border border-[#c0c9bb]/30">
            <span className="text-[#717a6d] font-medium block mb-0.5">Performance Ratio (PR)</span>
            <span className="font-headline font-bold text-base text-emerald-800">
              {prPercent}%
            </span>
            <span className="text-[10px] text-[#717a6d] block mt-0.5">Net system efficiency</span>
          </div>

          <div className="bg-white/80 p-3.5 rounded-xl border border-[#c0c9bb]/30">
            <span className="text-[#717a6d] font-medium block mb-0.5">Daily Average Yield</span>
            <span className="font-headline font-bold text-base text-[#191d17]">
              {dailyAvg} kWh/day
            </span>
            <span className="text-[10px] text-[#717a6d] block mt-0.5">Annual daily mean</span>
          </div>

          <div className="bg-white/80 p-3.5 rounded-xl border border-[#c0c9bb]/30">
            <span className="text-[#717a6d] font-medium block mb-0.5">Carbon Offset</span>
            <span className="font-headline font-bold text-base text-[#191d17]">
              {(annualKwh * 0.0007).toFixed(1)} Tons CO₂/yr
            </span>
            <span className="text-[10px] text-[#717a6d] block mt-0.5">Clean energy benefit</span>
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
          className="inline-flex items-center gap-2 bg-[#00490e] hover:bg-[#003006] text-white px-8 py-3 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md group"
        >
          <span>Continue to 12-Month Yield Chart</span>
          <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}
