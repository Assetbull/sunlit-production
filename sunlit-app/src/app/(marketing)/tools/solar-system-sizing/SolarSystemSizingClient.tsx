'use client';

import React, { useState } from 'react';
import { SolarSizerModal } from '@/shared/components/tools/solar-sizer/SolarSizerModal';
import { ToolHeader } from '@/shared/components/tools/ToolHeader';
import { UnlockReportCTA } from '@/shared/components/tools/UnlockReportCTA';
import { PublicWaitlistForm } from '@/shared/components/tools/PublicWaitlistForm';
import { RelatedToolsList } from '@/shared/components/tools/RelatedToolsList';
import { ShieldCheck, Play, ArrowRight, Sun, Battery, Cpu, Sliders } from 'lucide-react';
import Link from 'next/link';

export function SolarSystemSizingClient() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);

  return (
    <main className="bg-[#f7fbf1] text-[#191d17] font-sans min-h-screen pb-24 antialiased">
      <ToolHeader
        title="Solar System Sizing Calculator"
        category="System Design & Autonomy"
        description="Calculate required solar array kWp, battery kWh storage, and inverter kVA capacity tailored for property power requirements in Nigeria."
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-8">
        {/* Page Launch Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-[#c0c9bb]/40 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#00490e] bg-[#aef4a5]/40 px-2.5 py-0.5 rounded-full border border-[#92d78b]">
                Stitch Visual DNA Engine
              </span>
              <span className="text-xs text-[#717a6d] font-medium">• Integrated System Sizer V2.0</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#00490e] tracking-tight">
              Guided Solar System Engineering Sizer
            </h1>
            <p className="text-[#41493e] text-sm sm:text-base mt-1">
              Complete 9-step guided engineering wizard cross-validating load profile, battery autonomy, and solar array yield.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-[#00490e] hover:bg-[#003006] text-white font-semibold px-6 py-3.5 rounded-full text-sm shadow-md transition-all hover:scale-105"
          >
            <Play size={18} className="fill-white" />
            <span>Launch Solar Sizer Wizard</span>
          </button>
        </div>

        {/* Overview Bento Card Behind Modal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-md border border-[#c0c9bb]/40 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#aef4a5]/40 flex items-center justify-center text-[#00490e]">
              <Sun size={20} />
            </div>
            <h3 className="font-bold text-lg text-[#191d17]">Solar Irradiation Mapping</h3>
            <p className="text-xs text-[#41493e]">
              Calculates solar kWp requirements matching regional peak sun hours across Lagos, Abuja, Kano, and Port Harcourt.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md border border-[#c0c9bb]/40 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#dce6d5] flex items-center justify-center text-[#5e675a]">
              <Battery size={20} />
            </div>
            <h3 className="font-bold text-lg text-[#191d17]">Battery Autonomy Sizing</h3>
            <p className="text-xs text-[#41493e]">
              Determines LiFePO4 storage capacity for 0.5, 1.0, 1.5, or 2.0 days of seamless grid blackout protection.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md border border-[#c0c9bb]/40 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#d8e3fb] flex items-center justify-center text-[#101c2d]">
              <Cpu size={20} />
            </div>
            <h3 className="font-bold text-lg text-[#191d17]">Hybrid Inverter Rating</h3>
            <p className="text-xs text-[#41493e]">
              Engineers apparent kVA inverter capacity to handle continuous continuous power and inductive appliance surges.
            </p>
          </div>
        </div>

        <UnlockReportCTA />
        <PublicWaitlistForm interestedTool="Solar System Sizing Calculator" />
        <RelatedToolsList currentToolId="solar-system-sizing" />
      </div>

      {/* Guided 9-Step Solar System Sizer Modal */}
      <SolarSizerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}
