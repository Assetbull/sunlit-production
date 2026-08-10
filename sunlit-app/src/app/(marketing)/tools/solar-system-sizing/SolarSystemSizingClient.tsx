'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { calculateSolarSystemSizing } from '@/lib/engineering/calculators/solarSystemSizing';
import { SharedCalculationResult } from '@/lib/engineering/types';
import { SolarSizerModal } from '@/shared/components/tools/solar-sizer/SolarSizerModal';
import { PublicWaitlistForm } from '@/shared/components/tools/PublicWaitlistForm';
import {
  Sun,
  Battery,
  Zap,
  Sliders,
  CheckCircle2,
  Play,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Activity,
  ChevronDown,
} from 'lucide-react';

export function SolarSystemSizingClient() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [dailyKwh, setDailyKwh] = useState<number>(24.0);
  const [location, setLocation] = useState<string>('Lagos');
  const [autonomyDays, setAutonomyDays] = useState<number>(1.0);
  const [dod, setDod] = useState<number>(0.8);
  const [peakSurgeKw, setPeakSurgeKw] = useState<number>(7.5);

  const result: SharedCalculationResult = calculateSolarSystemSizing({
    dailyKwhInput: dailyKwh,
    daysOfAutonomy: autonomyDays,
    location: location,
    selectedPanelWattage: 550,
    selectedBatteryType: dod > 0.6 ? 'lithium_lifepo4' : 'gel_lead_acid',
    selectedInverterType: 'hybrid_pure_sine',
  });

  const resData = result.engineering_results;
  const arrayKwp = resData?.recommended_array_kwp ?? Math.round((dailyKwh / 4.8 / 0.8) * 10) / 10;
  const batteryKwh = resData?.recommended_battery_kwh ?? Math.round((dailyKwh * autonomyDays / dod / 0.95) * 10) / 10;
  const inverterKva = resData?.recommended_inverter_kva ?? Math.round((peakSurgeKw / 0.8 * 1.25) * 10) / 10;
  const panelCount = resData?.recommended_panel_count ?? Math.ceil((arrayKwp * 1000) / 550);

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

        <div className="flex flex-col lg:flex-row gap-12 items-center justify-between">
          <div className="lg:w-1/2 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ECEFE6] rounded-full w-fit border border-[#BFCABA]/50">
              <Sun className="w-4 h-4 text-[#00490E]" />
              <span className="font-sans font-bold text-xs uppercase tracking-wider text-[#00490E]">
                SYSTEM DESIGN &amp; AUTONOMY
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-[#00490E] tracking-tight leading-tight">
              Design your optimal solar system with engineering precision.
            </h1>

            <p className="font-sans text-base sm:text-lg text-[#40493D] max-w-xl leading-relaxed">
              The master system-design tool. Calculates array, battery, inverter, load profile, and autonomy with absolute certainty. Avoiding guesswork in sizing ensures system reliability and cost efficiency.
            </p>

            <div className="flex flex-wrap gap-4 mt-2">
              <a
                href="#interactive-workspace"
                className="px-8 py-3.5 bg-[#00490E] text-white rounded-lg font-sans font-semibold text-sm shadow-sm hover:bg-[#003006] transition-all flex items-center gap-2"
              >
                Launch Solar System Sizing Calculator
                <ArrowRight size={16} />
              </a>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3.5 border border-[#00490E] text-[#00490E] rounded-lg font-sans font-semibold text-sm hover:bg-[#ECEFE6] transition-all flex items-center gap-2"
              >
                <Play size={16} />
                Create My Free Engineering Report
              </button>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="lg:w-1/2 w-full h-[380px] sm:h-[420px] rounded-[20px] overflow-hidden border border-[#E5E0DD] shadow-sm relative">
            <div
              className="bg-cover bg-center w-full h-full"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBFrjlyiQ_oZBDEY51XrgU9q4kv7uWCmAoTiD04BddVkr9pgedMeL_jNEw3cuqqtJf0YW_2fsVnU5MEvQ4zQJqbW76S5n0lZApti_Flf5JxZz9_W1areTdI0F3h5r9AISyIE45xZBW41O2B_wMaAlrN8LyyTmUkCn-o2QGSHRVvLSIxXXHNKusrY83ntKj4N9TSBm1lyodP1Uw5AaMBHMtbppuIB6j7H8gx4mup1jIvRIKHhReC96AbHg')`,
              }}
            />
            <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-[#E5E0DD] shadow-md">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#00490E]/70 mb-0.5">
                ENGINEERING ENGINE
              </div>
              <div className="text-sm font-bold text-[#1F1B17]">
                Deterministic V2.4
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Workspace (Connected Live to Deterministic Sizer Engine) */}
      <section id="interactive-workspace" className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-12 border-t border-[#E5E0DD]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Interactive Input Controls */}
          <div className="lg:col-span-5 bg-white rounded-[20px] border border-[#E5E0DD] p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-[#E5E0DD] pb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#00490E]" />
                <h2 className="font-display text-lg font-bold text-[#00490E]">
                  System Sizing Parameters
                </h2>
              </div>
              <span className="text-[11px] font-bold uppercase text-[#4D661C] bg-[#F6ECE6] px-2.5 py-0.5 rounded-full border border-[#E5E0DD]">
                Real-Time
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#40493D] uppercase tracking-wider mb-1.5">
                  Daily Energy Requirement (kWh/day)
                </label>
                <input
                  type="number"
                  min={1}
                  max={500}
                  step={0.5}
                  value={dailyKwh}
                  onChange={(e) => setDailyKwh(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-[#FFF8F5] border border-[#E5E0DD] rounded-lg px-4 py-3 text-sm font-mono text-[#1F1B17] focus:border-[#00490E] focus:outline-none shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#40493D] uppercase tracking-wider mb-1.5">
                  Project Location (Peak Sun Hours)
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-[#FFF8F5] border border-[#E5E0DD] rounded-lg px-4 py-3 text-xs font-sans text-[#1F1B17] focus:border-[#00490E] focus:outline-none"
                >
                  <option value="Lagos">Lagos (4.8 PSH / day — Coastal Tropical)</option>
                  <option value="Abuja">Abuja (5.5 PSH / day — North-Central Guinea)</option>
                  <option value="Kano">Kano (6.2 PSH / day — Northern Sahel)</option>
                  <option value="Port Harcourt">Port Harcourt (4.3 PSH / day — Niger Delta)</option>
                  <option value="Ibadan">Ibadan (4.9 PSH / day — South-West Forest)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#40493D] uppercase tracking-wider mb-1.5">
                  Battery Autonomy (Days of Storage)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[0.5, 1, 1.5, 2].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setAutonomyDays(days)}
                      className={`py-2 rounded-lg text-xs font-semibold border transition-all ${
                        autonomyDays === days
                          ? 'bg-[#00490E] text-white border-[#00490E]'
                          : 'bg-[#FFF8F5] text-[#40493D] border-[#E5E0DD] hover:bg-[#ECEFE6]'
                      }`}
                    >
                      {days} {days === 1 ? 'Day' : 'Days'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#40493D] uppercase tracking-wider mb-1.5">
                  Battery Chemistry &amp; Depth of Discharge
                </label>
                <select
                  value={dod}
                  onChange={(e) => setDod(Number(e.target.value))}
                  className="w-full bg-[#FFF8F5] border border-[#E5E0DD] rounded-lg px-4 py-3 text-xs font-sans text-[#1F1B17] focus:border-[#00490E] focus:outline-none"
                >
                  <option value={0.8}>Lithium LiFePO4 (80% DoD — Recommended)</option>
                  <option value={0.9}>Lithium LiFePO4 Premium (90% DoD)</option>
                  <option value={0.5}>Tubular Gel / Lead-Acid (50% DoD)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#40493D] uppercase tracking-wider mb-1.5">
                  Estimated Peak Motor Surge (kW)
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  step={0.5}
                  value={peakSurgeKw}
                  onChange={(e) => setPeakSurgeKw(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-[#FFF8F5] border border-[#E5E0DD] rounded-lg px-4 py-3 text-sm font-mono text-[#1F1B17] focus:border-[#00490E] focus:outline-none shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Right: Live Output Cards & Specifications */}
          <div className="lg:col-span-7 space-y-6">
            {/* 3 Main KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-[20px] p-5 border border-[#E5E0DD] shadow-sm flex flex-col justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#707A6C]">
                  Solar PV Capacity
                </span>
                <div className="mt-3">
                  <div className="font-display text-3xl font-extrabold text-[#00490E]">
                    {arrayKwp}{' '}
                    <span className="text-base font-normal text-[#40493D]">kWp</span>
                  </div>
                  <p className="text-[11px] text-[#40493D] mt-1">
                    ~{panelCount} × 550W Panels
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-[20px] p-5 border border-[#E5E0DD] shadow-sm flex flex-col justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#707A6C]">
                  Battery Storage
                </span>
                <div className="mt-3">
                  <div className="font-display text-3xl font-extrabold text-[#00490E]">
                    {batteryKwh}{' '}
                    <span className="text-base font-normal text-[#40493D]">kWh</span>
                  </div>
                  <p className="text-[11px] text-[#40493D] mt-1">
                    48V DC LiFePO4 Bank
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-[20px] p-5 border border-[#E5E0DD] shadow-sm flex flex-col justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#707A6C]">
                  Inverter Rating
                </span>
                <div className="mt-3">
                  <div className="font-display text-3xl font-extrabold text-[#00490E]">
                    {inverterKva}{' '}
                    <span className="text-base font-normal text-[#40493D]">kVA</span>
                  </div>
                  <p className="text-[11px] text-[#40493D] mt-1">
                    Pure Sine Wave Hybrid
                  </p>
                </div>
              </div>
            </div>

            {/* Confidence Banner */}
            <div className="bg-[#ECEFE6] rounded-xl p-4 border border-[#92D78B] flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#00490E] shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#00490E] block">
                  Engineering Confidence: High
                </span>
                <p className="text-xs text-[#40493D] mt-0.5">
                  Integrated multi-variable system calculation cross-validating load, battery autonomy, inverter peak capacity, grid reliability, and solar array yield.
                </p>
              </div>
            </div>

            {/* System Blueprint Specifications */}
            <div className="bg-white rounded-[20px] p-6 border border-[#E5E0DD] shadow-sm space-y-4">
              <h3 className="font-display text-base font-bold text-[#1F1B17] flex items-center gap-2">
                <Zap size={16} className="text-[#00490E]" />
                Engineered System Balance Summary
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-[#FFF8F5] rounded-xl border border-[#E5E0DD]">
                  <span className="text-[10px] uppercase font-bold text-[#707A6C] block mb-0.5">
                    Solar Generation Margin
                  </span>
                  <span className="font-display text-lg font-bold text-[#00490E]">
                    {(arrayKwp * 4.8 * 0.8).toFixed(1)} kWh/day
                  </span>
                  <p className="text-[11px] text-[#40493D] mt-0.5">Yields {Math.round(((arrayKwp * 4.8 * 0.8) / dailyKwh) * 100)}% of daily demand in {location}</p>
                </div>

                <div className="p-3.5 bg-[#FFF8F5] rounded-xl border border-[#E5E0DD]">
                  <span className="text-[10px] uppercase font-bold text-[#707A6C] block mb-0.5">
                    Grid Outage Autonomy
                  </span>
                  <span className="font-display text-lg font-bold text-[#00490E]">
                    {autonomyDays * 24} Hours
                  </span>
                  <p className="text-[11px] text-[#40493D] mt-0.5">Full blackout protection at rated load</p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full py-3.5 bg-[#00490E] text-white rounded-full text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#003006] transition-all shadow-sm"
              >
                Open Full Multi-Step Sizing Wizard
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Stitch Bento Grid Features */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-[#E5E0DD] rounded-[20px] p-6 shadow-sm flex flex-col gap-4">
            <div className="w-12 h-12 rounded-full bg-[#ECEFE6] flex items-center justify-center text-[#00490E]">
              <Activity size={22} />
            </div>
            <h3 className="font-display text-lg font-bold text-[#00490E]">Comprehensive Profiling</h3>
            <p className="font-sans text-xs text-[#40493D] leading-relaxed">
              Accurately calculate your load profile across varying seasons and operational conditions.
            </p>
          </div>

          <div className="bg-white border border-[#E5E0DD] rounded-[20px] p-6 shadow-sm flex flex-col gap-4 md:col-span-2 relative overflow-hidden">
            <div className="relative z-10 flex flex-col h-full justify-between gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-display text-lg font-bold text-[#00490E] mb-1">
                    Energy Balance Validation
                  </h3>
                  <p className="font-sans text-xs text-[#40493D] max-w-md">
                    Instantly verify system viability with strict Pass/Fail status for energy balance and capacity thresholds.
                  </p>
                </div>
                <CheckCircle2 className="text-[#4D661C] w-8 h-8" />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4 border-t border-[#E5E0DD] pt-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#707A6C] mb-0.5">
                    ARRAY CAPACITY
                  </p>
                  <p className="font-mono text-sm font-bold text-[#00490E]">NOMINAL</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#707A6C] mb-0.5">
                    AUTONOMY
                  </p>
                  <p className="font-mono text-sm font-bold text-[#4D661C]">{autonomyDays} DAYS</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Stitch FAQ Section */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-16 border-t border-[#E5E0DD]">
        <div className="bg-white border border-[#E5E0DD] rounded-[20px] p-8 shadow-sm">
          <h2 className="font-display text-2xl font-bold text-[#00490E] mb-8 border-b border-[#E5E0DD] pb-4">
            Frequently Asked Questions
          </h2>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h4 className="font-display text-base font-bold text-[#1F1B17]">
                &quot;How many panels do I need?&quot;
              </h4>
              <p className="font-sans text-xs text-[#40493D] leading-relaxed">
                Our calculator takes your exact location, roof space, and daily load profile to determine the precise number and wattage of panels required to meet your energy demands with built-in redundancy.
              </p>
            </div>
            <div className="w-full h-px bg-[#E5E0DD]" />
            <div className="flex flex-col gap-2">
              <h4 className="font-display text-base font-bold text-[#1F1B17]">
                &quot;What battery capacity is right for Lagos?&quot;
              </h4>
              <p className="font-sans text-xs text-[#40493D] leading-relaxed">
                We factor in regional peak sun hours, historical cloud cover data, and specific local autonomy requirements to size battery banks that guarantee uptime during prolonged outages typical in the region.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Waitlist Form */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-12">
        <PublicWaitlistForm
          title="Export Full Solar Engineering Reports"
          subtitle="Generate bankable system sizing documentation, single-line schematics, and installer distribution RFQs across Nigeria."
        />
      </section>

      {/* Sizer Wizard Modal */}
      {isModalOpen && (
        <SolarSizerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </main>
  );
}
