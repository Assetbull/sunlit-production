'use client';

import { ReactNode } from 'react';
import { screenRegistry } from '../screens';

interface StitchScreenProps {
  screenId: string;
  fallback?: ReactNode;
  data?: any;
}

/**
 * StitchScreen Loader
 * 
 * Centralized component to render premium Stitch design screens.
 * Uses a registry to map Screen IDs to high-fidelity React implementations.
 */
export function StitchScreen({ screenId, fallback, data }: StitchScreenProps) {
  const ScreenComponent = screenRegistry[screenId as keyof typeof screenRegistry];

  if (!ScreenComponent) {
    return fallback || (
      <div className="min-h-[400px] flex items-center justify-center bg-slate-50/50 rounded-[40px] border-2 border-dashed border-slate-200 m-6">
        <div className="text-center group">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
             <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">
            Syncing Screen Node: {screenId}
          </p>
          <p className="text-slate-300 text-[9px] mt-1 font-medium italic">Establishing Luminous Precision context...</p>
        </div>
      </div>
    );
  }

  return <ScreenComponent data={data} />;
}
