'use client';

import React from 'react';
import { SharedCalculationResult } from '@/lib/engineering/types';

interface Step07Props {
  calculationResult: SharedCalculationResult | null;
  onNext: () => void;
  onBack: () => void;
}

export function Step07ScenarioComparison({ calculationResult, onNext, onBack }: Step07Props) {
  const resData = calculationResult?.engineering_results || {};
  const scenarios: {
    id: string;
    title: string;
    tilt: string;
    azimuth: string;
    annualYieldKwh: number;
    specificYieldKwhKwp: number;
    performanceRatio: string;
    relativeYieldPercent: number;
  }[] = resData.scenarioComparisons || [
    {
      id: 'scenario-base',
      title: 'Current Design Configuration',
      tilt: '15°',
      azimuth: '180° (True South)',
      annualYieldKwh: 12410,
      specificYieldKwhKwp: 1611.7,
      performanceRatio: '84.5%',
      relativeYieldPercent: 100,
    },
    {
      id: 'scenario-optimized',
      title: 'Optimized 15° True South Fixed Mount',
      tilt: '15°',
      azimuth: '180° (True South)',
      annualYieldKwh: 12410,
      specificYieldKwhKwp: 1611.7,
      performanceRatio: '84.5%',
      relativeYieldPercent: 100,
    },
    {
      id: 'scenario-flat',
      title: '0° Flat Roof Flush Mount',
      tilt: '0° (Horizontal)',
      azimuth: '360° (Omni)',
      annualYieldKwh: 11665,
      specificYieldKwhKwp: 1514.9,
      performanceRatio: '79.4%',
      relativeYieldPercent: 94.0,
    },
  ];

  return (
    <div className="flex flex-col gap-6 py-2">
      <div>
        <span className="text-xs font-semibold text-[#00490e] uppercase tracking-wider block mb-1">
          Step 07 of 08
        </span>
        <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#191d17]">
          Array Layout Scenario Comparison Matrix
        </h2>
        <p className="font-sans text-sm text-[#41493e] mt-1">
          Compare annual energy yield (kWh/yr), specific yield (kWh/kWp), and relative generation efficiency across tilt orientation scenarios.
        </p>
      </div>

      {/* Scenario Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {scenarios.map((sc, idx) => {
          const isBase = idx === 0;

          return (
            <div
              key={sc.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                isBase
                  ? 'bg-[#f2f5ec] border-[#00490e] shadow-md ring-2 ring-[#00490e]/20'
                  : 'bg-white/80 backdrop-blur-md border-[#c0c9bb]/40'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#00490e] bg-[#aef4a5]/40 px-2.5 py-0.5 rounded-full border border-[#92d78b]">
                    {isBase ? 'Active Design' : `Scenario 0${idx + 1}`}
                  </span>
                  <span className="font-mono font-bold text-xs text-[#00490e]">
                    {sc.relativeYieldPercent}% Yield
                  </span>
                </div>
                <h3 className="font-headline font-bold text-base text-[#191d17]">{sc.title}</h3>
                <div className="text-xs text-[#717a6d] font-mono space-y-0.5">
                  <div>Tilt: {sc.tilt}</div>
                  <div>Azimuth: {sc.azimuth}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#c0c9bb]/30 space-y-2 text-xs">
                <div className="flex justify-between items-baseline">
                  <span className="text-[#717a6d]">Annual Yield:</span>
                  <span className="font-headline font-bold text-base text-[#00490e]">
                    {sc.annualYieldKwh.toLocaleString()} kWh
                  </span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-[#717a6d]">Specific Yield:</span>
                  <span className="font-bold text-[#191d17]">{sc.specificYieldKwhKwp} kWh/kWp</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-[#717a6d]">Performance Ratio:</span>
                  <span className="font-bold text-emerald-800">{sc.performanceRatio}</span>
                </div>
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
          <span>Continue to Save Spec & Lead Capture</span>
          <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}
