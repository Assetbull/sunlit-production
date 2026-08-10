'use client';

import React from 'react';
import { SharedCalculationResult } from '@/lib/engineering/types';

interface Step08Props {
  calculationResult: SharedCalculationResult | null;
  onNext: () => void;
  onBack: () => void;
}

export function Step08PanelConfiguration({ calculationResult, onNext, onBack }: Step08Props) {
  const resData = calculationResult?.engineering_results || {};
  const panelCount = resData.recommendedPanelCount ?? 14;

  // Calculate string geometry (e.g. 2 strings of 7 panels)
  const stringsCount = panelCount % 2 === 0 ? 2 : 1;
  const panelsPerString = Math.ceil(panelCount / stringsCount);
  const vocPerString = Number((panelsPerString * 49.5).toFixed(1));
  const iscTotal = Number((stringsCount * 13.9).toFixed(1));

  return (
    <div className="flex flex-col gap-6 py-2">
      <div>
        <span className="text-xs font-semibold text-[#00490e] uppercase tracking-wider block mb-1">
          Step 08 of 09 (High-Fidelity Electrical Layout)
        </span>
        <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#191d17]">
          Solar Panel Configuration & String Architecture
        </h2>
        <p className="font-sans text-sm text-[#41493e] mt-1">
          Configure string wiring, open-circuit voltage (Voc), short-circuit current (Isc), and roof tilt orientation.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* String Wiring Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#c0c9bb]/40 shadow-sm space-y-4">
          <h4 className="font-headline font-bold text-sm text-[#00490e] uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-base">cable</span>
            <span>MPPT String Wiring Layout</span>
          </h4>

          <div className="p-4 bg-[#f2f5ec] rounded-xl border border-[#c0c9bb]/30 space-y-3 text-xs">
            <div className="flex justify-between items-center border-b border-[#c0c9bb]/30 pb-2">
              <span className="text-[#717a6d]">Recommended String Layout:</span>
              <span className="font-headline font-bold text-sm text-[#00490e]">
                {stringsCount} String{stringsCount > 1 ? 's' : ''} × {panelsPerString} Panels in Series
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-white p-3 rounded-lg border border-[#c0c9bb]/30">
                <span className="text-[#717a6d] block text-[11px] mb-0.5">String Open-Circuit (V_oc)</span>
                <span className="font-mono font-bold text-base text-[#191d17]">{vocPerString} VDC</span>
                <span className="text-[10px] text-[#717a6d] block mt-0.5">MPPT Window: 120-450 VDC</span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-[#c0c9bb]/30">
                <span className="text-[#717a6d] block text-[11px] mb-0.5">Array Short-Circuit (I_sc)</span>
                <span className="font-mono font-bold text-base text-[#191d17]">{iscTotal} A DC</span>
                <span className="text-[10px] text-[#717a6d] block mt-0.5">Max Charge Current</span>
              </div>
            </div>
          </div>
        </div>

        {/* Roof Orientation & Mounting Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#c0c9bb]/40 shadow-sm space-y-4">
          <h4 className="font-headline font-bold text-sm text-[#00490e] uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-base">explore</span>
            <span>Roof Tilt & Azimuth Orientation</span>
          </h4>

          <div className="space-y-3 text-xs font-sans">
            <div className="p-3 bg-[#ecefe6] rounded-xl flex justify-between items-center">
              <div>
                <span className="font-bold text-[#191d17] block">Recommended Tilt Angle</span>
                <span className="text-[11px] text-[#717a6d]">Optimized for West Africa latitude</span>
              </div>
              <span className="font-headline font-extrabold text-lg text-[#00490e]">12° to 15°</span>
            </div>

            <div className="p-3 bg-[#ecefe6] rounded-xl flex justify-between items-center">
              <div>
                <span className="font-bold text-[#191d17] block">Azimuth Orientation</span>
                <span className="text-[11px] text-[#717a6d]">True South Facing for Northern Hemisphere</span>
              </div>
              <span className="font-headline font-extrabold text-lg text-[#00490e]">180° True South</span>
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
          className="inline-flex items-center gap-2 bg-[#00490e] hover:bg-[#003006] text-white px-8 py-3 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md group"
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
