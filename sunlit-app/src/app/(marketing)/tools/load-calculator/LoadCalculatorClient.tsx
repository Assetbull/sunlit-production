'use client';

import React, { useState } from 'react';
import { ApplianceLoadModal } from '@/shared/components/tools/appliance-load/ApplianceLoadModal';
import { ToolHeader } from '@/shared/components/tools/ToolHeader';
import { UnlockReportCTA } from '@/shared/components/tools/UnlockReportCTA';
import { PublicWaitlistForm } from '@/shared/components/tools/PublicWaitlistForm';
import { RelatedToolsList } from '@/shared/components/tools/RelatedToolsList';
import { Play, Zap, Gauge, Battery, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function LoadCalculatorClient() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);

  return (
    <main className="bg-[#fafaf4] text-[#1a1c19] font-sans min-h-screen pb-24 antialiased">
      <ToolHeader
        title="Appliance Load Calculator"
        category="Load Sizing & Energy Consumption"
        description="Manage and configure equipment for precision solar system sizing, peak demand estimation, and daily kWh energy consumption."
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-8">
        {/* Workspace Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-[#c0c9bb]/40 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#00490e] bg-[#aef4a5]/40 px-2.5 py-0.5 rounded-full border border-[#92d78b]">
                Stitch Visual DNA Engine
              </span>
              <span className="text-xs text-[#717a6d] font-medium">• Guided Appliance Sizer V2.0</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#00490e] tracking-tight">
              Guided Appliance Load Calculator
            </h1>
            <p className="text-[#41493e] text-sm sm:text-base mt-1">
              Configure connected equipment, peak motor surge multipliers, and daily operational hours.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-[#00490e] hover:bg-[#003006] text-white font-semibold px-6 py-3.5 rounded-full text-sm shadow-md transition-all hover:scale-105"
          >
            <Play size={18} className="fill-white" />
            <span>Launch Appliance Load Wizard</span>
          </button>
        </div>

        {/* Feature Bento Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-md border border-[#c0c9bb]/40 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#aef4a5]/40 flex items-center justify-center text-[#00490e]">
              <Zap size={20} />
            </div>
            <h3 className="font-bold text-lg text-[#1a1c19]">Active Power Aggregation</h3>
            <p className="text-xs text-[#41493e]">
              Aggregates baseline running wattage across cooling, HVAC, lighting, computing, and utility equipment.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md border border-[#c0c9bb]/40 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#e8e1de] flex items-center justify-center text-[#686461]">
              <Zap size={20} />
            </div>
            <h3 className="font-bold text-lg text-[#1a1c19]">Motor Surge Modeling</h3>
            <p className="text-xs text-[#41493e]">
              Applies inductive startup surge multipliers (up to 4.0×) to ensure adequate inverter headroom.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md border border-[#c0c9bb]/40 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#dbe5da] flex items-center justify-center text-[#151e17]">
              <ArrowRight size={20} />
            </div>
            <h3 className="font-bold text-lg text-[#1a1c19]">Solar System Sizer Integration</h3>
            <p className="text-xs text-[#41493e]">
              Directly exports calculated daily kWh energy demand into the Sunlit Solar System Sizer calculator.
            </p>
          </div>
        </div>

        <UnlockReportCTA />
        <PublicWaitlistForm interestedTool="Appliance Load Calculator" />
        <RelatedToolsList currentToolId="load-calculator" />
      </div>

      {/* Guided 7-Step Appliance Load Calculator Modal */}
      <ApplianceLoadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}

