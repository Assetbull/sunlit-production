'use client';

import React from 'react';
import { SharedCalculationResult } from '@/lib/engineering/types';

interface Step06Props {
  calculationResult: SharedCalculationResult | null;
  onNext: () => void;
  onBack: () => void;
}

export function Step06Results({ calculationResult, onNext, onBack }: Step06Props) {
  const resData = calculationResult?.engineering_results || {};
  const categoryTotals: Record<string, { watts: number; dailyKwh: number; itemCount: number }> = resData.categoryTotals || {};
  const assumptions = calculationResult?.assumptions || {};

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Header Banner */}
      <div className="border-b border-[#c0c9bb]/40 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#00490e] bg-[#aef4a5]/40 px-2.5 py-0.5 rounded-full border border-[#92d78b]">
            Stitch Engineering Load Summary
          </span>
          <span className="text-xs text-[#717a6d] font-medium">• Appliance Sizer Engine V2.0</span>
        </div>
        <h2 className="font-headline font-extrabold text-2xl sm:text-4xl text-[#00490e] tracking-tight">
          Active Load Calculation Results
        </h2>
        <p className="font-sans text-xs sm:text-sm text-[#41493e] mt-1">
          Verified active connected power, inductive peak surge demand, and daily energy consumption.
        </p>
      </div>

      {/* Primary Report Cards */}
      <div className="bg-gradient-to-br from-white via-[#fafaf4] to-[#eeeee9] border border-[#92d78b]/80 rounded-3xl p-6 shadow-sm">
        <span className="inline-block px-3 py-1 bg-[#00490e] text-[#aef4a5] font-semibold rounded-full text-[11px] mb-5 uppercase tracking-wider">
          Calculated Load Profile Baseline
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#717a6d] font-bold text-xs uppercase">
              <span className="material-symbols-outlined text-[#00490e] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                bolt
              </span>
              <span>Connected Active Power</span>
            </div>
            <div className="font-headline font-extrabold text-4xl text-[#00490e]">
              {resData.totalConnectedKw ?? 0}
              <span className="text-sm font-normal text-[#41493e] ml-1">kW</span>
            </div>
            <div className="font-mono text-xs text-[#717a6d] mt-1">
              {resData.totalConnectedWatts ?? 0} Watts Active
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#717a6d] font-bold text-xs uppercase">
              <span className="material-symbols-outlined text-amber-600 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                speed
              </span>
              <span>Peak Demand (Surge)</span>
            </div>
            <div className="font-headline font-extrabold text-4xl text-amber-700">
              {resData.peakDemandKw ?? 0}
              <span className="text-sm font-normal text-[#41493e] ml-1">kW</span>
            </div>
            <div className="font-mono text-xs text-[#717a6d] mt-1">
              Includes inductive startup headroom
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#717a6d] font-bold text-xs uppercase">
              <span className="material-symbols-outlined text-emerald-600 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                analytics
              </span>
              <span>Daily Energy Demand</span>
            </div>
            <div className="font-headline font-extrabold text-4xl text-[#00490e]">
              {resData.dailyEnergyDemandKwh ?? 0}
              <span className="text-sm font-normal text-[#41493e] ml-1">kWh/day</span>
            </div>
            <div className="font-mono text-xs text-[#717a6d] mt-1">
              Monthly estimate: {resData.monthlyEnergyDemandKwh ?? 0} kWh
            </div>
          </div>
        </div>

        {/* Secondary Subsets */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-[#c0c9bb]/40 pt-5 text-xs font-sans">
          <div>
            <span className="text-[#717a6d] font-medium block mb-0.5">Critical Subset</span>
            <span className="font-bold text-[#1a1c19] text-base">{resData.criticalDailyKwh ?? 0} kWh/day</span>
          </div>
          <div>
            <span className="text-[#717a6d] font-medium block mb-0.5">Item Count</span>
            <span className="font-bold text-[#1a1c19] text-base">{resData.itemCount ?? 0} Types</span>
          </div>
          <div>
            <span className="text-[#717a6d] font-medium block mb-0.5">Inverter Headroom</span>
            <span className="font-bold text-[#1a1c19] text-base">{Math.ceil((resData.peakDemandKw ?? 0) * 1.25)} kVA</span>
          </div>
          <div>
            <span className="text-[#717a6d] font-medium block mb-0.5">DISCO Tariff Benchmark</span>
            <span className="font-bold text-[#00490e] text-base">₦225 / kWh</span>
          </div>
        </div>
      </div>

      {/* Category Load Breakdown */}
      {Object.keys(categoryTotals).length > 0 && (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#c0c9bb]/40 shadow-sm space-y-3">
          <h4 className="font-headline font-bold text-sm text-[#1a1c19] uppercase tracking-wider">
            Energy Demand Breakdown by Category
          </h4>

          <div className="space-y-3">
            {Object.entries(categoryTotals).map(([catName, catData]) => {
              const totalKwh = resData.dailyEnergyDemandKwh || 1;
              const percent = Math.min(100, Math.round((catData.dailyKwh / totalKwh) * 100));

              return (
                <div key={catName} className="space-y-1 text-xs">
                  <div className="flex justify-between font-bold text-[#1a1c19]">
                    <span>{catName}</span>
                    <span className="font-mono text-[#00490e]">
                      {catData.dailyKwh} kWh/day ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#eeeee9] rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#00490e] h-full rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Engineering Confidence Box */}
      <div className="p-4 bg-[#eeeee9] border border-[#c0c9bb]/40 rounded-2xl flex items-start gap-3 text-xs">
        <span className="material-symbols-outlined text-[#00490e] text-xl shrink-0 mt-0.5">
          verified
        </span>
        <div>
          <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-[#00490e]">
            Engineering Confidence: HIGH
          </h4>
          <p className="font-sans text-xs text-[#41493e] mt-1">
            {calculationResult?.confidenceReasoning ||
              'Load calculated directly from detailed appliance inventory with surge multipliers.'}
          </p>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#c0c9bb]/30">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-[#c0c9bb] text-[#1a1c19] font-sans text-sm font-semibold hover:bg-[#eeeee9] transition-all"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 bg-[#00490e] hover:bg-[#003006] text-white px-8 py-3 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md group"
        >
          <span>Continue to Save Profile</span>
          <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}
