'use client';

import React from 'react';
import { SharedCalculationResult } from '@/lib/engineering/types';
import { SunlitIcon } from '@/shared/components/ui/SunlitIcon';

interface Step07Props {
  calculationResult: SharedCalculationResult | null;
  onNext: () => void;
  onBack: () => void;
}

export function Step07PrimaryResult({ calculationResult, onNext, onBack }: Step07Props) {
  const resData = calculationResult?.engineering_results || {};
  const equipList = calculationResult?.recommended_configuration?.equipmentList || [];
  const primaryEquip = equipList[0];

  const actualKwp = resData.actualArrayKwp ?? 7.7;
  const panelCount = resData.recommendedPanelCount ?? 14;
  const dailyGenKwh = resData.estimatedDailyGenerationKwh ?? 30.1;
  const roofAreaM2 = resData.estimatedRoofAreaM2 ?? 32.2;
  const psh = resData.peakSunHours ?? 4.8;
  const coverage = resData.coveragePercent ?? 100.3;

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Header Banner */}
      <div className="border-b border-[#bfcaba]/40 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#00490e] bg-[#ceee93]/40 px-2.5 py-0.5 rounded-full border border-[#00490e]/20">
            Stitch Visual DNA Engine
          </span>
          <span className="text-xs text-[#707a6c] font-medium">• PV Array Sizing V2.1</span>
        </div>
        <h2 className="font-headline font-extrabold text-2xl sm:text-4xl text-[#00490e] tracking-tight">
          Solar Panel Array Sizing Results
        </h2>
        <p className="font-sans text-xs sm:text-sm text-[#40493d] mt-1">
          Required PV capacity kWp, recommended panel module count, daily solar generation, and roof footprint area.
        </p>
      </div>

      {/* Primary PV Array Card */}
      <div className="bg-gradient-to-br from-white via-[#fff8f5] to-[#f6ece6] border border-[#00490e]/30 rounded-3xl p-5 sm:p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#bfcaba]/30 pb-4">
          <div>
            <span className="text-[11px] font-bold text-[#00490e] uppercase tracking-wider block">
              Required PV Array Installed Capacity
            </span>
            <div className="font-headline font-extrabold text-4xl sm:text-5xl text-[#00490e] mt-1 tracking-tight">
              {actualKwp}{' '}
              <span className="text-lg font-bold text-[#40493d]">kWp</span>
            </div>
          </div>

          <div className="bg-[#00490e] text-[#8cdd86] font-headline font-bold text-xs px-4 py-2 rounded-full shadow-xs">
            {panelCount} Solar Panels ({resData.recommendedPanelWattage ?? 550}W STC each)
          </div>
        </div>

        {/* Secondary Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-sans">
          <div className="bg-white/90 p-3 rounded-xl border border-[#bfcaba]/30 shadow-xs">
            <span className="text-[#707a6c] font-medium block mb-0.5">Estimated Daily Yield</span>
            <span className="font-headline font-bold text-base text-[#00490e]">
              {dailyGenKwh} kWh/day
            </span>
            <span className="text-[10px] text-[#707a6c] block mt-0.5">
              @ {psh} Peak Sun Hours
            </span>
          </div>

          <div className="bg-white/90 p-3 rounded-xl border border-[#bfcaba]/30 shadow-xs">
            <span className="text-[#707a6c] font-medium block mb-0.5">Roof Footprint Area</span>
            <span className="font-headline font-bold text-base text-[#1f1b17]">
              {roofAreaM2} m²
            </span>
            <span className="text-[10px] text-[#707a6c] block mt-0.5">
              ~{Math.round(roofAreaM2 / 0.0929)} sq ft roof space
            </span>
          </div>

          <div className="bg-white/90 p-3 rounded-xl border border-[#bfcaba]/30 shadow-xs">
            <span className="text-[#707a6c] font-medium block mb-0.5">Demand Offset</span>
            <span className="font-headline font-bold text-base text-[#0f631b]">
              {coverage}%
            </span>
            <span className="text-[10px] text-[#707a6c] block mt-0.5">
              Target Solar Coverage
            </span>
          </div>

          <div className="bg-white/90 p-3 rounded-xl border border-[#bfcaba]/30 shadow-xs">
            <span className="text-[#707a6c] font-medium block mb-0.5">Annual Generation</span>
            <span className="font-headline font-bold text-base text-[#1f1b17]">
              {Math.round(dailyGenKwh * 365).toLocaleString()} kWh
            </span>
            <span className="text-[10px] text-[#707a6c] block mt-0.5">
              Per Year Clean Energy
            </span>
          </div>
        </div>
      </div>

      {/* Recommended Equipment Box */}
      {primaryEquip && (
        <div className="p-4 bg-[#f6ece6] border border-[#bfcaba]/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00490e] text-white flex items-center justify-center font-bold shrink-0">
              <SunlitIcon name="solar_power" size={20} />
            </div>
            <div>
              <h4 className="font-headline font-bold text-sm text-[#1f1b17]">
                {primaryEquip.recommendedQuantity} × {primaryEquip.name}
              </h4>
              <p className="font-sans text-xs text-[#707a6c] mt-0.5">{primaryEquip.reason}</p>
            </div>
          </div>
        </div>
      )}

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
          aria-label="Continue to Panel Configuration & Layout"
          className="inline-flex items-center gap-2 bg-[#00490e] hover:bg-[#0f631b] text-white px-8 py-3 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md group cursor-pointer"
        >
          <span>Continue to Panel Configuration & Layout</span>
          <SunlitIcon name="arrow_forward" size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
