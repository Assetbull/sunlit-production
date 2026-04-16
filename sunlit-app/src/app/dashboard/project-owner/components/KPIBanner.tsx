import React from 'react';
import { TrendingUp, Zap, Leaf } from 'lucide-react';

interface KPIBannerProps {
  portfolioValue: string;
  activeYield: string;
  carbonOffset: string;
}

const KPIBanner: React.FC<KPIBannerProps> = ({ portfolioValue, activeYield, carbonOffset }) => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
      <div className="bg-surface-container-low rounded-3xl p-8 flex flex-col justify-between h-48 border-t border-l border-white/40 shadow-[0px_24px_48px_rgba(7,54,66,0.06)] overflow-hidden relative group">
        <div className="relative z-10">
          <p className="text-on-surface-variant font-label text-xs tracking-widest uppercase mb-4">Portfolio Value</p>
          <h2 className="text-4xl font-headline font-bold text-emerald-900">{portfolioValue}</h2>
        </div>
        <div className="flex items-center gap-2 text-emerald-600 font-body text-sm font-medium relative z-10">
          <TrendingUp size={16} />
          <span>+12.4% this quarter</span>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:rotate-0 transition-transform duration-500 rotate-12">
            <TrendingUp size={120} />
        </div>
      </div>

      <div className="bg-surface-container-low rounded-3xl p-8 flex flex-col justify-between h-48 border-t border-l border-white/40 shadow-[0px_24px_48px_rgba(7,54,66,0.06)] overflow-hidden relative group">
        <div className="relative z-10">
          <p className="text-on-surface-variant font-label text-xs tracking-widest uppercase mb-4">Active Yield</p>
          <h2 className="text-4xl font-headline font-bold text-emerald-900">{activeYield}</h2>
        </div>
        <div className="flex items-center gap-2 text-emerald-600 font-body text-sm font-medium relative z-10">
          <Zap size={16} />
          <span>Optimized generation</span>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:rotate-0 transition-transform duration-500 -rotate-12">
            <Zap size={120} />
        </div>
      </div>

      <div className="bg-surface-container-low rounded-3xl p-8 flex flex-col justify-between h-48 border-t border-l border-white/40 shadow-[0px_24px_48px_rgba(7,54,66,0.06)] overflow-hidden relative group">
        <div className="relative z-10">
          <p className="text-on-surface-variant font-label text-xs tracking-widest uppercase mb-4">Carbon Offset</p>
          <h2 className="text-4xl font-headline font-bold text-emerald-900">{carbonOffset} <span className="text-xl font-medium opacity-60">tonnes</span></h2>
        </div>
        <div className="flex items-center gap-2 text-emerald-600 font-body text-sm font-medium relative z-10">
          <Leaf size={16} />
          <span>ESG Compliant</span>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <Leaf size={120} />
        </div>
      </div>
    </section>
  );
};

export default KPIBanner;
