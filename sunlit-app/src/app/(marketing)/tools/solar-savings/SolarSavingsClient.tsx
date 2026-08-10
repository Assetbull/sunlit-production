'use client';

import { useState } from 'react';
import { calculateSolarSavings } from '@/lib/engineering/calculators/solarSavings';
import { SharedCalculationResult } from '@/lib/engineering/types';
import { ToolHeader } from '@/shared/components/tools/ToolHeader';
import { ConfidenceIndicator } from '@/shared/components/tools/ConfidenceIndicator';
import { EngineeringNotes } from '@/shared/components/tools/EngineeringNotes';
import { EngineeringReport } from '@/shared/components/tools/EngineeringReport';
import { UnlockReportCTA } from '@/shared/components/tools/UnlockReportCTA';
import { PublicWaitlistForm } from '@/shared/components/tools/PublicWaitlistForm';
import { RelatedToolsList } from '@/shared/components/tools/RelatedToolsList';
import {
  DollarSign, ArrowRight, ShieldCheck, CheckCircle2, Sliders, Zap, Fuel, TrendingUp, AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

export function SolarSavingsClient() {
  const [gridBillNaira, setGridBillNaira] = useState<number>(120000);
  const [dieselBillNaira, setDieselBillNaira] = useState<number>(200000);
  const [tariffBand, setTariffBand] = useState<'BAND_A' | 'BAND_B' | 'BAND_C' | 'BAND_D' | 'BAND_E'>('BAND_A');
  const [capacityKwp, setCapacityKwp] = useState<number>(10.0);
  const [solarOffsetPct, setSolarOffsetPct] = useState<number>(85);
  const [showReport, setShowReport] = useState<boolean>(false);

  const result: SharedCalculationResult = calculateSolarSavings({
    currentMonthlyGridBillNaira: gridBillNaira,
    currentMonthlyDieselBillNaira: dieselBillNaira,
    solarSystemCapacityKwp: capacityKwp,
    tariffBand,
    solarOffsetPercent: solarOffsetPct,
  });

  const isSuccess = result.calculation_status === 'SUCCESS';
  const resData = result.engineering_results;

  const totalMonthlySpend = gridBillNaira + dieselBillNaira;
  const netMonthlyCost = Math.max(0, totalMonthlySpend - (resData.totalMonthlySavingsNaira ?? 0));

  return (
    <main className="bg-[#fff8f5] text-[#1f1b17] font-sans min-h-screen pb-24 antialiased">
      <ToolHeader
        title="Solar Financial Savings Analyzer"
        category="Energy Economics & Cost Reduction"
        description="Calculate monthly and 25-year cumulative financial savings from displacing DISCO grid bills and diesel generator fuel spending."
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-8">
        {/* Stitch Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 border-b border-stone-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Stitch Visual DNA Engine
              </span>
              <span className="text-xs text-stone-500 font-medium">• Financial Model V2.4</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#00490e] tracking-tight">
              Your solar savings report is ready.
            </h1>
            <p className="text-stone-600 text-sm sm:text-base mt-1">
              Professional summary of grid bill displacement, diesel fuel avoidance, and 25-year cash flow savings.
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
          {/* Left Column: Energy Spend Inputs */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/80 backdrop-blur-md border border-stone-200 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#00490e] mb-5 flex items-center gap-2 border-b border-stone-100 pb-3">
                <Sliders className="w-5 h-5 text-[#00490e]" />
                Baseline Energy Spend
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Monthly DISCO Grid Electricity Bill (₦)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={100000000}
                      step={5000}
                      value={gridBillNaira}
                      onChange={(e) => setGridBillNaira(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-base"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-stone-400">
                      ₦
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Monthly Generator Fuel & Maintenance (₦)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={100000000}
                      step={10000}
                      value={dieselBillNaira}
                      onChange={(e) => setDieselBillNaira(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-base"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-stone-400">
                      ₦
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    NERC Tariff Band Classification
                  </label>
                  <select
                    value={tariffBand}
                    onChange={(e) => setTariffBand(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-sm"
                  >
                    <option value="BAND_A">Band A (₦225/kWh — 20+ Hours Grid)</option>
                    <option value="BAND_B">Band B (₦63/kWh — 16-20 Hours Grid)</option>
                    <option value="BAND_C">Band C (₦50/kWh — 12-16 Hours Grid)</option>
                    <option value="BAND_D">Band D (₦45/kWh — 8-12 Hours Grid)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Proposed Solar System Capacity (kWp)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    value={capacityKwp}
                    onChange={(e) => setCapacityKwp(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-base"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Target Displacement Offset (%)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={20}
                      max={100}
                      step={5}
                      value={solarOffsetPct}
                      onChange={(e) => setSolarOffsetPct(Number(e.target.value))}
                      className="w-full accent-[#00490e] h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="font-mono font-bold text-stone-900 min-w-[4ch] text-sm">
                      {solarOffsetPct}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Savings Bento Grid & Financial Report */}
          <div className="lg:col-span-8 space-y-6">
            {/* Top Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Monthly Savings Card */}
              <div className="bg-gradient-to-br from-white via-[#f4fbf5] to-[#e8f6ea] border border-emerald-200/80 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm text-[#00490e] flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-700" /> Monthly Net Savings
                  </h3>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {resData.savingsAsPercentOfBaseline ?? 0}% Offset
                  </span>
                </div>
                <div className="text-4xl font-extrabold text-[#00490e] mb-1">
                  ₦{(resData.totalMonthlySavingsNaira ?? 0).toLocaleString()}
                </div>
                <p className="text-xs text-stone-500 font-medium">
                  Avoided monthly DISCO bill & diesel generator spending
                </p>
              </div>

              {/* 25-Year Lifetime Cumulative Savings Card */}
              <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm text-stone-800 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" /> 25-Year Cumulative Savings
                  </h3>
                  <span className="text-[11px] font-bold text-stone-500 font-mono">12%/yr Infl.</span>
                </div>
                <div className="text-4xl font-extrabold text-stone-900 mb-1">
                  ₦{(resData.cumulative25YearSavingsNaira ?? 0).toLocaleString()}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-semibold text-emerald-800">
                    10-Yr Savings: ₦{(resData.cumulative10YearSavingsNaira ?? 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Financial Cost Breakdown Card */}
            <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
              <h3 className="font-bold text-base text-[#00490e] mb-4 flex items-center gap-2">
                <Fuel className="w-5 h-5 text-[#00490e]" />
                Baseline vs Post-Solar Monthly Expenditure
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between border-b border-stone-100 pb-2">
                  <span className="text-stone-600">Current DISCO Grid Bill:</span>
                  <span className="font-bold text-stone-900">₦{gridBillNaira.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-stone-100 pb-2">
                  <span className="text-stone-600">Current Diesel Fuel Spend:</span>
                  <span className="font-bold text-stone-900">₦{dieselBillNaira.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-stone-100 pb-2">
                  <span className="text-stone-600 font-semibold">Total Baseline Spend:</span>
                  <span className="font-bold text-stone-900">₦{totalMonthlySpend.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-stone-100 pb-2">
                  <span className="text-emerald-800 font-semibold">Solar Displacement Savings (85%):</span>
                  <span className="font-bold text-emerald-800">
                    -₦{(resData.totalMonthlySavingsNaira ?? 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-1 text-sm">
                  <span className="font-extrabold text-[#00490e]">New Post-Solar Monthly Bill:</span>
                  <span className="font-extrabold text-[#00490e]">₦{netMonthlyCost.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Next Tool Navigation CTA */}
            <Link
              href="/tools/roi-calculator"
              className="w-full bg-[#00490e] hover:bg-emerald-900 text-white font-semibold py-4 rounded-full text-sm shadow-md transition-all flex items-center justify-center gap-2 group"
            >
              Proceed to Solar ROI & Payback Calculator
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
              toolTitle="Solar Savings Calculator"
              toolId="solar-savings"
              result={result}
              inputSummary={[
                { label: 'Solar Capacity', value: capacityKwp, unit: 'kWp' },
                { label: 'Monthly Grid Bill', value: `₦${gridBillNaira.toLocaleString()}` },
                { label: 'Monthly Diesel Bill', value: `₦${dieselBillNaira.toLocaleString()}` },
                { label: 'Tariff Band', value: resData.tariffBand ?? 'BAND_A' },
                { label: 'Displacement Offset', value: `${solarOffsetPct}%` },
              ]}
              calculationSummary={[
                { label: 'Monthly Total Savings', value: `₦${(resData.totalMonthlySavingsNaira ?? 0).toLocaleString()}` },
                { label: 'Annual Total Savings', value: `₦${(resData.totalAnnualSavingsNaira ?? 0).toLocaleString()}` },
                { label: '10-Year Savings', value: `₦${(resData.cumulative10YearSavingsNaira ?? 0).toLocaleString()}` },
                { label: '25-Year Lifetime Savings', value: `₦${(resData.cumulative25YearSavingsNaira ?? 0).toLocaleString()}` },
                { label: 'Displacement Percentage', value: `${resData.savingsAsPercentOfBaseline ?? 0}%` },
              ]}
              engineeringChecks={[
                { label: 'Bill Displacement Ratio', value: `${resData.savingsAsPercentOfBaseline}% of current spend`, check: (resData.savingsAsPercentOfBaseline ?? 0) >= 50 ? 'PASS' : 'WARNING' },
                { label: 'Diesel Cost Comparison', value: `₦${resData.dieselCostPerKwhNaira}/kWh vs ₦${resData.gridTariffNairaPerKwh}/kWh grid`, check: 'PASS' },
              ]}
              nextToolHref="/tools/roi-calculator"
              nextToolLabel="Solar ROI & Payback Calculator"
            />
          </div>
        )}

        <UnlockReportCTA />
        <PublicWaitlistForm interestedTool="Solar Savings Calculator" />
        <RelatedToolsList currentToolId="solar-savings" />
      </div>
    </main>
  );
}
