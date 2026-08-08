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
  alternates: { canonical: 'https://sunlitenergy.com/contact' },
  openGraph: {
    title: 'Contact Us — Sunlit Energy Nigeria',
    description: 'Get in touch with Nigeria\'s premier solar energy marketplace.',
    url: 'https://sunlitenergy.com/contact',
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
    action: 'hello@sunlitenergy.com',
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
    action: 'installer@sunlitenergy.com',
    type: 'email',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact Sunlit Energy',
  url: 'https://sunlitenergy.com/contact',
  publisher: {
    '@type': 'Organization',
    name: 'Sunlit Energy',
    url: 'https://sunlitenergy.com',
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
        <section aria-label="Contact options" style={{ padding: '5rem 1.5rem', background: '#f9f9f6' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
              {CONTACT_OPTIONS.map((opt) => (
                <div
                  key={opt.title}
                  style={{
                    background: '#fff', borderRadius: '18px', padding: '2rem',
                    border: '1px solid rgba(191, 202, 186, 0.2)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                  }}
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0,73,14,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                    <opt.icon size={24} color="#00490e" />
                  </div>
                  <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1.125rem', color: '#1a1c1b', marginBottom: '0.5rem' }}>
                    {opt.title}
                  </h3>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', color: '#40493d', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                    {opt.desc}
                  </p>
                  {opt.type === 'email' ? (
                    <a
                      href={`mailto:${opt.action}`}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', fontWeight: 600,
                        color: '#00490e', textDecoration: 'none',
                      }}
                    >
                      <Mail size={16} /> {opt.action}
                    </a>
                  ) : (
                    <Link
                      href={opt.href!}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.625rem 1.25rem', borderRadius: '9999px',
                        background: 'linear-gradient(135deg, #00490e 0%, #0f631b 100%)',
                        color: '#fff', fontFamily: 'Inter, sans-serif', fontWeight: 600,
                        fontSize: '0.875rem', textDecoration: 'none',
                      }}
                    >
                      {opt.action} <ArrowRight size={14} />
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Main Contact Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '3rem' }}>

              {/* Contact Info */}
              <div>
                <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1.5rem', color: '#1a1c1b', marginBottom: '2rem' }}>
                  Our Information
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f4f4f1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f4f4f1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Mail size={20} color="#00490e" />
                    </div>
                    <div>
                      <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 600, fontSize: '0.9375rem', color: '#1a1c1b', marginBottom: '0.25rem' }}>
                        Email
                      </div>
                      <a href="mailto:hello@sunlitenergy.com" style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', color: '#00490e', textDecoration: 'none' }}>
                        hello@sunlitenergy.com
                      </a>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f4f4f1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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
                  background: 'rgba(0,73,14,0.06)', borderRadius: '14px',
                  border: '1px solid rgba(0,73,14,0.1)',
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
