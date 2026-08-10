'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { calculateEnergyYield } from '@/lib/engineering/calculators/energyYield';
import { SharedCalculationResult } from '@/lib/engineering/types';
import { PublicWaitlistForm } from '@/shared/components/tools/PublicWaitlistForm';
import {
  Activity,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Play,
  Sun,
  MapPin,
  Calendar,
} from 'lucide-react';

export function EnergyYieldClient() {
  const [arrayKwp, setArrayKwp] = useState<number>(10.0);
  const [location, setLocation] = useState<string>('Lagos');
  const [derateFactor, setDerateFactor] = useState<number>(0.82);

  const result: SharedCalculationResult = calculateEnergyYield({
    systemCapacityKwp: arrayKwp,
    location: location,
    tiltAngleDeg: 10,
    performanceRatio: derateFactor,
  });

  const resData = result.engineering_results;
  const annualKwh = resData?.estimated_annual_generation_kwh ?? Math.round(arrayKwp * 4.8 * derateFactor * 365);
  const monthlyKwh = Math.round(annualKwh / 12);
  const specificYield = Math.round((annualKwh / arrayKwp));

  return (
    <main className="bg-[#FFF8F5] text-[#1F1B17] font-sans min-h-screen pb-24 antialiased">
      {/* 1. Stitch Hero Section */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 pt-12 pb-16">
        <div className="flex flex-col md:flex-row gap-12 justify-between items-center">
          <div className="w-full md:w-7/12 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ECEFE6] rounded-full w-fit border border-[#BFCABA]/50">
              <Activity className="w-4 h-4 text-[#00490E]" />
              <span className="font-sans font-bold text-xs uppercase tracking-widest text-[#00490E]">
                ENERGY MODELLING
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-[#00490E] tracking-tight leading-tight">
              Solar Energy Yield Estimator
            </h1>

            <p className="font-sans text-base sm:text-lg text-[#40493D] max-w-2xl leading-relaxed">
              Predict accurate energy production based on hyper-local irradiance data. Engineered for specific locations, providing actionable specific yield (kWh/kWp) and precise performance ratios to de-risk technical deployments.
            </p>

            <div className="flex flex-wrap gap-4 mt-2">
              <a
                href="#interactive-workspace"
                className="bg-[#00490E] text-white px-8 py-3.5 rounded-lg font-sans font-semibold text-sm shadow-sm hover:bg-[#003006] transition-all flex items-center gap-2"
              >
                Estimate My Solar Production
                <ArrowRight size={16} />
              </a>
              <a
                href="#interactive-workspace"
                className="border border-[#00490E] text-[#00490E] px-6 py-3.5 rounded-lg font-sans font-semibold text-sm hover:bg-[#ECEFE6] transition-all flex items-center gap-2"
              >
                <Play size={16} />
                Live Modeling Engine
              </a>
            </div>
          </div>

          {/* Stitch Satellite Visual Card */}
          <div className="w-full md:w-5/12 h-[340px] rounded-[20px] overflow-hidden border border-[#E5E0DD] bg-white shadow-sm relative">
            <div
              className="bg-cover bg-center w-full h-full"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuARlZYd9Z2lo1gyXgmAiDeuxbCjSCnMtuIYd19xX9AA27aTmKxQFcnciTnhOfY0rUZij27YtKd3bix6QFOnvLAIQFPDJG509-4j_gRhBh5C6t8uPyeGlMUGL8LSfmNLZIDrXS4NsJ65aAXrzQGtacD_HWvCnxOFdd3mxbxSTQQ5XAKXinUt1QzuSMhtVbfXRogVfEHsaTMLkcwiT7x_YXcRj7rRc8iw72OkhlE_UtTn_QtA5MS-2SikVw')`,
              }}
            />
          </div>
        </div>
      </section>

      {/* 2. Interactive Workspace */}
      <section id="interactive-workspace" className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-12 border-t border-[#E5E0DD]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Inputs */}
          <div className="lg:col-span-5 bg-white rounded-[20px] border border-[#E5E0DD] p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-[#E5E0DD] pb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#00490E]" />
                <h2 className="font-display text-lg font-bold text-[#00490E]">
                  Simulation Inputs
                </h2>
              </div>
              <span className="text-[11px] font-bold uppercase text-[#4D661C] bg-[#F6ECE6] px-2.5 py-0.5 rounded-full border border-[#E5E0DD]">
                Real-Time
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#40493D] uppercase tracking-wider mb-1.5">
                  System Array Capacity (kWp)
                </label>
                <input
                  type="number"
                  min={1}
                  max={500}
                  step={0.5}
                  value={arrayKwp}
                  onChange={(e) => setArrayKwp(Math.max(0.5, Number(e.target.value)))}
                  className="w-full bg-[#FFF8F5] border border-[#E5E0DD] rounded-lg px-4 py-3 text-sm font-mono text-[#1F1B17] focus:border-[#00490E] focus:outline-none shadow-inner"
                />
              </div>

              <div>
                <label className="block font-bold text-[#40493D] uppercase tracking-wider mb-1.5">
                  Geographical Region / State
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-[#FFF8F5] border border-[#E5E0DD] rounded-lg px-4 py-3 text-xs font-sans text-[#1F1B17] focus:border-[#00490E] focus:outline-none"
                >
                  <option value="Lagos">Lagos State (Coastal Southern Belt)</option>
                  <option value="Abuja">Abuja FCT (Central Savanna)</option>
                  <option value="Kano">Kano State (Northern Sahelian Zone)</option>
                  <option value="Port Harcourt">Port Harcourt (Niger Delta Rain Belt)</option>
                  <option value="Enugu">Enugu State (South-Eastern Highlands)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#40493D] uppercase tracking-wider mb-1.5">
                  System Performance Ratio (PR)
                </label>
                <select
                  value={derateFactor}
                  onChange={(e) => setDerateFactor(Number(e.target.value))}
                  className="w-full bg-[#FFF8F5] border border-[#E5E0DD] rounded-lg px-4 py-3 text-xs font-sans text-[#1F1B17] focus:border-[#00490E] focus:outline-none"
                >
                  <option value={0.82}>0.82 — Standard Tier-1 Rooftop Installation</option>
                  <option value={0.85}>0.85 — High-Efficiency Ground Mount</option>
                  <option value={0.78}>0.78 — High-Temperature / Dusty Industrial Zone</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right: Yield Results */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-[20px] p-5 border border-[#E5E0DD] shadow-sm flex flex-col justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#707A6C]">
                  Annual Generation
                </span>
                <div className="mt-3">
                  <div className="font-display text-3xl font-extrabold text-[#00490E]">
                    {annualKwh.toLocaleString()}{' '}
                    <span className="text-base font-normal text-[#40493D]">kWh</span>
                  </div>
                  <p className="text-[11px] text-[#40493D] mt-1">
                    ~{(annualKwh / 1000).toFixed(1)} MWh / Year
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-[20px] p-5 border border-[#E5E0DD] shadow-sm flex flex-col justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#707A6C]">
                  Monthly Average
                </span>
                <div className="mt-3">
                  <div className="font-display text-3xl font-extrabold text-[#00490E]">
                    {monthlyKwh.toLocaleString()}{' '}
                    <span className="text-base font-normal text-[#40493D]">kWh</span>
                  </div>
                  <p className="text-[11px] text-[#40493D] mt-1">
                    Consistent generation
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-[20px] p-5 border border-[#E5E0DD] shadow-sm flex flex-col justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#707A6C]">
                  Specific Yield
                </span>
                <div className="mt-3">
                  <div className="font-display text-3xl font-extrabold text-[#00490E]">
                    {specificYield}{' '}
                    <span className="text-base font-normal text-[#40493D]">kWh/kWp</span>
                  </div>
                  <p className="text-[11px] text-[#40493D] mt-1">
                    NASA SSE Calibrated
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#ECEFE6] rounded-xl p-4 border border-[#92D78B] flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#00490E] shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#00490E] block">
                  Solar Modeling Confidence: High
                </span>
                <p className="text-xs text-[#40493D] mt-0.5">
                  Calibrated against multi-year global horizontal irradiance (GHI) and diffuse radiation indices across Nigeria.
                </p>
              </div>
            </div>

            <Link
              href="/tools/solar-savings"
              className="w-full py-3 bg-[#00490E] text-white rounded-full text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#003006] transition-all shadow-sm"
            >
              Calculate Financial Savings from this Generation
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Waitlist Form */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-12">
        <PublicWaitlistForm
          title="Export 25-Year Production &amp; Degradation Yield Curves"
          subtitle="Generate bankable P50 / P90 yield estimates, seasonal monsoon-derating charts, and inverter clipping analyses."
        />
      </section>
    </main>
  );
}
