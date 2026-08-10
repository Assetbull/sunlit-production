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
import { EngineeringMethodology } from '@/shared/components/tools/EngineeringMethodology';
import { EngineeringTrust } from '@/shared/components/tools/EngineeringTrust';
import { EngineeringFAQ } from '@/shared/components/tools/EngineeringFAQ';
import { TOOLS_CONTENT } from '@/lib/engineering/marketing/toolsContent';
import {
  DollarSign, ArrowRight, ShieldCheck, Sliders, Zap, Fuel, TrendingUp
} from 'lucide-react';
import Link from 'next/link';

const content = TOOLS_CONTENT['solar-savings'];

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
        title={content.name}
        category={content.category}
        description={content.heroDescription}
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 border-b border-stone-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Deterministic Model V2.4
              </span>
              <span className="text-xs text-stone-500 font-medium">• {content.tagline}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#00490e] tracking-tight">
              {content.heroHeadline}
            </h1>
            <p className="text-stone-600 text-sm sm:text-base mt-1">
              Quantify financial savings from displacing DISCO grid tariffs and generator diesel fueling in Nigeria.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setShowReport(!showReport)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#00490e] hover:bg-emerald-900 text-white font-semibold px-5 py-3 rounded-full text-sm shadow-sm transition-all"
            >
              <ShieldCheck size={18} />
              {showReport ? 'Hide Savings Report' : 'Generate Full Savings Report'}
            </button>
          </div>
        </div>

        {/* Interactive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left Column: Input Sliders */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white/80 backdrop-blur-md border border-stone-200 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#00490e] mb-5 flex items-center gap-2 border-b border-stone-100 pb-3">
                <Sliders className="w-5 h-5 text-[#00490e]" />
                Current Energy Spending (Monthly)
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Monthly DISCO Grid Bill (₦)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-stone-400">
                      ₦
                    </span>
                    <input
                      type="number"
                      min={0}
                      max={10000000}
                      step={5000}
                      value={gridBillNaira}
                      onChange={(e) => setGridBillNaira(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-9 pr-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Monthly Diesel / Petrol Expense (₦)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-stone-400">
                      ₦
                    </span>
                    <input
                      type="number"
                      min={0}
                      max={20000000}
                      step={10000}
                      value={dieselBillNaira}
                      onChange={(e) => setDieselBillNaira(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-9 pr-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    DISCO Electricity Tariff Band
                  </label>
                  <select
                    value={tariffBand}
                    onChange={(e) => setTariffBand(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-sm"
                  >
                    <option value="BAND_A">Band A (20+ hrs/day — ₦225 / kWh)</option>
                    <option value="BAND_B">Band B (16–20 hrs/day — ₦68 / kWh)</option>
                    <option value="BAND_C">Band C (12–16 hrs/day — ₦52 / kWh)</option>
                    <option value="BAND_D">Band D (8–12 hrs/day — ₦40 / kWh)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Solar Energy Offset Percentage ({solarOffsetPct}%)
                  </label>
                  <input
                    type="range"
                    min={40}
                    max={95}
                    value={solarOffsetPct}
                    onChange={(e) => setSolarOffsetPct(Number(e.target.value))}
                    className="w-full accent-[#00490e]"
                  />
                  <div className="flex justify-between text-[11px] text-stone-500 font-semibold">
                    <span>40% (Partial Offset)</span>
                    <span>95% (Near Off-Grid)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Calculated Savings Summary */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Monthly Savings Card */}
              <div className="bg-gradient-to-br from-white via-[#f4fbf5] to-[#e8f6ea] border border-emerald-200/80 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 block mb-1">
                  Total Monthly Savings
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl sm:text-5xl font-extrabold text-[#00490e] tracking-tight">
                    ₦{(resData.totalMonthlySavingsNaira ?? 0).toLocaleString()}
                  </span>
                  <span className="text-sm font-bold text-stone-600">/mo</span>
                </div>
                <p className="text-xs text-stone-500 font-semibold mt-2">
                  Displaces ~{solarOffsetPct}% of grid & diesel spend
                </p>
              </div>

              {/* Annual Savings Card */}
              <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                <span className="text-xs font-bold uppercase tracking-widest text-stone-500 block mb-1">
                  Annual Cash Flow Savings
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl sm:text-5xl font-extrabold text-stone-900 tracking-tight">
                    ₦{((resData.annualSavingsNaira ?? 0) / 1000000).toFixed(2)}M
                  </span>
                  <span className="text-sm font-bold text-stone-500">/yr</span>
                </div>
                <p className="text-xs text-stone-500 font-semibold mt-2">
                  ₦{(resData.annualSavingsNaira ?? 0).toLocaleString()} / year
                </p>
              </div>
            </div>

            {/* 25-Year Lifetime Cumulative Savings */}
            <div className="bg-white/80 backdrop-blur-md border border-stone-200 rounded-3xl p-6 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-widest text-stone-500 block mb-1">
                25-Year Cumulative Lifetime Savings
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#00490e] tracking-tight">
                ₦{((resData.lifetime25YearSavingsNaira ?? 0) / 1000000).toFixed(1)} Million
              </div>
              <p className="text-xs text-stone-500 font-medium mt-1">
                Factors in 8% annual energy tariff inflation over 25 years.
              </p>
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
              href="/tools/roi-calculator"
              className="w-full bg-[#00490e] hover:bg-emerald-900 text-white font-semibold py-4 rounded-full text-sm shadow-md transition-all flex items-center justify-center gap-2 group"
            >
              Calculate Payback & ROI for these Savings
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
                {i === 0 ? <Zap size={20} /> : i === 1 ? <Fuel size={20} /> : <TrendingUp size={20} />}
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
              toolTitle="Solar Savings Calculator"
              toolId="solar-savings"
              result={result}
              inputSummary={[
                { label: 'Current Monthly Grid Bill', value: `₦${gridBillNaira.toLocaleString()}` },
                { label: 'Current Monthly Diesel Bill', value: `₦${dieselBillNaira.toLocaleString()}` },
                { label: 'Tariff Band', value: tariffBand },
                { label: 'Solar Offset Percentage', value: solarOffsetPct, unit: '%' },
              ]}
              calculationSummary={[
                { label: 'Total Monthly Savings', value: `₦${(resData.totalMonthlySavingsNaira ?? 0).toLocaleString()}` },
                { label: 'Annual Cash Flow Savings', value: `₦${(resData.annualSavingsNaira ?? 0).toLocaleString()}` },
                { label: '25-Year Cumulative Savings', value: `₦${((resData.lifetime25YearSavingsNaira ?? 0) / 1000000).toFixed(1)}M` },
              ]}
              nextToolHref="/tools/roi-calculator"
              nextToolLabel="Solar ROI & Payback Calculator"
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
