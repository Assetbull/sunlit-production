'use client';

import React, { useState } from 'react';
import { calculatePvConfiguration } from '@/lib/engineering/calculators/pvConfiguration';
import { SharedCalculationResult } from '@/lib/engineering/types';
import { PvConfigurationModal } from '@/shared/components/tools/pv-configuration/PvConfigurationModal';
import { ToolHeader } from '@/shared/components/tools/ToolHeader';
import { UnlockReportCTA } from '@/shared/components/tools/UnlockReportCTA';
import { PublicWaitlistForm } from '@/shared/components/tools/PublicWaitlistForm';
import { RelatedToolsList } from '@/shared/components/tools/RelatedToolsList';
import { EngineeringMethodology } from '@/shared/components/tools/EngineeringMethodology';
import { EngineeringTrust } from '@/shared/components/tools/EngineeringTrust';
import { EngineeringFAQ } from '@/shared/components/tools/EngineeringFAQ';
import { ConfidenceIndicator } from '@/shared/components/tools/ConfidenceIndicator';
import { EngineeringNotes } from '@/shared/components/tools/EngineeringNotes';
import { TOOLS_CONTENT } from '@/lib/engineering/marketing/toolsContent';
import {
  Play, Layers, Thermometer, Zap, ArrowRight, Sliders
} from 'lucide-react';
import Link from 'next/link';

const content = TOOLS_CONTENT['pv-configuration'];

export function PvConfigurationClient() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [panelsPerString, setPanelsPerString] = useState<number>(10);
  const [stringsCount, setStringsCount] = useState<number>(2);
  const [minTemp, setMinTemp] = useState<number>(15);
  const [maxTemp, setMaxTemp] = useState<number>(45);

  const result: SharedCalculationResult = calculatePvConfiguration({
    modulesPerString: panelsPerString,
    parallelStringsCount: stringsCount,
    totalModulesCount: panelsPerString * stringsCount,
    tempMinC: minTemp,
    tempMaxC: maxTemp,
  });

  const isSuccess = result.calculation_status === 'SUCCESS';
  const resData = result.engineering_results;

  return (
    <main className="bg-[#fff8f5] text-[#1f1b17] font-sans min-h-screen pb-24 antialiased">
      <ToolHeader
        title={content.name}
        category={content.category}
        description={content.heroDescription}
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-stone-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#00490e] bg-[#aef4a5]/40 px-2.5 py-0.5 rounded-full border border-[#92d78b]">
                Deterministic Engine V2.4
              </span>
              <span className="text-xs text-stone-500 font-medium">• {content.tagline}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#00490e] tracking-tight">
              {content.heroHeadline}
            </h1>
            <p className="text-stone-600 text-sm sm:text-base mt-1">
              Validate cold-weather open-circuit Voc and hot-weather Vmp against inverter MPPT tracking bounds.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-[#00490e] hover:bg-[#003006] text-white font-semibold px-6 py-3.5 rounded-full text-sm shadow-md transition-all hover:scale-105"
          >
            <Play size={18} className="fill-white" />
            <span>Launch PV Configurator Wizard</span>
          </button>
        </div>

        {/* Interactive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left: Input Parameters */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white/90 backdrop-blur-md border border-stone-200 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#00490e] mb-5 flex items-center gap-2 border-b border-stone-100 pb-3">
                <Sliders className="w-5 h-5 text-[#00490e]" />
                String & Thermal Parameters
              </h2>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Panels per String
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={panelsPerString}
                      onChange={(e) => setPanelsPerString(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-base"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Parallel Strings
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={stringsCount}
                      onChange={(e) => setStringsCount(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-base"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Min Ambient Temp (°C)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={30}
                      value={minTemp}
                      onChange={(e) => setMinTemp(Number(e.target.value))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Max Ambient Temp (°C)
                    </label>
                    <input
                      type="number"
                      min={30}
                      max={60}
                      value={maxTemp}
                      onChange={(e) => setMaxTemp(Number(e.target.value))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Results Summary */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-white via-[#f4fbf5] to-[#e8f6ea] border border-emerald-200/80 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 block mb-1">
                  Max String Voc (Cold {minTemp}°C)
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-5xl font-extrabold text-[#00490e] tracking-tight">
                    {resData.maxStringVocCold ?? resData.stringVocColdVolts ?? 0}
                  </span>
                  <span className="text-xl font-bold text-stone-600">V</span>
                </div>
                <p className="text-xs text-stone-500 font-semibold mt-2">
                  Open-circuit morning maximum
                </p>
              </div>

              <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                <span className="text-xs font-bold uppercase tracking-widest text-stone-500 block mb-1">
                  Min String Vmp (Hot {maxTemp}°C)
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-5xl font-extrabold text-stone-900 tracking-tight">
                    {resData.minStringVmpHot ?? resData.stringVmpHotVolts ?? 0}
                  </span>
                  <span className="text-xl font-bold text-stone-500">V</span>
                </div>
                <p className="text-xs text-stone-500 font-semibold mt-2">
                  Hot afternoon MPPT tracking
                </p>
              </div>
            </div>

            {isSuccess && (
              <div className="space-y-4">
                <ConfidenceIndicator
                  level={result.confidence}
                  reasoning={result.confidenceReasoning}
                />
                <EngineeringNotes
                  notes={result.supporting_notes}
                  assumptions={result.assumptions}
                  warnings={result.warnings}
                />
              </div>
            )}

            <Link
              href="/tools/energy-yield"
              className="w-full bg-[#00490e] hover:bg-[#003006] text-white font-semibold py-4 rounded-full text-sm shadow-md transition-all flex items-center justify-center gap-2 group"
            >
              Simulate 12-Month Solar Yield for this Layout
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Feature Bento Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {content.features.map((f, i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-md border border-[#c0c9bb]/40 rounded-3xl p-6 shadow-sm space-y-3"
            >
              <div className="w-10 h-10 rounded-full bg-[#aef4a5]/40 flex items-center justify-center text-[#00490e]">
                {i === 0 ? <Thermometer size={20} /> : i === 1 ? <Layers size={20} /> : <Zap size={20} />}
              </div>
              <h3 className="font-bold text-lg text-[#191d17]">{f.title}</h3>
              <p className="text-xs text-[#41493e] leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>

        {/* Methodology Section */}
        <EngineeringMethodology
          mathematicalModel={content.mathematicalModel}
          governingStandards={content.governingStandards}
          keyEquations={content.keyEquations}
          methodologyDescription={content.methodologyDescription}
        />

        {/* Trust Section */}
        <EngineeringTrust
          toolName={content.name}
          trustPoints={content.trustPoints}
        />

        {/* FAQ Section */}
        <EngineeringFAQ
          toolName={content.name}
          faqs={content.faqs}
        />

        <UnlockReportCTA />
        <PublicWaitlistForm interestedTool={content.name} />
        <RelatedToolsList currentToolId={content.id} />
      </div>

      {/* Guided Modal */}
      <PvConfigurationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}
