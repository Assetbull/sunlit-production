'use client';

import React, { useState } from 'react';
import { InverterSizingModal } from '@/shared/components/tools/inverter-sizing/InverterSizingModal';
import { ToolHeader } from '@/shared/components/tools/ToolHeader';
import { UnlockReportCTA } from '@/shared/components/tools/UnlockReportCTA';
import { PublicWaitlistForm } from '@/shared/components/tools/PublicWaitlistForm';
import { RelatedToolsList } from '@/shared/components/tools/RelatedToolsList';
import { Play, Gauge, Zap, Layers, ArrowRight } from 'lucide-react';

export function InverterSizingClient() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);

  return (
    <main className="bg-[#f7fbf1] text-[#191d17] font-sans min-h-screen pb-24 antialiased">
      <ToolHeader
        title="Inverter Sizing Calculator"
        category="Power Inverter & Conversion Sizing"
        description="Determine continuous kVA/kW capacity, motor startup surge multipliers, power factor derating, and system DC voltage architecture for solar inverters."
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-8">
        {/* Workspace Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-[#c0c9bb]/40 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#00490e] bg-[#aef4a5]/40 px-2.5 py-0.5 rounded-full border border-[#92d78b]">
                Stitch Visual DNA Engine
              </span>
              <span className="text-xs text-[#717a6d] font-medium">• Guided Inverter Sizer V2.1</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#00490e] tracking-tight">
              Guided Inverter Sizing Calculator
            </h1>
            <p className="text-[#41493e] text-sm sm:text-base mt-1">
              Determine continuous kVA/kW output, surge handling headroom, and DC bus voltage architecture.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-[#00490e] hover:bg-[#003006] text-white font-semibold px-6 py-3.5 rounded-full text-sm shadow-md transition-all hover:scale-105"
          >
            <Play size={18} className="fill-white" />
            <span>Launch Inverter Sizing Wizard</span>
          </button>
        </div>

        {/* Feature Bento Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-md border border-[#c0c9bb]/40 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#aef4a5]/40 flex items-center justify-center text-[#00490e]">
              <Zap size={20} />
            </div>
            <h3 className="font-bold text-lg text-[#191d17]">Continuous kVA / kW Output</h3>
            <p className="text-xs text-[#41493e]">
              Calculates nominal active and apparent power to sustain active connected loads without overloading.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md border border-[#c0c9bb]/40 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#dce6d5] flex items-center justify-center text-[#586154]">
              <Layers size={20} />
            </div>
            <h3 className="font-bold text-lg text-[#191d17]">Motor Startup Surge Buffer</h3>
            <p className="text-xs text-[#41493e]">
              Evaluates 3× to 5× inrush startup surge current for air conditioners, pumps, and refrigerators.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md border border-[#c0c9bb]/40 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#d8e3fb] flex items-center justify-center text-[#101c2d]">
              <ArrowRight size={20} />
            </div>
            <h3 className="font-bold text-lg text-[#191d17]">Seamless Pipeline Handoff</h3>
            <p className="text-xs text-[#41493e]">
              Exports calculated kVA rating directly to Solar Panel Sizing and Cable Sizing engineering tools.
            </p>
          </div>
        </div>

        <UnlockReportCTA />
        <PublicWaitlistForm interestedTool="Inverter Sizing Calculator" />
        <RelatedToolsList currentToolId="inverter-sizing" />
      </div>

      {/* Guided 7-Step Inverter Sizing Calculator Modal */}
      <InverterSizingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}
