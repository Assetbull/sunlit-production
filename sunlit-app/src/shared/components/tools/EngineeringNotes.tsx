import { FileText, AlertCircle } from 'lucide-react';
import { EngineeringWarning } from '@/lib/engineering/types';

interface EngineeringNotesProps {
  notes: string[];
  assumptions: Record<string, string | number>;
  warnings?: EngineeringWarning[];
}

export function EngineeringNotes({ notes, assumptions, warnings }: EngineeringNotesProps) {
  return (
    <div className="stone-panel rounded-2xl p-6 md:p-8 mb-6">
      <div className="flex items-center gap-2 mb-4 border-b border-outline-variant/40 pb-3">
        <FileText size={20} className="text-primary" />
        <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Engineering Methodology & Assumptions</h3>
      </div>

      {warnings && warnings.length > 0 && (
        <div className="mb-6 space-y-3">
          {warnings.map((w, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border text-xs flex items-start gap-3 ${
                w.severity === 'critical'
                  ? 'bg-error-container border-error/40 text-on-error-container'
                  : w.severity === 'warning'
                  ? 'bg-amber-50 border-amber-300 text-amber-950'
                  : 'bg-surface-container-low border-outline-variant text-on-surface'
              }`}
            >
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">{w.message}</span>
                {w.suggestion && <p className="text-[11px] mt-1 opacity-90">{w.suggestion}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        <div>
          <h4 className="font-label-caps text-label-caps text-secondary mb-3">Applied Engineering Assumptions</h4>
          <ul className="space-y-2 font-data-mono-md text-xs text-on-surface-variant">
            {Object.entries(assumptions).map(([k, v]) => (
              <li key={k} className="flex justify-between border-b border-outline-variant/40 pb-1.5">
                <span className="text-secondary">{k}:</span>
                <span className="font-bold text-on-surface">{v}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-label-caps text-label-caps text-secondary mb-3">Supporting Calculation Notes</h4>
          <ul className="space-y-2 font-body-md text-xs text-on-surface-variant list-disc list-inside">
            {notes.map((note, idx) => (
              <li key={idx} className="leading-relaxed">{note}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
