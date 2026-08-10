'use client';

import React, { useState } from 'react';
import { SolarPanelModal } from '@/shared/components/tools/solar-panel/SolarPanelModal';
import { ToolHeader } from '@/shared/components/tools/ToolHeader';
import { UnlockReportCTA } from '@/shared/components/tools/UnlockReportCTA';
import { PublicWaitlistForm } from '@/shared/components/tools/PublicWaitlistForm';
import { RelatedToolsList } from '@/shared/components/tools/RelatedToolsList';
import { Play, Sun, Layers, Grid, ArrowRight } from 'lucide-react';

export function SolarPanelSizingClient() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);

  return (
    <main className="bg-[#f7fbf1] text-[#191d17] font-sans min-h-screen pb-24 antialiased">
      <ToolHeader
        title="Solar Panel Sizing Tool"
        category="Photovoltaic Generation & Capacity"
        description="Calculate total array capacity (kWp), panel module count, roof surface area ($m^2$), and annual solar generation based on regional peak sun hours in Nigeria."
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-8">
        {/* Workspace Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-[#c0c9bb]/40 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#00490e] bg-[#aef4a5]/40 px-2.5 py-0.5 rounded-full border border-[#92d78b]">
                Stitch Visual DNA Engine
              </span>
              <span className="text-xs text-[#717a6d] font-medium">• Guided Solar Sizer V2.1</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#00490e] tracking-tight">
              Guided Solar Panel Array Calculator
            </h1>
            <p className="text-[#41493e] text-sm sm:text-base mt-1">
              Photovoltaic generation capacity, panel module quantity, and unshaded roof area estimation.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-[#00490e] hover:bg-[#003006] text-white font-semibold px-6 py-3.5 rounded-full text-sm shadow-md transition-all hover:scale-105"
          >
            <Play size={18} className="fill-white" />
            <span>Launch Solar Panel Array Wizard</span>
          </button>
        </div>

        {/* Feature Bento Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-md border border-[#c0c9bb]/40 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#aef4a5]/40 flex items-center justify-center text-[#00490e]">
              <Sun size={20} />
            </div>
            <h3 className="font-bold text-lg text-[#191d17]">Kilowatt-Peak (kWp) Capacity</h3>
            <p className="text-xs text-[#41493e]">
              Calculates nominal array capacity required to cover 100% of your daily property energy demand.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md border border-[#c0c9bb]/40 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#dce6d5] flex items-center justify-center text-[#586154]">
              <Layers size={20} />
            </div>
            <h3 className="font-bold text-lg text-[#191d17]">High-Efficiency Modules</h3>
            <p className="text-xs text-[#41493e]">
              Supports 550W Tier-1 Mono PERC, 450W TOPCon, and 580W Bifacial dual-glass module specifications.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md border border-[#c0c9bb]/40 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#d8e3fb] flex items-center justify-center text-[#101c2d]">
              <Grid size={20} />
            </div>
            <h3 className="font-bold text-lg text-[#191d17]">String & Footprint Sizing</h3>
            <p className="text-xs text-[#41493e]">
              Computes roof footprint area ($m^2$), MPPT series string layout, Voc voltages, and Isc currents.
            </p>
          </div>
        </div>

        <UnlockReportCTA />
        <PublicWaitlistForm interestedTool="Solar Panel Sizing Tool" />
        <RelatedToolsList currentToolId="solar-panel-sizing" />
      </div>

      {/* Guided 9-Step Solar Panel Sizing Calculator Modal */}
      <SolarPanelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}
