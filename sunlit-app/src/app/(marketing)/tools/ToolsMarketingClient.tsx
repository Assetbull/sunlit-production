'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Sun,
  Battery,
  Zap,
  DollarSign,
  TrendingUp,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Search,
  Sparkles,
  HelpCircle,
  ChevronDown,
  Gauge,
  Activity,
  FileSpreadsheet,
  Cable,
} from 'lucide-react';
import { PublicWaitlistForm } from '@/shared/components/tools/PublicWaitlistForm';
import { Button, Card, Badge, Input } from '@/shared/components/ui';

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
  stats: { label: string; value: string };
  isCore?: boolean;
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
    stats: { label: 'Validation Engine', value: 'Pass / Fail Strict' },
    isCore: true,
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
    stats: { label: 'Temperature Range', value: '-10°C to +65°C' },
    isCore: true,
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
    stats: { label: 'Max Voltage Drop', value: '< 3.0%' },
    isCore: true,
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
    stats: { label: 'Typical Payback', value: '2.5 - 4.5 Yrs' },
    isCore: true,
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
    stats: { label: 'Cycle Longevity', value: '6,000+ Cycles' },
    isCore: true,
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
    stats: { label: 'Efficiency Standard', value: 'Tier-1 Mono PERC' },
    isCore: true,
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
    stats: { label: 'Peak Surge Factor', value: 'Up to 3.0x' },
    isCore: true,
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
    stats: { label: 'Nigerian States', value: '36 States + FCT' },
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
    stats: { label: 'Fuel Savings', value: 'Up to 85%' },
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
    stats: { label: 'Surge Overhead', value: '25% Continuous Margin' },
  },
];

const FAQS = [
  {
    question: 'Are the calculations tailored specifically to Nigeria?',
    answer:
      'Yes. Every calculation engine incorporates Nigerian solar irradiance zones (from 4.2 kWh/m²/day in coastal Lagos/Calabar to 6.5+ kWh/m²/day in Sokoto/Kano), local grid tariff bands (Band A through E), generator fuel benchmarks, and high-temperature derating factors.',
  },
  {
    question: 'Are the formulas based on international engineering standards?',
    answer:
      'Yes. Our engines strictly follow IEC 62548 for PV array design, IEEE standards for conductor ampacity and voltage drop (<3%), and manufacturer thermal coefficient models for Tier-1 LiFePO4 batteries and inverters.',
  },
  {
    question: 'Can I export a formal engineering specification for my installer or EPC?',
    answer:
      'Yes. Each tool allows you to generate a verified Engineering Report containing all mathematical formulas, component specifications, single-line data, and bill-of-quantities estimates.',
  },
  {
    question: 'Do I need an account to use the calculators?',
    answer:
      'No. The entire Sunlit Public Engineering Suite is freely accessible for homeowners, solar engineers, installers, and corporate project developers.',
  },
];

export function ToolsMarketingClient() {
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const filteredTools = useMemo(() => {
    return TOOLS_LIST.filter((tool) => {
      const matchesGroup =
        selectedGroup === 'all' || tool.categoryGroup === selectedGroup;
      const matchesQuery =
        searchQuery.trim() === '' ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesGroup && matchesQuery;
    });
  }, [selectedGroup, searchQuery]);

  return (
    <main className="bg-[#FFF8F5] text-[#1F1B17] font-sans min-h-screen pb-24 antialiased">
      {/* 1. Header / Hero Section */}
      <section className="relative pt-16 pb-20 border-b border-[#E5E0DD] bg-radial-grid overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 items-center justify-between">
            {/* Left: Hero Headline & Action */}
            <div className="lg:w-7/12 flex flex-col gap-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#ECEFE6] rounded-full w-fit border border-[#BFCABA]/40">
                <span className="w-2 h-2 rounded-full bg-[#00490E] animate-pulse" />
                <span className="font-sans font-bold text-xs uppercase tracking-widest text-[#00490E]">
                  Sunlit Public Engineering Suite V2.4
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#00490E] tracking-tight leading-[1.1]">
                Enterprise Solar Engineering Tools.
              </h1>

              <p className="font-sans text-lg text-[#40493D] max-w-2xl leading-relaxed">
                Deterministic calculation engines built for homeowners, engineers,
                installers, and EPC contractors across Nigeria. Eliminate guesswork
                in generation, storage, electrical ampacity, and financial yield.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/tools/solar-system-sizing"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#00490E] text-white font-sans font-semibold rounded-full shadow-sunlit hover:bg-[#003006] transition-all hover:scale-[1.02] text-sm"
                >
                  <Sparkles size={18} className="text-[#CEEE93]" />
                  Launch Master System Sizer
                </Link>

                <a
                  href="#catalog"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 border border-[#00490E] text-[#00490E] font-sans font-semibold rounded-full hover:bg-[#ECEFE6] transition-all text-sm"
                >
                  Explore All 10 Calculators
                  <ArrowRight size={16} />
                </a>
              </div>

              {/* Trust Metric Chips */}
              <div className="pt-6 border-t border-[#E5E0DD] grid grid-cols-3 gap-2 sm:gap-4 max-w-lg">
                <div>
                  <div className="font-display text-2xl font-bold text-[#00490E]">
                    10 Tools
                  </div>
                  <div className="text-xs text-[#40493D] font-medium">
                    Validated Engines
                  </div>
                </div>
                <div>
                  <div className="font-display text-2xl font-bold text-[#00490E]">
                    IEC & IEEE
                  </div>
                  <div className="text-xs text-[#40493D] font-medium">
                    Strict Standards
                  </div>
                </div>
                <div>
                  <div className="font-display text-2xl font-bold text-[#00490E]">
                    36 States
                  </div>
                  <div className="text-xs text-[#40493D] font-medium">
                    Irradiance Matrix
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Technical Blueprint Simulation Card */}
            <div className="lg:w-5/12 w-full">
              <div className="bg-white rounded-[20px] border border-[#E5E0DD] p-6 shadow-sunlit relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-[#E5E0DD] pb-4 mb-5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#00490E]" />
                    <span className="font-sans font-bold text-xs uppercase tracking-wider text-[#00490E]">
                      Real-Time Engineering Engine
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#CEEE93] text-[#536D22]">
                    Active
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-[#F6ECE6] rounded-xl border border-[#E5E0DD]">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#40493D]">
                        Energy Balance Check
                      </span>
                      <span className="text-xs font-bold text-[#00490E] flex items-center gap-1">
                        <CheckCircle2 size={14} className="text-[#00490E]" /> PASS
                      </span>
                    </div>
                    <p className="text-xs text-[#40493D]">
                      Array generation reliably covers daily consumption with 25% safety overhead.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white rounded-lg border border-[#E5E0DD]">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#707A6C]">
                        Voltage Drop Limit
                      </div>
                      <div className="text-lg font-bold text-[#00490E]">
                        &lt; 3.0%
                      </div>
                      <div className="text-[10px] text-[#40493D]">IEEE Standard</div>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-[#E5E0DD]">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#707A6C]">
                        Battery Longevity
                      </div>
                      <div className="text-lg font-bold text-[#4D661C]">
                        6,000 Cycles
                      </div>
                      <div className="text-[10px] text-[#40493D]">80% DoD LiFePO4</div>
                    </div>
                  </div>

                  <div className="pt-2 text-center">
                    <Link
                      href="/tools/solar-system-sizing"
                      className="text-xs font-bold text-[#00490E] hover:underline inline-flex items-center gap-1"
                    >
                      Test custom system parameters <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Tool Catalog Section */}
      <section id="catalog" className="py-16 max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Header & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 border-b border-[#E5E0DD] pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#00490E] block mb-1">
              Deterministic Engineering Catalog
            </span>
            <h2 className="font-display text-3xl font-extrabold text-[#00490E] tracking-tight">
              All Engineering Calculators
            </h2>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 text-[#707A6C] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by tool name or parameter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5E0DD] rounded-full text-xs font-sans text-[#1F1B17] placeholder:text-[#707A6C] focus:outline-none focus:border-[#00490E] shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: 'all', label: 'All Tools (10)' },
            { id: 'sizing', label: 'System Sizing (4)' },
            { id: 'electrical', label: 'Electrical & Cabling (2)' },
            { id: 'storage', label: 'Storage & Inverters (2)' },
            { id: 'financial', label: 'Financial & ROI (2)' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedGroup(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                selectedGroup === cat.id
                  ? 'bg-[#00490E] text-white shadow-sm'
                  : 'bg-white text-[#40493D] border border-[#E5E0DD] hover:bg-[#F6ECE6]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 3. Bento Grid of Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                className="bg-white rounded-[20px] border border-[#E5E0DD] p-6 shadow-sunlit flex flex-col justify-between hover:border-[#00490E]/50 transition-all hover:shadow-md group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#ECEFE6] flex items-center justify-center text-[#00490E] group-hover:bg-[#00490E] group-hover:text-white transition-colors">
                      <Icon size={20} />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F6ECE6] text-[#00490E] border border-[#E5E0DD]">
                      {tool.metricBadge}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#4D661C] block mb-1">
                    {tool.category}
                  </span>

                  <h3 className="font-display text-xl font-bold text-[#1F1B17] group-hover:text-[#00490E] transition-colors mb-2">
                    {tool.name}
                  </h3>

                  <p className="font-sans text-xs text-[#40493D] leading-relaxed mb-4 line-clamp-3">
                    {tool.description}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-[#E5E0DD]">
                  <div className="flex justify-between items-center text-[11px] gap-2">
                    <span
                      className="text-[#40493D] font-mono text-[10.5px] font-semibold bg-[#FFF8F5] px-2 py-1 rounded-md border border-[#E5E0DD] truncate max-w-[65%]"
                      title={tool.formulaBadge}
                    >
                      {tool.formulaBadge}
                    </span>
                    <span className="font-bold text-[#00490E] text-[11px] shrink-0">
                      {tool.stats.value}
                    </span>
                  </div>

                  <Link
                    href={tool.path}
                    className="w-full py-3 bg-[#00490E] text-white rounded-full text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#003006] transition-all shadow-sm group-hover:scale-[1.01]"
                  >
                    Launch Calculator
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-16 bg-white rounded-[20px] border border-[#E5E0DD]">
            <p className="text-sm font-semibold text-[#40493D]">
              No calculators found matching &quot;{searchQuery}&quot;.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedGroup('all');
              }}
              className="mt-3 text-xs font-bold text-[#00490E] hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* 4. Engineering Standards & Deterministic Guarantees (Bento Grid) */}
      <section className="py-16 bg-[#F6ECE6] border-y border-[#E5E0DD]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#00490E] block mb-1">
              Rigorous Mathematical Methodology
            </span>
            <h2 className="font-display text-3xl font-extrabold text-[#00490E] tracking-tight">
              Why Engineers Trust Sunlit Calculators
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-[20px] p-6 border border-[#E5E0DD] shadow-sunlit">
              <div className="w-10 h-10 rounded-full bg-[#ECEFE6] flex items-center justify-center text-[#00490E] mb-4">
                <CheckCircle2 size={20} />
              </div>
              <h3 className="font-display text-lg font-bold text-[#1F1B17] mb-2">
                Deterministic Output
              </h3>
              <p className="text-xs text-[#40493D] leading-relaxed">
                Zero AI hallucinations or generalized assumptions. Every tool executes
                peer-reviewed mathematical models with strict pass/fail criteria.
              </p>
            </div>

            <div className="bg-white rounded-[20px] p-6 border border-[#E5E0DD] shadow-sunlit">
              <div className="w-10 h-10 rounded-full bg-[#ECEFE6] flex items-center justify-center text-[#00490E] mb-4">
                <ShieldCheck size={20} />
              </div>
              <h3 className="font-display text-lg font-bold text-[#1F1B17] mb-2">
                Standards Compliance
              </h3>
              <p className="text-xs text-[#40493D] leading-relaxed">
                Adheres strictly to IEC 62548 (PV Array Design), IEEE Cable Ampacity
                Standards (&lt;3% voltage drop), and NEMSA electrical safety requirements.
              </p>
            </div>

            <div className="bg-white rounded-[20px] p-6 border border-[#E5E0DD] shadow-sunlit">
              <div className="w-10 h-10 rounded-full bg-[#ECEFE6] flex items-center justify-center text-[#00490E] mb-4">
                <TrendingUp size={20} />
              </div>
              <h3 className="font-display text-lg font-bold text-[#1F1B17] mb-2">
                Nigerian Market Reality
              </h3>
              <p className="text-xs text-[#40493D] leading-relaxed">
                Calibrated against real-world generator fuel costs, Band A tariff schedules,
                and high ambient temperature deratings specific to West Africa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Enterprise Report Waitlist Form */}
      <section className="py-16 max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
        <PublicWaitlistForm
          title="Export Bankable Engineering Reports"
          subtitle="Generate audit-ready single-line diagrams (SLD), CAD layouts, and verified bills of materials for financing and installer execution."
        />
      </section>

      {/* 6. FAQ Section */}
      <section className="py-16 bg-white border-t border-[#E5E0DD]">
        <div className="max-w-[840px] mx-auto px-4 sm:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#00490E] block mb-1">
              Technical Clarity
            </span>
            <h2 className="font-display text-3xl font-extrabold text-[#00490E] tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div
                key={index}
                className="border border-[#E5E0DD] rounded-[16px] overflow-hidden bg-[#FFF8F5]"
              >
                <button
                  onClick={() =>
                    setExpandedFaq(expandedFaq === index ? null : index)
                  }
                  className="w-full p-5 text-left font-display text-sm font-bold text-[#1F1B17] flex justify-between items-center hover:text-[#00490E] transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    size={18}
                    className={`transform transition-transform ${
                      expandedFaq === index ? 'rotate-180 text-[#00490E]' : 'text-[#707A6C]'
                    }`}
                  />
                </button>
                {expandedFaq === index && (
                  <div className="px-5 pb-5 pt-1 text-xs text-[#40493D] leading-relaxed border-t border-[#E5E0DD]/60">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
