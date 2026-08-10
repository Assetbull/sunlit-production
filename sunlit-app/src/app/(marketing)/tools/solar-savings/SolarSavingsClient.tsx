'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { calculateSolarSavings } from '@/lib/engineering/calculators/solarSavings';
import { SharedCalculationResult } from '@/lib/engineering/types';
import { PublicWaitlistForm } from '@/shared/components/tools/PublicWaitlistForm';
import {
  DollarSign,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  Sliders,
  Play,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export function SolarSavingsClient() {
  const [monthlyKwh, setMonthlyKwh] = useState<number>(1500);
  const [gridTariff, setGridTariff] = useState<number>(225);
  const [dieselPrice, setDieselPrice] = useState<number>(1100);
  const [genReliance, setGenReliance] = useState<number>(60);

  const gridMonthlyBill = monthlyKwh * ((100 - genReliance) / 100) * gridTariff;
  const dieselMonthlyExpense = (monthlyKwh * (genReliance / 100) * 0.35) * dieselPrice;

  const result: SharedCalculationResult = calculateSolarSavings({
    dailySolarGenKwh: monthlyKwh / 30,
    monthlyGridBillNaira: gridMonthlyBill,
    monthlyDieselFuelExpenseNaira: dieselMonthlyExpense,
    gridTariffNairaPerKwh: gridTariff,
    dieselPriceNairaPerLiter: dieselPrice,
    generatorDisplacementPercent: genReliance,
  });

  const resData = result.engineering_results;
  const gridCostMonthly = (monthlyKwh * ((100 - genReliance) / 100)) * gridTariff;
  const genLitersMonthly = (monthlyKwh * (genReliance / 100)) * 0.35;
  const genCostMonthly = genLitersMonthly * dieselPrice;
  const totalMonthlySpend = gridCostMonthly + genCostMonthly;
  const solarEstimatedCostMonthly = monthlyKwh * 45; // levelized solar amortized
  const annualSavingsNgn = Math.round((totalMonthlySpend - solarEstimatedCostMonthly) * 12);
  const paybackEstYears = (12500000 / Math.max(1, annualSavingsNgn)).toFixed(1);

  return (
    <main className="bg-[#FFF8F5] text-[#1F1B17] font-sans min-h-screen pb-24 antialiased">
      {/* 1. Stitch Hero Section */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 pt-8 pb-16">
        <div className="mb-6">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#00490E] bg-white px-3.5 py-1.5 rounded-lg border border-[#E5E0DD] shadow-sm hover:bg-[#F2F5EC] transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Engineering Tools
          </Link>
        </div>

        <div className="mb-12 max-w-3xl">
          <span className="inline-block px-3 py-1 bg-[#ECEFE6] text-[#00490E] font-sans font-bold text-xs uppercase tracking-widest rounded-full mb-4 border border-[#BFCABA]/50">
            ENERGY ECONOMICS
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-[#00490E] mb-4 tracking-tight leading-tight">
            Solar Savings Calculator
          </h1>
          <p className="font-sans text-base sm:text-lg text-[#40493D] leading-relaxed">
            Analyze the financial impact of transitioning from grid and generator reliance to sustainable solar infrastructure in Nigeria. Optimize your self-consumption ratio for maximum ROI.
          </p>
        </div>

        {/* 2. Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Calculator Inputs (Left Col) */}
          <div className="md:col-span-5 bg-white rounded-[20px] border border-[#E5E0DD] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#E5E0DD] bg-[#FFF8F5]">
              <h2 className="font-display text-lg font-bold text-[#00490E] flex items-center gap-2">
                <Sliders size={18} className="text-[#00490E]" />
                System Parameters
              </h2>
            </div>

            <div className="p-6 space-y-5 text-xs">
              <div>
                <label className="block font-bold text-[#40493D] uppercase tracking-wider mb-1.5">
                  Monthly Power Consumption (kWh)
                </label>
                <input
                  type="number"
                  min={100}
                  max={50000}
                  step={50}
                  value={monthlyKwh}
                  onChange={(e) => setMonthlyKwh(Math.max(50, Number(e.target.value)))}
                  className="w-full bg-[#FFF8F5] border border-[#E5E0DD] rounded-lg px-4 py-3 font-mono text-sm text-[#1F1B17] focus:border-[#00490E] focus:outline-none shadow-inner"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#40493D] uppercase tracking-wider mb-1.5">
                    Grid Tariff (₦/kWh)
                  </label>
                  <input
                    type="number"
                    value={gridTariff}
                    onChange={(e) => setGridTariff(Number(e.target.value))}
                    className="w-full bg-[#FFF8F5] border border-[#E5E0DD] rounded-lg px-4 py-3 font-mono text-sm text-[#1F1B17] focus:border-[#00490E] focus:outline-none shadow-inner"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#40493D] uppercase tracking-wider mb-1.5">
                    Diesel Cost (₦/L)
                  </label>
                  <input
                    type="number"
                    value={dieselPrice}
                    onChange={(e) => setDieselPrice(Number(e.target.value))}
                    className="w-full bg-[#FFF8F5] border border-[#E5E0DD] rounded-lg px-4 py-3 font-mono text-sm text-[#1F1B17] focus:border-[#00490E] focus:outline-none shadow-inner"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#40493D] uppercase tracking-wider mb-1.5 flex justify-between">
                  <span>Generator Reliance</span>
                  <span className="font-mono text-[#00490E] font-bold">{genReliance}%</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={genReliance}
                  onChange={(e) => setGenReliance(Number(e.target.value))}
                  className="w-full accent-[#00490E]"
                />
              </div>

              <div className="pt-2">
                <a
                  href="#interactive-workspace"
                  className="w-full py-3 bg-[#00490E] text-white rounded-lg text-xs font-semibold hover:bg-[#003006] transition-all flex justify-center items-center gap-2 shadow-sm"
                >
                  <Play size={14} />
                  Calculate Live Savings
                </a>
              </div>
            </div>
          </div>

          {/* Results & Visuals (Right Col) */}
          <div className="md:col-span-7 flex flex-col gap-6">
            {/* Main KPI */}
            <div className="bg-white rounded-[20px] border border-[#E5E0DD] p-8 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#707A6C] mb-2">
                  Estimated Annual Savings
                </p>
                <h3 className="font-display text-4xl font-extrabold text-[#00490E]">
                  ₦ {annualSavingsNgn.toLocaleString()}
                </h3>
                <p className="text-xs text-[#4D661C] font-semibold mt-2">
                  ROI in ~{paybackEstYears} years based on current fuel prices
                </p>
              </div>
              <div className="w-20 h-20 rounded-full bg-[#ECEFE6] flex items-center justify-center text-[#00490E]">
                <TrendingUp size={36} />
              </div>
            </div>

            {/* Comparison Chart Area */}
            <div className="bg-white rounded-[20px] border border-[#E5E0DD] shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-[#E5E0DD] flex justify-between items-center bg-[#FFF8F5]">
                <h3 className="font-display text-base font-bold text-[#00490E]">
                  Cost Projection Analysis
                </h3>
                <span className="text-xs font-mono text-[#707A6C]">10-Year Lifecycle</span>
              </div>
              <div className="p-6 relative">
                <div className="w-full h-56 rounded-xl overflow-hidden relative bg-[#F6ECE6]">
                  <div
                    className="w-full h-full bg-cover bg-center absolute inset-0 mix-blend-multiply opacity-85"
                    style={{
                      backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuADTwpxySqJJXU5yoP0rA59m-KuqO60xrf7JE3tqekYBN8GlnF9Mln3HvwlIg2o9Km4Jc2SvU_AzRus3kUU2-v4267sAZ3euyGELg2Z3A2JZg02074w4DD7oYH3UNq_jDXSZLushYH5V2fppqZDnFwyFgk9CrkJAhZscnmZUN8wPHA-bHW7J4puqdFSmokKvHorYU4rU8PKcPXnDYHNQQWqKsqC_9HrnIIDEV769m1xKXhDS2hlX9fq1w')`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Waitlist Form */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-12">
        <PublicWaitlistForm
          title="Export Diesel Displacement &amp; Carbon Offset Feasibility"
          subtitle="Generate generator fuel reduction schedules, ESG compliance data, and corporate solar leasing comparisons."
        />
      </section>
    </main>
  );
}
