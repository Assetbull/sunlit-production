'use client';

import React from 'react';
import { Sun, Layers, Cpu, Zap, CheckCircle2, AlertTriangle, XCircle, ArrowRight } from 'lucide-react';

interface PvVisualDiagramProps {
  totalModules: number;
  seriesPerString: number;
  parallelStrings: number;
  mpptCount: number;
  stringVocCold: number;
  stringVmpHot: number;
  arrayIsc: number;
  arrayKwp: number;
  inverterMaxVoc: number;
  inverterMinMppt: number;
  inverterMaxMppt: number;
  validationStatus: {
    coldVocPass: boolean;
    mpptRangePass: boolean;
    currentPass: boolean;
    overall: 'PASS' | 'WARNING' | 'FAIL';
  };
}

export function PvVisualDiagram({
  totalModules,
  seriesPerString,
  parallelStrings,
  mpptCount,
  stringVocCold,
  stringVmpHot,
  arrayIsc,
  arrayKwp,
  inverterMaxVoc,
  inverterMinMppt,
  inverterMaxMppt,
  validationStatus,
}: PvVisualDiagramProps) {
  const stringsPerMppt = Math.ceil(parallelStrings / mpptCount);

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm my-6">
      <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-6">
        <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
          <Layers size={20} className="text-emerald-800" /> PV Array Topology Diagram
        </h3>
        <div className="flex items-center gap-2">
          {validationStatus.overall === 'PASS' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-950 border border-emerald-300">
              <CheckCircle2 size={14} className="text-emerald-800" /> STATUS: PASS
            </span>
          )}
          {validationStatus.overall === 'WARNING' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-950 border border-amber-300">
              <AlertTriangle size={14} className="text-amber-800" /> STATUS: WARNING
            </span>
          )}
          {validationStatus.overall === 'FAIL' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-red-100 text-red-950 border border-red-300">
              <XCircle size={14} className="text-red-800" /> STATUS: FAIL
            </span>
          )}
        </div>
      </div>

      {/* Topology Flow Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        {/* Node 1: PV Modules */}
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-center relative">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center mx-auto mb-2 font-bold">
            <Sun size={20} />
          </div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-1">
            1. PV Modules
          </h4>
          <p className="text-lg font-extrabold text-stone-900">{totalModules} Panels</p>
          <p className="text-[11px] text-stone-500 mt-1">{arrayKwp} kWp Total Peak</p>
        </div>

        {/* Node 2: Strings */}
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-center relative">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center mx-auto mb-2 font-bold">
            <Layers size={20} />
          </div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-1">
            2. String Layout
          </h4>
          <p className="text-lg font-extrabold text-emerald-900">
            {parallelStrings} × {seriesPerString} Series
          </p>
          <p className="text-[11px] text-stone-500 mt-1">
            {seriesPerString} Modules per string
          </p>
        </div>

        {/* Node 3: MPPT Tracker */}
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-center relative">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center mx-auto mb-2 font-bold">
            <Zap size={20} />
          </div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-1">
            3. MPPT Allocation
          </h4>
          <p className="text-lg font-extrabold text-stone-900">
            {mpptCount} MPPT Tracker{mpptCount > 1 ? 's' : ''}
          </p>
          <p className="text-[11px] text-stone-500 mt-1">
            {stringsPerMppt} String(s) / MPPT
          </p>
        </div>

        {/* Node 4: Solar Inverter */}
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-center relative">
          <div className="w-10 h-10 rounded-full bg-emerald-900 text-white flex items-center justify-center mx-auto mb-2 font-bold">
            <Cpu size={20} />
          </div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-1">
            4. Inverter Input
          </h4>
          <p className="text-lg font-extrabold text-emerald-950">
            {stringVocCold}V Cold Voc
          </p>
          <p className="text-[11px] text-stone-500 mt-1">
            Limit: {inverterMaxVoc}V DC
          </p>
        </div>
      </div>

      {/* Validation Criteria Matrix */}
      <div className="mt-6 pt-4 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className={`p-3 rounded-xl border flex items-center justify-between ${
          validationStatus.coldVocPass ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-red-50 border-red-300 text-red-950'
        }`}>
          <span>Cold Voc ({stringVocCold}V &le; {inverterMaxVoc}V)</span>
          <span className="font-bold flex items-center gap-1">
            {validationStatus.coldVocPass ? <CheckCircle2 size={14} className="text-emerald-800" /> : <XCircle size={14} className="text-red-800" />}
            {validationStatus.coldVocPass ? 'PASS' : 'FAIL'}
          </span>
        </div>

        <div className={`p-3 rounded-xl border flex items-center justify-between ${
          validationStatus.mpptRangePass ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-amber-50 border-amber-300 text-amber-950'
        }`}>
          <span>Hot Vmp ({stringVmpHot}V inside {inverterMinMppt}-{inverterMaxMppt}V)</span>
          <span className="font-bold flex items-center gap-1">
            {validationStatus.mpptRangePass ? <CheckCircle2 size={14} className="text-emerald-800" /> : <AlertTriangle size={14} className="text-amber-800" />}
            {validationStatus.mpptRangePass ? 'PASS' : 'WARNING'}
          </span>
        </div>

        <div className={`p-3 rounded-xl border flex items-center justify-between ${
          validationStatus.currentPass ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-red-50 border-red-300 text-red-950'
        }`}>
          <span>Short Circuit Current ({arrayIsc}A)</span>
          <span className="font-bold flex items-center gap-1">
            {validationStatus.currentPass ? <CheckCircle2 size={14} className="text-emerald-800" /> : <XCircle size={14} className="text-red-800" />}
            {validationStatus.currentPass ? 'PASS' : 'FAIL'}
          </span>
        </div>
      </div>
    </div>
  );
}
