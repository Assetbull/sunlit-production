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
import {
  Sun, ArrowRight, ShieldCheck, CheckCircle2, Sliders, MapPin, Zap, Activity, Compass, Gauge
} from 'lucide-react';
import Link from 'next/link';

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
    { month: 'J', yieldKwh: Math.round((resData.estimatedAnnualYieldKwh ?? 12450) * 0.085) },
    { month: 'F', yieldKwh: Math.round((resData.estimatedAnnualYieldKwh ?? 12450) * 0.090) },
    { month: 'M', yieldKwh: Math.round((resData.estimatedAnnualYieldKwh ?? 12450) * 0.095) },
    { month: 'A', yieldKwh: Math.round((resData.estimatedAnnualYieldKwh ?? 12450) * 0.092) },
    { month: 'M', yieldKwh: Math.round((resData.estimatedAnnualYieldKwh ?? 12450) * 0.085) },
    { month: 'J', yieldKwh: Math.round((resData.estimatedAnnualYieldKwh ?? 12450) * 0.075) },
    { month: 'J', yieldKwh: Math.round((resData.estimatedAnnualYieldKwh ?? 12450) * 0.070) },
    { month: 'A', yieldKwh: Math.round((resData.estimatedAnnualYieldKwh ?? 12450) * 0.072) },
    { month: 'S', yieldKwh: Math.round((resData.estimatedAnnualYieldKwh ?? 12450) * 0.080) },
    { month: 'O', yieldKwh: Math.round((resData.estimatedAnnualYieldKwh ?? 12450) * 0.085) },
    { month: 'N', yieldKwh: Math.round((resData.estimatedAnnualYieldKwh ?? 12450) * 0.088) },
    { month: 'D', yieldKwh: Math.round((resData.estimatedAnnualYieldKwh ?? 12450) * 0.093) },
  ];

  return (
    <main className="bg-[#f8f9ff] text-[#0b1c30] font-sans min-h-screen pb-24 antialiased">
      <ToolHeader
        title="Solar Energy Yield Estimator"
        category="Solar Production & Generation Forecasting"
        description="Estimate daily (kWh), annual (MWh), and 25-year cumulative clean solar generation for PV array systems across Nigeria."
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-8">
        {/* Stitch Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 border-b border-stone-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Stitch Visual DNA Engine
              </span>
              <span className="text-xs text-stone-500 font-medium">• Energy Yield Report V2.4</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#00490e] tracking-tight">
              Your yield report is ready.
            </h1>
            <p className="text-stone-600 text-sm sm:text-base mt-1">
              A comprehensive summary of your solar energy production model and 25-year lifetime generation curve.
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

        {/* Main Bento Grid Report Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Inputs Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#00490e] mb-5 flex items-center gap-2 border-b border-stone-100 pb-3">
                <Sliders className="w-5 h-5 text-[#00490e]" />
                System & Resource Inputs
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Installed Array Peak Capacity (kWp)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0.5}
                      max={1000}
                      step={0.5}
                      value={systemKwp}
                      onChange={(e) => setSystemKwp(Math.max(0.1, Number(e.target.value)))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-base"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-stone-400">
                      kWp
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Regional Peak Sun Hours (Location)
                  </label>
                  <select
                    value={psh}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setPsh(val);
                      const names: Record<number, string> = { 4.8: 'Lagos', 5.2: 'Abuja', 6.0: 'Kano', 4.5: 'Port Harcourt', 4.9: 'Ibadan', 5.6: 'Jos' };
                      setLocationName(names[val] || 'Custom');
                    }}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-sm"
                  >
                    <option value={4.8}>Lagos (4.8 PSH)</option>
                    <option value={5.2}>Abuja (5.2 PSH)</option>
                    <option value={6.0}>Kano (6.0 PSH)</option>
                    <option value={4.5}>Port Harcourt (4.5 PSH)</option>
                    <option value={4.9}>Ibadan (4.9 PSH)</option>
                    <option value={5.6}>Jos (5.6 PSH)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Performance Ratio (PR)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={0.70}
                      max={0.90}
                      step={0.01}
                      value={performanceRatio}
                      onChange={(e) => setPerformanceRatio(Number(e.target.value))}
                      className="w-full accent-[#00490e] h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="font-mono font-bold text-stone-900 min-w-[5ch] text-sm">
                      {Math.round(performanceRatio * 100)}%
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Array Orientation & Tilt
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={orientation}
                      onChange={(e) => setOrientation(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-xs"
                    >
                      <option value="SOUTH">True South</option>
                      <option value="SOUTH_WEST">South West</option>
                      <option value="EAST_WEST">East-West</option>
                    </select>
                    <input
                      type="number"
                      min={0}
                      max={45}
                      value={tiltDeg}
                      onChange={(e) => setTiltDeg(Number(e.target.value))}
                      placeholder="Tilt °"
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Metrics & Production Chart Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Key Metrics Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Annual Yield</span>
                  <Zap className="w-5 h-5 text-[#00490e]" />
                </div>
                <div className="text-3xl font-extrabold text-[#00490e] mb-1">
                  {resData.estimatedAnnualYieldKwh?.toLocaleString() ?? 0}
                </div>
                <div className="text-xs font-semibold text-stone-500 font-mono">kWh / year</div>
              </div>

              <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Specific Yield</span>
                  <Gauge className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-3xl font-extrabold text-blue-900 mb-1">
                  {resData.specificYieldKwhPerKwp ?? 0}
                </div>
                <div className="text-xs font-semibold text-stone-500 font-mono">kWh/kWp/year</div>
              </div>

              <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Performance Ratio</span>
                  <Activity className="w-5 h-5 text-amber-500" />
                </div>
                <div className="text-3xl font-extrabold text-stone-900 mb-1">
                  {Math.round((performanceRatio) * 100)}%
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold text-stone-600">Optimized</span>
                </div>
              </div>
            </div>

            {/* Monthly Production Visual Bar Chart */}
            <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h3 className="font-bold text-base text-[#00490e]">Monthly Projected Production</h3>
                  <p className="text-xs text-stone-500 mt-0.5">Projected kWh output across operational months</p>
                </div>
                <div className="bg-stone-100 text-[#00490e] font-mono font-bold px-3 py-1 rounded-full text-xs">
                  25-Yr Lifetime: {resData.estimated25YearLifetimeMwh ?? 0} MWh
                </div>
              </div>

              {/* Bar Chart Simulation */}
              <div className="h-48 flex items-end justify-between gap-2 pt-8 pb-2 border-b border-stone-200 px-2">
                {monthlyBreakdown.map((item, idx) => {
                  const maxVal = Math.max(...monthlyBreakdown.map(m => m.yieldKwh));
                  const heightPct = Math.round((item.yieldKwh / maxVal) * 100);

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                      <div
                        className="w-full bg-[#00490e] hover:bg-emerald-700 transition-all rounded-t-md relative"
                        style={{ height: `${heightPct}%` }}
                      >
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[10px] font-mono px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                          {item.yieldKwh} kWh
                        </div>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-stone-500">{item.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Next Tool Navigation CTA */}
            <Link
              href="/tools/solar-savings"
              className="w-full bg-[#00490e] hover:bg-emerald-900 text-white font-semibold py-4 rounded-full text-sm shadow-md transition-all flex items-center justify-center gap-2 group"
            >
              Proceed to Solar Savings Calculator
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
              toolTitle="Solar Energy Yield Estimator"
              toolId="energy-yield"
              result={result}
              inputSummary={[
                { label: 'Array Capacity', value: systemKwp, unit: 'kWp' },
                { label: 'Location (PSH)', value: `${locationName} (${psh} h/day)` },
                { label: 'Orientation', value: orientation },
                { label: 'Tilt Angle', value: tiltDeg, unit: '°' },
                { label: 'Performance Ratio', value: `${Math.round(performanceRatio * 100)}%` },
              ]}
              calculationSummary={[
                { label: 'Daily Average Yield', value: resData.estimatedDailyYieldKwh, unit: 'kWh/day' },
                { label: 'Annual Energy Yield', value: resData.estimatedAnnualYieldKwh, unit: 'kWh/yr' },
                { label: '25-Year Cumulative Output', value: resData.estimated25YearLifetimeMwh, unit: 'MWh' },
                { label: 'Specific Yield', value: resData.specificYieldKwhPerKwp, unit: 'kWh/kWp/yr' },
              ]}
              engineeringChecks={[
                { label: 'Performance Ratio Threshold', value: `${Math.round(performanceRatio * 100)}%`, check: performanceRatio >= 0.70 ? 'PASS' : 'WARNING' },
                { label: 'Specific Yield Regional Benchmark', value: `${resData.specificYieldKwhPerKwp} kWh/kWp/yr`, check: (resData.specificYieldKwhPerKwp ?? 0) >= 1200 ? 'PASS' : 'WARNING' },
              ]}
              nextToolHref="/tools/solar-savings"
              nextToolLabel="Solar Savings Calculator"
            />
          </div>
        )}

        <UnlockReportCTA />
        <PublicWaitlistForm interestedTool="Solar Energy Yield Estimator" />
        <RelatedToolsList currentToolId="energy-yield" />
      </div>
    </main>
  );
}
