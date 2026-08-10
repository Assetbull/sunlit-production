import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Users, Target, Globe, ShieldCheck, Zap, Award, Building2, Heart, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: "About Sunlit Energy — Nigeria's Premier Solar Energy Marketplace & Infrastructure",
  description:
    "Sunlit Energy is building Nigeria's sovereign clean energy operating system. We connect homeowners, commercial facilities, and certified solar installers through verified standards, milestone-based escrow payments, and precision sizing tools.",
  keywords:
    'about sunlit energy, solar energy company nigeria, renewable energy lagos, trusted solar installers nigeria, solar marketplace abuja, solar infrastructure africa, clean energy nigeria',
  alternates: { canonical: 'https://sunlit.energy/about' },
  openGraph: {
    title: 'About Sunlit Energy — Engineering the Future of African Energy',
    description:
      "Building Nigeria's most trusted solar energy marketplace. Vetted installers, escrow-protected milestone payments, and enterprise engineering standards.",
    url: 'https://sunlit.energy/about',
    siteName: 'Sunlit Energy',
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Sunlit Energy — Solar Infrastructure Platform',
    description:
      'Connecting homes and enterprises with vetted solar installers, escrow security, and engineering-grade sizing across Nigeria.',
  },
};

const TEAM_VALUES = [
  { icon: ShieldCheck, title: 'Trust First', desc: 'Every installer is multi-stage vetted across CAC registration, technical certifications, and reference audits. Every payment is escrow-protected. Trust is our foundation.' },
  { icon: Zap, title: 'Radical Transparency', desc: 'Milestone-based payments mean project owners inspect verified deliverables before releasing funds. No hidden markups, no guesstimates.' },
  { icon: Globe, title: 'Built for Nigeria', desc: 'Tailored specifically for Nigerian solar irradiance, grid tariff realities (Band A–E), and diesel generator displacement economics.' },
  { icon: Users, title: 'Installer Empowerment', desc: 'We provide certified EPCs and solar technicians with workflow software, verified equipment access, and guaranteed milestone payouts.' },
  { icon: Target, title: 'Engineering Rigor', desc: 'All system sizing models enforce IEC 62548 standards, IEEE ampacity rules, and localized meteorological data.' },
  { icon: Heart, title: 'Sovereign Energy Future', desc: 'We are building resilient, decentralized clean energy infrastructure to power Nigerian homes, businesses, and industries for decades.' },
];

const LEADERSHIP = [
  { name: 'Executive Leadership', role: 'Renewable energy infrastructure & platform architecture' },
  { name: 'Field Operations & Quality', role: 'Installer network vetting & site commissioning standards' },
  { name: 'Software & Sizing Engines', role: 'Deterministic calculators & marketplace matching AI' },
  { name: 'Partnerships & Financing', role: 'Equipment supplier verification & commercial debt pathways' },
];

const IMPACT_STATS = [
  { value: '340+', label: 'Vetted Installers', icon: Users },
  { value: '3', label: 'Active Service Hubs', icon: Globe },
  { value: '₦0', label: 'Upfront Escrow Risk', icon: ShieldCheck },
  { value: '2026', label: 'Operational Year', icon: TrendingUp },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Sunlit Energy',
  url: 'https://sunlit.energy/about',
  description:
    "Sunlit Energy is Nigeria's renewable energy marketplace connecting homeowners, commercial facilities, and vetted installers through milestone escrow payments and deterministic engineering tools.",
  publisher: {
    '@type': 'Organization',
    name: 'Sunlit Energy',
    legalName: 'Sunlit Global Energy Co. Ltd.',
    url: 'https://sunlit.energy',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Lekki Phase 1',
      addressLocality: 'Lagos',
      addressRegion: 'Lagos State',
      addressCountry: 'NG',
    },
  },
  mainEntity: {
    '@type': 'Organization',
    name: 'Sunlit Energy',
    foundingDate: '2026',
    areaServed: ['Lagos State', 'Abuja (FCT)', 'Ogun State', 'Nigeria'],
    knowsAbout: [
      'Photovoltaic System Engineering',
      'Solar Installer Verification',
      'Milestone Escrow Payments',
      'Battery Storage Sizing',
      'Commercial Solar Microgrids',
    ],
  },
};

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main style={{ background: '#fff8f5', minHeight: '100vh', paddingTop: 0 }}>

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section
          aria-label="About hero"
          className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#f4f4f1] to-[#fff8f5] border-b border-[#BFCABA]/20"
        >
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#00490e]/10 rounded-full px-3.5 py-1 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00490e] inline-block" />
                <span className="font-sans text-xs font-semibold text-[#00490e] uppercase tracking-wider">Our Story</span>
              </div>
              <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-[#1a1c1b] tracking-tight leading-[1.08] mb-4">
                Engineering the Future of African Energy
              </h1>
              <p className="font-sans text-sm sm:text-base lg:text-lg text-[#40493d] leading-relaxed mb-8">
                We recognized a broken system — unverified installers, no price transparency, no payment protection. Sunlit Energy was built to fix every part of it.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#00490e] hover:bg-[#003006] text-white font-sans font-bold text-sm shadow-md transition-all">
                  Get in Touch <ArrowRight size={16} />
                </Link>
                <Link href="/services" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-[#BFCABA]/60 hover:bg-[#F0EDE3] text-[#1a1c1b] font-sans font-semibold text-sm transition-all">
                  Our Services
                </Link>
              </div>
            </div>

            {/* Glass stat cards */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {IMPACT_STATS.map((s) => (
                <div
                  key={s.label}
                  className="bg-white/80 backdrop-blur-md border border-[#E2D8D2]/60 shadow-sm rounded-[20px] p-5 sm:p-6 text-center"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#00490e]/10 flex items-center justify-center mx-auto mb-3 text-[#00490e]">
                    <s.icon size={20} />
                  </div>
                  <div className="font-display font-extrabold text-2xl sm:text-3xl text-[#00490e] tracking-tight mb-1">{s.value}</div>
                  <div className="font-sans text-xs sm:text-sm text-[#40493d] font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Mission & Vision ──────────────────────────────────────── */}
        <section aria-label="Mission and vision" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            <div>
              <span className="font-sans text-xs font-semibold text-[#4d661c] uppercase tracking-wider block mb-3">The Mission</span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#00490e] tracking-tight leading-tight">
                To deploy precision-engineered solar at unprecedented scale across Nigeria.
              </h2>
            </div>
            <div>
              <span className="font-sans text-xs font-semibold text-[#4d661c] uppercase tracking-wider block mb-3">The Vision</span>
              <p className="font-display font-semibold text-lg sm:text-xl text-[#40493d] leading-relaxed">
                A Nigeria — and Africa — powered by a decentralized, resilient sovereign energy grid that guarantees clean power for generations.
              </p>
            </div>
          </div>
        </section>

        {/* ── Impact Bento Grid ─────────────────────────────────────── */}
        <section aria-label="Impact statistics" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#f9f9f6]">
          <div className="max-w-[1200px] mx-auto">
            <div className="mb-10">
              <span className="font-sans text-xs font-semibold text-[#4d661c] uppercase tracking-wider block mb-2">Impact &amp; Scale</span>
              <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-[#1a1c1b] tracking-tight">The Problem We&apos;re Solving</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Big feature card */}
              <div className="bg-gradient-to-br from-[#00490e] to-[#0f631b] text-white rounded-[20px] p-6 sm:p-10 md:col-span-2 flex flex-col justify-between gap-6 shadow-md">
                <div className="max-w-xl">
                  <div className="font-display font-extrabold text-2xl sm:text-4xl text-white tracking-tight mb-3">The Platform Approach</div>
                  <p className="font-sans text-sm sm:text-base text-white/85 leading-relaxed">
                    Moving beyond traditional fragmented solar buying. We treat energy infrastructure as a continuously improving platform — connecting demand, supply, and financing in one trusted marketplace.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[{ v: '60-80%', l: 'Cost savings possible' }, { v: '100%', l: 'Escrow protection' }, { v: '3+', l: 'Bids per project' }].map((m) => (
                    <div key={m.l} className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 text-center sm:text-left border border-white/10">
                      <div className="font-display font-extrabold text-xl text-[#88d982] tracking-tight">{m.v}</div>
                      <div className="font-sans text-xs text-white/80">{m.l}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Problem vs Solution cards */}
              {[
                { problem: 'Unverified installers', solution: 'Multi-stage vetting process', icon: ShieldCheck },
                { problem: 'No payment protection', solution: 'Escrow-secured milestones', icon: Award },
                { problem: 'No pricing transparency', solution: 'Competitive bid marketplace', icon: Target },
                { problem: 'No project oversight', solution: 'Real-time tracking dashboard', icon: Building2 },
              ].map((item) => (
                <div key={item.problem} className="bg-white rounded-[18px] p-6 border border-[#BFCABA]/20 shadow-sm flex flex-col justify-between">
                  <div className="w-11 h-11 rounded-xl bg-[#00490e]/10 flex items-center justify-center mb-4 text-[#00490e]">
                    <item.icon size={22} />
                  </div>
                  <div>
                    <div className="font-sans text-xs text-[#707a6c] mb-1 line-through">{item.problem}</div>
                    <div className="font-display font-bold text-base text-[#1a1c1b]">{item.solution}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Values ───────────────────────────────────────────────── */}
        <section aria-label="Our values" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-12">
              <span className="font-sans text-xs font-semibold text-[#00490e] uppercase tracking-wider block mb-2">What We Stand For</span>
              <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-[#1a1c1b] tracking-tight">Our Core Values</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {TEAM_VALUES.map((val) => (
                <div key={val.title} className="bg-[#f9f9f6] rounded-[18px] p-6 sm:p-8 border border-[#BFCABA]/20 shadow-xs">
                  <div className="w-12 h-12 rounded-xl bg-[#00490e]/10 flex items-center justify-center mb-4 text-[#00490e]">
                    <val.icon size={24} />
                  </div>
                  <h3 className="font-display font-bold text-lg text-[#1a1c1b] mb-2">{val.title}</h3>
                  <p className="font-sans text-xs sm:text-sm text-[#40493d] leading-relaxed">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Leadership ───────────────────────────────────────────── */}
        <section aria-label="Leadership team" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#f9f9f6]">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-12">
              <span className="font-sans text-xs font-semibold text-[#00490e] uppercase tracking-wider block mb-2">The Team</span>
              <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-[#1a1c1b] tracking-tight">
                Built by Energy &amp; Technology Experts
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {LEADERSHIP.map((member) => (
                <div key={member.name} className="bg-white rounded-[18px] p-6 border border-[#BFCABA]/20 shadow-sm text-center">
                  <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-gradient-to-br from-[#00490e]/10 to-[#0f631b]/20 flex items-center justify-center text-[#00490e]">
                    <Users size={28} />
                  </div>
                  <div className="font-display font-bold text-base text-[#1a1c1b] mb-1">{member.name}</div>
                  <div className="font-sans text-xs text-[#40493d]">{member.role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <section aria-label="Join Sunlit" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#00490e] to-[#0f631b] text-center text-white">
          <div className="max-w-[700px] mx-auto">
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight mb-4">
              Join the Solar Revolution
            </h2>
            <p className="font-sans text-sm sm:text-base text-white/80 leading-relaxed mb-8">
              Whether you&apos;re a homeowner, business, installer, or investor — there&apos;s a place for you in the Sunlit ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row gap-3.5 justify-center items-center">
              <Link href="/waitlist" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white text-[#00490e] font-sans font-bold text-sm shadow-md transition-all hover:bg-[#ECEFE6]">
                Join Waitlist <ArrowRight size={18} />
              </Link>
              <Link href="/contact" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-white/40 text-white font-sans font-semibold text-sm transition-all hover:bg-white/10">
                Contact Us
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
