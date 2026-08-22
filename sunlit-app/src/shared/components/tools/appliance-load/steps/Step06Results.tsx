'use client';

import React from 'react';
import { SharedCalculationResult } from '@/lib/engineering/types';
import { SunlitIcon } from '@/shared/components/ui/SunlitIcon';

interface Step06Props {
  calculationResult: SharedCalculationResult | null;
  onNext: () => void;
  onBack: () => void;
}

export function Step06Results({ calculationResult, onNext, onBack }: Step06Props) {
  const resData = calculationResult?.engineering_results || {};
  const categoryTotals: Record<string, { watts: number; dailyKwh: number; itemCount: number }> = resData.categoryTotals || {};

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Header Banner */}
      <div className="border-b border-[#bfcaba]/40 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#00490e] bg-[#ceee93]/40 px-2.5 py-0.5 rounded-full border border-[#00490e]/20">
            Engineering Load Summary
          </span>
          <span className="text-xs text-[#707a6c] font-medium">• Appliance Sizer Engine V2.0</span>
        </div>
        <h2 className="font-headline font-extrabold text-2xl sm:text-4xl text-[#00490e] tracking-tight">
          Active Load Calculation Results
        </h2>
        <p className="font-sans text-xs sm:text-sm text-[#40493d] mt-1">
          Verified active connected power, inductive peak surge demand, and daily energy consumption.
        </p>
      </div>

      {/* Primary Report Cards */}
      <div className="bg-gradient-to-br from-white via-[#fff8f5] to-[#f6ece6] border border-[#00490e]/30 rounded-3xl p-6 shadow-xs">
        <span className="inline-block px-3.5 py-1 bg-[#00490e] text-[#8cdd86] font-semibold rounded-full text-[11px] mb-5 uppercase tracking-wider">
          Calculated Load Profile Baseline
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#707a6c] font-bold text-xs uppercase">
              <SunlitIcon name="bolt" size={16} className="text-[#00490e]" />
              <span>Connected Active Power</span>
            </div>
            <div className="font-headline font-extrabold text-4xl text-[#00490e]">
              {resData.totalConnectedKw ?? 0}
              <span className="text-sm font-normal text-[#40493d] ml-1">kW</span>
            </div>
            <div className="font-mono text-xs text-[#707a6c] mt-1">
              {resData.totalConnectedWatts ?? 0} Watts Active
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#707a6c] font-bold text-xs uppercase">
              <SunlitIcon name="speed" size={16} className="text-amber-600" />
              <span>Peak Demand (Surge)</span>
            </div>
            <div className="font-headline font-extrabold text-4xl text-amber-700">
              {resData.peakDemandKw ?? 0}
              <span className="text-sm font-normal text-[#40493d] ml-1">kW</span>
            </div>
            <div className="font-mono text-xs text-[#707a6c] mt-1">
              Includes inductive startup headroom
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#707a6c] font-bold text-xs uppercase">
              <SunlitIcon name="analytics" size={16} className="text-[#0f631b]" />
              <span>Daily Energy Demand</span>
            </div>
            <div className="font-headline font-extrabold text-4xl text-[#00490e]">
              {resData.dailyEnergyDemandKwh ?? 0}
              <span className="text-sm font-normal text-[#40493d] ml-1">kWh/day</span>
            </div>
            <div className="font-mono text-xs text-[#707a6c] mt-1">
              Monthly estimate: {resData.monthlyEnergyDemandKwh ?? 0} kWh
            </div>
          </div>
        </div>

        {/* Secondary Subsets */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-[#bfcaba]/40 pt-5 text-xs font-sans">
          <div>
            <span className="text-[#707a6c] font-medium block mb-0.5">Critical Subset</span>
            <span className="font-bold text-[#1f1b17] text-base">{resData.criticalDailyKwh ?? 0} kWh/day</span>
          </div>
          <div>
            <span className="text-[#707a6c] font-medium block mb-0.5">Item Count</span>
            <span className="font-bold text-[#1f1b17] text-base">{resData.itemCount ?? 0} Types</span>
          </div>
          <div>
            <span className="text-[#707a6c] font-medium block mb-0.5">Inverter Headroom</span>
            <span className="font-bold text-[#1f1b17] text-base">{Math.ceil((resData.peakDemandKw ?? 0) * 1.25)} kVA</span>
          </div>
          <div>
            <span className="text-[#707a6c] font-medium block mb-0.5">DISCO Tariff Benchmark</span>
            <span className="font-bold text-[#00490e] text-base">₦225 / kWh</span>
          </div>
        </div>
      </div>

      {/* Category Load Breakdown */}
      {Object.keys(categoryTotals).length > 0 && (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#bfcaba]/40 shadow-xs space-y-3">
          <h4 className="font-headline font-bold text-xs text-[#1f1b17] uppercase tracking-wider">
            Energy Demand Breakdown by Category
          </h4>

          <div className="space-y-3">
            {Object.entries(categoryTotals).map(([catName, catData]) => {
              const totalKwh = resData.dailyEnergyDemandKwh || 1;
              const percent = Math.min(100, Math.round((catData.dailyKwh / totalKwh) * 100));

              return (
                <div key={catName} className="space-y-1 text-xs">
                  <div className="flex justify-between font-bold text-[#1f1b17]">
                    <span>{catName}</span>
                    <span className="font-mono text-[#00490e]">
                      {catData.dailyKwh} kWh/day ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#f6ece6] rounded-full h-2 overflow-hidden">
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
      <div className="p-4 bg-[#f6ece6] border border-[#bfcaba]/40 rounded-2xl flex items-start gap-3 text-xs">
        <SunlitIcon name="check_circle" size={20} className="text-[#00490e] shrink-0 mt-0.5" />
        <div>
          <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-[#00490e]">
            Engineering Confidence: HIGH
          </h4>
          <p className="font-sans text-xs text-[#40493d] mt-1 leading-relaxed">
            {calculationResult?.confidenceReasoning ||
              'Load calculated directly from detailed appliance inventory with surge multipliers.'}
          </p>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#bfcaba]/30">
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back to review"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-[#707a6c] text-[#1f1b17] font-sans text-sm font-semibold hover:bg-[#f6ece6] transition-all cursor-pointer"
        >
          <SunlitIcon name="arrow_back" size={16} />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          aria-label="Continue to Save Profile"
          className="inline-flex items-center gap-2 bg-[#00490e] hover:bg-[#0f631b] text-white px-8 py-3 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md group cursor-pointer"
        >
          <span>Continue to Save Profile</span>
          <SunlitIcon name="arrow_forward" size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
