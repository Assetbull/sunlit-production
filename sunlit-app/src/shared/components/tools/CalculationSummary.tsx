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
    <div className="stone-panel rounded-2xl p-6 md:p-8 mb-6">
      <h3 className="font-headline-md text-headline-md font-bold text-on-surface mb-6 border-b border-outline-variant/40 pb-3">
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((m, idx) => (
          <div key={idx} className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/60 flex flex-col justify-between">
            <div>
              <p className="font-label-caps text-label-caps text-secondary mb-2">
                {m.label}
              </p>
              <div className="font-display-lg text-headline-xl font-extrabold text-primary flex items-baseline gap-1">
                {m.value} <span className="font-data-mono-md text-secondary">{m.unit || ''}</span>
              </div>
            </div>
            {m.description && (
              <p className="text-xs font-body-md text-on-surface-variant mt-2 leading-relaxed">{m.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
