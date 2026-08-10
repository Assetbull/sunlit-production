import type { Config } from 'tailwindcss';

/**
 * Sunlit Energy — Tailwind CSS Configuration
 * AUTHORITATIVE SOURCE: Sunlit Visual DNA 2.1 & Enterprise UX Standard
 *
 * Design Theme: Sovereign Grid / Veridian Sanctuary
 * Primary: Forest Green (#00490e / #0f631b) | Accent: Soft Lime (#d9f99d / #ceee93)
 * Surface: Layered Stone & Warm Cream (#fff8f5 / #fafaf9)
 * Typography: Manrope (display/headlines) + Inter (body/UI)
 */
const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Sunlit Visual DNA 2.1 — MD3 & Functional Color System ───────────
        'surface':                    '#fff8f5',
        'surface-dim':                '#e2d8d2',
        'surface-bright':             '#fff8f5',
        'surface-container-lowest':   '#ffffff',
        'surface-container-low':      '#fcf2eb',
        'surface-container':          '#f6ece6',
        'surface-container-high':     '#f0e6e0',
        'surface-container-highest':  '#eae1da',
        'on-surface':                 '#1f1b17',
        'on-surface-variant':         '#40493d',
        'inverse-surface':            '#342f2b',
        'inverse-on-surface':         '#f9efe8',
        'outline':                    '#707a6c',
        'outline-variant':            '#bfcaba',
        'surface-tint':               '#1d6d24',
        'surface-variant':            '#eae1da',
        'background':                 '#fff8f5',
        'on-background':              '#1f1b17',

        'primary':                    '#00490e',
        'on-primary':                 '#ffffff',
        'primary-container':          '#0f631b',
        'on-primary-container':       '#8cdd86',
        'inverse-primary':            '#88d982',
        'primary-fixed':              '#a4f69c',
        'primary-fixed-dim':          '#88d982',
        'on-primary-fixed':           '#002203',
        'on-primary-fixed-variant':   '#005311',

        'secondary':                  '#4d661c',
        'on-secondary':               '#ffffff',
        'secondary-container':        '#ceee93',
        'on-secondary-container':     '#536d22',
        'secondary-fixed':            '#ceee93',
        'secondary-fixed-dim':        '#b3d17a',
        'on-secondary-fixed':         '#131f00',
        'on-secondary-fixed-variant': '#364e03',

        'tertiary':                   '#343f52',
        'on-tertiary':                '#ffffff',
        'tertiary-container':         '#4b566a',
        'on-tertiary-container':      '#c0cbe3',
        'tertiary-fixed':             '#d8e3fb',
        'tertiary-fixed-dim':         '#bcc7de',
        'on-tertiary-fixed':          '#111c2d',
        'on-tertiary-fixed-variant':  '#3c475a',

        'error':                      '#ba1a1a',
        'on-error':                   '#ffffff',
        'error-container':            '#ffdad6',
        'on-error-container':         '#93000a',

        // ── Visual DNA 2.1 Brand & Semantic Aliases ──────────────────────────
        'veridian-green':             '#0f631b',
        'soft-lime':                  '#d9f99d',
        'soft-lime-container':        '#ceee93',
        'stone-base':                 '#fafaf9',
        'stone-elevated':             '#fcfcfb',
        'stone-100':                  '#f5f5f4',
        'stone-200':                  '#e7e5e4',
        'stone-300':                  '#d6d3d1',
        'sunlit-green':               '#00490e',
        'sunlit-green-mid':           '#0f631b',
        'sunlit-green-light':         '#1d6d24',
        'sunlit-green-accent':        '#88d982',
        'sunlit-cream':               '#fff8f5',
        'sunlit-white':               '#ffffff',
        'sunlit-ink':                 '#1f1b17',
        'sunlit-muted':               '#40493d',

        // ── Validation & Enterprise Status Roles ─────────────────────────────
        'status-pass':                '#179d5b',
        'status-warning':             '#e4a11b',
        'status-blocked':             '#ba1a1a',
        'status-invalid':             '#d84b43',
        'status-review':              '#3177f5',
      },

      fontFamily: {
        'headline': ['Manrope', 'sans-serif'],
        'body':     ['Inter', 'sans-serif'],
        'label':    ['Inter', 'sans-serif'],
        'sans':     ['Inter', 'sans-serif'],
        'display':  ['Manrope', 'sans-serif'],
        'mono':     ['JetBrains Mono', 'monospace'],
      },

      fontSize: {
        // Visual DNA 2.1 Typography Scale
        'display-lg':        ['4.5rem',   { lineHeight: '5rem',   letterSpacing: '-0.04em', fontWeight: '800' }], // 72px
        'display-lg-mobile': ['2.75rem',  { lineHeight: '3.25rem', letterSpacing: '-0.02em', fontWeight: '800' }], // 44px
        'headline-xl':       ['3rem',     { lineHeight: '3.5rem', letterSpacing: '-0.02em', fontWeight: '700' }], // 48px
        'headline-lg':       ['2rem',     { lineHeight: '2.5rem', letterSpacing: '-0.01em', fontWeight: '700' }], // 32px
        'headline-md':       ['1.5rem',   { lineHeight: '2rem',   fontWeight: '600' }],                           // 24px
        'body-lg':           ['1.125rem', { lineHeight: '1.75rem', fontWeight: '400' }],                           // 18px
        'body-md':           ['1rem',     { lineHeight: '1.5rem',  fontWeight: '400' }],                           // 16px
        'label-sm':          ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.02em', fontWeight: '600' }], // 14px
        'mono-label':        ['0.75rem',  { lineHeight: '1rem',    letterSpacing: '0.05em', fontWeight: '500' }], // 12px
      },

      borderRadius: {
        'sm':    '0.25rem', // 4px
        DEFAULT: '0.5rem',  // 8px
        'md':    '0.75rem', // 12px - inputs
        'lg':    '1rem',    // 16px
        'xl':    '1.25rem', // 20px - containers / cards
        '2xl':   '1.375rem',// 22px - marketplace cards
        '3xl':   '1.75rem', // 28px - modals
        'full':  '9999px',  // pills / interactive
      },

      boxShadow: {
        // Visual DNA 2.1 Refined Ambient Elevation
        'ambient':     '0 8px 24px rgba(0, 0, 0, 0.06)',
        'card':        '0 8px 24px rgba(0, 0, 0, 0.06)',
        'float':       '0 20px 60px rgba(0, 0, 0, 0.10)',
        'cta':         '0 6px 20px rgba(15, 99, 27, 0.25)',
        'cta-hover':   '0 10px 28px rgba(15, 99, 27, 0.35)',
        'glass':       '0 8px 24px rgba(0, 0, 0, 0.06)',
        'none':        'none',
      },

      backgroundImage: {
        'cta-gradient':       'linear-gradient(135deg, #00490e 0%, #0f631b 100%)',
        'cta-gradient-hover': 'linear-gradient(135deg, #005311 0%, #1d6d24 100%)',
        'solar-flare':        'radial-gradient(circle at top right, #fcf2eb 0%, #fff8f5 100%)',
        'hero-mesh':          'radial-gradient(ellipse at 80% 0%, rgba(136, 217, 130, 0.08) 0%, transparent 60%)',
        'section-light':      'linear-gradient(180deg, #fff8f5 0%, #f6ece6 100%)',
      },

      spacing: {
        // 4px baseline system & Sovereign Grid tokens
        'gutter':         '2rem',      // 32px
        'margin-desktop': '5rem',      // 80px
        'margin-tablet':  '2.5rem',    // 40px
        'margin-mobile':  '1.25rem',   // 20px
        'section-gap':    '7.5rem',    // 120px
      },

      transitionTimingFunction: {
        // Visual DNA 2.1 Calibrated Engineered motion
        'glide':     'cubic-bezier(0.2, 0, 0, 1)',
        'smooth':    'cubic-bezier(0.2, 0, 0, 1)',
        'enter':     'cubic-bezier(0.2, 0, 0, 1)',
        'spring':    'cubic-bezier(0.2, 0, 0, 1)',
      },

      transitionDuration: {
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '250': '250ms',
        '300': '300ms',
        '400': '400ms',
      },

      maxWidth: {
        'content': '1200px',
        'wide':    '1440px',
      },

      backdropBlur: {
        'nav': '24px',
        'card': '24px',
        'overlay': '24px',
      },
    },
  },
  plugins: [],
};

export default config;
