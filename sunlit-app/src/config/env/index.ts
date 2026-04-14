import { z } from 'zod';

/**
 * M4 fix: Lazy environment validation.
 * 
 * Instead of parsing eagerly at module import (which crashes the build
 * if any vars are missing), we validate lazily via a getter function.
 * Critical vars are required; optional service vars have defaults.
 */

const envSchema = z.object({
    // Required — app crashes without these
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
    CLERK_SECRET_KEY: z.string().min(1),
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

    // Optional — graceful degradation if missing
    REDIS_URL: z.string().optional(),
    PAYSTACK_SECRET_KEY: z.string().optional(),
    NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: z.string().optional(),
    FLUTTERWAVE_SECRET_KEY: z.string().optional(),
    FLUTTERWAVE_SECRET_HASH: z.string().optional(),
    NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().optional(),
    NEXT_PUBLIC_SANITY_DATASET: z.string().optional(),
    SANITY_API_TOKEN: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

let _cachedEnv: Env | null = null;

/**
 * Returns validated environment variables.
 * Throws on first call if required vars are missing.
 * Caches the result for subsequent calls.
 */
export function getEnv(): Env {
    if (_cachedEnv) return _cachedEnv;

    const result = envSchema.safeParse(process.env);
    if (!result.success) {
        console.error('❌ Environment validation failed:', result.error.format());
        throw new Error(
            `Missing or invalid environment variables: ${result.error.issues.map((i) => i.path.join('.')).join(', ')}`
        );
    }

    _cachedEnv = result.data;
    return _cachedEnv;
}
