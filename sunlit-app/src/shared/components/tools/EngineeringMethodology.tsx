import React from 'react';
import { BookOpen, ShieldCheck, FileCode, CheckCircle2 } from 'lucide-react';

interface EngineeringMethodologyProps {
  mathematicalModel: string;
  governingStandards: string[];
  keyEquations: string[];
  methodologyDescription: string;
}

export function EngineeringMethodology({
  mathematicalModel,
  governingStandards,
  keyEquations,
  methodologyDescription,
}: EngineeringMethodologyProps) {
  return (
    <section className="bg-white/90 backdrop-blur-md border border-[#c0c9bb]/50 rounded-3xl p-6 sm:p-8 shadow-sm mb-10">
      <div className="flex items-center gap-3 border-b border-stone-200/80 pb-4 mb-6">
        <div className="w-10 h-10 rounded-full bg-[#aef4a5]/40 flex items-center justify-center text-[#00490e]">
          <BookOpen size={20} />
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#00490e] block">
            Transparent Engineering Standards
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1f1b17]">
            Mathematical Methodology & Governing Codes
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Methodology explanation & standards */}
        <div className="lg:col-span-6 space-y-5">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-700 mb-2">
              Calculation Model
            </h3>
            <p className="text-sm text-stone-800 font-semibold bg-stone-50 border border-stone-200 rounded-xl p-3">
              {mathematicalModel}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-700 mb-2">
              Engineering Narrative
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              {methodologyDescription}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-700 mb-2">
              Governing Standards & Reference Codes
            </h3>
            <div className="flex flex-wrap gap-2">
              {governingStandards.map((std, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-[#00490e] border border-emerald-200 rounded-full text-xs font-semibold"
                >
                  <ShieldCheck size={13} className="text-emerald-700" />
                  {std}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Governing Equations Box */}
        <div className="lg:col-span-6">
          <div className="bg-[#1b1c1c] text-[#fbf9f8] rounded-2xl p-6 shadow-inner space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-stone-700 pb-3">
              <span className="flex items-center gap-2 text-stone-300 font-bold uppercase text-[11px] tracking-wider">
                <FileCode size={16} className="text-[#aef4a5]" />
                Governing Physical Equations
              </span>
              <span className="text-[10px] text-[#aef4a5] bg-[#00490e] px-2 py-0.5 rounded-full font-sans">
                Deterministic
              </span>
            </div>

            <div className="space-y-3">
              {keyEquations.map((eq, idx) => (
                <div
                  key={idx}
                  className="bg-black/40 border border-stone-800 rounded-xl p-3.5 text-[#aef4a5] leading-relaxed break-words"
                >
                  <span className="text-stone-500 select-none mr-2">[{idx + 1}]</span>
                  {eq}
                </div>
              ))}
            </div>

            <p className="text-[11px] text-stone-400 font-sans mt-3">
              Calculations are executed server-side with zero non-finite anomalies and full parameter boundary validation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
