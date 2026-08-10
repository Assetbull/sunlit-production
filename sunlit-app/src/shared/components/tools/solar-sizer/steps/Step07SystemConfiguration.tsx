'use client';

import React from 'react';
import { SystemConfigState } from '../types';
import { SharedCalculationResult } from '@/lib/engineering/types';

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
        <span className="text-xs font-semibold text-[#00490e] uppercase tracking-wider block mb-1">
          Step 07 of 09
        </span>
        <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#191d17]">
          System Equipment Configuration
        </h2>
        <p className="font-sans text-sm text-[#41493e] mt-1">
          Review and customize your turnkey equipment component specification and panel ratings.
        </p>
      </div>

      {/* Grid of Equipment Component Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Solar Panel Array Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-[#c0c9bb]/40 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#aef4a5]/40 flex items-center justify-center text-[#00490e]">
                <span className="material-symbols-outlined text-lg">solar_power</span>
              </div>
              <h3 className="font-headline font-bold text-base text-[#191d17]">Solar Panel Array</h3>
            </div>

            <div className="bg-[#f2f5ec] rounded-xl p-3">
              <div className="font-headline font-extrabold text-2xl text-[#00490e]">
                {resData.recommendedSolarArrayKwp ?? 0}{' '}
                <span className="text-xs font-normal text-[#41493e]">kWp</span>
              </div>
              <div className="font-sans text-xs text-[#41493e] mt-0.5">
                {resData.recommendedPanelCount ?? 0} Panels required ({resData.estimatedRoofAreaM2 ?? 0} m² roof area)
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-sans text-[11px] font-bold text-[#191d17] uppercase block">
                Select Panel Power Rating
              </label>
              <select
                value={data.selectedPanelWattage}
                onChange={(e) => onChange({ selectedPanelWattage: Number(e.target.value) })}
                className="w-full bg-[#f2f5ec] border border-[#c0c9bb]/60 rounded-xl px-3 py-2 text-xs font-bold text-[#191d17] outline-none focus:ring-2 focus:ring-[#00490e]"
              >
                <option value={550}>550W Tier-1 Monocrystalline</option>
                <option value={600}>600W High Efficiency N-Type</option>
              </select>
            </div>
          </div>
        </div>

        {/* Battery Storage Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-[#c0c9bb]/40 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#dce6d5] flex items-center justify-center text-[#5e675a]">
                <span className="material-symbols-outlined text-lg">battery_charging_full</span>
              </div>
              <h3 className="font-headline font-bold text-base text-[#191d17]">Battery Storage</h3>
            </div>

            <div className="bg-[#f2f5ec] rounded-xl p-3">
              <div className="font-headline font-extrabold text-2xl text-[#00490e]">
                {resData.recommendedBatteryKwh ?? 0}{' '}
                <span className="text-xs font-normal text-[#41493e]">kWh</span>
              </div>
              <div className="font-sans text-xs text-[#41493e] mt-0.5">
                {resData.backupAutonomyDays ?? 1.0} Day Autonomy ({resData.backupScope ?? 'full'} coverage)
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-sans text-[11px] font-bold text-[#191d17] uppercase block">
                Battery Chemistry
              </label>
              <select
                value={data.selectedBatteryType}
                onChange={(e) => onChange({ selectedBatteryType: e.target.value as any })}
                className="w-full bg-[#f2f5ec] border border-[#c0c9bb]/60 rounded-xl px-3 py-2 text-xs font-bold text-[#191d17] outline-none focus:ring-2 focus:ring-[#00490e]"
              >
                <option value="lithium_lifepo4">LiFePO4 Lithium (6000+ Cycles)</option>
                <option value="gel_lead_acid">Deep Cycle Gel (Long Life)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Inverter System Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-[#c0c9bb]/40 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#d8e3fb] flex items-center justify-center text-[#101c2d]">
                <span className="material-symbols-outlined text-lg">memory</span>
              </div>
              <h3 className="font-headline font-bold text-base text-[#191d17]">Hybrid Inverter</h3>
            </div>

            <div className="bg-[#f2f5ec] rounded-xl p-3">
              <div className="font-headline font-extrabold text-2xl text-[#00490e]">
                {resData.recommendedInverterKva ?? 0}{' '}
                <span className="text-xs font-normal text-[#41493e]">kVA</span>
              </div>
              <div className="font-sans text-xs text-[#41493e] mt-0.5">
                {resData.phaseType === 'three-phase' ? '400V 3-Phase' : '230V Single-Phase'} Pure Sine Wave
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-sans text-[11px] font-bold text-[#191d17] uppercase block">
                Inverter Topology
              </label>
              <select
                value={data.selectedInverterType}
                onChange={(e) => onChange({ selectedInverterType: e.target.value as any })}
                className="w-full bg-[#f2f5ec] border border-[#c0c9bb]/60 rounded-xl px-3 py-2 text-xs font-bold text-[#191d17] outline-none focus:ring-2 focus:ring-[#00490e]"
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
        <div className="bg-[#f2f5ec] rounded-2xl p-4 border border-[#c0c9bb]/40 space-y-3">
          <h4 className="font-headline font-bold text-sm text-[#191d17] uppercase tracking-wider">
            Bill of Materials (BOM) Preview
          </h4>
          <div className="space-y-2">
            {calculationResult.recommended_configuration.equipmentList.map((eq, i) => (
              <div key={i} className="bg-white p-3 rounded-xl border border-[#c0c9bb]/30 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-[#191d17]">{eq.name}</div>
                  <div className="text-[#717a6d]">{eq.reason}</div>
                </div>
                <span className="font-mono font-bold text-[#00490e] bg-[#ecefe6] px-2.5 py-1 rounded-lg">
                  Qty: {eq.recommendedQuantity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#c0c9bb]/30">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-[#c0c9bb] text-[#191d17] font-sans text-sm font-semibold hover:bg-[#ecefe6] transition-all"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          <span>Back</span>
        </button>

        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 bg-[#00490e] hover:bg-[#003006] text-white px-7 py-2.5 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md group"
        >
          <span>View Sizing Results</span>
          <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}
