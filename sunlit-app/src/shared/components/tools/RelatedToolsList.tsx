import Link from 'next/link';
import { ArrowRight, Cpu } from 'lucide-react';

export interface ToolMeta {
  id: string;
  name: string;
  category: string;
  description: string;
  path: string;
}

export const ALL_TOOLS: ToolMeta[] = [
  {
    id: 'solar-system-sizing',
    name: 'Solar System Sizing Calculator',
    category: 'System Design',
    description: 'Comprehensive sizing of solar panels, battery autonomy, and inverter kVA capacity.',
    path: '/tools/solar-system-sizing',
  },
  {
    id: 'load-calculator',
    name: 'Appliance Load Calculator',
    category: 'Load Sizing',
    description: 'Calculate total connected Watts, peak surge demand, and daily energy consumption.',
    path: '/tools/load-calculator',
  },
  {
    id: 'battery-capacity',
    name: 'Battery Capacity Calculator',
    category: 'Storage',
    description: 'Determine required battery kWh and Amp-Hours for 24/7 power autonomy.',
    path: '/tools/battery-capacity',
  },
  {
    id: 'inverter-sizing',
    name: 'Inverter Sizing Calculator',
    category: 'System Design',
    description: 'Size pure sine wave and hybrid inverters with power factor and surge derating.',
    path: '/tools/inverter-sizing',
  },
  {
    id: 'solar-panel-sizing',
    name: 'Solar Panel Sizing Tool',
    category: 'Solar Array',
    description: 'Calculate required panel count, total array kWp, and roof area requirement.',
    path: '/tools/solar-panel-sizing',
  },
  {
    id: 'cable-sizing',
    name: 'Solar Cable Sizing Calculator',
    category: 'Electrical Wiring',
    description: 'Size DC & AC conductors to maintain voltage drop below maximum 3% IEEE limits.',
    path: '/tools/cable-sizing',
  },
  {
    id: 'pv-configuration',
    name: 'PV String Layout Configurator',
    category: 'Solar Array',
    description: 'Optimize panel series-parallel strings within inverter MPPT voltage windows.',
    path: '/tools/pv-configuration',
  },
  {
    id: 'energy-yield',
    name: 'Solar Energy Yield Estimator',
    category: 'Yield & Performance',
    description: 'Simulate daily, monthly, and 25-year cumulative kWh generation across Nigeria.',
    path: '/tools/energy-yield',
  },
  {
    id: 'solar-savings',
    name: 'Solar Savings Calculator',
    category: 'Financial Modeling',
    description: 'Estimate grid utility and diesel generator fuel cost displacement savings.',
    path: '/tools/solar-savings',
  },
  {
    id: 'roi-calculator',
    name: 'Solar ROI & Payback Calculator',
    category: 'Financial Modeling',
    description: 'Calculate simple ROI, payback period in years, and 25-year Net Present Value.',
    path: '/tools/roi-calculator',
  },
];

interface RelatedToolsListProps {
  currentToolId: string;
}

export function RelatedToolsList({ currentToolId }: RelatedToolsListProps) {
  const related = ALL_TOOLS.filter((t) => t.id !== currentToolId).slice(0, 3);

  return (
    <div className="my-12">
      <h3 className="text-xl font-bold text-stone-900 mb-6">Related Engineering Tools</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {related.map((tool) => (
          <Link
            key={tool.id}
            href={tool.path}
            className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm hover:border-emerald-700 hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
                <Cpu size={14} /> {tool.category}
              </div>
              <h4 className="font-bold text-stone-900 text-base mb-2 group-hover:text-emerald-900">
                {tool.name}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed mb-4">{tool.description}</p>
            </div>
            <span className="text-xs font-bold text-emerald-800 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
              Launch Calculator <ArrowRight size={14} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
