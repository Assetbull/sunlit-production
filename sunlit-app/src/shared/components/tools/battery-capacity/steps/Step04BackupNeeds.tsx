'use client';

import React from 'react';
import { BackupGoal } from '@/lib/engineering/calculators/batteryCapacity';

interface Step04Props {
  backupGoal: BackupGoal;
  onChangeGoal: (goal: BackupGoal) => void;
  onNext: () => void;
  onBack: () => void;
}

const GOAL_OPTIONS: {
  id: BackupGoal;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  icon: string;
}[] = [
  {
    id: 'FULL_HOME',
    title: 'Whole-Home Autonomy (100% Load)',
    subtitle: 'Sustain full property energy demand without compromise',
    description: 'Powers all connected equipment including air conditioners, water pumps, refrigerators, and heavy kitchen appliances during grid outages.',
    badge: 'Maximum Protection',
    icon: 'home',
  },
  {
    id: 'CRITICAL_ONLY',
    title: 'Essential Backup Loads Only',
    subtitle: 'Optimized budget protection for critical circuits',
    description: 'Sustains vital equipment: refrigeration, LED lighting, security systems, internet routers, and laptop workstations during blackouts.',
    badge: 'Cost Optimized',
    icon: 'security',
  },
  {
    id: 'NIGHTTIME',
    title: 'Nighttime Autonomy (12 Hours)',
    subtitle: 'Overnight power coverage until morning solar recharge',
    description: 'Specifically engineered to sustain essential overnight loads from 6:00 PM to 6:00 AM until morning solar generation recharges the battery bank.',
    badge: 'Solar Autonomy',
    icon: 'bedtime',
  },
];

export function Step04BackupNeeds({ backupGoal, onChangeGoal, onNext, onBack }: Step04Props) {
  return (
    <div className="flex flex-col gap-6 py-2">
      <div>
        <span className="text-xs font-semibold text-[#00490e] uppercase tracking-wider block mb-1">
          Step 04 of 08
        </span>
        <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#191d17]">
          Define Your Backup Goal & Priority
        </h2>
        <p className="font-sans text-sm text-[#41493e] mt-1">
          Select what portion of your connected electrical load the battery bank must support during DISCO power grid outages.
        </p>
      </div>

      {/* Goal Cards */}
      <div className="space-y-4">
        {GOAL_OPTIONS.map((opt) => {
          const isSelected = backupGoal === opt.id;

          return (
            <div
              key={opt.id}
              onClick={() => onChangeGoal(opt.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                isSelected
                  ? 'bg-[#f2f5ec] border-[#00490e] shadow-md'
                  : 'bg-white/80 backdrop-blur-md border-[#c0c9bb]/40 hover:bg-[#ecefe6]/50'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                  isSelected ? 'bg-[#00490e] text-white' : 'bg-[#ecefe6] text-[#00490e]'
                }`}
              >
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {opt.icon}
                </span>
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-headline font-bold text-base text-[#191d17]">{opt.title}</h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isSelected
                          ? 'bg-[#aef4a5]/40 text-[#00490e] border-[#92d78b]'
                          : 'bg-[#ecefe6] text-[#717a6d] border-[#c0c9bb]/30'
                      }`}
                    >
                      {opt.badge}
                    </span>
                  </div>
                  <span
                    className={`material-symbols-outlined text-xl ${
                      isSelected ? 'text-[#00490e]' : 'text-[#c0c9bb]'
                    }`}
                  >
                    {isSelected ? 'radio_button_checked' : 'radio_button_unchecked'}
                  </span>
                </div>
                <p className="font-sans text-xs font-semibold text-[#00490e]">{opt.subtitle}</p>
                <p className="font-sans text-xs text-[#41493e] leading-relaxed">{opt.description}</p>
              </div>
            </div>
          );
        })}
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
          <span>Continue to Backup Duration</span>
          <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}
