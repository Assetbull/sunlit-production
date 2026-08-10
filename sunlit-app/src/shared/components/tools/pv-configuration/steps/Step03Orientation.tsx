'use client';

import React from 'react';

interface Step03Props {
  tiltAngle: number;
  azimuthDeg: number;
  soilingLossPercent: number;
  onChangeTilt: (tilt: number) => void;
  onChangeAzimuth: (azimuth: number) => void;
  onChangeSoiling: (soiling: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step03Orientation({
  tiltAngle,
  azimuthDeg,
  soilingLossPercent,
  onChangeTilt,
  onChangeAzimuth,
  onChangeSoiling,
  onNext,
  onBack,
}: Step03Props) {
  return (
    <div className="flex flex-col gap-6 py-2">
      <div>
        <span className="text-xs font-semibold text-[#00490e] uppercase tracking-wider block mb-1">
          Step 03 of 08
        </span>
        <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#191d17]">
          Roof Tilt Angle & Azimuth Orientation
        </h2>
        <p className="font-sans text-sm text-[#41493e] mt-1">
          Configure array tilt angle (0° to 45°), azimuth direction (180° = True South), and environmental soiling derating.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tilt & Azimuth Sliders */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#c0c9bb]/40 shadow-sm space-y-5">
          <h4 className="font-headline font-bold text-sm text-[#00490e] uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-base">explore</span>
            <span>Solar Array Geometry</span>
          </h4>

          {/* Tilt Angle Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-sans font-bold text-[#191d17]">Roof Tilt Angle (° Degree)</label>
              <span className="font-mono font-bold text-[#00490e] bg-[#f2f5ec] px-2.5 py-0.5 rounded-lg border border-[#c0c9bb]/40">
                {tiltAngle}° {tiltAngle === 0 ? '(Horizontal Flat Roof)' : tiltAngle === 15 ? '(Optimal West Africa)' : ''}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={45}
              step={1}
              value={tiltAngle}
              onChange={(e) => onChangeTilt(Number(e.target.value))}
              className="w-full accent-[#00490e] h-2 bg-[#ecefe6] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#717a6d] font-mono">
              <span>0° (Flat Roof)</span>
              <span>15° (Optimal)</span>
              <span>45° (Steep Roof)</span>
            </div>
          </div>

          {/* Azimuth Slider */}
          <div className="space-y-2 pt-2 border-t border-[#c0c9bb]/30">
            <div className="flex justify-between items-center text-xs">
              <label className="font-sans font-bold text-[#191d17]">Azimuth Facing Direction (° Degree)</label>
              <span className="font-mono font-bold text-[#00490e] bg-[#f2f5ec] px-2.5 py-0.5 rounded-lg border border-[#c0c9bb]/40">
                {azimuthDeg}° {azimuthDeg === 180 ? '(True South)' : azimuthDeg === 90 ? '(East)' : azimuthDeg === 270 ? '(West)' : ''}
              </span>
            </div>
            <input
              type="range"
              min={90}
              max={270}
              step={5}
              value={azimuthDeg}
              onChange={(e) => onChangeAzimuth(Number(e.target.value))}
              className="w-full accent-[#00490e] h-2 bg-[#ecefe6] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#717a6d] font-mono">
              <span>90° (East)</span>
              <span>180° (South - Optimal)</span>
              <span>270° (West)</span>
            </div>
          </div>
        </div>

        {/* Soiling & Environmental Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#c0c9bb]/40 shadow-sm space-y-4">
          <h4 className="font-headline font-bold text-sm text-[#00490e] uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-base">cloud</span>
            <span>Soiling & Environmental Derating</span>
          </h4>

          <div className="space-y-2">
            <label className="font-sans font-bold text-xs text-[#191d17] block">
              Dust & Harmattan Soiling Loss (%)
            </label>
            <select
              value={soilingLossPercent}
              onChange={(e) => onChangeSoiling(Number(e.target.value))}
              className="w-full bg-[#ecefe6] border border-[#c0c9bb]/60 rounded-xl px-3.5 py-2.5 font-bold text-xs text-[#191d17] outline-none focus:ring-2 focus:ring-[#00490e]"
            >
              <option value={2.0}>2.0% Loss — Clean urban roof with regular rainfall washing</option>
              <option value={3.0}>3.0% Loss — Standard regional soiling baseline (IEC default)</option>
              <option value={5.0}>5.0% Loss — High dust / Harmattan season heavy soiling</option>
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#c0c9bb]/30">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-[#c0c9bb] text-[#191d17] font-sans text-sm font-semibold hover:bg-[#ecefe6] transition-all"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 bg-[#00490e] hover:bg-[#003006] text-white px-7 py-2.5 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md group"
        >
          <span>Calculate Annual Energy Yield</span>
          <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}
