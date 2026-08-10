'use client';

import React from 'react';
import { SystemConfigState } from '../types';
import { SharedCalculationResult } from '@/lib/engineering/types';
import { SunlitIcon } from '@/shared/components/ui/SunlitIcon';

interface Step07Props {
  data: SystemConfigState;
  calculationResult: SharedCalculationResult | null;
  onChange: (updated: Partial<SystemConfigState>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step07SystemConfiguration({
  data,
  calculationResult,
  onChange,
  onNext,
  onBack,
}: Step07Props) {
  const resData = calculationResult?.engineering_results || {};

  return (
    <div className="flex flex-col gap-6 py-2">
      <div>
        <span className="text-[11px] font-bold text-[#00490e] uppercase tracking-wider block mb-1">
          Step 07 of 09
        </span>
        <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#1f1b17]">
          System Equipment Configuration
        </h2>
        <p className="font-sans text-sm text-[#40493d] mt-1">
          Review and customize your turnkey equipment component specification and panel ratings.
        </p>
      </div>

      {/* Grid of Equipment Component Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Solar Panel Array Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#bfcaba]/40 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-[#ceee93]/40 flex items-center justify-center text-[#00490e] shrink-0">
                <SunlitIcon name="solar_power" size={20} />
              </div>
              <h3 className="font-headline font-bold text-base text-[#1f1b17]">Solar Panel Array</h3>
            </div>

            <div className="bg-[#fcf2eb] rounded-xl p-3 border border-[#bfcaba]/30">
              <div className="font-headline font-extrabold text-2xl text-[#00490e]">
                {resData.recommendedSolarArrayKwp ?? 0}{' '}
                <span className="text-xs font-normal text-[#40493d]">kWp</span>
              </div>
              <div className="font-sans text-xs text-[#40493d] mt-0.5">
                {resData.recommendedPanelCount ?? 0} Panels required ({resData.estimatedRoofAreaM2 ?? 0} m² roof area)
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-sans text-[11px] font-bold text-[#1f1b17] uppercase block">
                Select Panel Power Rating
              </label>
              <select
                value={data.selectedPanelWattage}
                onChange={(e) => onChange({ selectedPanelWattage: Number(e.target.value) })}
                className="w-full bg-[#fcf2eb] border border-[#bfcaba]/60 rounded-xl px-3 py-2 text-xs font-bold text-[#1f1b17] outline-none focus:ring-2 focus:ring-[#00490e]"
              >
                <option value={550}>550W Tier-1 Monocrystalline</option>
                <option value={600}>600W High Efficiency N-Type</option>
              </select>
            </div>
          </div>
        </div>

        {/* Battery Storage Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#bfcaba]/40 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-[#f6ece6] flex items-center justify-center text-[#40493d] border border-[#bfcaba]/30 shrink-0">
                <SunlitIcon name="battery_charging_full" size={20} />
              </div>
              <h3 className="font-headline font-bold text-base text-[#1f1b17]">Battery Storage</h3>
            </div>

            <div className="bg-[#fcf2eb] rounded-xl p-3 border border-[#bfcaba]/30">
              <div className="font-headline font-extrabold text-2xl text-[#00490e]">
                {resData.recommendedBatteryKwh ?? 0}{' '}
                <span className="text-xs font-normal text-[#40493d]">kWh</span>
              </div>
              <div className="font-sans text-xs text-[#40493d] mt-0.5">
                {resData.backupAutonomyDays ?? 1.0} Day Autonomy ({resData.backupScope ?? 'full'} coverage)
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-sans text-[11px] font-bold text-[#1f1b17] uppercase block">
                Battery Chemistry
              </label>
              <select
                value={data.selectedBatteryType}
                onChange={(e) => onChange({ selectedBatteryType: e.target.value as any })}
                className="w-full bg-[#fcf2eb] border border-[#bfcaba]/60 rounded-xl px-3 py-2 text-xs font-bold text-[#1f1b17] outline-none focus:ring-2 focus:ring-[#00490e]"
              >
                <option value="lithium_lifepo4">LiFePO4 Lithium (6000+ Cycles)</option>
                <option value="gel_lead_acid">Deep Cycle Gel (Long Life)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Inverter System Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#bfcaba]/40 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-[#343f52]/10 flex items-center justify-center text-[#343f52] border border-[#343f52]/20 shrink-0">
                <SunlitIcon name="memory" size={20} />
              </div>
              <h3 className="font-headline font-bold text-base text-[#1f1b17]">Hybrid Inverter</h3>
            </div>

            <div className="bg-[#fcf2eb] rounded-xl p-3 border border-[#bfcaba]/30">
              <div className="font-headline font-extrabold text-2xl text-[#00490e]">
                {resData.recommendedInverterKva ?? 0}{' '}
                <span className="text-xs font-normal text-[#40493d]">kVA</span>
              </div>
              <div className="font-sans text-xs text-[#40493d] mt-0.5">
                {resData.phaseType === 'three-phase' ? '400V 3-Phase' : '230V Single-Phase'} Pure Sine Wave
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-sans text-[11px] font-bold text-[#1f1b17] uppercase block">
                Inverter Topology
              </label>
              <select
                value={data.selectedInverterType}
                onChange={(e) => onChange({ selectedInverterType: e.target.value as any })}
                className="w-full bg-[#fcf2eb] border border-[#bfcaba]/60 rounded-xl px-3 py-2 text-xs font-bold text-[#1f1b17] outline-none focus:ring-2 focus:ring-[#00490e]"
              >
                <option value="hybrid_pure_sine">Pure Sine Wave Hybrid (Grid/Gen/Solar)</option>
                <option value="offgrid_sine">Off-Grid Pure Sine Wave</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Equipment List Preview Table */}
      {calculationResult?.recommended_configuration.equipmentList && (
        <div className="bg-[#fcf2eb] rounded-2xl p-4 border border-[#bfcaba]/40 space-y-3">
          <h4 className="font-headline font-bold text-xs text-[#1f1b17] uppercase tracking-wider">
            Bill of Materials (BOM) Preview
          </h4>
          <div className="space-y-2">
            {calculationResult.recommended_configuration.equipmentList.map((eq, i) => (
              <div key={i} className="bg-white p-3 rounded-xl border border-[#bfcaba]/30 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-[#1f1b17]">{eq.name}</div>
                  <div className="text-[#707a6c]">{eq.reason}</div>
                </div>
                <span className="font-mono font-bold text-[#00490e] bg-[#f6ece6] px-2.5 py-1 rounded-lg border border-[#bfcaba]/30">
                  Qty: {eq.recommendedQuantity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#bfcaba]/30">
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back to Backup Requirement"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-[#707a6c] text-[#1f1b17] font-sans text-sm font-semibold hover:bg-[#f6ece6] transition-all cursor-pointer"
        >
          <SunlitIcon name="arrow_back" size={16} />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          aria-label="View Sizing Results"
          className="inline-flex items-center gap-2 bg-[#00490e] hover:bg-[#0f631b] text-white px-7 py-2.5 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md group cursor-pointer"
        >
          <span>View Sizing Results</span>
          <SunlitIcon name="arrow_forward" size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
