'use client';

import React, { useState } from 'react';
import { calculateSolarSystemSizing } from '@/lib/engineering/calculators/solarSystemSizing';
import { SharedCalculationResult } from '@/lib/engineering/types';
import { SolarSizerModal } from '@/shared/components/tools/solar-sizer/SolarSizerModal';
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
  Play, Sun, Battery, Cpu, ArrowRight, Sliders
} from 'lucide-react';
import Link from 'next/link';

const content = TOOLS_CONTENT['solar-system-sizing'];

export function SolarSystemSizingClient() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [dailyKwh, setDailyKwh] = useState<number>(24.0);
  const [psh, setPsh] = useState<number>(4.8);
  const [autonomyDays, setAutonomyDays] = useState<number>(1.0);
  const [dod, setDod] = useState<number>(0.8);
  const [peakSurgeKw, setPeakSurgeKw] = useState<number>(7.5);

  const result: SharedCalculationResult = calculateSolarSystemSizing({
    dailyKwhInput: dailyKwh,
    daysOfAutonomy: autonomyDays,
    location: 'Lagos',
    selectedPanelWattage: 550,
    selectedBatteryType: dod > 0.6 ? 'lithium_lifepo4' : 'gel_lead_acid',
    selectedInverterType: 'hybrid_pure_sine',
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
        {/* Workspace Header Bar */}
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
              Complete engineering sizing cross-validating daily energy demand, battery storage, and inverter ratings.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-[#00490e] hover:bg-[#003006] text-white font-semibold px-6 py-3.5 rounded-full text-sm shadow-md transition-all hover:scale-105"
          >
            <Play size={18} className="fill-white" />
            <span>Launch Step-by-Step Wizard</span>
          </button>
        </div>

        {/* Interactive Workspace: Left Inputs, Right Live Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left: Interactive Input Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white/90 backdrop-blur-md border border-stone-200 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#00490e] mb-5 flex items-center gap-2 border-b border-stone-100 pb-3">
                <Sliders className="w-5 h-5 text-[#00490e]" />
                System Sizing Parameters
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Daily Energy Requirement (kWh/day)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      max={500}
                      step={0.5}
                      value={dailyKwh}
                      onChange={(e) => setDailyKwh(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-base"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-stone-400">
                      kWh
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">Average 3-bedroom home: 18–25 kWh/day.</p>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Project Location (Peak Sun Hours)
                  </label>
                  <select
                    value={psh}
                    onChange={(e) => setPsh(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-sm"
                  >
                    <option value={4.8}>Lagos (4.8 PSH / day)</option>
                    <option value={5.5}>Abuja (5.5 PSH / day)</option>
                    <option value={6.2}>Kano (6.2 PSH / day)</option>
                    <option value={4.5}>Port Harcourt (4.5 PSH / day)</option>
                    <option value={5.2}>Ibadan (5.2 PSH / day)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Battery Autonomy (Days of Storage)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[0.5, 1.0, 1.5, 2.0].map((days) => (
                      <button
                        key={days}
                        type="button"
                        onClick={() => setAutonomyDays(days)}
                        className={`py-2.5 rounded-xl font-bold text-xs transition-all ${
                          autonomyDays === days
                            ? 'bg-[#00490e] text-white shadow-sm'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        {days} {days === 1 ? 'Day' : 'Days'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Battery Chemistry & Depth of Discharge
                  </label>
                  <select
                    value={dod}
                    onChange={(e) => setDod(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-sm"
                  >
                    <option value={0.8}>Lithium LiFePO4 (80% DoD - Recommended)</option>
                    <option value={0.9}>Lithium High-Cycle (90% DoD)</option>
                    <option value={0.5}>Tubular Gel / Lead-Acid (50% DoD)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Estimated Peak Motor Surge (kW)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      max={100}
                      step={0.5}
                      value={peakSurgeKw}
                      onChange={(e) => setPeakSurgeKw(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-base"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-stone-400">
                      kW
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Live Calculated Results Summary */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Solar Array Card */}
              <div className="bg-gradient-to-br from-white via-[#f4fbf5] to-[#e8f6ea] border border-emerald-200/80 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 block mb-1">
                  Solar PV Capacity
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold text-[#00490e] tracking-tight">
                    {resData.recommendedSolarCapacityKwp ?? 0}
                  </span>
                  <span className="text-lg font-bold text-stone-600">kWp</span>
                </div>
                <p className="text-xs text-stone-500 font-semibold mt-2">
                  ~{Math.ceil(((resData.recommendedSolarCapacityKwp ?? 5) * 1000) / 550)} × 550W Panels
                </p>
              </div>

              {/* Battery Storage Card */}
              <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                <span className="text-xs font-bold uppercase tracking-widest text-stone-500 block mb-1">
                  Battery Storage
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold text-stone-900 tracking-tight">
                    {resData.recommendedBatteryCapacityKwh ?? 0}
                  </span>
                  <span className="text-lg font-bold text-stone-500">kWh</span>
                </div>
                <p className="text-xs text-stone-500 font-semibold mt-2">
                  48V DC LiFePO4 Bank
                </p>
              </div>

              {/* Inverter Capacity Card */}
              <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                <span className="text-xs font-bold uppercase tracking-widest text-stone-500 block mb-1">
                  Inverter Rating
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold text-stone-900 tracking-tight">
                    {resData.recommendedInverterCapacityKva ?? 0}
                  </span>
                  <span className="text-lg font-bold text-stone-500">kVA</span>
                </div>
                <p className="text-xs text-stone-500 font-semibold mt-2">
                  Pure Sine Wave Hybrid
                </p>
              </div>
            </div>

            {/* Validation & Invariants Summary */}
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

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-[#00490e] hover:bg-[#003006] text-white font-semibold py-4 rounded-full text-sm shadow-md transition-all flex items-center justify-center gap-2 group"
            >
              Open Full Multi-Step Sizing Wizard
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
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
                {i === 0 ? <Sun size={20} /> : i === 1 ? <Battery size={20} /> : <Cpu size={20} />}
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

        {/* Trust & Case Context */}
        <EngineeringTrust
          toolName={content.name}
          trustPoints={content.trustPoints}
        />

        {/* AEO / FAQ Accordion */}
        <EngineeringFAQ
          toolName={content.name}
          faqs={content.faqs}
        />

        <UnlockReportCTA />
        <PublicWaitlistForm interestedTool={content.name} />
        <RelatedToolsList currentToolId={content.id} />
      </div>

      {/* Guided 9-Step Solar Sizer Modal */}
      <SolarSizerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}
