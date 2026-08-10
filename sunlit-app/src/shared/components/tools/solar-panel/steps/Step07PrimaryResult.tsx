'use client';

import React from 'react';
import { SharedCalculationResult } from '@/lib/engineering/types';

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
      <div className="border-b border-[#c0c9bb]/40 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#00490e] bg-[#aef4a5]/40 px-2.5 py-0.5 rounded-full border border-[#92d78b]">
            Stitch Visual DNA Engine
          </span>
          <span className="text-xs text-[#717a6d] font-medium">• PV Array Sizing V2.1</span>
        </div>
        <h2 className="font-headline font-extrabold text-2xl sm:text-4xl text-[#00490e] tracking-tight">
          Solar Panel Array Sizing Results
        </h2>
        <p className="font-sans text-xs sm:text-sm text-[#41493e] mt-1">
          Required PV capacity kWp, recommended panel module count, daily solar generation, and roof footprint area.
        </p>
      </div>

      {/* Primary PV Array Card */}
      <div className="bg-gradient-to-br from-white via-[#f7fbf1] to-[#ecefe6] border border-[#92d78b]/80 rounded-3xl p-5 sm:p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#c0c9bb]/30 pb-4">
          <div>
            <span className="text-xs font-semibold text-[#00490e] uppercase tracking-wider block">
              Required PV Array Installed Capacity
            </span>
            <div className="font-headline font-extrabold text-4xl sm:text-5xl text-[#00490e] mt-1 tracking-tight">
              {actualKwp}{' '}
              <span className="text-lg font-bold text-[#41493e]">kWp</span>
            </div>
          </div>

          <div className="bg-[#00490e] text-[#aef4a5] font-headline font-bold text-xs px-4 py-2 rounded-full shadow-sm">
            {panelCount} Solar Panels ({resData.recommendedPanelWattage ?? 550}W STC each)
          </div>
        </div>

        {/* Secondary Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-sans">
          <div className="bg-white/80 p-3 rounded-xl border border-[#c0c9bb]/30">
            <span className="text-[#717a6d] font-medium block mb-0.5">Estimated Daily Yield</span>
            <span className="font-headline font-bold text-base text-[#00490e]">
              {dailyGenKwh} kWh/day
            </span>
            <span className="text-[10px] text-[#717a6d] block mt-0.5">
              @ {psh} Peak Sun Hours
            </span>
          </div>

          <div className="bg-white/80 p-3 rounded-xl border border-[#c0c9bb]/30">
            <span className="text-[#717a6d] font-medium block mb-0.5">Roof Footprint Area</span>
            <span className="font-headline font-bold text-base text-[#191d17]">
              {roofAreaM2} m²
            </span>
            <span className="text-[10px] text-[#717a6d] block mt-0.5">
              ~{Math.round(roofAreaM2 / 0.0929)} sq ft roof space
            </span>
          </div>

          <div className="bg-white/80 p-3 rounded-xl border border-[#c0c9bb]/30">
            <span className="text-[#717a6d] font-medium block mb-0.5">Demand Offset</span>
            <span className="font-headline font-bold text-base text-emerald-800">
              {coverage}%
            </span>
            <span className="text-[10px] text-[#717a6d] block mt-0.5">
              Target Solar Coverage
            </span>
          </div>

          <div className="bg-white/80 p-3 rounded-xl border border-[#c0c9bb]/30">
            <span className="text-[#717a6d] font-medium block mb-0.5">Annual Generation</span>
            <span className="font-headline font-bold text-base text-[#191d17]">
              {Math.round(dailyGenKwh * 365).toLocaleString()} kWh
            </span>
            <span className="text-[10px] text-[#717a6d] block mt-0.5">
              Per Year Clean Energy
            </span>
          </div>
        </div>
      </div>

      {/* Recommended Equipment Box */}
      {primaryEquip && (
        <div className="p-4 bg-[#ecefe6] border border-[#c0c9bb]/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00490e] text-white flex items-center justify-center font-bold shrink-0">
              <span className="material-symbols-outlined text-xl">solar_power</span>
            </div>
            <div>
              <h4 className="font-headline font-bold text-sm text-[#191d17]">
                {primaryEquip.recommendedQuantity} × {primaryEquip.name}
              </h4>
              <p className="font-sans text-xs text-[#717a6d] mt-0.5">{primaryEquip.reason}</p>
            </div>
          </div>
        </div>
      )}

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
          <span>Continue to Panel Configuration & Layout</span>
          <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}
