import { RecommendedEquipmentItem } from '@/lib/engineering/types';
import { Package } from 'lucide-react';

interface RecommendationCardProps {
  items?: RecommendedEquipmentItem[];
}

export function RecommendationCard({ items }: RecommendationCardProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-emerald-950 text-white rounded-2xl p-6 md:p-8 shadow-xl my-6">
      <div className="flex items-center gap-3 mb-6 border-b border-emerald-800/80 pb-4">
        <div className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center">
          <Package size={20} className="text-emerald-200" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Recommended Equipment Sizing</h3>
          <p className="text-xs text-emerald-300">Verified tier-one component specifications for optimal performance.</p>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="bg-emerald-900/60 rounded-xl p-4 border border-emerald-800/60">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-emerald-100 text-base">{item.name}</h4>
              <span className="text-xs font-extrabold bg-emerald-800 text-emerald-200 px-2.5 py-1 rounded-full">
                Qty: {item.recommendedQuantity}
              </span>
            </div>
            <p className="text-xs text-emerald-300 mb-3">{item.reason}</p>
            <div className="flex flex-wrap gap-2 text-xs font-mono text-emerald-200">
              {Object.entries(item.specifications).map(([key, val]) => (
                <span key={key} className="bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
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
