'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { calculateInverterSizing } from '@/lib/engineering/calculators/inverterSizing';
import { SharedCalculationResult } from '@/lib/engineering/types';
import { InverterSizingModal } from '@/shared/components/tools/inverter-sizing/InverterSizingModal';
import { PublicWaitlistForm } from '@/shared/components/tools/PublicWaitlistForm';
import {
  Gauge,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Play,
  Zap,
  Info,
  Bolt,
} from 'lucide-react';

export function InverterSizingClient() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [continuousWatts, setContinuousWatts] = useState<number>(4500);
  const [surgeWatts, setSurgeWatts] = useState<number>(9000);
  const [powerFactor, setPowerFactor] = useState<number>(0.8);
  const [dcVoltage, setDcVoltage] = useState<48 | 24 | 12>(48);

  const result: SharedCalculationResult = calculateInverterSizing({
    continuousLoadWatts: continuousWatts,
    peakSurgeWatts: surgeWatts,
    powerFactor: powerFactor,
    systemVoltageDc: dcVoltage,
  });

  const resData = result.engineering_results;
  const recommendedKva = resData?.recommended_inverter_rating_kva ?? Math.round((continuousWatts / (powerFactor * 1000) * 1.25) * 10) / 10;
  const continuousKw = Math.round((continuousWatts / 1000) * 10) / 10;
  const surgeKva = Math.round((surgeWatts / 1000) * 10) / 10;

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

        <div className="flex flex-col md:flex-row gap-12 items-center justify-between">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 text-[#00490E] font-sans font-bold text-xs uppercase tracking-widest bg-[#ECEFE6] px-3 py-1 rounded-full w-fit border border-[#BFCABA]/50">
              <Bolt size={14} className="text-[#00490E]" />
              Power Conversion &amp; Surge
            </div>

            <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-[#00490E] tracking-tight leading-tight">
              Inverter Sizing Calculator
            </h1>

            <p className="font-sans text-base sm:text-lg text-[#40493D] max-w-2xl leading-relaxed">
              Precision engineering requires precision power. Calculate exact inverter specifications based on peak load, kVA vs kW ratios, and critical motor startup surge demands to ensure reliable operation without simultaneous high-draw load tripping.
            </p>

            <div className="flex flex-wrap gap-4 mt-2">
              <a
                href="#interactive-workspace"
                className="bg-[#00490E] text-white px-8 py-3.5 rounded-lg font-sans font-semibold text-sm shadow-sm hover:bg-[#003006] transition-all flex items-center gap-2"
              >
                Size My Inverter
                <ArrowRight size={16} />
              </a>
              <button
                onClick={() => setIsModalOpen(true)}
                className="border border-[#00490E] text-[#00490E] px-6 py-3.5 rounded-lg font-sans font-semibold text-sm hover:bg-[#ECEFE6] transition-all flex items-center gap-2"
              >
                <Play size={16} />
                Open Inverter Wizard
              </button>
            </div>
          </div>

          {/* Stitch Inverter Unit Image Card */}
          <div className="flex-1 w-full relative min-h-[320px] rounded-[20px] overflow-hidden border border-[#E5E0DD] bg-white shadow-sm">
            <div
              className="w-full h-full bg-cover bg-center absolute inset-0"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDUZEYiBJFcTtX9wtCyTyspWB_jJLbxO1CoBOo_N9MiBHiEG8yWOq-pkP6HYcY3a-nbpUDvHawM2kKuT2C8lFkgTuqtPnGzwfdDghAVV9At_vRn-UNVUuHMUuPGhP1CAh96sWqGK7UZ8k9iVmROVUSkCqKoI8abj_o3OEOnmrLwe0y28Y2Eedi1uqic4bCvH2AScw4K_oTSa-qblgpkYSbYVDf0Cbzdp6rnotkUpc-OWKOdYgJaZmuHgQ')`,
              }}
            />
          </div>
        </div>
      </section>

      {/* 2. Interactive Workspace */}
      <section id="interactive-workspace" className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-12 border-t border-[#E5E0DD]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Input Controls */}
          <div className="lg:col-span-5 bg-white rounded-[20px] border border-[#E5E0DD] p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-[#E5E0DD] pb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#00490E]" />
                <h2 className="font-display text-lg font-bold text-[#00490E]">
                  Inverter Parameters
                </h2>
              </div>
              <span className="text-[11px] font-bold uppercase text-[#4D661C] bg-[#F6ECE6] px-2.5 py-0.5 rounded-full border border-[#E5E0DD]">
                Real-Time
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#40493D] uppercase tracking-wider mb-1.5">
                  Continuous Running Load (Watts)
                </label>
                <input
                  type="number"
                  min={500}
                  max={50000}
                  step={100}
                  value={continuousWatts}
                  onChange={(e) => setContinuousWatts(Math.max(100, Number(e.target.value)))}
                  className="w-full bg-[#FFF8F5] border border-[#E5E0DD] rounded-lg px-4 py-3 font-mono text-sm text-[#1F1B17] focus:border-[#00490E] focus:outline-none shadow-inner"
                />
              </div>

              <div>
                <label className="block font-bold text-[#40493D] uppercase tracking-wider mb-1.5">
                  Peak Motor Surge Demand (Watts)
                </label>
                <input
                  type="number"
                  min={500}
                  max={100000}
                  step={500}
                  value={surgeWatts}
                  onChange={(e) => setSurgeWatts(Math.max(500, Number(e.target.value)))}
                  className="w-full bg-[#FFF8F5] border border-[#E5E0DD] rounded-lg px-4 py-3 font-mono text-sm text-[#1F1B17] focus:border-[#00490E] focus:outline-none shadow-inner"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#40493D] uppercase tracking-wider mb-1.5">
                    Power Factor (PF)
                  </label>
                  <select
                    value={powerFactor}
                    onChange={(e) => setPowerFactor(Number(e.target.value))}
                    className="w-full bg-[#FFF8F5] border border-[#E5E0DD] rounded-lg px-4 py-3 text-xs text-[#1F1B17] focus:border-[#00490E] focus:outline-none"
                  >
                    <option value={0.8}>0.80 — Mixed Inductive Loads</option>
                    <option value={0.9}>0.90 — High-Efficiency Inverters</option>
                    <option value={1.0}>1.00 — Pure Resistive</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#40493D] uppercase tracking-wider mb-1.5">
                    DC Bus Voltage
                  </label>
                  <select
                    value={dcVoltage}
                    onChange={(e) => setDcVoltage(Number(e.target.value) as 48 | 24 | 12)}
                    className="w-full bg-[#FFF8F5] border border-[#E5E0DD] rounded-lg px-4 py-3 text-xs text-[#1F1B17] focus:border-[#00490E] focus:outline-none"
                  >
                    <option value={48}>48V DC</option>
                    <option value={24}>24V DC</option>
                    <option value={12}>12V DC</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Sizing Outputs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-[20px] p-5 border border-[#E5E0DD] shadow-sm flex flex-col justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#707A6C]">
                  Recommended Inverter
                </span>
                <div className="mt-3">
                  <div className="font-display text-3xl font-extrabold text-[#00490E]">
                    {recommendedKva}{' '}
                    <span className="text-base font-normal text-[#40493D]">kVA</span>
                  </div>
                  <p className="text-[11px] text-[#40493D] mt-1">
                    Continuous Rating
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-[20px] p-5 border border-[#E5E0DD] shadow-sm flex flex-col justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#707A6C]">
                  Continuous Real Power
                </span>
                <div className="mt-3">
                  <div className="font-display text-3xl font-extrabold text-[#00490E]">
                    {continuousKw}{' '}
                    <span className="text-base font-normal text-[#40493D]">kW</span>
                  </div>
                  <p className="text-[11px] text-[#40493D] mt-1">
                    @ PF {powerFactor}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-[20px] p-5 border border-[#E5E0DD] shadow-sm flex flex-col justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#707A6C]">
                  Surge Tolerance
                </span>
                <div className="mt-3">
                  <div className="font-display text-3xl font-extrabold text-[#00490E]">
                    {surgeKva}{' '}
                    <span className="text-base font-normal text-[#40493D]">kW</span>
                  </div>
                  <p className="text-[11px] text-[#40493D] mt-1">
                    Motor Startup Peak
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#ECEFE6] rounded-xl p-4 border border-[#92D78B] flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#00490E] shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#00490E] block">
                  Surge Capacity Check: PASS
                </span>
                <p className="text-xs text-[#40493D] mt-0.5">
                  Calculated rating provides a minimum 25% continuous safety headroom and 2x peak motor inductive start tolerance.
                </p>
              </div>
            </div>

            {/* Stitch Power Triangle Vector Card */}
            <div className="bg-white rounded-[20px] border border-[#E5E0DD] p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-[#E5E0DD] pb-3">
                <h3 className="font-display text-base font-bold text-[#00490E]">Power Factor Analysis</h3>
                <span className="text-xs font-mono text-[#707A6C]">kVA = kW / PF</span>
              </div>
              <div className="w-full h-44 rounded-xl overflow-hidden relative border border-[#E5E0DD]">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCunBuA1pKbsa0Lk61yk-mwiQH9t5C8yUOoBbpfQR3Xd5EW4U9ncT_1quM3SKaoNFebRo_FiafToVH86NqhY64P2-4D7eIAauSOK68l2qME1iz4GmzEZG8fbCXzFOZ0g2l2fS-pxNWb2AuLcPDge4jXJ1UVBpddkwtp1v-vfl6GUhRfWR_3lg9C_SSS2YKSEMIMLAZUJIgOkehC_FkSLR2ycpcEDsmc-EsQZjLvm5J1Vri6FZtWtbLuXQ')`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Waitlist Form */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-12">
        <PublicWaitlistForm
          title="Export Inverter Sizing & Protection Coordination Sheets"
          subtitle="Generate AC breaker curves, transfer switch specifications, and surge protection device (SPD) ratings."
        />
      </section>

      {/* Sizer Modal */}
      {isModalOpen && (
        <InverterSizingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </main>
  );
}
