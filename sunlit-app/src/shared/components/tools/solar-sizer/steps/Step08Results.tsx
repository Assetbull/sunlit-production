'use client';

import React from 'react';
import { SharedCalculationResult } from '@/lib/engineering/types';

interface Step08Props {
  calculationResult: SharedCalculationResult | null;
  onNext: () => void;
  onBack: () => void;
}

export function Step08Results({ calculationResult, onNext, onBack }: Step08Props) {
  const resData = calculationResult?.engineering_results || {};
  const assumptions = calculationResult?.assumptions || {};
  const warnings = calculationResult?.warnings || [];
  const notes = calculationResult?.supporting_notes || [];

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Header Banner */}
      <div className="border-b border-[#c0c9bb]/40 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#00490e] bg-[#aef4a5]/40 px-2.5 py-0.5 rounded-full border border-[#92d78b]">
            Engineering Turnkey Specification
          </span>
          <span className="text-xs text-[#717a6d] font-medium">• Solar Sizer Engine V2.0</span>
        </div>
        <h2 className="font-headline font-extrabold text-2xl sm:text-4xl text-[#00490e] tracking-tight">
          Your PV System Sizing Report is Ready.
        </h2>
        <p className="font-sans text-xs sm:text-sm text-[#41493e] mt-1">
          Optimized turnkey specifications cross-validating load profile, battery autonomy, and solar resource.
        </p>
      </div>

      {/* Primary Turnkey Specification Cards */}
      <div className="bg-gradient-to-br from-white via-[#f7fbf1] to-[#ecefe6] border border-[#92d78b]/80 rounded-3xl p-6 shadow-sm">
        <span className="inline-block px-3 py-1 bg-[#00490e] text-[#aef4a5] font-semibold rounded-full text-[11px] mb-5 uppercase tracking-wider">
          Turnkey Recommended Specification
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          {/* Solar Array */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#717a6d] font-bold text-xs uppercase">
              <span className="material-symbols-outlined text-amber-500 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                wb_sunny
              </span>
              <span>Solar Array Capacity</span>
            </div>
            <div className="font-headline font-extrabold text-4xl text-[#00490e]">
              {resData.recommendedSolarArrayKwp ?? 0}
              <span className="text-sm font-normal text-[#41493e] ml-1">kWp</span>
            </div>
            <div className="font-mono text-xs text-[#717a6d] mt-1">
              {resData.recommendedPanelCount ?? 0} × {resData.panelPowerWatt ?? 550}W Panels
            </div>
          </div>

          {/* Storage Capacity */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#717a6d] font-bold text-xs uppercase">
              <span className="material-symbols-outlined text-emerald-600 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                battery_charging_full
              </span>
              <span>Storage Capacity</span>
            </div>
            <div className="font-headline font-extrabold text-4xl text-[#00490e]">
              {resData.recommendedBatteryKwh ?? 0}
              <span className="text-sm font-normal text-[#41493e] ml-1">kWh</span>
            </div>
            <div className="font-mono text-xs text-[#717a6d] mt-1">
              LiFePO4 @ {resData.backupAutonomyDays ?? 1.0} Day Autonomy
            </div>
          </div>

          {/* Inverter Rating */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#717a6d] font-bold text-xs uppercase">
              <span className="material-symbols-outlined text-blue-600 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                memory
              </span>
              <span>Inverter Rating</span>
            </div>
            <div className="font-headline font-extrabold text-4xl text-[#00490e]">
              {resData.recommendedInverterKva ?? 0}
              <span className="text-sm font-normal text-[#41493e] ml-1">kVA</span>
            </div>
            <div className="font-mono text-xs text-[#717a6d] mt-1">
              {resData.phaseType === 'three-phase' ? '3-Phase' : 'Single-Phase'} Pure Sine Hybrid
            </div>
          </div>
        </div>

        {/* Secondary Metric Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-[#c0c9bb]/40 pt-5 text-xs font-sans">
          <div>
            <span className="text-[#717a6d] font-medium block mb-0.5">Daily kWh Demand</span>
            <span className="font-bold text-[#191d17] text-base">{resData.dailyEnergyDemandKwh ?? 0} kWh/day</span>
          </div>
          <div>
            <span className="text-[#717a6d] font-medium block mb-0.5">Monthly Consumption</span>
            <span className="font-bold text-[#191d17] text-base">{resData.monthlyEnergyDemandKwh ?? 0} kWh/mo</span>
          </div>
          <div>
            <span className="text-[#717a6d] font-medium block mb-0.5">Roof Footprint</span>
            <span className="font-bold text-[#191d17] text-base">{resData.estimatedRoofAreaM2 ?? 0} m²</span>
          </div>
          <div>
            <span className="text-[#717a6d] font-medium block mb-0.5">Grid Displacement</span>
            <span className="font-bold text-[#00490e] text-base">100% Coverage</span>
          </div>
        </div>
      </div>

      {/* Confidence Indicator Card */}
      <div className="p-4 bg-[#ecefe6] border border-[#c0c9bb]/40 rounded-2xl flex items-start gap-3">
        <span className="material-symbols-outlined text-[#00490e] text-xl shrink-0 mt-0.5">
          verified
        </span>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-[#00490e]">
              Engineering Confidence: HIGH
            </h4>
          </div>
          <p className="font-sans text-xs text-[#41493e] mt-1 leading-relaxed">
            {calculationResult?.confidenceReasoning ||
              'Integrated multi-variable calculation cross-validating load, battery autonomy, inverter peak capacity, and solar array yield.'}
          </p>
        </div>
      </div>

      {/* Assumptions & Notes */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-[#c0c9bb]/40 space-y-3 text-xs">
        <h4 className="font-headline font-bold text-sm text-[#191d17] uppercase tracking-wider">
          Applied Engineering Assumptions & Notes
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 font-mono text-[11px] bg-[#f7fbf1] p-3 rounded-xl border border-[#c0c9bb]/30">
            {Object.entries(assumptions).map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-[#717a6d] capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span>
                <span className="font-bold text-[#191d17]">{String(v)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-1 text-[#41493e]">
            {notes.map((note, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[#00490e] text-sm shrink-0 mt-0.5">
                  info
                </span>
                <span>{note}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Technical Warnings if any */}
      {warnings.length > 0 && (
        <div className="space-y-2">
          {warnings.map((w, idx) => (
            <div key={idx} className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex items-start gap-2.5 text-xs">
              <span className="material-symbols-outlined text-amber-600 text-lg shrink-0 mt-0.5">
                warning
              </span>
              <div>
                <span className="font-bold">{w.message}</span>
                <span className="block text-amber-700 mt-0.5">{w.suggestion}</span>
              </div>
            </div>
          ))}
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
          className="inline-flex items-center gap-2 bg-[#00490e] hover:bg-[#003006] text-white px-8 py-3 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md group"
        >
          <span>Continue to Next Actions</span>
          <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}
