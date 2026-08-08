'use client';

import { useState } from 'react';
import { calculatePvConfiguration } from '@/lib/engineering/calculators/pvConfiguration';
import { SharedCalculationResult } from '@/lib/engineering/types';
import { ToolHeader } from '@/shared/components/tools/ToolHeader';
import { ConfidenceIndicator } from '@/shared/components/tools/ConfidenceIndicator';
import { CalculationSummary } from '@/shared/components/tools/CalculationSummary';
import { EngineeringNotes } from '@/shared/components/tools/EngineeringNotes';
import { UnlockReportCTA } from '@/shared/components/tools/UnlockReportCTA';
import { PublicWaitlistForm } from '@/shared/components/tools/PublicWaitlistForm';
import { RelatedToolsList } from '@/shared/components/tools/RelatedToolsList';
import { Cpu, ArrowRight } from 'lucide-react';

export function PvConfigurationClient() {
  const [panelCount, setPanelCount] = useState<number>(16);
  const [panelVoc, setPanelVoc] = useState<number>(49.5);
  const [panelVmp, setPanelVmp] = useState<number>(41.5);
  const [panelIsc, setPanelIsc] = useState<number>(13.8);
  const [inverterMaxVoc, setInverterMaxVoc] = useState<number>(500);
  const [inverterMinMppt, setInverterMinMppt] = useState<number>(120);
  const [inverterMaxMppt, setInverterMaxMppt] = useState<number>(450);
  const [inverterMaxIsc, setInverterMaxIsc] = useState<number>(26);

  const [result, setResult] = useState<SharedCalculationResult>(() =>
    calculatePvConfiguration({
      totalPanelCount: 16,
      panelVoc: 49.5,
      panelVmp: 41.5,
      panelIsc: 13.8,
      inverterMaxVoc: 500,
      inverterMinMpptVoltage: 120,
      inverterMaxMpptVoltage: 450,
      inverterMaxIsc: 26,
    })
  );

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(
      calculatePvConfiguration({
        totalPanelCount: panelCount,
        panelVoc,
        panelVmp,
        panelIsc,
        inverterMaxVoc,
        inverterMinMpptVoltage: inverterMinMppt,
        inverterMaxMpptVoltage: inverterMaxMppt,
        inverterMaxIsc,
      })
    );
  };

  const isSuccess = result.calculation_status === 'SUCCESS';
  const resData = result.engineering_results;

  return (
    <main className="bg-surface min-h-screen pb-24">
      <ToolHeader
        title="PV String Layout Configurator"
        category="MPPT String Engineering"
        description="Optimize solar panel series-parallel array connections within inverter MPPT voltage windows and over-voltage limits."
      />

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-stone-200">
            <h2 className="text-xl font-bold text-stone-900 mb-6 border-b border-stone-100 pb-3 flex items-center gap-2">
              <Cpu size={20} className="text-primary" /> Array Electrical Specs
            </h2>

            <form onSubmit={handleCalculate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Total Panels *
                </label>
                <input
                  type="number"
                  min={1}
                  value={panelCount}
                  onChange={(e) => setPanelCount(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm font-bold text-stone-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Panel Voc (V)
                  </label>
                  <input
                    type="number"
                    step={0.1}
                    value={panelVoc}
                    onChange={(e) => setPanelVoc(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Panel Vmp (V)
                  </label>
                  <input
                    type="number"
                    step={0.1}
                    value={panelVmp}
                    onChange={(e) => setPanelVmp(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold text-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Inverter Max Voc
                  </label>
                  <input
                    type="number"
                    value={inverterMaxVoc}
                    onChange={(e) => setInverterMaxVoc(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Inverter Max Isc (A)
                  </label>
                  <input
                    type="number"
                    value={inverterMaxIsc}
                    onChange={(e) => setInverterMaxIsc(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold text-stone-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-container text-on-primary font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer mt-4"
              >
                Configure Array Layout <ArrowRight size={18} />
              </button>
            </form>
          </div>

          <div className="lg:col-span-7">
            {isSuccess && (
              <>
                <ConfidenceIndicator level={result.confidence} reasoning={result.confidenceReasoning} />

                <CalculationSummary
                  title="String Configuration Results"
                  metrics={[
                    {
                      label: 'Series Panels per String',
                      value: resData.panelsInSeries,
                      unit: 'Panels in Series',
                      description: `Operating at ${resData.arrayVmpAtStc}V Vmp`,
                    },
                    {
                      label: 'Parallel Strings',
                      value: resData.parallelStrings,
                      unit: 'Parallel Strings',
                      description: `Total array Isc: ${resData.arrayTotalIsc}A`,
                    },
                    {
                      label: 'Cold Morning Voc',
                      value: resData.arrayMaxColdVoc,
                      unit: 'V (Max)',
                      description: `Inverter limit: ${inverterMaxVoc}V`,
                    },
                  ]}
                />

                <EngineeringNotes notes={result.supporting_notes} assumptions={result.assumptions} warnings={result.warnings} />
                <UnlockReportCTA />
              </>
            )}
          </div>
        </div>

        <PublicWaitlistForm interestedTool="PV String Layout Configurator" />
        <RelatedToolsList currentToolId="pv-configuration" />
      </div>
    </main>
  );
}
