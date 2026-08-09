'use client';

import React from 'react';
import { SharedCalculationResult } from '@/lib/engineering/types';
import {
  CheckCircle2, XCircle, AlertTriangle, ChevronRight, FileText,
  ArrowRight, Printer
} from 'lucide-react';
import Link from 'next/link';

interface ReportSection {
  label: string;
  value: string | number;
  unit?: string;
  check?: 'PASS' | 'FAIL' | 'WARNING' | 'N/A';
}

interface EngineeringReportProps {
  toolTitle: string;
  toolId: string;
  result: SharedCalculationResult;
  inputSummary: ReportSection[];      // Key inputs to show in report
  calculationSummary: ReportSection[]; // Key calculated results
  engineeringChecks?: ReportSection[]; // PASS/FAIL checks
  nextToolHref?: string;
  nextToolLabel?: string;
}

function CheckIcon({ check }: { check?: ReportSection['check'] }) {
  if (check === 'PASS') return <CheckCircle2 size={15} className="text-emerald-700 shrink-0" />;
  if (check === 'FAIL') return <XCircle size={15} className="text-red-700 shrink-0" />;
  if (check === 'WARNING') return <AlertTriangle size={15} className="text-amber-600 shrink-0" />;
  return null;
}

function CheckBadge({ check }: { check?: ReportSection['check'] }) {
  if (!check || check === 'N/A') return null;
  const map = {
    PASS: 'bg-emerald-100 text-emerald-950 border-emerald-300',
    FAIL: 'bg-red-100 text-red-950 border-red-300',
    WARNING: 'bg-amber-100 text-amber-950 border-amber-300',
    'N/A': 'bg-stone-100 text-stone-500 border-stone-200',
  };
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${map[check]}`}>
      <CheckIcon check={check} />
      {check}
    </span>
  );
}

function ConfidenceBadge({ confidence }: { confidence: string }) {
  const map: Record<string, string> = {
    HIGH: 'bg-emerald-100 text-emerald-950 border-emerald-300',
    MODERATE: 'bg-sky-100 text-sky-950 border-sky-300',
    REVIEW_RECOMMENDED: 'bg-amber-100 text-amber-950 border-amber-300',
    LOW: 'bg-red-100 text-red-950 border-red-300',
  };
  return (
    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${map[confidence] ?? map.MODERATE}`}>
      {confidence.replace(/_/g, ' ')}
    </span>
  );
}

export function EngineeringReport({
  toolTitle,
  toolId,
  result,
  inputSummary,
  calculationSummary,
  engineeringChecks,
  nextToolHref,
  nextToolLabel,
}: EngineeringReportProps) {
  const reportDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric',
  });

  const passCount = engineeringChecks?.filter(c => c.check === 'PASS').length ?? 0;
  const failCount = engineeringChecks?.filter(c => c.check === 'FAIL').length ?? 0;
  const warnCount = engineeringChecks?.filter(c => c.check === 'WARNING').length ?? 0;
  const overallStatus = failCount > 0 ? 'FAIL' : warnCount > 0 ? 'WARNING' : 'PASS';

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden" id={`report-${toolId}`}>
      {/* Report Header */}
      <div className="bg-emerald-950 text-white px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-emerald-300 text-[10px] font-bold uppercase tracking-widest mb-1">
              Sunlit Energy · Engineering Calculation Report
            </p>
            <h3 className="text-lg font-extrabold leading-tight">{toolTitle}</h3>
            <p className="text-emerald-300 text-xs mt-1">
              Generated: {reportDate} · Engine v{result.engine_version} · Tool: {toolId}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <ConfidenceBadge confidence={result.confidence} />
            {engineeringChecks && (
              <div className={`text-xs font-extrabold px-3 py-1.5 rounded-full border flex items-center gap-1.5 ${
                overallStatus === 'PASS'
                  ? 'bg-emerald-800 border-emerald-600 text-white'
                  : overallStatus === 'WARNING'
                  ? 'bg-amber-500 border-amber-400 text-white'
                  : 'bg-red-700 border-red-500 text-white'
              }`}>
                <CheckIcon check={overallStatus as ReportSection['check']} />
                Overall: {overallStatus}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="divide-y divide-stone-100">
        {/* Engineering Checks (if provided) */}
        {engineeringChecks && engineeringChecks.length > 0 && (
          <div className="px-6 py-5">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={16} className="text-emerald-800" />
              <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Engineering Validation</h4>
              <div className="ml-auto flex items-center gap-1.5 text-[10px] font-bold">
                {passCount > 0 && <span className="text-emerald-800">{passCount} PASS</span>}
                {warnCount > 0 && <span className="text-amber-600">{warnCount} WARNING</span>}
                {failCount > 0 && <span className="text-red-700">{failCount} FAIL</span>}
              </div>
            </div>
            <div className="space-y-2">
              {engineeringChecks.map((check, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs border ${
                    check.check === 'PASS'
                      ? 'bg-emerald-50 border-emerald-200'
                      : check.check === 'FAIL'
                      ? 'bg-red-50 border-red-200'
                      : check.check === 'WARNING'
                      ? 'bg-amber-50 border-amber-200'
                      : 'bg-stone-50 border-stone-200'
                  }`}
                >
                  <span className="font-semibold text-stone-700">{check.label}</span>
                  <div className="flex items-center gap-2">
                    {(check.value !== undefined && check.value !== '') && (
                      <span className="font-bold text-stone-900">
                        {check.value}{check.unit ? ` ${check.unit}` : ''}
                      </span>
                    )}
                    <CheckBadge check={check.check} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Calculation Summary */}
        <div className="px-6 py-5">
          <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <ChevronRight size={15} className="text-emerald-800" /> Calculation Results
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {calculationSummary.map((item, idx) => (
              <div key={idx} className="bg-stone-50 rounded-xl px-4 py-3 border border-stone-200/60">
                <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">{item.label}</p>
                <p className="text-xl font-extrabold text-emerald-900 leading-tight mt-0.5">
                  {item.value !== undefined && item.value !== null ? item.value : '—'}
                  {item.unit && <span className="text-sm font-medium text-stone-500 ml-1">{item.unit}</span>}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Input Summary */}
        <div className="px-6 py-5">
          <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <ChevronRight size={15} className="text-emerald-800" /> Design Inputs
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {inputSummary.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs py-1.5 border-b border-stone-100 last:border-0">
                <span className="text-stone-500 font-medium">{item.label}</span>
                <span className="font-bold text-stone-900">
                  {item.value ?? '—'}{item.unit ? ` ${item.unit}` : ''}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Assumptions */}
        {result.assumptions && Object.keys(result.assumptions).length > 0 && (
          <div className="px-6 py-5 bg-stone-50/70">
            <h4 className="text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">Engineering Assumptions</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {Object.entries(result.assumptions).map(([k, v]) => (
                <div key={k} className="flex justify-between text-xs py-1 border-b border-stone-200/50 last:border-0">
                  <span className="text-stone-500 capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="font-semibold text-stone-700">{String(v)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warnings */}
        {result.warnings && result.warnings.length > 0 && (
          <div className="px-6 py-5">
            <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <AlertTriangle size={15} className="text-amber-600" /> Warnings & Notes
            </h4>
            <div className="space-y-2">
              {result.warnings.map((w: { code: string; message: string; severity?: string; suggestion?: string }, idx: number) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-xs ${
                    w.severity === 'critical'
                      ? 'bg-red-50 border-red-200'
                      : w.severity === 'warning'
                      ? 'bg-amber-50 border-amber-200'
                      : 'bg-sky-50 border-sky-200'
                  }`}
                >
                  <p className={`font-bold mb-1 ${
                    w.severity === 'critical' ? 'text-red-900' : w.severity === 'warning' ? 'text-amber-900' : 'text-sky-900'
                  }`}>{w.message}</p>
                  {w.suggestion && (
                    <p className="text-stone-600">{w.suggestion}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Supporting Notes */}
        {result.supporting_notes && result.supporting_notes.length > 0 && (
          <div className="px-6 py-5 bg-stone-50/50">
            <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Calculation Notes</h4>
            <ul className="space-y-1">
              {result.supporting_notes.map((note: string, idx: number) => (
                <li key={idx} className="text-xs text-stone-600 leading-snug flex gap-2">
                  <span className="text-emerald-700 shrink-0 mt-0.5">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Limitations Disclaimer */}
        <div className="px-6 py-4 bg-stone-100/60">
          <p className="text-[10px] text-stone-500 leading-relaxed">
            <strong className="text-stone-600">Limitations:</strong>{' '}
            This report is generated using simplified engineering models based on standard industry assumptions.
            Results are indicative only and must be verified by a qualified electrical/solar engineer before procurement,
            installation, or regulatory submission. Sunlit Energy accepts no liability for decisions made solely on
            the basis of this calculation output.
          </p>
        </div>

        {/* CTA */}
        {nextToolHref && (
          <div className="px-6 py-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 mb-1">Next Engineering Action</p>
                <p className="text-sm font-bold text-stone-900">{nextToolLabel ?? 'Continue to next tool'}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 border border-stone-300 px-3 py-2 rounded-lg transition-all cursor-pointer"
                >
                  <Printer size={13} /> Print
                </button>
                <Link
                  href={nextToolHref}
                  className="inline-flex items-center gap-1.5 bg-emerald-900 hover:bg-emerald-950 text-white font-bold px-5 py-2.5 rounded-full text-xs transition-all shrink-0 shadow-sm"
                >
                  {nextToolLabel ?? 'Next Tool'} <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
