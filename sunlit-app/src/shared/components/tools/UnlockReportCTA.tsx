import { Lock, FileText, ArrowRight } from 'lucide-react';

interface UnlockReportCTAProps {
  onUnlockClick?: () => void;
}

export function UnlockReportCTA({ onUnlockClick }: UnlockReportCTAProps) {
  return (
    <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 text-white rounded-2xl p-6 md:p-8 shadow-xl my-6 border border-emerald-800 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-800 flex items-center justify-center shrink-0">
          <Lock size={24} className="text-emerald-200" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-white mb-1">
            Unlock Professional Engineering Report & BOM
          </h4>
          <p className="text-xs text-emerald-200 max-w-xl leading-relaxed">
            Register for free access to downloadable PDF engineering reports, full Bill of Materials (BOM), voltage drop curves, and installer bid distribution.
          </p>
        </div>
      </div>

      <button
        onClick={onUnlockClick}
        className="bg-white text-emerald-950 font-extrabold px-6 py-3.5 rounded-full text-xs hover:bg-emerald-100 transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-md"
      >
        Unlock Full Report <ArrowRight size={16} />
      </button>
    </div>
  );
}
