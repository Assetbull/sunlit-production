'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { calculateCableSizing } from '@/lib/engineering/calculators/cableSizing';
import { SharedCalculationResult } from '@/lib/engineering/types';
import { PublicWaitlistForm } from '@/shared/components/tools/PublicWaitlistForm';
import {
  Cable,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Play,
  Info,
  AlertTriangle,
} from 'lucide-react';

export function CableSizingClient() {
  const [currentAmps, setCurrentAmps] = useState<number>(30.0);
  const [systemVoltage, setSystemVoltage] = useState<number>(48.0);
  const [cableLengthMeters, setCableLengthMeters] = useState<number>(25.0);
  const [conductorMaterial, setConductorMaterial] = useState<'COPPER' | 'ALUMINUM'>('COPPER');
  const [maxVdropPercent, setMaxVdropPercent] = useState<number>(3.0);

  const result: SharedCalculationResult = calculateCableSizing({
    currentAmps: currentAmps,
    systemVoltage: systemVoltage,
    cableLengthMeters: cableLengthMeters,
    conductorMaterial: conductorMaterial,
    maxVoltageDropPercent: maxVdropPercent,
  });

  const resData = result.engineering_results;
  const cableSizeMm2 = resData?.recommended_cable_size_mm2 ?? 10.0;
  const calculatedVdrop = resData?.calculated_voltage_drop_percent ?? 1.8;
  const powerLossWatts = resData?.power_loss_watts ?? Math.round(Math.pow(currentAmps, 2) * (0.0175 * 2 * cableLengthMeters / cableSizeMm2));
  const isPass = calculatedVdrop <= maxVdropPercent;

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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ECEFE6] rounded-full w-fit border border-[#BFCABA]/50">
              <Cable className="w-4 h-4 text-[#00490E]" />
              <span className="font-sans font-bold text-xs uppercase tracking-wider text-[#00490E]">
                ELECTRICAL DESIGN
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-[#00490E] tracking-tight leading-tight">
              Precision Solar Cable Sizing Calculator
            </h1>

            <p className="font-sans text-base sm:text-lg text-[#40493D] max-w-2xl leading-relaxed">
              Engineer resilient solar arrays. Calculate precise ampacity and maintain strict voltage drop limits (max 3%) across long cable runs. Prevent dangerous overheating and eliminate significant energy loss in critical infrastructure.
            </p>

            <div className="flex flex-wrap gap-4 mt-2">
              <a
                href="#interactive-workspace"
                className="bg-[#00490E] text-white px-8 py-3.5 rounded-lg font-sans font-semibold text-sm shadow-sm hover:bg-[#003006] transition-all flex items-center gap-2"
              >
                Size My Solar Cable
                <ArrowRight size={18} />
              </a>
              <a
                href="#interactive-workspace"
                className="border border-[#00490E] text-[#00490E] px-6 py-3.5 rounded-lg font-sans font-semibold text-sm hover:bg-[#ECEFE6] transition-all flex items-center gap-2"
              >
                <Play size={16} />
                Live Engineering Calculator
              </a>
            </div>
          </div>

          {/* Stitch Hero Image Card */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            <div className="aspect-square w-full rounded-[20px] border border-[#E5E0DD] bg-white overflow-hidden shadow-sm relative">
              <div
                className="bg-cover bg-center w-full h-full absolute inset-0"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDlTkLX1xNnzOEXR6LmMeScA2AfpoaKtLWCqDehP3dxpzaiK5cj8luG53QnGAJmbatokYf2vFB4bwg5e9VYNuZLQArxv0QUxnxZ0RMCxg3g5kQPiN6MT1fJowmMmyIO0iZlLKmBQnJFtTEW3ipiPaCZKaqKGGpjmhH8blfI-vjPC6YJ_POqAuBB4JqYSn_wEUffhB-8RvpPV2iXbm6GJHEJ1gVgCQkpHN7mBaX3c11L1yQFB40aXdt5LQ')`,
                }}
              />
            </div>
            {/* Floating Data Card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-[20px] p-5 border border-[#E5E0DD] shadow-md hidden sm:block">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#00490E] block mb-1">
                CRITICAL METRIC
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl font-extrabold text-[#00490E]">&lt;3%</span>
                <span className="text-xs text-[#40493D]">Max Voltage Drop</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Workspace */}
      <section id="interactive-workspace" className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-12 border-t border-[#E5E0DD]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Input Parameters */}
          <div className="lg:col-span-5 bg-white rounded-[20px] border border-[#E5E0DD] p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-[#E5E0DD] pb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#00490E]" />
                <h2 className="font-display text-lg font-bold text-[#00490E]">
                  Electrical Parameters
                </h2>
              </div>
              <span className="text-[11px] font-bold uppercase text-[#4D661C] bg-[#F6ECE6] px-2.5 py-0.5 rounded-full border border-[#E5E0DD]">
                Real-Time
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#40493D] uppercase tracking-wider mb-1.5">
                  Operating Current (I)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={500}
                    step={0.5}
                    value={currentAmps}
                    onChange={(e) => setCurrentAmps(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-[#FFF8F5] border border-[#E5E0DD] rounded-lg px-4 py-3 text-sm font-mono text-[#1F1B17] focus:border-[#00490E] focus:outline-none shadow-inner"
                  />
                  <span className="absolute right-4 top-3.5 text-xs text-[#707A6C] font-mono">Amps</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#40493D] uppercase tracking-wider mb-1.5">
                  System Voltage (V)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={12}
                    max={1500}
                    step={1}
                    value={systemVoltage}
                    onChange={(e) => setSystemVoltage(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-[#FFF8F5] border border-[#E5E0DD] rounded-lg px-4 py-3 text-sm font-mono text-[#1F1B17] focus:border-[#00490E] focus:outline-none shadow-inner"
                  />
                  <span className="absolute right-4 top-3.5 text-xs text-[#707A6C] font-mono">Volts</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#40493D] uppercase tracking-wider mb-1.5">
                  Cable Run Length (One-Way)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={500}
                    step={1}
                    value={cableLengthMeters}
                    onChange={(e) => setCableLengthMeters(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-[#FFF8F5] border border-[#E5E0DD] rounded-lg px-4 py-3 text-sm font-mono text-[#1F1B17] focus:border-[#00490E] focus:outline-none shadow-inner"
                  />
                  <span className="absolute right-4 top-3.5 text-xs text-[#707A6C] font-mono">Meters</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#40493D] uppercase tracking-wider mb-1.5">
                  Conductor Material
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setConductorMaterial('COPPER')}
                    className={`py-2.5 rounded-lg text-xs font-semibold border transition-all ${
                      conductorMaterial === 'COPPER'
                        ? 'bg-[#00490E] text-white border-[#00490E]'
                        : 'bg-[#FFF8F5] text-[#40493D] border-[#E5E0DD] hover:bg-[#ECEFE6]'
                    }`}
                  >
                    Copper (Cu)
                  </button>
                  <button
                    type="button"
                    onClick={() => setConductorMaterial('ALUMINUM')}
                    className={`py-2.5 rounded-lg text-xs font-semibold border transition-all ${
                      conductorMaterial === 'ALUMINUM'
                        ? 'bg-[#00490E] text-white border-[#00490E]'
                        : 'bg-[#FFF8F5] text-[#40493D] border-[#E5E0DD] hover:bg-[#ECEFE6]'
                    }`}
                  >
                    Aluminum (Al)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Sizing Results */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-[20px] p-5 border border-[#E5E0DD] shadow-sm flex flex-col justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#707A6C]">
                  Recommended Gauge
                </span>
                <div className="mt-3">
                  <div className="font-display text-3xl font-extrabold text-[#00490E]">
                    {cableSizeMm2}{' '}
                    <span className="text-base font-normal text-[#40493D]">mm²</span>
                  </div>
                  <p className="text-[11px] text-[#40493D] mt-1">
                    Standard Metric Cable
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-[20px] p-5 border border-[#E5E0DD] shadow-sm flex flex-col justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#707A6C]">
                  Voltage Drop
                </span>
                <div className="mt-3">
                  <div className={`font-display text-3xl font-extrabold ${isPass ? 'text-[#00490E]' : 'text-[#BA1A1A]'}`}>
                    {calculatedVdrop}{' '}
                    <span className="text-base font-normal text-[#40493D]">%</span>
                  </div>
                  <p className="text-[11px] text-[#40493D] mt-1">
                    Max Allowed: {maxVdropPercent}%
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-[20px] p-5 border border-[#E5E0DD] shadow-sm flex flex-col justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#707A6C]">
                  Conductor Power Loss
                </span>
                <div className="mt-3">
                  <div className="font-display text-3xl font-extrabold text-[#00490E]">
                    {powerLossWatts}{' '}
                    <span className="text-base font-normal text-[#40493D]">W</span>
                  </div>
                  <p className="text-[11px] text-[#40493D] mt-1">
                    I²R Conduction Heat
                  </p>
                </div>
              </div>
            </div>

            {/* Validation Banner */}
            <div className={`rounded-xl p-4 border flex items-start gap-3 ${
              isPass
                ? 'bg-[#ECEFE6] border-[#92D78B]'
                : 'bg-[#FFDAD6] border-[#BA1A1A]'
            }`}>
              {isPass ? (
                <CheckCircle2 className="w-5 h-5 text-[#00490E] shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-[#BA1A1A] shrink-0 mt-0.5" />
              )}
              <div>
                <span className={`text-xs font-bold uppercase tracking-wider block ${
                  isPass ? 'text-[#00490E]' : 'text-[#BA1A1A]'
                }`}>
                  {isPass ? 'Voltage Drop Validation: PASS' : 'Voltage Drop Exceeds 3% IEEE Threshold'}
                </span>
                <p className="text-xs text-[#40493D] mt-0.5">
                  Conductor cross-sectional area calculated from resistivity (ρ = 0.0175 Ω·mm²/m for Copper).
                </p>
              </div>
            </div>

            {/* System Sizer CTA */}
            <div className="bg-white rounded-[20px] p-6 border border-[#E5E0DD] shadow-sm space-y-4">
              <Link
                href="/tools/solar-system-sizing"
                className="w-full py-3.5 bg-[#00490E] text-white rounded-full text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#003006] transition-all shadow-sm"
              >
                Validate Complete Solar System
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Waitlist Form */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-12">
        <PublicWaitlistForm
          title="Export Cable Sizing &amp; Ampacity Reports"
          subtitle="Generate cable schedule schedules, breaker ratings, and conduit fill calculations for EPC contractor compliance."
        />
      </section>
    </main>
  );
}
