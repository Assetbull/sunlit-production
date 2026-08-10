'use client';

import { useState } from 'react';
import { calculateSolarPanelSizing } from '@/lib/engineering/calculators/solarPanelSizing';
import { SharedCalculationResult } from '@/lib/engineering/types';
import { ToolHeader } from '@/shared/components/tools/ToolHeader';
import { ConfidenceIndicator } from '@/shared/components/tools/ConfidenceIndicator';
import { EngineeringNotes } from '@/shared/components/tools/EngineeringNotes';
import { EngineeringReport } from '@/shared/components/tools/EngineeringReport';
import { UnlockReportCTA } from '@/shared/components/tools/UnlockReportCTA';
import { PublicWaitlistForm } from '@/shared/components/tools/PublicWaitlistForm';
import { RelatedToolsList } from '@/shared/components/tools/RelatedToolsList';
import {
  Sun, ArrowRight, ShieldCheck, Zap, AlertTriangle, CheckCircle2, Sliders, MapPin, Grid, Layers, Info
} from 'lucide-react';
import Link from 'next/link';

export function SolarPanelSizingClient() {
  const [dailyKwh, setDailyKwh] = useState<number>(25);
  const [psh, setPsh] = useState<number>(4.8);
  const [locationName, setLocationName] = useState<string>('Lagos');
  const [panelWattage, setPanelWattage] = useState<number>(550);
  const [systemLosses, setSystemLosses] = useState<number>(0.82);
  const [targetOffset, setTargetOffset] = useState<number>(100);
  const [showReport, setShowReport] = useState<boolean>(false);

  const result: SharedCalculationResult = calculateSolarPanelSizing({
    dailyEnergyDemandKwh: dailyKwh,
    peakSunHours: psh,
    panelWattage,
    systemLossesFactor: systemLosses,
    targetSolarOffsetPercent: targetOffset,
    location: locationName,
  });

  const isSuccess = result.calculation_status === 'SUCCESS';
  const resData = result.engineering_results;

  const handleLocationChange = (val: number, name: string) => {
    setPsh(val);
    setLocationName(name);
  };

  return (
    <main className="bg-[#fcf9f8] text-[#1b1c1c] font-sans min-h-screen pb-24 antialiased">
      <ToolHeader
        title="Solar Panel Sizing Tool"
        category="Photovoltaic Generation & Capacity"
        description="Calculate total array capacity (kWp), panel module count, and roof area requirement based on regional peak sun hours in Nigeria."
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-8">
        {/* Stitch Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 border-b border-stone-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Stitch Visual DNA Engine
              </span>
              <span className="text-xs text-stone-500 font-medium">• Solar Sizing V2.4</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#00490e] tracking-tight">
              Preliminary Sizing Results
            </h1>
            <p className="text-stone-600 text-sm sm:text-base mt-1">
              Photovoltaic generation capacity, panel module quantity, and unshaded roof area estimation.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setShowReport(!showReport)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#00490e] hover:bg-emerald-900 text-white font-semibold px-5 py-3 rounded-full text-sm shadow-sm transition-all"
            >
              <ShieldCheck size={18} />
              {showReport ? 'Hide Engineering Report' : 'Generate Engineering Report'}
            </button>
          </div>
        </div>

        {/* Validation Errors */}
        {result.calculation_status === 'VALIDATION_ERROR' && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-900 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">Validation Error</h4>
              <ul className="list-disc list-inside text-xs mt-1 space-y-0.5 text-red-700">
                {result.validation_status?.errors?.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Main Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Inputs */}
          <div className="lg:col-span-5 space-y-6">
            {/* Energy Demand & Location */}
            <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#00490e] mb-5 flex items-center gap-2 border-b border-stone-100 pb-3">
                <Sun className="w-5 h-5 text-amber-500 fill-amber-400" />
                Energy Demand & Site Irradiance
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Daily Energy Demand Target
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      max={2000}
                      step={1}
                      value={dailyKwh}
                      onChange={(e) => setDailyKwh(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-base"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-stone-400">
                      kWh/day
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    Regional Irradiance (Location)
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  </label>
                  <select
                    value={psh}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      const names: Record<number, string> = { 4.8: 'Lagos', 5.2: 'Abuja', 6.0: 'Kano', 4.5: 'Port Harcourt', 4.9: 'Ibadan', 5.6: 'Jos' };
                      handleLocationChange(val, names[val] || 'Custom');
                    }}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-sm"
                  >
                    <option value={4.8}>Lagos (4.8 kWh/m²/day PSH)</option>
                    <option value={5.2}>Abuja (5.2 kWh/m²/day PSH)</option>
                    <option value={6.0}>Kano (6.0 kWh/m²/day PSH)</option>
                    <option value={4.5}>Port Harcourt (4.5 kWh/m²/day PSH)</option>
                    <option value={4.9}>Ibadan (4.9 kWh/m²/day PSH)</option>
                    <option value={5.6}>Jos (5.6 kWh/m²/day PSH)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Target Solar Offset
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={20}
                      max={100}
                      step={5}
                      value={targetOffset}
                      onChange={(e) => setTargetOffset(Number(e.target.value))}
                      className="w-full accent-[#00490e] h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="font-mono font-bold text-stone-900 min-w-[4ch] text-sm">
                      {targetOffset}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hardware & Loss Parameters */}
            <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#00490e] mb-5 flex items-center gap-2 border-b border-stone-100 pb-3">
                <Layers className="w-5 h-5 text-[#00490e]" />
                Module Specs & Derating
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Solar Panel STC Rating
                  </label>
                  <select
                    value={panelWattage}
                    onChange={(e) => setPanelWattage(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-sm"
                  >
                    <option value={550}>550W Mono PERC Half-Cell (Standard Tier-1)</option>
                    <option value={600}>600W N-Type TOPCon High Efficiency</option>
                    <option value={700}>700W Ultra High Power Bifacial</option>
                    <option value={450}>450W Compact Roof Module</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    System Losses Factor (Derating)
                  </label>
                  <select
                    value={systemLosses}
                    onChange={(e) => setSystemLosses(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-sm"
                  >
                    <option value={0.82}>0.82 (18% losses — tropical dust, wiring, temp derating)</option>
                    <option value={0.85}>0.85 (15% losses — optimized MPPT, clean panels)</option>
                    <option value={0.78}>0.78 (22% losses — high ambient heat / severe soiling)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Output & Metric Cards */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary Metric Card: Estimated System Size */}
            <div className="bg-gradient-to-br from-white via-[#f4fbf5] to-[#e8f6ea] border border-emerald-200/80 rounded-3xl p-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 block mb-2">
                Estimated System Capacity
              </span>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-6">
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl sm:text-6xl font-extrabold text-[#00490e] tracking-tight">
                      {resData.actualArrayKwp ?? resData.requiredArrayKwp ?? 0}
                    </span>
                    <span className="text-2xl font-bold text-stone-600">kWp</span>
                  </div>
                  <div className="text-xs text-emerald-800 font-semibold mt-2 flex items-center gap-1.5">
                    <CheckCircle2 size={16} className="text-emerald-700" />
                    Offsets {resData.coveragePercent ?? targetOffset}% of {dailyKwh} kWh/day demand in {locationName}
                  </div>
                </div>

                <div className="bg-white/90 border border-emerald-200 rounded-2xl p-4 flex gap-4 text-xs">
                  <div>
                    <span className="text-stone-500 font-medium block mb-0.5">Module Count</span>
                    <span className="font-bold text-stone-900 text-base">{resData.recommendedPanelCount ?? 0} Panels</span>
                  </div>
                  <div className="w-px bg-stone-200" />
                  <div>
                    <span className="text-stone-500 font-medium block mb-0.5">Roof Area</span>
                    <span className="font-bold text-stone-900 text-base">{resData.estimatedRoofAreaM2 ?? 0} m²</span>
                  </div>
                </div>
              </div>

              {/* Progress bar representing target offset */}
              <div className="space-y-1.5 border-t border-emerald-200/60 pt-4">
                <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#00490e] h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, resData.coveragePercent ?? targetOffset)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-semibold text-stone-500">
                  <span>Daily Demand: {dailyKwh} kWh/day</span>
                  <span>Est. Daily Gen: {resData.estimatedDailyGenerationKwh ?? 0} kWh/day</span>
                </div>
              </div>
            </div>

            {/* Secondary Metric Grid: Daily Generation & Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-sm text-stone-900">Avg Daily Generation</h3>
                  <Zap className="w-5 h-5 text-amber-500 fill-amber-400" />
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-extrabold text-[#00490e]">
                    {resData.estimatedDailyGenerationKwh ?? 0}
                  </span>
                  <span className="text-xs font-bold text-stone-500">kWh/day</span>
                </div>
                <div className="space-y-2 text-xs border-t border-stone-100 pt-3 text-stone-600">
                  <div className="flex justify-between">
                    <span>Peak Season (Dry):</span>
                    <span className="font-bold text-stone-900">
                      {resData.actualArrayKwp ? Number((resData.actualArrayKwp * (psh + 0.8) * systemLosses).toFixed(1)) : 0} kWh
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monsoon / Wet Season:</span>
                    <span className="font-bold text-stone-900">
                      {resData.actualArrayKwp ? Number((resData.actualArrayKwp * (psh - 0.8) * systemLosses).toFixed(1)) : 0} kWh
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-sm text-stone-900">Roof Area & Array Layout</h3>
                  <Grid className="w-5 h-5 text-[#00490e]" />
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-extrabold text-[#00490e]">
                    {resData.estimatedRoofAreaM2 ?? 0}
                  </span>
                  <span className="text-xs font-bold text-stone-500">m² unshaded</span>
                </div>
                <div className="space-y-2 text-xs border-t border-stone-100 pt-3 text-stone-600">
                  <div className="flex justify-between">
                    <span>Total Panels:</span>
                    <span className="font-bold text-stone-900">{resData.recommendedPanelCount} × {panelWattage}W</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Footprint sq. ft:</span>
                    <span className="font-bold text-stone-900">
                      {resData.estimatedRoofAreaM2 ? Math.round(resData.estimatedRoofAreaM2 * 10.764) : 0} sq ft
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Tool Navigation CTA */}
            <Link
              href="/tools/pv-configuration"
              className="w-full bg-[#00490e] hover:bg-emerald-900 text-white font-semibold py-4 rounded-full text-sm shadow-md transition-all flex items-center justify-center gap-2 group"
            >
              Proceed to PV String Layout Configurator
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Confidence Rating & Supporting Notes */}
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
          </div>
        </div>

        {/* Full Engineering Report Modal/Section */}
        {showReport && isSuccess && (
          <div className="mt-12 pt-8 border-t border-stone-200">
            <EngineeringReport
              toolTitle="Solar Panel Sizing Calculator"
              toolId="solar-panel-sizing"
              result={result}
              inputSummary={[
                { label: 'Daily Energy Demand', value: dailyKwh, unit: 'kWh/day' },
                { label: 'Location (PSH)', value: `${locationName} (${psh} h/day)` },
                { label: 'Panel Wattage', value: panelWattage, unit: 'W' },
                { label: 'System Loss Factor', value: `${Math.round((1 - systemLosses) * 100)}%` },
                { label: 'Target Offset', value: `${targetOffset}%` },
              ]}
              calculationSummary={[
                { label: 'Installed Array Capacity', value: resData.actualArrayKwp ?? resData.requiredArrayKwp, unit: 'kWp' },
                { label: 'Required Panel Count', value: resData.recommendedPanelCount, unit: 'modules' },
                { label: 'Estimated Roof Area', value: resData.estimatedRoofAreaM2, unit: 'm²' },
                { label: 'Daily Estimated Generation', value: resData.estimatedDailyGenerationKwh, unit: 'kWh/day' },
                { label: 'Demand Coverage', value: resData.coveragePercent, unit: '%' },
              ]}
              engineeringChecks={[
                { label: 'Demand Coverage', value: `${resData.coveragePercent}%`, check: (resData.coveragePercent ?? 0) >= 90 ? 'PASS' : 'WARNING' },
                { label: 'Irradiance Adequacy', value: `${psh} h/day`, check: psh >= 4.0 ? 'PASS' : 'WARNING' },
              ]}
              nextToolHref="/tools/pv-configuration"
              nextToolLabel="PV String Layout Configurator"
            />
          </div>
        )}

        <UnlockReportCTA />
        <PublicWaitlistForm interestedTool="Solar Panel Sizing Tool" />
        <RelatedToolsList currentToolId="solar-panel-sizing" />
      </div>
    </main>
  );
}
