'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, User, Award, ShieldCheck } from 'lucide-react';

const TESTIMONIALS = [
  {
    quote: "Sunlit Energy solved our procurement risks. Before the marketplace, choosing an installer was a gamble. Comparing multiple binding proposals side-by-side and locking funds in milestone-based escrow gave our board total confidence.",
    author: "Femi Adesina",
    role: "Managing Director, Heritage Mall",
    verified: true,
  },
  {
    quote: "The system is built for technical accountability. As an installer, I get structured RFQs that allow us to quote accurately. The milestone inspection process is transparent and payment release is prompt upon verification.",
    author: "Nneka Okoye",
    role: "Senior Project Engineer, Apex Solar Nigeria",
    verified: true,
  },
  {
    quote: "We eliminated 80% of our daily diesel expenses using a residential microgrid configured on Sunlit. The independent technical auditing team ensured that the installer met high structural and electrical compliance standards.",
    author: "Tunde Bakare",
    role: "Resident, Parkview Estate",
    verified: true,
  },
];

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const next = () => {
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prev = () => {
    setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const current = TESTIMONIALS[activeIndex];

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      style={{
        padding: '6rem 1.5rem',
        background: '#fff',
        borderBottom: '1px solid rgba(187, 202, 196, 0.12)',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(0, 107, 92, 0.08)', borderRadius: '9999px',
            padding: '0.375rem 1rem', marginBottom: '1.25rem',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00490e', display: 'inline-block' }} />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 600, color: '#00490e', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Verification &amp; Reviews
            </span>
          </div>
          <h2 id="testimonials-heading" style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', color: '#1a1c1b', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
            Enterprise Trust Verified
          </h2>
        </div>

        {/* Carousel Container */}
        <div
          style={{
            background: '#f9f9f6',
            border: '1px solid rgba(187, 202, 196, 0.12)',
            borderRadius: '24px',
            padding: '3rem 2.5rem',
            boxShadow: '0 4px 20px rgba(7, 54, 66, 0.03)',
            position: 'relative',
            minHeight: '260px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* Quote mark icon replacement */}
          <div style={{
            fontFamily: 'Georgia, serif', fontSize: '4rem', color: 'rgba(0, 107, 92, 0.15)',
            lineHeight: 1, position: 'absolute', top: '1rem', left: '1.5rem', userSelect: 'none',
          }}>
            “
          </div>

          <div style={{ position: 'relative', zIndex: 2 }}>
            <p style={{
              fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1rem, 2.5vw, 1.1875rem)',
              color: '#1a1c1b', lineHeight: 1.65, fontWeight: 500, fontStyle: 'italic',
              marginBottom: '2rem', textIndent: '0.5rem',
            }}>
              {current.quote}
            </p>
          </div>

          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderTop: '1px solid rgba(187, 202, 196, 0.12)', paddingTop: '1.5rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0,107,92,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <User size={20} color="#00490e" />
              </div>
              <div>
                <div style={{
                  fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '0.9375rem',
                  color: '#1a1c1b', display: 'flex', alignItems: 'center', gap: '0.375rem',
                }}>
                  {current.author}
                  {current.verified && (
                    <span
                      title="Verified Contract Party"
                      style={{ display: 'inline-flex', alignItems: 'center' }}
                    >
                      <ShieldCheck size={14} color="#00490e" fill="rgba(0, 107, 92, 0.1)" />
                    </span>
                  )}
                </div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', color: '#707a6c' }}>
                  {current.role}
                </div>
              </div>
            </div>

            {/* Arrows */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={prev}
                aria-label="Previous testimonial"
                style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  border: '1px solid rgba(187, 202, 196, 0.2)', background: '#fff',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(7, 54, 66, 0.02)', transition: 'all 150ms ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#00490e'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(187, 202, 196, 0.2)'; }}
              >
                <ChevronLeft size={18} color="#707a6c" />
              </button>
              <button
                onClick={next}
                aria-label="Next testimonial"
                style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  border: '1px solid rgba(187, 202, 196, 0.2)', background: '#fff',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(7, 54, 66, 0.02)', transition: 'all 150ms ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#00490e'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(187, 202, 196, 0.2)'; }}
              >
                <ChevronRight size={18} color="#707a6c" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
