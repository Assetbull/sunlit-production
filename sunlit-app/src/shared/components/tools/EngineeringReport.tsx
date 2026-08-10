'use client';

import React, { useState } from 'react';
import { SharedCalculationResult } from '@/lib/engineering/types';
import {
  CheckCircle2, XCircle, AlertTriangle, ChevronRight, FileText,
  ArrowRight, Printer, ShieldCheck, ChevronDown, Sparkles, UserCheck, Send
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
  inputSummary: ReportSection[];
  calculationSummary: ReportSection[];
  engineeringChecks?: ReportSection[];
  nextToolHref?: string;
  nextToolLabel?: string;
  onOpenAccountModal?: () => void;
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
  onOpenAccountModal,
}: EngineeringReportProps) {
  const [showEngineeringDetails, setShowEngineeringDetails] = useState(false);

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
      <div className="bg-[#00490e] text-white px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[#aef4a5] text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <ShieldCheck size={14} /> Sunlit Enterprise Engineering Platform
            </p>
            <h3 className="text-xl font-extrabold leading-tight">{toolTitle}</h3>
            <p className="text-[#dce6d5] text-xs mt-1">
              Generated: {reportDate} · Engine v{result.engine_version} · ID: {toolId}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <ConfidenceBadge confidence={result.confidence} />
            {engineeringChecks && (
              <div className={`text-xs font-extrabold px-3 py-1.5 rounded-full border flex items-center gap-1.5 ${
                overallStatus === 'PASS'
                  ? 'bg-[#003006] border-[#92d78b] text-[#aef4a5]'
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
        {/* Customer View Explanation */}
        <div className="px-6 py-5 bg-[#f7fbf1] border-b border-[#c0c9bb]/40">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-[#00490e] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={14} className="text-[#00490e]" /> Customer Executive Summary
            </h4>
            <button
              onClick={() => setShowEngineeringDetails(!showEngineeringDetails)}
              className="text-xs font-bold text-[#00490e] hover:underline flex items-center gap-1 bg-[#aef4a5]/30 px-3 py-1 rounded-full border border-[#92d78b]"
            >
              <span>[ Engineering details {showEngineeringDetails ? '▲' : '▾'} ]</span>
            </button>
          </div>
          <p className="text-xs text-[#191d17] leading-relaxed">
            {result.confidenceReasoning || 'System calculation complete. All equipment parameters and autonomy targets have been evaluated for performance in Nigeria.'}
          </p>
        </div>

        {/* Engineering View (Toggleable Details) */}
        {showEngineeringDetails && (
          <div className="px-6 py-5 bg-[#f0f4ec] space-y-4">
            <h4 className="text-xs font-bold text-[#00490e] uppercase tracking-wider flex items-center gap-2">
              <FileText size={15} /> Mathematical Basis & Engineering Standards
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-[#c0c9bb]">
                <span className="font-bold text-[#191d17]">Governing Standards:</span>
                <p className="text-[#41493e] mt-0.5">IEC 61724-1, IEEE 1562, BS 7671 18th Edition</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#c0c9bb]">
                <span className="font-bold text-[#191d17]">Mathematical Engine:</span>
                <p className="text-[#41493e] mt-0.5">Sunlit Deterministic Numerical Engine v2.0.0</p>
              </div>
            </div>
          </div>
        )}

        {/* Engineering Checks */}
        {engineeringChecks && engineeringChecks.length > 0 && (
          <div className="px-6 py-5">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={16} className="text-[#00490e]" />
              <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Engineering Validation Gates</h4>
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
            <ChevronRight size={15} className="text-[#00490e]" /> Calculation Results
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {calculationSummary.map((item, idx) => (
              <div key={idx} className="bg-stone-50 rounded-xl px-4 py-3 border border-stone-200/60">
                <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">{item.label}</p>
                <p className="text-xl font-extrabold text-[#00490e] leading-tight mt-0.5">
                  {item.value !== undefined && item.value !== null ? item.value : '—'}
                  {item.unit && <span className="text-sm font-medium text-stone-500 ml-1">{item.unit}</span>}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 3-Tier Lead Generation CTAs */}
        <div className="px-6 py-6 bg-[#f7fbf1] border-t border-[#c0c9bb]/60 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-[#00490e]">Recommended Next Actions</p>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Primary CTA */}
            <button
              onClick={() => onOpenAccountModal ? onOpenAccountModal() : null}
              className="flex-1 bg-[#00490e] hover:bg-[#003006] text-white font-extrabold px-6 py-3.5 rounded-full text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <UserCheck size={16} />
              <span>Create Account & View Full Report</span>
            </button>

            {/* Secondary CTA */}
            <Link
              href="/marketplace"
              className="flex-1 bg-white hover:bg-stone-50 text-[#00490e] border border-[#00490e] font-extrabold px-6 py-3.5 rounded-full text-xs transition-all flex items-center justify-center gap-2 text-center"
            >
              <ShieldCheck size={16} />
              <span>Find Installers in My Area</span>
            </Link>
          </div>

          {/* Tertiary Action */}
          <div className="text-center pt-1">
            <Link href="/marketplace" className="text-xs font-bold text-[#41493e] hover:text-[#00490e] inline-flex items-center gap-1.5 underline">
              <Send size={13} />
              <span>Send this engineering design to installers for quotation</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
