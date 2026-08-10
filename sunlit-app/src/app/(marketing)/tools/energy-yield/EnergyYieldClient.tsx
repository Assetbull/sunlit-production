'use client';

import { useState } from 'react';
import { calculateEnergyYield } from '@/lib/engineering/calculators/energyYield';
import { SharedCalculationResult } from '@/lib/engineering/types';
import { ToolHeader } from '@/shared/components/tools/ToolHeader';
import { ConfidenceIndicator } from '@/shared/components/tools/ConfidenceIndicator';
import { EngineeringNotes } from '@/shared/components/tools/EngineeringNotes';
import { EngineeringReport } from '@/shared/components/tools/EngineeringReport';
import { UnlockReportCTA } from '@/shared/components/tools/UnlockReportCTA';
import { PublicWaitlistForm } from '@/shared/components/tools/PublicWaitlistForm';
import { RelatedToolsList } from '@/shared/components/tools/RelatedToolsList';
import { EngineeringMethodology } from '@/shared/components/tools/EngineeringMethodology';
import { EngineeringTrust } from '@/shared/components/tools/EngineeringTrust';
import { EngineeringFAQ } from '@/shared/components/tools/EngineeringFAQ';
import { TOOLS_CONTENT } from '@/lib/engineering/marketing/toolsContent';
import {
  Sun, ArrowRight, ShieldCheck, Sliders, MapPin, Activity, Gauge
} from 'lucide-react';
import Link from 'next/link';

const content = TOOLS_CONTENT['energy-yield'];

export function EnergyYieldClient() {
  const [systemKwp, setSystemKwp] = useState<number>(10.0);
  const [psh, setPsh] = useState<number>(4.8);
  const [locationName, setLocationName] = useState<string>('Lagos');
  const [performanceRatio, setPerformanceRatio] = useState<number>(0.842);
  const [orientation, setOrientation] = useState<string>('SOUTH');
  const [tiltDeg, setTiltDeg] = useState<number>(15);
  const [showReport, setShowReport] = useState<boolean>(false);

  const result: SharedCalculationResult = calculateEnergyYield({
    systemCapacityKwp: systemKwp,
    locationPeakSunHours: psh,
    location: locationName,
    performanceRatio,
    orientation,
    tiltDeg,
  });

  const isSuccess = result.calculation_status === 'SUCCESS';
  const resData = result.engineering_results;

  const monthlyBreakdown = [
    { month: 'J', yieldKwh: Math.round((resData.estimatedAnnualYieldKwh ?? 14250) * 0.085) },
    { month: 'F', yieldKwh: Math.round((resData.estimatedAnnualYieldKwh ?? 14250) * 0.090) },
    { month: 'M', yieldKwh: Math.round((resData.estimatedAnnualYieldKwh ?? 14250) * 0.095) },
    { month: 'A', yieldKwh: Math.round((resData.estimatedAnnualYieldKwh ?? 14250) * 0.092) },
    { month: 'M', yieldKwh: Math.round((resData.estimatedAnnualYieldKwh ?? 14250) * 0.085) },
    { month: 'J', yieldKwh: Math.round((resData.estimatedAnnualYieldKwh ?? 14250) * 0.075) },
    { month: 'J', yieldKwh: Math.round((resData.estimatedAnnualYieldKwh ?? 14250) * 0.070) },
    { month: 'A', yieldKwh: Math.round((resData.estimatedAnnualYieldKwh ?? 14250) * 0.072) },
    { month: 'S', yieldKwh: Math.round((resData.estimatedAnnualYieldKwh ?? 14250) * 0.080) },
    { month: 'O', yieldKwh: Math.round((resData.estimatedAnnualYieldKwh ?? 14250) * 0.085) },
    { month: 'N', yieldKwh: Math.round((resData.estimatedAnnualYieldKwh ?? 14250) * 0.088) },
    { month: 'D', yieldKwh: Math.round((resData.estimatedAnnualYieldKwh ?? 14250) * 0.093) },
  ];

  return (
    <main className="bg-[#fff8f5] text-[#1f1b17] font-sans min-h-screen pb-24 antialiased">
      <ToolHeader
        title={content.name}
        category={content.category}
        description={content.heroDescription}
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 border-b border-stone-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#00490e] bg-[#aef4a5]/40 px-2.5 py-0.5 rounded-full border border-[#92d78b]">
                Deterministic Simulation V2.4
              </span>
              <span className="text-xs text-stone-500 font-medium">• {content.tagline}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#00490e] tracking-tight">
              {content.heroHeadline}
            </h1>
            <p className="text-stone-600 text-sm sm:text-base mt-1">
              Estimate daily (kWh), annual (MWh), and specific yield (kWh/kWp/yr) across Nigeria.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setShowReport(!showReport)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#00490e] hover:bg-emerald-900 text-white font-semibold px-5 py-3 rounded-full text-sm shadow-sm transition-all"
            >
              <ShieldCheck size={18} />
              {showReport ? 'Hide Simulation Report' : 'Generate Full Yield Report'}
            </button>
          </div>
        </div>

        {/* Interactive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left: Input Parameters */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/80 backdrop-blur-md border border-stone-200 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#00490e] mb-5 flex items-center gap-2 border-b border-stone-100 pb-3">
                <Sliders className="w-5 h-5 text-[#00490e]" />
                Simulation Parameters
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Location & Irradiance Profile
                  </label>
                  <select
                    value={locationName}
                    onChange={(e) => {
                      const loc = e.target.value;
                      setLocationName(loc);
                      if (loc === 'Lagos') setPsh(4.8);
                      if (loc === 'Abuja') setPsh(5.5);
                      if (loc === 'Kano') setPsh(6.2);
                      if (loc === 'Port Harcourt') setPsh(4.5);
                    }}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-sm"
                  >
                    <option value="Lagos">Lagos (Coastal Tropical — 4.8 PSH)</option>
                    <option value="Abuja">Abuja (Central Savannah — 5.5 PSH)</option>
                    <option value="Kano">Kano (Northern Sahel — 6.2 PSH)</option>
                    <option value="Port Harcourt">Port Harcourt (Niger Delta — 4.5 PSH)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    System Capacity (kWp)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={1000}
                    step={0.5}
                    value={systemKwp}
                    onChange={(e) => setSystemKwp(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-base"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Tilt Angle (°)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={45}
                      value={tiltDeg}
                      onChange={(e) => setTiltDeg(Number(e.target.value))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Orientation
                    </label>
                    <select
                      value={orientation}
                      onChange={(e) => setOrientation(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-sm"
                    >
                      <option value="SOUTH">South (Optimal)</option>
                      <option value="EAST">East</option>
                      <option value="WEST">West</option>
                      <option value="NORTH">North</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    System Performance Ratio (PR)
                  </label>
                  <input
                    type="range"
                    min={0.70}
                    max={0.90}
                    step={0.01}
                    value={performanceRatio}
                    onChange={(e) => setPerformanceRatio(Number(e.target.value))}
                    className="w-full accent-[#00490e]"
                  />
                  <div className="flex justify-between text-[11px] text-stone-500 font-semibold">
                    <span>70% (High Loss)</span>
                    <span className="text-[#00490e] font-bold">{(performanceRatio * 100).toFixed(1)}%</span>
                    <span>90% (Tier-1 Optimum)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Results & Monthly Bar Chart */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-white via-[#f4fbf5] to-[#e8f6ea] border border-emerald-200/80 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 block mb-1">
                  Annual Clean Generation
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold text-[#00490e] tracking-tight">
                    {resData.estimatedAnnualYieldKwh ?? 0}
                  </span>
                  <span className="text-lg font-bold text-stone-600">kWh</span>
                </div>
                <p className="text-xs text-stone-500 font-semibold mt-2">
                  ~{((resData.estimatedAnnualYieldKwh ?? 0) / 1000).toFixed(1)} MWh / year
                </p>
              </div>

              <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                <span className="text-xs font-bold uppercase tracking-widest text-stone-500 block mb-1">
                  Daily Average Output
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold text-stone-900 tracking-tight">
                    {resData.estimatedDailyYieldKwh ?? 0}
                  </span>
                  <span className="text-lg font-bold text-stone-500">kWh</span>
                </div>
                <p className="text-xs text-stone-500 font-semibold mt-2">
                  Based on {psh} PSH average
                </p>
              </div>

              <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                <span className="text-xs font-bold uppercase tracking-widest text-stone-500 block mb-1">
                  Specific Yield
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold text-stone-900 tracking-tight">
                    {resData.specificYieldKwhPerKwp ?? 0}
                  </span>
                  <span className="text-lg font-bold text-stone-500">kWh/kWp</span>
                </div>
                <p className="text-xs text-stone-500 font-semibold mt-2">
                  System productivity index
                </p>
              </div>
            </div>

            {/* Monthly Generation Bar Chart */}
            <div className="bg-white/80 backdrop-blur-md border border-stone-200 rounded-3xl p-6 shadow-sm">
              <h3 className="font-bold text-sm text-[#00490e] uppercase tracking-wider mb-4 flex items-center gap-2">
                <Activity size={16} /> 12-Month Generation Forecast (kWh)
              </h3>
              <div className="grid grid-cols-12 gap-2 h-36 items-end pt-4 border-b border-stone-200 pb-2">
                {monthlyBreakdown.map((m, idx) => {
                  const maxYield = Math.max(...monthlyBreakdown.map((b) => b.yieldKwh));
                  const heightPct = Math.max(15, Math.round((m.yieldKwh / (maxYield || 1)) * 100));
                  return (
                    <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end">
                      <span className="text-[10px] font-mono text-stone-500 font-bold hidden sm:block">
                        {m.yieldKwh}
                      </span>
                      <div
                        style={{ height: `${heightPct}%` }}
                        className="w-full bg-gradient-to-t from-[#00490e] to-[#92d78b] rounded-t-md hover:brightness-110 transition-all cursor-pointer"
                        title={`${m.month}: ${m.yieldKwh} kWh`}
                      />
                      <span className="text-[11px] font-bold text-stone-700">{m.month}</span>
                    </div>
                  );
                })}
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
              href="/tools/solar-savings"
              className="w-full bg-[#00490e] hover:bg-[#003006] text-white font-semibold py-4 rounded-full text-sm shadow-md transition-all flex items-center justify-center gap-2 group"
            >
              Calculate Financial Savings for this Yield
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
                {i === 0 ? <Sun size={20} /> : i === 1 ? <Activity size={20} /> : <Gauge size={20} />}
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

        {/* Full Report */}
        {showReport && isSuccess && (
          <div className="mt-12 pt-8 border-t border-stone-200">
            <EngineeringReport
              toolTitle="Solar Energy Yield Estimator"
              toolId="energy-yield"
              result={result}
              inputSummary={[
                { label: 'System Capacity', value: systemKwp, unit: 'kWp' },
                { label: 'Location', value: locationName },
                { label: 'Peak Sun Hours', value: psh, unit: 'hrs/day' },
                { label: 'Performance Ratio', value: (performanceRatio * 100).toFixed(1), unit: '%' },
                { label: 'Tilt Angle', value: tiltDeg, unit: '°' },
                { label: 'Orientation', value: orientation },
              ]}
              calculationSummary={[
                { label: 'Estimated Annual Yield', value: resData.estimatedAnnualYieldKwh, unit: 'kWh' },
                { label: 'Estimated Daily Yield', value: resData.estimatedDailyYieldKwh, unit: 'kWh' },
                { label: 'Specific Yield', value: resData.specificYieldKwhPerKwp, unit: 'kWh/kWp' },
                { label: '25-Year Cumulative Yield', value: resData.cumulative25YearYieldMwh, unit: 'MWh' },
              ]}
              nextToolHref="/tools/solar-savings"
              nextToolLabel="Solar Financial Savings Analyzer"
            />
          </div>
        )}

        <UnlockReportCTA />
        <PublicWaitlistForm interestedTool={content.name} />
        <RelatedToolsList currentToolId={content.id} />
      </div>
    </main>
  );
}
