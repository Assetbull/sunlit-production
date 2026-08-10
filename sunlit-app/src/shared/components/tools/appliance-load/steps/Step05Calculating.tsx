'use client';

import React, { useEffect, useState } from 'react';

interface Step05Props {
  onComplete: () => void;
}

const LOAD_STAGES = [
  'Validating connected equipment inventory & wattage...',
  'Aggregating active connected electrical load...',
  'Analyzing motor startup inductive surge multipliers...',
  'Modeling peak inverter demand & surge headroom...',
  'Computing daily & monthly kWh energy consumption...',
  'Generating final appliance load engineering report...',
];

export function Step05Calculating({ onComplete }: Step05Props) {
  const [progress, setProgress] = useState<number>(0);
  const [stageIndex, setStageIndex] = useState<number>(0);

  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 250);
      }
      setProgress(currentProgress);
      const stage = Math.min(
        Math.floor((currentProgress / 100) * LOAD_STAGES.length),
        LOAD_STAGES.length - 1
      );
      setStageIndex(stage);
    }, 55);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[420px] text-center py-8 px-4">
      {/* Animated Circular Pulse Container */}
      <div className="relative mb-8">
        <div className="w-28 h-28 rounded-full bg-[#aef4a5]/30 flex items-center justify-center animate-pulse">
          <div className="w-20 h-20 rounded-full bg-[#00490e] text-white flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-4xl animate-spin">
              sync
            </span>
          </div>
        </div>
      </div>

      <span className="text-xs font-semibold text-[#00490e] uppercase tracking-widest mb-2 block">
        Appliance Load Calculation Engine
      </span>

      <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#1a1c19] max-w-xl">
        Processing Energy Demand Profile...
      </h2>

      <p className="font-sans text-sm text-[#41493e] mt-2 h-6 max-w-lg transition-all duration-300">
        {LOAD_STAGES[stageIndex]}
      </p>

      {/* Progress Bar */}
      <div className="w-full max-w-md bg-[#e3e3de] rounded-full h-3 mt-8 overflow-hidden relative">
        <div
          className="bg-gradient-to-r from-[#00490e] to-[#2b6b2c] h-full rounded-full transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="font-mono text-sm font-bold text-[#00490e] mt-3">
        {progress}% Completed
      </div>

      {/* Pipeline Stage Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-8 w-full max-w-lg text-left text-xs font-sans">
        {LOAD_STAGES.map((stg, idx) => {
          const isDone = idx < stageIndex;
          const isCurrent = idx === stageIndex;
          return (
            <div
              key={idx}
              className={`p-2 rounded-xl border flex items-center gap-2 transition-all ${
                isDone
                  ? 'bg-[#eeeee9] border-[#00490e]/30 text-[#00490e]'
                  : isCurrent
                  ? 'bg-white border-[#00490e] text-[#1a1c19] font-bold shadow-sm'
                  : 'bg-[#f4f4ee]/50 border-transparent text-[#717a6d]'
              }`}
            >
              <span
                className={`material-symbols-outlined text-base ${
                  isDone ? 'text-[#00490e]' : isCurrent ? 'text-[#00490e] animate-pulse' : 'text-[#717a6d]'
                }`}
              >
                {isDone ? 'check_circle' : isCurrent ? 'hourglass_top' : 'radio_button_unchecked'}
              </span>
              <span className="truncate text-[11px]">Stage 0{idx + 1}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
