import type { Config } from 'tailwindcss';

/**
 * Sunlit Energy — Tailwind CSS Configuration
 * AUTHORITATIVE SOURCE: Sunlit Visual DNA Master (Stitch Project: 7305856763320986446)
 *
 * Design Theme: Premium Modern / Veridian Sanctuary
 * Primary: Forest Green (#00490e / #0f631b)
 * Surface: Warm Cream (#f9f9f6)
 * Typography: Manrope (headlines) + Inter (body)
 *
 * DO NOT modify without updating the Stitch Visual DNA Master project.
 */
const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Sunlit Visual DNA Master — MD3 Color System ──────────────────────
        // Source: Stitch Project 7305856763320986446 designTheme.namedColors
        'primary':                    '#00490e',
        'primary-container':          '#0f631b',
        'on-primary':                 '#ffffff',
        'on-primary-container':       '#8cdd86',
        'primary-fixed':              '#a4f69c',
        'primary-fixed-dim':          '#88d982',
        'on-primary-fixed':           '#002203',
        'on-primary-fixed-variant':   '#005311',
        'inverse-primary':            '#88d982',
        'surface-tint':               '#1d6d24',

        'secondary':                  '#5d5f5e',
        'secondary-container':        '#dfe0df',
        'on-secondary':               '#ffffff',
        'on-secondary-container':     '#616362',
        'secondary-fixed':            '#e2e2e2',
        'secondary-fixed-dim':        '#c6c7c6',
        'on-secondary-fixed':         '#1a1c1c',
        'on-secondary-fixed-variant': '#454747',

        'tertiary':                   '#741b41',
        'tertiary-container':         '#923358',
        'on-tertiary':                '#ffffff',
        'on-tertiary-container':      '#ffb7cc',
        'tertiary-fixed':             '#ffd9e2',
        'tertiary-fixed-dim':         '#ffb1c8',
        'on-tertiary-fixed':          '#3e001d',
        'on-tertiary-fixed-variant':  '#7f2449',

        'error':                      '#ba1a1a',
        'error-container':            '#ffdad6',
        'on-error':                   '#ffffff',
        'on-error-container':         '#93000a',

        // ── Surface Hierarchy (Warm Cream System) ───────────────────────────
        'background':                 '#f9f9f6',
        'on-background':              '#1a1c1b',
        'surface':                    '#f9f9f6',
        'surface-dim':                '#dadad7',
        'surface-bright':             '#f9f9f6',
        'surface-container-lowest':   '#ffffff',
        'surface-container-low':      '#f4f4f1',
        'surface-container':          '#eeeeeb',
        'surface-container-high':     '#e8e8e5',
        'surface-container-highest':  '#e2e3e0',
        'surface-variant':            '#e2e3e0',
        'on-surface':                 '#1a1c1b',
        'on-surface-variant':         '#40493d',
        'inverse-surface':            '#2f312f',
        'inverse-on-surface':         '#f1f1ee',

        'outline':                    '#707a6c',
        'outline-variant':            '#bfcaba',

        // ── Semantic Aliases for convenience ─────────────────────────────────
        'sunlit-green':               '#00490e',
        'sunlit-green-mid':           '#0f631b',
        'sunlit-green-light':         '#1d6d24',
        'sunlit-green-accent':        '#88d982',
        'sunlit-cream':               '#f9f9f6',
        'sunlit-white':               '#ffffff',
        'sunlit-ink':                 '#1a1c1b',
        'sunlit-muted':               '#40493d',
      },

      fontFamily: {
        'headline': ['Manrope', 'sans-serif'],
        'body':     ['Inter', 'sans-serif'],
        'label':    ['Inter', 'sans-serif'],
        // Aliases
        'sans':     ['Inter', 'sans-serif'],
        'display':  ['Manrope', 'sans-serif'],
      },

      fontSize: {
        // Visual DNA Typography Scale
        'display-xl':    ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
        'display-xl-md': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '800' }],
        'display-lg':    ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'headline':      ['1.875rem', { lineHeight: '1.3', fontWeight: '700' }],
        'section-title': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
        'card-title':    ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg':       ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md':       ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'label-sm':      ['0.75rem', { lineHeight: '1', letterSpacing: '0.05em', fontWeight: '600' }],
      },

      borderRadius: {
        DEFAULT: '0.5rem',
        'sm':    '0.25rem',
        'md':    '0.75rem',
        'lg':    '1rem',
        'xl':    '1.5rem',
        '2xl':   '1.125rem',  // cards: 18px
        '3xl':   '1.75rem',   // modals: 28px
        'full':  '9999px',    // pills/buttons
      },

      boxShadow: {
        // Visual DNA elevation system — tonal layering, not heavy shadows
        'ambient':     '0 8px 24px rgba(0, 0, 0, 0.06)',
        'card':        '0 8px 24px rgba(0, 0, 0, 0.04)',
        'float':       '0 16px 32px rgba(0, 0, 0, 0.08)',
        'cta':         '0 6px 20px rgba(0, 73, 14, 0.25)',
        'cta-hover':   '0 10px 28px rgba(0, 73, 14, 0.35)',
        'glass':       '0 8px 24px rgba(0, 0, 0, 0.06)',
        'none':        'none',
      },

      backgroundImage: {
        // Primary CTA — forest green gradient
        'cta-gradient':       'linear-gradient(135deg, #00490e 0%, #0f631b 100%)',
        'cta-gradient-hover': 'linear-gradient(135deg, #005311 0%, #1d6d24 100%)',
        // Background textures
        'solar-flare':        'radial-gradient(circle at top right, #f4f4f1 0%, #f9f9f6 100%)',
        'hero-mesh':          'radial-gradient(ellipse at 80% 0%, rgba(136, 217, 130, 0.08) 0%, transparent 60%)',
        // Section alternation
        'section-light':      'linear-gradient(180deg, #f9f9f6 0%, #f4f4f1 100%)',
      },

      spacing: {
        // 8pt grid system
        '18': '4.5rem',
        '72': '18rem',
        '80': '20rem',
        '88': '22rem',
        '96': '24rem',
        '104': '26rem',
        '112': '28rem',
        '120': '30rem',
      },

      transitionTimingFunction: {
        // Visual DNA motion — physical, engineered feel
        'smooth':    'cubic-bezier(0.4, 0, 0.2, 1)',
        'enter':     'cubic-bezier(0.22, 0.61, 0.36, 1)',
        'spring':    'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },

      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
        '450': '450ms',
        '600': '600ms',
      },

      maxWidth: {
        'content': '1200px',
        'wide':    '1440px',
      },

      backdropBlur: {
        'nav': '24px',
        'card': '16px',
      },
    },
  },
  plugins: [],
};

export default config;
