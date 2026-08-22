'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { calculateLoad } from '@/lib/engineering/calculators/loadCalculator';
import { SharedCalculationResult } from '@/lib/engineering/types';
import { ApplianceLoadModal } from '@/shared/components/tools/appliance-load/ApplianceLoadModal';
import { PublicWaitlistForm } from '@/shared/components/tools/PublicWaitlistForm';
import {
  Sliders,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Search,
  Plus,
  Trash2,
  Zap,
  Activity,
  Play,
} from 'lucide-react';

interface ApplianceRow {
  id: string;
  name: string;
  qty: number;
  watts: number;
  surgeFactor: number;
  hours: number;
}

const DEFAULT_APPLIANCES: ApplianceRow[] = [
  { id: '1', name: 'Inverter AC 1.5 HP', qty: 2, watts: 1100, surgeFactor: 2.0, hours: 8 },
  { id: '2', name: 'Deep Freezer (Inverter)', qty: 1, watts: 180, surgeFactor: 2.5, hours: 24 },
  { id: '3', name: 'Submersible Water Pump', qty: 1, watts: 1100, surgeFactor: 3.0, hours: 1 },
  { id: '4', name: 'LED Lighting & Smart TVs', qty: 8, watts: 30, surgeFactor: 1.0, hours: 6 },
];

export function LoadCalculatorClient() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [appliances, setAppliances] = useState<ApplianceRow[]>(DEFAULT_APPLIANCES);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [customName, setCustomName] = useState<string>('Custom Appliance');
  const [customWatts, setCustomWatts] = useState<number>(500);
  const [customSurge, setCustomSurge] = useState<number>(2.0);
  const [customQty, setCustomQty] = useState<number>(1);
  const [customHours, setCustomHours] = useState<number>(4);

  const totalConnectedWatts = appliances.reduce((sum, a) => sum + a.watts * a.qty, 0);
  const totalDailyKwh = appliances.reduce((sum, a) => sum + (a.watts * a.qty * a.hours) / 1000, 0);
  const peakSurgeWatts = appliances.reduce((max, a) => Math.max(max, a.watts * a.qty * a.surgeFactor), 0);
  const peakOperatingWatts = totalConnectedWatts * 0.75;

  const handleAddCustom = () => {
    if (!customWatts) return;
    setAppliances([
      ...appliances,
      {
        id: Date.now().toString(),
        name: customName || 'Custom Load',
        qty: customQty,
        watts: customWatts,
        surgeFactor: customSurge,
        hours: customHours,
      },
    ]);
  };

  const handleRemove = (id: string) => {
    setAppliances(appliances.filter((a) => a.id !== id));
  };

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

        <div className="flex flex-col md:flex-row gap-12 items-start justify-between">
          <div className="flex-1 max-w-2xl flex flex-col gap-6">
            <div className="inline-block px-3 py-1 rounded-full bg-[#ECEFE6] text-[#00490E] font-sans font-bold text-xs uppercase tracking-widest border border-[#BFCABA]/50 w-fit">
              Load Analysis &amp; Profiling
            </div>

            <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-[#00490E] tracking-tight leading-tight">
              Appliance Load Calculator
            </h1>

            <p className="font-sans text-base sm:text-lg text-[#40493D] leading-relaxed">
              Accurate load profiling is the foundation of every solar design. Model connected vs. operating loads, account for surge power, and define precise duty cycles for industrial and residential appliances.
            </p>

            <div className="flex flex-wrap gap-4 mt-2">
              <a
                href="#appliance-workspace"
                className="bg-[#00490E] text-white px-8 py-3.5 rounded-lg font-sans font-semibold text-sm shadow-sm hover:bg-[#003006] transition-all flex items-center gap-2"
              >
                Create My Load Profile
                <ArrowRight size={16} />
              </a>
              <button
                onClick={() => setIsModalOpen(true)}
                className="border border-[#00490E] text-[#00490E] px-6 py-3.5 rounded-lg font-sans font-semibold text-sm hover:bg-[#ECEFE6] transition-all flex items-center gap-2"
              >
                <Play size={16} />
                Open Interactive Wizard
              </button>
            </div>
          </div>

          {/* Stitch Decorative Graphic Card */}
          <div className="w-full md:w-80 h-56 rounded-[20px] border border-[#E5E0DD] bg-[#fff8f5] p-6 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden">
            <div className="w-14 h-14 rounded-full bg-[#ECEFE6] flex items-center justify-center text-[#00490E] mb-3">
              <Activity size={28} />
            </div>
            <span className="font-display text-lg font-bold text-[#00490E]">
              Precision Profiling
            </span>
            <p className="text-xs text-[#707A6C] mt-1">
              Active Hourly Duty-Cycle Engine
            </p>
          </div>
        </div>
      </section>

      {/* 2. Interactive Workspace (Bento Grid) */}
      <section id="appliance-workspace" className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-12 border-t border-[#E5E0DD]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Appliance Catalog & Custom Add */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <div className="bg-[#fff8f5] rounded-[20px] border border-[#E5E0DD] overflow-hidden shadow-sm">
              <div className="p-6 border-b border-[#E5E0DD] bg-[#f6ece6]">
                <h2 className="font-display text-lg font-bold text-[#00490E] flex items-center gap-2">
                  <Search size={18} />
                  Add Custom Appliance
                </h2>
              </div>
              <div className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-[#40493D] uppercase tracking-wider mb-1">
                    Appliance Name
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-[#E5E0DD] text-xs font-sans text-[#1F1B17] bg-[#f6ece6] focus:border-[#00490E] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[#40493D] uppercase tracking-wider mb-1">
                      Base Load (W)
                    </label>
                    <input
                      type="number"
                      value={customWatts}
                      onChange={(e) => setCustomWatts(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-lg border border-[#E5E0DD] text-xs font-mono text-[#1F1B17] bg-[#f6ece6] focus:border-[#00490E] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#40493D] uppercase tracking-wider mb-1">
                      Surge Factor (x)
                    </label>
                    <input
                      type="number"
                      step={0.1}
                      value={customSurge}
                      onChange={(e) => setCustomSurge(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-lg border border-[#E5E0DD] text-xs font-mono text-[#1F1B17] bg-[#f6ece6] focus:border-[#00490E] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[#40493D] uppercase tracking-wider mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={customQty}
                      onChange={(e) => setCustomQty(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-lg border border-[#E5E0DD] text-xs font-mono text-[#1F1B17] bg-[#f6ece6] focus:border-[#00490E] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#40493D] uppercase tracking-wider mb-1">
                      Duty Cycle (Hrs/Day)
                    </label>
                    <input
                      type="number"
                      step={0.5}
                      value={customHours}
                      onChange={(e) => setCustomHours(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-lg border border-[#E5E0DD] text-xs font-mono text-[#1F1B17] bg-[#f6ece6] focus:border-[#00490E] focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddCustom}
                  className="w-full mt-2 bg-[#00490E] text-white px-4 py-2.5 rounded-lg font-sans text-xs font-semibold hover:bg-[#003006] transition-all flex justify-center items-center gap-2 shadow-sm"
                >
                  <Plus size={16} />
                  Add to Load Profile
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Profile Visualization & Aggregate Stats */}
          <div className="md:col-span-7 flex flex-col gap-6">
            {/* 4 Aggregate Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#fff8f5] rounded-[16px] p-4 border border-[#E5E0DD] shadow-sm text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#707A6C] block mb-1">
                  Connected
                </span>
                <span className="font-display text-xl font-extrabold text-[#00490E]">
                  {(totalConnectedWatts / 1000).toFixed(1)}{' '}
                  <span className="text-xs font-normal text-[#40493D]">kW</span>
                </span>
              </div>

              <div className="bg-[#fff8f5] rounded-[16px] p-4 border border-[#E5E0DD] shadow-sm text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#707A6C] block mb-1">
                  Peak Operating
                </span>
                <span className="font-display text-xl font-extrabold text-[#4D661C]">
                  {(peakOperatingWatts / 1000).toFixed(1)}{' '}
                  <span className="text-xs font-normal text-[#40493D]">kW</span>
                </span>
              </div>

              <div className="bg-[#fff8f5] rounded-[16px] p-4 border border-[#E5E0DD] shadow-sm text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#707A6C] block mb-1">
                  Max Surge
                </span>
                <span className="font-display text-xl font-extrabold text-[#00490E]">
                  {(peakSurgeWatts / 1000).toFixed(1)}{' '}
                  <span className="text-xs font-normal text-[#40493D]">kW</span>
                </span>
              </div>

              <div className="bg-[#fff8f5] rounded-[16px] p-4 border border-[#E5E0DD] shadow-sm text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#707A6C] block mb-1">
                  Daily Energy
                </span>
                <span className="font-display text-xl font-extrabold text-[#00490E]">
                  {totalDailyKwh.toFixed(1)}{' '}
                  <span className="text-xs font-normal text-[#40493D]">kWh</span>
                </span>
              </div>
            </div>

            {/* Load Profile Table */}
            <div className="bg-[#fff8f5] rounded-[20px] border border-[#E5E0DD] overflow-hidden shadow-sm">
              <div className="p-5 border-b border-[#E5E0DD] bg-[#f6ece6] flex justify-between items-center">
                <h3 className="font-display text-base font-bold text-[#00490E]">Current Load Profile</h3>
                <span className="text-xs text-[#707A6C] font-mono">{appliances.length} Appliances</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#ECEFE6] border-b border-[#E5E0DD] text-[#707A6C] uppercase font-bold text-[10px]">
                      <th className="p-3.5">Appliance</th>
                      <th className="p-3.5">Qty</th>
                      <th className="p-3.5">Load (W)</th>
                      <th className="p-3.5">Surge</th>
                      <th className="p-3.5">Hrs/Day</th>
                      <th className="p-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E0DD] font-mono">
                    {appliances.map((app) => (
                      <tr key={app.id} className="hover:bg-[#FFF8F5] transition-colors">
                        <td className="p-3.5 font-sans font-bold text-[#1F1B17]">{app.name}</td>
                        <td className="p-3.5">{app.qty}</td>
                        <td className="p-3.5">{app.watts} W</td>
                        <td className="p-3.5">{app.surgeFactor}x</td>
                        <td className="p-3.5">{app.hours} hrs</td>
                        <td className="p-3.5 text-right font-sans">
                          <button
                            onClick={() => handleRemove(app.id)}
                            className="text-[#BA1A1A] hover:opacity-80 p-1"
                            title="Remove"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-5 bg-[#F6ECE6] border-t border-[#E5E0DD] flex justify-between items-center">
                <span className="text-xs font-bold text-[#00490E]">
                  Ready to size system for {totalDailyKwh.toFixed(1)} kWh/day?
                </span>
                <Link
                  href="/tools/solar-system-sizing"
                  className="px-6 py-2 bg-[#00490E] text-white rounded-full text-xs font-semibold hover:bg-[#003006] transition-all shadow-sm"
                >
                  Size Full System
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Waitlist Form */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-12">
        <PublicWaitlistForm
          title="Export Appliance Load Schedule & Diversity Audit"
          subtitle="Generate electrical load balancing audits, phase distribution calculations, and peak breaker sizing schedules."
        />
      </section>

      {/* Sizer Modal */}
      {isModalOpen && (
        <ApplianceLoadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </main>
  );
}
