'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { calculateBatteryCapacity } from '@/lib/engineering/calculators/batteryCapacity';
import { SharedCalculationResult } from '@/lib/engineering/types';
import { BatteryCapacityModal } from '@/shared/components/tools/battery-capacity/BatteryCapacityModal';
import { PublicWaitlistForm } from '@/shared/components/tools/PublicWaitlistForm';
import {
  BatteryCharging,
  ArrowRight,
  Battery,
  CloudSun,
  FlaskConical,
  TrendingDown,
  ShieldCheck,
  ChevronDown,
  Sliders,
  Play,
  CheckCircle2,
  Zap,
} from 'lucide-react';

export function BatteryCapacityClient() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [dailyKwh, setDailyKwh] = useState<number>(20.0);
  const [autonomyDays, setAutonomyDays] = useState<number>(1.0);
  const [dod, setDod] = useState<number>(0.8);
  const [dcVoltage, setDcVoltage] = useState<12 | 24 | 48>(48);
  const [inverterEff, setInverterEff] = useState<number>(0.95);

  const result: SharedCalculationResult = calculateBatteryCapacity({
    dailyEnergyKwh: dailyKwh,
    daysOfAutonomy: autonomyDays,
    depthOfDischargePercent: dod * 100,
    systemVoltage: dcVoltage,
    inverterEfficiency: inverterEff,
    chemistry: dod > 0.6 ? 'LITHIUM_LIFEPO4' : 'TUBULAR_GEL',
  });

  const resData = result.engineering_results;
  const installedKwh = resData?.installed_battery_capacity_kwh ?? Math.round((dailyKwh * autonomyDays) / (dod * inverterEff) * 10) / 10;
  const bankAh = resData?.battery_bank_capacity_ah ?? Math.round(((installedKwh * 1000) / dcVoltage));
  const usableKwh = (dailyKwh * autonomyDays).toFixed(1);
  const estDischargeAmps = Math.round((dailyKwh * 1000) / (24 * dcVoltage));

  return (
    <main className="bg-[#FFF8F5] text-[#1F1B17] font-sans min-h-screen pb-24 antialiased">
      {/* 1. Stitch Hero Section */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 pt-12 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6 relative">
            <div className="inline-flex items-center gap-2 text-[#00490E] font-sans font-bold text-xs uppercase tracking-wider w-max bg-[#ECEFE6] px-3 py-1 rounded-full border border-[#BFCABA]/50">
              <BatteryCharging className="w-4 h-4 text-[#00490E]" />
              STORAGE &amp; AUTONOMY
            </div>

            <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-[#00490E] tracking-tight leading-tight">
              Precision Battery Capacity Sizing
            </h1>

            <p className="font-sans text-base sm:text-lg text-[#40493D] max-w-xl leading-relaxed">
              Engineered for high-stakes environments. Calculate precise energy storage requirements based on Depth of Discharge (DoD), system efficiency, and critical autonomy days to ensure absolute reliability during extended outages or low-yield periods.
            </p>

            <div className="flex flex-wrap gap-4 mt-2">
              <a
                href="#interactive-workspace"
                className="bg-[#00490E] text-white px-8 py-3.5 rounded-lg font-sans font-semibold text-sm hover:bg-[#003006] transition-all shadow-sm flex items-center gap-2"
              >
                Calculate My Requirement
                <ArrowRight size={18} />
              </a>

              <button
                onClick={() => setIsModalOpen(true)}
                className="border border-[#00490E] text-[#00490E] px-6 py-3.5 rounded-lg font-sans font-semibold text-sm hover:bg-[#ECEFE6] transition-all flex items-center gap-2"
              >
                <Play size={16} />
                Launch Step-by-Step Wizard
              </button>
            </div>
          </div>

          {/* Stitch Hero Image Card */}
          <div className="relative h-[380px] sm:h-[420px] w-full rounded-[20px] overflow-hidden border border-[#E5E0DD] bg-white shadow-sm">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuC9CZzWmy8aPLNNLHlcY-Lb90pWE3C2LQkkdGvoHj7TbwQQB3w4oQ6lmysj5DnFSnD6kfESCNWoIGnqua9M8wtc7XVmEC5OdV6ns8dhngubWdRu52w0S2r-wcW-7UjyqSiqwDrTT-BMnUTdQyW-tE0F9lY_O1SX3v8wsm8U3M0uBU7plRSfnfaP3GlzZ-JQWNuahQRyvFd0bwdAjnZSxOqQsjBW959sJEP4qiCFE5RcXo2t1po3cPJUbg')`,
              }}
            />
            <div className="absolute bottom-6 right-6 flex gap-4">
              <div className="bg-white/95 backdrop-blur-md p-4 rounded-xl border border-[#E5E0DD] shadow-md">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#00490E]/70 mb-0.5">
                  CHEMISTRY
                </div>
                <div className="text-sm font-bold text-[#1F1B17]">
                  LiFePO4 Optimized
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Calculator Workspace */}
      <section id="interactive-workspace" className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-12 border-t border-[#E5E0DD]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Input Parameters */}
          <div className="lg:col-span-5 bg-white rounded-[20px] border border-[#E5E0DD] p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-[#E5E0DD] pb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#00490E]" />
                <h2 className="font-display text-lg font-bold text-[#00490E]">
                  Storage Parameters
                </h2>
              </div>
              <span className="text-[11px] font-bold uppercase text-[#4D661C] bg-[#F6ECE6] px-2.5 py-0.5 rounded-full border border-[#E5E0DD]">
                Real-Time
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#40493D] uppercase tracking-wider mb-1.5">
                  Daily Energy Demand (kWh/day)
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
                  Autonomy Days (Outage Coverage)
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
                  Battery Chemistry &amp; Depth of Discharge (DoD)
                </label>
                <select
                  value={dod}
                  onChange={(e) => setDod(Number(e.target.value))}
                  className="w-full bg-[#FFF8F5] border border-[#E5E0DD] rounded-lg px-4 py-3 text-xs font-sans text-[#1F1B17] focus:border-[#00490E] focus:outline-none"
                >
                  <option value={0.8}>Lithium LiFePO4 (80% DoD — 6,000 Cycles)</option>
                  <option value={0.9}>Lithium LiFePO4 Premium (90% DoD)</option>
                  <option value={0.5}>Tubular Gel / Lead-Acid (50% DoD — 1,500 Cycles)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#40493D] uppercase tracking-wider mb-1.5">
                  System DC Bus Voltage
                </label>
                <select
                  value={dcVoltage}
                  onChange={(e) => setDcVoltage(Number(e.target.value) as 12 | 24 | 48)}
                  className="w-full bg-[#FFF8F5] border border-[#E5E0DD] rounded-lg px-4 py-3 text-xs font-sans text-[#1F1B17] focus:border-[#00490E] focus:outline-none"
                >
                  <option value={48}>48V DC (Standard Residential &amp; Commercial)</option>
                  <option value={24}>24V DC (Small Cabin / Rural Outpost)</option>
                  <option value={12}>12V DC (Small DC Backup)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right: Live Sizing Results & Key Engineering Outputs */}
          <div className="lg:col-span-7 space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-[20px] p-6 border border-[#E5E0DD] shadow-sm flex flex-col justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#707A6C]">
                  Installed Storage Capacity
                </span>
                <div className="mt-3">
                  <div className="font-display text-4xl font-extrabold text-[#00490E]">
                    {installedKwh}{' '}
                    <span className="text-xl font-normal text-[#40493D]">kWh</span>
                  </div>
                  <p className="text-xs text-[#40493D] mt-1">
                    Usable Energy: {usableKwh} kWh @ {(dod * 100).toFixed(0)}% DoD
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-[20px] p-6 border border-[#E5E0DD] shadow-sm flex flex-col justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#707A6C]">
                  Bank Capacity in Amp-Hours
                </span>
                <div className="mt-3">
                  <div className="font-display text-4xl font-extrabold text-[#00490E]">
                    {bankAh}{' '}
                    <span className="text-xl font-normal text-[#40493D]">Ah</span>
                  </div>
                  <p className="text-xs text-[#40493D] mt-1">
                    @ {dcVoltage}V DC Bus Configuration
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
                  Battery storage engineered from exact autonomy requirement, chemistry DoD limits, and peak current discharge ratings.
                </p>
              </div>
            </div>

            {/* Practical Interpretation & Next Step */}
            <div className="bg-white rounded-[20px] p-6 border border-[#E5E0DD] shadow-sm space-y-4">
              <h3 className="font-display text-base font-bold text-[#1F1B17] flex items-center gap-2">
                <Zap size={16} className="text-[#00490E]" />
                Storage Execution Specifications
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-[#FFF8F5] rounded-xl border border-[#E5E0DD]">
                  <span className="text-[10px] uppercase font-bold text-[#707A6C] block mb-0.5">
                    Estimated Continuous Discharge
                  </span>
                  <span className="font-display text-lg font-bold text-[#00490E]">
                    ~{estDischargeAmps} A
                  </span>
                  <p className="text-[11px] text-[#40493D] mt-0.5">Within standard BMS continuous limits</p>
                </div>

                <div className="p-3.5 bg-[#FFF8F5] rounded-xl border border-[#E5E0DD]">
                  <span className="text-[10px] uppercase font-bold text-[#707A6C] block mb-0.5">
                    Recommended Modular Unit
                  </span>
                  <span className="font-display text-lg font-bold text-[#00490E]">
                    {Math.max(1, Math.ceil(installedKwh / 5.12))} × 5.12 kWh
                  </span>
                  <p className="text-[11px] text-[#40493D] mt-0.5">Standard 48V rack-mount LiFePO4 modules</p>
                </div>
              </div>

              <Link
                href="/tools/inverter-sizing"
                className="w-full py-3.5 bg-[#00490E] text-white rounded-full text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#003006] transition-all shadow-sm"
              >
                Size Inverter for this Battery Bank
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Stitch Technical Fundamentals (Bento Grid) */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-16">
        <div className="border-b border-[#E5E0DD] pb-4 mb-8">
          <h2 className="font-display text-3xl font-extrabold text-[#00490E] tracking-tight">
            System Variables &amp; Parameters
          </h2>
          <p className="font-sans text-sm text-[#40493D] mt-2 max-w-2xl">
            Understanding the critical metrics that govern storage reliability and component lifespan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* DoD Card */}
          <div className="bg-white rounded-[20px] border border-[#E5E0DD] p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center gap-3 mb-4 text-[#00490E]">
                <div className="bg-[#ECEFE6] p-2.5 rounded-xl">
                  <Battery size={20} />
                </div>
                <h3 className="font-display text-lg font-bold">Depth of Discharge (DoD)</h3>
              </div>
              <p className="font-sans text-xs text-[#40493D] leading-relaxed">
                The percentage of the battery that has been discharged relative to overall capacity. Deep discharging degrades lifespan. We optimize for high-cycle longevity.
              </p>
            </div>
            <div className="mt-6 border-t border-[#E5E0DD] pt-4 flex justify-between items-end">
              <span className="text-[11px] font-bold uppercase text-[#707A6C]">TYPICAL LiFePO4 DOD</span>
              <span className="font-mono text-xs font-bold text-[#00490E]">80% - 90%</span>
            </div>
          </div>

          {/* Autonomy Card */}
          <div className="md:col-span-2 bg-white rounded-[20px] border border-[#E5E0DD] p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4 text-[#00490E]">
              <div className="bg-[#ECEFE6] p-2.5 rounded-xl">
                <CloudSun size={20} />
              </div>
              <h3 className="font-display text-lg font-bold">Days of Autonomy</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <p className="font-sans text-xs text-[#40493D] leading-relaxed">
                The number of consecutive days a system can support the critical load without active generation (e.g., during prolonged heavy rain or grid failure).
              </p>
              <div className="space-y-2">
                <div className="bg-[#FFF8F5] rounded-lg p-2.5 border border-[#E5E0DD] flex justify-between items-center text-xs">
                  <span className="text-[#707A6C]">Residential</span>
                  <span className="font-bold text-[#1F1B17]">1-2 Days</span>
                </div>
                <div className="bg-[#FFF8F5] rounded-lg p-2.5 border border-[#E5E0DD] flex justify-between items-center text-xs">
                  <span className="text-[#707A6C]">Commercial</span>
                  <span className="font-bold text-[#1F1B17]">2-3 Days</span>
                </div>
                <div className="bg-[#ECEFE6] rounded-lg p-2.5 border border-[#92D78B] flex justify-between items-center text-xs">
                  <span className="font-bold text-[#00490E]">Critical Infrastructure</span>
                  <span className="font-bold text-[#00490E]">3-5+ Days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chemistry Card */}
          <div className="bg-white rounded-[20px] border border-[#E5E0DD] p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center gap-3 mb-4 text-[#00490E]">
                <div className="bg-[#ECEFE6] p-2.5 rounded-xl">
                  <FlaskConical size={20} />
                </div>
                <h3 className="font-display text-lg font-bold">Chemistry: LiFePO4</h3>
              </div>
              <p className="font-sans text-xs text-[#40493D] leading-relaxed">
                Lithium Iron Phosphate represents the current standard for stationary storage, offering superior thermal stability and cycle life compared to NMC variants.
              </p>
            </div>
            <div className="mt-6 border-t border-[#E5E0DD] pt-4 flex justify-between items-end">
              <span className="text-[11px] font-bold uppercase text-[#707A6C]">EXPECTED CYCLES</span>
              <span className="font-mono text-xs font-bold text-[#00490E]">&gt;6,000 @ 80% DoD</span>
            </div>
          </div>

          {/* Efficiency Card */}
          <div className="bg-white rounded-[20px] border border-[#E5E0DD] p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center gap-3 mb-4 text-[#00490E]">
                <div className="bg-[#ECEFE6] p-2.5 rounded-xl">
                  <TrendingDown size={20} />
                </div>
                <h3 className="font-display text-lg font-bold">System Efficiency</h3>
              </div>
              <p className="font-sans text-xs text-[#40493D] leading-relaxed">
                Accounts for losses in the inverter, charge controller, and the battery&apos;s inherent round-trip efficiency. Essential for preventing undersizing.
              </p>
            </div>
            <div className="mt-6 border-t border-[#E5E0DD] pt-4 flex justify-between items-end">
              <span className="text-[11px] font-bold uppercase text-[#707A6C]">ROUND-TRIP EFFICIENCY</span>
              <span className="font-mono text-xs font-bold text-[#00490E]">~95% (Li-ion)</span>
            </div>
          </div>

          {/* Validation Card */}
          <div className="bg-white rounded-[20px] border border-[#E5E0DD] p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center gap-3 mb-4 text-[#00490E]">
                <div className="bg-[#ECEFE6] p-2.5 rounded-xl">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="font-display text-lg font-bold">C-Rate Validation</h3>
              </div>
              <p className="font-sans text-xs text-[#40493D] leading-relaxed">
                Ensuring the selected capacity can safely deliver peak power demands. Charge/discharge rate compatibility is a hard constraint for system validity.
              </p>
            </div>
            <div className="mt-6 border-t border-[#E5E0DD] pt-4 flex justify-between items-end">
              <span className="text-[11px] font-bold uppercase text-[#707A6C]">STANDARD C-RATE</span>
              <span className="font-mono text-xs font-bold text-[#00490E]">0.5C Continuous</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Stitch FAQ & CTA Section */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-16 border-t border-[#E5E0DD]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-display text-2xl font-bold text-[#00490E] border-b border-[#E5E0DD] pb-4">
              Common Technical Inquiries
            </h2>

            <div className="space-y-4">
              <details className="group bg-white rounded-[20px] border border-[#E5E0DD] p-6 shadow-sm open:shadow-md transition-all">
                <summary className="flex justify-between items-center font-display text-base font-bold text-[#1F1B17] cursor-pointer list-none">
                  How much battery capacity is required for one day of backup?
                  <ChevronDown className="w-5 h-5 text-[#707A6C] transition-transform group-open:rotate-180" />
                </summary>
                <div className="mt-4 pt-4 border-t border-[#E5E0DD] text-xs text-[#40493D] leading-relaxed">
                  This depends entirely on your total daily energy consumption (measured in kWh). If your facility uses 20 kWh per day, you need a bare minimum of 20 kWh usable capacity. However, factoring in a safe Depth of Discharge (e.g., 80%) and system inefficiencies (~5%), a nominal capacity of approximately 26.3 kWh would be required for a single day of autonomy.
                </div>
              </details>

              <details className="group bg-white rounded-[20px] border border-[#E5E0DD] p-6 shadow-sm open:shadow-md transition-all">
                <summary className="flex justify-between items-center font-display text-base font-bold text-[#1F1B17] cursor-pointer list-none">
                  What exactly is Depth of Discharge (DoD) and why does it matter?
                  <ChevronDown className="w-5 h-5 text-[#707A6C] transition-transform group-open:rotate-180" />
                </summary>
                <div className="mt-4 pt-4 border-t border-[#E5E0DD] text-xs text-[#40493D] leading-relaxed">
                  Depth of Discharge (DoD) indicates the percentage of the battery that has been discharged relative to its overall capacity. For example, discharging a 100Ah battery by 80Ah means an 80% DoD. It matters critically because cycle life decreases exponentially as DoD increases. We constrain DoD in our calculations to guarantee the financial viability and longevity of the storage asset.
                </div>
              </details>

              <details className="group bg-white rounded-[20px] border border-[#E5E0DD] p-6 shadow-sm open:shadow-md transition-all">
                <summary className="flex justify-between items-center font-display text-base font-bold text-[#1F1B17] cursor-pointer list-none">
                  Why prioritize LiFePO4 over other lithium chemistries?
                  <ChevronDown className="w-5 h-5 text-[#707A6C] transition-transform group-open:rotate-180" />
                </summary>
                <div className="mt-4 pt-4 border-t border-[#E5E0DD] text-xs text-[#40493D] leading-relaxed">
                  Lithium Iron Phosphate (LiFePO4) trades slight energy density for significant gains in thermal stability, safety, and cycle life. In stationary engineering applications where physical space is less constrained than in electric vehicles, the superior cycle life (often exceeding 6,000 cycles) and zero risk of thermal runaway make it the objectively superior choice for infrastructure reliability.
                </div>
              </details>
            </div>
          </div>

          {/* Sizing Tool CTA Widget */}
          <div className="bg-[#ECEFE6] rounded-[20px] p-8 border border-[#BFCABA]/50 flex flex-col gap-6 sticky top-24">
            <div className="flex items-center gap-3 text-[#00490E]">
              <div className="bg-white p-2.5 rounded-xl border border-[#E5E0DD]">
                <BatteryCharging size={22} />
              </div>
              <h3 className="font-display text-lg font-bold">Storage Sizing Tool</h3>
            </div>
            <p className="font-sans text-xs text-[#40493D] leading-relaxed">
              Input your load profile, desired autonomy, and environmental constraints to generate a technical specification for your storage requirements.
            </p>
            <div className="space-y-3">
              <a
                href="#interactive-workspace"
                className="w-full py-3 bg-[#00490E] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#003006] transition-all shadow-sm"
              >
                Configure Storage
                <ArrowRight size={14} />
              </a>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full py-3 bg-white text-[#00490E] border border-[#00490E] rounded-lg text-xs font-semibold hover:bg-[#FFF8F5] transition-all"
              >
                Open Sizing Wizard
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Waitlist Form */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-12">
        <PublicWaitlistForm
          title="Export Battery Storage Engineering Reports"
          subtitle="Join the waitlist to unlock battery discharge curve modeling, automated thermal degradation forecasts, and supplier RFQ distribution across Nigeria."
        />
      </section>

      {/* Sizer Modal */}
      {isModalOpen && (
        <BatteryCapacityModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </main>
  );
}
