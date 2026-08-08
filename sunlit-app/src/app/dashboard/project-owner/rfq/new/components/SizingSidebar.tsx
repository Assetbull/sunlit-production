'use client';

import { Zap, Power, ShieldCheck, TrendingUp, Info } from 'lucide-react';
import styles from '../page.module.css';

interface SizingSidebarProps {
  consumption: number;
  systemSize: string;
}

export default function SizingSidebar({ consumption, systemSize }: SizingSidebarProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="surface-card p-8 border border-surface-3 rounded-[32px] shadow-sm space-y-8 min-w-[320px]">
        <div className="flex items-center justify-between">
          <h3 className="title-md font-bold font-headline">Live Sizing</h3>
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-primary/10 rounded-full">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            <span className="label-xs text-primary font-bold uppercase tracking-widest">
              Live Feed
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <span className="label-xs uppercase font-bold tracking-widest text-muted">Daily Operation Load</span>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black font-headline text-base">{consumption.toFixed(1)}</span>
            <span className="text-lg font-bold text-primary">kWh/day</span>
          </div>
          <div className="w-full bg-surface-3 h-1.5 rounded-full mt-4 overflow-hidden">
            <div 
                className="h-full bg-primary rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_var(--accent-glow)]" 
                style={{ width: `${Math.min((consumption / 25) * 100, 100)}%` }} 
            />
          </div>
        </div>

        <div className="bg-surface-2 rounded-2xl p-6 border border-surface-3">
          <span className="label-xs uppercase font-bold tracking-widest text-muted mb-4 block">Recommended Plant</span>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
              <Power size={24} />
            </div>
            <div>
              <p className="font-bold text-lg leading-tight">{systemSize} kVA Hybrid</p>
              <p className="text-[10px] text-muted font-bold tracking-wider uppercase">Luminous Precision Tier</p>
            </div>
          </div>
          
          <ul className="space-y-2.5">
            <li className="flex items-center gap-2.5 text-xs font-bold">
              <ShieldCheck size={14} className="text-primary" />
              Standard Panel Array
            </li>
            <li className="flex items-center gap-2.5 text-xs font-bold text-muted">
              <ShieldCheck size={14} className="opacity-40" />
              Lithium Storage Bank
            </li>
          </ul>
        </div>

        <div className="pt-6 border-t border-surface-3">
          <span className="label-xs uppercase font-bold tracking-widest text-muted mb-3 block">Marketplace Insight</span>
          <div className="bg-surface-dark text-white p-6 rounded-[24px] relative overflow-hidden group">
            <div className="relative z-10">
              <p className="label-xs opacity-60 font-bold tracking-wider uppercase">Payback Estimate</p>
              <p className="text-2xl font-black font-headline mt-1 tracking-tight">2.4 Years</p>
              <p className="text-[10px] mt-2 opacity-50 font-medium">Based on current petrol/grid price index</p>
            </div>
            <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <TrendingUp size={140} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="surface-card p-6 bg-primary/5 border border-primary/10 rounded-2xl flex gap-4">
        <Info size={20} className="text-primary shrink-0" />
        <p className="body-xs text-primary/80 font-medium">
            Your system sizing is calculated using standard energy indices. Installers may optimize this after site inspection.
        </p>
      </div>
    </div>
  );
}
