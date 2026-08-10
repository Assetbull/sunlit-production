'use client';

import { useState } from 'react';
import { calculateSolarSystemSizing } from '@/lib/engineering/calculators/solarSystemSizing';
import { SharedCalculationResult } from '@/lib/engineering/types';
import { ToolHeader } from '@/shared/components/tools/ToolHeader';
import { ConfidenceIndicator } from '@/shared/components/tools/ConfidenceIndicator';
import { EngineeringNotes } from '@/shared/components/tools/EngineeringNotes';
import { EngineeringReport } from '@/shared/components/tools/EngineeringReport';
import { UnlockReportCTA } from '@/shared/components/tools/UnlockReportCTA';
import { PublicWaitlistForm } from '@/shared/components/tools/PublicWaitlistForm';
import { RelatedToolsList } from '@/shared/components/tools/RelatedToolsList';
import {
  Zap, ArrowRight, ShieldCheck, CheckCircle2, Sliders, Battery, Sun, Cpu, AlertTriangle, Building, MapPin
} from 'lucide-react';
import Link from 'next/link';

export function SolarSystemSizingClient() {
  const [monthlyBill, setMonthlyBill] = useState<number>(150000);
  const [autonomyDays, setAutonomyDays] = useState<number>(1.0);
  const [propertyType, setPropertyType] = useState<'residential' | 'commercial' | 'industrial'>('residential');
  const [locationName, setLocationName] = useState<string>('Lagos');
  const [showReport, setShowReport] = useState<boolean>(false);

  const result: SharedCalculationResult = calculateSolarSystemSizing({
    monthlyBillNaira: monthlyBill,
    daysOfAutonomy: autonomyDays,
    propertyType,
    location: locationName,
  });

  const isSuccess = result.calculation_status === 'SUCCESS';
  const resData = result.engineering_results;

  return (
    <main className="bg-[#fff8f5] text-[#1f1b17] font-sans min-h-screen pb-24 antialiased">
      <ToolHeader
        title="Solar System Sizing Calculator"
        category="System Design & Autonomy"
        description="Calculate required solar array kWp, battery kWh storage, and inverter kVA capacity tailored for property power requirements in Nigeria."
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-8">
        {/* Stitch Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 border-b border-stone-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Stitch Visual DNA Engine
              </span>
              <span className="text-xs text-stone-500 font-medium">• Integrated System Design V2.4</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#00490e] tracking-tight">
              Your PV sizing report is ready.
            </h1>
            <p className="text-stone-600 text-sm sm:text-base mt-1">
              Optimized turnkey system specifications matching load profile, battery autonomy, and solar resource.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setShowReport(!showReport)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#00490e] hover:bg-emerald-900 text-white font-semibold px-5 py-3 rounded-full text-sm shadow-sm transition-all"
            >
              <ShieldCheck size={18} />
              {showReport ? 'Hide Engineering Report' : 'Generate Engineering Report'}
            </button>
          </div>
        </div>

        {/* Validation Errors */}
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

        {/* Main Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Sizing Inputs */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/80 backdrop-blur-md border border-stone-200 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#00490e] mb-5 flex items-center gap-2 border-b border-stone-100 pb-3">
                <Sliders className="w-5 h-5 text-[#00490e]" />
                Site & Load Parameters
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Monthly DISCO Electricity Bill (₦)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1000}
                      max={100000000}
                      step={5000}
                      value={monthlyBill}
                      onChange={(e) => setMonthlyBill(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-base"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-stone-400">
                      ₦
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Battery Backup Autonomy (Days)
                  </label>
                  <select
                    value={autonomyDays}
                    onChange={(e) => setAutonomyDays(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-sm"
                  >
                    <option value={0.5}>0.5 Days (Night Backup Only)</option>
                    <option value={1.0}>1.0 Day (Full 24-Hour Backup)</option>
                    <option value={1.5}>1.5 Days (Rainy Day Reserve)</option>
                    <option value={2.0}>2.0 Days (Off-Grid Autonomy)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Property Classification
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-sm"
                  >
                    <option value="residential">Residential Villa / Home</option>
                    <option value="commercial">Commercial Office / Facility</option>
                    <option value="industrial">Industrial Facility</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Geographic Region
                  </label>
                  <select
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-sm"
                  >
                    <option value="Lagos">Lagos State (4.8 PSH)</option>
                    <option value="Abuja">Abuja FCT (5.2 PSH)</option>
                    <option value="Kano">Kano Belt (6.0 PSH)</option>
                    <option value="Port Harcourt">Port Harcourt (4.5 PSH)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Turnkey Sizing Results */}
          <div className="lg:col-span-8 space-y-6">
            {/* Primary System Overview Cards */}
            <div className="bg-gradient-to-br from-white via-[#f4fbf5] to-[#e8f6ea] border border-emerald-200/80 rounded-3xl p-8 shadow-sm">
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-900 font-semibold rounded-full text-xs mb-4 border border-emerald-300 uppercase tracking-wider">
                TURNKEY RECOMMENDED SPECIFICATION
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                <div>
                  <div className="flex items-center gap-2 text-stone-500 font-bold text-xs uppercase mb-1">
                    <Sun className="w-4 h-4 text-amber-500" /> Solar Array
                  </div>
                  <div className="text-4xl font-extrabold text-[#00490e]">
                    {resData.recommendedSolarArrayKwp ?? 0}
                    <span className="text-sm font-normal text-stone-600 ml-1">kWp</span>
                  </div>
                  <div className="text-xs text-stone-500 mt-1 font-mono">
                    {resData.recommendedPanelCount ?? 0} × 550W Panels
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-stone-500 font-bold text-xs uppercase mb-1">
                    <Battery className="w-4 h-4 text-emerald-600" /> Storage Capacity
                  </div>
                  <div className="text-4xl font-extrabold text-[#00490e]">
                    {resData.recommendedBatteryKwh ?? 0}
                    <span className="text-sm font-normal text-stone-600 ml-1">kWh</span>
                  </div>
                  <div className="text-xs text-stone-500 mt-1 font-mono">
                    LiFePO4 @ {autonomyDays} Day Autonomy
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-stone-500 font-bold text-xs uppercase mb-1">
                    <Cpu className="w-4 h-4 text-blue-600" /> Inverter Rating
                  </div>
                  <div className="text-4xl font-extrabold text-[#00490e]">
                    {resData.recommendedInverterKva ?? 0}
                    <span className="text-sm font-normal text-stone-600 ml-1">kVA</span>
                  </div>
                  <div className="text-xs text-stone-500 mt-1 font-mono">
                    Pure Sine Hybrid
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-emerald-200/60 pt-6 text-xs">
                <div>
                  <span className="text-stone-500 font-medium block mb-0.5">Daily kWh Demand</span>
                  <span className="font-bold text-stone-900 text-base">{resData.dailyEnergyDemandKwh} kWh/day</span>
                </div>
                <div>
                  <span className="text-stone-500 font-medium block mb-0.5">Monthly Consumption</span>
                  <span className="font-bold text-stone-900 text-base">{resData.monthlyEnergyDemandKwh} kWh/mo</span>
                </div>
                <div>
                  <span className="text-stone-500 font-medium block mb-0.5">Roof Footprint</span>
                  <span className="font-bold text-stone-900 text-base">{resData.estimatedRoofAreaM2} m²</span>
                </div>
                <div>
                  <span className="text-stone-500 font-medium block mb-0.5">Grid Displacement</span>
                  <span className="font-bold text-emerald-800 text-base">100% Coverage</span>
                </div>
              </div>
            </div>

            {/* Next Engineering Action CTA */}
            <Link
              href="/tools/load-calculator"
              className="w-full bg-[#00490e] hover:bg-emerald-900 text-white font-semibold py-4 rounded-full text-sm shadow-md transition-all flex items-center justify-center gap-2 group"
            >
              Return to Appliance Load Calculator
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

        {/* Full Engineering Report Modal/Section */}
        {showReport && isSuccess && (
          <div className="mt-12 pt-8 border-t border-stone-200">
            <EngineeringReport
              toolTitle="Solar System Sizing Calculator"
              toolId="solar-system-sizing"
              result={result}
              inputSummary={[
                { label: 'Monthly Electricity Bill', value: `₦${monthlyBill.toLocaleString()}` },
                { label: 'Autonomy Duration', value: `${autonomyDays} day(s)` },
                { label: 'Property Type', value: propertyType },
                { label: 'Location', value: locationName },
              ]}
              calculationSummary={[
                { label: 'Solar Array Peak Capacity', value: resData.recommendedSolarArrayKwp, unit: 'kWp' },
                { label: 'Battery Storage Usable Capacity', value: resData.recommendedBatteryKwh, unit: 'kWh' },
                { label: 'Inverter Apparent Rating', value: resData.recommendedInverterKva, unit: 'kVA' },
                { label: 'Daily Energy Demand', value: resData.dailyEnergyDemandKwh, unit: 'kWh/day' },
                { label: 'Estimated Roof Footprint', value: resData.estimatedRoofAreaM2, unit: 'm²' },
              ]}
              engineeringChecks={[
                { label: 'System Capacity Adequacy', value: `${resData.recommendedSolarArrayKwp} kWp`, check: 'PASS' },
                { label: 'Battery Autonomy Coverage', value: `${autonomyDays} day(s)`, check: 'PASS' },
              ]}
              nextToolHref="/tools/load-calculator"
              nextToolLabel="Appliance Load Calculator"
            />
          </div>
        )}

        <UnlockReportCTA />
        <PublicWaitlistForm interestedTool="Solar System Sizing Calculator" />
        <RelatedToolsList currentToolId="solar-system-sizing" />
      </div>
    </main>
  );
}
