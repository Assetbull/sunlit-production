interface SummaryMetric {
  label: string;
  value: string | number;
  unit?: string;
  description?: string;
}

interface CalculationSummaryProps {
  metrics: SummaryMetric[];
  title?: string;
}

export function CalculationSummary({ metrics, title = 'Engineering Calculation Summary' }: CalculationSummaryProps) {
  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-stone-200 my-6">
      <h3 className="text-xl font-bold text-stone-900 mb-6 border-b border-stone-100 pb-3">
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((m, idx) => (
          <div key={idx} className="bg-stone-50 rounded-xl p-4 border border-stone-200/60">
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
              {m.label}
            </p>
            <div className="text-2xl font-extrabold text-emerald-900">
              {m.value} <span className="text-sm font-medium text-stone-600">{m.unit || ''}</span>
            </div>
            {m.description && (
              <p className="text-xs text-stone-500 mt-1 leading-snug">{m.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
