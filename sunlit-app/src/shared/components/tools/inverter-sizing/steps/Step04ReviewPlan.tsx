'use client';

import React from 'react';
import { LoadItem } from '@/lib/engineering/calculators/loadCalculator';

interface Step04Props {
  continuousWatts: number;
  surgeWatts: number;
  powerFactor: number;
  growthMargin: number;
  inverterType: string;
  systemVoltage: number;
  items: LoadItem[];
  onNext: () => void;
  onBack: () => void;
  onEdit: () => void;
}

export function Step04ReviewPlan({
  continuousWatts,
  surgeWatts,
  powerFactor,
  growthMargin,
  inverterType,
  systemVoltage,
  items,
  onNext,
  onBack,
  onEdit,
}: Step04Props) {
  const activeKw = (continuousWatts / 1000).toFixed(2);
  const apparentKva = (continuousWatts / (1000 * powerFactor)).toFixed(2);
  const surgeKw = (surgeWatts / 1000).toFixed(2);
  const reservePercent = Math.round((growthMargin - 1) * 100);

  return (
    <div className="flex flex-col gap-6 py-2">
      <div>
        <span className="text-xs font-semibold text-[#00490e] uppercase tracking-wider block mb-1">
          Step 04 of 07
        </span>
        <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#191d17]">
          Review Inverter Load & Surge Profile
        </h2>
        <p className="font-sans text-sm text-[#41493e] mt-1">
          Verify active power baseline, apparent kVA requirements, peak surge multipliers, and safety reserves.
        </p>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-[#c0c9bb]/40 shadow-sm">
          <span className="text-xs font-bold text-[#717a6d] uppercase block mb-1">Active Power</span>
          <div className="font-headline font-extrabold text-3xl text-[#00490e]">
            {activeKw} <span className="text-sm font-normal text-[#41493e]">kW</span>
          </div>
          <span className="text-[11px] text-[#717a6d]">{continuousWatts.toLocaleString()} Watts total</span>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-[#c0c9bb]/40 shadow-sm">
          <span className="text-xs font-bold text-[#717a6d] uppercase block mb-1">Apparent Power</span>
          <div className="font-headline font-extrabold text-3xl text-[#00490e]">
            {apparentKva} <span className="text-sm font-normal text-[#41493e]">kVA</span>
          </div>
          <span className="text-[11px] text-[#717a6d]">@ {powerFactor} Power Factor</span>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-[#c0c9bb]/40 shadow-sm">
          <span className="text-xs font-bold text-[#717a6d] uppercase block mb-1">Peak Inrush Surge</span>
          <div className="font-headline font-extrabold text-3xl text-emerald-800">
            {surgeKw} <span className="text-sm font-normal text-[#41493e]">kW</span>
          </div>
          <span className="text-[11px] text-[#717a6d]">5-Second Motor Surge</span>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-[#c0c9bb]/40 shadow-sm">
          <span className="text-xs font-bold text-[#717a6d] uppercase block mb-1">Safety Reserve</span>
          <div className="font-headline font-extrabold text-3xl text-[#00490e]">
            +{reservePercent}%
          </div>
          <span className="text-[11px] text-[#717a6d]">{inverterType} @ {systemVoltage}V DC</span>
        </div>
      </div>

      {/* Equipment Inventory Summary Table */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#c0c9bb]/40 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-[#c0c9bb]/30 pb-3">
          <span className="font-headline font-bold text-sm text-[#191d17] uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-[#00490e]">list_alt</span>
            <span>Connected Load Profile Breakdown ({items.length} Equipment Types)</span>
          </span>
          <button
            type="button"
            onClick={onEdit}
            className="text-xs font-bold text-[#00490e] hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
            <span>Adjust Loads</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="border-b border-[#c0c9bb]/30 text-[#717a6d] font-bold uppercase text-[10px]">
                <th className="py-2 px-2">Equipment</th>
                <th className="py-2 px-2">Qty</th>
                <th className="py-2 px-2">Continuous Watts</th>
                <th className="py-2 px-2">Surge Multiplier</th>
                <th className="py-2 px-2 text-right">Peak Surge Watts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c0c9bb]/20">
              {items.map((item, idx) => {
                const subWatts = item.powerWatts * item.quantity;
                const surgeSub = Math.round(subWatts * (item.surgeMultiplier ?? 2.5));

                return (
                  <tr key={idx} className="hover:bg-[#f2f5ec]">
                    <td className="py-2.5 px-2 font-bold text-[#191d17]">{item.name}</td>
                    <td className="py-2.5 px-2 font-mono font-bold">{item.quantity}</td>
                    <td className="py-2.5 px-2 font-mono">{subWatts.toLocaleString()} W</td>
                    <td className="py-2.5 px-2 font-mono font-bold text-[#00490e]">
                      {item.surgeMultiplier ?? 2.5}×
                    </td>
                    <td className="py-2.5 px-2 font-mono font-bold text-right text-emerald-800">
                      {surgeSub.toLocaleString()} W
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
          <span>Calculate Inverter Sizing</span>
          <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}
