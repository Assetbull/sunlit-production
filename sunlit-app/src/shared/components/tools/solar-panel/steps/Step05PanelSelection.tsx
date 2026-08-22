'use client';

import React, { useState } from 'react';
import { PRESET_PANELS } from '../types';
import { SunlitIcon } from '@/shared/components/ui/SunlitIcon';

interface Step05Props {
  panelWattage: number;
  panelModelName: string;
  panelEfficiency: number;
  onChangePanel: (wattage: number, name: string, efficiency: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step05PanelSelection({
  panelWattage,
  panelModelName,
  panelEfficiency,
  onChangePanel,
  onNext,
  onBack,
}: Step05Props) {
  const [customWatt, setCustomWatt] = useState<number>(550);

  return (
    <div className="flex flex-col gap-6 py-2">
      <div>
        <span className="text-[11px] font-bold text-[#00490e] uppercase tracking-wider block mb-1">
          STEP 05 OF 09 (HIGH-FIDELITY SPECIFICATION)
        </span>
        <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#1f1b17]">
          Solar Panel Model & Technology Selection
        </h2>
        <p className="font-sans text-sm text-[#40493d] mt-1 leading-relaxed">
          Choose panel rating, module efficiency, and silicon cell technology to determine exact panel quantity.
        </p>
      </div>

      {/* Preset Panel Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {PRESET_PANELS.map((pnl) => {
          const isSelected = panelWattage === pnl.wattage && panelModelName === pnl.name;

          return (
            <div
              key={pnl.id}
              onClick={() => onChangePanel(pnl.wattage, pnl.name, pnl.efficiency)}
              className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'bg-[#fcf2eb] border-[#00490e] shadow-xs ring-2 ring-[#00490e]/20'
                  : 'bg-white/90 backdrop-blur-md border-[#bfcaba]/40 hover:bg-[#f6ece6]/50'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#00490e] bg-[#ceee93]/40 px-2.5 py-0.5 rounded-full border border-[#00490e]/20">
                    {pnl.technology}
                  </span>
                  <SunlitIcon
                    name={isSelected ? 'check_circle' : 'radio_button_unchecked'}
                    size={20}
                    className={isSelected ? 'text-[#00490e]' : 'text-[#bfcaba]'}
                  />
                </div>
                <h3 className="font-headline font-bold text-base text-[#1f1b17]">{pnl.name}</h3>
                <p className="font-sans text-xs text-[#707a6c] leading-relaxed">{pnl.description}</p>
              </div>

              <div className="pt-3 border-t border-[#bfcaba]/30 space-y-1 text-xs">
                <div className="flex justify-between font-mono">
                  <span className="text-[#707a6c]">STC Rating:</span>
                  <span className="font-bold text-[#00490e]">{pnl.wattage} W</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-[#707a6c]">Efficiency:</span>
                  <span className="font-bold text-[#1f1b17]">{pnl.efficiency}%</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#707a6c]">Dimensions:</span>
                  <span className="text-[#40493d]">{pnl.dimensions}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Panel Wattage Override */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#bfcaba]/40 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-headline font-bold text-sm text-[#1f1b17]">
            Specify Custom Solar Panel Wattage?
          </h4>
          <p className="font-sans text-xs text-[#707a6c] mt-0.5">
            Specify custom panel wattage (e.g. 400W, 600W, 700W) for non-standard installations.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="number"
            min={100}
            max={1000}
            value={customWatt}
            onChange={(e) => setCustomWatt(Number(e.target.value))}
            className="w-28 bg-[#fcf2eb] border border-[#bfcaba]/60 rounded-xl px-3 py-2 font-bold text-xs text-[#1f1b17] outline-none"
          />
          <button
            type="button"
            onClick={() => onChangePanel(customWatt, `${customWatt}W Custom Solar Module`, 20.0)}
            className="px-4 py-2 bg-[#00490e] text-white font-bold text-xs rounded-xl hover:bg-[#0f631b] cursor-pointer"
          >
            Apply Custom
          </button>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#bfcaba]/30">
        <button
          type="button"
          onClick={onBack}
          aria-label="Go Back"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-[#707a6c] text-[#1f1b17] font-sans text-sm font-semibold hover:bg-[#f6ece6] transition-all cursor-pointer"
        >
          <SunlitIcon name="arrow_back" size={16} />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          aria-label="Calculate Solar Array"
          className="inline-flex items-center gap-2 bg-[#00490e] hover:bg-[#0f631b] text-white px-7 py-2.5 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md group cursor-pointer"
        >
          <span>Calculate Solar Array</span>
          <SunlitIcon name="arrow_forward" size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
