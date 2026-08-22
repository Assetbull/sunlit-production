'use client';

import React from 'react';
import { EnergyProfileState } from '../types';
import { SunlitIcon } from '@/shared/components/ui/SunlitIcon';

interface Step04Props {
  data: EnergyProfileState;
  onChange: (updated: Partial<EnergyProfileState>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step04EnergyProfile({ data, onChange, onNext, onBack }: Step04Props) {
  const handleGridHoursChange = (hours: number) => {
    let rel: EnergyProfileState['gridReliability'] = 'medium';
    if (hours >= 18) rel = 'high';
    else if (hours >= 12) rel = 'medium';
    else if (hours >= 6) rel = 'frequent_outages';
    else rel = 'off_grid';

    onChange({ gridAvailabilityHours: hours, gridReliability: rel });
  };

  const handleDaytimeSplitChange = (dayPercent: number) => {
    onChange({
      daytimeUsagePercent: dayPercent,
      nighttimeUsagePercent: 100 - dayPercent,
    });
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      <div>
        <span className="text-[11px] font-bold text-[#00490e] uppercase tracking-wider block mb-1">
          Step 04 of 09
        </span>
        <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#1f1b17]">
          Grid Availability & Energy Profile
        </h2>
        <p className="font-sans text-sm text-[#40493d] mt-1">
          Specify grid reliability, existing generator usage, and day/night consumption distribution.
        </p>
      </div>

      {/* Grid Availability & Reliability Status */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#bfcaba]/40 shadow-xs space-y-5">
        <div className="flex justify-between items-center">
          <label className="font-sans text-xs font-bold text-[#1f1b17] uppercase tracking-wider block">
            Average Grid Electricity Availability
          </label>
          <span className="font-headline font-extrabold text-lg text-[#00490e]">
            {data.gridAvailabilityHours} Hours / Day
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={24}
          step={1}
          value={data.gridAvailabilityHours}
          onChange={(e) => handleGridHoursChange(Number(e.target.value))}
          className="w-full accent-[#00490e] cursor-pointer py-1"
        />

        {/* Reliability Pill Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
          {[
            { id: 'high', label: 'High Reliability', sub: '18–24 hrs' },
            { id: 'medium', label: 'Medium Availability', sub: '12–18 hrs' },
            { id: 'frequent_outages', label: 'Frequent Outages', sub: '6–12 hrs' },
            { id: 'off_grid', label: 'Severe / Off-Grid', sub: '< 6 hrs' },
          ].map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => onChange({ gridReliability: r.id as any })}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                data.gridReliability === r.id
                  ? 'bg-[#00490e] text-white border-[#00490e] shadow-xs'
                  : 'bg-[#fcf2eb] text-[#1f1b17] border-[#bfcaba]/50 hover:bg-[#f6ece6]'
              }`}
            >
              <div className="font-sans font-bold text-xs">{r.label}</div>
              <div
                className={`font-sans text-[10px] ${
                  data.gridReliability === r.id ? 'text-white/80' : 'text-[#707a6c]'
                }`}
              >
                {r.sub}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Generator Usage Section */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#bfcaba]/40 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-headline font-bold text-base text-[#1f1b17]">
              Generator Backup Displacement
            </h4>
            <p className="font-sans text-xs text-[#40493d]">
              Calculate how much diesel/petrol fuel spending solar power will eliminate.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={data.hasGenerator}
              onChange={(e) => onChange({ hasGenerator: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#f0e6e0] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00490e]"></div>
          </label>
        </div>

        {data.hasGenerator && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#bfcaba]/30">
            <div>
              <label className="font-sans text-xs font-bold text-[#1f1b17] uppercase tracking-wider block mb-1">
                Generator Capacity (kVA)
              </label>
              <input
                type="number"
                min={1}
                max={500}
                value={data.generatorKva}
                onChange={(e) => onChange({ generatorKva: Number(e.target.value) })}
                className="w-full bg-[#fcf2eb] border border-[#bfcaba]/60 rounded-xl px-4 py-2.5 font-bold text-sm text-[#1f1b17] outline-none focus:ring-2 focus:ring-[#00490e]"
                placeholder="e.g. 5.5"
              />
            </div>

            <div>
              <label className="font-sans text-xs font-bold text-[#1f1b17] uppercase tracking-wider block mb-1">
                Monthly Fuel Expense (₦)
              </label>
              <input
                type="number"
                min={0}
                max={10000000}
                step={5000}
                value={data.generatorFuelExpenseMonth}
                onChange={(e) => onChange({ generatorFuelExpenseMonth: Number(e.target.value) })}
                className="w-full bg-[#fcf2eb] border border-[#bfcaba]/60 rounded-xl px-4 py-2.5 font-bold text-sm text-[#1f1b17] outline-none focus:ring-2 focus:ring-[#00490e]"
                placeholder="e.g. 80000"
              />
            </div>
          </div>
        )}
      </div>

      {/* Daytime vs Nighttime Usage Split */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#bfcaba]/40 shadow-xs space-y-3">
        <div className="flex justify-between items-center">
          <label className="font-sans text-xs font-bold text-[#1f1b17] uppercase tracking-wider block">
            Daytime vs Nighttime Consumption Distribution
          </label>
          <div className="font-mono text-xs font-bold text-[#00490e] bg-[#f6ece6] px-2.5 py-0.5 rounded-full border border-[#bfcaba]/30 flex items-center gap-1.5">
            <SunlitIcon name="wb_sunny" size={14} className="text-[#00490e]" />
            <span>{data.daytimeUsagePercent}% Day</span>
            <span>/</span>
            <SunlitIcon name="bedtime" size={14} className="text-[#4b566a]" />
            <span>{data.nighttimeUsagePercent}% Night</span>
          </div>
        </div>

        <input
          type="range"
          min={20}
          max={80}
          step={5}
          value={data.daytimeUsagePercent}
          onChange={(e) => handleDaytimeSplitChange(Number(e.target.value))}
          className="w-full accent-[#00490e] cursor-pointer py-1"
        />

        <div className="flex justify-between text-xs text-[#707a6c] font-sans">
          <span>More Nighttime (Home/Residential)</span>
          <span>More Daytime (Office/Business)</span>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#bfcaba]/30">
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back to Load & Demand"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-[#707a6c] text-[#1f1b17] font-sans text-sm font-semibold hover:bg-[#f6ece6] transition-all cursor-pointer"
        >
          <SunlitIcon name="arrow_back" size={16} />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          aria-label="Continue to Backup Requirement"
          className="inline-flex items-center gap-2 bg-[#00490e] hover:bg-[#0f631b] text-white px-7 py-2.5 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md group cursor-pointer"
        >
          <span>Continue to Backup Requirement</span>
          <SunlitIcon name="arrow_forward" size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
