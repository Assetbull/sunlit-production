'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Stitch Bento Grid sections from canonical screen 82a10efb
export function WhatWeDo() {
  return (
    <section
      id="platform"
      style={{
        background: '#fff8f5',
        padding: '96px 80px',
      }}
    >
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ maxWidth: '680px', marginBottom: '56px' }}>
          <h2
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(32px, 3vw, 48px)',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: '#1f1b17',
              marginBottom: '16px',
            }}
          >
            One Clear Platform for Every Project Phase
          </h2>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '18px',
              lineHeight: 1.65,
              color: '#40493d',
              margin: 0,
            }}
          >
            Plan and install your solar system with complete clarity. From initial load estimation to final commissioning, Sunlit keeps your project organized and escrow-protected.
          </p>
        </div>

        {/* Bento Grid */}
        <div
          className="bento-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridTemplateRows: 'auto auto',
            gap: '20px',
          }}
        >
          {/* Card 1: Vetted Marketplace (2×2) with Engineered Motion */}
          <div
            className="bento-large bento-card-motion"
            style={{
              gridColumn: 'span 2',
              gridRow: 'span 2',
              background: '#fff',
              borderRadius: '20px',
              padding: '32px',
              border: '1px solid rgba(230, 225, 215, 0.7)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              minHeight: '280px',
              transition: 'all 400ms cubic-bezier(0.2, 0, 0, 1)',
            }}
          >
            <div className="bento-inner-content" style={{ position: 'relative', zIndex: 1, transition: 'transform 400ms cubic-bezier(0.2, 0, 0, 1)' }}>
              <div
                className="bento-icon-wrapper"
                style={{
                  width: '48px',
                  height: '48px',
                  background: 'rgba(0, 73, 14, 0.08)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px',
                  transition: 'all 400ms cubic-bezier(0.2, 0, 0, 1)',
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="#00490e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="9 22 9 12 15 12 15 22" stroke="#00490e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 700,
                  fontSize: '22px',
                  color: '#1f1b17',
                  marginBottom: '12px',
                }}
              >
                Vetted Marketplace
              </h3>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '15px',
                  lineHeight: 1.65,
                  color: '#40493d',
                  maxWidth: '340px',
                }}
              >
                Access a curated network of tier-one solar installers, engineers, and
                suppliers. Every professional undergoes rigorous compliance and quality
                verification.
              </p>
            </div>
            {/* Decorative bg element with subtle shift */}
            <div
              className="bento-bg-accent"
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '200px',
                height: '150px',
                background: 'rgba(204, 235, 145, 0.12)',
                borderRadius: '40px 0 0 0',
                transition: 'all 400ms cubic-bezier(0.2, 0, 0, 1)',
              }}
            />
          </div>

          {/* Card 2: CrewLink */}
          <div
            className="bento-sm bento-card-motion"
            style={{
              gridColumn: 'span 1',
              background: '#f0ede3',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid rgba(230, 225, 215, 0.7)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '120px',
              transition: 'all 400ms cubic-bezier(0.2, 0, 0, 1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <h3
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 700,
                  fontSize: '17px',
                  color: '#1f1b17',
                  margin: 0,
                }}
              >
                CrewLink
              </h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#40493d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="9" cy="7" r="4" stroke="#40493d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#40493d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#40493d', marginBottom: '12px' }}>
              Real-time team coordination and site tracking.
            </p>
            <Link
              href="/services"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                color: '#00490e',
                textDecoration: 'none',
              }}
            >
              Explore <ArrowRight size={14} />
            </Link>
          </div>

          {/* Card 3: Secure Escrow */}
          <div
            className="bento-sm bento-card-motion"
            style={{
              gridColumn: 'span 1',
              background: '#fff',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid rgba(230, 225, 215, 0.7)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '120px',
              transition: 'all 400ms cubic-bezier(0.2, 0, 0, 1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '17px', color: '#1f1b17', margin: 0 }}>
                Secure Escrow
              </h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="5" width="20" height="14" rx="2" stroke="#00490e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="2" y1="10" x2="22" y2="10" stroke="#00490e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#40493d', margin: 0 }}>
              Milestone-based payouts ensure funds are protected.
            </p>
          </div>

          {/* Card 4: Project Dashboard (spans 2 cols) */}
          <div
            className="bento-wide bento-card-motion"
            style={{
              gridColumn: 'span 2',
              background: '#fff',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid rgba(230, 225, 215, 0.7)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              minHeight: '120px',
              overflow: 'hidden',
              transition: 'all 400ms cubic-bezier(0.2, 0, 0, 1)',
            }}
          >
            <div style={{ flex: '1', position: 'relative', zIndex: 1 }}>
              <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '17px', color: '#1f1b17', marginBottom: '8px' }}>
                Project Dashboard
              </h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: 1.5, color: '#40493d', margin: 0 }}>
                Track milestones, documentation, and communication in one unified view.
              </p>
            </div>
            {/* Miniature dashboard */}
            <div
              style={{
                flex: '1',
                background: '#f0ede3',
                borderRadius: '12px',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div style={{ height: '8px', background: 'rgba(230, 225, 215, 0.8)', borderRadius: '4px', width: '70%' }} />
              <div style={{ height: '8px', background: 'rgba(230, 225, 215, 0.8)', borderRadius: '4px', width: '50%' }} />
              <div
                style={{
                  height: '40px',
                  background: '#fff',
                  borderRadius: '8px',
                  marginTop: '4px',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '6px',
                  gap: '4px',
                }}
              >
                {[0.3, 0.6, 1.0, 0.8].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: `${h * 100}%`,
                      background: `rgba(0, 73, 14, ${0.2 + h * 0.5})`,
                      borderRadius: '2px',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .bento-card-motion:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 36px rgba(0, 73, 14, 0.08) !important;
          border-color: rgba(0, 73, 14, 0.2) !important;
        }
        .bento-large:hover .bento-inner-content {
          transform: translateY(-2px);
        }
        .bento-large:hover .bento-icon-wrapper {
          background: rgba(0, 73, 14, 0.14) !important;
          transform: scale(1.05);
        }
        .bento-large:hover .bento-bg-accent {
          background: rgba(204, 235, 145, 0.25) !important;
        }

        @media (max-width: 1023px) {
          .bento-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .bento-large { grid-column: span 2 !important; grid-row: span 1 !important; }
          .bento-wide { grid-column: span 2 !important; }
          section { padding: 80px 40px !important; }
        }
        @media (max-width: 767px) {
          .bento-grid {
            grid-template-columns: 1fr !important;
          }
          .bento-large, .bento-sm, .bento-wide {
            grid-column: span 1 !important;
            grid-row: span 1 !important;
          }
          section { padding: 64px 20px !important; }
        }
      `}</style>
    </section>
  );
}
