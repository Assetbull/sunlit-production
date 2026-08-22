'use client';

import React from 'react';
import { Lock, FileText, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface UnlockReportCTAProps {
  onUnlockClick?: () => void;
  toolName?: string;
}

export function UnlockReportCTA({ onUnlockClick, toolName = 'Calculation' }: UnlockReportCTAProps) {
  return (
    <div className="bg-[#00490e] text-white rounded-3xl p-6 md:p-8 shadow-xl my-6 border border-[#92d78b]/40 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#aef4a5]/30 border border-[#92d78b] flex items-center justify-center shrink-0">
          <Lock size={22} className="text-[#aef4a5]" />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#aef4a5] bg-[#003006] px-2.5 py-0.5 rounded-full border border-[#92d78b]/50">
            Account-Gated Report System
          </span>
          <h4 className="text-xl font-extrabold text-white mt-1 mb-1">
            Unlock Full {toolName} Engineering Report
          </h4>
          <p className="text-xs text-[#dce6d5] max-w-xl leading-relaxed">
            Your calculation is complete. Create a free Sunlit account to save this design, download the full PDF engineering report with Bill of Materials (BOM), and send RFQs directly to verified installers.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
        <button
          onClick={() => {
            if (onUnlockClick) {
              onUnlockClick();
            } else {
              window.location.href = '/get-started?redirect=report';
            }
          }}
          className="w-full sm:w-auto bg-[#aef4a5] text-[#00490e] font-extrabold px-6 py-3.5 rounded-full text-xs hover:bg-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
        >
          <UserCheck size={16} />
          <span>Create Free Account & View Full Report</span>
        </button>
      </div>
    </div>
  );
}
