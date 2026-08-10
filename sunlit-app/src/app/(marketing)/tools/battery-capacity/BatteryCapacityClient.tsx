'use client';

import React, { useState } from 'react';
import { calculateBatteryCapacity } from '@/lib/engineering/calculators/batteryCapacity';
import { SharedCalculationResult } from '@/lib/engineering/types';
import { BatteryCapacityModal } from '@/shared/components/tools/battery-capacity/BatteryCapacityModal';
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
  Play, Battery, Zap, Sliders, ArrowRight, Cpu
} from 'lucide-react';
import Link from 'next/link';

const content = TOOLS_CONTENT['battery-capacity'];

export function BatteryCapacityClient() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [dailyKwh, setDailyKwh] = useState<number>(20.0);
  const [autonomyDays, setAutonomyDays] = useState<number>(1.0);
  const [dod, setDod] = useState<number>(0.8);
  const [dcVoltage, setDcVoltage] = useState<12 | 24 | 48>(48);
  const [inverterEff, setInverterEff] = useState<number>(0.92);

  const result: SharedCalculationResult = calculateBatteryCapacity({
    dailyEnergyKwh: dailyKwh,
    daysOfAutonomy: autonomyDays,
    depthOfDischargePercent: dod * 100,
    systemVoltage: dcVoltage,
    inverterEfficiency: inverterEff,
    chemistry: dod > 0.6 ? 'LITHIUM_LIFEPO4' : 'TUBULAR_GEL',
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
              Size lithium LiFePO4 or gel battery banks for reliable blackout protection.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-[#00490e] hover:bg-[#003006] text-white font-semibold px-6 py-3.5 rounded-full text-sm shadow-md transition-all hover:scale-105"
          >
            <Play size={18} className="fill-white" />
            <span>Launch Battery Sizer Wizard</span>
          </button>
        </div>

        {/* Interactive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left: Input Parameters */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white/90 backdrop-blur-md border border-stone-200 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#00490e] mb-5 flex items-center gap-2 border-b border-stone-100 pb-3">
                <Sliders className="w-5 h-5 text-[#00490e]" />
                Storage Parameters
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Daily Energy Demand (kWh/day)
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
                    Autonomy Days (Outage Coverage)
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
                    Battery Chemistry & Depth of Discharge (DoD)
                  </label>
                  <select
                    value={dod}
                    onChange={(e) => setDod(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-sm"
                  >
                    <option value={0.8}>Lithium LiFePO4 (80% DoD — 6,000 Cycles)</option>
                    <option value={0.9}>Lithium Premium (90% DoD)</option>
                    <option value={0.5}>Tubular Gel Lead-Acid (50% DoD)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    System DC Bus Voltage
                  </label>
                  <select
                    value={dcVoltage}
                    onChange={(e) => setDcVoltage(Number(e.target.value) as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-sm"
                  >
                    <option value={48}>48V DC (Standard Residential & Commercial)</option>
                    <option value={24}>24V DC (Small Cabin / Telecom)</option>
                    <option value={12}>12V DC (Mini Backup)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Results Summary */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-white via-[#f4fbf5] to-[#e8f6ea] border border-emerald-200/80 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 block mb-1">
                  Installed Storage Capacity
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-5xl font-extrabold text-[#00490e] tracking-tight">
                    {resData.recommendedInstalledCapacityKwh ?? 0}
                  </span>
                  <span className="text-xl font-bold text-stone-600">kWh</span>
                </div>
                <p className="text-xs text-stone-500 font-semibold mt-2">
                  Usable Energy: {resData.usableCapacityKwh ?? 0} kWh @ {dod * 100}% DoD
                </p>
              </div>

              <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                <span className="text-xs font-bold uppercase tracking-widest text-stone-500 block mb-1">
                  Bank Capacity in Amp-Hours
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-5xl font-extrabold text-stone-900 tracking-tight">
                    {resData.totalAmpHoursAh ?? 0}
                  </span>
                  <span className="text-xl font-bold text-stone-500">Ah</span>
                </div>
                <p className="text-xs text-stone-500 font-semibold mt-2">
                  @ {dcVoltage}V DC Bus Configuration
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
              href="/tools/inverter-sizing"
              className="w-full bg-[#00490e] hover:bg-[#003006] text-white font-semibold py-4 rounded-full text-sm shadow-md transition-all flex items-center justify-center gap-2 group"
            >
              Size Inverter for this Battery Bank
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
                {i === 0 ? <Battery size={20} /> : i === 1 ? <Zap size={20} /> : <Cpu size={20} />}
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
      <BatteryCapacityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}
