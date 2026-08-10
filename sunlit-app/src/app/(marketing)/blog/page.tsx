import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Clock, TrendingUp, BookOpen, Lightbulb, Shield, Star, Zap, BarChart3 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Solar Energy Blog Nigeria — News, Guides & Insights | Sunlit Energy',
  description:
    'Stay informed about solar energy in Nigeria. Market news, buying guides, solar technology updates, installation case studies, and expert insights from Nigeria\'s leading solar marketplace.',
  keywords:
    'solar energy blog nigeria, solar news lagos, solar installation guide, solar market nigeria, clean energy insights nigeria',
  alternates: { canonical: 'https://sunlit.energy/blog' },
  openGraph: {
    title: 'Solar Energy Blog — Sunlit Energy Nigeria',
    description: 'Solar news, guides, and expert insights for Nigeria.',
    url: 'https://sunlit.energy/blog',
    siteName: 'Sunlit Energy',
    locale: 'en_NG',
    type: 'website',
  },
};

const CATEGORIES = ['All', 'Market News', 'How-To Guides', 'Technology', 'Finance', 'Case Studies', 'Policy'];

const FEATURED_POST = {
  category: 'Policy & Tech',
  title: 'Why 2026 Is Nigeria\'s Most Important Year for Solar Energy',
  excerpt: 'Grid instability, rising diesel costs, and falling solar panel prices are converging to create a historic window for solar adoption across Nigeria. Here\'s what\'s driving it.',
  author: 'Sunlit Energy Team',
  date: 'August 2026',
  readTime: '8 min read',
};

const SIDEBAR_POSTS = [
  {
    category: 'Finance',
    title: 'How Escrow Payments Are Revolutionising Solar Financing in Nigeria',
    readTime: '5 min read',
    date: 'Aug 2026',
  },
  {
    category: 'Market News',
    title: 'Nigeria Solar Market Reaches ₦500B in Deployed Systems',
    readTime: '4 min read',
    date: 'Jul 2026',
  },
  {
    category: 'Technology',
    title: 'AI-Powered System Sizing: What It Means for Nigerian Buyers',
    readTime: '6 min read',
    date: 'Jul 2026',
  },
];

const BLOG_POSTS = [
  {
    category: 'How-To Guides',
    title: 'How to Choose the Right Solar Installer in Lagos',
    excerpt: 'The 12 questions you must ask before signing any solar contract. What certified really means, and how to verify it.',
    author: 'Sunlit Energy Team',
    date: 'July 2026',
    readTime: '7 min read',
    icon: BookOpen,
  },
  {
    category: 'Finance',
    title: 'Solar ROI in Nigeria: Real Numbers for 2026',
    excerpt: 'We analyzed 50 residential and commercial solar installations across Lagos. Here\'s the real payback period, savings, and what affects your return.',
    author: 'Sunlit Energy Team',
    date: 'July 2026',
    readTime: '10 min read',
    icon: TrendingUp,
  },
  {
    category: 'Technology',
    title: 'LiFePO4 vs Lead-Acid Batteries: What Nigerian Buyers Need to Know',
    excerpt: 'Lithium iron phosphate batteries are increasingly affordable. But are they right for every solar setup? Here\'s the honest breakdown.',
    author: 'Sunlit Energy Team',
    date: 'June 2026',
    readTime: '9 min read',
    icon: Lightbulb,
  },
  {
    category: 'How-To Guides',
    title: 'Grid-Tied vs Off-Grid vs Hybrid Solar: Which Is Right for You?',
    excerpt: 'The definitive guide to solar system types for Nigerian homes and businesses — including which DISCO areas support each configuration.',
    author: 'Sunlit Energy Team',
    date: 'June 2026',
    readTime: '8 min read',
    icon: BookOpen,
  },
  {
    category: 'Finance',
    title: 'Understanding Solar Escrow: How Your Money is Protected',
    excerpt: 'How milestone-based escrow payments work on the Sunlit marketplace, and why it\'s the safest way to finance a solar project in Nigeria.',
    author: 'Sunlit Energy Team',
    date: 'May 2026',
    readTime: '5 min read',
    icon: Shield,
  },
  {
    category: 'Market News',
    title: 'State of the Nigerian Solar Market: Mid-2026 Report',
    excerpt: 'Prices, installs, grid progress, policy shifts. Our mid-year snapshot of where solar stands in Nigeria.',
    author: 'Sunlit Energy Team',
    date: 'May 2026',
    readTime: '12 min read',
    icon: BarChart3,
  },
];

export default function BlogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'Sunlit Energy Blog',
            url: 'https://sunlit.energy/blog',
            description: 'Solar energy news, guides, and insights for Nigeria.',
            publisher: {
              '@type': 'Organization',
              name: 'Sunlit Energy',
              url: 'https://sunlit.energy',
            },
          }),
        }}
      />

      <main style={{ background: '#fff8f5', minHeight: '100vh', paddingBottom: '5rem' }}>

        {/* ── Page header ──────────────────────────────────────────── */}
        <div style={{ padding: '3rem 1.5rem 2rem', borderBottom: '1px solid rgba(191,202,186,0.2)', background: '#fff' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,73,14,0.08)', borderRadius: '9999px', padding: '0.375rem 1rem', marginBottom: '1rem' }}>
              <Zap size={14} color="#00490e" />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 600, color: '#00490e', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>Knowledge Hub</span>
            </div>
            <h1 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#1a1c1b', letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: '0.75rem' }}>
              Sunlit Energy Blog
            </h1>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1rem, 2vw, 1.125rem)', color: '#40493d', lineHeight: 1.6 }}>
              Solar news, guides, and expert insights for Nigeria.
            </p>

            {/* Category filters */}
            <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap', marginTop: '1.75rem' }}>
              {CATEGORIES.map((cat, i) => (
                <button
                  key={cat}
                  style={{
                    fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600,
                    padding: '0.5rem 1.125rem', borderRadius: '9999px',
                    background: i === 0 ? '#00490e' : '#fff',
                    color: i === 0 ? '#fff' : '#40493d',
                    border: i === 0 ? 'none' : '1px solid rgba(191,202,186,0.4)',
                    cursor: 'pointer',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem 0' }}>

          {/* ── Editor's Choice: Featured + Sidebar ──────────────────── */}
          <div style={{ marginBottom: '5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <Star size={16} color="#00490e" />
              <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1.0625rem', color: '#1a1c1b' }}>Editor&apos;s Choice</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', alignItems: 'stretch' }}>

              {/* Featured article */}
              <div
                style={{
                  flex: '2', background: '#fff', borderRadius: '20px',
                  border: '1px solid rgba(191,202,186,0.2)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                  overflow: 'hidden',
                  gridColumn: 'span 2',
                }}
              >
                {/* Image hero area */}
                <div style={{ height: '280px', background: 'linear-gradient(135deg, #00490e 0%, #0f631b 60%, #1d6d24 100%)', position: 'relative', display: 'flex', alignItems: 'flex-end', padding: '2rem' }}>
                  <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderRadius: '9999px', padding: '0.375rem 1rem' }}>
                    <Star size={14} color="#fff" />
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, color: '#fff', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>Editor&apos;s Choice</span>
                  </div>
                  <div>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{FEATURED_POST.category}</span>
                    <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(1.25rem, 3vw, 1.875rem)', color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.2, marginTop: '0.5rem', maxWidth: '500px' }}>{FEATURED_POST.title}</h2>
                  </div>
                </div>
                <div style={{ padding: '2rem' }}>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.0625rem', color: '#40493d', lineHeight: 1.65, marginBottom: '1.5rem' }}>{FEATURED_POST.excerpt}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#40493d' }}>{FEATURED_POST.author}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#707a6c' }}>
                        <Clock size={14} /> {FEATURED_POST.readTime}
                      </span>
                    </div>
                    <Link href="/blog/why-2026-is-nigerias-most-important-year" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.9375rem', color: '#00490e', textDecoration: 'none' }}>
                      Read Full Report <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Sidebar posts */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {SIDEBAR_POSTS.map((post) => (
                  <div key={post.title} style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(191,202,186,0.2)', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 700, color: '#00490e', textTransform: 'uppercase' as const, letterSpacing: '0.06em', display: 'block', marginBottom: '0.5rem' }}>{post.category}</span>
                    <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '0.9375rem', color: '#1a1c1b', lineHeight: 1.4, marginBottom: '0.75rem' }}>{post.title}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', color: '#707a6c' }}><Clock size={12} /> {post.readTime}</span>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', color: '#707a6c' }}>{post.date}</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* ── Latest Articles ───────────────────────────────────────── */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: '#1a1c1b', letterSpacing: '-0.02em' }}>
                Latest Articles
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {BLOG_POSTS.map((post) => (
                <article
                  key={post.title}
                  style={{
                    background: '#fff', borderRadius: '16px', padding: '1.75rem',
                    border: '1px solid rgba(191,202,186,0.2)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                    display: 'flex', flexDirection: 'column', gap: '0.875rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0,73,14,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <post.icon size={20} color="#00490e" />
                    </div>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, color: '#00490e', textTransform: 'uppercase' as const, letterSpacing: '0.06em', background: 'rgba(0,73,14,0.08)', borderRadius: '9999px', padding: '0.2rem 0.625rem' }}>{post.category}</span>
                  </div>

                  <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1.0625rem', color: '#1a1c1b', lineHeight: 1.35 }}>
                    {post.title}
                  </h3>

                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#40493d', lineHeight: 1.65, flex: 1 }}>
                    {post.excerpt}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid rgba(191,202,186,0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', color: '#707a6c' }}>{post.date}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', color: '#707a6c' }}>
                        <Clock size={12} /> {post.readTime}
                      </span>
                    </div>
                    <Link href="/blog" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.875rem', color: '#00490e', textDecoration: 'none' }}>
                      Read <ArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Load more */}
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <button style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 2rem', borderRadius: '9999px', border: '1.5px solid rgba(191,202,186,0.5)', color: '#1a1c1b', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.9375rem', background: '#fff', cursor: 'pointer' }}>
                Load More Articles
              </button>
            </div>
          </div>

          {/* ── Newsletter CTA ────────────────────────────────────────── */}
          <div style={{ marginTop: '5rem', background: 'linear-gradient(135deg, #00490e 0%, #0f631b 100%)', borderRadius: '20px', padding: '3.5rem 2.5rem', textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: '#fff', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
              Get Solar Insights in Your Inbox
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.0625rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.65, marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
              Weekly digest of the most important solar news, market updates, and buying guides for Nigeria.
            </p>
            <Link href="/waitlist" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', borderRadius: '9999px', background: '#fff', color: '#00490e', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1rem', textDecoration: 'none' }}>
              Join Waitlist <ArrowRight size={18} />
            </Link>
          </div>

        </div>
      </main>
    </>
  );
}
