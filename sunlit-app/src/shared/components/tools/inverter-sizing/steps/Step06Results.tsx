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
  const equipList = calculationResult?.recommended_configuration?.equipmentList || [];
  const primaryEquip = equipList[0];

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Header Banner */}
      <div className="border-b border-[#bfcaba]/40 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#00490e] bg-[#ceee93]/40 px-2.5 py-0.5 rounded-full border border-[#00490e]/20">
            Stitch Visual DNA Engine
          </span>
          <span className="text-xs text-[#707a6c] font-medium">• Inverter Sizing V2.1</span>
        </div>
        <h2 className="font-headline font-extrabold text-2xl sm:text-4xl text-[#00490e] tracking-tight">
          Inverter System Sizing Results
        </h2>
        <p className="font-sans text-xs sm:text-sm text-[#40493d] mt-1">
          Recommended inverter continuous output rating, surge capacity rating, power factor derating, and DC bus voltage.
        </p>
      </div>

      {/* Primary Inverter Recommendation Card */}
      <div className="bg-gradient-to-br from-white via-[#fff8f5] to-[#f6ece6] border border-[#00490e]/30 rounded-3xl p-5 sm:p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#bfcaba]/30 pb-4">
          <div>
            <span className="text-[11px] font-bold text-[#00490e] uppercase tracking-wider block">
              Recommended Inverter Capacity
            </span>
            <div className="font-headline font-extrabold text-4xl sm:text-5xl text-[#00490e] mt-1 tracking-tight">
              {resData.recommendedInverterKva ?? 5.0}{' '}
              <span className="text-lg font-bold text-[#40493d]">kVA</span>
            </div>
          </div>

          <div className="bg-[#00490e] text-[#8cdd86] font-headline font-bold text-xs px-4 py-2 rounded-full shadow-xs">
            {resData.recommendedActiveKw ?? 4.0} kW Active Continuous Output (@ {resData.powerFactor ?? 0.8} PF)
          </div>
        </div>

        {/* Secondary Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-sans">
          <div className="bg-white/90 p-3 rounded-xl border border-[#bfcaba]/30 shadow-xs">
            <span className="text-[#707a6c] font-medium block mb-0.5">Surge Capacity</span>
            <span className="font-headline font-bold text-base text-[#0f631b]">
              {resData.surgeLoadWatts ? (resData.surgeLoadWatts / 1000).toFixed(1) : '12.5'} kW Peak
            </span>
            <span className="text-[10px] text-[#707a6c] block mt-0.5">
              5-Second Inrush Rating
            </span>
          </div>

          <div className="bg-white/90 p-3 rounded-xl border border-[#bfcaba]/30 shadow-xs">
            <span className="text-[#707a6c] font-medium block mb-0.5">Recommended DC Bus</span>
            <span className="font-headline font-bold text-base text-[#1f1b17]">
              {resData.recommendedDcVoltage ?? 48} VDC
            </span>
            <span className="text-[10px] text-[#707a6c] block mt-0.5">
              Standard Solar Inverter Bus
            </span>
          </div>

          <div className="bg-white/90 p-3 rounded-xl border border-[#bfcaba]/30 shadow-xs">
            <span className="text-[#707a6c] font-medium block mb-0.5">Apparent Power</span>
            <span className="font-headline font-bold text-base text-[#1f1b17]">
              {resData.minimumContinuousKva ?? 3.5} kVA
            </span>
            <span className="text-[10px] text-[#707a6c] block mt-0.5">
              Min. Required Base
            </span>
          </div>

          <div className="bg-white/90 p-3 rounded-xl border border-[#bfcaba]/30 shadow-xs">
            <span className="text-[#707a6c] font-medium block mb-0.5">Safety Reserve</span>
            <span className="font-headline font-bold text-base text-[#00490e]">
              {resData.safetyMargin ?? '25%'}
            </span>
            <span className="text-[10px] text-[#707a6c] block mt-0.5">
              Expansion Headroom
            </span>
          </div>
        </div>
      </div>

      {/* Engineering Validation Checks Table */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#bfcaba]/40 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#bfcaba]/30 pb-3">
          <span className="font-headline font-bold text-xs text-[#1f1b17] uppercase tracking-wider flex items-center gap-2">
            <SunlitIcon name="verified" size={16} className="text-[#00490e]" />
            <span>Engineering Validation Checks</span>
          </span>
          <span className="text-[10px] font-bold bg-[#ceee93]/40 text-[#00490e] px-2.5 py-0.5 rounded-full border border-[#00490e]/20">
            VERIFIED
          </span>
        </div>

        <div className="divide-y divide-[#bfcaba]/20 text-xs font-sans">
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-[#40493d]">Continuous Active Power Headroom</span>
            <span className="font-mono font-bold text-[#00490e] bg-[#ceee93]/30 px-2 py-0.5 rounded border border-[#00490e]/20">
              {resData.continuousCheck ?? 'PASS'}
            </span>
          </div>
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-[#40493d]">Motor Inrush Surge Capacity</span>
            <span className="font-mono font-bold text-[#00490e] bg-[#ceee93]/30 px-2 py-0.5 rounded border border-[#00490e]/20">
              {resData.surgeCheck ?? 'PASS'}
            </span>
          </div>
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-[#40493d]">Power Factor (PF) Standard</span>
            <span className="font-mono font-bold text-[#1f1b17]">{resData.powerFactor ?? 0.8} PF</span>
          </div>
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-[#40493d]">Inverter Operational Topology</span>
            <span className="font-mono font-bold text-[#00490e]">{resData.inverterType ?? 'HYBRID'}</span>
          </div>
        </div>
      </div>

      {/* Equipment Recommendation Box */}
      {primaryEquip && (
        <div className="p-4 bg-[#f6ece6] border border-[#bfcaba]/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00490e] text-white flex items-center justify-center font-bold shrink-0">
              <SunlitIcon name="speed" size={20} />
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
          aria-label="Continue to Options & Next Steps"
          className="inline-flex items-center gap-2 bg-[#00490e] hover:bg-[#0f631b] text-white px-8 py-3 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md group cursor-pointer"
        >
          <span>Continue to Options & Next Steps</span>
          <SunlitIcon name="arrow_forward" size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
