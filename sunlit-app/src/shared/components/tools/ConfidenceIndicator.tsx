import { ConfidenceLevel } from '@/lib/engineering/types';
import { ShieldCheck, AlertTriangle, Info } from 'lucide-react';

interface ConfidenceIndicatorProps {
  level: ConfidenceLevel;
  reasoning: string;
}

export function ConfidenceIndicator({ level, reasoning }: ConfidenceIndicatorProps) {
  const isHigh = level === 'HIGH';
  const isModerate = level === 'MODERATE';

  return (
    <div
      className={`p-4 rounded-xl border flex items-start gap-3 my-4 ${
        isHigh
          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
          : isModerate
          ? 'bg-amber-50 border-amber-200 text-amber-900'
          : 'bg-red-50 border-red-200 text-red-900'
      }`}
    >
      {isHigh ? (
        <ShieldCheck size={20} className="text-emerald-700 shrink-0 mt-0.5" />
      ) : isModerate ? (
        <Info size={20} className="text-amber-700 shrink-0 mt-0.5" />
      ) : (
        <AlertTriangle size={20} className="text-red-700 shrink-0 mt-0.5" />
      )}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider mb-1">
          Engineering Confidence: {level}
        </div>
        <p className="text-sm leading-relaxed opacity-90">{reasoning}</p>
      </div>
    </div>
  );
}
