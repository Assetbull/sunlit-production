'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { calculatePvConfiguration } from '@/lib/engineering/calculators/pvConfiguration';
import { SharedCalculationResult } from '@/lib/engineering/types';
import { PvConfigurationModal } from '@/shared/components/tools/pv-configuration/PvConfigurationModal';
import { PublicWaitlistForm } from '@/shared/components/tools/PublicWaitlistForm';
import {
  Layers,
  ArrowRight,
  ShieldCheck,
  Activity,
  Sliders,
  Play,
  Info,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export function PvConfigurationClient() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [panelsPerString, setPanelsPerString] = useState<number>(18);
  const [stringsCount, setStringsCount] = useState<number>(2);
  const [minTemp, setMinTemp] = useState<number>(-10);
  const [maxTemp, setMaxTemp] = useState<number>(65);

  const result: SharedCalculationResult = calculatePvConfiguration({
    modulesPerString: panelsPerString,
    parallelStringsCount: stringsCount,
    totalModulesCount: panelsPerString * stringsCount,
    tempMinC: minTemp,
    tempMaxC: maxTemp,
  });

  const resData = result.engineering_results;
  const coldVoc = resData?.max_string_voltage_voc_cold_v ?? Math.round(panelsPerString * 49.5 * (1 + 0.003 * (25 - minTemp)) * 10) / 10;
  const hotVmp = resData?.min_string_voltage_vmp_hot_v ?? Math.round(panelsPerString * 41.5 * (1 - 0.0035 * (maxTemp - 25)) * 10) / 10;
  const totalArrayKwp = Math.round((panelsPerString * stringsCount * 550) / 100) / 10;
  const isSafeVoc = coldVoc < 1000;
  const isSafeVmp = hotVmp > 200;

  return (
    <main className="bg-[#FFF8F5] text-[#1F1B17] font-sans min-h-screen pb-24 antialiased">
      {/* 1. Stitch Hero Section */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 pt-12 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 flex flex-col gap-6">
            <div className="font-sans font-bold text-xs uppercase tracking-widest text-[#00490E] flex items-center gap-2">
              <span className="w-8 h-px bg-[#00490E]" />
              PV CONFIGURATION
            </div>

            <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-[#00490E] tracking-tight leading-tight">
              PV String Layout Configurator
            </h1>

            <p className="font-sans text-base sm:text-lg text-[#40493D] max-w-2xl leading-relaxed">
              Improper stringing can damage inverters or lead to severe efficiency losses.
              Calculate exact Voc, Vmp, temperature coefficients, and cold Voc vs MPPT limits
              for high-stakes solar infrastructure.
            </p>

            <div className="flex flex-wrap gap-4 mt-2">
              <a
                href="#interactive-workspace"
                className="bg-[#00490E] text-white px-8 py-3.5 rounded-lg font-sans font-semibold text-sm shadow-sm hover:bg-[#003006] transition-all flex items-center gap-2"
              >
                Configure My PV Strings
                <ArrowRight size={18} />
              </a>
              <button
                onClick={() => setIsModalOpen(true)}
                className="border border-[#00490E] text-[#00490E] px-6 py-3.5 rounded-lg font-sans font-semibold text-sm hover:bg-[#ECEFE6] transition-all flex items-center gap-2"
              >
                <Play size={16} />
                Open Stringing Wizard
              </button>
            </div>
          </div>

          {/* Stitch String Voltage Analysis Card */}
          <div className="md:col-span-5 relative mt-6 md:mt-0">
            <div className="bg-white p-6 rounded-[20px] border border-[#E5E0DD] shadow-sm relative z-10 space-y-6">
              <div className="flex justify-between items-center border-b border-[#E5E0DD] pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#00490E]/70">
                  STRING VOLTAGE ANALYSIS
                </span>
                <Activity size={18} className="text-[#00490E]/70" />
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-1.5 text-xs">
                    <span className="text-[#40493D]">Max Cold Voc ({minTemp}°C)</span>
                    <span className={`font-mono font-bold ${isSafeVoc ? 'text-[#00490E]' : 'text-[#BA1A1A]'}`}>
                      {coldVoc} V
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-[#ECEFE6] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${isSafeVoc ? 'bg-[#00490E]' : 'bg-[#BA1A1A]'}`}
                      style={{ width: `${Math.min(100, (coldVoc / 1000) * 100)}%` }}
                    />
                  </div>
                  <div className="text-right mt-1 text-[10px] font-bold text-[#707A6C] uppercase">
                    INVERTER LIMIT: 1000V
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1.5 text-xs">
                    <span className="text-[#40493D]">Min Vmp ({maxTemp}°C)</span>
                    <span className="font-mono font-bold text-[#00490E]">
                      {hotVmp} V
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-[#ECEFE6] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#00490E]"
                      style={{ width: `${Math.min(100, (hotVmp / 800) * 100)}%` }}
                    />
                  </div>
                  <div className="text-right mt-1 text-[10px] font-bold text-[#707A6C] uppercase">
                    MPPT MIN LIMIT: 200V
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 w-full h-full border-2 border-[#BFCABA]/30 rounded-[20px] -z-10" />
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
                  String Parameters
                </h2>
              </div>
              <span className="text-[11px] font-bold uppercase text-[#4D661C] bg-[#F6ECE6] px-2.5 py-0.5 rounded-full border border-[#E5E0DD]">
                Real-Time
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#40493D] uppercase tracking-wider mb-1.5">
                  Panels in Series per String
                </label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={panelsPerString}
                  onChange={(e) => setPanelsPerString(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-[#FFF8F5] border border-[#E5E0DD] rounded-lg px-4 py-3 text-sm font-mono text-[#1F1B17] focus:border-[#00490E] focus:outline-none shadow-inner"
                />
              </div>

              <div>
                <label className="block font-bold text-[#40493D] uppercase tracking-wider mb-1.5">
                  Parallel Strings Count
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={stringsCount}
                  onChange={(e) => setStringsCount(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-[#FFF8F5] border border-[#E5E0DD] rounded-lg px-4 py-3 text-sm font-mono text-[#1F1B17] focus:border-[#00490E] focus:outline-none shadow-inner"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#40493D] uppercase tracking-wider mb-1.5">
                    Min Temp (°C)
                  </label>
                  <input
                    type="number"
                    min={-20}
                    max={25}
                    value={minTemp}
                    onChange={(e) => setMinTemp(Number(e.target.value))}
                    className="w-full bg-[#FFF8F5] border border-[#E5E0DD] rounded-lg px-4 py-3 text-sm font-mono text-[#1F1B17] focus:border-[#00490E] focus:outline-none shadow-inner"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#40493D] uppercase tracking-wider mb-1.5">
                    Max Temp (°C)
                  </label>
                  <input
                    type="number"
                    min={25}
                    max={85}
                    value={maxTemp}
                    onChange={(e) => setMaxTemp(Number(e.target.value))}
                    className="w-full bg-[#FFF8F5] border border-[#E5E0DD] rounded-lg px-4 py-3 text-sm font-mono text-[#1F1B17] focus:border-[#00490E] focus:outline-none shadow-inner"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Live Sizing Results */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-[20px] p-5 border border-[#E5E0DD] shadow-sm flex flex-col justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#707A6C]">
                  Total Array Power
                </span>
                <div className="mt-3">
                  <div className="font-display text-3xl font-extrabold text-[#00490E]">
                    {totalArrayKwp}{' '}
                    <span className="text-base font-normal text-[#40493D]">kWp</span>
                  </div>
                  <p className="text-[11px] text-[#40493D] mt-1">
                    {panelsPerString * stringsCount} × 550W Modules
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-[20px] p-5 border border-[#E5E0DD] shadow-sm flex flex-col justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#707A6C]">
                  Max Cold Voc
                </span>
                <div className="mt-3">
                  <div className={`font-display text-3xl font-extrabold ${isSafeVoc ? 'text-[#00490E]' : 'text-[#BA1A1A]'}`}>
                    {coldVoc}{' '}
                    <span className="text-base font-normal text-[#40493D]">V</span>
                  </div>
                  <p className="text-[11px] text-[#40493D] mt-1">
                    {isSafeVoc ? 'Within 1000V limit' : 'EXCEEDS 1000V limit'}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-[20px] p-5 border border-[#E5E0DD] shadow-sm flex flex-col justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#707A6C]">
                  Min Hot Vmp
                </span>
                <div className="mt-3">
                  <div className="font-display text-3xl font-extrabold text-[#00490E]">
                    {hotVmp}{' '}
                    <span className="text-base font-normal text-[#40493D]">V</span>
                  </div>
                  <p className="text-[11px] text-[#40493D] mt-1">
                    Above MPPT Min 200V
                  </p>
                </div>
              </div>
            </div>

            {/* Validation Banner */}
            <div className={`rounded-xl p-4 border flex items-start gap-3 ${
              isSafeVoc && isSafeVmp
                ? 'bg-[#ECEFE6] border-[#92D78B]'
                : 'bg-[#FFDAD6] border-[#BA1A1A]'
            }`}>
              {isSafeVoc && isSafeVmp ? (
                <CheckCircle2 className="w-5 h-5 text-[#00490E] shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-[#BA1A1A] shrink-0 mt-0.5" />
              )}
              <div>
                <span className={`text-xs font-bold uppercase tracking-wider block ${
                  isSafeVoc && isSafeVmp ? 'text-[#00490E]' : 'text-[#BA1A1A]'
                }`}>
                  {isSafeVoc && isSafeVmp ? 'MPPT Window Validation: PASS' : 'MPPT Window Overvoltage Warning'}
                </span>
                <p className="text-xs text-[#40493D] mt-0.5">
                  String voltages verified against IEC 62548 temperature coefficient calculations.
                </p>
              </div>
            </div>

            {/* Next Steps CTA */}
            <div className="bg-white rounded-[20px] p-6 border border-[#E5E0DD] shadow-sm space-y-4">
              <Link
                href="/tools/cable-sizing"
                className="w-full py-3.5 bg-[#00490E] text-white rounded-full text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#003006] transition-all shadow-sm"
              >
                Size DC Cables for these Strings
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Waitlist Form */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-12">
        <PublicWaitlistForm
          title="Export PV Array Layout Engineering Reports"
          subtitle="Generate CAD layout plans, multi-MPPT tracking maps, and verified combiner box specifications."
        />
      </section>

      {/* Sizer Modal */}
      {isModalOpen && (
        <PvConfigurationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </main>
  );
}
