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
    <div style={{ marginTop: '48px', marginBottom: '48px' }}>
      <h3
        style={{
          fontFamily: 'Manrope, sans-serif',
          fontWeight: 700,
          fontSize: '20px',
          color: '#1f1b17',
          marginBottom: '24px',
        }}
      >
        Related Engineering Tools
      </h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
        }}
      >
        {related.map((tool) => (
          <Link
            key={tool.id}
            href={tool.path}
            style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(230, 225, 215, 0.7)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 300ms cubic-bezier(0.2, 0, 0, 1)',
            }}
            className="bento-card-motion"
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: '11px',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: '#00490e',
                  marginBottom: '12px',
                }}
              >
                <Cpu size={14} /> {tool.category}
              </div>
              <h4
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 700,
                  fontSize: '16px',
                  color: '#1f1b17',
                  marginBottom: '8px',
                }}
              >
                {tool.name}
              </h4>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  lineHeight: 1.6,
                  color: '#40493d',
                  marginBottom: '16px',
                }}
              >
                {tool.description}
              </p>
            </div>
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                color: '#00490e',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              Launch Calculator <ArrowRight size={14} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
