'use client';

import { Zap, Power, ShieldCheck, TrendingUp } from 'lucide-react';
import styles from '../page.module.css';

interface SizingSidebarProps {
  consumption: number;
  systemSize: string;
}

export default function SizingSidebar({ consumption, systemSize }: SizingSidebarProps) {
  return (
    <div className="glass-card p-8 border border-white/40 rounded-[32px] shadow-2xl space-y-8 min-w-[320px]">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold font-headline text-emerald-900">Live Sizing</h3>
        <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-widest animate-pulse">
          Recalculating...
        </span>
      </div>

      <div className="space-y-1">
        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Daily Energy Consumption</span>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold font-headline text-slate-900">{consumption.toFixed(1)}</span>
          <span className="text-xl font-bold text-emerald-600">kWh/day</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
          <div className="h-full cta-gradient rounded-full transition-all duration-700" style={{ width: `${Math.min((consumption / 25) * 100, 100)}%` }} />
        </div>
      </div>

      <div className="bg-white/50 rounded-2xl p-6 border border-white/20 shadow-sm">
        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-4 block">Recommended System</span>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl cta-gradient flex items-center justify-center text-white shadow-lg">
            <Power size={24} />
          </div>
          <div>
            <p className="text-lg font-bold font-headline leading-tight">{systemSize} kVA Hybrid</p>
            <p className="text-xs text-slate-500">Luminous Precision Tier</p>
          </div>
        </div>
        
        <ul className="space-y-2 text-xs font-semibold text-emerald-900">
          <li className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-primary" />
            8x 550W Mono-crystalline Panels
          </li>
          <li className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-primary" />
            2x 5.1kWh Lithium LiFePO4
          </li>
        </ul>
      </div>

      <div className="pt-6 border-t border-slate-200">
        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2 block">Investment ROI</span>
        <div className="bg-emerald-950 text-white p-6 rounded-2xl relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] opacity-70 font-bold tracking-wider uppercase">Breakeven Estimate</p>
            <p className="text-lg font-bold font-headline mt-1">2.4 Years</p>
            <p className="text-[10px] mt-2 opacity-60">Based on Lagos fuel/grid rates</p>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <TrendingUp size={120} />
          </div>
        </div>
      </div>
    </div>
  );
}
