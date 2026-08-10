'use client';

import { useState } from 'react';
import { calculatePvConfiguration } from '@/lib/engineering/calculators/pvConfiguration';
import { SharedCalculationResult } from '@/lib/engineering/types';
import { ToolHeader } from '@/shared/components/tools/ToolHeader';
import { ConfidenceIndicator } from '@/shared/components/tools/ConfidenceIndicator';
import { EngineeringNotes } from '@/shared/components/tools/EngineeringNotes';
import { EngineeringReport } from '@/shared/components/tools/EngineeringReport';
import { PvVisualDiagram } from '@/shared/components/tools/PvVisualDiagram';
import { UnlockReportCTA } from '@/shared/components/tools/UnlockReportCTA';
import { PublicWaitlistForm } from '@/shared/components/tools/PublicWaitlistForm';
import { RelatedToolsList } from '@/shared/components/tools/RelatedToolsList';
import {
  Zap, ArrowRight, ShieldCheck, CheckCircle2, Sliders, Layers, AlertTriangle, Sun, Cpu, Thermometer
} from 'lucide-react';
import Link from 'next/link';

export function PvConfigurationClient() {
  const [totalPanelCount, setTotalPanelCount] = useState<number>(34);
  const [panelVoc, setPanelVoc] = useState<number>(49.8);
  const [panelVmp, setPanelVmp] = useState<number>(41.5);
  const [panelIsc, setPanelIsc] = useState<number>(13.8);
  const [panelWatts, setPanelWatts] = useState<number>(550);
  const [inverterMaxVoc, setInverterMaxVoc] = useState<number>(1000);
  const [inverterMinMppt, setInverterMinMppt] = useState<number>(200);
  const [inverterMaxMppt, setInverterMaxMppt] = useState<number>(850);
  const [inverterMaxIsc, setInverterMaxIsc] = useState<number>(26);
  const [coldTempC, setColdTempC] = useState<number>(15);
  const [hotTempC, setHotTempC] = useState<number>(65);
  const [showReport, setShowReport] = useState<boolean>(false);

  const result: SharedCalculationResult = calculatePvConfiguration({
    totalPanelCount,
    panelVoc,
    panelVmp,
    panelIsc,
    panelWatts,
    inverterMaxVoc,
    inverterMinMpptVoltage: inverterMinMppt,
    inverterMaxMpptVoltage: inverterMaxMppt,
    inverterMaxIsc,
    coldTempC,
    hotTempC,
  });

  const isSuccess = result.calculation_status === 'SUCCESS';
  const resData = result.engineering_results;

  const series = resData.panelsInSeries ?? Math.min(totalPanelCount, 17);
  const parallel = resData.parallelStrings ?? Math.max(1, Math.ceil(totalPanelCount / series));
  const dcAcRatio = resData.arrayKwp ? Number((resData.arrayKwp / (series * panelVmp * parallel * panelIsc / 1000 * 0.85)).toFixed(2)) : 1.25;

  return (
    <main className="bg-[#fff8f5] text-[#1f1b17] font-sans min-h-screen pb-24 antialiased">
      <ToolHeader
        title="PV String Layout Configurator"
        category="Photovoltaic Architecture & String Design"
        description="Configure series-parallel module layout matching inverter MPPT minimum/maximum voltage window and cold-weather Voc safety thresholds."
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-8">
        {/* Stitch Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 border-b border-stone-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Stitch Visual DNA Engine
              </span>
              <span className="text-xs text-stone-500 font-medium">• PV String Layout V2.4</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#00490e] tracking-tight">
              Your PV string configuration is ready.
            </h1>
            <p className="text-stone-600 text-sm sm:text-base mt-1">
              Optimal stringing ratio, cold-weather Voc overvoltage safety, and MPPT voltage tracking window.
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

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Module & Inverter Inputs */}
          <div className="lg:col-span-4 space-y-6">
            {/* Module Electrical Parameters Card */}
            <div className="bg-white/80 backdrop-blur-md border border-stone-200 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#00490e] mb-5 flex items-center gap-2 border-b border-stone-100 pb-3">
                <Sun className="w-5 h-5 text-amber-500 fill-amber-400" />
                PV Module Specs (STC)
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Total Module Count in Array
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={500}
                    value={totalPanelCount}
                    onChange={(e) => setTotalPanelCount(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-base"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Panel Voc (V)
                    </label>
                    <input
                      type="number"
                      step={0.1}
                      value={panelVoc}
                      onChange={(e) => setPanelVoc(Number(e.target.value))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Panel Vmp (V)
                    </label>
                    <input
                      type="number"
                      step={0.1}
                      value={panelVmp}
                      onChange={(e) => setPanelVmp(Number(e.target.value))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Panel Isc (A)
                    </label>
                    <input
                      type="number"
                      step={0.1}
                      value={panelIsc}
                      onChange={(e) => setPanelIsc(Number(e.target.value))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                      STC Watts (W)
                    </label>
                    <input
                      type="number"
                      value={panelWatts}
                      onChange={(e) => setPanelWatts(Number(e.target.value))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Inverter MPPT Limits Card */}
            <div className="bg-white/80 backdrop-blur-md border border-stone-200 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#00490e] mb-5 flex items-center gap-2 border-b border-stone-100 pb-3">
                <Cpu className="w-5 h-5 text-[#00490e]" />
                Inverter Limits
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Max Inverter Input Voltage (Voc Max)
                  </label>
                  <input
                    type="number"
                    value={inverterMaxVoc}
                    onChange={(e) => setInverterMaxVoc(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e] text-base"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                      MPPT Min (V)
                    </label>
                    <input
                      type="number"
                      value={inverterMinMppt}
                      onChange={(e) => setInverterMinMppt(Number(e.target.value))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                      MPPT Max (V)
                    </label>
                    <input
                      type="number"
                      value={inverterMaxMppt}
                      onChange={(e) => setInverterMaxMppt(Number(e.target.value))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Min Ambient °C
                    </label>
                    <input
                      type="number"
                      value={coldTempC}
                      onChange={(e) => setColdTempC(Number(e.target.value))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Max Cell °C
                    </label>
                    <input
                      type="number"
                      value={hotTempC}
                      onChange={(e) => setHotTempC(Number(e.target.value))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#00490e]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Stitch Results Cards */}
          <div className="lg:col-span-8 space-y-6">
            {/* Primary Result Highlight Card */}
            <div className="bg-gradient-to-br from-white via-[#f4fbf5] to-[#e8f6ea] border border-emerald-200/80 rounded-3xl p-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-900 font-semibold rounded-full text-xs mb-4 border border-emerald-300 uppercase tracking-wider">
                OPTIMAL CONFIGURATION
              </span>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-6">
                <div>
                  <div className="text-6xl sm:text-7xl font-extrabold text-[#00490e] tracking-tight mb-2">
                    {series} × {parallel}
                  </div>
                  <h3 className="text-lg font-bold text-stone-800">
                    Series Modules × Parallel Strings
                  </h3>
                </div>

                <div className="bg-white/90 border border-emerald-200 rounded-2xl p-4 flex gap-4 text-xs">
                  <div>
                    <span className="text-stone-500 font-medium block mb-0.5">Total Modules</span>
                    <span className="font-bold text-stone-900 text-lg">{series * parallel}</span>
                  </div>
                  <div className="w-px bg-stone-200" />
                  <div>
                    <span className="text-stone-500 font-medium block mb-0.5">System Size</span>
                    <span className="font-bold text-stone-900 text-lg">{resData.arrayKwp ?? Number(((series * parallel * panelWatts) / 1000).toFixed(1))} kWp</span>
                  </div>
                </div>
              </div>

              {/* Electrical Parameters Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-emerald-200/60 pt-6 text-xs">
                <div>
                  <span className="text-stone-500 font-medium block mb-0.5">Cold String Voc</span>
                  <span className="font-bold text-[#00490e] text-base">{resData.stringColdVoc ?? Math.round(series * panelVoc * 1.12)} V</span>
                </div>
                <div>
                  <span className="text-stone-500 font-medium block mb-0.5">Hot String Vmp</span>
                  <span className="font-bold text-[#00490e] text-base">{resData.stringHotVmp ?? Math.round(series * panelVmp * 0.88)} V</span>
                </div>
                <div>
                  <span className="text-stone-500 font-medium block mb-0.5">Total Array Isc</span>
                  <span className="font-bold text-[#00490e] text-base">{resData.totalArrayIsc ?? Number((parallel * panelIsc).toFixed(1))} A</span>
                </div>
                <div>
                  <span className="text-stone-500 font-medium block mb-0.5">Voc Safety Margin</span>
                  <span className="font-bold text-[#00490e] text-base">{resData.coldVocMarginVolts ?? Math.round(inverterMaxVoc - (series * panelVoc * 1.12))} V</span>
                </div>
              </div>
            </div>

            {/* Inverter Compatibility Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Voltage Check</span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-2xl font-extrabold text-[#00490e] mb-1">
                  {resData.coldVocCheck ?? 'PASS'}
                </p>
                <p className="text-xs text-stone-600">
                  Cold Voc ({resData.stringColdVoc}V) is below max input ({inverterMaxVoc}V).
                </p>
              </div>

              <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">MPPT Check</span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-2xl font-extrabold text-[#00490e] mb-1">
                  {resData.mpptMinCheck === 'PASS' && resData.mpptMaxCheck === 'PASS' ? 'PASS' : 'REVIEW'}
                </p>
                <p className="text-xs text-stone-600">
                  Hot Vmp ({resData.stringHotVmp}V) inside MPPT ({inverterMinMppt}V-{inverterMaxMppt}V).
                </p>
              </div>

              <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Current Check</span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-2xl font-extrabold text-[#00490e] mb-1">
                  {resData.currentCheck ?? 'PASS'}
                </p>
                <p className="text-xs text-stone-600">
                  Array Isc ({resData.totalArrayIsc}A) within max input ({inverterMaxIsc}A).
                </p>
              </div>
            </div>

            {/* Interactive Visual Topology Diagram */}
            {isSuccess && (
              <PvVisualDiagram
                totalModules={series * parallel}
                seriesPerString={series}
                parallelStrings={parallel}
                mpptCount={1}
                stringVocCold={resData.stringColdVoc ?? Math.round(series * panelVoc * 1.12)}
                stringVmpHot={resData.stringHotVmp ?? Math.round(series * panelVmp * 0.88)}
                arrayIsc={resData.totalArrayIsc ?? Number((parallel * panelIsc).toFixed(1))}
                arrayKwp={resData.arrayKwp ?? Number(((series * parallel * panelWatts) / 1000).toFixed(2))}
                inverterMaxVoc={inverterMaxVoc}
                inverterMinMppt={inverterMinMppt}
                inverterMaxMppt={inverterMaxMppt}
                validationStatus={{
                  coldVocPass: resData.coldVocCheck === 'PASS',
                  mpptRangePass: resData.mpptMinCheck === 'PASS' && resData.mpptMaxCheck === 'PASS',
                  currentPass: resData.currentCheck === 'PASS',
                  overall: resData.overallCheck ?? 'PASS',
                }}
              />
            )}

            {/* Next Tool Navigation CTA */}
            <Link
              href="/tools/energy-yield"
              className="w-full bg-[#00490e] hover:bg-emerald-900 text-white font-semibold py-4 rounded-full text-sm shadow-md transition-all flex items-center justify-center gap-2 group"
            >
              Proceed to Solar Energy Yield Estimator
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
              toolTitle="PV String Layout & MPPT Configurator"
              toolId="pv-configuration"
              result={result}
              inputSummary={[
                { label: 'Total Panel Count', value: series * parallel },
                { label: 'Panels in Series', value: series },
                { label: 'Parallel Strings', value: parallel },
                { label: 'Panel STC Voc', value: panelVoc, unit: 'V' },
                { label: 'Panel STC Vmp', value: panelVmp, unit: 'V' },
                { label: 'Inverter Max Voc', value: inverterMaxVoc, unit: 'V' },
                { label: 'Inverter MPPT Range', value: `${inverterMinMppt}V – ${inverterMaxMppt}V` },
              ]}
              calculationSummary={[
                { label: 'Cold Weather String Voc', value: resData.stringColdVoc, unit: 'V DC' },
                { label: 'Hot Operating String Vmp', value: resData.stringHotVmp, unit: 'V DC' },
                { label: 'Array Total Short-Circuit Current (Isc)', value: resData.totalArrayIsc, unit: 'A' },
                { label: 'Cold Voc Margin', value: resData.coldVocMarginVolts, unit: 'V' },
              ]}
              engineeringChecks={[
                { label: 'Cold Morning Voc Over-Voltage Check', value: `${resData.stringColdVoc}V ≤ ${inverterMaxVoc}V`, check: resData.coldVocCheck as 'PASS' | 'FAIL' ?? 'PASS' },
                { label: 'Hot Operating Vmp MPPT Minimum Check', value: `${resData.stringHotVmp}V ≥ ${inverterMinMppt}V`, check: resData.mpptMinCheck as 'PASS' | 'FAIL' ?? 'PASS' },
                { label: 'Hot Operating Vmp MPPT Maximum Check', value: `${resData.stringHotVmp}V ≤ ${inverterMaxMppt}V`, check: resData.mpptMaxCheck as 'PASS' | 'FAIL' ?? 'PASS' },
                { label: 'Array Short-Circuit Current Check', value: `${resData.totalArrayIsc}A ≤ ${inverterMaxIsc}A`, check: resData.currentCheck as 'PASS' | 'FAIL' ?? 'PASS' },
              ]}
              nextToolHref="/tools/energy-yield"
              nextToolLabel="Solar Energy Yield Estimator"
            />
          </div>
        )}

        <UnlockReportCTA />
        <PublicWaitlistForm interestedTool="PV String Layout Configurator" />
        <RelatedToolsList currentToolId="pv-configuration" />
      </div>
    </main>
  );
}
