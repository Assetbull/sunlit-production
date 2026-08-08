import { FileText, AlertCircle } from 'lucide-react';
import { EngineeringWarning } from '@/lib/engineering/types';

interface EngineeringNotesProps {
  notes: string[];
  assumptions: Record<string, string | number>;
  warnings?: EngineeringWarning[];
}

export function EngineeringNotes({ notes, assumptions, warnings }: EngineeringNotesProps) {
  return (
    <div className="bg-stone-50 rounded-2xl p-6 md:p-8 border border-stone-200 my-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText size={20} className="text-stone-700" />
        <h3 className="text-lg font-bold text-stone-900">Engineering Methodology & Assumptions</h3>
      </div>

      {warnings && warnings.length > 0 && (
        <div className="mb-6 space-y-3">
          {warnings.map((w, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border text-sm flex items-start gap-2.5 ${
                w.severity === 'critical'
                  ? 'bg-red-50 border-red-300 text-red-900'
                  : w.severity === 'warning'
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-blue-50 border-blue-300 text-blue-900'
              }`}
            >
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">{w.message}</span>
                {w.suggestion && <p className="text-xs mt-1 opacity-90">{w.suggestion}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <div>
          <h4 className="font-bold text-stone-800 mb-2 uppercase text-xs tracking-wider">Applied Engineering Assumptions</h4>
          <ul className="space-y-1.5 font-mono text-xs text-stone-600">
            {Object.entries(assumptions).map(([k, v]) => (
              <li key={k} className="flex justify-between border-b border-stone-200/60 pb-1">
                <span>{k}:</span>
                <span className="font-bold text-stone-900">{v}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-stone-800 mb-2 uppercase text-xs tracking-wider">Supporting Calculation Notes</h4>
          <ul className="space-y-2 text-xs text-stone-600 list-disc list-inside">
            {notes.map((note, idx) => (
              <li key={idx} className="leading-relaxed">{note}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
