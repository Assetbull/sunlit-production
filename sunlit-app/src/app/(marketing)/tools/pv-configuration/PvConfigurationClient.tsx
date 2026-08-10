'use client';

import React, { useState } from 'react';
import { PvConfigurationModal } from '@/shared/components/tools/pv-configuration/PvConfigurationModal';
import { ToolHeader } from '@/shared/components/tools/ToolHeader';
import { UnlockReportCTA } from '@/shared/components/tools/UnlockReportCTA';
import { PublicWaitlistForm } from '@/shared/components/tools/PublicWaitlistForm';
import { RelatedToolsList } from '@/shared/components/tools/RelatedToolsList';
import { Play, Grid, Zap, Layers, ArrowRight } from 'lucide-react';

export function PvConfigurationClient() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);

  return (
    <main className="bg-[#f7fbf1] text-[#191d17] font-sans min-h-screen pb-24 antialiased">
      <ToolHeader
        title="PV String Layout & Energy Yield Configurator"
        category="Photovoltaic Generation & Architecture"
        description="Configure PV array tilt orientation, model annual kWh clean energy yield, specific yield (kWh/kWp/yr), monthly generation profiles, and loss derating waterfall."
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-8">
        {/* Workspace Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-[#c0c9bb]/40 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#00490e] bg-[#aef4a5]/40 px-2.5 py-0.5 rounded-full border border-[#92d78b]">
                Stitch Visual DNA Engine
              </span>
              <span className="text-xs text-[#717a6d] font-medium">• Guided PV Configurator V2.1</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#00490e] tracking-tight">
              Guided PV String Layout & Yield Configurator
            </h1>
            <p className="text-[#41493e] text-sm sm:text-base mt-1">
              Annual clean energy yield (kWh/yr), 12-month generation charts, and tilt scenario comparison.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-[#00490e] hover:bg-[#003006] text-white font-semibold px-6 py-3.5 rounded-full text-sm shadow-md transition-all hover:scale-105"
          >
            <Play size={18} className="fill-white" />
            <span>Launch PV Yield Wizard</span>
          </button>
        </div>

        {/* Feature Bento Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-md border border-[#c0c9bb]/40 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#aef4a5]/40 flex items-center justify-center text-[#00490e]">
              <Zap size={20} />
            </div>
            <h3 className="font-bold text-lg text-[#191d17]">Annual & Specific Yield</h3>
            <p className="text-xs text-[#41493e]">
              Simulates total annual energy yield (kWh/yr) and specific yield (kWh/kWp/yr) across Nigerian locations.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md border border-[#c0c9bb]/40 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#dce6d5] flex items-center justify-center text-[#586154]">
              <Layers size={20} />
            </div>
            <h3 className="font-bold text-lg text-[#191d17]">Loss Waterfall Derating</h3>
            <p className="text-xs text-[#41493e]">
              Calculates STC thermal losses, dust soiling accumulation, cabling ohmic drop, and inverter efficiency.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md border border-[#c0c9bb]/40 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#d8e3fb] flex items-center justify-center text-[#101c2d]">
              <Grid size={20} />
            </div>
            <h3 className="font-bold text-lg text-[#191d17]">Scenario Comparison Matrix</h3>
            <p className="text-xs text-[#41493e]">
              Compares 15° True South fixed mount vs 0° flat roof vs custom orientation scenarios side-by-side.
            </p>
          </div>
        </div>

        <UnlockReportCTA />
        <PublicWaitlistForm interestedTool="PV String Layout Configurator" />
        <RelatedToolsList currentToolId="pv-configuration" />
      </div>

      {/* Guided 8-Step PV Configuration Calculator Modal */}
      <PvConfigurationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}
