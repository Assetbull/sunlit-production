import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Clock, User, TrendingUp, BookOpen, Lightbulb, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Solar Energy Blog Nigeria — News, Guides & Insights | Sunlit Energy',
  description:
    'Stay informed about solar energy in Nigeria. Market news, buying guides, solar technology updates, installation case studies, and expert insights from Nigeria\'s leading solar marketplace.',
  keywords:
    'solar energy blog nigeria, solar news lagos, solar installation guide, solar market nigeria, clean energy insights nigeria',
  alternates: { canonical: 'https://sunlitenergy.com/blog' },
  openGraph: {
    title: 'Solar Energy Blog — Sunlit Energy Nigeria',
    description: 'Solar news, guides, and expert insights for Nigeria.',
    url: 'https://sunlitenergy.com/blog',
    siteName: 'Sunlit Energy',
    locale: 'en_NG',
    type: 'website',
  },
};

const CATEGORIES = ['All', 'Market News', 'How-To Guides', 'Technology', 'Finance', 'Case Studies', 'Policy'];

const FEATURED_POST = {
  category: 'Market News',
  title: 'Why 2026 Is Nigeria\'s Most Important Year for Solar Energy',
  excerpt: 'Grid instability, rising diesel costs, and falling solar panel prices are converging to create a historic window for solar adoption across Nigeria. Here\'s what\'s driving it.',
  author: 'Sunlit Energy Team',
  date: 'August 2026',
  readTime: '8 min read',
};

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
    excerpt: 'Lithium iron phosphate batteries are increasingly affordable. But are they right for every solar setup in Nigeria? Here\'s the honest breakdown.',
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
    title: 'Nigeria\'s Solar Market Outlook: 2026–2030',
    excerpt: 'Installed capacity targets, NERC policy shifts, and the role of private marketplaces in driving adoption across all 36 states.',
    author: 'Sunlit Energy Team',
    date: 'May 2026',
    readTime: '12 min read',
    icon: TrendingUp,
  },
];

const CATEGORY_COLOR: Record<string, string> = {
  'Market News': '#00490e',
  'How-To Guides': '#0f631b',
  'Technology': '#1d6d24',
  'Finance': '#00490e',
  'Case Studies': '#0f631b',
  'Policy': '#1d6d24',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'Sunlit Energy Blog',
  url: 'https://sunlitenergy.com/blog',
  description: 'Solar energy news, guides, and insights for Nigeria.',
  publisher: {
    '@type': 'Organization',
    name: 'Sunlit Energy',
    url: 'https://sunlitenergy.com',
  },
};

export default function BlogPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main style={{ background: '#f9f9f6', minHeight: '100vh', paddingTop: 0 }}>

        {/* ── Hero ──────────────────────────────────────────────────── */}
        <section
          aria-label="Blog hero"
          style={{
            padding: '5rem 1.5rem 3rem',
            background: 'linear-gradient(180deg, #f4f4f1 0%, #f9f9f6 100%)',
            borderBottom: '1px solid rgba(191, 202, 186, 0.2)',
          }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                background: 'rgba(0,73,14,0.08)', borderRadius: '9999px',
                padding: '0.375rem 1rem', marginBottom: '1.5rem',
              }}>
                <BookOpen size={14} color="#00490e" />
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 600, color: '#00490e', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Sunlit Blog
                </span>
              </div>
              <h1 style={{
                fontFamily: 'Manrope, sans-serif', fontWeight: 800,
                fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', color: '#1a1c1b',
                letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: '1rem',
              }}>
                Solar Insights for Nigeria
              </h1>
              <p style={{
                fontFamily: 'Inter, sans-serif', fontSize: '1.0625rem',
                color: '#40493d', lineHeight: 1.7, maxWidth: '580px',
              }}>
                Market news, buying guides, technology deep-dives, and expert perspectives from Nigeria&apos;s solar ecosystem.
              </p>
            </div>

            {/* Categories */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  style={{
                    padding: '0.5rem 1.125rem', borderRadius: '9999px',
                    border: cat === 'All' ? 'none' : '1.5px solid rgba(191, 202, 186, 0.4)',
                    background: cat === 'All' ? 'linear-gradient(135deg, #00490e, #0f631b)' : 'transparent',
                    color: cat === 'All' ? '#fff' : '#40493d',
                    fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 500,
                    cursor: 'pointer', transition: 'all 150ms ease',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── Featured Post ──────────────────────────────────────────── */}
        <section aria-label="Featured article" style={{ padding: '4rem 1.5rem 0', background: '#f9f9f6' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 600, color: '#00490e', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Featured
              </span>
            </div>
            <Link href="/blog" style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#fff', borderRadius: '20px', padding: '3rem',
                border: '1px solid rgba(191, 202, 186, 0.2)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem', alignItems: 'center',
              }}>
                <div>
                  <span style={{
                    fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 700,
                    color: '#00490e', background: 'rgba(0,73,14,0.08)',
                    borderRadius: '9999px', padding: '0.25rem 0.75rem',
                    display: 'inline-block', marginBottom: '1.25rem',
                  }}>
                    {FEATURED_POST.category}
                  </span>
                  <h2 style={{
                    fontFamily: 'Manrope, sans-serif', fontWeight: 800,
                    fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: '#1a1c1b',
                    letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: '1rem',
                  }}>
                    {FEATURED_POST.title}
                  </h2>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: '#40493d', lineHeight: 1.65, marginBottom: '1.5rem' }}>
                    {FEATURED_POST.excerpt}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <User size={15} color="#707a6c" />
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#707a6c' }}>{FEATURED_POST.author}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={15} color="#707a6c" />
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#707a6c' }}>{FEATURED_POST.readTime}</span>
                    </div>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#707a6c' }}>{FEATURED_POST.date}</span>
                  </div>
                </div>
                <div style={{
                  height: '200px', borderRadius: '14px',
                  background: 'linear-gradient(135deg, rgba(0,73,14,0.08) 0%, rgba(15,99,27,0.12) 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <TrendingUp size={48} color="#00490e" style={{ marginBottom: '0.75rem' }} />
                    <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1.5rem', color: '#00490e' }}>
                      2026 Solar Outlook
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* ── Post Grid ─────────────────────────────────────────────── */}
        <section aria-label="Blog articles" style={{ padding: '4rem 1.5rem 5rem', background: '#f9f9f6' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1.375rem', color: '#1a1c1b' }}>
                Latest Articles
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
              {BLOG_POSTS.map((post) => (
                <Link
                  key={post.title}
                  href="/blog"
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <article style={{
                    background: '#fff', borderRadius: '18px', padding: '2rem',
                    border: '1px solid rgba(191, 202, 186, 0.2)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                    height: '100%', display: 'flex', flexDirection: 'column',
                    transition: 'all 250ms ease',
                  }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '10px',
                      background: 'rgba(0,73,14,0.08)', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', marginBottom: '1.25rem',
                    }}>
                      <post.icon size={22} color={CATEGORY_COLOR[post.category] || '#00490e'} />
                    </div>
                    <span style={{
                      fontFamily: 'Inter, sans-serif', fontSize: '0.6875rem', fontWeight: 700,
                      color: CATEGORY_COLOR[post.category] || '#00490e',
                      background: 'rgba(0,73,14,0.06)',
                      borderRadius: '9999px', padding: '0.2rem 0.625rem',
                      display: 'inline-block', marginBottom: '0.875rem',
                    }}>
                      {post.category}
                    </span>
                    <h3 style={{
                      fontFamily: 'Manrope, sans-serif', fontWeight: 700,
                      fontSize: '1.0625rem', color: '#1a1c1b', lineHeight: 1.3,
                      marginBottom: '0.75rem', flexGrow: 1,
                    }}>
                      {post.title}
                    </h3>
                    <p style={{
                      fontFamily: 'Inter, sans-serif', fontSize: '0.9rem',
                      color: '#40493d', lineHeight: 1.6, marginBottom: '1.25rem',
                    }}>
                      {post.excerpt}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <Clock size={13} color="#707a6c" />
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', color: '#707a6c' }}>{post.readTime}</span>
                      </div>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', color: '#707a6c' }}>{post.date}</span>
                      <ArrowRight size={14} color="#00490e" style={{ marginLeft: 'auto' }} />
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Newsletter CTA ─────────────────────────────────────────── */}
        <section aria-label="Newsletter signup" style={{
          padding: '5rem 1.5rem',
          background: 'linear-gradient(135deg, #00490e 0%, #0f631b 100%)',
          textAlign: 'center',
        }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '1rem' }}>
              Stay Informed on Solar
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.65, marginBottom: '2rem' }}>
              Join the waitlist to receive our solar energy newsletter and be first to know when Sunlit launches in your area.
            </p>
            <Link
              href="/waitlist"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '1rem 2.25rem', borderRadius: '9999px',
                background: '#fff', color: '#00490e',
                fontFamily: 'Inter, sans-serif', fontWeight: 700,
                fontSize: '1rem', textDecoration: 'none',
              }}
            >
              Join Waitlist <ArrowRight size={18} />
            </Link>
          </div>
        </section>

      </main>
    </>
  );
}
