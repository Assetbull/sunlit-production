'use client';

import React, { useState } from 'react';
import { calculateLoad } from '@/lib/engineering/calculators/loadCalculator';
import { SharedCalculationResult } from '@/lib/engineering/types';
import { ApplianceLoadModal } from '@/shared/components/tools/appliance-load/ApplianceLoadModal';
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
  Play, Zap, Gauge, ArrowRight, Sliders
} from 'lucide-react';
import Link from 'next/link';

const content = TOOLS_CONTENT['load-calculator'];

interface LocalAppliance {
  name: string;
  category: 'Cooling' | 'Lighting' | 'HVAC' | 'Utilities' | 'Entertainment' | 'Computing' | 'Kitchen' | 'General';
  watts: number;
  qty: number;
  hours: number;
  surgeMultiplier: number;
}

const DEFAULT_APPLIANCES: LocalAppliance[] = [
  { name: '1.5HP Inverter AC', category: 'Cooling', watts: 1100, qty: 2, hours: 8, surgeMultiplier: 1.8 },
  { name: 'Double Door Refrigerator', category: 'Kitchen', watts: 250, qty: 1, hours: 14, surgeMultiplier: 3.0 },
  { name: 'Water Pumping Machine (1HP)', category: 'Utilities', watts: 750, qty: 1, hours: 1, surgeMultiplier: 3.5 },
  { name: 'Smart TV (55")', category: 'Entertainment', watts: 120, qty: 2, hours: 6, surgeMultiplier: 1.0 },
  { name: 'LED Lighting Points', category: 'Lighting', watts: 15, qty: 12, hours: 8, surgeMultiplier: 1.0 },
  { name: 'Laptops & Workstations', category: 'Computing', watts: 80, qty: 2, hours: 8, surgeMultiplier: 1.0 },
];

export function LoadCalculatorClient() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [appliances, setAppliances] = useState<LocalAppliance[]>(DEFAULT_APPLIANCES);

  const updateQty = (idx: number, newQty: number) => {
    const next = [...appliances];
    next[idx].qty = Math.max(0, newQty);
    setAppliances(next);
  };

  const updateHours = (idx: number, newHours: number) => {
    const next = [...appliances];
    next[idx].hours = Math.min(24, Math.max(0, newHours));
    setAppliances(next);
  };

  const loadItems = appliances
    .filter((a) => a.qty > 0)
    .map((a) => ({
      name: a.name,
      powerWatts: a.watts,
      quantity: a.qty,
      hoursPerDay: a.hours,
      category: a.category,
      surgeMultiplier: a.surgeMultiplier,
      dutyCycle: 0.85,
    }));

  const result: SharedCalculationResult = calculateLoad({
    items: loadItems.length > 0 ? loadItems : [
      {
        name: 'Baseline Lighting',
        powerWatts: 100,
        quantity: 1,
        hoursPerDay: 1,
        category: 'Lighting',
        surgeMultiplier: 1.0,
      }
    ],
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
              Itemize connected equipment, continuous running wattage, and motor startup multipliers.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-[#00490e] hover:bg-[#003006] text-white font-semibold px-6 py-3.5 rounded-full text-sm shadow-md transition-all hover:scale-105"
          >
            <Play size={18} className="fill-white" />
            <span>Launch Appliance Load Wizard</span>
          </button>
        </div>

        {/* Interactive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left Column: Appliance Inventory List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white/90 backdrop-blur-md border border-stone-200 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
                <h2 className="text-lg font-bold text-[#00490e] flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-[#00490e]" />
                  Appliance Inventory
                </h2>
                <span className="text-xs text-stone-500 font-semibold">
                  {appliances.filter((a) => a.qty > 0).length} Active Categories
                </span>
              </div>

              <div className="space-y-3">
                {appliances.map((app, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-stone-50/70 border border-stone-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-sm text-stone-900 flex items-center gap-2">
                        {app.name}
                        {app.surgeMultiplier > 1.5 && (
                          <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                            {app.surgeMultiplier}× Surge
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-stone-500">
                        {app.watts}W per unit • {app.category}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <label className="text-xs text-stone-500 font-medium">Qty:</label>
                        <input
                          type="number"
                          min={0}
                          max={50}
                          value={app.qty}
                          onChange={(e) => updateQty(idx, Number(e.target.value))}
                          className="w-14 bg-white border border-stone-300 rounded-lg px-2 py-1 text-xs font-bold text-center text-stone-900"
                        />
                      </div>

                      <div className="flex items-center gap-1.5">
                        <label className="text-xs text-stone-500 font-medium">Hrs/day:</label>
                        <input
                          type="number"
                          min={0}
                          max={24}
                          value={app.hours}
                          onChange={(e) => updateHours(idx, Number(e.target.value))}
                          className="w-14 bg-white border border-stone-300 rounded-lg px-2 py-1 text-xs font-bold text-center text-stone-900"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Calculated Load Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-white via-[#f4fbf5] to-[#e8f6ea] border border-emerald-200/80 rounded-3xl p-6 shadow-sm relative overflow-hidden">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 block mb-1">
                Total Daily Energy Demand
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-5xl font-extrabold text-[#00490e] tracking-tight">
                  {resData.dailyEnergyDemandKwh ?? 0}
                </span>
                <span className="text-xl font-bold text-stone-600">kWh/day</span>
              </div>
              <p className="text-xs text-stone-500 font-semibold mt-2">
                Continuous Running Load: {resData.continuousLoadWatts ? (resData.continuousLoadWatts / 1000).toFixed(1) : 0} kW
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-widest text-stone-500 block mb-1">
                  Connected Power
                </span>
                <div className="text-2xl font-extrabold text-stone-900">
                  {resData.totalConnectedWatts ? (resData.totalConnectedWatts / 1000).toFixed(1) : 0} <span className="text-sm font-normal text-stone-500">kW</span>
                </div>
              </div>

              <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-700 block mb-1">
                  Peak Surge
                </span>
                <div className="text-2xl font-extrabold text-amber-900">
                  {resData.peakSurgeWatts ? (resData.peakSurgeWatts / 1000).toFixed(1) : 0} <span className="text-sm font-normal text-stone-500">kVA</span>
                </div>
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
              href={`/tools/inverter-sizing`}
              className="w-full bg-[#00490e] hover:bg-[#003006] text-white font-semibold py-4 rounded-full text-sm shadow-md transition-all flex items-center justify-center gap-2 group"
            >
              Proceed to Inverter Sizing Calculator
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
                {i === 0 ? <Zap size={20} /> : i === 1 ? <Gauge size={20} /> : <ArrowRight size={20} />}
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
      <ApplianceLoadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}
