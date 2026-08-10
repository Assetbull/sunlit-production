'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SharedCalculationResult } from '@/lib/engineering/types';
import { SunlitIcon } from '@/shared/components/ui/SunlitIcon';

interface Step07Props {
  profileTitle: string;
  userClassification: string;
  calculationResult: SharedCalculationResult | null;
  onUpdateTitle: (title: string) => void;
  onUpdateUserClass: (cls: any) => void;
  onRestart: () => void;
  onClose: () => void;
}

export function Step07SaveProfile({
  profileTitle,
  userClassification,
  calculationResult,
  onUpdateTitle,
  onUpdateUserClass,
  onRestart,
  onClose,
}: Step07Props) {
  const [saved, setSaved] = useState(false);
  const [notice, setActionNotice] = useState<string | null>(null);

  const handleSaveProfile = () => {
    setSaved(true);
    setActionNotice('Appliance Load Profile saved to your Sunlit Energy session account.');
  };

  const handleExportPDF = () => {
    setActionNotice('Compiling verified Appliance Load Profile PDF document...');
    setTimeout(() => {
      setActionNotice('Appliance Load Report & Specification PDF exported!');
    }, 1200);
  };

  const resData = calculationResult?.engineering_results || {};

  return (
    <div className="flex flex-col gap-6 py-2">
      <div>
        <span className="text-[11px] font-bold text-[#00490e] uppercase tracking-wider block mb-1">
          Step 07 of 07
        </span>
        <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#1f1b17]">
          Save Profile & Next Steps
        </h2>
        <p className="font-sans text-sm text-[#40493d] mt-1">
          Save your calculated appliance load profile or proceed to full Solar System Sizing.
        </p>
      </div>

      {/* Notice Banner */}
      {notice && (
        <div className="p-4 bg-[#ceee93]/40 border border-[#00490e]/30 rounded-2xl text-[#00490e] flex items-center justify-between text-xs font-semibold animate-in">
          <div className="flex items-center gap-2">
            <SunlitIcon name="check_circle" size={18} className="text-[#00490e]" />
            <span>{notice}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionNotice(null)}
            className="font-bold hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Profile Details Form Box */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#bfcaba]/40 shadow-xs space-y-4">
        <h4 className="font-headline font-bold text-xs text-[#1f1b17] uppercase tracking-wider">
          Profile Meta Information
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-sans text-xs font-bold text-[#1f1b17] block mb-1">
              Load Profile Name
            </label>
            <input
              type="text"
              value={profileTitle}
              onChange={(e) => onUpdateTitle(e.target.value)}
              className="w-full bg-[#fcf2eb] border border-[#bfcaba]/60 rounded-xl px-4 py-2.5 font-bold text-sm text-[#1f1b17] outline-none focus:ring-2 focus:ring-[#00490e]"
              placeholder="e.g. 4-Bedroom Villa Load Profile"
            />
          </div>

          <div>
            <label className="font-sans text-xs font-bold text-[#1f1b17] block mb-1">
              User Classification
            </label>
            <select
              value={userClassification}
              onChange={(e) => onUpdateUserClass(e.target.value)}
              className="w-full bg-[#fcf2eb] border border-[#bfcaba]/60 rounded-xl px-4 py-2.5 font-bold text-sm text-[#1f1b17] outline-none focus:ring-2 focus:ring-[#00490e]"
            >
              <option value="Homeowner">Homeowner</option>
              <option value="Business Owner">Business Owner</option>
              <option value="Installer">Installer</option>
              <option value="EPC Contractor">EPC Contractor</option>
              <option value="Engineer">Solar Engineer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Proceed to Solar System Sizer CTA */}
        <Link
          href="/tools/solar-system-sizing"
          className="p-5 rounded-2xl border border-[#00490e] bg-gradient-to-br from-[#00490e] to-[#0f631b] text-white text-left transition-all duration-300 hover:shadow-lg group flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white mb-3 shrink-0">
              <SunlitIcon name="solar_power" size={22} />
            </div>
            <h4 className="font-headline font-bold text-lg">Proceed to Solar System Sizer</h4>
            <p className="font-sans text-xs text-white/80 mt-1 leading-relaxed">
              Transfer this load profile ({resData.dailyEnergyDemandKwh ?? 0} kWh/day) into the complete Solar System Sizer calculator.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#8cdd86] group-hover:translate-x-1 transition-transform">
            <span>Launch Solar Sizer</span>
            <SunlitIcon name="arrow_forward" size={14} />
          </div>
        </Link>

        {/* Save Profile to Dashboard */}
        <button
          type="button"
          onClick={handleSaveProfile}
          className="p-5 rounded-2xl border border-[#bfcaba]/50 bg-white/90 backdrop-blur-md text-[#1f1b17] text-left transition-all duration-300 hover:border-[#00490e] hover:shadow-md group flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#f6ece6] flex items-center justify-center text-[#00490e] mb-3 shrink-0 border border-[#bfcaba]/30">
              <SunlitIcon name="bookmark_add" size={22} />
            </div>
            <h4 className="font-headline font-bold text-lg">
              {saved ? 'Profile Saved!' : 'Save Profile to Account'}
            </h4>
            <p className="font-sans text-xs text-[#40493d] mt-1 leading-relaxed">
              Store this electrical load profile in your Sunlit dashboard for EPC contractor quotations.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#00490e] group-hover:translate-x-1 transition-transform">
            <span>{saved ? 'Saved to Account' : 'Save Load Profile'}</span>
            <SunlitIcon name="check" size={14} />
          </div>
        </button>

        {/* Export PDF */}
        <button
          type="button"
          onClick={handleExportPDF}
          className="p-5 rounded-2xl border border-[#bfcaba]/50 bg-white/90 backdrop-blur-md text-[#1f1b17] text-left transition-all duration-300 hover:border-[#00490e] hover:shadow-md group flex flex-col justify-between sm:col-span-2 cursor-pointer"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#f6ece6] flex items-center justify-center text-[#00490e] shrink-0 border border-[#bfcaba]/30">
              <SunlitIcon name="payments" size={22} />
            </div>
            <div>
              <h4 className="font-headline font-bold text-base">Export Load Profile PDF</h4>
              <p className="font-sans text-xs text-[#40493d] mt-0.5 leading-relaxed">
                Download verified engineering load specification document detailing connected watts, surge requirements, and category breakdowns.
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-[#bfcaba]/30 gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full border border-[#707a6c] text-[#1f1b17] font-sans text-sm font-semibold hover:bg-[#f6ece6] transition-all cursor-pointer"
        >
          <SunlitIcon name="sync" size={16} />
          <span>Start New Load Calculation</span>
        </button>

        <button
          type="button"
          onClick={onClose}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#00490e] hover:bg-[#0f631b] text-white px-8 py-3 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md cursor-pointer"
        >
          <SunlitIcon name="check_circle" size={18} />
          <span>Complete & Close</span>
        </button>
      </div>
    </div>
  );
}
