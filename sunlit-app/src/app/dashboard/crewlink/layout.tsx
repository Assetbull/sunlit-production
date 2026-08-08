'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HardHat, LogOut, CheckCircle, Zap } from 'lucide-react';
import { getNavigation } from '@/core/rbac/nav-bridge';

export default function CrewLinkLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Use the navigation bridge for crewlink
  const navItems = getNavigation('crew_member');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <nav className="w-full md:w-80 bg-slate-950 text-white flex-shrink-0 flex flex-col md:min-h-screen border-r border-slate-900 sticky top-0 z-50">
        <div className="p-8 flex items-center justify-between md:justify-start gap-4">
          <Link href="/dashboard/crewlink" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-[14px] bg-primary flex items-center justify-center text-slate-950 group-hover:rotate-12 transition-transform shadow-[0_0_24px_rgba(0,184,148,0.4)]">
              <HardHat size={22} className="fill-slate-950" />
            </div>
            <div className="flex flex-col">
              <span className="font-headline font-black text-lg tracking-tight leading-none text-white">CrewLink</span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-1">Worker Terminal</span>
            </div>
          </Link>
          <button 
            className="md:hidden p-2 text-slate-400 hover:text-white"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="space-y-1.5">
              <span className={`block w-6 h-0.5 bg-current transition-transform ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-6 h-0.5 bg-current transition-opacity ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-0.5 bg-current transition-transform ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>

        <div className="px-8 pb-8 flex items-center gap-4">
           <div className="w-14 h-14 rounded-full bg-slate-800 border-2 border-slate-700 p-1 flex-shrink-0 relative">
              <img src="https://i.pravatar.cc/150?u=crew1" alt="Profile" className="w-full h-full rounded-full" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-slate-950 flex items-center justify-center">
                 <CheckCircle size={10} className="text-white" />
              </div>
           </div>
           <div>
             <h3 className="text-sm font-black text-white">David O.</h3>
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Tier 2 Installer</p>
           </div>
        </div>

        <div className={`flex-1 flex flex-col gap-2 px-6 ${isMobileMenuOpen ? 'block pb-8' : 'hidden md:flex'}`}>
          <div className="px-3 mb-2 mt-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Workflows</div>
          
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center justify-between p-3 rounded-2xl group transition-all duration-300 ${isActive ? 'bg-primary text-slate-950 shadow-[0_4px_24px_rgba(0,184,148,0.2)]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
              >
                <div className="flex items-center gap-4">
                  <Icon size={20} className={isActive ? 'text-slate-950' : 'text-slate-500 group-hover:text-primary'} />
                  <span className="text-sm font-bold tracking-wide">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${isActive ? 'bg-slate-950 text-white' : 'bg-primary/20 text-primary'}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <div className={`p-6 mt-auto border-t border-slate-900 ${isMobileMenuOpen ? 'block' : 'hidden md:block'}`}>
          <button className="flex items-center gap-3 p-3 w-full rounded-2xl text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-colors group">
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold tracking-wide">End Session</span>
          </button>
        </div>
      </nav>

      <main className="flex-1 w-full bg-slate-50 overflow-x-hidden min-h-screen">
        <div className="w-full max-w-[1200px] mx-auto p-4 md:p-8">
           {children}
        </div>
      </main>
    </div>
  );
}
