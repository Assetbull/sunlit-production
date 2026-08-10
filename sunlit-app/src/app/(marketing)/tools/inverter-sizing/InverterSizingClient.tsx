'use client';

import { useState } from 'react';
import { calculateInverterSizing } from '@/lib/engineering/calculators/inverterSizing';
import { SharedCalculationResult } from '@/lib/engineering/types';
import { ToolHeader } from '@/shared/components/tools/ToolHeader';
import { ConfidenceIndicator } from '@/shared/components/tools/ConfidenceIndicator';
import { EngineeringNotes } from '@/shared/components/tools/EngineeringNotes';
import { EngineeringReport } from '@/shared/components/tools/EngineeringReport';
import { UnlockReportCTA } from '@/shared/components/tools/UnlockReportCTA';
import { PublicWaitlistForm } from '@/shared/components/tools/PublicWaitlistForm';
import { RelatedToolsList } from '@/shared/components/tools/RelatedToolsList';
import {
  Cpu, ArrowRight, ShieldCheck, Zap, AlertTriangle, CheckCircle2, Sliders, Battery, Info, Cable
} from 'lucide-react';
import Link from 'next/link';

export function InverterSizingClient() {
  const [continuousWatts, setContinuousWatts] = useState<number>(2500);
  const [surgeWatts, setSurgeWatts] = useState<number>(4800);
  const [powerFactor, setPowerFactor] = useState<number>(0.8);
  const [voltage, setVoltage] = useState<48 | 24 | 96 | 192>(48);
  const [growthMargin, setGrowthMargin] = useState<number>(1.20);
  const [inverterType, setInverterType] = useState<'HYBRID' | 'OFF_GRID' | 'GRID_TIED'>('HYBRID');
  const [showReport, setShowReport] = useState<boolean>(false);

  const result: SharedCalculationResult = calculateInverterSizing({
    continuousLoadWatts: continuousWatts,
    surgeLoadWatts: surgeWatts,
    powerFactor,
    growthMargin,
    inverterType,
    systemVoltage: voltage,
  });

  const isSuccess = result.calculation_status === 'SUCCESS';
  const resData = result.engineering_results;

  const dcCurrent = resData.recommendedActiveKw && voltage
    ? Math.round(((resData.recommendedActiveKw * 1000) / voltage) / 0.92)
    : 0;

  return (
    <main className="bg-[#fcf9f8] text-[#1b1c1c] font-sans min-h-screen pb-24 antialiased">
      <ToolHeader
        title="Inverter Sizing Calculator"
        category="Power Inverter & Conversion Sizing"
        description="Configure continuous and surge loads to determine optimal inverter capacity and battery compatibility."
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-8">
        {/* Stitch Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 border-b border-stone-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Stitch Visual DNA Engine
              </span>
              <span className="text-xs text-stone-500 font-medium">• Inverter Sizing V2.4</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#00490e] tracking-tight">
              Inverter Sizing Engine
            </h1>
            <p className="text-stone-600 text-sm sm:text-base mt-1">
              Determine continuous kVA/kW output, surge handling headroom, and DC bus voltage architecture.
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
            {/* Load Profile Card */}
            <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
              <h2 className="text-lg font-bold text-[#00490e] mb-5 flex items-center gap-2 border-b border-stone-100 pb-3">
                <Zap className="w-5 h-5 text-amber-500 fill-amber-400" />
                Load Profile
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Continuous Running Load
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={100}
                      max={100000}
                      step={100}
                      value={continuousWatts}
                      onChange={(e) => {
                        const val = Math.max(1, Number(e.target.value));
                        setContinuousWatts(val);
                        if (surgeWatts < val) setSurgeWatts(val * 1.5);
                      }}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-base"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-stone-400">
                      W
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    Peak Motor Surge Load
                    <Info className="w-3.5 h-3.5 text-stone-400 cursor-help" />
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={continuousWatts}
                      max={300000}
                      step={250}
                      value={surgeWatts}
                      onChange={(e) => setSurgeWatts(Math.max(continuousWatts, Number(e.target.value)))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-base"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-stone-400">
                      W
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-700 select-none">
                    <input
                      type="checkbox"
                      checked={growthMargin > 1.0}
                      onChange={(e) => setGrowthMargin(e.target.checked ? 1.20 : 1.0)}
                      className="rounded border-stone-300 text-[#00490e] focus:ring-[#00490e]"
                    />
                    Factor Future Expansion Safety Margin (20%)
                  </label>
                </div>
              </div>
            </div>

            {/* Battery Integration Parameters */}
            <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#00490e] mb-5 flex items-center gap-2 border-b border-stone-100 pb-3">
                <Battery className="w-5 h-5 text-[#00490e]" />
                System Integration
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    DC Bus Voltage
                  </label>
                  <select
                    value={voltage}
                    onChange={(e) => setVoltage(Number(e.target.value) as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-sm"
                  >
                    <option value={48}>48 VDC (Recommended for 3kVA+)</option>
                    <option value={24}>24 VDC (Medium 1.5kVA - 3kVA)</option>
                    <option value={12}>12 VDC (Basic Entry Level)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    System Power Factor (cos φ)
                  </label>
                  <select
                    value={powerFactor}
                    onChange={(e) => setPowerFactor(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-sm"
                  >
                    <option value={0.8}>0.8 PF (Standard AC Compressor / Motor Loads)</option>
                    <option value={0.9}>0.9 PF (Modern Inverter AC & IT Equipment)</option>
                    <option value={1.0}>1.0 PF (Pure Resistive Lighting & Heating)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Inverter Topology
                  </label>
                  <select
                    value={inverterType}
                    onChange={(e) => setInverterType(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-sm"
                  >
                    <option value="HYBRID">Hybrid Multi-Mode (Solar + Grid + Battery)</option>
                    <option value="OFF_GRID">Off-Grid Pure Sine Wave Transformer</option>
                    <option value="GRID_TIED">Grid-Tied String Inverter</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Output & Logic Cards */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary Result Card */}
            <div className="bg-gradient-to-br from-white via-[#f4fbf5] to-[#e8f6ea] border border-emerald-200/80 rounded-3xl p-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 block mb-2">
                Recommended Inverter Rating
              </span>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-6">
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl sm:text-6xl font-extrabold text-[#00490e] tracking-tight">
                      {resData.recommendedInverterKva ?? 0}
                    </span>
                    <span className="text-xl font-bold text-stone-600">kVA</span>
                    <span className="text-base font-semibold text-stone-500">
                      ({resData.recommendedActiveKw ?? 0} kW)
                    </span>
                  </div>
                  <div className="text-xs text-emerald-800 font-semibold mt-2 flex items-center gap-1.5">
                    <CheckCircle2 size={16} className="text-emerald-700" />
                    Satisfies {continuousWatts}W continuous load with {Math.round((growthMargin - 1) * 100)}% margin
                  </div>
                </div>

                <div className="bg-white/90 border border-emerald-200 rounded-2xl p-3.5 flex gap-4 text-xs">
                  <div>
                    <span className="text-stone-500 font-medium block mb-0.5">Surge Req</span>
                    <span className="font-bold text-stone-900 text-sm">{(surgeWatts / 1000).toFixed(1)} kW</span>
                  </div>
                  <div className="w-px bg-stone-200" />
                  <div>
                    <span className="text-stone-500 font-medium block mb-0.5">DC Current</span>
                    <span className="font-bold text-stone-900 text-sm">{dcCurrent} A</span>
                  </div>
                </div>
              </div>

              {/* Progress Distribution Bar */}
              <div className="space-y-1.5 border-t border-emerald-200/60 pt-4">
                <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden flex">
                  <div
                    className="bg-[#00490e] h-full rounded-l-full"
                    style={{ width: `${Math.min(80, Math.max(20, (continuousWatts / ((resData.recommendedActiveKw ?? 1) * 1000)) * 100))}%` }}
                  />
                  <div
                    className="bg-amber-500 h-full rounded-r-full"
                    style={{ width: `${Math.min(40, Math.max(10, (((growthMargin - 1) * continuousWatts) / ((resData.recommendedActiveKw ?? 1) * 1000)) * 100))}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-semibold text-stone-500">
                  <span>Base Load: {continuousWatts}W</span>
                  <span>Safety Margin: {Math.round((growthMargin - 1) * 100)}%</span>
                  <span>Capacity: {resData.recommendedInverterKva} kVA</span>
                </div>
              </div>
            </div>

            {/* Inverter Logic Grid Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-sm text-stone-900">Surge Handling Logic</h3>
                  <Sliders className="w-5 h-5 text-[#00490e]" />
                </div>
                <p className="text-xs text-stone-600 leading-relaxed mb-4">
                  Peak load of {surgeWatts}W requires an inverter with a surge rating of at least {Math.round(surgeWatts * 1.2)}W for motor starting.
                </p>
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 font-mono text-[11px] text-[#00490e]">
                  Surge Check: {surgeWatts}W ≤ {(resData.recommendedInverterKva ?? 1) * 3000}W peak 5s
                </div>
              </div>

              <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-sm text-stone-900">Voltage Compatibility</h3>
                  <Cable className="w-5 h-5 text-[#00490e]" />
                </div>
                <p className="text-xs text-stone-600 leading-relaxed mb-4">
                  At {resData.recommendedActiveKw}kW continuous output, {voltage}V DC bus keeps battery current draw manageable at ~{dcCurrent}A.
                </p>
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 font-mono text-[11px] text-[#00490e]">
                  Current Draw: ({continuousWatts}W / {voltage}V) / 0.92 = {dcCurrent}A
                </div>
              </div>
            </div>

            {/* Next Tool Navigation CTA */}
            <Link
              href="/tools/solar-panel-sizing"
              className="w-full bg-[#00490e] hover:bg-emerald-900 text-white font-semibold py-4 rounded-full text-sm shadow-md transition-all flex items-center justify-center gap-2 group"
            >
              Proceed to Solar Panel Sizing Tool
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
              toolTitle="Inverter Sizing Calculator"
              toolId="inverter-sizing"
              result={result}
              inputSummary={[
                { label: 'Continuous Load', value: continuousWatts, unit: 'W' },
                { label: 'Surge Load', value: surgeWatts, unit: 'W' },
                { label: 'Power Factor', value: powerFactor },
                { label: 'DC Bus Voltage', value: voltage, unit: 'V DC' },
                { label: 'Safety Margin', value: `${Math.round((growthMargin - 1) * 100)}%` },
                { label: 'Inverter Type', value: inverterType },
              ]}
              calculationSummary={[
                { label: 'Recommended Rating', value: resData.recommendedInverterKva, unit: 'kVA' },
                { label: 'Continuous Active Power', value: resData.recommendedActiveKw, unit: 'kW' },
                { label: 'Minimum Required kVA', value: resData.minimumContinuousKva, unit: 'kVA' },
                { label: 'DC Bus Voltage', value: resData.recommendedDcVoltage, unit: 'V DC' },
              ]}
              engineeringChecks={[
                { label: 'Continuous Power Capacity', value: `${continuousWatts} W ≤ ${(resData.recommendedActiveKw ?? 0) * 1000} W`, check: resData.continuousCheck as 'PASS' | 'FAIL' ?? 'PASS' },
                { label: 'Motor Surge Margin', value: `${surgeWatts} W`, check: resData.surgeCheck as 'PASS' | 'WARNING' ?? 'PASS' },
              ]}
              nextToolHref="/tools/solar-panel-sizing"
              nextToolLabel="Solar Panel Sizing Calculator"
            />
          </div>
        )}

        <UnlockReportCTA />
        <PublicWaitlistForm interestedTool="Inverter Sizing Calculator" />
        <RelatedToolsList currentToolId="inverter-sizing" />
      </div>
    </main>
  );
}
