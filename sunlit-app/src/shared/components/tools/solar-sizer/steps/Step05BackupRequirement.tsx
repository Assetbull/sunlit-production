'use client';

import React from 'react';
import { BackupProfileState } from '../types';

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

const CRITICAL_LOAD_ITEMS = [
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
        <span className="text-xs font-semibold text-[#00490e] uppercase tracking-wider block mb-1">
          Step 05 of 09
        </span>
        <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#191d17]">
          Battery Backup & Autonomy Requirement
        </h2>
        <p className="font-sans text-sm text-[#41493e] mt-1">
          Select required battery backup duration during grid outages and define backup circuit scope.
        </p>
      </div>

      {/* Autonomy Selection Cards */}
      <div className="space-y-2">
        <label className="font-sans text-xs font-bold text-[#191d17] uppercase tracking-wider block">
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
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#00490e] text-white border-[#00490e] shadow-md'
                    : 'bg-white/80 backdrop-blur-md text-[#191d17] border-[#c0c9bb]/40 hover:bg-[#ecefe6]/50'
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
                      isSelected ? 'text-white/80' : 'text-[#41493e]'
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
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-[#c0c9bb]/40 shadow-sm space-y-4">
        <label className="font-sans text-xs font-bold text-[#191d17] uppercase tracking-wider block">
          Backup Circuit Scope
        </label>

        <div className="grid grid-cols-2 gap-3">
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
          ].map((scope) => (
            <button
              key={scope.id}
              type="button"
              onClick={() => onChange({ backupScope: scope.id as any })}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                data.backupScope === scope.id
                  ? 'bg-[#00490e] text-white border-[#00490e]'
                  : 'bg-[#f2f5ec] text-[#191d17] border-[#c0c9bb]/50 hover:bg-[#ecefe6]'
              }`}
            >
              <div className="font-headline font-bold text-sm">{scope.title}</div>
              <div
                className={`font-sans text-xs mt-1 ${
                  data.backupScope === scope.id ? 'text-white/80' : 'text-[#717a6d]'
                }`}
              >
                {scope.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Critical Load Checkboxes */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-[#c0c9bb]/40 shadow-sm space-y-3">
        <label className="font-sans text-xs font-bold text-[#191d17] uppercase tracking-wider block">
          Priority Essential Circuits
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {CRITICAL_LOAD_ITEMS.map((item) => {
            const checked = data.criticalLoads.includes(item.id);
            return (
              <label
                key={item.id}
                onClick={() => toggleCriticalLoad(item.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  checked
                    ? 'bg-[#ecefe6] border-[#00490e] text-[#00490e] font-bold'
                    : 'bg-[#f2f5ec] border-[#c0c9bb]/40 text-[#191d17]'
                }`}
              >
                <span className="material-symbols-outlined text-lg">{item.icon}</span>
                <span className="font-sans text-xs">{item.label}</span>
              </label>
            );
          })}
        </div>
      </div>

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
          onClick={onCalculate}
          className="inline-flex items-center gap-2 bg-[#00490e] hover:bg-[#003006] text-white px-8 py-3 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md group"
        >
          <span className="material-symbols-outlined text-base">analytics</span>
          <span>Calculate Solar System</span>
        </button>
      </div>
    </div>
  );
}
