'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Sun,
  Battery,
  Zap,
  DollarSign,
  TrendingUp,
  Layers,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Search,
  Sparkles,
  HelpCircle,
  ChevronDown,
  Gauge,
  Activity,
  Cable,
  Calculator,
  Compass,
  Cpu,
  FileSpreadsheet,
  Building2,
  Home,
  Briefcase,
  Wrench,
} from 'lucide-react';
import { PublicWaitlistForm } from '@/shared/components/tools/PublicWaitlistForm';

interface ToolItem {
  id: string;
  name: string;
  category: string;
  categoryGroup: 'sizing' | 'electrical' | 'storage' | 'financial';
  headline: string;
  description: string;
  path: string;
  icon: React.ElementType;
  formulaBadge: string;
  metricBadge: string;
  standard: string;
  stats: { label: string; value: string };
  keyCapabilities: string[];
}

const TOOLS_LIST: ToolItem[] = [
  {
    id: 'solar-system-sizing',
    name: 'Solar System Sizing Calculator',
    category: 'System Design & Autonomy',
    categoryGroup: 'sizing',
    headline: 'Design your optimal solar system with engineering precision',
    description:
      'The master system-design engine. Calculates daily kWh demand, panel array capacity, battery storage, and pure sine wave inverter kVA with deterministic energy-balance validation.',
    path: '/tools/solar-system-sizing',
    icon: Sun,
    formulaBadge: 'kWp = E_daily / (PSH × η_sys)',
    metricBadge: 'Master Sizer',
    standard: 'IEC 62548 Certified',
    stats: { label: 'Validation Engine', value: 'Pass / Fail Strict' },
    keyCapabilities: [
      'Daily kWh & peak wattage calculation',
      'Battery bank kWh & inverter kVA sizing',
      'Day/night energy split & autonomy days',
    ],
  },
  {
    id: 'pv-configuration',
    name: 'PV String Layout Configurator',
    category: 'PV Configuration & Arrays',
    categoryGroup: 'electrical',
    headline: 'Optimize string voltage vs MPPT windows and cold-weather Voc',
    description:
      'Prevents inverter over-voltage damage. Evaluates Voc cold-temperature limits (-10°C) and minimum Vmp hot-temperature derating (65°C) to ensure peak yield.',
    path: '/tools/pv-configuration',
    icon: Layers,
    formulaBadge: 'Voc(cold) ≤ V_max_mppt',
    metricBadge: 'MPPT Optimizer',
    standard: 'Temperature Derating',
    stats: { label: 'Temperature Range', value: '-10°C to +65°C' },
    keyCapabilities: [
      'Min/Max modules per series string',
      'Inverter MPPT voltage window safety',
      'Max short-circuit current checking',
    ],
  },
  {
    id: 'cable-sizing',
    name: 'Solar Cable Sizing Calculator',
    category: 'Electrical Design & Ampacity',
    categoryGroup: 'electrical',
    headline: 'Precision conductor cross-section & voltage-drop mitigation',
    description:
      'Calculates exact copper and aluminum cable gauges to guarantee voltage drop stays under the maximum 3% IEEE threshold, preventing overheating and power loss.',
    path: '/tools/cable-sizing',
    icon: Cable,
    formulaBadge: 'ΔV = (2 × L × I × ρ) / A',
    metricBadge: 'IEEE Standard',
    standard: 'IEEE Voltage Drop < 3%',
    stats: { label: 'Max Voltage Drop', value: '< 3.0%' },
    keyCapabilities: [
      'DC string & AC main conductor sizing',
      'Copper vs aluminum conductor comparison',
      'One-way run length & ampacity derating',
    ],
  },
  {
    id: 'roi-calculator',
    name: 'Solar ROI & Payback Calculator',
    category: 'Project Finance & Payback',
    categoryGroup: 'financial',
    headline: 'Transform technical solar specs into bankable financial decisions',
    description:
      'Computes initial CAPEX, annual OPEX, Net Present Value (NPV), Internal Rate of Return (IRR), and break-even payback timelines across Nigerian tariff classes.',
    path: '/tools/roi-calculator',
    icon: TrendingUp,
    formulaBadge: 'NPV = ∑ [CF_t / (1+r)^t] - CAPEX',
    metricBadge: 'Bankable Model',
    standard: 'Discounted Cash Flow',
    stats: { label: 'Typical Payback', value: '2.5 - 4.5 Yrs' },
    keyCapabilities: [
      'NPV, IRR & simple/discounted payback',
      'NERC Band A-E utility inflation indexing',
      'Diesel generator displacement cashflows',
    ],
  },
  {
    id: 'battery-capacity',
    name: 'Battery Capacity Calculator',
    category: 'Energy Storage & Autonomy',
    categoryGroup: 'storage',
    headline: 'Size reliable LiFePO4 and lead-acid battery banks for critical uptime',
    description:
      'Calculates gross kWh and Amp-Hour requirements based on Depth of Discharge (DoD), round-trip efficiency, and consecutive cloudy-day autonomy periods.',
    path: '/tools/battery-capacity',
    icon: Battery,
    formulaBadge: 'Ah = (E_daily × Days) / (V_sys × DoD × η)',
    metricBadge: 'LiFePO4 Optimized',
    standard: 'DoD & Cycle Life Model',
    stats: { label: 'Cycle Longevity', value: '6,000+ Cycles' },
    keyCapabilities: [
      '48V, 24V, 12V and HV system configurations',
      '80% DoD LiFePO4 vs 50% AGM/Gel lead acid',
      'C-rate continuous discharge verification',
    ],
  },
  {
    id: 'solar-panel-sizing',
    name: 'Solar Panel Sizing Tool',
    category: 'Generation Sizing & Roof Fit',
    categoryGroup: 'sizing',
    headline: 'Determine exact module wattage, panel quantity, and roof footprint',
    description:
      'Translates annual consumption into total kWp array capacity, calculates required physical roof area, and factors in real-world orientation and soiling deratings.',
    path: '/tools/solar-panel-sizing',
    icon: Zap,
    formulaBadge: 'kWp = E_daily / (PSH × PR)',
    metricBadge: 'Roof Fit Analysis',
    standard: 'Tier-1 Mono PERC',
    stats: { label: 'Efficiency Standard', value: 'Tier-1 21.5%+' },
    keyCapabilities: [
      'Exact 450W - 650W module count',
      'Roof area requirements in square meters',
      'Tilt angle & orientation derating factors',
    ],
  },
  {
    id: 'load-calculator',
    name: 'Appliance Load Calculator',
    category: 'Load Sizing & Profiling',
    categoryGroup: 'sizing',
    headline: 'Model connected watts, inductive surge factors, and duty cycles',
    description:
      'Interactive residential and industrial appliance auditor. Computes continuous running power, motor startup surge, and hourly load profiles across day and night.',
    path: '/tools/load-calculator',
    icon: Sliders,
    formulaBadge: 'E_daily = ∑ (Power × Qty × Hours)',
    metricBadge: 'Surge Auditor',
    standard: '4-Tier Priority Model',
    stats: { label: 'Peak Surge Factor', value: 'Up to 3.0x' },
    keyCapabilities: [
      'Inverter surge load multiplier calculation',
      'Daytime shiftable vs nighttime critical loads',
      'Instant energy audit breakdown chart',
    ],
  },
  {
    id: 'energy-yield',
    name: 'Solar Energy Yield Estimator',
    category: 'Yield & Performance',
    categoryGroup: 'sizing',
    headline: 'Predict monthly and 25-year cumulative kWh production by state',
    description:
      'Harnesses Nigerian geographical solar irradiation databases (NASA & PVGIS) to forecast seasonal generation curves and identify monsoon-season yield dips.',
    path: '/tools/energy-yield',
    icon: Activity,
    formulaBadge: 'E_annual = Array_kWp × PSH × PR × 365',
    metricBadge: 'NASA/PVGIS Model',
    standard: '36 States + FCT',
    stats: { label: 'Nigerian States', value: '36 States + FCT' },
    keyCapabilities: [
      'State-specific Peak Sun Hours (PSH)',
      'Dry season vs rainy season variance curves',
      '25-year solar degradation modeling (0.5%/yr)',
    ],
  },
  {
    id: 'solar-savings',
    name: 'Solar Savings Calculator',
    category: 'Energy Economics & Fuel Displacement',
    categoryGroup: 'financial',
    headline: 'Quantify diesel, petrol, and Band A grid utility cost savings',
    description:
      'Compares levelized cost of solar electricity (LCOE) against escalating generator fuel pump prices and utility tariffs in Nigeria with inflation indexing.',
    path: '/tools/solar-savings',
    icon: DollarSign,
    formulaBadge: 'Savings = (Cost_grid + Cost_fuel) - Cost_solar',
    metricBadge: 'Fuel Displacement',
    standard: 'LCOE Comparison',
    stats: { label: 'Fuel Savings', value: 'Up to 85%' },
    keyCapabilities: [
      'Diesel & petrol generator consumption offsets',
      'Monthly & annual Naira (₦) savings',
      'CO2 greenhouse gas emissions reduction',
    ],
  },
  {
    id: 'inverter-sizing',
    name: 'Inverter Sizing Calculator',
    category: 'Power Conversion & Surge',
    categoryGroup: 'storage',
    headline: 'Size hybrid and off-grid inverters for continuous and surge power',
    description:
      'Determines required continuous kVA rating, checks inductive power factor (PF 0.8), and guarantees sufficient surge capacity for heavy air conditioning and pumps.',
    path: '/tools/inverter-sizing',
    icon: Gauge,
    formulaBadge: 'kVA = (P_continuous / PF) × 1.25',
    metricBadge: 'Surge Tolerance',
    standard: '125% Safety Margin',
    stats: { label: 'Surge Overhead', value: '25% Continuous Margin' },
    keyCapabilities: [
      'Single-phase vs 3-phase commercial inverters',
      'Inductive motor surge headroom validation',
      'Dual MPPT string tracking compatibility',
    ],
  },
];

const FAQS = [
  {
    question: 'Are the calculations tailored specifically to Nigeria and West African climates?',
    answer:
      'Yes. Every calculation engine incorporates Nigerian solar irradiance zones (from 4.2 kWh/m²/day in coastal Lagos, Port Harcourt, and Calabar to 6.5+ kWh/m²/day in Sokoto, Maiduguri, and Kano), local utility tariff bands (NERC Band A through E), generator fuel benchmarks (PMS and AGO), and high-temperature solar module derating coefficients.',
  },
  {
    question: 'Are the mathematical formulas certified against international engineering standards?',
    answer:
      'Yes. Our calculation engines strictly enforce IEC 62548 for photovoltaic array safety and sizing, IEEE standards for electrical conductor ampacity and maximum 3% voltage drop, and manufacturer thermal models for Tier-1 LiFePO4 battery storage and pure sine wave hybrid inverters.',
  },
  {
    question: 'Can I export a formal engineering specification for my installer or EPC contractor?',
    answer:
      'Yes. Each calculator generates a comprehensive Engineering Specification Report containing all input parameters, mathematical formulas, component specifications, single-line data, and bill-of-quantities (BOQ) estimates ready for procurement.',
  },
  {
    question: 'Do I need an account to use the engineering tools?',
    answer:
      'No. The core Sunlit Engineering Tools Suite is openly accessible for homeowners, independent solar engineers, EPC installers, and corporate facility managers to verify designs and eliminate solar sizing mistakes.',
  },
];

export function ToolsMarketingClient() {
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Quick Sizing Interactive Playground state
  const [dailyKwh, setDailyKwh] = useState<number>(15);
  const [autonomyHours, setAutonomyHours] = useState<number>(24);

  const quickEstimates = useMemo(() => {
    const psh = 4.8; // Average Nigerian irradiation
    const systemLoss = 0.8;
    const requiredKwp = (dailyKwh / (psh * systemLoss)).toFixed(2);
    const requiredBatteryKwh = ((dailyKwh * (autonomyHours / 24)) / 0.85).toFixed(1);
    const estimatedInverterKva = Math.max(3.5, (Number(requiredKwp) * 0.8 * 1.25)).toFixed(1);
    const panelCount550W = Math.ceil((Number(requiredKwp) * 1000) / 550);
    const estimatedMonthlySavings = Math.round(dailyKwh * 30 * 225); // ~₦225/kWh grid+generator offset
    return {
      kwp: requiredKwp,
      batteryKwh: requiredBatteryKwh,
      inverterKva: estimatedInverterKva,
      panels: panelCount550W,
      savings: estimatedMonthlySavings.toLocaleString(),
    };
  }, [dailyKwh, autonomyHours]);

  const filteredTools = useMemo(() => {
    return TOOLS_LIST.filter((tool) => {
      const matchesGroup =
        selectedGroup === 'all' || tool.categoryGroup === selectedGroup;
      const matchesQuery =
        searchQuery.trim() === '' ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.formulaBadge.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesGroup && matchesQuery;
    });
  }, [selectedGroup, searchQuery]);

  return (
    <main style={{ backgroundColor: '#FFF8F5', color: '#191D17', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      
      {/* ── 1. Hero Section with Stitch Radial Blueprint Grid ──────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          paddingTop: '5rem',
          paddingBottom: '5rem',
          borderBottom: '1px solid #E5E0DD',
          backgroundImage: 'radial-gradient(#e0e4db 1.2px, transparent 1.2px)',
          backgroundSize: '24px 24px',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            
            {/* Left Column: Hero Copy */}
            <div>
              <div style={{ marginBottom: '1.25rem' }}>
                <Link
                  href="/"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    color: '#00490E',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    backgroundColor: '#ffffff',
                    padding: '0.375rem 0.875rem',
                    borderRadius: '8px',
                    border: '1px solid #E5E0DD',
                    boxShadow: '0 1px 3px rgba(73, 51, 32, 0.04)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <ArrowLeft style={{ width: 14, height: 14 }} />
                  Back to Home
                </Link>
              </div>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.375rem 0.875rem',
                  backgroundColor: '#ECEFE6',
                  borderRadius: '9999px',
                  border: '1px solid rgba(192, 201, 187, 0.6)',
                  marginBottom: '1.5rem',
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00490E' }} />
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#00490E',
                  }}
                >
                  Sunlit Engineering Tools Suite V3.0
                </span>
              </div>

              <h1
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
                  fontWeight: 800,
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  color: '#003006',
                  margin: '0 0 1.25rem 0',
                }}
              >
                Precision Solar Engineering Tools for African Climates & Grid Realities.
              </h1>

              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '1.125rem',
                  lineHeight: 1.6,
                  color: '#41493E',
                  margin: '0 0 2rem 0',
                  maxWidth: '560px',
                }}
              >
                Ten deterministic calculation engines built on IEC 62548 standards, IEEE conductor ampacity limits, and localized Nigerian irradiance data. Verify designs, eliminate sizing guesstimates, and build bankable solar specifications.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                <a
                  href="#tools-catalog"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: '#003006',
                    color: '#ffffff',
                    padding: '0.875rem 1.75rem',
                    borderRadius: '8px',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: '0.9375rem',
                    letterSpacing: '0.04em',
                    textDecoration: 'none',
                    boxShadow: '0 4px 12px rgba(73, 51, 32, 0.08)',
                    transition: 'background-color 0.2s, transform 0.15s',
                  }}
                  onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
                  onMouseUp={(e) => (e.currentTarget.style.transform = '')}
                >
                  Explore 10 Tools
                  <ArrowRight style={{ width: 18, height: 18 }} />
                </a>

                <Link
                  href="/tools/solar-system-sizing"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: '#ffffff',
                    color: '#003006',
                    padding: '0.875rem 1.75rem',
                    borderRadius: '8px',
                    border: '1px solid #003006',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: '0.9375rem',
                    textDecoration: 'none',
                    transition: 'background-color 0.2s',
                  }}
                >
                  Launch Master Sizer
                </Link>
              </div>

              {/* Trust & Engineering Metric Highlights */}
              <div
                style={{
                  marginTop: '2.5rem',
                  paddingTop: '1.75rem',
                  borderTop: '1px solid rgba(192, 201, 187, 0.4)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '1.5rem',
                }}
              >
                <div>
                  <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: '1.5rem', fontWeight: 800, color: '#003006' }}>10 Engines</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#41493E' }}>Validated Suite</div>
                </div>
                <div>
                  <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: '1.5rem', fontWeight: 800, color: '#003006' }}>36 + FCT</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#41493E' }}>Irradiance Zones</div>
                </div>
                <div>
                  <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: '1.5rem', fontWeight: 800, color: '#003006' }}>&lt; 3.0%</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#41493E' }}>Max Voltage Drop</div>
                </div>
              </div>
            </div>

            {/* Right Column: Live Interactive Quick Sizer Preview Card (Stitch 20px Card Pattern) */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                border: '1px solid #E5E0DD',
                padding: '2rem',
                boxShadow: '0 4px 16px rgba(73, 51, 32, 0.08)',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #F2F5EC' }}>
                <div>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#536D21' }}>
                    LIVE SIZING ENGINE PREVIEW
                  </span>
                  <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: '1.25rem', fontWeight: 700, color: '#003006', margin: '0.25rem 0 0 0' }}>
                    Instant System Sizing Model
                  </h3>
                </div>
                <span
                  style={{
                    backgroundColor: '#CEEE93',
                    color: '#003006',
                    padding: '0.25rem 0.625rem',
                    borderRadius: '9999px',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                  }}
                >
                  REAL-TIME
                </span>
              </div>

              {/* Slider 1: Daily Energy Consumption */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                  <label style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', fontWeight: 600, color: '#191D17' }}>
                    Daily Energy Consumption
                  </label>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', fontWeight: 700, color: '#00490E' }}>
                    {dailyKwh} kWh / day
                  </span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="60"
                  step="1"
                  value={dailyKwh}
                  onChange={(e) => setDailyKwh(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#00490E', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: '#717A6D' }}>
                  <span>3 kWh (Small Home)</span>
                  <span>25 kWh (Duplex)</span>
                  <span>60 kWh (Commercial)</span>
                </div>
              </div>

              {/* Slider 2: Battery Autonomy Hours */}
              <div style={{ marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                  <label style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', fontWeight: 600, color: '#191D17' }}>
                    Desired Backup Autonomy
                  </label>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', fontWeight: 700, color: '#00490E' }}>
                    {autonomyHours} Hours
                  </span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="48"
                  step="4"
                  value={autonomyHours}
                  onChange={(e) => setAutonomyHours(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#00490E', cursor: 'pointer' }}
                />
              </div>

              {/* Sizing Output Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.875rem',
                  backgroundColor: '#F7FBF1',
                  borderRadius: '12px',
                  padding: '1rem',
                  border: '1px solid rgba(192, 201, 187, 0.4)',
                  marginBottom: '1.5rem',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#536D21', textTransform: 'uppercase', letterSpacing: '0.06em' }}>SOLAR ARRAY</div>
                  <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: '1.25rem', fontWeight: 800, color: '#003006' }}>
                    {quickEstimates.kwp} kWp
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#717A6D' }}>≈ {quickEstimates.panels} × 550W Panels</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#536D21', textTransform: 'uppercase', letterSpacing: '0.06em' }}>BATTERY STORAGE</div>
                  <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: '1.25rem', fontWeight: 800, color: '#003006' }}>
                    {quickEstimates.batteryKwh} kWh
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#717A6D' }}>LiFePO4 @ 85% DoD</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#536D21', textTransform: 'uppercase', letterSpacing: '0.06em' }}>HYBRID INVERTER</div>
                  <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: '1.25rem', fontWeight: 800, color: '#003006' }}>
                    {quickEstimates.inverterKva} kVA
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#717A6D' }}>Pure Sine Wave</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#536D21', textTransform: 'uppercase', letterSpacing: '0.06em' }}>EST. MONTHLY SAVINGS</div>
                  <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: '1.25rem', fontWeight: 800, color: '#00490E' }}>
                    ₦{quickEstimates.savings}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#717A6D' }}>vs Grid &amp; Generator</div>
                </div>
              </div>

              <Link
                href={`/tools/solar-system-sizing?dailyKwh=${dailyKwh}&autonomy=${autonomyHours}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  width: '100%',
                  backgroundColor: '#00490E',
                  color: '#ffffff',
                  padding: '0.875rem',
                  borderRadius: '8px',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  textAlign: 'center',
                  boxSizing: 'border-box',
                }}
              >
                Run Full Engineering Sizing Model
                <ArrowRight style={{ width: 16, height: 16 }} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Filter, Search & Catalog Section (All 10 Tools) ──────────────── */}
      <section id="tools-catalog" style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 1.5rem 2rem 1.5rem' }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem auto' }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#536D21' }}>
            ENGINEERING TOOLKIT CATALOG
          </span>
          <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, color: '#003006', margin: '0.5rem 0 1rem 0' }}>
            Ten Validated Calculators for Complete Solar Lifecycles
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '1rem', color: '#41493E', lineHeight: 1.6 }}>
            Filter by engineering discipline or search by calculation formula to find the exact sizing engine for your application.
          </p>
        </div>

        {/* Filter Pills and Search Input */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          
          {/* Category Tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {[
              { key: 'all', label: 'All 10 Tools' },
              { key: 'sizing', label: 'System & Generation (4)' },
              { key: 'electrical', label: 'Electrical & Strings (2)' },
              { key: 'storage', label: 'Storage & Inverters (2)' },
              { key: 'financial', label: 'Economics & ROI (2)' },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSelectedGroup(tab.key)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.875rem',
                  fontWeight: selectedGroup === tab.key ? 700 : 500,
                  backgroundColor: selectedGroup === tab.key ? '#003006' : '#ffffff',
                  color: selectedGroup === tab.key ? '#ffffff' : '#41493E',
                  border: `1px solid ${selectedGroup === tab.key ? '#003006' : '#E5E0DD'}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '260px', flex: '1', maxWidth: '360px' }}>
            <Search style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#717A6D' }} />
            <input
              type="text"
              placeholder="Search by tool name or formula..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.625rem 1rem 0.625rem 2.5rem',
                borderRadius: '8px',
                border: '1px solid #E5E0DD',
                backgroundColor: '#ffffff',
                fontSize: '0.875rem',
                fontFamily: "'Inter', sans-serif",
                color: '#191D17',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {/* 10 Tool Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.75rem' }}>
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  border: '1px solid #E5E0DD',
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 12px rgba(73, 51, 32, 0.06)',
                  transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(73, 51, 32, 0.12)';
                  e.currentTarget.style.borderColor = '#00490E';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(73, 51, 32, 0.06)';
                  e.currentTarget.style.borderColor = '#E5E0DD';
                }}
              >
                <div>
                  {/* Top Bar: Icon + Category + Formula Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        backgroundColor: '#F2F5EC',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#00490E',
                      }}
                    >
                      <Icon style={{ width: 22, height: 22 }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                      <span
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          color: '#536D21',
                        }}
                      >
                        {tool.category}
                      </span>
                      <span
                        style={{
                          backgroundColor: '#ECEFE6',
                          color: '#003006',
                          fontSize: '0.6875rem',
                          fontFamily: "monospace",
                          fontWeight: 600,
                          padding: '0.125rem 0.5rem',
                          borderRadius: '4px',
                          border: '1px solid rgba(192, 201, 187, 0.4)',
                        }}
                      >
                        {tool.formulaBadge}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: '#003006',
                      margin: '0 0 0.5rem 0',
                      lineHeight: 1.3,
                    }}
                  >
                    {tool.name}
                  </h3>

                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.875rem',
                      color: '#41493E',
                      lineHeight: 1.55,
                      margin: '0 0 1.25rem 0',
                    }}
                  >
                    {tool.description}
                  </p>

                  {/* Key Capabilities Bullets */}
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    {tool.keyCapabilities.map((cap, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#191D17' }}>
                        <CheckCircle2 style={{ width: 14, height: 14, color: '#00490E', flexShrink: 0 }} />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Footer: Standard Badge + CTA Button */}
                <div style={{ borderTop: '1px solid #F2F5EC', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#717A6D', textTransform: 'uppercase' }}>{tool.stats.label}</div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#003006' }}>{tool.stats.value}</div>
                  </div>

                  <Link
                    href={tool.path}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      backgroundColor: '#003006',
                      color: '#ffffff',
                      padding: '0.625rem 1.125rem',
                      borderRadius: '8px',
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 700,
                      fontSize: '0.8125rem',
                      textDecoration: 'none',
                      transition: 'background-color 0.15s',
                    }}
                  >
                    Open Tool
                    <ArrowRight style={{ width: 14, height: 14 }} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 3. Engineering Workflow Pipeline (End-to-End Design Flow) ────────── */}
      <section
        style={{
          backgroundColor: '#ffffff',
          borderTop: '1px solid #E5E0DD',
          borderBottom: '1px solid #E5E0DD',
          padding: '5rem 1.5rem',
          margin: '4rem 0',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem auto' }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#536D21' }}>
              RECOMMENDED METHODOLOGY
            </span>
            <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, color: '#003006', margin: '0.5rem 0 1rem 0' }}>
              The 5-Step Professional Solar Engineering Flow
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '1rem', color: '#41493E', lineHeight: 1.6 }}>
              Follow the canonical engineering sequence to progress from initial connected appliance audits to bankable financial payback modeling.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {[
              {
                step: '01',
                title: 'Audit Connected Load',
                tool: 'Appliance Load Calculator',
                path: '/tools/load-calculator',
                desc: 'Model day/night split, continuous wattage, and inductive motor surge factors.',
              },
              {
                step: '02',
                title: 'Irradiance & Solar Yield',
                tool: 'Energy Yield Estimator',
                path: '/tools/energy-yield',
                desc: 'Query NASA/PVGIS geographic irradiation for your exact Nigerian state.',
              },
              {
                step: '03',
                title: 'Master Array & Storage',
                tool: 'Solar System Sizing',
                path: '/tools/solar-system-sizing',
                desc: 'Size total kWp, LiFePO4 battery kWh, and pure sine wave inverter capacity.',
              },
              {
                step: '04',
                title: 'Electrical & Cable Gauges',
                tool: 'Cable Sizing & PV String',
                path: '/tools/cable-sizing',
                desc: 'Verify Voc temperature derating and guarantee voltage drop remains <3%.',
              },
              {
                step: '05',
                title: 'Financial Payback & ROI',
                tool: 'Solar ROI & Payback',
                path: '/tools/roi-calculator',
                desc: 'Project NPV, IRR, and diesel generator displacement savings over 25 years.',
              },
            ].map((st, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#F7FBF1',
                  borderRadius: '16px',
                  border: '1px solid rgba(192, 201, 187, 0.6)',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: '1.75rem', fontWeight: 800, color: '#536D21', marginBottom: '0.5rem' }}>
                    {st.step}
                  </div>
                  <h4 style={{ fontFamily: "'Manrope', sans-serif", fontSize: '1.0625rem', fontWeight: 700, color: '#003006', margin: '0 0 0.5rem 0' }}>
                    {st.title}
                  </h4>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.8125rem', color: '#41493E', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                    {st.desc}
                  </p>
                </div>
                <Link
                  href={st.path}
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: '#00490E',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  {st.tool} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Personas: Who Uses Sunlit Engineering Tools ─────────────────── */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem 4rem 1.5rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem auto' }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#536D21' }}>
            ENGINEERING VALUE BY STAKEHOLDER
          </span>
          <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, color: '#003006', margin: '0.5rem 0 1rem 0' }}>
            Tailored Accuracy for Every Solar Decision-Maker
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {[
            {
              icon: Home,
              role: 'Homeowners & Landlords',
              headline: 'Verify installer quotes before investing millions.',
              points: [
                'Avoid under-sized systems that fail during rainy season',
                'Calculate exact diesel generator fuel replacement savings',
                'Know true battery capacity required for overnight cooling',
              ],
            },
            {
              icon: Wrench,
              role: 'Solar Installers & EPCs',
              headline: 'Generate certified engineering BOQs in minutes.',
              points: [
                'Verify string voltages against MPPT window limits',
                'Calculate precise DC/AC cable cross-sections under 3% drop',
                'Export professional engineering data sheets for clients',
              ],
            },
            {
              icon: Building2,
              role: 'Commercial Facilities & SMEs',
              headline: 'Model 25-year LCOE & tariff inflation cashflows.',
              points: [
                'Analyze Band A grid tariff vs rooftop solar economics',
                'Calculate peak shaving and motor inductive surge requirements',
                'Generate bankable NPV and IRR metrics for board approval',
              ],
            },
            {
              icon: Compass,
              role: 'Consulting Engineers',
              headline: 'Deterministic physics & IEC 62548 compliance.',
              points: [
                'Zero black-box estimations — pure transparent mathematics',
                'NASA & PVGIS irradiation database integration',
                'Complete thermal degradation and derating curves',
              ],
            },
          ].map((persona, i) => {
            const PIcon = persona.icon;
            return (
              <div
                key={i}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  border: '1px solid #E5E0DD',
                  padding: '2rem',
                  boxShadow: '0 4px 12px rgba(73, 51, 32, 0.06)',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    backgroundColor: '#F2F5EC',
                    color: '#00490E',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  <PIcon style={{ width: 20, height: 20 }} />
                </div>
                <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: '1.125rem', fontWeight: 700, color: '#003006', margin: '0 0 0.5rem 0' }}>
                  {persona.role}
                </h3>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#536D21', margin: '0 0 1rem 0' }}>
                  {persona.headline}
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {persona.points.map((pt, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8125rem', color: '#41493E' }}>
                      <span style={{ color: '#00490E', fontWeight: 700 }}>•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 5. Frequently Asked Questions Accordion ────────────────────────── */}
      <section style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 1.5rem 5rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#536D21' }}>
            ENGINEERING FAQ
          </span>
          <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, color: '#003006', margin: '0.5rem 0 0.75rem 0' }}>
            Frequently Asked Technical Questions
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {FAQS.map((faq, index) => {
            const isOpen = expandedFaq === index;
            return (
              <div
                key={index}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #E5E0DD',
                  overflow: 'hidden',
                }}
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(isOpen ? null : index)}
                  style={{
                    width: '100%',
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: '#003006',
                  }}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    style={{
                      width: 18,
                      height: 18,
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                      flexShrink: 0,
                    }}
                  />
                </button>
                {isOpen && (
                  <div style={{ padding: '0 1.5rem 1.25rem 1.5rem', fontFamily: "'Inter', sans-serif", fontSize: '0.9375rem', color: '#41493E', lineHeight: 1.6 }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 6. Final Call to Action ────────────────────────────────────────── */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem 5rem 1.5rem' }}>
        <div
          style={{
            backgroundColor: '#003006',
            borderRadius: '24px',
            padding: '4rem 2rem',
            textAlign: 'center',
            color: '#ffffff',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 12px 32px rgba(0, 48, 6, 0.2)',
          }}
        >
          <div style={{ position: 'relative', zIndex: 10, maxWidth: '680px', margin: '0 auto' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#CEEE93' }}>
              SOLAR PRECISION PLATFORM
            </span>
            <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, margin: '0.75rem 0 1rem 0', lineHeight: 1.15 }}>
              Ready to verify your solar design with engineering certainty?
            </h2>
            <p style={{ fontSize: '1.0625rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.6, margin: '0 0 2rem 0' }}>
              Launch any of our 10 calculators or request competitive quotes from vetted EPC contractors on the Sunlit Marketplace.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
              <Link
                href="/tools/solar-system-sizing"
                style={{
                  backgroundColor: '#CEEE93',
                  color: '#003006',
                  padding: '0.875rem 2rem',
                  borderRadius: '8px',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  textDecoration: 'none',
                }}
              >
                Launch System Sizer
              </Link>
              <Link
                href="/rfq/new"
                style={{
                  backgroundColor: 'transparent',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  padding: '0.875rem 2rem',
                  borderRadius: '8px',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  textDecoration: 'none',
                }}
              >
                Request Vetted EPC Quotes
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
