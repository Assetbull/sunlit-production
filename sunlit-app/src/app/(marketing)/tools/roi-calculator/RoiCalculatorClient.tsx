'use client';

import { useState } from 'react';
import { calculateRoi } from '@/lib/engineering/calculators/roiCalculator';
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
  DollarSign, ArrowRight, ShieldCheck, Sliders, TrendingUp, Clock
} from 'lucide-react';
import Link from 'next/link';

const content = TOOLS_CONTENT['roi-calculator'];

export function RoiCalculatorClient() {
  const [capexNaira, setCapexNaira] = useState<number>(8500000);
  const [annualSavingsNaira, setAnnualSavingsNaira] = useState<number>(2400000);
  const [systemLifespanYears, setSystemLifespanYears] = useState<number>(25);
  const [discountRatePercent, setDiscountRatePercent] = useState<number>(12);
  const [annualOpexPercent, setAnnualOpexPercent] = useState<number>(1.0);
  const [annualDegradationPercent, setAnnualDegradationPercent] = useState<number>(0.5);
  const [showReport, setShowReport] = useState<boolean>(false);

  const result: SharedCalculationResult = calculateRoi({
    systemCapexNaira: capexNaira,
    annualSavingsNaira,
    systemLifetimeYears: systemLifespanYears,
    discountRatePercent,
    annualOpexNaira: (capexNaira * annualOpexPercent) / 100,
    annualDegradationPercent,
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
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 border-b border-stone-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Discounted Cashflow Engine V2.4
              </span>
              <span className="text-xs text-stone-500 font-medium">• {content.tagline}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#00490e] tracking-tight">
              {content.heroHeadline}
            </h1>
            <p className="text-stone-600 text-sm sm:text-base mt-1">
              Analyze payback period (years), Net Present Value (NPV), and Internal Rate of Return (IRR).
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setShowReport(!showReport)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#00490e] hover:bg-emerald-900 text-white font-semibold px-5 py-3 rounded-full text-sm shadow-sm transition-all"
            >
              <ShieldCheck size={18} />
              {showReport ? 'Hide Investment Report' : 'Generate Full ROI Report'}
            </button>
          </div>
        </div>

        {/* Interactive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left Column: Inputs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white/80 backdrop-blur-md border border-stone-200 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#00490e] mb-5 flex items-center gap-2 border-b border-stone-100 pb-3">
                <Sliders className="w-5 h-5 text-[#00490e]" />
                Investment Parameters
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Initial System CAPEX (₦)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-stone-400">
                      ₦
                    </span>
                    <input
                      type="number"
                      min={500000}
                      max={500000000}
                      step={100000}
                      value={capexNaira}
                      onChange={(e) => setCapexNaira(Math.max(500000, Number(e.target.value)))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-9 pr-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Expected Annual Energy Savings (₦/yr)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-stone-400">
                      ₦
                    </span>
                    <input
                      type="number"
                      min={100000}
                      max={100000000}
                      step={50000}
                      value={annualSavingsNaira}
                      onChange={(e) => setAnnualSavingsNaira(Math.max(100000, Number(e.target.value)))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-9 pr-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-base"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Discount Rate (%)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      step={0.5}
                      value={discountRatePercent}
                      onChange={(e) => setDiscountRatePercent(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      System Lifespan (Years)
                    </label>
                    <select
                      value={systemLifespanYears}
                      onChange={(e) => setSystemLifespanYears(Number(e.target.value))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-sm"
                    >
                      <option value={25}>25 Years (Tier-1 Linear Warranty)</option>
                      <option value={20}>20 Years</option>
                      <option value={15}>15 Years</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Annual Maintenance OPEX (% of CAPEX)
                  </label>
                  <input
                    type="range"
                    min={0.5}
                    max={3.0}
                    step={0.1}
                    value={annualOpexPercent}
                    onChange={(e) => setAnnualOpexPercent(Number(e.target.value))}
                    className="w-full accent-[#00490e]"
                  />
                  <div className="flex justify-between text-[11px] text-stone-500 font-semibold">
                    <span>0.5% (Minimal)</span>
                    <span className="text-[#00490e] font-bold">{annualOpexPercent.toFixed(1)}% / yr</span>
                    <span>3.0% (High Support)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Financial Results */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-white via-[#f4fbf5] to-[#e8f6ea] border border-emerald-200/80 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 block mb-1">
                  Payback Period
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold text-[#00490e] tracking-tight">
                    {resData.simplePaybackYears ?? 0}
                  </span>
                  <span className="text-lg font-bold text-stone-600">Years</span>
                </div>
                <p className="text-xs text-stone-500 font-semibold mt-2">
                  Full capital cost recovery
                </p>
              </div>

              <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                <span className="text-xs font-bold uppercase tracking-widest text-stone-500 block mb-1">
                  Internal Rate of Return
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold text-stone-900 tracking-tight">
                    {resData.internalRateOfReturnPercent ?? 0}
                  </span>
                  <span className="text-lg font-bold text-stone-500">%</span>
                </div>
                <p className="text-xs text-stone-500 font-semibold mt-2">
                  Annualized financial IRR
                </p>
              </div>

              <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                <span className="text-xs font-bold uppercase tracking-widest text-stone-500 block mb-1">
                  Net Present Value
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold text-stone-900 tracking-tight">
                    ₦{((resData.netPresentValueNaira ?? 0) / 1000000).toFixed(1)}M
                  </span>
                </div>
                <p className="text-xs text-stone-500 font-semibold mt-2">
                  @ {discountRatePercent}% Discount Rate
                </p>
              </div>
            </div>

            {/* Lifetime Return Summary Card */}
            <div className="bg-white/80 backdrop-blur-md border border-stone-200 rounded-3xl p-6 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-widest text-stone-500 block mb-1">
                25-Year Cumulative Net Profit
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#00490e] tracking-tight">
                ₦{((resData.netCumulativeProfitNaira ?? 0) / 1000000).toFixed(1)} Million
              </div>
              <p className="text-xs text-stone-500 font-medium mt-1">
                Net lifetime savings after deducting initial CAPEX and 25-year maintenance OPEX.
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
              href="/tools/solar-system-sizing"
              className="w-full bg-[#00490e] hover:bg-emerald-900 text-white font-semibold py-4 rounded-full text-sm shadow-md transition-all flex items-center justify-center gap-2 group"
            >
              Configure Complete System Sizing
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
                {i === 0 ? <Clock size={20} /> : i === 1 ? <DollarSign size={20} /> : <TrendingUp size={20} />}
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
              toolTitle="Solar ROI & Payback Calculator"
              toolId="roi-calculator"
              result={result}
              inputSummary={[
                { label: 'Initial System CAPEX', value: `₦${capexNaira.toLocaleString()}` },
                { label: 'Annual Energy Savings', value: `₦${annualSavingsNaira.toLocaleString()}` },
                { label: 'Discount Rate', value: discountRatePercent, unit: '%' },
                { label: 'Lifespan', value: systemLifespanYears, unit: 'Years' },
                { label: 'Annual OPEX', value: `${annualOpexPercent}% of CAPEX` },
              ]}
              calculationSummary={[
                { label: 'Simple Payback Period', value: resData.simplePaybackYears, unit: 'Years' },
                { label: 'Internal Rate of Return (IRR)', value: resData.internalRateOfReturnPercent, unit: '%' },
                { label: 'Net Present Value (NPV)', value: `₦${((resData.netPresentValueNaira ?? 0) / 1000000).toFixed(1)}M` },
                { label: 'Total 25-Yr Net Profit', value: `₦${((resData.netCumulativeProfitNaira ?? 0) / 1000000).toFixed(1)}M` },
              ]}
              nextToolHref="/tools/solar-system-sizing"
              nextToolLabel="Solar System Sizing Calculator"
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
