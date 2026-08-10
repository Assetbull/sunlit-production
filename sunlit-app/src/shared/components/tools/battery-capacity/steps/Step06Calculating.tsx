'use client';

import React, { useEffect, useState } from 'react';
import { SunlitIcon } from '@/shared/components/ui/SunlitIcon';

interface Step06Props {
  onComplete: () => void;
}

const STAGES = [
  {
    title: 'Analyzing backup loads & daily energy demand...',
    desc: 'Reading connected appliance wattage and autonomy target.',
  },
  {
    title: 'Calculating required usable energy reserve...',
    desc: 'Computing required net Wh capacity for selected backup duration.',
  },
  {
    title: 'Applying round-trip inverter conversion efficiency...',
    desc: 'Accounting for 92% inverter efficiency losses.',
  },
  {
    title: 'Applying depth-of-discharge (DoD %) safety limits...',
    desc: 'Applying 80% LiFePO4 / 50% Lead-Acid DoD limits.',
  },
  {
    title: 'Applying ambient temperature derating factors...',
    desc: 'Applying 95% temperature derating coefficient.',
  },
  {
    title: 'Sizing battery bank & module architecture...',
    desc: 'Determining total Ah capacity and series-parallel module count.',
  },
];

export function Step06Calculating({ onComplete }: Step06Props) {
  const [progress, setProgress] = useState<number>(0);
  const [stageIndex, setStageIndex] = useState<number>(0);

  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 3;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 300);
      }
      setProgress(currentProgress);
      const stage = Math.min(
        Math.floor((currentProgress / 100) * STAGES.length),
        STAGES.length - 1
      );
      setStageIndex(stage);
    }, 60);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[440px] text-center py-6 px-4">
      {/* Context Header */}
      <div className="inline-flex items-center gap-2 bg-[#f6ece6] px-4 py-1.5 rounded-full text-[#40493d] font-sans text-xs font-bold uppercase tracking-wider mb-3 border border-[#bfcaba]/40">
        STAGE 6 OF 8
      </div>

      <h1 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#00490e] mb-2">
        Sizing Battery Capacity & Storage Reserve
      </h1>
      <p className="font-sans text-sm text-[#40493d] max-w-lg mx-auto mb-6 leading-relaxed">
        Applying depth-of-discharge limits, inverter efficiency, and temperature derating factors.
      </p>

      {/* Progress Bar */}
      <div className="w-full max-w-lg bg-[#f0e6e0] rounded-full h-2.5 mb-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-[#00490e] to-[#0f631b] h-full rounded-full transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="font-mono text-xs font-bold text-[#00490e] mb-6">
        {progress}% Processing Completed
      </div>

      {/* Stage Checklist Panel */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#bfcaba]/40 shadow-xs w-full max-w-lg text-left space-y-2.5">
        {STAGES.map((stg, idx) => {
          const isDone = idx < stageIndex;
          const isCurrent = idx === stageIndex;

          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex items-start gap-3 transition-all duration-300 ${
                isDone
                  ? 'bg-[#fcf2eb]/60 border-[#bfcaba]/30 text-[#1f1b17]'
                  : isCurrent
                  ? 'bg-[#f6ece6] border-[#00490e] text-[#00490e] shadow-xs'
                  : 'bg-transparent border-transparent opacity-50 text-[#707a6c]'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  isDone
                    ? 'bg-[#00490e] text-white'
                    : isCurrent
                    ? 'border-2 border-[#00490e] bg-[#00490e]/10 text-[#00490e]'
                    : 'border-2 border-[#bfcaba] text-transparent'
                }`}
              >
                {isDone ? (
                  <SunlitIcon name="check" size={14} />
                ) : isCurrent ? (
                  <SunlitIcon name="sync" size={12} className="animate-spin text-[#00490e]" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-transparent" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h4
                  className={`font-headline font-bold text-sm leading-snug ${
                    isCurrent ? 'text-[#00490e]' : 'text-[#1f1b17]'
                  }`}
                >
                  {stg.title}
                </h4>
                <p className="font-sans text-xs text-[#40493d] mt-0.5 leading-normal truncate">
                  {stg.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
