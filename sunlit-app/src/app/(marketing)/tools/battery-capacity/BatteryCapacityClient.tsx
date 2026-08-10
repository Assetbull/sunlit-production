'use client';

import React, { useState } from 'react';
import { BatteryCapacityModal } from '@/shared/components/tools/battery-capacity/BatteryCapacityModal';
import { ToolHeader } from '@/shared/components/tools/ToolHeader';
import { UnlockReportCTA } from '@/shared/components/tools/UnlockReportCTA';
import { PublicWaitlistForm } from '@/shared/components/tools/PublicWaitlistForm';
import { RelatedToolsList } from '@/shared/components/tools/RelatedToolsList';
import { Play, Battery, ShieldCheck, Layers, ArrowRight } from 'lucide-react';

export function BatteryCapacityClient() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);

  return (
    <main className="bg-[#f7fbf1] text-[#191d17] font-sans min-h-screen pb-24 antialiased">
      <ToolHeader
        title="Battery Capacity Calculator"
        category="Energy Storage & Battery Bank Sizing"
        description="Determine required battery bank capacity (kWh / Ah), nominal voltage, usable energy reserve, depth of discharge (DoD), and battery module configurations for solar backup."
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-8">
        {/* Workspace Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-[#c0c9bb]/40 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#00490e] bg-[#aef4a5]/40 px-2.5 py-0.5 rounded-full border border-[#92d78b]">
                Stitch Visual DNA Engine
              </span>
              <span className="text-xs text-[#717a6d] font-medium">• Guided Storage Sizer V2.1</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#00490e] tracking-tight">
              Guided Battery Capacity Calculator
            </h1>
            <p className="text-[#41493e] text-sm sm:text-base mt-1">
              Configure storage parameters to calculate required system capacity, autonomy days, and DoD.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-[#00490e] hover:bg-[#003006] text-white font-semibold px-6 py-3.5 rounded-full text-sm shadow-md transition-all hover:scale-105"
          >
            <Play size={18} className="fill-white" />
            <span>Launch Battery Capacity Wizard</span>
          </button>
        </div>

        {/* Feature Bento Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-md border border-[#c0c9bb]/40 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#aef4a5]/40 flex items-center justify-center text-[#00490e]">
              <Battery size={20} />
            </div>
            <h3 className="font-bold text-lg text-[#191d17]">Gross Installed Capacity</h3>
            <p className="text-xs text-[#41493e]">
              Calculates nominal kWh & Ah capacity required to meet your property autonomy target.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md border border-[#c0c9bb]/40 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#dce6d5] flex items-center justify-center text-[#586154]">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-bold text-lg text-[#191d17]">DoD & Temperature Derating</h3>
            <p className="text-xs text-[#41493e]">
              Enforces 80% LiFePO4 Depth of Discharge limits and ambient thermal derating for maximum battery lifespan.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md border border-[#c0c9bb]/40 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#d8e3fb] flex items-center justify-center text-[#101c2d]">
              <Layers size={20} />
            </div>
            <h3 className="font-bold text-lg text-[#191d17]">Module Architecture</h3>
            <p className="text-xs text-[#41493e]">
              Sizes server-rack wall-mount LiFePO4 modules (5.12 kWh 48V) and exports directly to Inverter Sizer.
            </p>
          </div>
        </div>

        <UnlockReportCTA />
        <PublicWaitlistForm interestedTool="Battery Capacity Calculator" />
        <RelatedToolsList currentToolId="battery-capacity" />
      </div>

      {/* Guided 8-Step Battery Capacity Calculator Modal */}
      <BatteryCapacityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}

