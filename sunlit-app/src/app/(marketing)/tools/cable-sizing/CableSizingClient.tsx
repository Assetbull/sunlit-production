'use client';

import { useState } from 'react';
import { calculateCableSizing } from '@/lib/engineering/calculators/cableSizing';
import { SharedCalculationResult } from '@/lib/engineering/types';
import { ToolHeader } from '@/shared/components/tools/ToolHeader';
import { ConfidenceIndicator } from '@/shared/components/tools/ConfidenceIndicator';
import { EngineeringNotes } from '@/shared/components/tools/EngineeringNotes';
import { EngineeringReport } from '@/shared/components/tools/EngineeringReport';
import { UnlockReportCTA } from '@/shared/components/tools/UnlockReportCTA';
import { PublicWaitlistForm } from '@/shared/components/tools/PublicWaitlistForm';
import { RelatedToolsList } from '@/shared/components/tools/RelatedToolsList';
import {
  Zap, ArrowRight, ShieldCheck, CheckCircle2, Sliders, Cable, AlertTriangle, Download, Ruler, Thermometer
} from 'lucide-react';
import Link from 'next/link';

export function CableSizingClient() {
  const [voltage, setVoltage] = useState<12 | 24 | 48 | 230 | 400>(48);
  const [currentAmps, setCurrentAmps] = useState<number>(125);
  const [cableLengthMeters, setCableLengthMeters] = useState<number>(85);
  const [maxDropPercent, setMaxDropPercent] = useState<number>(3.0);
  const [material, setMaterial] = useState<'COPPER' | 'ALUMINUM'>('COPPER');
  const [installMethod, setInstallMethod] = useState<'OPEN_AIR' | 'CONDUIT' | 'UNDERGROUND' | 'TRAY'>('TRAY');
  const [showReport, setShowReport] = useState<boolean>(false);

  const result: SharedCalculationResult = calculateCableSizing({
    currentAmps,
    cableLengthMeters,
    systemVoltage: voltage,
    maxVoltageDropPercent: maxDropPercent,
    conductorMaterial: material,
    installationMethod: installMethod,
  });

  const isSuccess = result.calculation_status === 'SUCCESS';
  const resData = result.engineering_results;

  const candidateSizes = [25, 35, 50, 70];

  return (
    <main className="bg-[#fff8f5] text-[#1f1b17] font-sans min-h-screen pb-24 antialiased">
      <ToolHeader
        title="Cable & Infrastructure Specialist"
        category="Electrical Cabling & Voltage Drop"
        description="Specialist utility for precise voltage drop calculations and conductor sizing based on environmental derating variables."
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-8">
        {/* Stitch Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 border-b border-stone-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                IEC 60364 COMPLIANT
              </span>
              <span className="text-xs text-stone-500 font-medium">• Cable & Infrastructure V2.4.1</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#00490e] tracking-tight">
              Cable & Infrastructure Specialist
            </h1>
            <p className="text-stone-600 text-sm sm:text-base mt-1">
              Conductor cross-section selection, ampacity derating, and voltage drop compliance.
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

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Parameter Inputs */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/80 backdrop-blur-md border border-stone-200 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#00490e] mb-5 flex items-center gap-2 border-b border-stone-100 pb-3">
                <Sliders className="w-5 h-5 text-[#00490e]" />
                Circuit Parameters
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    System Voltage (V)
                  </label>
                  <select
                    value={voltage}
                    onChange={(e) => setVoltage(Number(e.target.value) as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-sm"
                  >
                    <option value={48}>48V DC Battery / Bus</option>
                    <option value={24}>24V DC Circuit</option>
                    <option value={12}>12V DC Circuit</option>
                    <option value={230}>230V AC Single Phase Main Output</option>
                    <option value={400}>400V AC Three Phase Feeder</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Design Current (A)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      max={1000}
                      step={1}
                      value={currentAmps}
                      onChange={(e) => setCurrentAmps(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-base"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-stone-400">
                      A
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    One-Way Run Distance (m)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      max={500}
                      step={1}
                      value={cableLengthMeters}
                      onChange={(e) => setCableLengthMeters(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-base"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-stone-400">
                      m
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Conductor Material
                  </label>
                  <select
                    value={material}
                    onChange={(e) => setMaterial(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-sm"
                  >
                    <option value="COPPER">Copper (Cu) - High Conductivity</option>
                    <option value="ALUMINUM">Aluminum (Al) - Lightweight Feeder</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Installation Derating Method
                  </label>
                  <select
                    value={installMethod}
                    onChange={(e) => setInstallMethod(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-sm"
                  >
                    <option value="TRAY">On perforated tray (Method E - 85% Derating)</option>
                    <option value="OPEN_AIR">Open Air Clipper (100% Ampacity)</option>
                    <option value="CONDUIT">In Conduit / Trunking (80% Derating)</option>
                    <option value="UNDERGROUND">Direct Underground Burial (90% Derating)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Max Voltage Drop Threshold (%)
                  </label>
                  <select
                    value={maxDropPercent}
                    onChange={(e) => setMaxDropPercent(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-sm"
                  >
                    <option value={3.0}>3.0% (Standard IEC/IEEE Recommendation)</option>
                    <option value={2.0}>2.0% (High Efficiency Solar Run)</option>
                    <option value={1.5}>1.5% (Critical Battery Interconnect)</option>
                    <option value={5.0}>5.0% (Max Utility Limit)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Results & Conductor Options Table */}
          <div className="lg:col-span-8 space-y-6">
            {/* Top Result Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Recommended Conductor Card */}
              <div className="bg-gradient-to-br from-white via-[#f4fbf5] to-[#e8f6ea] border border-emerald-200/80 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 block mb-1">
                  Recommended Conductor
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold text-[#00490e] tracking-tight">
                    {resData.recommendedCableSizeMm2 ?? 0}
                  </span>
                  <span className="text-xl font-bold text-stone-600">mm²</span>
                </div>
                <p className="text-xs text-stone-500 font-semibold mt-2">
                  {material === 'COPPER' ? 'Copper (Cu)' : 'Aluminum (Al)'}, XLPE Insulation (90°C)
                </p>
              </div>

              {/* Calculated Voltage Drop Card */}
              <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                <span className="text-xs font-bold uppercase tracking-widest text-stone-500 block mb-1">
                  Calculated Voltage Drop
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold text-stone-900 tracking-tight">
                    {resData.actualVoltageDropPercent ?? 0}
                  </span>
                  <span className="text-xl font-bold text-stone-500">%</span>
                  <span className="text-sm font-semibold text-stone-500">
                    ({resData.actualVoltageDropVolts ?? 0} V)
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${resData.voltageDropCheck === 'PASS' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <p className="text-xs text-stone-600 font-semibold">
                    {resData.voltageDropCheck === 'PASS' ? `Acceptable (< ${maxDropPercent}% threshold)` : `Exceeds ${maxDropPercent}% limit`}
                  </p>
                </div>
              </div>
            </div>

            {/* Conductor Options Table (Stitch Glass Panel) */}
            <div className="bg-white/80 backdrop-blur-md border border-stone-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                <h3 className="font-bold text-base text-[#00490e]">Conductor Cross-Section Analysis</h3>
                <span className="text-xs font-mono font-semibold text-stone-500 bg-stone-200/60 px-3 py-1 rounded-full">
                  Design: {currentAmps}A @ {cableLengthMeters}m
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 bg-stone-100/50 font-bold uppercase tracking-wider text-stone-600">
                      <th className="py-3.5 px-6">Size (mm²)</th>
                      <th className="py-3.5 px-6">Design Current (A)</th>
                      <th className="py-3.5 px-6">Derated Cap (A)</th>
                      <th className="py-3.5 px-6">V Drop (%)</th>
                      <th className="py-3.5 px-6">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-mono">
                    {candidateSizes.map((size) => {
                      const isSelected = size === resData.recommendedCableSizeMm2;
                      const sizeDropPct = Number(((2 * cableLengthMeters * currentAmps * (material === 'COPPER' ? 0.01724 : 0.02826) * 100) / (voltage * size)).toFixed(1));
                      const isOk = sizeDropPct <= maxDropPercent && size >= (resData.calculatedAreaByVoltageDrop ?? 0);

                      return (
                        <tr
                          key={size}
                          className={`transition-colors ${isSelected ? 'bg-emerald-50/80 font-bold' : 'hover:bg-stone-50'}`}
                        >
                          <td className="py-4 px-6 font-bold text-stone-900 flex items-center gap-2">
                            {isSelected && <CheckCircle2 size={16} className="text-emerald-700" />}
                            {size} mm²
                          </td>
                          <td className="py-4 px-6 text-stone-600">{currentAmps} A</td>
                          <td className="py-4 px-6 text-stone-600">
                            {Math.round(size * 3.1)} A
                          </td>
                          <td className="py-4 px-6 text-stone-900 font-bold">
                            {sizeDropPct}%
                          </td>
                          <td className="py-4 px-6">
                            {isSelected ? (
                              <span className="inline-block px-2.5 py-0.5 bg-emerald-100 text-emerald-900 rounded-full text-[11px] font-bold border border-emerald-300">
                                OPTIMAL
                              </span>
                            ) : isOk ? (
                              <span className="inline-block px-2.5 py-0.5 bg-stone-100 text-stone-700 rounded-full text-[11px] font-medium">
                                ADEQUATE
                              </span>
                            ) : (
                              <span className="inline-block px-2.5 py-0.5 bg-amber-100 text-amber-900 rounded-full text-[11px] font-bold">
                                UNDERSIZED
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Next Tool Navigation CTA */}
            <Link
              href="/tools/pv-configuration"
              className="w-full bg-[#00490e] hover:bg-emerald-900 text-white font-semibold py-4 rounded-full text-sm shadow-md transition-all flex items-center justify-center gap-2 group"
            >
              Proceed to PV String Layout Configurator
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
              toolTitle="Solar Cable Sizing Calculator"
              toolId="cable-sizing"
              result={result}
              inputSummary={[
                { label: 'Design Current', value: currentAmps, unit: 'A' },
                { label: 'Run Length', value: cableLengthMeters, unit: 'm' },
                { label: 'System Voltage', value: voltage, unit: 'V' },
                { label: 'Conductor Material', value: material },
                { label: 'Max Drop Threshold', value: maxDropPercent, unit: '%' },
                { label: 'Installation Method', value: installMethod },
              ]}
              calculationSummary={[
                { label: 'Recommended Cable Cross-Section', value: resData.recommendedCableSizeMm2, unit: 'mm²' },
                { label: 'Actual Voltage Drop', value: resData.actualVoltageDropPercent, unit: '%' },
                { label: 'Actual Voltage Drop Volts', value: resData.actualVoltageDropVolts, unit: 'V' },
                { label: 'Derated Ampacity', value: resData.deratedAmpacity, unit: 'A' },
                { label: 'Calculated Area (Voltage Drop)', value: resData.calculatedAreaByVoltageDrop, unit: 'mm²' },
              ]}
              engineeringChecks={[
                { label: 'Voltage Drop Threshold', value: `${resData.actualVoltageDropPercent}% ≤ ${maxDropPercent}%`, check: resData.voltageDropCheck as 'PASS' | 'FAIL' ?? 'PASS' },
                { label: 'Conductor Ampacity Safety', value: `${resData.deratedAmpacity}A ≥ ${currentAmps}A`, check: resData.ampacityCheck as 'PASS' | 'FAIL' ?? 'PASS' },
                { label: 'Overall Engineering Status', value: resData.overallCheck ?? 'PASS', check: resData.overallCheck as 'PASS' | 'FAIL' ?? 'PASS' },
              ]}
              nextToolHref="/tools/pv-configuration"
              nextToolLabel="PV String Layout Configurator"
            />
          </div>
        )}

        <UnlockReportCTA />
        <PublicWaitlistForm interestedTool="Solar Cable Sizing Calculator" />
        <RelatedToolsList currentToolId="cable-sizing" />
      </div>
    </main>
  );
}
