import { RecommendedEquipmentItem } from '@/lib/engineering/types';
import { Package } from 'lucide-react';

interface RecommendationCardProps {
  items?: RecommendedEquipmentItem[];
}

export function RecommendationCard({ items }: RecommendationCardProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-primary text-on-primary rounded-2xl p-6 md:p-8 mb-6 shadow-md border border-primary-container">
      <div className="flex items-center gap-3 mb-6 border-b border-primary-container/80 pb-4">
        <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center shrink-0">
          <Package size={20} className="text-on-primary" />
        </div>
        <div>
          <h3 className="font-headline-md text-headline-md font-bold text-white">Recommended Equipment Sizing</h3>
          <p className="font-body-md text-xs text-white/80">Verified tier-one component specifications for optimal performance.</p>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="bg-primary-container/60 rounded-xl p-4 border border-primary-container">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-headline-sm font-bold text-white text-base">{item.name}</h4>
              <span className="font-label-caps text-label-caps bg-primary text-white px-2.5 py-1 rounded-full border border-white/20">
                Qty: {item.recommendedQuantity}
              </span>
            </div>
            <p className="font-body-md text-xs text-white/90 mb-3">{item.reason}</p>
            <div className="flex flex-wrap gap-2 font-data-mono-md text-[11px] text-white/90">
              {Object.entries(item.specifications).map(([key, val]) => (
                <span key={key} className="bg-primary/80 px-2 py-1 rounded border border-white/10">
                  {key}: {val}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
