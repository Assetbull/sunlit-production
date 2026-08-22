import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Mail, Clock, Users, Building2, ArrowRight, MessageCircle } from 'lucide-react';
import { ContactForm } from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact Sunlit Energy — Nigeria Solar Energy Marketplace',
  description:
    'Get in touch with Sunlit Energy. Whether you\'re a homeowner, business, installer, or investor — our team is ready to help you start your solar journey.',
  keywords:
    'contact sunlit energy, solar energy lagos contact, solar marketplace support, solar installation inquiry nigeria',
  alternates: { canonical: 'https://sunlit.energy/contact' },
  openGraph: {
    title: 'Contact Us — Sunlit Energy Nigeria',
    description: 'Get in touch with Nigeria\'s premier solar energy marketplace.',
    url: 'https://sunlit.energy/contact',
    siteName: 'Sunlit Energy',
    locale: 'en_NG',
    type: 'website',
  },
};

const CONTACT_OPTIONS = [
  {
    icon: MessageCircle,
    title: 'General Enquiries',
    desc: 'Questions about the platform, services, or how Sunlit works.',
    action: 'hello@sunlit.energy',
    type: 'email',
  },
  {
    icon: Users,
    title: 'For Homeowners & Businesses',
    desc: 'Get help starting your solar project or submitting an RFQ.',
    action: 'Join Waitlist',
    type: 'link',
    href: '/waitlist',
  },
  {
    icon: Building2,
    title: 'For Installers & EPCs',
    desc: 'Join our vetted installer network and access project opportunities.',
    action: 'installer@sunlit.energy',
    type: 'email',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact Sunlit Energy',
  url: 'https://sunlit.energy/contact',
  publisher: {
    '@type': 'Organization',
    name: 'Sunlit Energy',
    url: 'https://sunlit.energy',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lagos',
      addressCountry: 'NG',
    },
  },
};

export default function ContactPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main style={{ background: '#f9f9f6', minHeight: '100vh', paddingTop: 0 }}>

        {/* ── Hero ──────────────────────────────────────────────────── */}
        <section
          aria-label="Contact hero"
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
                Get in Touch
              </span>
            </div>
            <h1 style={{
              fontFamily: 'Manrope, sans-serif', fontWeight: 800,
              fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', color: '#1a1c1b',
              letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: '1.25rem',
            }}>
              We&apos;d Love to Hear from You
            </h1>
            <p style={{
              fontFamily: 'Inter, sans-serif', fontSize: '1.0625rem',
              color: '#40493d', lineHeight: 1.7,
            }}>
              Whether you&apos;re ready to start a solar project, have questions about the platform, or want to join our installer network — our team is here.
            </p>
          </div>
        </section>

        {/* ── Contact Options ───────────────────────────────────────── */}
        <section aria-label="Contact options" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#f7fbf1]">
          <div className="max-w-[1100px] mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 sm:mb-16">
              {CONTACT_OPTIONS.map((opt) => (
                <div
                  key={opt.title}
                  className="bg-[#fff8f5] rounded-[18px] p-6 sm:p-8 border border-[#BFCABA]/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#00490e]/10 flex items-center justify-center mb-5 text-[#00490e]">
                      <opt.icon size={24} />
                    </div>
                    <h3 className="font-display font-bold text-lg text-[#1a1c1b] mb-2">
                      {opt.title}
                    </h3>
                    <p className="font-sans text-xs sm:text-sm text-[#40493d] leading-relaxed mb-5">
                      {opt.desc}
                    </p>
                  </div>
                  {opt.type === 'email' ? (
                    <a
                      href={`mailto:${opt.action}`}
                      className="inline-flex items-center gap-2 font-sans text-xs sm:text-sm font-semibold text-[#00490e] hover:underline"
                    >
                      <Mail size={16} /> {opt.action}
                    </a>
                  ) : (
                    <Link
                      href={opt.href!}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#00490e] hover:bg-[#003006] text-white font-sans font-semibold text-xs sm:text-sm transition-all w-fit"
                    >
                      {opt.action} <ArrowRight size={14} />
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Main Contact Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">

              {/* Contact Info */}
              <div>
                <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1.5rem', color: '#1a1c1b', marginBottom: '2rem' }}>
                  Our Information
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fff8f5', border: '1px solid rgba(191,202,186,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <MapPin size={20} color="#00490e" />
                    </div>
                    <div>
                      <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 600, fontSize: '0.9375rem', color: '#1a1c1b', marginBottom: '0.25rem' }}>
                        Headquarters
                      </div>
                      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', color: '#40493d' }}>
                        Lagos, Nigeria
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fff8f5', border: '1px solid rgba(191,202,186,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Mail size={20} color="#00490e" />
                    </div>
                    <div>
                      <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 600, fontSize: '0.9375rem', color: '#1a1c1b', marginBottom: '0.25rem' }}>
                        Email
                      </div>
                      <a href="mailto:hello@sunlit.energy" style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', color: '#00490e', textDecoration: 'none' }}>
                        hello@sunlit.energy
                      </a>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fff8f5', border: '1px solid rgba(191,202,186,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Clock size={20} color="#00490e" />
                    </div>
                    <div>
                      <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 600, fontSize: '0.9375rem', color: '#1a1c1b', marginBottom: '0.25rem' }}>
                        Response Time
                      </div>
                      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', color: '#40493d' }}>
                        Within 24 hours on business days
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{
                  marginTop: '2.5rem', padding: '1.5rem',
                  background: '#fff8f5', borderRadius: '14px',
                  border: '1px solid rgba(191,202,186,0.4)',
                }}>
                  <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#00490e', marginBottom: '0.5rem' }}>
                    Early Access Program
                  </div>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', color: '#40493d', lineHeight: 1.6, marginBottom: '1rem' }}>
                    Sunlit Energy is currently in early access. Join the waitlist to be first in line when we launch in your area.
                  </p>
                  <Link
                    href="/waitlist"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                      fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600,
                      color: '#00490e', textDecoration: 'none',
                    }}
                  >
                    Join Waitlist <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Simple Inquiry Form */}
              <div>
                <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1.5rem', color: '#1a1c1b', marginBottom: '2rem' }}>
                  Send Us a Message
                </h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
