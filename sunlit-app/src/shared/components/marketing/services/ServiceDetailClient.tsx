'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sun,
  Home,
  Building2,
  Factory,
  Wrench,
  Battery,
  Search,
  DollarSign,
  EvCharger,
  MapPin,
  Sparkles,
  Calculator,
  Layers,
  Award,
  ArrowUpRight,
} from 'lucide-react';
import { ServiceItem, SERVICE_CATALOG } from '@/lib/services/service-catalog';

interface ServiceDetailClientProps {
  service: ServiceItem;
}

const SERVICE_ICONS: Record<string, typeof Home> = {
  'residential-solar': Home,
  'commercial-solar': Building2,
  'industrial-solar': Factory,
  marketplace: Search,
  'energy-audits': Wrench,
  maintenance: ShieldCheck,
  'battery-storage': Battery,
  'ev-charging': EvCharger,
  'solar-financing': DollarSign,
  monitoring: Zap,
};

export function ServiceDetailClient({ service }: ServiceDetailClientProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const IconComponent = SERVICE_ICONS[service.id] || Sun;

  return (
    <div className="bg-[#f7fbf1] text-[#191d17] min-h-screen pt-24 pb-20 font-[Inter]">
      {/* ── 00. BREADCRUMBS ─────────────────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 mb-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-[#707a6c]">
          <Link href="/" className="hover:text-[#00490e] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/services" className="hover:text-[#00490e] transition-colors">
            Services
          </Link>
          <span>/</span>
          <span className="text-[#00490e] font-semibold truncate">{service.shortTitle}</span>
        </nav>
      </div>

      {/* ── 01. HERO SECTION ───────────────────────────────────────── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-8 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            {/* Category badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00490e]/10 border border-[#00490e]/20 text-[#00490e] text-xs font-bold uppercase tracking-wider mb-6">
              <IconComponent size={15} />
              <span>{service.categoryBadge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-[Manrope] font-extrabold text-3xl sm:text-5xl lg:text-6xl text-[#003006] tracking-tight leading-[1.08] mb-6">
              {service.title}
            </h1>

            {/* Direct 60-word GEO/AEO Answer paragraph */}
            <p className="font-[Inter] text-base sm:text-lg text-[#40493d] leading-relaxed mb-8">
              {service.heroSummary}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/tools/solar-system-sizing"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#003006] hover:bg-[#00490e] text-white font-[Inter] font-bold text-sm shadow-md transition-all"
              >
                <Calculator size={18} />
                Calculate Solar System
              </Link>
              <Link
                href="/installers"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-[#003006]/40 hover:bg-[#003006] hover:text-white text-[#003006] bg-white font-[Inter] font-semibold text-sm transition-all"
              >
                Hire Verified Installer <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* High-density Spec Card */}
          <div className="lg:col-span-5 bg-[#fff8f5] rounded-[24px] border border-[#bfcaba]/40 p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-3 pb-6 border-b border-[#bfcaba]/30">
              <div className="w-12 h-12 rounded-2xl bg-[#00490e]/10 flex items-center justify-center text-[#00490e] shrink-0">
                <IconComponent size={24} />
              </div>
              <div>
                <div className="text-xs font-bold text-[#707a6c] uppercase tracking-wider">
                  Technical Architecture
                </div>
                <div className="font-[Manrope] font-extrabold text-lg text-[#003006]">
                  {service.tag}
                </div>
              </div>
            </div>

            <div className="space-y-4 py-6">
              <div>
                <div className="text-xs font-semibold text-[#707a6c] uppercase tracking-wider mb-1">
                  System Capacity
                </div>
                <div className="font-[Manrope] font-bold text-base text-[#191d17]">
                  {service.systemSizing}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-[#707a6c] uppercase tracking-wider mb-1">
                  Battery Storage Spec
                </div>
                <div className="font-[Manrope] font-bold text-base text-[#00490e]">
                  {service.batteryCycleLife}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-[#707a6c] uppercase tracking-wider mb-1">
                  Estimated Monthly ROI
                </div>
                <div className="font-[Manrope] font-bold text-base text-[#191d17]">
                  {service.estMonthlyRoi}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-[#707a6c] uppercase tracking-wider mb-1">
                  Capital Payback Period
                </div>
                <div className="font-[Manrope] font-bold text-base text-[#191d17]">
                  {service.paybackPeriod}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-[#707a6c] uppercase tracking-wider mb-1">
                  Inverter Architecture
                </div>
                <div className="font-[Inter] text-xs text-[#40493d]">
                  {service.inverterTopology}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#bfcaba]/30 flex items-center gap-2 text-xs font-semibold text-[#00490e]">
              <ShieldCheck size={16} />
              <span>100% Escrow Milestone Protected</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 02. IS THIS SERVICE RIGHT FOR YOU? ──────────────────────── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-8 py-16">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-[#00490e] uppercase tracking-wider block mb-2">
            Target Audience & Suitability
          </span>
          <h2 className="font-[Manrope] font-extrabold text-2xl sm:text-4xl text-[#003006] tracking-tight">
            Is This Solution Right for You?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {service.audiences.map((aud) => (
            <div
              key={aud.title}
              className="bg-white rounded-[20px] p-6 sm:p-8 border border-[#bfcaba]/40 shadow-xs flex flex-col justify-between"
            >
              <div>
                <span className="inline-block text-[11px] font-bold text-[#4d661c] bg-[#ceee93]/30 rounded-full px-3 py-1 uppercase tracking-wider mb-4">
                  {aud.badge}
                </span>
                <h3 className="font-[Manrope] font-bold text-xl text-[#003006] mb-3">
                  {aud.title}
                </h3>
                <p className="text-sm text-[#40493d] leading-relaxed mb-6">
                  {aud.description}
                </p>
                <div className="bg-[#f7fbf1] p-4 rounded-xl mb-4 border border-[#bfcaba]/30">
                  <div className="text-xs font-bold text-[#707a6c] uppercase mb-1">Typical Load:</div>
                  <div className="text-xs text-[#191d17] font-medium">{aud.typicalLoad}</div>
                </div>
              </div>
              <div className="text-xs font-semibold text-[#00490e] flex items-center gap-1.5 pt-4 border-t border-[#bfcaba]/20">
                <CheckCircle2 size={16} className="text-[#00490e] shrink-0" />
                <span>{aud.keyBenefit}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 03. PROBLEMS WE SOLVE ───────────────────────────────────── */}
      <section className="bg-[#f0e6e0]/40 py-20 border-y border-[#bfcaba]/30">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-[#00490e] uppercase tracking-wider block mb-2">
              Nigerian Energy Challenges Solved
            </span>
            <h2 className="font-[Manrope] font-extrabold text-2xl sm:text-4xl text-[#003006] tracking-tight">
              Eliminating Common Power Failures
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {service.problemsSolved.map((item, idx) => (
              <div
                key={item.problem}
                className="bg-white rounded-[20px] p-6 sm:p-8 border border-[#bfcaba]/40 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-full bg-[#ba1a1a]/10 text-[#ba1a1a] flex items-center justify-center font-bold text-sm mb-4">
                    0{idx + 1}
                  </div>
                  <h3 className="font-[Manrope] font-bold text-lg text-[#ba1a1a] mb-2">
                    {item.problem}
                  </h3>
                  <p className="text-xs text-[#707a6c] leading-relaxed mb-6 italic">
                    &ldquo;{item.impact}&rdquo;
                  </p>
                </div>
                <div className="bg-[#00490e]/5 p-4 rounded-xl border border-[#00490e]/20">
                  <div className="text-xs font-bold text-[#00490e] uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Sparkles size={14} /> Sunlit Solution
                  </div>
                  <p className="text-xs text-[#191d17] font-medium leading-relaxed">
                    {item.solution}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 04. ENGINEERED HARDWARE & SOFTWARE PILLARS ──────────────── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-8 py-20">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-[#00490e] uppercase tracking-wider block mb-2">
            Engineering Precision
          </span>
          <h2 className="font-[Manrope] font-extrabold text-2xl sm:text-4xl text-[#003006] tracking-tight">
            The Sunlit Infrastructure Standard
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {service.pillars.map((pillar) => (
            <div
              key={pillar.component}
              className="bg-white rounded-[20px] p-6 border border-[#bfcaba]/40 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#00490e]/10 text-[#00490e] flex items-center justify-center mb-4">
                  <Layers size={20} />
                </div>
                <h3 className="font-[Manrope] font-bold text-base text-[#003006] mb-2">
                  {pillar.component}
                </h3>
                <p className="text-xs text-[#40493d] leading-relaxed mb-4">
                  {pillar.specification}
                </p>
              </div>
              <div className="text-[11px] font-semibold text-[#00490e] bg-[#f7fbf1] p-3 rounded-lg border border-[#bfcaba]/25 flex items-start gap-1.5">
                <Award size={14} className="shrink-0 mt-0.5" />
                <span>{pillar.assurance}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 05. DELIVERY WORKFLOW (4-STEP MILESTONE ESCROW) ─────────── */}
      <section className="bg-[#003006] text-white py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#ceee93] uppercase tracking-wider block mb-2">
              Trust &amp; Execution Standard
            </span>
            <h2 className="font-[Manrope] font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
              4-Step Milestone Escrow Delivery
            </h2>
            <p className="text-sm text-white/80 mt-3">
              Your money is never handed over upfront. Funds are held in licensed escrow and released only upon verified milestone completion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
            ].map((st) => (
              <div
                key={st.step}
                className="bg-white/5 backdrop-blur-md rounded-[20px] p-6 border border-white/10 flex flex-col justify-between"
              >
                <div>
                  <div className="font-[Manrope] font-extrabold text-3xl text-[#ceee93] mb-4">
                    {st.step}
                  </div>
                  <h3 className="font-[Manrope] font-bold text-lg text-white mb-2">{st.title}</h3>
                  <p className="text-xs text-white/80 leading-relaxed">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 06. REGIONAL COVERAGE ───────────────────────────────────── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-8 py-20">
        <div className="bg-white rounded-[24px] border border-[#bfcaba]/40 p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6">
              <span className="text-xs font-bold text-[#00490e] uppercase tracking-wider block mb-2">
                Operational Presence
              </span>
              <h2 className="font-[Manrope] font-extrabold text-2xl sm:text-4xl text-[#003006] tracking-tight mb-4">
                Active Service Coverage Across Nigeria
              </h2>
              <p className="text-sm text-[#40493d] leading-relaxed mb-6">
                Sunlit operates verified installer and engineering inspection teams across primary commercial and industrial corridors, offering rapid dispatch and guaranteed response SLAs.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { city: 'Lagos State', areas: 'Lekki, Ikeja, VI, Ikoyi, Ikeja GRA' },
                  { city: 'Abuja (FCT)', areas: 'Maitama, Wuse, Gwarinpa, Asokoro' },
                  { city: 'Ogun State', areas: 'Agbara, Sagamu, Abeokuta, Ota' },
                  { city: 'Rivers & South', areas: 'Port Harcourt, Trans-Amadi, GRA' },
                ].map((loc) => (
                  <div key={loc.city} className="p-3 bg-[#f7fbf1] rounded-xl border border-[#bfcaba]/25">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#003006] mb-1">
                      <MapPin size={14} className="text-[#00490e]" />
                      <span>{loc.city}</span>
                    </div>
                    <div className="text-[11px] text-[#707a6c]">{loc.areas}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 bg-[#f7fbf1] rounded-2xl p-6 sm:p-8 border border-[#bfcaba]/30">
              <div className="font-[Manrope] font-bold text-lg text-[#003006] mb-4">
                Verified Platform Guarantees
              </div>
              <div className="space-y-3">
                {[
                  '100% Escrow Protection: Funds released strictly on verified milestones.',
                  'NEMSA & COREN Certified: Fully compliant with Nigerian electrical safety codes.',
                  'Direct OEM Tier-1 Hardware: 25-year panel and 10-year battery warranties.',
                  'Local RMA Support: Fast component replacement from domestic inventory.',
                ].map((guar) => (
                  <div key={guar} className="flex items-start gap-2.5 text-xs text-[#191d17]">
                    <CheckCircle2 size={16} className="text-[#00490e] shrink-0 mt-0.5" />
                    <span>{guar}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 07. TECHNICAL FAQS ──────────────────────────────────────── */}
      <section className="max-w-[900px] mx-auto px-4 sm:px-8 py-12">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-[#00490e] uppercase tracking-wider block mb-2">
            Technical Knowledge Base
          </span>
          <h2 className="font-[Manrope] font-extrabold text-2xl sm:text-4xl text-[#003006] tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {service.faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={faq.question}
                className="bg-white rounded-[16px] border border-[#bfcaba]/40 overflow-hidden shadow-2xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4"
                >
                  <span className="font-[Manrope] font-bold text-sm sm:text-base text-[#003006]">
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp size={20} className="text-[#00490e] shrink-0" />
                  ) : (
                    <ChevronDown size={20} className="text-[#707a6c] shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-[#40493d] leading-relaxed border-t border-[#bfcaba]/20">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 08. RELATED SERVICES ────────────────────────────────────── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-8 py-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#00490e] uppercase tracking-wider block mb-1">
              Explore Related Solutions
            </span>
            <h3 className="font-[Manrope] font-extrabold text-xl sm:text-2xl text-[#003006]">
              Complementary Clean Energy Infrastructure
            </h3>
          </div>
          <Link
            href="/services"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#00490e] hover:underline"
          >
            All Services <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {service.relatedSlugs.map((slug) => {
            const rel = SERVICE_CATALOG[slug];
            if (!rel) return null;
            const RelIcon = SERVICE_ICONS[rel.id] || Sun;
            return (
              <Link
                key={rel.slug}
                href={`/services/${rel.slug}`}
                className="bg-white rounded-[20px] p-6 border border-[#bfcaba]/40 hover:border-[#00490e] hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#00490e]/10 text-[#00490e] flex items-center justify-center">
                      <RelIcon size={20} />
                    </div>
                    <ArrowUpRight size={18} className="text-[#707a6c] group-hover:text-[#00490e] transition-colors" />
                  </div>
                  <h4 className="font-[Manrope] font-bold text-base text-[#003006] mb-2 group-hover:text-[#00490e] transition-colors">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-[#40493d] line-clamp-2 leading-relaxed">
                    {rel.heroSummary}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-[#bfcaba]/20 text-xs font-semibold text-[#00490e]">
                  {rel.tag}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── 09. FINAL CONVERSION BANNER ────────────────────────────── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-8 pt-10">
        <div className="bg-gradient-to-br from-[#003006] to-[#0f631b] rounded-[24px] p-8 sm:p-14 text-center text-white shadow-lg">
          <h2 className="font-[Manrope] font-extrabold text-2xl sm:text-4xl text-white tracking-tight mb-4">
            Ready to Deploy {service.shortTitle}?
          </h2>
          <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed">
            Get precision system sizing or receive competitive milestone-protected bids from verified local installers in minutes.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/tools/solar-system-sizing"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-[#003006] font-[Inter] font-bold text-sm shadow-md hover:bg-[#f7fbf1] transition-all"
            >
              <Calculator size={18} />
              Calculate My System Sizing
            </Link>
            <Link
              href="/get-started"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/40 text-white font-[Inter] font-semibold text-sm hover:bg-white/10 transition-all"
            >
              Get Started Now <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
