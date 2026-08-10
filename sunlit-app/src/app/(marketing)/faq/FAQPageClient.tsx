'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowRight, MessageCircle } from 'lucide-react';

const FAQ_CATEGORIES = [
  {
    id: 'platform',
    label: 'Platform & Marketplace',
    faqs: [
      {
        q: 'What is Sunlit Energy?',
        a: "Sunlit Energy is Nigeria's renewable energy marketplace and engineering operations platform. We connect homeowners, commercial facilities, and project owners with verified solar installers, Tier-1 equipment suppliers, and financing pathways. Every project is backed by milestone-protected escrow payments and deterministic sizing tools.",
      },
      {
        q: 'How does Sunlit Energy verify solar installers and EPCs?',
        a: 'Every installer passes a rigorous 5-stage verification audit: Corporate Affairs Commission (CAC) business check, technical credential verification (NEMSA/COREN certifications), equipment distributor audit, reference customer review, and physical verification of completed installations.',
      },
      {
        q: 'Is Sunlit Energy an installer or a technology platform?',
        a: 'Sunlit Energy is an independent marketplace and engineering platform. We do not compete with installers; instead, we empower vetted solar professionals with engineering sizing tools, project management software, and verified project leads while protecting buyers through milestone escrow.',
      },
      {
        q: 'How does the installer bidding process work?',
        a: 'After you submit your energy requirements or load profile, qualified installers in your geographic zone (Lagos, Abuja, or Ogun) review the technical specifications and submit itemized competitive bids. You compare component datasheets, warranties, pricing, and contractor track records side by side.',
      },
    ],
  },
  {
    id: 'payments',
    label: 'Escrow & Payments',
    faqs: [
      {
        q: 'How does the milestone-based escrow payment work?',
        a: 'Your project funds are deposited into a secure escrow account—never released upfront to the installer. Payments are disbursed stage by stage (e.g. 30% after site assessment & hardware delivery, 40% after panel/inverter mounting, 20% after electrical commissioning, 10% after 7-day burn-in inspection) only when you approve the verified deliverables.',
      },
      {
        q: 'What happens if there is an installation defect or delay?',
        a: 'Because funds are held in escrow, your capital is 100% protected. If an installer fails to meet technical standards or schedule milestones, Sunlit’s engineering resolution team intervenes. Work must pass inspection before any payout is triggered.',
      },
      {
        q: 'What payment methods are supported in Nigeria?',
        a: 'We support instant bank transfers, corporate NIBSS payments, and debit card transactions via our secure payment gateway in Nigerian Naira (₦). All transactions produce formal digital tax receipts and milestone release certificates.',
      },
      {
        q: 'Are there hidden fees or surprise charges?',
        a: 'None. Sunlit operates with complete pricing transparency. The project bid you accept contains the total itemized cost of hardware, cabling, balance of system, and labor. Marketplace service fees are clearly broken down upfront.',
      },
    ],
  },
  {
    id: 'solar',
    label: 'System Sizing & Equipment',
    faqs: [
      {
        q: 'Why are LiFePO4 batteries recommended over lead-acid/tubular batteries?',
        a: 'Lithium Iron Phosphate (LiFePO4) batteries provide 6,000+ continuous cycles at 80%–90% Depth of Discharge (DoD) with a 10–15 year lifespan in Nigerian tropical climates. Lead-acid batteries degrade rapidly within 1–3 years at 50% DoD, costing far more in frequent replacements.',
      },
      {
        q: 'How much does a complete solar system cost in Nigeria?',
        a: 'Residential systems (3kVA–5kVA with LiFePO4 storage) typically range from ₦2.5M to ₦6.5M. Larger residential and duplex systems (10kVA–15kVA) range from ₦7M to ₦16M. Commercial & industrial systems (20kVA–100kVA+) range from ₦18M to ₦90M+. Sunlit enables you to receive 3+ competitive bids for exact market pricing.',
      },
      {
        q: 'How long does delivery and commissioning take?',
        a: 'Residential rooftop systems are typically commissioned within 2 to 4 weeks from bid sign-off. Commercial installations (20kVA–100kVA) take approximately 3 to 6 weeks depending on structural engineering and permitting requirements.',
      },
      {
        q: 'What warranties come with installed equipment?',
        a: 'Tier-1 solar panels carry 25-year linear performance warranties. Pure sine wave hybrid inverters carry 2 to 5 years manufacturer warranty, and LiFePO4 battery banks carry 5 to 10 years manufacturer warranty. In addition, certified installers provide a minimum 1-year workmanship guarantee.',
      },
    ],
  },
  {
    id: 'location',
    label: 'Locations & Expansion',
    faqs: [
      {
        q: 'Which Nigerian states and cities are currently active?',
        a: 'We actively operate in Lagos State (Lekki, Victoria Island, Ikeja, Ikoyi, Surulere, Ajah, Yaba), Abuja FCT (Maitama, Wuse, Garki, Asokoro, Gwarinpa), and Ogun State (Abeokuta, Ota, Sagamu, Mowe/Ibafo), with active expansion across Port Harcourt, Ibadan, Kano, and nationwide.',
      },
      {
        q: 'Can I request a solar installation in a remote or off-grid area?',
        a: 'Yes. Sunlit connects project owners with specialized off-grid and agricultural solar EPC contractors capable of deploying mini-grids, solar water pumps, and remote battery storage systems across Nigeria.',
      },
    ],
  },
  {
    id: 'installers',
    label: 'For Installers & EPCs',
    faqs: [
      {
        q: 'How do solar installers and EPC contractors join Sunlit?',
        a: 'Installers apply via the Sunlit installer onboarding portal. Our operations team audits your CAC registration, engineering certifications (NEMSA/COREN), safety records, and past portfolio. Approved contractors gain access to verified project RFQs in their territory.',
      },
      {
        q: 'How are installer milestone payouts protected?',
        a: 'When a customer awards a project, 100% of project funds are pre-funded into escrow. Once you submit milestone proof of work and the client signs off, funds are released to your corporate account within 24 business hours—eliminating non-payment risks.',
      },
    ],
  },
];

export default function FAQPageClient() {
  const [activeCategory, setActiveCategory] = useState('platform');
  const [openFAQs, setOpenFAQs] = useState<Set<string>>(new Set(['platform-0']));

  const toggleFAQ = (id: string) => {
    setOpenFAQs(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const activeGroup = FAQ_CATEGORIES.find(c => c.id === activeCategory) || FAQ_CATEGORIES[0];

  return (
    <main className="bg-[#FFF8F5] text-[#1F1B17] font-sans min-h-screen pt-12 pb-24 antialiased">
      {/* ── 1. Hero Section ────────────────────────────────────────────── */}
      <section
        aria-label="FAQ hero"
        className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 pt-10 pb-12 sm:pb-16 text-center"
      >
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#ECEFE6] rounded-full border border-[#BFCABA]/50">
            <span className="font-sans font-bold text-xs uppercase tracking-wider text-[#00490E]">
              Help Center
            </span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-[#1F1B17] tracking-tight leading-tight">
            Frequently Asked Questions
          </h1>

          <p className="font-sans text-sm sm:text-base lg:text-lg text-[#40493D] leading-relaxed">
            Everything you need to know about Sunlit Energy, solar installations, payments, and the marketplace.
          </p>
        </div>
      </section>

      {/* ── 2. FAQ Body ────────────────────────────────────────────────── */}
      <section className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Mobile Category Selector (Horizontal Scroll Pill Bar) */}
          <div className="lg:hidden w-full overflow-x-auto no-scrollbar pb-2">
            <div className="flex gap-2 min-w-max">
              {FAQ_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? 'bg-[#00490E] text-white shadow-sm'
                      : 'bg-white text-[#40493D] border border-[#E5E0DD] hover:bg-[#F6ECE6]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Category Sidebar */}
          <nav
            aria-label="FAQ categories"
            className="hidden lg:block lg:col-span-4 bg-white rounded-[20px] p-3 border border-[#E5E0DD] shadow-sm sticky top-28 space-y-1"
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#707A6C] px-3 py-2 block">
              Categories
            </span>
            {FAQ_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                  activeCategory === cat.id
                    ? 'bg-[#ECEFE6] text-[#00490E] font-bold shadow-xs'
                    : 'text-[#40493D] hover:bg-[#FFF8F5] hover:text-[#1F1B17]'
                }`}
              >
                <span>{cat.label}</span>
                <span className="text-[10px] font-mono text-[#707A6C] bg-white px-2 py-0.5 rounded-full border border-[#E5E0DD]">
                  {cat.faqs.length}
                </span>
              </button>
            ))}
          </nav>

          {/* FAQ Accordion List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex justify-between items-baseline mb-2">
              <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1F1B17]">
                {activeGroup.label}
              </h2>
              <span className="text-xs font-medium text-[#707A6C]">
                {activeGroup.faqs.length} Questions
              </span>
            </div>

            <div className="space-y-3">
              {activeGroup.faqs.map((faq, i) => {
                const id = `${activeCategory}-${i}`;
                const isOpen = openFAQs.has(id);
                return (
                  <div
                    key={id}
                    className={`bg-white rounded-[16px] sm:rounded-[20px] border transition-all duration-200 overflow-hidden ${
                      isOpen
                        ? 'border-[#00490E]/30 shadow-md ring-1 ring-[#00490E]/10'
                        : 'border-[#E5E0DD] shadow-xs hover:border-[#BFCABA]'
                    }`}
                  >
                    <button
                      onClick={() => toggleFAQ(id)}
                      aria-expanded={isOpen}
                      className="w-full flex items-center justify-between p-4 sm:p-5 text-left gap-4 bg-transparent cursor-pointer group"
                    >
                      <span className="font-display font-semibold text-sm sm:text-base text-[#1F1B17] group-hover:text-[#00490E] transition-colors leading-snug">
                        {faq.q}
                      </span>
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
                          isOpen ? 'bg-[#00490E] text-white rotate-180' : 'bg-[#ECEFE6] text-[#00490E]'
                        }`}
                      >
                        <ChevronDown size={16} />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 border-t border-[#E5E0DD]/60">
                        <p className="font-sans text-xs sm:text-sm text-[#40493D] leading-relaxed pt-3">
                          {faq.a}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Contact Support CTA ─────────────────────────────────────── */}
      <section
        aria-label="Contact support"
        className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 pt-8 pb-12"
      >
        <div className="bg-white rounded-[24px] border border-[#E5E0DD] p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-sm">
          <div className="w-12 h-12 rounded-full bg-[#ECEFE6] text-[#00490E] flex items-center justify-center mx-auto mb-4">
            <MessageCircle size={24} />
          </div>

          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1F1B17] mb-2">
            Still Have Questions?
          </h2>

          <p className="font-sans text-xs sm:text-sm text-[#40493D] max-w-md mx-auto mb-6 leading-relaxed">
            Our engineering and customer support team is ready to help. Whether you&apos;re a homeowner, commercial business, or certified installer — we&apos;d love to connect.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/contact"
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#00490E] hover:bg-[#003006] text-white font-sans font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2"
            >
              Contact Support
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/waitlist"
              className="w-full sm:w-auto px-7 py-3 rounded-full border border-[#E5E0DD] hover:bg-[#F6ECE6] text-[#1F1B17] font-sans font-medium text-xs sm:text-sm transition-all flex items-center justify-center"
            >
              Join Platform Waitlist
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
