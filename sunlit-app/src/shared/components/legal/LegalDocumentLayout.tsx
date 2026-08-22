'use client';

/**
 * LegalDocumentLayout — Stitch-Faithful Master Legal & Compliance Layout
 *
 * Stitch Source: 3dbbe6dd4b1a452fb2f808dfe1797c2c (Privacy Policy)
 * & 99811f6aee1045c28ce4876bd94f3cc4 (Terms)
 *
 * Features:
 * - Sticky desktop document navigator sidebar with scrollspy TOC
 * - Mobile document navigator drawer
 * - Document metadata pills (Version, Effective Date, Jurisdiction)
 * - Related Statutes & Key Definitions collapsible cards
 * - Download PDF / Print trigger
 * - Accessible section anchors & ContextualBackNav
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SunlitIcon } from '@/shared/components/ui/SunlitIcon';
import { ContextualBackNav } from '@/shared/components/navigation/ContextualBackNav';
import { LegalDocumentMetadata } from '@/lib/legal/legal-registry';

interface LegalDocumentLayoutProps {
  document: LegalDocumentMetadata;
  children?: React.ReactNode;
}

export function LegalDocumentLayout({ document, children }: LegalDocumentLayoutProps) {
  const [activeSection, setActiveSection] = useState<string>(document.sections[0]?.id || '');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const documentId = (id: string) => (typeof window !== 'undefined' ? window.document.getElementById(id) : null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;
      for (const section of document.sections) {
        const el = documentId(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [document.sections]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="bg-[#f7fbf1] text-[#191d17] min-h-screen flex flex-col antialiased selection:bg-[#cceb91] selection:text-[#131f00]">
      {/* Top Contextual Navigation */}
      <div className="pt-28 pb-4 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <ContextualBackNav href="/legal" label="Legal & Compliance Hub" maxWidth="none" padding="0" />
      </div>

      {/* Main Container */}
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-8 pb-20 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* =========================================================================
            STICKY DOCUMENT NAVIGATOR (DESKTOP SIDEBAR)
            ========================================================================= */}
        <aside className="hidden lg:block lg:col-span-4 sticky top-28 bg-[#fff8f5] rounded-[24px] p-6 border border-[#bfcaba]/40 shadow-sm space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] font-bold uppercase tracking-wider text-[#003006]">Document Navigator</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#bcf0b2]/50 text-[#003006]">
                v{document.version} Active
              </span>
            </div>
            <h3 className="font-[Manrope] text-lg font-bold text-[#003006]">{document.title}</h3>
            <p className="font-[Inter] text-sm text-[#41493e] mt-1">{document.jurisdiction}</p>
          </div>

          {/* Table of Contents */}
          <nav className="space-y-1 border-t border-[#eae1da] pt-4" aria-label="Table of Contents">
            <span className="text-xs font-bold uppercase tracking-wider text-[#707a6c] block mb-2 px-3">
              Table of Contents
            </span>
            {document.sections.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-[Inter] text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#cceb91] text-[#003006] font-bold shadow-sm'
                      : 'text-[#41493e] hover:bg-[#eae1da]/60 hover:text-[#003006]'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-[#eae1da] text-[#003006] text-xs font-bold flex items-center justify-center shrink-0">
                    {section.number}
                  </span>
                  <span className="truncate">{section.title}</span>
                </a>
              );
            })}
          </nav>

          {/* Related Statutes & Regulatory Reference */}
          {document.relatedStatutes && document.relatedStatutes.length > 0 && (
            <div className="border-t border-[#eae1da] pt-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#707a6c] block mb-2 px-1">
                Governing Statutes
              </span>
              <div className="space-y-2">
                {document.relatedStatutes.map((statute, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-[#f7fbf1] border border-[#bfcaba]/30 text-xs">
                    <p className="font-semibold text-[#003006] text-[13.5px]">{statute.name}</p>
                    <p className="text-xs text-[#525c4e] mt-0.5">{statute.citation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="border-t border-[#eae1da] pt-4 space-y-2">
            <button
              onClick={handlePrint}
              type="button"
              className="w-full py-2.5 px-4 rounded-xl bg-[#f7fbf1] hover:bg-[#eae1da] text-[#003006] border border-[#bfcaba]/40 font-[Inter] text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <SunlitIcon name="download" size={15} />
              Print / Save as PDF
            </button>
            <Link
              href="/legal/contact"
              className="w-full py-2.5 px-4 rounded-xl bg-[#001902] hover:bg-[#003006] text-white font-[Inter] text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <SunlitIcon name="mail" size={15} />
              Contact Legal & DPO
            </Link>
          </div>
        </aside>

        {/* =========================================================================
            DOCUMENT MAIN CONTENT
            ========================================================================= */}
        <main className="lg:col-span-8 bg-[#fff8f5] rounded-[24px] p-6 sm:p-10 border border-[#bfcaba]/40 shadow-sm">
          {/* Header */}
          <header className="mb-10 pb-8 border-b border-[#eae1da]">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#bcf0b2]/40 text-[#003006] text-xs font-bold uppercase tracking-wider mb-4">
              <SunlitIcon name="shield" size={13} />
              Authoritative Policy
            </div>
            <h1 className="font-[Manrope] text-3xl sm:text-4xl font-bold text-[#003006] mb-4 tracking-tight">
              {document.title}
            </h1>
            <p className="font-[Inter] text-base sm:text-lg text-[#41493e] leading-relaxed">
              {document.summary}
            </p>

            {/* Metadata Pills */}
            <div className="flex flex-wrap gap-2.5 mt-6 pt-4 border-t border-[#eae1da]/60">
              <span className="px-3 py-1 rounded-full bg-[#f7fbf1] border border-[#bfcaba]/40 text-xs font-medium text-[#41493e]">
                <strong>Last Updated:</strong> {document.lastUpdated}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#f7fbf1] border border-[#bfcaba]/40 text-xs font-medium text-[#41493e]">
                <strong>Version:</strong> {document.version}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#f7fbf1] border border-[#bfcaba]/40 text-xs font-medium text-[#41493e]">
                <strong>Jurisdiction:</strong> {document.jurisdiction}
              </span>
            </div>
          </header>

          {/* Sections Body */}
          {children ? (
            children
          ) : (
            <div className="space-y-12">
              {document.sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-32">
                  <h2 className="font-[Manrope] text-xl sm:text-2xl font-bold text-[#003006] mb-4 pb-2 border-b border-[#eae1da] flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-[#cceb91] text-[#003006] text-xs font-bold flex items-center justify-center shrink-0">
                      {section.number}
                    </span>
                    {section.title}
                  </h2>
                  <div className="space-y-3 font-[Inter] text-sm sm:text-base text-[#41493e] leading-relaxed">
                    {section.content.map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}

          {/* Statutory Footer / Trust Callout */}
          <div className="mt-14 p-6 rounded-2xl bg-[#003006] text-white space-y-3">
            <div className="flex items-center gap-2 text-[#ceee93]">
              <SunlitIcon name="verified" size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">Governing Legal Authority</span>
            </div>
            <p className="font-[Inter] text-xs text-[#eff2e9] leading-relaxed">
              This document is governed by the laws of the Federal Republic of Nigeria, including the Nigeria Data Protection Act (NDPA) 2023. For formal statutory notices or privacy inquiries, contact{' '}
              <a href="mailto:privacy@sunlit.energy" className="text-[#ceee93] underline font-semibold">
                privacy@sunlit.energy
              </a>.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
