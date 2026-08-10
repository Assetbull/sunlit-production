/**
 * Site URL & Canonical Origin Resolution
 * 
 * Hierarchy:
 * 1. NEXT_PUBLIC_SITE_URL (explicit environment override)
 * 2. VERCEL_URL / NEXT_PUBLIC_VERCEL_URL (automatic Vercel preview/deployment host)
 * 3. Default fallback: https://sunlit.energy
 */

export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, '');
  }
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL.replace(/\/+$/, '')}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/+$/, '')}`;
  }
  return 'https://sunlit.energy';
}

export function getCanonicalUrl(path: string): string {
  const base = getSiteUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}
