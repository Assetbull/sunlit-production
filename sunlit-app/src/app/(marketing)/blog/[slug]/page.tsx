import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ContextualBackNav } from '@/shared/components/navigation/ContextualBackNav';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Calendar,
  Share2,
  Bookmark,
  ShieldCheck,
  Zap,
  CheckCircle2,
  TrendingUp,
  Building2,
  Layers,
} from 'lucide-react';

interface BlogPostData {
  slug: string;
  title: string;
  category: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  excerpt: string;
  content: Array<{
    heading?: string;
    body: string;
    callout?: string;
  }>;
  relatedSlugs: string[];
}

const POSTS_DATABASE: Record<string, BlogPostData> = {
  'why-2026-is-nigerias-most-important-year': {
    slug: 'why-2026-is-nigerias-most-important-year',
    title: "Why 2026 Is Nigeria's Most Important Year for Solar Energy",
    category: 'Policy & Market Insights',
    author: 'Sunlit Energy Research Team',
    authorRole: 'Energy Market Intelligence',
    date: 'August 2026',
    readTime: '8 min read',
    excerpt:
      'Grid instability, rising diesel costs, and falling solar panel prices are converging to create a historic window for solar adoption across Nigeria. Here is what is driving the shift.',
    content: [
      {
        heading: '1. The Economics of Diesel vs. Solar PV Parity',
        body: 'In 2026, Nigeria’s energy landscape reached an inflection point. With retail automotive gas oil (diesel) and PMS prices remaining volatile and Band A utility tariffs adjusted upward, the Levelized Cost of Energy (LCOE) for commercial solar + LiFePO4 battery storage dropped well below grid and generator parity.',
        callout:
          'Commercial facilities running 40kVA+ generators for over 10 hours daily now experience a capital payback period of under 32 months.',
      },
      {
        heading: '2. Energy Independence & Resilience in Commercial Hubs',
        body: 'From Ikeja industrial estates to Abuja corporate corridors and Ogun State manufacturing clusters, businesses are decoupling operational continuity from unpredictable central distribution networks. Hybrid solar setups with high-voltage storage are no longer luxury amenities—they are foundational balance-sheet assets.',
      },
      {
        heading: '3. Milestone Escrow and Technical Standards',
        body: 'The primary bottleneck to Nigerian solar adoption was never sunlight; it was trust. By anchoring procurement to independent CAD engineering audits and milestone-gated payment releases, buyers are protected against subpar components and unverified installer claims.',
      },
    ],
    relatedSlugs: [
      'solar-roi-in-nigeria-real-numbers-for-2026',
      'understanding-solar-escrow-nigeria',
      'lifepo4-vs-lead-acid-batteries-nigeria',
    ],
  },
  'solar-roi-in-nigeria-real-numbers-for-2026': {
    slug: 'solar-roi-in-nigeria-real-numbers-for-2026',
    title: 'A Guide to Commercial and Industrial Solar ROI in Lagos',
    category: 'Financial Modeling',
    author: 'Sunlit Financial & Engineering Operations',
    authorRole: 'Infrastructure Analytics',
    date: 'July 2026',
    readTime: '10 min read',
    excerpt:
      'Modeled financial metrics, capital recovery timelines, and diesel offset calculations for commercial and industrial facilities operating in Lagos and Ogun State.',
    content: [
      {
        heading: '1. Capex vs. Opex: Evaluating the Total Cost of Ownership',
        body: 'Traditional calculations often overlook the hidden costs of generator maintenance: oil filters, overhaul cycles, fuel logistics, and noise abatement. A 50kVA commercial solar setup with 60kWh LiFePO4 storage yields an IRR exceeding 34% when benchmarked against mixed grid/diesel baselines.',
        callout:
          'Calculated model: A 15kVA residential system saves an average of ₦420,000 monthly in PMS and generator maintenance in Lekki Phase 1.',
      },
      {
        heading: '2. Tier-1 Hardware Reliability & Warranty Enforcement',
        body: 'Investing in Tier-1 bifacial panels and lithium iron phosphate battery racks ensures 15- to 25-year asset lifetimes. Platform-verified procurement eliminates the counterfeit inverters and relabeled cells historically common in gray markets.',
      },
      {
        heading: '3. Accelerated Depreciation and PPA Structures',
        body: 'Qualifying enterprises can leverage zero-upfront Power Purchase Agreements (PPA), allowing immediate OPEX savings without locking corporate balance sheet capital.',
      },
    ],
    relatedSlugs: [
      'why-2026-is-nigerias-most-important-year',
      'how-to-choose-the-right-solar-installer-in-lagos',
      'understanding-solar-escrow-nigeria',
    ],
  },
  'how-to-choose-the-right-solar-installer-in-lagos': {
    slug: 'how-to-choose-the-right-solar-installer-in-lagos',
    title: 'How to Choose the Right Solar Installer in Lagos: 12 Key Questions',
    category: 'How-To Guides',
    author: 'Sunlit EPC Quality Assurance',
    authorRole: 'Installer Operations',
    date: 'July 2026',
    readTime: '7 min read',
    excerpt:
      'The 12 essential technical and legal questions you must ask before signing any solar contract in Nigeria. What certified really means, and how to verify it.',
    content: [
      {
        heading: '1. Verifying NEMSA Certification & Registered Business Entity',
        body: 'Ensure the lead engineer holds legitimate Nigerian Electricity Management Services Agency (NEMSA) certification and that the company provides audited references for completed 3-phase and high-voltage projects.',
      },
      {
        heading: '2. Insisting on Full Engineering Single-Line Diagrams (SLD)',
        body: 'Never accept a simple quote without an accompanying Single-Line Diagram (SLD) specifying string sizing, DC surge protection devices (SPD), earthing resistance, and AC changeover synchronization.',
        callout:
          'Proper DC surge protection prevents inverter motherboard failure during typical West African tropical thunderstorms.',
      },
      {
        heading: '3. Securing Milestone Payment Protection',
        body: 'Never pay 100% upfront for hardware procurement. Use platform escrow where funds are released in verified tranches: 1) CAD Design Approval, 2) Hardware Delivery & Serial Verification, 3) Commissioning & Testing.',
      },
    ],
    relatedSlugs: [
      'understanding-solar-escrow-nigeria',
      'grid-tied-vs-off-grid-vs-hybrid-solar',
      'lifepo4-vs-lead-acid-batteries-nigeria',
    ],
  },
  'lifepo4-vs-lead-acid-batteries-nigeria': {
    slug: 'lifepo4-vs-lead-acid-batteries-nigeria',
    title: 'LiFePO4 vs Lead-Acid Batteries: What Nigerian Buyers Need to Know',
    category: 'Technology & Hardware',
    author: 'Sunlit Technical Engineering',
    authorRole: 'Storage Systems Specialist',
    date: 'June 2026',
    readTime: '9 min read',
    excerpt:
      'Lithium Iron Phosphate (LiFePO4) chemistry has transformed solar reliability in hot climates. Here is the honest lifecycle comparison against tubular and gel batteries.',
    content: [
      {
        heading: '1. Cycle Life and Depth of Discharge (DoD)',
        body: 'Standard tubular gel batteries provide 800 to 1,200 cycles at 50% Depth of Discharge before significant capacity degradation, requiring replacement every 2–3 years. Quality LiFePO4 cells deliver 6,000+ cycles at 80–90% DoD, providing 10+ years of daily cycling.',
        callout:
          'On a 10-year cost-per-kWh cycled basis, LiFePO4 is up to 60% cheaper than recurring tubular battery replacements.',
      },
      {
        heading: '2. High-Temperature Degradation Resistance',
        body: 'Ambient temperatures in Lagos, Abuja, and northern regions frequently exceed 35°C in battery enclosures. Lead-acid internal resistance climbs and acid boils, accelerating sulfation. LiFePO4 with active Smart BMS maintains internal thermal balancing.',
      },
      {
        heading: '3. Charge Acceptance & Fast Solar Harvesting',
        body: 'LiFePO4 batteries accept rapid high-current charging, reaching full capacity within 2.5–3 hours of peak Nigerian midday sunshine, whereas lead-acid requires prolonged multi-stage absorption.',
      },
    ],
    relatedSlugs: [
      'solar-roi-in-nigeria-real-numbers-for-2026',
      'grid-tied-vs-off-grid-vs-hybrid-solar',
      'why-2026-is-nigerias-most-important-year',
    ],
  },
  'grid-tied-vs-off-grid-vs-hybrid-solar': {
    slug: 'grid-tied-vs-off-grid-vs-hybrid-solar',
    title: 'Grid-Tied vs Off-Grid vs Hybrid Solar: Which Is Right for You?',
    category: 'How-To Guides',
    author: 'Sunlit Systems Engineering',
    authorRole: 'Design Engineering',
    date: 'June 2026',
    readTime: '8 min read',
    excerpt:
      'The definitive guide to solar system architectures for Nigerian homes and businesses—including DISCO grid integration and generator synchronization.',
    content: [
      {
        heading: '1. Why Hybrid Systems Dominate Nigerian Deployments',
        body: 'Pure grid-tied systems shut down during utility blackouts to protect line workers, rendering them ineffective during grid collapse. Hybrid systems reliably bridge solar panels, battery banks, the utility grid, and existing standby generators with zero transfer time.',
      },
      {
        heading: '2. Fuel-Save Generator Synchronization',
        body: 'For factories and commercial complexes in industrial corridors like Ota or Ikeja, hybrid controllers automatically modulate solar generation to keep diesel generators at optimal 30% minimum load, slashing fuel consumption by up to 75%.',
      },
    ],
    relatedSlugs: [
      'how-to-choose-the-right-solar-installer-in-lagos',
      'lifepo4-vs-lead-acid-batteries-nigeria',
      'understanding-solar-escrow-nigeria',
    ],
  },
  'understanding-solar-escrow-nigeria': {
    slug: 'understanding-solar-escrow-nigeria',
    title: 'Understanding Solar Escrow: How Your Project Funds Are Protected',
    category: 'Financing & Escrow',
    author: 'Sunlit Trust & Governance',
    authorRole: 'Marketplace Operations',
    date: 'May 2026',
    readTime: '5 min read',
    excerpt:
      'How milestone-based escrow payments work on the Sunlit platform, ensuring project owners and certified installers transact with total confidence.',
    content: [
      {
        heading: '1. The Problem with Direct Advance Payments',
        body: 'Historically in West Africa, paying installers upfront often resulted in project abandonment, equipment substitution, or endless delays. Conversely, installers feared completing work without guarantee of final client payment.',
      },
      {
        heading: '2. The Sunlit Milestone Protocol',
        body: 'Sunlit holds funds in segregated, audited escrow accounts. Disbursements occur strictly upon verifiable milestone achievements verified by both parties and digital QA inspection checks.',
        callout:
          'Milestone 1: Engineering CAD & Structural Review (15%)\nMilestone 2: Hardware Delivery On-Site (50%)\nMilestone 3: Physical Installation & Commissioning (25%)\nMilestone 4: Performance Verification (10%)',
      },
    ],
    relatedSlugs: [
      'how-to-choose-the-right-solar-installer-in-lagos',
      'solar-roi-in-nigeria-real-numbers-for-2026',
      'why-2026-is-nigerias-most-important-year',
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS_DATABASE[slug];

  if (!post) {
    return {
      title: 'Article Not Found | Sunlit Energy',
    };
  }

  return {
    title: `${post.title} | Sunlit Energy Insights`,
    description: post.excerpt,
    alternates: {
      canonical: `https://sunlit.energy/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://sunlit.energy/blog/${slug}`,
      siteName: 'Sunlit Energy',
      type: 'article',
      locale: 'en_NG',
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = POSTS_DATABASE[slug] || POSTS_DATABASE['why-2026-is-nigerias-most-important-year'];

  if (!post && !POSTS_DATABASE[slug]) {
    notFound();
  }

  const relatedPosts = (post.relatedSlugs || [])
    .map((s) => POSTS_DATABASE[s])
    .filter(Boolean);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            url: `https://sunlit.energy/blog/${post.slug}`,
            datePublished: '2026-06-01',
            author: {
              '@type': 'Organization',
              name: post.author,
            },
            publisher: {
              '@type': 'Organization',
              name: 'Sunlit Energy',
              url: 'https://sunlit.energy',
            },
          }),
        }}
      />

      <main style={{ background: '#fff8f5', minHeight: '100vh', paddingBottom: '6rem' }}>
        {/* ── Contextual Back Navigation ────────────────────────── */}
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <ContextualBackNav
            href="/blog"
            label="Blog"
            maxWidth="none"
            padding="0"
          />
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#00490e',
              background: 'rgba(0,73,14,0.08)',
              borderRadius: '9999px',
              padding: '0.25rem 0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            {post.category}
          </span>
        </div>

        {/* ── Article Header ─────────────────────────────────────────── */}
        <article style={{ maxWidth: '900px', margin: '0 auto', padding: '3.5rem 1.5rem 0' }}>
          <h1
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(2rem, 5vw, 3.25rem)',
              color: '#1a1c1b',
              lineHeight: 1.15,
              letterSpacing: '-0.025em',
              marginBottom: '1.5rem',
            }}
          >
            {post.title}
          </h1>

          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '1.1875rem',
              color: '#40493d',
              lineHeight: 1.7,
              marginBottom: '2rem',
            }}
          >
            {post.excerpt}
          </p>

          {/* Meta Bar */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              padding: '1.25rem 0',
              borderTop: '1px solid rgba(191,202,186,0.3)',
              borderBottom: '1px solid rgba(191,202,186,0.3)',
              marginBottom: '3rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: '#00490e',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '1rem',
                }}
              >
                SE
              </div>
              <div>
                <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '0.9375rem', color: '#1a1c1b' }}>
                  {post.author}
                </div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', color: '#707a6c' }}>
                  {post.authorRole}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', color: '#707a6c' }}>
                <Calendar size={14} /> {post.date}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', color: '#707a6c' }}>
                <Clock size={14} /> {post.readTime}
              </span>
            </div>
          </div>

          {/* ── Article Content Sections ───────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {post.content.map((sec, idx) => (
              <section key={idx} style={{ fontFamily: 'Inter, sans-serif', color: '#1f1b17', lineHeight: 1.8 }}>
                {sec.heading && (
                  <h2
                    style={{
                      fontFamily: 'Manrope, sans-serif',
                      fontWeight: 800,
                      fontSize: '1.625rem',
                      color: '#1a1c1b',
                      letterSpacing: '-0.02em',
                      marginBottom: '1rem',
                    }}
                  >
                    {sec.heading}
                  </h2>
                )}
                <p style={{ fontSize: '1.0625rem', color: '#40493d', marginBottom: sec.callout ? '1.5rem' : 0 }}>
                  {sec.body}
                </p>

                {sec.callout && (
                  <div
                    style={{
                      background: '#f6ece6',
                      borderRadius: '14px',
                      padding: '1.5rem 1.75rem',
                      borderLeft: '4px solid #00490e',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.9375rem',
                      color: '#1a1c1b',
                      lineHeight: 1.65,
                      fontWeight: 500,
                    }}
                  >
                    {sec.callout}
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* ── CTA Banner ─────────────────────────────────────────────── */}
          <div
            style={{
              marginTop: '4rem',
              background: 'linear-gradient(135deg, #00490e 0%, #0f631b 100%)',
              borderRadius: '24px',
              padding: '3rem 2rem',
              textAlign: 'center',
              color: '#fff',
            }}
          >
            <h3
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 800,
                fontSize: '1.75rem',
                marginBottom: '0.75rem',
              }}
            >
              Size Your Solar Setup With Verified Data
            </h3>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: 'rgba(255,255,255,0.85)', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
              Use our standardized engineering calculators to model load requirements and get bids from vetted installers.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                href="/tools/solar-system-sizing"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.875rem 1.75rem',
                  borderRadius: '9999px',
                  background: '#fff',
                  color: '#00490e',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  textDecoration: 'none',
                }}
              >
                Launch System Sizer <ArrowRight size={16} />
              </Link>
              <Link
                href="/installers"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.875rem 1.75rem',
                  borderRadius: '9999px',
                  border: '1.5px solid rgba(255,255,255,0.4)',
                  color: '#fff',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  textDecoration: 'none',
                  background: 'transparent',
                }}
              >
                Find Certified Installers
              </Link>
            </div>
          </div>

          {/* ── Related Articles ───────────────────────────────────────── */}
          {relatedPosts.length > 0 && (
            <div style={{ marginTop: '4.5rem', paddingTop: '3rem', borderTop: '1px solid rgba(191,202,186,0.3)' }}>
              <h3
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 800,
                  fontSize: '1.5rem',
                  color: '#1a1c1b',
                  marginBottom: '1.75rem',
                }}
              >
                Related Articles
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                {relatedPosts.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/blog/${r.slug}`}
                    style={{
                      background: '#fff8f5',
                      borderRadius: '16px',
                      padding: '1.5rem',
                      border: '1px solid rgba(191,202,186,0.4)',
                      textDecoration: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      transition: 'all 150ms cubic-bezier(0.2,0,0,1)',
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: '#00490e',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          display: 'block',
                          marginBottom: '0.5rem',
                        }}
                      >
                        {r.category}
                      </span>
                      <h4
                        style={{
                          fontFamily: 'Manrope, sans-serif',
                          fontWeight: 700,
                          fontSize: '1rem',
                          color: '#1a1c1b',
                          lineHeight: 1.35,
                          marginBottom: '0.5rem',
                        }}
                      >
                        {r.title}
                      </h4>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', color: '#00490e', fontWeight: 600, marginTop: '1rem' }}>
                      Read Article <ArrowRight size={14} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
    </>
  );
}
