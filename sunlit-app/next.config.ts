import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'off',
  },
  {
    // Content Security Policy — defense against XSS, code injection, data exfiltration.
    // script-src 'self' 'unsafe-inline' allows Next.js inline scripts.
    // connect-src allows Supabase, Clerk, analytics, and local dev.
    // font-src allows Google Fonts.
    // img-src allows external image providers (Unsplash, Pravatar, Google).
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://images.unsplash.com https://i.pravatar.cc https://lh3.googleusercontent.com",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.clerk.dev https://*.clerk.accounts.dev",
      "frame-src 'self' https://challenges.cloudflare.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  // Compress assets using gzip/brotli to minimize bandwidth on mobile networks
  compress: true,
  // Optimize package imports for tree-shaking icon and utility libraries
  experimental: {
    optimizePackageImports: ['lucide-react', 'react-icons'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/tools/pv-string-layout',
        destination: '/tools/pv-configuration',
        permanent: true,
      },
      {
        source: '/tools/solar-cable-sizing',
        destination: '/tools/cable-sizing',
        permanent: true,
      },
      {
        source: '/tools/solar-roi-payback',
        destination: '/tools/roi-calculator',
        permanent: true,
      },
      {
        source: '/tools/appliance-load',
        destination: '/tools/load-calculator',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
