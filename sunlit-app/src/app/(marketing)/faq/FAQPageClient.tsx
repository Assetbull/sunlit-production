'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowRight, MessageCircle } from 'lucide-react';

const FAQ_CATEGORIES = [
  {
    id: 'platform',
    label: 'Platform & How It Works',
    faqs: [
      {
        q: 'What is Sunlit Energy?',
        a: "Sunlit Energy is Nigeria's premier solar energy marketplace — a technology platform that connects homeowners, businesses, and commercial operators with vetted solar installers, suppliers, and financing partners. Every project is managed end-to-end with escrow-protected payments and real-time tracking.",
      },
      {
        q: 'How does Sunlit Energy verify installers?',
        a: 'Every installer undergoes a rigorous multi-stage vetting process: business registration verification, technical certification checks, equipment supplier audits, reference verification with previous clients, and sample installation review. Only verified professionals appear on our platform.',
      },
      {
        q: 'Is Sunlit Energy a solar installation company?',
        a: "No. Sunlit Energy is a marketplace and technology platform. We do not install solar panels ourselves. Instead, we connect you with Nigeria's best certified solar professionals, manage the procurement process, and protect your payments through our escrow system.",
      },
      {
        q: 'How does the bidding process work?',
        a: 'After you submit your project requirements, qualified installers from our vetted network review your requirements and submit competitive bids. You can compare bids side by side, review installer profiles, ratings, and past projects, then choose the best fit. Our AI system also highlights recommended matches.',
      },
    ],
  },
  {
    id: 'payments',
    label: 'Payments & Escrow',
    faqs: [
      {
        q: 'What happens to my money if something goes wrong?',
        a: "Your funds are held in a secure escrow account — not paid to the installer upfront. Payments are released milestone-by-milestone only after you verify and approve completed work at each stage. If a dispute arises, our resolution team intervenes and you're protected from loss.",
      },
      {
        q: 'When does an installer get paid?',
        a: 'Installers are paid in milestones as work is completed and verified by you. For example: 30% after site assessment, 40% after panel installation, 20% after electrical commissioning, 10% after final inspection. The exact milestone structure is agreed upon in the contract before work begins.',
      },
      {
        q: 'What payment methods are supported?',
        a: 'We support bank transfers, debit cards, and online payment through our Paystack-powered gateway. All payments are processed in Nigerian Naira (₦) and held securely in our escrow system until milestone completion is confirmed.',
      },
      {
        q: 'Are there any hidden fees?',
        a: 'Sunlit Energy charges a transparent marketplace service fee on successful project completions. This fee is clearly disclosed before you commit to any project. There are no hidden charges, no surprises.',
      },
    ],
  },
  {
    id: 'solar',
    label: 'Solar Systems & Technology',
    faqs: [
      {
        q: 'What types of solar systems does Sunlit support?',
        a: "We support all system types: grid-tied, off-grid, hybrid, and solar-plus-storage. Whether you're a homeowner wanting backup power or a business looking to cut electricity costs significantly, our installer network covers every configuration.",
      },
      {
        q: 'How long does installation take?',
        a: 'Most residential systems are installed within 2–6 weeks from bid acceptance. Timeline depends on system size, component availability, and permitting requirements in your area. Your project dashboard includes estimated delivery windows for every milestone.',
      },
      {
        q: 'How much does solar cost in Nigeria?',
        a: 'Solar system costs vary significantly based on system size, location, and components. A basic 3kVA residential system typically starts from ₦1.5M–₦3M, while commercial systems can range from ₦10M to ₦500M+. The Sunlit marketplace lets you get competitive bids and compare real pricing transparently.',
      },
      {
        q: 'What warranty coverage comes with installed systems?',
        a: 'Warranties depend on the specific equipment and installer. Typically, solar panels carry 25-year performance warranties from manufacturers, inverters carry 2–5 year warranties, and installation labor is covered by 1–2 year installer warranties. All warranty terms are documented in your Sunlit contract.',
      },
    ],
  },
  {
    id: 'location',
    label: 'Locations & Availability',
    faqs: [
      {
        q: 'Is Sunlit Energy available outside Lagos?',
        a: "We're launching in Lagos, Ogun, and Abuja in our initial phase. We are actively expanding to all 36 states by Q4 2026. Join our waitlist and select your state — you'll be notified as soon as service arrives in your area.",
      },
      {
        q: 'Which Lagos areas do you currently serve?',
        a: 'Our initial Lagos coverage includes Lekki, Victoria Island, Ikeja, Ajah, Ikoyi, Surulere, and Yaba. Additional areas are being added continuously as our installer network expands across the state.',
      },
      {
        q: 'Can I use Sunlit for a property outside a major city?',
        a: "Yes — if we have verified installers in your area, you can receive bids. For areas not yet on our network, you can still join the waitlist and we'll expand to match demand. Off-grid solar for remote areas is a priority expansion area.",
      },
    ],
  },
  {
    id: 'installers',
    label: 'For Installers & EPCs',
    faqs: [
      {
        q: 'How do I join Sunlit as a solar installer?',
        a: "Apply through our installer registration portal. You'll go through our vetting process which includes: business registration verification, NAFDAC/NESREA certification checks, equipment quality assessment, portfolio review, and a background verification. Successful applicants gain access to our project marketplace.",
      },
      {
        q: 'How do I get paid as an installer?',
        a: 'Installers are paid milestone-by-milestone through our escrow system. After completing each milestone, you submit proof of work (photos, videos, reports). The project owner reviews and approves — payment is then released automatically within 24 hours.',
      },
      {
        q: 'What does Sunlit charge installers?',
        a: 'We charge a transparent commission on successful project completions. There are no upfront fees to join or bid on projects. Commissions are calculated on total project value and disclosed clearly before any commitment.',
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
