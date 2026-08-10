/**
 * Global runtime configuration.
 *
 * USE_REAL_API controls whether the application uses real backend services
 * (Supabase, Clerk, payment providers) or mock implementations.
 *
 * SECURITY: In production, USE_REAL_API is ALWAYS true regardless of
 * environment variable settings. Mock services must never be active in production.
 *
 * Development: Reads from NEXT_PUBLIC_USE_REAL env var. Defaults to false.
 */
export const USE_REAL_API: boolean =
  process.env.NODE_ENV === 'production'
    ? true
    : process.env.NEXT_PUBLIC_USE_REAL === 'true';

