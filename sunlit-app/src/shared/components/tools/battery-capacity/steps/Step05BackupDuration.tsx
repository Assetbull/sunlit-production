'use client';

import React from 'react';

interface Step05Props {
  daysOfAutonomy: number;
  systemVoltage: 12 | 24 | 48 | 51.2 | 96 | 192;
  chemistry: 'LITHIUM_LIFEPO4' | 'TUBULAR_GEL' | 'AGM';
  maxDepthOfDischarge: number;
  temperatureDerating: number;
  onChangeAutonomy: (days: number) => void;
  onChangeVoltage: (volts: any) => void;
  onChangeChemistry: (chem: any) => void;
  onChangeDod: (dod: number) => void;
  onChangeTempDerating: (factor: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step05BackupDuration({
  daysOfAutonomy,
  systemVoltage,
  chemistry,
  maxDepthOfDischarge,
  temperatureDerating,
  onChangeAutonomy,
  onChangeVoltage,
  onChangeChemistry,
  onChangeDod,
  onChangeTempDerating,
  onNext,
  onBack,
}: Step05Props) {
  return (
    <div className="flex flex-col gap-6 py-2">
      <div>
        <span className="text-xs font-semibold text-[#00490e] uppercase tracking-wider block mb-1">
          Step 05 of 08
        </span>
        <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#191d17]">
          Storage Duration & Technical Parameters
        </h2>
        <p className="font-sans text-sm text-[#41493e] mt-1">
          Configure autonomy days, battery chemistry, system DC voltage, and environmental derating factors.
        </p>
      </div>

      {/* Main Parameters Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Days of Autonomy & DC Voltage Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#c0c9bb]/40 shadow-sm space-y-5">
          <h4 className="font-headline font-bold text-sm text-[#00490e] uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-base">schedule</span>
            <span>Autonomy & Voltage</span>
          </h4>

          {/* Autonomy Slider */}
          <div className="space-y-2 bg-[#f2f5ec] p-4 rounded-xl border border-[#c0c9bb]/30">
            <div className="flex justify-between items-center">
              <label className="font-sans font-bold text-xs text-[#191d17]">
                Required Autonomy Duration
              </label>
              <span className="font-headline font-extrabold text-base text-[#00490e]">
                {daysOfAutonomy} Day{daysOfAutonomy > 1 ? 's' : ''}
              </span>
            </div>
            <input
              type="range"
              min={0.5}
              max={3.0}
              step={0.25}
              value={daysOfAutonomy}
              onChange={(e) => onChangeAutonomy(Number(e.target.value))}
              className="w-full accent-[#00490e] cursor-pointer py-1"
            />
            <p className="font-sans text-[11px] text-[#717a6d]">
              Days of continuous backup power without solar array recharge or grid restoration.
            </p>
          </div>

          {/* System Voltage Select */}
          <div className="space-y-1">
            <label className="font-sans text-xs font-bold text-[#191d17] block mb-1">
              System Nominal DC Bus Voltage
            </label>
            <select
              value={systemVoltage}
              onChange={(e) => onChangeVoltage(Number(e.target.value))}
              className="w-full bg-[#ecefe6] border border-[#c0c9bb]/60 rounded-xl px-3.5 py-2.5 font-bold text-xs text-[#191d17] outline-none focus:ring-2 focus:ring-[#00490e]"
            >
              <option value={48}>48 VDC (Standard Commercial / High-Capacity Inverter)</option>
              <option value={51.2}>51.2 VDC (Standard LiFePO4 16S Battery Bank Bus)</option>
              <option value={24}>24 VDC (Medium Capacity Off-Grid Inverter)</option>
              <option value={12}>12 VDC (Small Standalone Autonomy Kit)</option>
              <option value={96}>96 VDC (High Voltage Commercial Architecture)</option>
            </select>
          </div>
        </div>

        {/* Chemistry & Derating Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#c0c9bb]/40 shadow-sm space-y-5">
          <h4 className="font-headline font-bold text-sm text-[#00490e] uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-base">battery_charging_full</span>
            <span>Chemistry & Derating Factors</span>
          </h4>

          {/* Chemistry Select */}
          <div className="space-y-1">
            <label className="font-sans text-xs font-bold text-[#191d17] block mb-1">
              Battery Chemistry
            </label>
            <select
              value={chemistry}
              onChange={(e) => {
                const val = e.target.value as any;
                onChangeChemistry(val);
                onChangeDod(val === 'LITHIUM_LIFEPO4' ? 0.8 : 0.5);
              }}
              className="w-full bg-[#ecefe6] border border-[#c0c9bb]/60 rounded-xl px-3.5 py-2.5 font-bold text-xs text-[#191d17] outline-none focus:ring-2 focus:ring-[#00490e]"
            >
              <option value="LITHIUM_LIFEPO4">Lithium Iron Phosphate (LiFePO4) — 6,000+ Cycles @ 80% DoD</option>
              <option value="TUBULAR_GEL">Deep Cycle Tubular Gel — 1,200 Cycles @ 50% DoD</option>
              <option value="AGM">Absorbent Glass Mat (AGM) Lead-Acid — 800 Cycles @ 50% DoD</option>
            </select>
          </div>

          {/* DoD & Temperature Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-sans font-bold text-[#191d17] block mb-1">Max DoD Limit</label>
              <select
                value={maxDepthOfDischarge}
                onChange={(e) => onChangeDod(Number(e.target.value))}
                className="w-full bg-[#ecefe6] border border-[#c0c9bb]/60 rounded-lg px-2.5 py-2 font-bold text-[#191d17] outline-none focus:ring-2 focus:ring-[#00490e]"
              >
                <option value={0.8}>80% (Recommended LiFePO4)</option>
                <option value={0.9}>90% (Max LiFePO4 Reserve)</option>
                <option value={0.5}>50% (Recommended Gel/AGM)</option>
              </select>
            </div>

            <div>
              <label className="font-sans font-bold text-[#191d17] block mb-1">Ambient Derating</label>
              <select
                value={temperatureDerating}
                onChange={(e) => onChangeTempDerating(Number(e.target.value))}
                className="w-full bg-[#ecefe6] border border-[#c0c9bb]/60 rounded-lg px-2.5 py-2 font-bold text-[#191d17] outline-none focus:ring-2 focus:ring-[#00490e]"
              >
                <option value={0.95}>95% (Indoor Ventilated)</option>
                <option value={0.85}>85% (Hot Outdoor Enclosure)</option>
                <option value={1.0}>100% (Air Conditioned Room)</option>
              </select>
            </div>
          </div>
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
          <span>Calculate Battery Sizing</span>
          <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}
