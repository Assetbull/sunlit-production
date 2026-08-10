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
import {
  DollarSign, ArrowRight, ShieldCheck, CheckCircle2, Sliders, TrendingUp, PieChart, Activity, AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

export function RoiCalculatorClient() {
  const [systemCostNaira, setSystemCostNaira] = useState<number>(12000000);
  const [capacityKwp, setCapacityKwp] = useState<number>(10.0);
  const [gridBillNaira, setGridBillNaira] = useState<number>(120000);
  const [dieselBillNaira, setDieselBillNaira] = useState<number>(200000);
  const [annualMaintenanceNaira, setAnnualMaintenanceNaira] = useState<number>(180000);
  const [discountRatePct, setDiscountRatePct] = useState<number>(12);
  const [showReport, setShowReport] = useState<boolean>(false);

  const result: SharedCalculationResult = calculateRoi({
    systemCostNaira,
    solarSystemCapacityKwp: capacityKwp,
    currentMonthlyGridBillNaira: gridBillNaira,
    currentMonthlyDieselBillNaira: dieselBillNaira,
    annualMaintenanceCostNaira: annualMaintenanceNaira,
    discountRatePercent: discountRatePct,
  });

  const isSuccess = result.calculation_status === 'SUCCESS';
  const resData = result.engineering_results;

  return (
    <main className="bg-[#fff8f5] text-[#1f1b17] font-sans min-h-screen pb-24 antialiased">
      <ToolHeader
        title="Solar Investment ROI & Financial Model"
        category="Financial Return & Capital Investment"
        description="Calculate simple payback period (Years), simple annual return on investment (ROI %), and 25-year Net Present Value (NPV) for solar projects."
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-8">
        {/* Stitch Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 border-b border-stone-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Stitch Visual DNA Engine
              </span>
              <span className="text-xs text-stone-500 font-medium">• Investment Model V2.4</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#00490e] tracking-tight">
              Your ROI report is ready.
            </h1>
            <p className="text-stone-600 text-sm sm:text-base mt-1">
              Comprehensive financial & engineering analysis for proposed solar installation. Payback, IRR %, and 25-yr NPV.
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
          {/* Left Column: Investment Inputs */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/80 backdrop-blur-md border border-stone-200 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#00490e] mb-5 flex items-center gap-2 border-b border-stone-100 pb-3">
                <Sliders className="w-5 h-5 text-[#00490e]" />
                Investment Parameters
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Turnkey Solar System CapEx (₦)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1000000}
                      max={500000000}
                      step={500000}
                      value={systemCostNaira}
                      onChange={(e) => setSystemCostNaira(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-base"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-stone-400">
                      ₦
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Solar System Capacity (kWp)
                  </label>
                  <input
                    type="number"
                    min={0.5}
                    max={500}
                    value={capacityKwp}
                    onChange={(e) => setCapacityKwp(Math.max(0.1, Number(e.target.value)))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-base"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Grid Bill (₦/mo)
                    </label>
                    <input
                      type="number"
                      value={gridBillNaira}
                      onChange={(e) => setGridBillNaira(Number(e.target.value))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Diesel Spend (₦/mo)
                    </label>
                    <input
                      type="number"
                      value={dieselBillNaira}
                      onChange={(e) => setDieselBillNaira(Number(e.target.value))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Annual O&M Reserve (₦/year)
                  </label>
                  <input
                    type="number"
                    value={annualMaintenanceNaira}
                    onChange={(e) => setAnnualMaintenanceNaira(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Hurdle / Discount Rate (%)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={6}
                      max={20}
                      step={1}
                      value={discountRatePct}
                      onChange={(e) => setDiscountRatePct(Number(e.target.value))}
                      className="w-full accent-[#00490e] h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="font-mono font-bold text-stone-900 min-w-[4ch] text-sm">
                      {discountRatePct}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: ROI & Cash Flow Results */}
          <div className="lg:col-span-8 space-y-6">
            {/* Financial Performance Glass Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Payback Period</span>
                  <Activity className="w-5 h-5 text-[#00490e]" />
                </div>
                <div className="text-4xl font-extrabold text-[#00490e] mb-1">
                  {resData.simplePaybackYears ?? 0}
                  <span className="text-sm text-stone-500 font-normal ml-1">yrs</span>
                </div>
                <div className="text-xs font-semibold text-stone-500 font-mono">
                  Escalated: {resData.escalatedPaybackYears ?? 0} yrs
                </div>
              </div>

              <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Internal Rate of Return</span>
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-4xl font-extrabold text-blue-900 mb-1">
                  {resData.irrPercent ?? 0}
                  <span className="text-sm text-stone-500 font-normal ml-1">%</span>
                </div>
                <div className="text-xs font-semibold text-stone-500 font-mono">
                  Simple ROI: {resData.simpleRoiPercent}%/yr
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-900 to-[#00490e] text-white rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">25-Yr Net Savings</span>
                  <DollarSign className="w-5 h-5 text-emerald-300" />
                </div>
                <div className="text-3xl font-extrabold text-white mb-1">
                  ₦{(resData.npv25YearNaira ?? 0).toLocaleString()}
                </div>
                <div className="text-xs font-medium text-emerald-100">
                  25-Year NPV @ {discountRatePct}% hurdle
                </div>
              </div>
            </div>

            {/* Financial Performance Table */}
            <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
              <h3 className="font-bold text-base text-[#00490e] mb-4 flex items-center gap-2 border-b border-stone-100 pb-3">
                <PieChart className="w-5 h-5 text-[#00490e]" />
                Investment Return Summary
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between border-b border-stone-100 pb-2">
                  <span className="text-stone-600">Turnkey Solar CapEx Outflow:</span>
                  <span className="font-bold text-stone-900">₦{systemCostNaira.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-stone-100 pb-2">
                  <span className="text-stone-600">First-Year Gross Savings:</span>
                  <span className="font-bold text-stone-900">₦{(resData.grossAnnualSavingsNaira ?? 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-stone-100 pb-2">
                  <span className="text-stone-600">Annual O&M Cost Reserve:</span>
                  <span className="font-bold text-stone-900">-₦{(resData.annualMaintenanceCostNaira ?? 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-stone-100 pb-2">
                  <span className="text-emerald-800 font-semibold">Net Year-1 Cash Flow:</span>
                  <span className="font-bold text-emerald-800">
                    +₦{(resData.netAnnualSavingsNaira ?? 0).toLocaleString()}/yr
                  </span>
                </div>
                <div className="flex justify-between pt-1 text-sm">
                  <span className="font-extrabold text-[#00490e]">Calculated Internal Rate of Return (IRR):</span>
                  <span className="font-extrabold text-[#00490e]">{resData.irrPercent}%</span>
                </div>
              </div>
            </div>

            {/* Next Tool Navigation CTA */}
            <Link
              href="/tools/solar-system-sizing"
              className="w-full bg-[#00490e] hover:bg-emerald-900 text-white font-semibold py-4 rounded-full text-sm shadow-md transition-all flex items-center justify-center gap-2 group"
            >
              Proceed to Solar System Sizing Calculator
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
              toolTitle="Solar ROI, NPV & Financial Model"
              toolId="roi-calculator"
              result={result}
              inputSummary={[
                { label: 'Turnkey System CapEx', value: `₦${systemCostNaira.toLocaleString()}` },
                { label: 'System Capacity', value: capacityKwp, unit: 'kWp' },
                { label: 'Gross Annual Savings', value: `₦${(resData.grossAnnualSavingsNaira ?? 0).toLocaleString()}` },
                { label: 'Annual O&M Reserve', value: `₦${(resData.annualMaintenanceCostNaira ?? 0).toLocaleString()}` },
              ]}
              calculationSummary={[
                { label: 'Simple Payback Period', value: resData.simplePaybackYears, unit: 'years' },
                { label: 'Escalated Payback Period', value: resData.escalatedPaybackYears, unit: 'years' },
                { label: 'Simple Annual ROI', value: resData.simpleRoiPercent, unit: '%' },
                { label: 'Internal Rate of Return (IRR)', value: resData.irrPercent, unit: '%' },
                { label: '25-Year Net Present Value (NPV)', value: `₦${(resData.npv25YearNaira ?? 0).toLocaleString()}` },
                { label: 'Net Annual Savings (Year 1)', value: `₦${(resData.netAnnualSavingsNaira ?? 0).toLocaleString()}` },
              ]}
              engineeringChecks={[
                { label: 'Payback Period Benchmark', value: `${resData.simplePaybackYears} years ≤ 8 year benchmark`, check: (resData.simplePaybackYears ?? 99) <= 8 ? 'PASS' : 'WARNING' },
                { label: 'Net Present Value Check', value: `NPV ₦${(resData.npv25YearNaira ?? 0).toLocaleString()} > 0`, check: (resData.npv25YearNaira ?? 0) > 0 ? 'PASS' : 'WARNING' },
                { label: 'Net Savings Check', value: `₦${(resData.netAnnualSavingsNaira ?? 0).toLocaleString()}/yr > 0`, check: (resData.netAnnualSavingsNaira ?? 0) > 0 ? 'PASS' : 'FAIL' },
              ]}
              nextToolHref="/tools/solar-system-sizing"
              nextToolLabel="Solar System Sizing Calculator"
            />
          </div>
        )}

        <UnlockReportCTA />
        <PublicWaitlistForm interestedTool="Solar ROI & Payback Calculator" />
        <RelatedToolsList currentToolId="roi-calculator" />
      </div>
    </main>
  );
}
