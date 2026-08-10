'use client';

import React from 'react';
import { SharedCalculationResult } from '@/lib/engineering/types';

interface Step07Props {
  calculationResult: SharedCalculationResult | null;
  onNext: () => void;
  onBack: () => void;
}

export function Step07Results({ calculationResult, onNext, onBack }: Step07Props) {
  const resData = calculationResult?.engineering_results || {};
  const assumptions = calculationResult?.assumptions || {};
  const equipList = calculationResult?.recommended_configuration?.equipmentList || [];
  const primaryEquip = equipList[0];

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Header Banner */}
      <div className="border-b border-[#c0c9bb]/40 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#00490e] bg-[#aef4a5]/40 px-2.5 py-0.5 rounded-full border border-[#92d78b]">
            Stitch Visual DNA Engine
          </span>
          <span className="text-xs text-[#717a6d] font-medium">• Storage Sizing V2.1</span>
        </div>
        <h2 className="font-headline font-extrabold text-2xl sm:text-4xl text-[#00490e] tracking-tight">
          Battery Capacity Sizing
        </h2>
        <p className="font-sans text-xs sm:text-sm text-[#41493e] mt-1">
          Configure storage parameters to calculate required system capacity, autonomy days, and DoD.
        </p>
      </div>

      {/* Primary Battery Bank Sizing Card */}
      <div className="bg-gradient-to-br from-white via-[#f7fbf1] to-[#ecefe6] border border-[#92d78b]/80 rounded-3xl p-5 sm:p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#c0c9bb]/30 pb-4">
          <div>
            <span className="text-xs font-semibold text-[#00490e] uppercase tracking-wider block">
              Required Installed Capacity
            </span>
            <div className="font-headline font-extrabold text-4xl sm:text-5xl text-[#00490e] mt-1 tracking-tight">
              {resData.installedCapacityKwh ?? 0}{' '}
              <span className="text-lg font-bold text-[#41493e]">kWh</span>
            </div>
          </div>

          <div className="bg-[#00490e] text-[#aef4a5] font-headline font-bold text-xs px-4 py-2 rounded-full shadow-sm">
            {resData.recommendedModuleCount ?? 1} Battery Modules ({resData.moduleSizeKwh ?? 5.12} kWh each)
          </div>
        </div>

        {/* Secondary Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-sans">
          <div className="bg-white/80 p-3 rounded-xl border border-[#c0c9bb]/30">
            <span className="text-[#717a6d] font-medium block mb-0.5">Usable Reserve</span>
            <span className="font-headline font-bold text-base text-[#191d17]">
              {resData.usableCapacityKwh ?? 0} kWh
            </span>
            <span className="text-[10px] text-[#717a6d] block mt-0.5">
              @ {resData.dod ?? 80}% DoD limit
            </span>
          </div>

          <div className="bg-white/80 p-3 rounded-xl border border-[#c0c9bb]/30">
            <span className="text-[#717a6d] font-medium block mb-0.5">Amp-Hours</span>
            <span className="font-headline font-bold text-base text-[#191d17]">
              {resData.installedAmpHours ?? 0} Ah
            </span>
            <span className="text-[10px] text-[#717a6d] block mt-0.5">
              @ {resData.systemVoltage ?? 48}V DC bus
            </span>
          </div>

          <div className="bg-white/80 p-3 rounded-xl border border-[#c0c9bb]/30">
            <span className="text-[#717a6d] font-medium block mb-0.5">Gross Calculation</span>
            <span className="font-headline font-bold text-base text-[#191d17]">
              {resData.requiredGrossKwh ?? 0} kWh
            </span>
            <span className="text-[10px] text-[#717a6d] block mt-0.5">
              Inc. efficiency derating
            </span>
          </div>

          <div className="bg-white/80 p-3 rounded-xl border border-[#c0c9bb]/30">
            <span className="text-[#717a6d] font-medium block mb-0.5">Daily Energy Target</span>
            <span className="font-headline font-bold text-base text-[#00490e]">
              {resData.activeDailyKwh ?? 0} kWh/day
            </span>
            <span className="text-[10px] text-[#717a6d] block mt-0.5">
              Goal: {resData.backupGoal ?? 'FULL_HOME'}
            </span>
          </div>
        </div>
      </div>

      {/* System Derating Factors Table */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#c0c9bb]/40 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-[#c0c9bb]/30 pb-3">
          <span className="font-headline font-bold text-sm text-[#191d17] uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-[#00490e]">settings</span>
            <span>System Derating Factors</span>
          </span>
          <span className="text-[10px] font-bold bg-[#aef4a5]/40 text-[#00490e] px-2.5 py-0.5 rounded-full border border-[#92d78b]">
            Active
          </span>
        </div>

        <div className="divide-y divide-[#c0c9bb]/20 text-xs font-sans">
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-[#41493e]">Inverter Round-trip Efficiency</span>
            <span className="font-mono font-bold text-[#191d17]">{resData.inverterEfficiency ?? 92}%</span>
          </div>
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-[#41493e]">Temperature Derating Factor</span>
            <span className="font-mono font-bold text-[#191d17]">{resData.temperatureDerating ?? 95}%</span>
          </div>
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-[#41493e]">Depth of Discharge (DoD Limit)</span>
            <span className="font-mono font-bold text-[#191d17]">{resData.dod ?? 80}%</span>
          </div>
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-[#41493e]">Active Daily Energy Requirement</span>
            <span className="font-mono font-bold text-[#00490e]">{resData.activeDailyKwh ?? 0} kWh/day</span>
          </div>
        </div>
      </div>

      {/* Equipment Recommendation Box */}
      {primaryEquip && (
        <div className="p-4 bg-[#ecefe6] border border-[#c0c9bb]/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00490e] text-white flex items-center justify-center font-bold shrink-0">
              <span className="material-symbols-outlined text-xl">battery_charging_full</span>
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
          <span>Continue to Save Specification</span>
          <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}
