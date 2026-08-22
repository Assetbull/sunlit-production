import React from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

interface EngineeringTrustProps {
  toolName: string;
  trustPoints: string[];
}

export function EngineeringTrust({ toolName, trustPoints }: EngineeringTrustProps) {
  return (
    <section className="bg-white/80 backdrop-blur-md border border-[#c0c9bb]/40 rounded-3xl p-8 shadow-sm mb-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-semibold text-[#00490e]">
            <ShieldCheck size={14} className="text-emerald-700" />
            Designed for Precision Engineering
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1f1b17] tracking-tight">
            Built for Nigeria’s Dynamic Energy Landscape
          </h2>

          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            Whether you are an EPC solar installer engineering a multi-kilowatt commercial mini-grid or a homeowner designing an off-grid backup system in Lagos or Abuja, {toolName} provides the rigorous mathematical backing required for long-term reliability.
          </p>

          <ul className="space-y-3 pt-2">
            {trustPoints.map((point, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-stone-800 font-medium">
                <CheckCircle2 className="w-5 h-5 text-[#00490e] shrink-0 mt-0.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-5 bg-gradient-to-br from-[#00490e] to-[#216224] text-white rounded-2xl p-6 shadow-md space-y-4">
          <span className="text-xs uppercase font-bold tracking-widest text-[#aef4a5] block">
            Sunlit Engineering Guarantee
          </span>
          <h3 className="text-xl font-bold">
            Zero Guesswork. Full Mathematical Transparency.
          </h3>
          <p className="text-xs text-white/80 leading-relaxed">
            Every Sunlit calculator leverages deterministic equations rather than opaque estimates, ensuring our numbers match field performance and manufacturer warranty standards.
          </p>
          <div className="pt-2 border-t border-white/20 flex items-center justify-between text-xs text-white/70">
            <span>Deterministic TS Engine</span>
            <span>Zero Data Leakage</span>
          </div>
        </div>
      </div>
    </section>
  );
}
