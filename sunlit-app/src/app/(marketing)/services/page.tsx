import { Metadata } from 'next';
import Link from 'next/link';
import {
  Home,
  Building2,
  Factory,
  Wrench,
  Battery,
  Zap,
  Search,
  ArrowRight,
  DollarSign,
  ShieldCheck,
  EvCharger,
  Sparkles,
  Calculator,
  ArrowUpRight,
} from 'lucide-react';
import { SERVICE_CATALOG } from '@/lib/services/service-catalog';

export const metadata: Metadata = {
  title: 'Solar Energy Services in Nigeria — Residential, Commercial & Industrial | Sunlit Energy',
  description:
    'End-to-end solar energy solutions across Nigeria: residential rooftop solar, commercial microgrids, industrial 100kVA+ systems, LiFePO4 battery storage, EV charging, and verified installer matching with milestone escrow protection.',
  keywords:
    'solar services nigeria, residential solar lagos, commercial solar nigeria, industrial solar ogun, battery storage lifepo4 nigeria, solar maintenance contract lagos, solar financing abuja, ev charging stations nigeria',
  alternates: { canonical: 'https://sunlit.energy/services' },
  openGraph: {
    title: 'Solar Services — Sunlit Energy Nigeria',
    description:
      'From residential solar to megawatt commercial microgrids. Vetted installers, escrow-protected milestone payments, and verified engineering standards across Nigeria.',
    url: 'https://sunlit.energy/services',
    siteName: 'Sunlit Energy',
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solar Services Nigeria — Sunlit Energy',
    description:
      'Explore 10 verified solar service categories. Milestone-protected delivery and certified installers across Lagos, Abuja, and Ogun State.',
  },
};

const SERVICES = [
  {
    id: 'residential-solar',
    slug: 'residential-solar',
    icon: Home,
    badge: 'HOMEOWNERS & DUPLEXES',
    tag: 'Best For: Homeowners & Duplexes',
    title: 'Residential Solar (3kVA – 15kVA)',
    description:
      'Engineered rooftop solar and LiFePO4 battery systems designed to eliminate generator noise, diesel fueling costs, and grid blackouts. Milestone escrow guarantees payment security.',
    featured: true,
  },
  {
    id: 'commercial-solar',
    slug: 'commercial-solar',
    icon: Building2,
    badge: 'OFFICES, RETAIL & SCHOOLS',
    tag: 'Best For: Offices, Retail & Schools',
    title: 'Commercial Solar (15kVA – 100kVA)',
    description:
      'Scalable hybrid power systems for corporate offices, clinics, hotels, and retail centers. Cut Band A grid tariffs and daytime diesel running costs by up to 75%.',
    featured: false,
  },
  {
    id: 'industrial-solar',
    slug: 'industrial-solar',
    icon: Factory,
    badge: 'FACTORIES & LOGISTICS',
    tag: 'Best For: Factories & Logistics',
    title: 'Industrial Solar (100kVA – 1MW+)',
    description:
      'High-capacity microgrids for manufacturing plants, cold chain storage, and agro-processing hubs across Ogun, Lagos, and Abuja industrial zones.',
    featured: false,
  },
  {
    id: 'marketplace',
    slug: 'marketplace',
    icon: Search,
    badge: 'PROJECT OWNERS & EPCS',
    tag: 'Best For: Project Owners & EPCs',
    title: 'Solar Installer & RFQ Marketplace',
    description:
      'Connect directly with vetted solar installers and EPC contractors. Receive multiple competitive bids, compare equipment datasheets, and track milestone delivery.',
    featured: false,
  },
  {
    id: 'energy-audits',
    slug: 'energy-audits',
    icon: Wrench,
    badge: 'COST OPTIMIZATION',
    tag: 'Best For: Cost Optimization',
    title: 'Energy Audits & Load Profiling',
    description:
      'Comprehensive on-site load measurement, harmonic distortion analysis, and ROI modeling before procurement to avoid undersizing or overpaying.',
    featured: false,
  },
  {
    id: 'maintenance',
    slug: 'maintenance',
    icon: ShieldCheck,
    badge: 'EXISTING INSTALLATIONS',
    tag: 'Best For: Existing Installations',
    title: 'Solar Maintenance & Health Audits',
    description:
      'Scheduled thermographic panel inspections, inverter firmware calibration, battery impedance testing, and rapid repair dispatch across Lagos, Abuja, and Ogun.',
    featured: false,
  },
  {
    id: 'battery-storage',
    slug: 'battery-storage',
    icon: Battery,
    badge: '24/7 AUTONOMY',
    tag: 'Best For: 24/7 Autonomy',
    title: 'LiFePO4 Lithium Battery Storage',
    description:
      'Tier-1 Lithium Iron Phosphate (LiFePO4) battery banks offering 6,000+ cycle life, 80%+ Depth of Discharge (DoD), and integrated smart BMS for continuous backup.',
    featured: false,
    highlight: true,
  },
  {
    id: 'ev-charging',
    slug: 'ev-charging',
    icon: EvCharger,
    badge: 'COMMERCIAL & FLEETS',
    tag: 'Best For: Commercial & Fleets',
    title: 'EV Charging Infrastructure',
    description:
      'Commercial Level-2 and DC fast-charging stations integrated with solar canopies and battery buffering for estates, shopping plazas, and fleet hubs.',
    featured: false,
  },
  {
    id: 'solar-financing',
    slug: 'solar-financing',
    icon: DollarSign,
    badge: 'CAPITAL EFFICIENCY',
    tag: 'Best For: Capital Efficiency',
    title: 'Solar Financing & Lease-to-Own',
    description:
      'Structured installment plans, commercial power purchase agreements (PPA), and equipment financing to transition from diesel OPEX to clean solar asset ownership.',
    featured: false,
  },
  {
    id: 'monitoring',
    slug: 'monitoring',
    icon: Zap,
    badge: 'OPERATIONAL VISIBILITY',
    tag: 'Best For: Operational Visibility',
    title: 'Live Telemetry & Yield Monitoring',
    description:
      'Real-time IoT telemetry tracking solar generation, battery state-of-charge, grid availability, and automated failure alerts via Sunlit Suite.',
    featured: false,
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Solar Energy Engineering & Installation Services',
  provider: {
    '@type': 'Organization',
    name: 'Sunlit Energy',
    legalName: 'Sunlit Global Energy Co. Ltd.',
    url: 'https://sunlit.energy',
  },
  areaServed: [
    { '@type': 'AdministrativeArea', name: 'Lagos State' },
    { '@type': 'AdministrativeArea', name: 'Federal Capital Territory (Abuja)' },
    { '@type': 'AdministrativeArea', name: 'Ogun State' },
    { '@type': 'Country', name: 'Nigeria' },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Sunlit Energy Service Catalog',
    itemListElement: SERVICES.map((s) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: s.title,
        url: `https://sunlit.energy/services/${s.slug}`,
        description: s.description,
      },
    })),
  },
};

export default function ServicesPage() {
  const [featured, ...rest] = SERVICES;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="bg-[#f7fbf1] text-[#191d17] min-h-screen pt-24 pb-20 font-[Inter]">
        {/* ── 01. HERO SECTION ───────────────────────────────────────── */}
        <section aria-label="Services Header" className="max-w-[1200px] mx-auto px-4 sm:px-8 pt-8 pb-14 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00490e]/10 border border-[#00490e]/20 text-[#00490e] font-[Inter] text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles size={14} />
            <span>ALL SERVICES — Precision-Engineered Solar Infrastructure</span>
          </div>
          <h1 className="font-[Manrope] font-extrabold text-3xl sm:text-5xl lg:text-6xl text-[#003006] tracking-tight leading-[1.08] mb-6 max-w-4xl mx-auto">
            African Energy Infrastructure, Redefined.
          </h1>
          <p className="font-[Inter] text-base sm:text-lg text-[#40493d] max-w-2xl mx-auto leading-relaxed mb-8">
            Enterprise-grade solar solutions designed for reliability, efficiency, and complete grid independence across Nigeria.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4">
            <Link
              href="/tools/solar-system-sizing"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#003006] hover:bg-[#00490e] text-white font-[Inter] font-bold text-sm shadow-md transition-all"
            >
              <Calculator size={18} />
              Calculate Solar System
            </Link>
            <Link
              href="/installers"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-[#003006]/40 hover:bg-[#003006] hover:text-white text-[#003006] bg-white font-[Inter] font-semibold text-sm transition-all"
            >
              Hire Verified Installer <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* ── 02. SERVICES BENTO & HERO CARD ─────────────────────────── */}
        <section aria-label="Service Catalog" className="max-w-[1200px] mx-auto px-4 sm:px-8 pb-20">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <span className="text-xs font-bold text-[#00490e] uppercase tracking-wider block mb-1">
                Comprehensive Catalog
              </span>
              <h2 className="font-[Manrope] font-extrabold text-2xl sm:text-4xl text-[#003006] tracking-tight">
                The Complete Sunlit Service Stack
              </h2>
            </div>
            <span className="hidden sm:block text-xs font-bold text-[#707a6c] uppercase tracking-wider">
              10 Verified Categories
            </span>
          </div>

          {/* Featured Hero Card (Residential Solar) */}
          <div
            id="residential-solar"
            className="bg-white rounded-[24px] border border-[#bfcaba]/40 shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12 mb-8 transition-all hover:shadow-md"
          >
            {/* Visual Green Card Container */}
            <div className="bg-gradient-to-br from-[#003006] to-[#0f631b] p-8 lg:col-span-5 flex flex-col justify-between min-h-[260px] lg:min-h-full text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white mb-4">
                  <Home size={32} />
                </div>
                <div className="font-[Manrope] font-extrabold text-2xl text-white">
                  Residential Clean Energy
                </div>
                <div className="text-xs text-white/80 mt-1">
                  Engineered Rooftop PV &amp; LiFePO4 Storage
                </div>
              </div>
              <div className="relative z-10 pt-6 border-t border-white/15 flex items-center gap-2 text-xs text-[#ceee93]">
                <ShieldCheck size={16} />
                <span>100% Escrow Milestone Protected</span>
              </div>
              {/* Background radial highlight */}
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
            </div>

            {/* Featured Content Details */}
            <div className="p-6 sm:p-10 lg:col-span-7 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ceee93]/40 border border-[#ceee93] text-[#003006] text-[11px] font-bold uppercase tracking-wider mb-4">
                  <span>BEST FOR: {featured.badge}</span>
                </div>
                <h3 className="font-[Manrope] font-extrabold text-2xl sm:text-3xl text-[#003006] tracking-tight mb-3">
                  {featured.title}
                </h3>
                <p className="font-[Inter] text-sm sm:text-base text-[#40493d] leading-relaxed mb-6">
                  {featured.description}
                </p>

                {/* Live Spec Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 mb-6 border-y border-[#bfcaba]/25">
                  <div>
                    <div className="text-[11px] font-bold text-[#707a6c] uppercase tracking-wider mb-1">
                      System Sizing
                    </div>
                    <div className="font-[Manrope] font-extrabold text-lg text-[#003006]">
                      3–15 <span className="text-xs font-semibold text-[#707a6c]">kVA</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-[#707a6c] uppercase tracking-wider mb-1">
                      Battery Cycle Life
                    </div>
                    <div className="font-[Manrope] font-extrabold text-lg text-[#00490e]">
                      6,000+ <span className="text-xs font-semibold text-[#707a6c]">cycles</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-[#707a6c] uppercase tracking-wider mb-1">
                      Est. Monthly ROI
                    </div>
                    <div className="font-[Manrope] font-extrabold text-lg text-[#003006]">
                      ₦180k+ <span className="text-xs font-semibold text-[#707a6c]">saved</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Link
                  href={`/services/${featured.slug}`}
                  className="inline-flex items-center gap-2 font-[Inter] font-bold text-sm text-[#003006] hover:text-[#00490e] group"
                >
                  <span>Explore Solution</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* Grid Cards (Remaining 9 Services) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((svc) => {
              const SvcIcon = svc.icon;
              return (
                <div
                  key={svc.id}
                  id={svc.slug}
                  className={`rounded-[20px] p-6 sm:p-8 border shadow-xs flex flex-col justify-between transition-all hover:shadow-md ${
                    svc.highlight
                      ? 'bg-gradient-to-br from-[#00490e]/5 to-[#0f631b]/10 border-[#00490e]/40'
                      : 'bg-white border-[#bfcaba]/40'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-5">
                      <div className="w-12 h-12 rounded-xl bg-[#00490e]/10 flex items-center justify-center text-[#00490e] shrink-0">
                        <SvcIcon size={22} />
                      </div>
                      <span className="font-[Inter] text-[10px] font-bold text-[#40493d] bg-[#f7fbf1] rounded-full px-3 py-1 uppercase tracking-wider border border-[#bfcaba]/30">
                        {svc.badge}
                      </span>
                    </div>

                    <h3
                      className={`font-[Manrope] font-bold text-lg mb-3 tracking-tight ${
                        svc.highlight ? 'text-[#00490e]' : 'text-[#003006]'
                      }`}
                    >
                      {svc.title}
                    </h3>
                    <p className="font-[Inter] text-xs sm:text-sm text-[#40493d] leading-relaxed mb-6">
                      {svc.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#bfcaba]/20 flex items-center justify-between">
                    <Link
                      href={`/services/${svc.slug}`}
                      className="inline-flex items-center gap-1.5 font-[Inter] font-bold text-xs sm:text-sm text-[#00490e] hover:underline group"
                    >
                      <span>Details</span>
                      <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                    <Link
                      href={`/services/${svc.slug}`}
                      className="text-[#707a6c] hover:text-[#00490e] transition-colors"
                      aria-label={`Open ${svc.title} page`}
                    >
                      <ArrowUpRight size={16} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 03. DELIVERY WORKFLOW (4-STEP ESCROW) ─────────────────── */}
        <section aria-label="Process Workflow" className="bg-[#003006] text-white py-20">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold text-[#ceee93] uppercase tracking-wider block mb-2">
                Execution Standard
              </span>
              <h2 className="font-[Manrope] font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
                How Every Sunlit Service Is Delivered
              </h2>
              <p className="text-sm text-white/80 mt-3">
                Rigorous engineering verification and 100% milestone escrow fund safety at every stage.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: '01',
                  title: 'Audit & Sizing',
                  desc: 'On-site power profiling or digital sizing generates exact hardware requirements and single-line diagrams.',
                },
                {
                  step: '02',
                  title: 'Verified Match',
                  desc: 'Receive structured, competitive bids from top-tier vetted installers in your specific city and state.',
                },
                {
                  step: '03',
                  title: 'Escrow Locking',
                  desc: 'Funds are securely deposited into milestone escrow. 0% contractor payment default risk.',
                },
                {
                  step: '04',
                  title: 'IoT Telemetry Signoff',
                  desc: 'Telemetry verifies generation and voltage stability before final milestone funds are disbursed.',
                },
              ].map((p) => (
                <div
                  key={p.step}
                  className="bg-white/5 backdrop-blur-md rounded-[20px] p-6 sm:p-8 border border-white/10 flex flex-col justify-between"
                >
                  <div>
                    <div className="font-[Manrope] font-extrabold text-3xl text-[#ceee93] mb-4">
                      {p.step}
                    </div>
                    <h3 className="font-[Manrope] font-bold text-lg text-white mb-2">{p.title}</h3>
                    <p className="text-xs text-white/80 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 04. FINAL CTA BANNER ───────────────────────────────────── */}
        <section aria-label="Services Conversion CTA" className="max-w-[1200px] mx-auto px-4 sm:px-8 pt-16">
          <div className="bg-gradient-to-br from-[#003006] to-[#0f631b] rounded-[24px] p-8 sm:p-14 text-center text-white shadow-lg">
            <h2 className="font-[Manrope] font-extrabold text-2xl sm:text-4xl text-white tracking-tight mb-4">
              Ready to Power Your Property with Precision Solar?
            </h2>
            <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed">
              Calculate your solar requirements or connect with vetted EPC contractors across Lagos, Abuja, and Ogun State with 100% escrow protection.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/tools/solar-system-sizing"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-[#003006] font-[Inter] font-bold text-sm shadow-md hover:bg-[#f7fbf1] transition-all"
              >
                <Calculator size={18} />
                Calculate Solar System
              </Link>
              <Link
                href="/installers"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/40 text-white font-[Inter] font-semibold text-sm hover:bg-white/10 transition-all"
              >
                Hire Verified Installer <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
