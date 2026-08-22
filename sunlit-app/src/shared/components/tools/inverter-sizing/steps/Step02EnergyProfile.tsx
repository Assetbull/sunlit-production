'use client';

import React from 'react';
import { SunlitIcon } from '@/shared/components/ui/SunlitIcon';

interface Step02Props {
  continuousLoadWatts: number;
  inverterType: 'HYBRID' | 'OFF_GRID' | 'GRID_TIED';
  systemVoltage: 24 | 48 | 96 | 192;
  onChangeWatts: (watts: number) => void;
  onChangeType: (type: 'HYBRID' | 'OFF_GRID' | 'GRID_TIED') => void;
  onChangeVoltage: (volts: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step02EnergyProfile({
  continuousLoadWatts,
  inverterType,
  systemVoltage,
  onChangeWatts,
  onChangeType,
  onChangeVoltage,
  onNext,
  onBack,
}: Step02Props) {
  return (
    <div className="flex flex-col gap-6 py-2">
      <div>
        <span className="text-[11px] font-bold text-[#00490e] uppercase tracking-wider block mb-1">
          STEP 02 OF 07
        </span>
        <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#1f1b17]">
          Energy Profile & Continuous Load
        </h2>
        <p className="font-sans text-sm text-[#40493d] mt-1 leading-relaxed">
          Specify total active continuous power demand and select inverter operational topology.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Power Input Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#bfcaba]/40 shadow-xs space-y-4">
          <h4 className="font-headline font-bold text-xs text-[#00490e] uppercase tracking-wider flex items-center gap-2">
            <SunlitIcon name="flash_on" size={16} />
            <span>Continuous Active Power Demand</span>
          </h4>

          <div className="space-y-2">
            <label className="font-sans font-bold text-xs text-[#1f1b17] block">
              Total Continuous Load (Watts)
            </label>
            <div className="relative">
              <input
                type="number"
                min={100}
                max={100000}
                step={100}
                value={continuousLoadWatts}
                onChange={(e) => onChangeWatts(Math.max(100, Number(e.target.value)))}
                className="w-full bg-[#fcf2eb] border border-[#bfcaba]/60 rounded-xl px-4 py-3 font-headline font-bold text-xl text-[#1f1b17] outline-none focus:ring-2 focus:ring-[#00490e]"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono font-bold text-xs text-[#707a6c]">
                WATTS
              </span>
            </div>
            <p className="font-sans text-[11px] text-[#707a6c]">
              Equivalent to {(continuousLoadWatts / 1000).toFixed(2)} kW active power baseline.
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div className="pt-2">
            <span className="text-[11px] font-bold text-[#707a6c] uppercase block mb-1.5">
              Quick Baseline Presets
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs font-sans font-bold">
              <button
                type="button"
                onClick={() => onChangeWatts(2500)}
                className="p-2 bg-[#f6ece6] hover:bg-[#ceee93]/40 rounded-xl border border-[#bfcaba]/40 text-[#1f1b17] text-center cursor-pointer transition-colors"
              >
                2.5 kW (Small)
              </button>
              <button
                type="button"
                onClick={() => onChangeWatts(5000)}
                className="p-2 bg-[#f6ece6] hover:bg-[#ceee93]/40 rounded-xl border border-[#bfcaba]/40 text-[#1f1b17] text-center cursor-pointer transition-colors"
              >
                5.0 kW (Standard)
              </button>
              <button
                type="button"
                onClick={() => onChangeWatts(10000)}
                className="p-2 bg-[#f6ece6] hover:bg-[#ceee93]/40 rounded-xl border border-[#bfcaba]/40 text-[#1f1b17] text-center cursor-pointer transition-colors"
              >
                10 kW (Commercial)
              </button>
            </div>
          </div>
        </div>

        {/* Inverter Architecture & Voltage */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#bfcaba]/40 shadow-xs space-y-4">
          <h4 className="font-headline font-bold text-xs text-[#00490e] uppercase tracking-wider flex items-center gap-2">
            <SunlitIcon name="memory" size={16} />
            <span>Inverter Topology & Voltage</span>
          </h4>

          {/* Topology Select */}
          <div className="space-y-1">
            <label className="font-sans text-xs font-bold text-[#1f1b17] block mb-1">
              Inverter Operational Mode
            </label>
            <select
              value={inverterType}
              onChange={(e) => onChangeType(e.target.value as any)}
              className="w-full bg-[#fcf2eb] border border-[#bfcaba]/60 rounded-xl px-3.5 py-2.5 font-bold text-xs text-[#1f1b17] outline-none focus:ring-2 focus:ring-[#00490e]"
            >
              <option value="HYBRID">Hybrid Solar Inverter-Charger (Solar + Grid + Battery)</option>
              <option value="OFF_GRID">Off-Grid Pure Sine Wave Inverter (Isolated Battery Bank)</option>
              <option value="GRID_TIED">Grid-Tied String Inverter (On-Grid Net Metering)</option>
            </select>
          </div>

          {/* Voltage Select */}
          <div className="space-y-1">
            <label className="font-sans text-xs font-bold text-[#1f1b17] block mb-1">
              Recommended Battery DC Bus Voltage
            </label>
            <select
              value={systemVoltage}
              onChange={(e) => onChangeVoltage(Number(e.target.value))}
              className="w-full bg-[#fcf2eb] border border-[#bfcaba]/60 rounded-xl px-3.5 py-2.5 font-bold text-xs text-[#1f1b17] outline-none focus:ring-2 focus:ring-[#00490e]"
            >
              <option value={48}>48 VDC (Recommended Standard Inverter Bus)</option>
              <option value={24}>24 VDC (Medium Capacity Inverter Bus)</option>
              <option value={96}>96 VDC (High Voltage Commercial Architecture)</option>
              <option value={192}>192 VDC (Industrial High-Capacity Bus)</option>
            </select>
          </div>
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
          aria-label="Continue to Surge Assessment"
          className="inline-flex items-center gap-2 bg-[#00490e] hover:bg-[#0f631b] text-white px-7 py-2.5 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md group cursor-pointer"
        >
          <span>Continue to Surge Assessment</span>
          <SunlitIcon name="arrow_forward" size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
