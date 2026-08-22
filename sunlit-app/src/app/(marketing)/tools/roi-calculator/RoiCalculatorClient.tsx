'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { calculateRoi } from '@/lib/engineering/calculators/roiCalculator';
import { SharedCalculationResult } from '@/lib/engineering/types';
import { PublicWaitlistForm } from '@/shared/components/tools/PublicWaitlistForm';
import {
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Play,
  Hourglass,
  DollarSign,
  Activity,
} from 'lucide-react';

export function RoiCalculatorClient() {
  const [systemCostNgn, setSystemCostNgn] = useState<number>(12500000);
  const [monthlySavingsNgn, setMonthlySavingsNgn] = useState<number>(380000);
  const [annualOpexNgn, setAnnualOpexNgn] = useState<number>(250000);
  const [annualGenMwh, setAnnualGenMwh] = useState<number>(18.5);

  const netAnnualSavings = monthlySavingsNgn * 12 - annualOpexNgn;

  const result: SharedCalculationResult = calculateRoi({
    systemCapexNaira: systemCostNgn,
    annualSavingsNaira: netAnnualSavings,
    annualMaintenanceCostNaira: annualOpexNgn,
    solarSystemCapacityKwp: annualGenMwh / 1.7,
  });

  const resData = result.engineering_results;
  const paybackYears = Math.round((systemCostNgn / Math.max(1, netAnnualSavings)) * 10) / 10;
  const irrPercent = Math.round((netAnnualSavings / systemCostNgn) * 100 * 10) / 10;
  const npv25YearsNgn = Math.round(netAnnualSavings * 11.5 - systemCostNgn);

  return (
    <main className="bg-[#FFF8F5] text-[#1F1B17] font-sans min-h-screen pb-24 antialiased">
      {/* 1. Stitch Hero Section */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 pt-8 pb-16">
        <div className="mb-6">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#00490E] bg-[#fff8f5] px-3.5 py-1.5 rounded-lg border border-[#E5E0DD] shadow-sm hover:bg-[#F2F5EC] transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Engineering Tools
          </Link>
        </div>

        <div className="bg-[#fff8f5] rounded-[20px] border border-[#E5E0DD] overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 sm:p-12 items-center min-h-[460px]">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#ECEFE6] flex items-center justify-center text-[#00490E]">
                  <TrendingUp size={16} />
                </span>
                <span className="font-sans font-bold text-xs uppercase tracking-wider text-[#00490E]">
                  Project Finance
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-[#00490E] tracking-tight leading-tight">
                Turn Engineering Design Into Financial Reality.
              </h1>

              <p className="font-sans text-base sm:text-lg text-[#40493D] max-w-md leading-relaxed">
                The Solar ROI &amp; Payback Calculator transforms technical specifications into bankable investment decisions. Instantly project CAPEX, OPEX, Net Present Value (NPV), and Internal Rate of Return (IRR).
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <a
                  href="#interactive-workspace"
                  className="bg-[#00490E] text-white px-8 py-3.5 rounded-lg font-sans font-semibold text-sm shadow-sm hover:bg-[#003006] transition-all flex items-center gap-2"
                >
                  Calculate My Solar ROI
                  <ArrowRight size={16} />
                </a>
                <a
                  href="#interactive-workspace"
                  className="border border-[#00490E] text-[#00490E] px-6 py-3.5 rounded-lg font-sans font-semibold text-sm hover:bg-[#ECEFE6] transition-all flex items-center gap-2"
                >
                  <Play size={16} />
                  Live Financial Model
                </a>
              </div>
            </div>

            {/* Hero Image */}
            <div className="h-full w-full min-h-[280px] rounded-xl overflow-hidden border border-[#E5E0DD] relative bg-[#F6ECE6] flex items-center justify-center">
              <img
                className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-80"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhAysyPJxE7Wcz_JyY-hSrCmQ2Va7z8VvfJ07TyJh3mVJ8_JFFE28GrFOXbtH33J-gjbRDHQrsAC1K8CR8Lk3s8oLlxDHcLIxPi4z7CpdmPoH_ZJlTCeLJshbHlfnmcxp9SZVaDyLbxhlT64nyUr4C64CKqQzqS47dW1hZ4fb3ClNgT0hewyOKRtWNvAEgSFuNeZbUWXNUwaA81p90qzEG7HxGYz7vIIGTBgcfbgDDsakHeR6_rMq4nQ"
                alt="Solar ROI Financial Modeling"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Workspace Bento Grid */}
      <section id="interactive-workspace" className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-12 border-t border-[#E5E0DD]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Input Parameters */}
          <div className="lg:col-span-4 bg-[#fff8f5] rounded-[20px] border border-[#E5E0DD] shadow-sm flex flex-col">
            <div className="p-6 border-b border-[#E5E0DD] flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-[#00490E]">Input Parameters</h2>
              <Sliders size={18} className="text-[#00490E]" />
            </div>

            <div className="p-6 flex flex-col gap-5 text-xs">
              <div>
                <label className="font-bold text-[#40493D] uppercase tracking-wider mb-1.5 flex justify-between">
                  <span>Initial Capital Expenditure (CAPEX)</span>
                  <span className="text-[#707A6C]">₦ NGN</span>
                </label>
                <input
                  type="number"
                  step={100000}
                  value={systemCostNgn}
                  onChange={(e) => setSystemCostNgn(Math.max(100000, Number(e.target.value)))}
                  className="w-full bg-[#f6ece6] border border-[#E5E0DD] rounded-lg p-3 font-mono text-sm text-[#1F1B17] focus:border-[#00490E] focus:outline-none shadow-inner"
                />
                <p className="text-[11px] text-[#707A6C] mt-1">Total hardware, battery, and installation cost.</p>
              </div>

              <div>
                <label className="font-bold text-[#40493D] uppercase tracking-wider mb-1.5 flex justify-between">
                  <span>Estimated Monthly Savings</span>
                  <span className="text-[#707A6C]">₦ / Month</span>
                </label>
                <input
                  type="number"
                  step={10000}
                  value={monthlySavingsNgn}
                  onChange={(e) => setMonthlySavingsNgn(Math.max(1000, Number(e.target.value)))}
                  className="w-full bg-[#f6ece6] border border-[#E5E0DD] rounded-lg p-3 font-mono text-sm text-[#1F1B17] focus:border-[#00490E] focus:outline-none shadow-inner"
                />
              </div>

              <div>
                <label className="font-bold text-[#40493D] uppercase tracking-wider mb-1.5 flex justify-between">
                  <span>Annual Operating Expense (OPEX)</span>
                  <span className="text-[#707A6C]">₦ / Year</span>
                </label>
                <input
                  type="number"
                  step={10000}
                  value={annualOpexNgn}
                  onChange={(e) => setAnnualOpexNgn(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-[#f6ece6] border border-[#E5E0DD] rounded-lg p-3 font-mono text-sm text-[#1F1B17] focus:border-[#00490E] focus:outline-none shadow-inner"
                />
              </div>

              <div>
                <label className="font-bold text-[#40493D] uppercase tracking-wider mb-1.5 flex justify-between">
                  <span>Estimated Annual Yield</span>
                  <span className="text-[#707A6C]">MWh / Year</span>
                </label>
                <input
                  type="number"
                  step={0.5}
                  value={annualGenMwh}
                  onChange={(e) => setAnnualGenMwh(Math.max(0.1, Number(e.target.value)))}
                  className="w-full bg-[#f6ece6] border border-[#E5E0DD] rounded-lg p-3 font-mono text-sm text-[#1F1B17] focus:border-[#00490E] focus:outline-none shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Right: Results Dashboard */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* KPI Card: IRR */}
            <div className="bg-[#fff8f5] rounded-[20px] border border-[#E5E0DD] p-6 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-[#00490E]" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#707A6C]">
                  Internal Rate of Return (IRR)
                </span>
              </div>
              <div>
                <div className="font-display text-4xl font-extrabold text-[#00490E]">
                  {irrPercent}%
                </div>
                <div className="text-xs text-[#4D661C] mt-2 flex items-center gap-1 font-semibold">
                  <CheckCircle2 size={14} />
                  {irrPercent > 15 ? 'Exceeds Commercial 15% Hurdle Rate' : 'Viable Long-Term Asset'}
                </div>
              </div>
            </div>

            {/* KPI Card: Payback Period */}
            <div className="bg-[#fff8f5] rounded-[20px] border border-[#E5E0DD] p-6 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-3">
                <Hourglass className="w-5 h-5 text-[#40493D]" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#707A6C]">
                  Estimated Payback Period
                </span>
              </div>
              <div>
                <div className="font-display text-4xl font-extrabold text-[#00490E]">
                  {paybackYears}{' '}
                  <span className="text-2xl font-normal text-[#40493D]">Years</span>
                </div>
                <div className="text-xs text-[#707A6C] mt-2">
                  Full break-even point on capital investment.
                </div>
              </div>
            </div>

            {/* Chart Card: NPV Over Time */}
            <div className="md:col-span-2 bg-[#fff8f5] rounded-[20px] border border-[#E5E0DD] shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-[#E5E0DD] pb-3">
                <h3 className="font-display text-base font-bold text-[#00490E]">
                  Net Present Value (NPV) 25-Year Projection
                </h3>
                <span className="text-xs font-mono bg-[#ECEFE6] text-[#00490E] px-3 py-1 rounded-full font-bold">
                  25 Year Horizon
                </span>
              </div>

              <div className="p-4 bg-[#f6ece6] rounded-xl border border-[#E5E0DD] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="text-xs text-[#707A6C] uppercase font-bold tracking-wider">
                    Cumulative 25-Year Net Value
                  </div>
                  <div className="font-display text-3xl font-bold text-[#00490E] mt-1">
                    ₦ {npv25YearsNgn.toLocaleString()}
                  </div>
                </div>
                <Link
                  href="/tools/solar-savings"
                  className="px-6 py-2.5 bg-[#00490E] text-white rounded-full text-xs font-semibold hover:bg-[#003006] transition-all shadow-sm"
                >
                  Analyze Fuel Displacement Savings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Waitlist Form */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-12">
        <PublicWaitlistForm
          title="Export Bankable Solar Financial Feasibility Models"
          subtitle="Generate bank-ready Excel models, debt-service coverage ratios (DSCR), and inflation-indexed tariff projections."
        />
      </section>
    </main>
  );
}
