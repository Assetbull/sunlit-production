'use client';

import React from 'react';
import { SharedCalculationResult } from '@/lib/engineering/types';
import { SunlitIcon } from '@/shared/components/ui/SunlitIcon';

interface Step06Props {
  calculationResult: SharedCalculationResult | null;
  onNext: () => void;
  onBack: () => void;
}

export function Step06PerformanceBreakdown({ calculationResult, onNext, onBack }: Step06Props) {
  const resData = calculationResult?.engineering_results || {};
  const lossList: { name: string; percent: number }[] = resData.lossBreakdown || [
    { name: 'STC Nominal Array Output', percent: 100.0 },
    { name: 'Temperature & Thermal Derating', percent: 8.0 },
    { name: 'Soiling & Dust Losses', percent: 3.0 },
    { name: 'DC & AC Cable Ohmic Loss', percent: 2.0 },
    { name: 'Inverter Conversion Efficiency', percent: 2.5 },
    { name: 'Final Net Performance Ratio (PR)', percent: 84.5 },
  ];

  return (
    <div className="flex flex-col gap-6 py-2">
      <div>
        <span className="text-[11px] font-bold text-[#00490e] uppercase tracking-wider block mb-1">
          STEP 06 OF 08
        </span>
        <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#1f1b17]">
          System Losses & Performance Ratio (PR) Breakdown
        </h2>
        <p className="font-sans text-sm text-[#40493d] mt-1 leading-relaxed">
          IEC 61724 standard loss waterfall quantifying thermal derating, soiling accumulation, cable resistance, and inverter conversion efficiency.
        </p>
      </div>

      {/* Loss Waterfall List */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-[#bfcaba]/40 shadow-xs space-y-4">
        <h4 className="font-headline font-bold text-xs text-[#00490e] uppercase tracking-wider flex items-center gap-2 border-b border-[#bfcaba]/30 pb-3">
          <SunlitIcon name="waterfall_chart" size={18} />
          <span>Energy Yield Loss Breakdown</span>
        </h4>

        <div className="space-y-3">
          {lossList.map((item, idx) => {
            const isFinal = idx === lossList.length - 1;

            return (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                  isFinal
                    ? 'bg-[#00490e] text-white border-[#00490e]'
                    : 'bg-[#fcf2eb] text-[#1f1b17] border-[#bfcaba]/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      isFinal ? 'bg-[#8cdd86] text-[#00490e]' : 'bg-[#bfcaba]/40 text-[#1f1b17]'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="font-sans font-bold text-xs sm:text-sm">{item.name}</span>
                </div>

                <span
                  className={`font-mono font-extrabold text-sm ${
                    isFinal ? 'text-[#8cdd86]' : idx === 0 ? 'text-[#00490e]' : 'text-amber-800'
                  }`}
                >
                  {idx === 0 ? `100.0% STC` : isFinal ? `${item.percent}% PR` : `-${item.percent}%`}
                </span>
              </div>
            );
          })}
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
          aria-label="Continue to Scenario Comparison Matrix"
          className="inline-flex items-center gap-2 bg-[#00490e] hover:bg-[#0f631b] text-white px-7 py-2.5 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md group cursor-pointer"
        >
          <span>Continue to Scenario Comparison Matrix</span>
          <SunlitIcon name="arrow_forward" size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
