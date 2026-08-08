'use client';

import React from 'react';
import { Lock, Bell, Mail, ArrowRight } from 'lucide-react';

export default function InstallerLock() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <div className="max-w-3xl w-full surface-card--glass p-12 rounded-[3rem] shadow-2xl border border-white/40 flex flex-col items-center text-center animate-in fade-in zoom-in duration-700">
        
        <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-8 shadow-inner border border-primary/20">
          <Lock size={40} strokeWidth={2.5} className="animate-pulse" />
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold font-headline text-slate-900 tracking-tight leading-tight mb-6">
          Installer Dashboard <br />
          <span className="text-primary italic">Coming Soon</span>
        </h1>
        
        <p className="text-xl text-slate-600 max-w-xl leading-relaxed mb-10 font-medium">
          We are currently preparing your specialized executive workspace. Your tools for pipeline management, project discovery, and bidding will appear here shortly.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">
          <div className="p-6 bg-white/50 rounded-3xl border border-white/60 shadow-sm hover:shadow-md transition-all">
            <h3 className="font-bold text-slate-800 mb-1">Pipeline Engine</h3>
            <p className="text-sm text-slate-500">Track and manage every solar installation phase.</p>
          </div>
          <div className="p-6 bg-white/50 rounded-3xl border border-white/60 shadow-sm hover:shadow-md transition-all">
            <h3 className="font-bold text-slate-800 mb-1">Market Discovery</h3>
            <p className="text-sm text-slate-500">Instant access to verified high-value RFQs.</p>
          </div>
          <div className="p-6 bg-white/50 rounded-3xl border border-white/60 shadow-sm hover:shadow-md transition-all">
            <h3 className="font-bold text-slate-800 mb-1">Secure Payouts</h3>
            <p className="text-sm text-slate-500">Integrated payment release at every milestone.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <button className="h-16 px-8 cta-gradient text-white rounded-2xl font-extrabold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-3">
            <Bell size={20} />
            Notify Me on Launch
          </button>
          <button className="h-16 px-8 bg-white text-slate-800 rounded-2xl font-extrabold shadow-sm border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center gap-3">
            <Mail size={20} />
            Join the Waitlist
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="mt-12 flex items-center gap-4 text-slate-400 text-sm font-bold uppercase tracking-widest">
            <span className="w-12 h-[1px] bg-slate-200"></span>
            Luminous Precision Design
            <span className="w-12 h-[1px] bg-slate-200"></span>
        </div>
      </div>
    </div>
  );
}
