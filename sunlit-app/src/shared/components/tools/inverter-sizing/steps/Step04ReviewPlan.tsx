'use client';

import React from 'react';
import { LoadItem } from '@/lib/engineering/calculators/loadCalculator';
import { SunlitIcon } from '@/shared/components/ui/SunlitIcon';

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
        <span className="text-[11px] font-bold text-[#00490e] uppercase tracking-wider block mb-1">
          STEP 04 OF 07
        </span>
        <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#1f1b17]">
          Review Inverter Load & Surge Profile
        </h2>
        <p className="font-sans text-sm text-[#40493d] mt-1 leading-relaxed">
          Verify active power baseline, apparent kVA requirements, peak surge multipliers, and safety reserves.
        </p>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-[#bfcaba]/40 shadow-xs">
          <span className="text-[11px] font-bold text-[#707a6c] uppercase block mb-1">Active Power</span>
          <div className="font-headline font-extrabold text-3xl text-[#00490e]">
            {activeKw} <span className="text-sm font-normal text-[#40493d]">kW</span>
          </div>
          <span className="text-[11px] text-[#707a6c]">{continuousWatts.toLocaleString()} Watts total</span>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-[#bfcaba]/40 shadow-xs">
          <span className="text-[11px] font-bold text-[#707a6c] uppercase block mb-1">Apparent Power</span>
          <div className="font-headline font-extrabold text-3xl text-[#00490e]">
            {apparentKva} <span className="text-sm font-normal text-[#40493d]">kVA</span>
          </div>
          <span className="text-[11px] text-[#707a6c]">@ {powerFactor} Power Factor</span>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-[#bfcaba]/40 shadow-xs">
          <span className="text-[11px] font-bold text-[#707a6c] uppercase block mb-1">Peak Inrush Surge</span>
          <div className="font-headline font-extrabold text-3xl text-[#0f631b]">
            {surgeKw} <span className="text-sm font-normal text-[#40493d]">kW</span>
          </div>
          <span className="text-[11px] text-[#707a6c]">5-Second Motor Surge</span>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-[#bfcaba]/40 shadow-xs">
          <span className="text-[11px] font-bold text-[#707a6c] uppercase block mb-1">Safety Reserve</span>
          <div className="font-headline font-extrabold text-3xl text-[#00490e]">
            +{reservePercent}%
          </div>
          <span className="text-[11px] text-[#707a6c]">{inverterType} @ {systemVoltage}V DC</span>
        </div>
      </div>

      {/* Equipment Inventory Summary Table */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#bfcaba]/40 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#bfcaba]/30 pb-3">
          <span className="font-headline font-bold text-xs text-[#1f1b17] uppercase tracking-wider flex items-center gap-2">
            <SunlitIcon name="list_alt" size={16} className="text-[#00490e]" />
            <span>Connected Load Profile Breakdown ({items.length} Equipment Types)</span>
          </span>
          <button
            type="button"
            onClick={onEdit}
            className="text-xs font-bold text-[#00490e] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <SunlitIcon name="edit" size={14} />
            <span>Adjust Loads</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="border-b border-[#bfcaba]/30 text-[#707a6c] font-bold uppercase text-[10px]">
                <th className="py-2 px-2">Equipment</th>
                <th className="py-2 px-2">Qty</th>
                <th className="py-2 px-2">Continuous Watts</th>
                <th className="py-2 px-2">Surge Multiplier</th>
                <th className="py-2 px-2 text-right">Peak Surge Watts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bfcaba]/20">
              {items.map((item, idx) => {
                const subWatts = item.powerWatts * item.quantity;
                const surgeSub = Math.round(subWatts * (item.surgeMultiplier ?? 2.5));

                return (
                  <tr key={idx} className="hover:bg-[#fcf2eb]">
                    <td className="py-2.5 px-2 font-bold text-[#1f1b17]">{item.name}</td>
                    <td className="py-2.5 px-2 font-mono font-bold">{item.quantity}</td>
                    <td className="py-2.5 px-2 font-mono">{subWatts.toLocaleString()} W</td>
                    <td className="py-2.5 px-2 font-mono font-bold text-[#00490e]">
                      {item.surgeMultiplier ?? 2.5}×
                    </td>
                    <td className="py-2.5 px-2 font-mono font-bold text-right text-[#0f631b]">
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
          aria-label="Calculate Inverter Sizing"
          className="inline-flex items-center gap-2 bg-[#00490e] hover:bg-[#0f631b] text-white px-7 py-2.5 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md group cursor-pointer"
        >
          <span>Calculate Inverter Sizing</span>
          <SunlitIcon name="arrow_forward" size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
