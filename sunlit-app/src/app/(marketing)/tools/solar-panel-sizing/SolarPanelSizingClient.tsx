'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { calculateSolarPanelSizing } from '@/lib/engineering/calculators/solarPanelSizing';
import { SharedCalculationResult } from '@/lib/engineering/types';
import { SolarPanelModal } from '@/shared/components/tools/solar-panel/SolarPanelModal';
import { PublicWaitlistForm } from '@/shared/components/tools/PublicWaitlistForm';
import {
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Play,
  Layers,
  Info,
} from 'lucide-react';

export function SolarPanelSizingClient() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [annualKwh, setAnnualKwh] = useState<number>(7500);
  const [roofSpaceM2, setRoofSpaceM2] = useState<number>(45);
  const [moduleWattage, setModuleWattage] = useState<number>(550);
  const [psh, setPsh] = useState<number>(4.8);

  const result: SharedCalculationResult = calculateSolarPanelSizing({
    dailyEnergyDemandKwh: annualKwh / 365,
    panelWattage: moduleWattage,
    peakSunHours: psh,
  });

  const resData = result.engineering_results;
  const requiredKwp = resData?.recommended_array_kwp ?? Math.round((annualKwh / (365 * psh * 0.8)) * 10) / 10;
  const recommendedPanels = resData?.recommended_panel_count ?? Math.ceil((requiredKwp * 1000) / moduleWattage);
  const estAreaRequired = Math.round(recommendedPanels * 2.2 * 10) / 10;
  const fitsRoof = estAreaRequired <= roofSpaceM2;

  return (
    <main className="bg-[#FFF8F5] text-[#1F1B17] font-sans min-h-screen pb-24 antialiased">
      {/* 1. Stitch Hero Section */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 pt-12 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="flex items-center gap-2 text-[#00490E] font-sans font-bold text-xs uppercase tracking-widest bg-[#ECEFE6] px-3 py-1 rounded-full w-fit border border-[#BFCABA]/50">
              <Zap size={14} className="text-[#00490E]" />
              PV GENERATION SIZING
            </div>

            <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-[#00490E] tracking-tight leading-tight">
              Solar Panel Sizing Tool
            </h1>

            <p className="font-sans text-base sm:text-lg text-[#40493D] max-w-lg leading-relaxed">
              Precision engineering for optimal PV capacity. Calculate exact module power requirements against real-world yield and orientation losses to perfectly match array size to your energy demand and roof space.
            </p>

            <div className="flex flex-wrap gap-4 mt-2">
              <a
                href="#interactive-workspace"
                className="bg-[#00490E] text-white px-8 py-3.5 rounded-lg font-sans font-semibold text-sm shadow-sm hover:bg-[#003006] transition-all flex items-center gap-2"
              >
                Calculate My Solar Panel Requirement
                <ArrowRight size={16} />
              </a>
              <button
                onClick={() => setIsModalOpen(true)}
                className="border border-[#00490E] text-[#00490E] px-6 py-3.5 rounded-lg font-sans font-semibold text-sm hover:bg-[#ECEFE6] transition-all flex items-center gap-2"
              >
                <Play size={16} />
                Open Sizing Wizard
              </button>
            </div>
          </div>

          {/* Stitch Hero Blueprint Visual */}
          <div className="lg:col-span-6 mt-6 lg:mt-0">
            <div className="bg-white p-6 rounded-[20px] border border-[#E5E0DD] shadow-sm relative overflow-hidden h-[360px] flex flex-col justify-between">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-15"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAveWRLv7bipeqxuKyY6FCG_z8Tt6hZPETGS0MDTAs3vnZ6yLtoJPS0rcSQpF4--OQe70pEJrH9iF2Oh4c7fcaU4LV7zflnlKjCz8lx-P5ahmxno-sfh-gAcAUqdc7-G6UOU-EeV1bC_6idnKInwFccASGbW0qgwoi6R5CEyeyBsQW2IVuROvZnCC9fK7yWSiGhcyg8wfDEF_jTURrUQPi-U0aWZ5qOU1VuUUnlSLMgCqcZg2lYvPvmVg')`,
                }}
              />
              <div className="relative z-10 flex justify-between items-start">
                <div className="bg-[#ECEFE6] py-1.5 px-3.5 rounded-full border border-[#BFCABA]/40 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00490E]" />
                  <span className="text-xs font-bold text-[#00490E]">System Nominal</span>
                </div>
                <Layers className="text-[#00490E]" size={20} />
              </div>

              <div className="relative z-10 grid grid-cols-2 gap-4 mt-auto">
                <div className="bg-[#FFF8F5]/90 backdrop-blur-sm p-4 rounded-xl border border-[#E5E0DD]">
                  <div className="text-[10px] font-bold uppercase text-[#707A6C] mb-0.5">REAL-WORLD PR</div>
                  <div className="font-display text-2xl font-bold text-[#00490E]">
                    82<span className="text-sm font-normal text-[#707A6C]">%</span>
                  </div>
                </div>
                <div className="bg-[#FFF8F5]/90 backdrop-blur-sm p-4 rounded-xl border border-[#E5E0DD]">
                  <div className="text-[10px] font-bold uppercase text-[#707A6C] mb-0.5">SOILING &amp; LOSS</div>
                  <div className="font-display text-2xl font-bold text-[#4D661C]">
                    -14<span className="text-sm font-normal text-[#707A6C]">%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Parameter Configuration */}
      <section id="interactive-workspace" className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-12 border-t border-[#E5E0DD]">
        <div className="bg-white rounded-[20px] border border-[#E5E0DD] overflow-hidden shadow-sm">
          <div className="p-6 md:p-8 border-b border-[#E5E0DD] bg-[#FFF8F5] flex justify-between items-center">
            <h2 className="font-display text-xl font-bold text-[#00490E] flex items-center gap-2">
              <Sliders size={20} className="text-[#00490E]" />
              Parameter Configuration
            </h2>
            <span className="text-xs font-bold uppercase text-[#4D661C] bg-[#ECEFE6] px-3 py-1 rounded-full border border-[#BFCABA]/40">
              Live Sizer
            </span>
          </div>

          <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Inputs */}
            <div className="lg:col-span-7 flex flex-col gap-6 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-bold text-[#40493D] uppercase tracking-wider mb-1.5">
                    Annual Energy Demand (kWh)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={annualKwh}
                      onChange={(e) => setAnnualKwh(Math.max(100, Number(e.target.value)))}
                      className="w-full bg-[#FFF8F5] border border-[#E5E0DD] rounded-lg p-3 font-mono text-sm text-[#1F1B17] focus:border-[#00490E] focus:outline-none shadow-inner"
                    />
                    <span className="absolute right-3 top-3.5 text-xs text-[#707A6C] font-mono">kWh/yr</span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#40493D] uppercase tracking-wider mb-1.5">
                    Available Roof Space (m²)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={roofSpaceM2}
                      onChange={(e) => setRoofSpaceM2(Math.max(5, Number(e.target.value)))}
                      className="w-full bg-[#FFF8F5] border border-[#E5E0DD] rounded-lg p-3 font-mono text-sm text-[#1F1B17] focus:border-[#00490E] focus:outline-none shadow-inner"
                    />
                    <span className="absolute right-3 top-3.5 text-xs text-[#707A6C] font-mono">m²</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-bold text-[#40493D] uppercase tracking-wider mb-1.5">
                    Module Power Rating (Wp)
                  </label>
                  <select
                    value={moduleWattage}
                    onChange={(e) => setModuleWattage(Number(e.target.value))}
                    className="w-full bg-[#FFF8F5] border border-[#E5E0DD] rounded-lg p-3 text-xs text-[#1F1B17] focus:border-[#00490E] focus:outline-none"
                  >
                    <option value={550}>550 Wp — Tier-1 Mono PERC (Standard)</option>
                    <option value={450}>450 Wp — High Efficiency Compact</option>
                    <option value={600}>600 Wp — Commercial Bifacial</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#40493D] uppercase tracking-wider mb-1.5">
                    Location Peak Sun Hours
                  </label>
                  <select
                    value={psh}
                    onChange={(e) => setPsh(Number(e.target.value))}
                    className="w-full bg-[#FFF8F5] border border-[#E5E0DD] rounded-lg p-3 text-xs text-[#1F1B17] focus:border-[#00490E] focus:outline-none"
                  >
                    <option value={4.8}>4.8 PSH — Lagos / South-West</option>
                    <option value={5.5}>5.5 PSH — Abuja / Central</option>
                    <option value={6.2}>6.2 PSH — Kano / Northern Belt</option>
                    <option value={4.3}>4.3 PSH — Port Harcourt / Niger Delta</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Calculated Requirement Output Card */}
            <div className="lg:col-span-5 bg-[#F6ECE6] rounded-xl p-6 border border-[#E5E0DD] flex flex-col justify-between gap-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#00490E] block mb-4">
                  Calculated Requirement
                </span>

                <div className="space-y-4">
                  <div className="flex justify-between items-end border-b border-[#E5E0DD] pb-2">
                    <span className="text-xs text-[#40493D]">Required System Capacity</span>
                    <span className="font-display text-2xl font-bold text-[#00490E]">
                      {requiredKwp} <span className="text-xs font-normal text-[#707A6C]">kWp</span>
                    </span>
                  </div>

                  <div className="flex justify-between items-end border-b border-[#E5E0DD] pb-2">
                    <span className="text-xs text-[#40493D]">Recommended Modules</span>
                    <span className="font-display text-xl font-bold text-[#1F1B17]">
                      {recommendedPanels} <span className="text-xs font-normal text-[#707A6C]">panels</span>
                    </span>
                  </div>

                  <div className="flex justify-between items-end pb-2">
                    <span className="text-xs text-[#40493D]">Est. Space Required</span>
                    <span className={`font-mono text-xs font-bold ${fitsRoof ? 'text-[#00490E]' : 'text-[#BA1A1A]'}`}>
                      {estAreaRequired} m² {fitsRoof ? '(Fits roof)' : '(EXCEEDS roof space)'}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/tools/pv-configuration"
                className="w-full py-3 bg-[#00490E] text-white rounded-full text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#003006] transition-all shadow-sm"
              >
                Configure Strings for this Array
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Waitlist Form */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-12">
        <PublicWaitlistForm
          title="Export Solar Array Sizing Documentation"
          subtitle="Generate roof structural load assessments, string layouts, and verified installer bills of materials."
        />
      </section>

      {/* Sizer Modal */}
      {isModalOpen && (
        <SolarPanelModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </main>
  );
}
