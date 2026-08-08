'use client';

import { PenTool, FileSpreadsheet, PackageCheck, Sun } from 'lucide-react';

interface WhySunlitProps {
  onWaitlistOpen: () => void;
}

export function WhySunlit({ onWaitlistOpen }: WhySunlitProps) {
  return (
    <section className="py-24 bg-surface-container-high relative overflow-hidden" id="engineering-os">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-display-lg-mobile md:text-display-lg font-headline-xl text-on-surface mb-4 font-extrabold tracking-tight">
            The Engineering Operating System
          </h2>
          <p className="text-body-lg font-body-lg text-on-surface-variant leading-relaxed">
            Powerful SaaS tools designed for solar professionals to design, quote, and manage projects with unprecedented efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Feature List */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-surface-container-lowest rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-stone-200">
                <PenTool size={22} className="text-primary" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-on-surface mb-2">Solar Design Studio</h4>
                <p className="text-body-md text-on-surface-variant text-sm leading-relaxed">
                  Generate accurate 3D roof models, optimal panel placement, and precise shading analysis in minutes.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-surface-container-lowest rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-stone-200">
                <FileSpreadsheet size={22} className="text-primary" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-on-surface mb-2">Automated Proposal Builder</h4>
                <p className="text-body-md text-on-surface-variant text-sm leading-relaxed">
                  Create stunning, interactive proposals with financial modeling, ROI projections, and customizable templates.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-surface-container-lowest rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-stone-200">
                <PackageCheck size={22} className="text-primary" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-on-surface mb-2">Procurement & Inventory</h4>
                <p className="text-body-md text-on-surface-variant text-sm leading-relaxed">
                  Source tier-one equipment directly through the platform with real-time pricing and availability.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Dashboard Mockup Visual */}
          <div className="lg:col-span-7 relative">
            <div className="bg-surface-container-lowest rounded-2xl p-3 shadow-xl border border-surface-container-highest">
              {/* Dashboard Header Mockup */}
              <div className="flex items-center gap-2 border-b border-surface-container px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="mx-auto bg-surface-container px-4 py-1 rounded-md text-xs font-mono text-on-surface-variant font-semibold">
                  Sunlit Engineering OS v2.4
                </div>
              </div>

              {/* Dashboard Body Mockup */}
              <div className="p-6 grid grid-cols-3 gap-6 h-[380px]">
                {/* Sidebar */}
                <div className="col-span-1 flex flex-col gap-3 border-r border-stone-100 pr-4">
                  <div className="h-6 bg-surface-container rounded w-3/4" />
                  <div className="h-3.5 bg-surface-container rounded w-full" />
                  <div className="h-3.5 bg-surface-container rounded w-5/6" />
                  <div className="h-3.5 bg-surface-container rounded w-full" />
                  <div className="mt-auto h-28 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-col items-center justify-center p-3 text-center">
                    <Sun size={24} className="text-emerald-700 mb-1" />
                    <span className="text-xs font-bold text-emerald-900">Live Simulation</span>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="col-span-2 flex flex-col gap-4">
                  <div className="h-44 bg-surface-container rounded-xl overflow-hidden relative border border-stone-200 flex items-center justify-center">
                    <div className="grid grid-cols-4 gap-2 p-4 transform rotate-12 scale-110 opacity-70">
                      <div className="w-10 h-14 bg-emerald-700/60 rounded" />
                      <div className="w-10 h-14 bg-emerald-700/60 rounded" />
                      <div className="w-10 h-14 bg-emerald-700/60 rounded" />
                      <div className="w-10 h-14 bg-emerald-700/60 rounded" />
                      <div className="w-10 h-14 bg-emerald-700/60 rounded" />
                      <div className="w-10 h-14 bg-emerald-700/60 rounded" />
                      <div className="w-10 h-14 bg-emerald-700/60 rounded" />
                      <div className="w-10 h-14 bg-emerald-700/60 rounded" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 flex-1">
                    <div className="bg-surface-container rounded-xl p-3 flex flex-col justify-end">
                      <div className="h-2 w-full bg-stone-200 rounded-full mb-2">
                        <div className="h-full bg-emerald-700 w-3/4 rounded-full" />
                      </div>
                      <div className="h-3 bg-stone-300 rounded w-1/2" />
                    </div>
                    <div className="bg-surface-container rounded-xl p-3 flex items-end gap-1.5">
                      <div className="w-1/4 h-1/3 bg-emerald-300 rounded-t" />
                      <div className="w-1/4 h-2/3 bg-emerald-500 rounded-t" />
                      <div className="w-1/4 h-full bg-emerald-700 rounded-t" />
                      <div className="w-1/4 h-4/5 bg-emerald-600 rounded-t" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
