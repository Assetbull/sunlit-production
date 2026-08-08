'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowRight, Search, MessageCircle } from 'lucide-react';

const FAQ_CATEGORIES = [
  {
    id: 'platform',
    label: 'Platform & How It Works',
    faqs: [
      {
        q: 'What is Sunlit Energy?',
        a: 'Sunlit Energy is Nigeria\'s premier solar energy marketplace — a technology platform that connects homeowners, businesses, and commercial operators with vetted solar installers, suppliers, and financing partners. Every project is managed end-to-end with escrow-protected payments and real-time tracking.',
      },
      {
        q: 'How does Sunlit Energy verify installers?',
        a: 'Every installer undergoes a rigorous multi-stage vetting process: business registration verification, technical certification checks, equipment supplier audits, reference verification with previous clients, and sample installation review. Only verified professionals appear on our platform.',
      },
      {
        q: 'Is Sunlit Energy a solar installation company?',
        a: 'No. Sunlit Energy is a marketplace and technology platform. We do not install solar panels ourselves. Instead, we connect you with Nigeria\'s best certified solar professionals, manage the procurement process, and protect your payments through our escrow system.',
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
        a: 'Your funds are held in a secure escrow account — not paid to the installer upfront. Payments are released milestone-by-milestone only after you verify and approve completed work at each stage. If a dispute arises, our resolution team intervenes and you\'re protected from loss.',
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
        a: 'We support all system types: grid-tied, off-grid, hybrid, and solar-plus-storage. Whether you\'re a homeowner wanting backup power or a business looking to cut electricity costs significantly, our installer network covers every configuration.',
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
        a: 'We\'re launching in Lagos, Ogun, and Abuja in our initial phase. We are actively expanding to all 36 states by Q4 2026. Join our waitlist and select your state — you\'ll be notified as soon as service arrives in your area.',
      },
      {
        q: 'Which Lagos areas do you currently serve?',
        a: 'Our initial Lagos coverage includes Lekki, Victoria Island, Ikeja, Ajah, Ikoyi, Surulere, and Yaba. Additional areas are being added continuously as our installer network expands across the state.',
      },
      {
        q: 'Can I use Sunlit for a property outside a major city?',
        a: 'Yes — if we have verified installers in your area, you can receive bids. For areas not yet on our network, you can still join the waitlist and we\'ll expand to match demand. Off-grid solar for remote areas is a priority expansion area.',
      },
    ],
  },
  {
    id: 'installers',
    label: 'For Installers & EPCs',
    faqs: [
      {
        q: 'How do I join Sunlit as a solar installer?',
        a: 'Apply through our installer registration portal. You\'ll go through our vetting process which includes: business registration verification, NAFDAC/NESREA certification checks, equipment quality assessment, portfolio review, and a background verification. Successful applicants gain access to our project marketplace.',
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
  const [openFAQs, setOpenFAQs] = useState<Set<string>>(new Set());

  const toggleFAQ = (id: string) => {
    setOpenFAQs(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const activeGroup = FAQ_CATEGORIES.find(c => c.id === activeCategory)!;

  return (
    <main style={{ background: '#f9f9f6', minHeight: '100vh', paddingTop: '80px' }}>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section
        aria-label="FAQ hero"
        style={{
          padding: '6rem 1.5rem 4rem',
          background: 'linear-gradient(180deg, #f4f4f1 0%, #f9f9f6 100%)',
          textAlign: 'center',
          borderBottom: '1px solid rgba(191, 202, 186, 0.2)',
        }}
      >
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(0,73,14,0.08)', borderRadius: '9999px',
            padding: '0.375rem 1rem', marginBottom: '1.5rem',
          }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 600, color: '#00490e', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Help Center
            </span>
          </div>
          <h1 style={{
            fontFamily: 'Manrope, sans-serif', fontWeight: 800,
            fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', color: '#1a1c1b',
            letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: '1.25rem',
          }}>
            Frequently Asked Questions
          </h1>
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: '1.0625rem',
            color: '#40493d', lineHeight: 1.7,
          }}>
            Everything you need to know about Sunlit Energy, solar installations, payments, and the marketplace.
          </p>
        </div>
      </section>

      {/* ── FAQ Body ─────────────────────────────────────────────── */}
      <section style={{ padding: '4rem 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '3rem', alignItems: 'start' }}>

          {/* Category Sidebar */}
          <nav
            aria-label="FAQ categories"
            style={{
              background: '#fff', borderRadius: '16px', padding: '1rem',
              border: '1px solid rgba(191, 202, 186, 0.2)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
              position: 'sticky', top: '96px',
            }}
          >
            {FAQ_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '0.75rem 1rem', borderRadius: '10px', border: 'none',
                  fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: activeCategory === cat.id ? 600 : 500,
                  color: activeCategory === cat.id ? '#00490e' : '#40493d',
                  background: activeCategory === cat.id ? 'rgba(0,73,14,0.08)' : 'transparent',
                  cursor: 'pointer', transition: 'all 150ms ease',
                  marginBottom: '0.25rem',
                }}
              >
                {cat.label}
              </button>
            ))}
          </nav>

          {/* FAQ Accordion */}
          <div>
            <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1.375rem', color: '#1a1c1b', marginBottom: '1.5rem' }}>
              {activeGroup.label}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {activeGroup.faqs.map((faq, i) => {
                const id = `${activeCategory}-${i}`;
                const isOpen = openFAQs.has(id);
                return (
                  <div
                    key={id}
                    style={{
                      background: '#fff', borderRadius: '14px',
                      border: `1px solid ${isOpen ? 'rgba(0,73,14,0.2)' : 'rgba(191, 202, 186, 0.2)'}`,
                      boxShadow: isOpen ? '0 4px 16px rgba(0,73,14,0.06)' : '0 2px 8px rgba(0,0,0,0.04)',
                      transition: 'all 250ms ease', overflow: 'hidden',
                    }}
                  >
                    <button
                      onClick={() => toggleFAQ(id)}
                      aria-expanded={isOpen}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '1.375rem 1.5rem', background: 'transparent', border: 'none',
                        cursor: 'pointer', textAlign: 'left', gap: '1rem',
                      }}
                    >
                      <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 600, fontSize: '1rem', color: '#1a1c1b', lineHeight: 1.4 }}>
                        {faq.q}
                      </span>
                      <ChevronDown
                        size={20}
                        color="#00490e"
                        style={{ flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 250ms ease' }}
                      />
                    </button>
                    {isOpen && (
                      <div style={{ padding: '0 1.5rem 1.5rem', borderTop: '1px solid rgba(191, 202, 186, 0.2)' }}>
                        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', color: '#40493d', lineHeight: 1.7, paddingTop: '1rem' }}>
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

      {/* ── Still have questions? ─────────────────────────────────── */}
      <section aria-label="Contact support" style={{ padding: '4rem 1.5rem', background: '#fff' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(0,73,14,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <MessageCircle size={28} color="#00490e" />
          </div>
          <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: '1.875rem', color: '#1a1c1b', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
            Still Have Questions?
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: '#40493d', lineHeight: 1.65, marginBottom: '2rem' }}>
            Our team is ready to help. Whether you&apos;re a homeowner, business, or installer — we&apos;d love to hear from you.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/contact"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.875rem 1.75rem', borderRadius: '9999px',
                background: 'linear-gradient(135deg, #00490e 0%, #0f631b 100%)',
                color: '#fff', fontFamily: 'Inter, sans-serif', fontWeight: 700,
                fontSize: '0.9375rem', textDecoration: 'none',
              }}
            >
              Contact Support <ArrowRight size={16} />
            </Link>
            <Link
              href="/waitlist"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.875rem 1.75rem', borderRadius: '9999px',
                border: '1.5px solid rgba(191, 202, 186, 0.5)',
                color: '#1a1c1b', fontFamily: 'Inter, sans-serif', fontWeight: 600,
                fontSize: '0.9375rem', textDecoration: 'none', background: 'transparent',
              }}
            >
              Join Waitlist
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
