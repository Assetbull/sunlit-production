'use client';

import { useState } from 'react';
import { calculateLoad, LoadItem } from '@/lib/engineering/calculators/loadCalculator';
import { SharedCalculationResult } from '@/lib/engineering/types';
import { ToolHeader } from '@/shared/components/tools/ToolHeader';
import { ConfidenceIndicator } from '@/shared/components/tools/ConfidenceIndicator';
import { EngineeringNotes } from '@/shared/components/tools/EngineeringNotes';
import { EngineeringReport } from '@/shared/components/tools/EngineeringReport';
import { UnlockReportCTA } from '@/shared/components/tools/UnlockReportCTA';
import { PublicWaitlistForm } from '@/shared/components/tools/PublicWaitlistForm';
import { RelatedToolsList } from '@/shared/components/tools/RelatedToolsList';
import {
  Plus, Trash2, Zap, ArrowRight, ShieldCheck, AlertTriangle,
  Cpu, RotateCcw, CheckCircle2, Tv, Fan, Droplet, Lightbulb, Flame, Laptop
} from 'lucide-react';
import Link from 'next/link';

export interface ExtendedLoadItem extends LoadItem {
  category?: 'Cooling' | 'Lighting' | 'HVAC' | 'Utilities' | 'Entertainment' | 'Computing' | 'General';
  isCritical?: boolean;
  surgeMultiplier?: number;
}

const DEFAULT_STITCH_ITEMS: ExtendedLoadItem[] = [
  { name: 'Refrigerator / Freezer', powerWatts: 300, quantity: 1, hoursPerDay: 24, category: 'Cooling', isCritical: true, surgeMultiplier: 4.0 },
  { name: 'LED Lighting Bulbs', powerWatts: 15, quantity: 10, hoursPerDay: 8, category: 'Lighting', isCritical: true, surgeMultiplier: 1.0 },
  { name: 'Air Conditioner (1.5HP)', powerWatts: 1500, quantity: 2, hoursPerDay: 10, category: 'HVAC', isCritical: false, surgeMultiplier: 3.0 },
  { name: 'Water Pump (1HP)', powerWatts: 1100, quantity: 1, hoursPerDay: 2, category: 'Utilities', isCritical: true, surgeMultiplier: 3.0 },
];

export function LoadCalculatorClient() {
  const [items, setItems] = useState<ExtendedLoadItem[]>(DEFAULT_STITCH_ITEMS);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showReport, setShowReport] = useState<boolean>(false);

  // New Appliance Form State
  const [newItemName, setNewItemName] = useState('');
  const [newItemWatts, setNewItemWatts] = useState(200);
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemHours, setNewItemHours] = useState(6);
  const [newItemCategory, setNewItemCategory] = useState<ExtendedLoadItem['category']>('General');
  const [newItemCritical, setNewItemCritical] = useState(false);

  const result: SharedCalculationResult = calculateLoad({ items });
  const isSuccess = result.calculation_status === 'SUCCESS';
  const resData = result.engineering_results;

  const updateItem = (index: number, field: keyof ExtendedLoadItem, val: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: val };
    setItems(updated);
  };

  const addItem = () => {
    if (!newItemName.trim()) return;
    const itemToAdd: ExtendedLoadItem = {
      name: newItemName.trim(),
      powerWatts: Math.max(1, newItemWatts),
      quantity: Math.max(1, newItemQty),
      hoursPerDay: Math.min(24, Math.max(0, newItemHours)),
      category: newItemCategory,
      isCritical: newItemCritical,
      surgeMultiplier: newItemCategory === 'HVAC' || newItemCategory === 'Cooling' || newItemCategory === 'Utilities' ? 3.0 : 1.0,
    };
    setItems([...items, itemToAdd]);
    setNewItemName('');
    setShowAddModal(false);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const getCategoryIcon = (category?: ExtendedLoadItem['category']) => {
    switch (category) {
      case 'Cooling': return <Flame className="w-5 h-5 text-emerald-800" />;
      case 'Lighting': return <Lightbulb className="w-5 h-5 text-amber-600" />;
      case 'HVAC': return <Fan className="w-5 h-5 text-blue-700" />;
      case 'Utilities': return <Droplet className="w-5 h-5 text-cyan-700" />;
      case 'Computing': return <Laptop className="w-5 h-5 text-indigo-700" />;
      case 'Entertainment': return <Tv className="w-5 h-5 text-purple-700" />;
      default: return <Zap className="w-5 h-5 text-emerald-700" />;
    }
  };

  const getCategoryBadgeClass = (category?: ExtendedLoadItem['category']) => {
    switch (category) {
      case 'Cooling': return 'bg-emerald-100 text-emerald-900 border-emerald-200';
      case 'Lighting': return 'bg-amber-100 text-amber-900 border-amber-200';
      case 'HVAC': return 'bg-blue-100 text-blue-900 border-blue-200';
      case 'Utilities': return 'bg-cyan-100 text-cyan-900 border-cyan-200';
      case 'Computing': return 'bg-indigo-100 text-indigo-900 border-indigo-200';
      case 'Entertainment': return 'bg-purple-100 text-purple-900 border-purple-200';
      default: return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  const hasHighSurge = items.some(
    (item) => (item.category === 'HVAC' || item.category === 'Cooling' || item.category === 'Utilities') && item.powerWatts > 500
  );

  return (
    <main className="bg-[#fff8f5] text-[#1f1b17] font-sans min-h-screen pb-24 antialiased">
      <ToolHeader
        title="Appliance Load Calculator"
        category="Load Sizing & Energy Consumption"
        description="Manage and configure equipment for precision solar system sizing, peak demand estimation, and daily kWh energy consumption."
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-8">
        {/* Stitch Workspace Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 border-b border-stone-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Stitch Visual DNA Workspace
              </span>
              <span className="text-xs text-stone-500 font-medium">• 100% Client Reactive</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#00490e] tracking-tight">
              Active Load Workspace
            </h1>
            <p className="text-stone-600 text-sm sm:text-base mt-1">
              Configure connected equipment, peak surge multipliers, and daily operational hours.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#00490e] hover:bg-emerald-900 text-white font-semibold px-5 py-3 rounded-full text-sm shadow-sm transition-all"
            >
              <Plus size={18} />
              Add Equipment
            </button>
            <button
              onClick={() => setShowReport(!showReport)}
              className="flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-medium px-4 py-3 rounded-full text-sm transition-all"
            >
              <ShieldCheck size={18} className="text-[#00490e]" />
              {showReport ? 'Hide Report' : 'View Report'}
            </button>
          </div>
        </div>

        {/* Validation Error Notice if input invalid */}
        {result.calculation_status === 'VALIDATION_ERROR' && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-900 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">Validation Error</h4>
              <ul className="list-disc list-inside text-xs mt-1 space-y-0.5 text-red-700">
                {result.validation_status?.errors?.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Main Bento Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Equipment Cards */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Connected Inventory ({items.length} Items)
              </span>
              <span className="text-xs text-stone-400">Edits automatically recalculate live</span>
            </div>

            {items.length === 0 ? (
              <div className="bg-white/80 border border-stone-200 rounded-3xl p-12 text-center shadow-sm">
                <Cpu className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h3 className="font-bold text-stone-700 text-base">No Equipment Configured</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  Your appliance workspace is empty. Click "Add Equipment" to configure electrical loads.
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-4 inline-flex items-center gap-2 bg-[#00490e] text-white px-4 py-2 rounded-full text-xs font-semibold shadow-sm hover:opacity-90"
                >
                  <Plus size={14} /> Add First Appliance
                </button>
              </div>
            ) : (
              items.map((item, idx) => {
                const totalWatts = item.powerWatts * item.quantity;
                const surgeWatts = Math.round(totalWatts * (item.surgeMultiplier || 1.0));
                const dailyKwh = ((totalWatts * item.hoursPerDay) / 1000).toFixed(1);

                return (
                  <div
                    key={idx}
                    className="bg-white/90 backdrop-blur-md border border-stone-200/80 rounded-2xl p-5 sm:p-6 flex flex-col gap-4 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all"
                  >
                    {/* Top Row: Name, Category, Critical Tag, Delete */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center shrink-0 border border-stone-200">
                          {getCategoryIcon(item.category)}
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateItem(idx, 'name', e.target.value)}
                            className="font-bold text-stone-900 text-base bg-transparent border-b border-transparent hover:border-stone-300 focus:border-[#00490e] outline-none transition-colors w-full"
                          />
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCategoryBadgeClass(item.category)}`}>
                              {item.category || 'General'}
                            </span>
                            {item.isCritical && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#00490e] border border-emerald-200 flex items-center gap-1">
                                <CheckCircle2 size={10} /> Critical Load
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <label className="flex items-center gap-1.5 cursor-pointer text-xs text-stone-600 font-medium select-none">
                          <input
                            type="checkbox"
                            checked={!!item.isCritical}
                            onChange={(e) => updateItem(idx, 'isCritical', e.target.checked)}
                            className="rounded border-stone-300 text-[#00490e] focus:ring-[#00490e]"
                          />
                          Critical
                        </label>
                        <button
                          onClick={() => removeItem(idx)}
                          disabled={items.length <= 1}
                          className="text-stone-400 hover:text-red-600 disabled:opacity-30 transition-colors p-1.5 rounded-lg hover:bg-stone-100"
                          title="Delete equipment item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Bottom Grid: Rated Power, Operating Hrs, Surge Power, Daily Energy, Qty */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-1 text-xs">
                      <div className="bg-stone-50/80 p-2.5 rounded-xl border border-stone-100">
                        <span className="text-stone-500 font-medium block mb-1">Rated Power (W)</span>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min={1}
                            max={50000}
                            value={item.powerWatts}
                            onChange={(e) => updateItem(idx, 'powerWatts', Number(e.target.value))}
                            className="w-full bg-white border border-stone-200 rounded px-2 py-1 font-bold text-stone-900 outline-none focus:ring-1 focus:ring-[#00490e]"
                          />
                          <span className="text-stone-400 font-semibold">W</span>
                        </div>
                      </div>

                      <div className="bg-stone-50/80 p-2.5 rounded-xl border border-stone-100">
                        <span className="text-stone-500 font-medium block mb-1">Operating Hrs</span>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min={0}
                            max={24}
                            value={item.hoursPerDay}
                            onChange={(e) => updateItem(idx, 'hoursPerDay', Number(e.target.value))}
                            className="w-full bg-white border border-stone-200 rounded px-2 py-1 font-bold text-stone-900 outline-none focus:ring-1 focus:ring-[#00490e]"
                          />
                          <span className="text-stone-400 font-semibold">h</span>
                        </div>
                      </div>

                      <div className="bg-stone-50/80 p-2.5 rounded-xl border border-stone-100">
                        <span className="text-stone-500 font-medium block mb-1">Surge Power</span>
                        <span className={`font-bold block mt-1 ${surgeWatts > totalWatts ? 'text-amber-700' : 'text-stone-900'}`}>
                          {surgeWatts.toLocaleString()} W
                        </span>
                      </div>

                      <div className="bg-stone-50/80 p-2.5 rounded-xl border border-stone-100">
                        <span className="text-stone-500 font-medium block mb-1">Daily Energy</span>
                        <span className="font-bold text-stone-900 block mt-1">
                          {dailyKwh} kWh
                        </span>
                      </div>

                      <div className="bg-stone-50/80 p-2.5 rounded-xl border border-stone-100 col-span-2 md:col-span-1">
                        <span className="text-stone-500 font-medium block mb-1">Quantity (QTY)</span>
                        <input
                          type="number"
                          min={1}
                          max={500}
                          value={item.quantity}
                          onChange={(e) => updateItem(idx, 'quantity', Number(e.target.value))}
                          className="w-full bg-white border border-stone-200 rounded px-2 py-1 font-bold text-stone-900 outline-none focus:ring-1 focus:ring-[#00490e]"
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Live Load Summary Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Live Load Summary Panel */}
            <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between mb-6 pb-3 border-b border-stone-100">
                <h3 className="font-bold text-lg text-[#00490e] flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500 fill-amber-400" />
                  Live Load Summary
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-[#00490e] px-2 py-0.5 rounded-full">
                  Real-time
                </span>
              </div>

              <div className="space-y-6">
                <div>
                  <span className="text-xs font-semibold text-stone-500 block mb-1">
                    Connected Active Power
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-stone-900 tracking-tight">
                      {((resData.totalConnectedWatts ?? 0) / 1000).toFixed(2)}
                    </span>
                    <span className="text-sm font-bold text-stone-500">kW</span>
                    <span className="text-xs text-stone-400 font-medium ml-auto">
                      ({resData.totalConnectedWatts ?? 0} Watts)
                    </span>
                  </div>
                  <div className="w-full bg-stone-100 h-2 rounded-full mt-2.5 overflow-hidden">
                    <div
                      className="bg-[#00490e] h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.max(10, ((resData.totalConnectedWatts ?? 0) / 15000) * 100))}%` }}
                    />
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-stone-500 block mb-1">
                    Peak Demand (Inc. Surge Margin)
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-amber-600 tracking-tight">
                      {resData.peakDemandKw ?? 0}
                    </span>
                    <span className="text-sm font-bold text-amber-700">kW</span>
                  </div>
                  <div className="w-full bg-stone-100 h-2 rounded-full mt-2.5 overflow-hidden flex">
                    <div
                      className="bg-[#00490e] h-full rounded-l-full"
                      style={{ width: `${Math.min(70, Math.max(10, ((resData.totalConnectedWatts ?? 0) / 15000) * 100))}%` }}
                    />
                    <div
                      className="bg-amber-500 h-full rounded-r-full"
                      style={{ width: `${Math.min(30, Math.max(5, (((resData.peakDemandKw ?? 0) * 1000 - (resData.totalConnectedWatts ?? 0)) / 15000) * 100))}%` }}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-stone-500 block">
                      Total Daily Energy
                    </span>
                    <span className="text-2xl font-bold text-stone-900">
                      {resData.dailyEnergyDemandKwh ?? 0}{' '}
                      <span className="text-xs font-medium text-stone-500">kWh/day</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-stone-500 block">
                      Monthly Estimate
                    </span>
                    <span className="text-base font-bold text-stone-700">
                      {resData.monthlyEnergyDemandKwh ?? 0}{' '}
                      <span className="text-xs font-medium text-stone-500">kWh</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* High Startup Load Engineering Warning */}
            {hasHighSurge && (
              <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 text-amber-900 flex items-start gap-3.5 shadow-sm">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-amber-900">High Startup Inductive Surge</h4>
                  <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                    Motor-driven equipment (AC, Water Pump) requires additional inverter surge headroom to handle compressor startup transients without tripping safety limits.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation CTA to Battery Capacity Tool */}
            <Link
              href="/tools/battery-capacity"
              className="w-full bg-[#00490e] hover:bg-emerald-900 text-white font-semibold py-4 rounded-full text-sm shadow-md transition-all flex items-center justify-center gap-2 group"
            >
              Proceed to Battery Capacity Calculator
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Confidence Rating & Supporting Notes */}
            {isSuccess && (
              <div className="space-y-4">
                <ConfidenceIndicator
                  level={result.confidence}
                  reasoning={result.confidenceReasoning}
                />
                <EngineeringNotes
                  notes={result.supporting_notes}
                  assumptions={result.assumptions}
                  warnings={result.warnings}
                />
              </div>
            )}
          </aside>
        </div>

        {/* Optional Full Engineering Report section */}
        {showReport && isSuccess && (
          <div className="mt-12 pt-8 border-t border-stone-200">
            <EngineeringReport
              toolTitle="Appliance Load & Energy Consumption Calculator"
              toolId="load-calculator"
              result={result}
              inputSummary={[
                { label: 'Total Appliance Count', value: items.length },
                { label: 'Inventory Items', value: items.map((i) => `${i.name} (×${i.quantity})`).join(', ') },
              ]}
              calculationSummary={[
                { label: 'Total Connected Active Power', value: resData.totalConnectedWatts, unit: 'W' },
                { label: 'Peak Surge Demand (kW)', value: resData.peakDemandKw, unit: 'kW' },
                { label: 'Daily Energy Consumption', value: resData.dailyEnergyDemandKwh, unit: 'kWh/day' },
                { label: 'Monthly Energy Consumption', value: resData.monthlyEnergyDemandKwh, unit: 'kWh/month' },
              ]}
              engineeringChecks={[
                { label: 'Load Diversity Buffer Applied', value: '25% Surge Margin', check: 'PASS' },
                { label: 'Energy Requirement Adequacy', value: `${resData.dailyEnergyDemandKwh} kWh/day`, check: (resData.dailyEnergyDemandKwh ?? 0) > 0 ? 'PASS' : 'FAIL' },
              ]}
              nextToolHref="/tools/battery-capacity"
              nextToolLabel="Battery Capacity Calculator"
            />
          </div>
        )}

        <UnlockReportCTA />
        <PublicWaitlistForm interestedTool="Appliance Load Calculator" />
        <RelatedToolsList currentToolId="load-calculator" />
      </div>

      {/* Add Appliance Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-lg text-[#00490e] flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#00490e]" /> Add Equipment to Load Profile
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Equipment Name</label>
                <input
                  type="text"
                  placeholder="e.g. Microwave Oven, Washing Machine, Desktop PC"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 font-medium text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Power Rating (Watts)</label>
                  <input
                    type="number"
                    min={1}
                    value={newItemWatts}
                    onChange={(e) => setNewItemWatts(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 font-medium text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 font-medium text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Daily Hours (0-24)</label>
                  <input
                    type="number"
                    min={0}
                    max={24}
                    value={newItemHours}
                    onChange={(e) => setNewItemHours(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 font-medium text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Category</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 font-medium text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e]"
                  >
                    <option value="General">General</option>
                    <option value="Cooling">Cooling</option>
                    <option value="Lighting">Lighting</option>
                    <option value="HVAC">HVAC</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Computing">Computing</option>
                    <option value="Entertainment">Entertainment</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-700 select-none pt-1">
                <input
                  type="checkbox"
                  checked={newItemCritical}
                  onChange={(e) => setNewItemCritical(e.target.checked)}
                  className="rounded border-stone-300 text-[#00490e] focus:ring-[#00490e]"
                />
                Mark as Critical Backup Load
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2.5 rounded-full text-xs font-semibold text-stone-600 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                onClick={addItem}
                disabled={!newItemName.trim()}
                className="px-5 py-2.5 rounded-full text-xs font-semibold bg-[#00490e] text-white hover:opacity-90 disabled:opacity-40 shadow-sm"
              >
                Add Equipment
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

