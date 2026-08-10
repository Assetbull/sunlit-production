import { Metadata } from 'next';
import Link from 'next/link';
import { SunlitIcon } from '@/shared/components/ui/SunlitIcon';
import { ContextualBackNav } from '@/shared/components/navigation/ContextualBackNav';

export const metadata: Metadata = {
  title: 'Legal & Compliance Hub | Sunlit Energy',
  description:
    'Authoritative legal policies, terms of service, NDPA data governance, and regulatory compliance standards for Sunlit Energy.',
};

export default function LegalHubPage() {
  const policies = [
    {
      title: 'Privacy Policy',
      slug: '/privacy',
      type: 'Data Governance',
      version: 'v2.1.4',
      badge: 'NDPA 2023',
      description: 'How we protect your personal, solar property, and financial data under the Nigeria Data Protection Act.',
      icon: 'shield',
    },
    {
      title: 'Terms of Service',
      slug: '/terms',
      type: 'Platform Agreement',
      version: 'v2.1.0',
      badge: 'Binding',
      description: 'General rules, dispute resolution, and contractual framework governing platform and sizing tool usage.',
      icon: 'description',
    },
    {
      title: 'Cookie & Tracking Policy',
      slug: '/cookies',
      type: 'Tracking & Storage',
      version: 'v1.4.0',
      badge: 'Consent',
      description: 'Bento breakdown of essential session tokens, functional state preferences, and performance telemetry.',
      icon: 'settings',
    },
    {
      title: 'Marketplace & EPC Terms',
      slug: '/legal/marketplace-terms',
      type: 'Contractor Rules',
      version: 'v1.8.0',
      badge: 'Installers & EPC',
      description: 'Standards of conduct, proposal submissions, project verification, and workmanship warranty obligations.',
      icon: 'gavel',
    },
    {
      title: 'Milestone Escrow & Payment Terms',
      slug: '/legal/escrow-terms',
      type: 'Financial Protection',
      version: 'v2.0.0',
      badge: 'CBN Regulated',
      description: 'Disbursement milestones, customer sign-off procedures, inspection audits, and payment holding mechanics.',
      icon: 'verified',
    },
    {
      title: 'Refund & Cancellation Policy',
      slug: '/legal/refunds',
      type: 'Consumer Rights',
      version: 'v1.2.0',
      badge: 'FCCPA 2018',
      description: 'Protocols for pre-installation engineering cancellation, defective equipment returns, and fee reversals.',
      icon: 'history',
    },
    {
      title: 'Security & Responsible Disclosure',
      slug: '/legal/security-disclosure',
      type: 'Cybersecurity',
      version: 'v1.5.0',
      badge: 'Safe Harbor',
      description: 'Vulnerability reporting guidelines, bug bounty scopes, and platform encryption standards.',
      icon: 'lock',
    },
    {
      title: 'Intellectual Property Policy',
      slug: '/legal/intellectual-property',
      type: 'Brand & Calculations',
      version: 'v1.1.0',
      badge: 'Proprietary',
      description: 'Copyright, trademarks, and proprietary ownership over solar sizing algorithms and engineering models.',
      icon: 'menu_book',
    },
    {
      title: 'Community Guidelines',
      slug: '/legal/community-guidelines',
      type: 'Conduct Standard',
      version: 'v1.3.0',
      badge: 'Platform Rules',
      description: 'Standards for verified installer reviews, public project discussions, and zero-tolerance harassment rules.',
      icon: 'group',
    },
    {
      title: 'Legal Contact & Statutory Inquiries',
      slug: '/legal/contact',
      type: 'Direct Communication',
      version: 'Active',
      badge: 'Direct Channel',
      description: 'Official communication channel for regulatory notices, NDPA data subject requests, and dispute mediation.',
      icon: 'mail',
    },
  ];

  return (
    <div className="bg-[#f7fbf1] text-[#191d17] min-h-screen flex flex-col antialiased selection:bg-[#cceb91] selection:text-[#131f00]">
      <div className="pt-28 pb-4 px-4 sm:px-8 max-w-6xl mx-auto w-full">
        <ContextualBackNav href="/" label="Home" maxWidth="none" padding="0" />
      </div>

      <main className="flex-grow max-w-6xl mx-auto px-4 sm:px-8 pb-20 w-full">
        {/* Header */}
        <div className="mb-12 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#bcf0b2]/40 text-[#003006] text-xs font-bold uppercase tracking-wider mb-4">
            <SunlitIcon name="shield" size={13} />
            Governance &amp; Public Trust
          </div>
          <h1 className="font-[Manrope] text-3xl sm:text-5xl font-bold text-[#003006] mb-4 tracking-tight">
            Legal &amp; Compliance Center
          </h1>
          <p className="font-[Inter] text-base sm:text-lg text-[#41493e] max-w-3xl leading-relaxed">
            Sunlit Energy operates with unwavering transparency and rigorous governance. Explore our authoritative legal documentation, consumer protections, and regulatory disclosures governing our Nigerian solar infrastructure platform.
          </p>
        </div>

        {/* Policy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {policies.map((policy, idx) => (
            <Link
              key={idx}
              href={policy.slug}
              className="bg-[#fff8f5] rounded-[24px] p-6 border border-[#bfcaba]/40 shadow-sm hover:border-[#003006] hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#003006] text-white flex items-center justify-center group-hover:bg-[#0f631b] transition-colors">
                    <SunlitIcon name={policy.icon} size={20} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#cceb91] text-[#003006]">
                    {policy.badge}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-bold text-[#707a6c] uppercase">{policy.type}</span>
                  <span className="text-[11px] text-[#bfcaba]">•</span>
                  <span className="text-[11px] font-semibold text-[#707a6c]">{policy.version}</span>
                </div>
                <h2 className="font-[Manrope] text-xl font-bold text-[#003006] mb-2 group-hover:text-[#0f631b] transition-colors">
                  {policy.title}
                </h2>
                <p className="font-[Inter] text-xs sm:text-sm text-[#41493e] leading-relaxed">
                  {policy.description}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#eae1da] flex items-center justify-between text-xs font-bold text-[#003006] group-hover:text-[#0f631b]">
                <span>View Full Policy</span>
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Statutory Compliance Statement */}
        <section className="bg-[#003006] text-white rounded-[24px] p-8 sm:p-10 shadow-md">
          <div className="flex items-center gap-3 text-[#ceee93] mb-4">
            <SunlitIcon name="verified" size={24} />
            <h2 className="font-[Manrope] text-xl sm:text-2xl font-bold text-white">
              Nigerian Statutory Compliance Standards
            </h2>
          </div>
          <p className="font-[Inter] text-sm sm:text-base text-[#eff2e9] max-w-3xl leading-relaxed mb-6">
            Sunlit Global Energy Co. Ltd. adheres strictly to all applicable Federal and State regulatory frameworks in Nigeria. Our platform contracts and engineering data models are architected to support standards established by the Nigerian Electricity Regulatory Commission (NERC), Nigeria Data Protection Commission (NDPC), and Federal Competition and Consumer Protection Commission (FCCPC).
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="px-3.5 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-[#ceee93] border border-white/10">
              NDPA 2023 Certified Process
            </div>
            <div className="px-3.5 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-[#ceee93] border border-white/10">
              FCCPA 2018 Consumer Safeguards
            </div>
            <div className="px-3.5 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-[#ceee93] border border-white/10">
              CBN-Regulated Escrow Custodians
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
