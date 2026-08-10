'use client';

import React from 'react';
import { SharedCalculationResult } from '@/lib/engineering/types';

interface Step05Props {
  calculationResult: SharedCalculationResult | null;
  onNext: () => void;
  onBack: () => void;
}

export function Step05MonthlyYieldChart({ calculationResult, onNext, onBack }: Step05Props) {
  const resData = calculationResult?.engineering_results || {};
  const monthlyList: { month: string; generationKwh: number; dailyAverageKwh: number }[] =
    resData.monthlyGenerationKwh || [
      { month: 'Jan', generationKwh: 1120, dailyAverageKwh: 36.1 },
      { month: 'Feb', generationKwh: 1060, dailyAverageKwh: 37.8 },
      { month: 'Mar', generationKwh: 1080, dailyAverageKwh: 34.8 },
      { month: 'Apr', generationKwh: 990, dailyAverageKwh: 33.0 },
      { month: 'May', generationKwh: 940, dailyAverageKwh: 30.3 },
      { month: 'Jun', generationKwh: 860, dailyAverageKwh: 28.7 },
      { month: 'Jul', generationKwh: 810, dailyAverageKwh: 26.1 },
      { month: 'Aug', generationKwh: 830, dailyAverageKwh: 26.8 },
      { month: 'Sep', generationKwh: 890, dailyAverageKwh: 29.7 },
      { month: 'Oct', generationKwh: 980, dailyAverageKwh: 31.6 },
      { month: 'Nov', generationKwh: 1070, dailyAverageKwh: 35.7 },
      { month: 'Dec', generationKwh: 1110, dailyAverageKwh: 35.8 },
    ];

  const maxVal = Math.max(...monthlyList.map((m) => m.generationKwh), 1200);

  return (
    <div className="flex flex-col gap-6 py-2">
      <div>
        <span className="text-xs font-semibold text-[#00490e] uppercase tracking-wider block mb-1">
          Step 05 of 08
        </span>
        <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#191d17]">
          12-Month Seasonal Solar Yield Profile
        </h2>
        <p className="font-sans text-sm text-[#41493e] mt-1">
          Monthly energy generation (kWh/month) accounting for Nigerian dry season peak solar resource vs monsoon cloud derating.
        </p>
      </div>

      {/* Chart Card */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-[#c0c9bb]/40 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[#c0c9bb]/30 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00490e] text-lg">bar_chart</span>
            <h4 className="font-headline font-bold text-sm text-[#191d17]">
              Monthly Energy Output (kWh / Month)
            </h4>
          </div>
          <div className="flex items-center gap-4 text-xs font-sans">
            <span className="flex items-center gap-1.5 text-[#00490e] font-bold">
              <span className="w-3 h-3 rounded-full bg-[#00490e]" />
              Dry Season Peak
            </span>
            <span className="flex items-center gap-1.5 text-[#717a6d] font-semibold">
              <span className="w-3 h-3 rounded-full bg-[#aef4a5]" />
              Monsoon Season
            </span>
          </div>
        </div>

        {/* Bar Chart Container */}
        <div className="h-56 flex items-end justify-between gap-2 sm:gap-3 pt-6 px-2">
          {monthlyList.map((m) => {
            const heightPercent = Math.round((m.generationKwh / maxVal) * 100);
            const isPeak = m.month === 'Jan' || m.month === 'Feb' || m.month === 'Nov' || m.month === 'Dec';

            return (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
                {/* Tooltip on Hover */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-[#191d17] text-white text-[10px] font-mono px-2 py-1 rounded shadow pointer-events-none whitespace-nowrap z-10">
                  {m.month}: {m.generationKwh} kWh ({m.dailyAverageKwh} kWh/d)
                </div>

                <div
                  className={`w-full rounded-t-xl transition-all duration-300 ${
                    isPeak
                      ? 'bg-gradient-to-t from-[#00490e] to-[#2b6b2c] group-hover:brightness-110'
                      : 'bg-[#aef4a5] group-hover:bg-[#92d78b]'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="font-mono text-[11px] font-bold text-[#191d17]">{m.month}</span>
              </div>
            );
          })}
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
          <span>Continue to Loss Breakdown Waterfall</span>
          <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}
