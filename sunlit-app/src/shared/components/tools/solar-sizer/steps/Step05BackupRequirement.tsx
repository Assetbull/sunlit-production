'use client';

import React from 'react';
import { BackupProfileState } from '../types';
import { SunlitIcon, SunlitIconName } from '@/shared/components/ui/SunlitIcon';

interface Step05Props {
  data: BackupProfileState;
  onChange: (updated: Partial<BackupProfileState>) => void;
  onCalculate: () => void;
  onBack: () => void;
}

const AUTONOMY_OPTIONS = [
  {
    days: 0.5,
    title: '0.5 Days Autonomy',
    desc: 'Nighttime backup only. Minimal storage required.',
    tag: 'Budget',
  },
  {
    days: 1.0,
    title: '1.0 Day Autonomy',
    desc: 'Full 24-hour backup coverage through extended outages.',
    tag: 'Recommended',
  },
  {
    days: 1.5,
    title: '1.5 Days Autonomy',
    desc: 'Cloudy weather & multi-day rainy season reserve.',
    tag: 'High Resilience',
  },
  {
    days: 2.0,
    title: '2.0 Days Autonomy',
    desc: 'Complete off-grid autonomy with maximum battery storage.',
    tag: 'Off-Grid',
  },
];

interface CriticalItem {
  id: string;
  label: string;
  icon: SunlitIconName;
}

const CRITICAL_LOAD_ITEMS: CriticalItem[] = [
  { id: 'refrigeration', label: 'Refrigeration & Food Storage', icon: 'kitchen' },
  { id: 'lighting', label: 'Security & Interior Lighting', icon: 'lightbulb' },
  { id: 'water_pump', label: 'Water Pumping & Borehole', icon: 'water_drop' },
  { id: 'workstation', label: 'Laptops, Wi-Fi & Office Tech', icon: 'computer' },
  { id: 'air_conditioning', label: 'Air Conditioning Units', icon: 'ac_unit' },
];

export function Step05BackupRequirement({ data, onChange, onCalculate, onBack }: Step05Props) {
  const toggleCriticalLoad = (id: string) => {
    const exists = data.criticalLoads.includes(id);
    if (exists) {
      onChange({ criticalLoads: data.criticalLoads.filter((item) => item !== id) });
    } else {
      onChange({ criticalLoads: [...data.criticalLoads, id] });
    }
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      <div>
        <span className="text-[11px] font-bold text-[#00490e] uppercase tracking-wider block mb-1">
          Step 05 of 09
        </span>
        <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#1f1b17]">
          Battery Backup & Autonomy Requirement
        </h2>
        <p className="font-sans text-sm text-[#40493d] mt-1">
          Select required battery backup duration during grid outages and define backup circuit scope.
        </p>
      </div>

      {/* Autonomy Selection Cards */}
      <div className="space-y-2">
        <label className="font-sans text-xs font-bold text-[#1f1b17] uppercase tracking-wider block">
          Battery Autonomy Duration (Days of Backup)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {AUTONOMY_OPTIONS.map((opt) => {
            const isSelected = data.autonomyDays === opt.days;
            return (
              <button
                key={opt.days}
                type="button"
                onClick={() => onChange({ autonomyDays: opt.days })}
                className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between cursor-pointer select-none ${
                  isSelected
                    ? 'bg-[#00490e] text-white border-[#00490e] shadow-md -translate-y-0.5'
                    : 'bg-white/90 backdrop-blur-md text-[#1f1b17] border-[#bfcaba]/40 hover:bg-[#f6ece6]/60 hover:border-[#00490e]/40 hover:-translate-y-0.5'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-headline font-bold text-base">{opt.title}</h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-[#00490e]/10 text-[#00490e]'
                      }`}
                    >
                      {opt.tag}
                    </span>
                  </div>
                  <p
                    className={`font-sans text-xs ${
                      isSelected ? 'text-white/80' : 'text-[#40493d]'
                    }`}
                  >
                    {opt.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Backup Scope Toggle */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#bfcaba]/40 shadow-xs space-y-4">
        <label className="font-sans text-xs font-bold text-[#1f1b17] uppercase tracking-wider block">
          Backup Circuit Scope
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              id: 'essential',
              title: 'Essential Loads Only',
              desc: 'Refrigeration, lighting, fans & workstations (65% capacity)',
            },
            {
              id: 'full',
              title: 'Full Facility Coverage',
              desc: 'All electrical circuits including air conditioners & pumps',
            },
          ].map((scope) => {
            const isSelected = data.backupScope === scope.id;
            return (
              <button
                key={scope.id}
                type="button"
                onClick={() => onChange({ backupScope: scope.id as any })}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#00490e] text-white border-[#00490e] shadow-xs'
                    : 'bg-[#fcf2eb] text-[#1f1b17] border-[#bfcaba]/50 hover:bg-[#f6ece6]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-headline font-bold text-sm">{scope.title}</div>
                  {isSelected && (
                    <SunlitIcon name="check_circle" size={18} className="text-[#8cdd86]" />
                  )}
                </div>
                <div
                  className={`font-sans text-xs mt-1 leading-relaxed ${
                    isSelected ? 'text-white/80' : 'text-[#707a6c]'
                  }`}
                >
                  {scope.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Critical Load Checkboxes */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#bfcaba]/40 shadow-xs space-y-3">
        <label className="font-sans text-xs font-bold text-[#1f1b17] uppercase tracking-wider block">
          Priority Essential Circuits
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {CRITICAL_LOAD_ITEMS.map((item) => {
            const checked = data.criticalLoads.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleCriticalLoad(item.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all text-left ${
                  checked
                    ? 'bg-[#f6ece6] border-[#00490e] text-[#00490e] font-bold shadow-xs'
                    : 'bg-[#fcf2eb] border-[#bfcaba]/40 text-[#1f1b17] hover:bg-[#f6ece6]'
                }`}
              >
                <SunlitIcon name={item.icon} size={18} className={checked ? 'text-[#00490e]' : 'text-[#707a6c]'} />
                <span className="font-sans text-xs flex-1">{item.label}</span>
                {checked && <SunlitIcon name="check_circle" size={16} className="text-[#00490e]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#bfcaba]/30">
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back to Energy Profile"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-[#707a6c] text-[#1f1b17] font-sans text-sm font-semibold hover:bg-[#f6ece6] transition-all cursor-pointer"
        >
          <SunlitIcon name="arrow_back" size={16} />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onCalculate}
          aria-label="Calculate Solar System"
          className="inline-flex items-center gap-2 bg-[#00490e] hover:bg-[#0f631b] text-white px-8 py-3 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md group cursor-pointer"
        >
          <SunlitIcon name="analytics" size={18} />
          <span>Calculate Solar System</span>
        </button>
      </div>
    </div>
  );
}
