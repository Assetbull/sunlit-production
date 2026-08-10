'use client';

import React, { useState } from 'react';
import { calculateSolarPanelSizing } from '@/lib/engineering/calculators/solarPanelSizing';
import { SharedCalculationResult } from '@/lib/engineering/types';
import { SolarPanelModal } from '@/shared/components/tools/solar-panel/SolarPanelModal';
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
  Play, Sun, Layers, MapPin, ArrowRight, Sliders
} from 'lucide-react';
import Link from 'next/link';

const content = TOOLS_CONTENT['solar-panel-sizing'];

export function SolarPanelSizingClient() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [dailyKwh, setDailyKwh] = useState<number>(25.0);
  const [psh, setPsh] = useState<number>(4.8);
  const [panelWattage, setPanelWattage] = useState<number>(550);
  const [lossFactor, setLossFactor] = useState<number>(0.14);
  const [safetyMargin, setSafetyMargin] = useState<number>(0.15);

  const result: SharedCalculationResult = calculateSolarPanelSizing({
    dailyEnergyDemandKwh: dailyKwh,
    peakSunHours: psh,
    panelWattage: panelWattage,
    systemLossFactor: lossFactor,
    designMargin: safetyMargin,
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
              Calculate total array capacity (kWp), module count, and roof footprint across Nigeria.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-[#00490e] hover:bg-[#003006] text-white font-semibold px-6 py-3.5 rounded-full text-sm shadow-md transition-all hover:scale-105"
          >
            <Play size={18} className="fill-white" />
            <span>Launch Panel Sizer Wizard</span>
          </button>
        </div>

        {/* Interactive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left: Inputs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white/90 backdrop-blur-md border border-stone-200 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#00490e] mb-5 flex items-center gap-2 border-b border-stone-100 pb-3">
                <Sliders className="w-5 h-5 text-[#00490e]" />
                Solar Array Parameters
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Target Daily Energy (kWh/day)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    step={0.5}
                    value={dailyKwh}
                    onChange={(e) => setDailyKwh(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-base"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Location (Peak Sun Hours)
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
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Selected Module Rating (Watts)
                  </label>
                  <select
                    value={panelWattage}
                    onChange={(e) => setPanelWattage(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-sm"
                  >
                    <option value={550}>550W Tier-1 Mono-PERC (Standard)</option>
                    <option value={580}>580W N-Type TOPCon (High Efficiency)</option>
                    <option value={600}>600W Commercial Bifacial</option>
                    <option value={450}>450W Compact Residential</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    System Loss Factor (Dust & Wiring: 14%)
                  </label>
                  <input
                    type="range"
                    min={0.05}
                    max={0.25}
                    step={0.01}
                    value={lossFactor}
                    onChange={(e) => setLossFactor(Number(e.target.value))}
                    className="w-full accent-[#00490e]"
                  />
                  <div className="flex justify-between text-[11px] text-stone-500 font-semibold">
                    <span>5% (Lab Clean)</span>
                    <span className="text-[#00490e] font-bold">{(lossFactor * 100).toFixed(0)}%</span>
                    <span>25% (Heavy Harmattan)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Results Summary */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-white via-[#f4fbf5] to-[#e8f6ea] border border-emerald-200/80 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 block mb-1">
                  Required Solar Array
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold text-[#00490e] tracking-tight">
                    {resData.recommendedSolarCapacityKwp ?? resData.calculatedArrayKwp ?? 0}
                  </span>
                  <span className="text-lg font-bold text-stone-600">kWp</span>
                </div>
                <p className="text-xs text-stone-500 font-semibold mt-2">
                  Total Array DC Power
                </p>
              </div>

              <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                <span className="text-xs font-bold uppercase tracking-widest text-stone-500 block mb-1">
                  Total Modules
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold text-stone-900 tracking-tight">
                    {resData.calculatedPanelCount ?? resData.moduleCount ?? 0}
                  </span>
                  <span className="text-lg font-bold text-stone-500">Panels</span>
                </div>
                <p className="text-xs text-stone-500 font-semibold mt-2">
                  @ {panelWattage}W per panel
                </p>
              </div>

              <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                <span className="text-xs font-bold uppercase tracking-widest text-stone-500 block mb-1">
                  Est. Roof Footprint
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold text-stone-900 tracking-tight">
                    {resData.estimatedRoofAreaSqM ?? resData.roofAreaSqM ?? 0}
                  </span>
                  <span className="text-lg font-bold text-stone-500">m²</span>
                </div>
                <p className="text-xs text-stone-500 font-semibold mt-2">
                  Unshaded roof surface
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
              href="/tools/pv-configuration"
              className="w-full bg-[#00490e] hover:bg-[#003006] text-white font-semibold py-4 rounded-full text-sm shadow-md transition-all flex items-center justify-center gap-2 group"
            >
              Configure PV Strings for these Panels
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
                {i === 0 ? <Sun size={20} /> : i === 1 ? <Layers size={20} /> : <MapPin size={20} />}
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

      {/* Modal Wizard */}
      <SolarPanelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}
