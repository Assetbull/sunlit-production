'use client';

import { useState } from 'react';
import { calculateBatteryCapacity } from '@/lib/engineering/calculators/batteryCapacity';
import { SharedCalculationResult } from '@/lib/engineering/types';
import { ToolHeader } from '@/shared/components/tools/ToolHeader';
import { ConfidenceIndicator } from '@/shared/components/tools/ConfidenceIndicator';
import { EngineeringNotes } from '@/shared/components/tools/EngineeringNotes';
import { EngineeringReport } from '@/shared/components/tools/EngineeringReport';
import { UnlockReportCTA } from '@/shared/components/tools/UnlockReportCTA';
import { PublicWaitlistForm } from '@/shared/components/tools/PublicWaitlistForm';
import { RelatedToolsList } from '@/shared/components/tools/RelatedToolsList';
import {
  Battery, ArrowRight, ShieldCheck, Zap, AlertTriangle, CheckCircle2, Sliders, Thermometer, Layers, Cpu
} from 'lucide-react';
import Link from 'next/link';

export function BatteryCapacityClient() {
  // Input parameters matching Stitch design
  const [dailyEnergyKwh, setDailyEnergyKwh] = useState<number>(20);
  const [autonomyDays, setAutonomyDays] = useState<number>(1.0);
  const [systemVoltage, setSystemVoltage] = useState<48 | 24 | 12 | 51.2>(48);
  const [chemistry, setChemistry] = useState<'LITHIUM_LIFEPO4' | 'TUBULAR_GEL'>('LITHIUM_LIFEPO4');
  const [dodPercent, setDodPercent] = useState<number>(80);
  const [inverterEfficiency, setInverterEfficiency] = useState<number>(0.92);
  const [tempDeratingFactor, setTempDeratingFactor] = useState<number>(0.95);
  const [showReport, setShowReport] = useState<boolean>(false);

  const result: SharedCalculationResult = calculateBatteryCapacity({
    dailyEnergyKwh,
    daysOfAutonomy: autonomyDays,
    systemVoltage,
    chemistry,
    maxDepthOfDischarge: dodPercent / 100,
    inverterEfficiency,
    temperatureDerating: tempDeratingFactor,
  });

  const isSuccess = result.calculation_status === 'SUCCESS';
  const resData = result.engineering_results;

  return (
    <main className="bg-[#fcf9f8] text-[#1b1c1c] font-sans min-h-screen pb-24 antialiased">
      <ToolHeader
        title="Battery Capacity Calculator"
        category="Energy Storage & Battery Bank Sizing"
        description="Determine required battery bank capacity (kWh / Ah), nominal voltage, and series-parallel module configuration for solar backup."
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-8">
        {/* Stitch Screen Title Banner */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 border-b border-stone-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Stitch Visual DNA Engine
              </span>
              <span className="text-xs text-stone-500 font-medium">• Energy Storage OS</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#00490e] tracking-tight">
              Battery Capacity Sizing
            </h1>
            <p className="text-stone-600 text-sm sm:text-base mt-1">
              Configure storage parameters to calculate required system capacity, autonomy days, and DoD.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setShowReport(!showReport)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#00490e] hover:bg-emerald-900 text-white font-semibold px-5 py-3 rounded-full text-sm shadow-sm transition-all"
            >
              <ShieldCheck size={18} />
              {showReport ? 'Hide Full Report' : 'Generate Full Report'}
            </button>
          </div>
        </div>

        {/* Validation Errors */}
        {result.calculation_status === 'VALIDATION_ERROR' && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-900 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">Validation Notice</h4>
              <ul className="list-disc list-inside text-xs mt-1 space-y-0.5 text-red-700">
                {result.validation_status?.errors?.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Main Grid: Inputs (Left) and Results (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: System Input Parameters */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#00490e] mb-6 flex items-center gap-2 border-b border-stone-100 pb-3">
                <Sliders className="w-5 h-5 text-[#00490e]" /> System Parameters
              </h3>

              <div className="space-y-5 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Daily Energy Requirement (kWh/day)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0.5}
                      max={500}
                      step={0.5}
                      value={dailyEnergyKwh}
                      onChange={(e) => setDailyEnergyKwh(Math.max(0.1, Number(e.target.value)))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-base"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-stone-400">
                      kWh/day
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">Total electrical energy required per 24-hour cycle.</p>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Required Autonomy (Days)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0.25}
                      max={5}
                      step={0.25}
                      value={autonomyDays}
                      onChange={(e) => setAutonomyDays(Math.max(0.25, Number(e.target.value)))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-base"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-stone-400">
                      DAYS
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">Days of backup power required without solar recharge.</p>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    System Voltage (DC Bus)
                  </label>
                  <select
                    value={systemVoltage}
                    onChange={(e) => setSystemVoltage(Number(e.target.value) as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-sm"
                  >
                    <option value={48}>48 VDC (Standard Solar Inverter Bus)</option>
                    <option value={51.2}>51.2 VDC (Server-Rack Lithium Module)</option>
                    <option value={24}>24 VDC (Medium Solar Backup)</option>
                    <option value={12}>12 VDC (Small Portable / Starter Systems)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Battery Chemistry
                  </label>
                  <select
                    value={chemistry}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setChemistry(val);
                      if (val === 'LITHIUM_LIFEPO4') setDodPercent(80);
                      else setDodPercent(50);
                    }}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-sm"
                  >
                    <option value="LITHIUM_LIFEPO4">Lithium Iron Phosphate (LiFePO4) - 6,000+ Cycles</option>
                    <option value="TUBULAR_GEL">Deep Cycle Tubular Gel - 1,500 Cycles</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Depth of Discharge (DoD %)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={30}
                      max={90}
                      value={dodPercent}
                      onChange={(e) => setDodPercent(Number(e.target.value))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-base"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-stone-400">
                      %
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Ambient Temperature & Derating Factor
                  </label>
                  <select
                    value={tempDeratingFactor}
                    onChange={(e) => setTempDeratingFactor(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-sm"
                  >
                    <option value={0.95}>95% (Climate Controlled Indoor Room)</option>
                    <option value={0.90}>90% (High Ambient Heat 35°C+ Derating)</option>
                    <option value={0.85}>85% (Unventilated Outdoor Enclosure)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Output Readout Glass Panel & Technical Details */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary Readout Glass Card */}
            <div className="bg-gradient-to-br from-white via-[#f4fbf5] to-[#e8f6ea] border border-emerald-200/80 rounded-3xl p-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 block mb-2">
                Required Installed Capacity
              </span>
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-5xl sm:text-6xl font-extrabold text-[#00490e] tracking-tight">
                  {resData.installedCapacityKwh ?? 0}
                </span>
                <span className="text-xl font-bold text-stone-600">kWh</span>
                <span className="text-xs text-stone-500 font-medium ml-auto bg-white/80 border border-emerald-200 px-3 py-1 rounded-full">
                  {resData.recommendedModuleCount ?? 1} Battery Modules
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-emerald-200/60 pt-5">
                <div>
                  <span className="text-xs font-semibold text-stone-500 block mb-1">Usable Capacity</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-stone-900">{resData.requiredUsableKwh ?? 0}</span>
                    <span className="text-xs font-medium text-stone-500">kWh</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-stone-500 block mb-1">Amp-Hours @ {systemVoltage}V</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-stone-900">{resData.installedAmpHours ?? 0}</span>
                    <span className="text-xs font-medium text-stone-500">Ah</span>
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <span className="text-xs font-semibold text-stone-500 block mb-1">Gross Calculation</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-stone-900">{resData.requiredGrossKwh ?? 0}</span>
                    <span className="text-xs font-medium text-stone-500">kWh</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Derating Table */}
            <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="bg-stone-50 px-6 py-4 border-b border-stone-200 flex justify-between items-center">
                <h3 className="font-bold text-sm text-[#00490e] uppercase tracking-wider flex items-center gap-2">
                  <Layers size={16} /> System Derating Factors
                </h3>
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                  Active
                </span>
              </div>

              <div className="divide-y divide-stone-100 text-xs">
                <div className="px-6 py-3.5 flex justify-between items-center">
                  <span className="font-medium text-stone-600">Inverter Round-Trip Efficiency</span>
                  <span className="font-bold text-stone-900">{Math.round(inverterEfficiency * 100)}%</span>
                </div>
                <div className="px-6 py-3.5 flex justify-between items-center">
                  <span className="font-medium text-stone-600">Temperature Derating Factor</span>
                  <span className="font-bold text-stone-900">{Math.round(tempDeratingFactor * 100)}%</span>
                </div>
                <div className="px-6 py-3.5 flex justify-between items-center">
                  <span className="font-medium text-stone-600">Depth of Discharge Limit</span>
                  <span className="font-bold text-stone-900">{dodPercent}%</span>
                </div>
                <div className="px-6 py-3.5 flex justify-between items-center">
                  <span className="font-medium text-stone-600">Total Daily Energy Requirement</span>
                  <span className="font-bold text-[#00490e]">{dailyEnergyKwh} kWh/day</span>
                </div>
              </div>
            </div>

            {/* Next Tool Navigation CTA */}
            <Link
              href="/tools/inverter-sizing"
              className="w-full bg-[#00490e] hover:bg-emerald-900 text-white font-semibold py-4 rounded-full text-sm shadow-md transition-all flex items-center justify-center gap-2 group"
            >
              Proceed to Inverter Sizing Calculator
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
          </div>
        </div>

        {/* Optional Full Engineering Report Section */}
        {showReport && isSuccess && (
          <div className="mt-12 pt-8 border-t border-stone-200">
            <EngineeringReport
              toolTitle="Battery Capacity Calculator"
              toolId="battery-capacity"
              result={result}
              inputSummary={[
                { label: 'Daily Energy Demand', value: dailyEnergyKwh, unit: 'kWh/day' },
                { label: 'Autonomy Duration', value: `${autonomyDays} day(s)` },
                { label: 'DC Bus Voltage', value: systemVoltage, unit: 'V DC' },
                { label: 'Battery Chemistry', value: chemistry === 'LITHIUM_LIFEPO4' ? 'LiFePO4' : 'Tubular Gel' },
                { label: 'Max Depth of Discharge', value: dodPercent, unit: '%' },
                { label: 'Inverter Efficiency', value: Math.round(inverterEfficiency * 100), unit: '%' },
                { label: 'Temperature Derating', value: Math.round(tempDeratingFactor * 100), unit: '%' },
              ]}
              calculationSummary={[
                { label: 'Installed Capacity', value: resData.installedCapacityKwh, unit: 'kWh' },
                { label: 'Usable Capacity', value: resData.requiredUsableKwh, unit: 'kWh' },
                { label: 'Total Amp-Hours', value: resData.installedAmpHours, unit: 'Ah' },
                { label: 'Battery Modules', value: resData.recommendedModuleCount, unit: 'modules' },
                { label: 'Gross Required', value: resData.requiredGrossKwh, unit: 'kWh' },
                { label: 'System Voltage', value: systemVoltage, unit: 'V DC' },
              ]}
              engineeringChecks={[
                { label: 'Capacity Adequacy', value: `${resData.installedCapacityKwh} kWh ≥ ${resData.requiredUsableKwh} kWh usable`, check: resData.capacityAdequacyCheck as 'PASS' | 'FAIL' ?? 'PASS' },
                { label: 'DoD Safety Threshold', value: `${dodPercent}%`, check: dodPercent <= 90 ? 'PASS' : 'WARNING' },
                { label: 'Temperature Derating Applied', value: `${Math.round(tempDeratingFactor * 100)}%`, check: tempDeratingFactor >= 0.90 ? 'PASS' : 'WARNING' },
              ]}
              nextToolHref="/tools/inverter-sizing"
              nextToolLabel="Inverter Sizing Calculator"
            />
          </div>
        )}

        <UnlockReportCTA />
        <PublicWaitlistForm interestedTool="Battery Capacity Calculator" />
        <RelatedToolsList currentToolId="battery-capacity" />
      </div>
    </main>
  );
}

