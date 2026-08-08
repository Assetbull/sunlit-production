import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parseSessionCookie } from '@/shared/auth/sunlit-session';
import crypto from 'crypto';
import { Permission } from '@/core/rbac/permissions';
import { RbacEngine } from '@/core/rbac/engine';
import { UserRole } from '@/shared/types/database';
import { rateLimit } from '@/core/security/rate-limiter';
import { createClient } from '@supabase/supabase-js';

/**
 * Centralized API Guard
 * 
 * Enforces the GEMINI.md defense-in-depth pipeline for EVERY protected API route:
 *   1. Authentication (Clerk JWT)
 *   2. Rate Limiting (Redis-backed)
 *   3. RBAC Authorization (deny-by-default)
 *   4. Correlation ID (for audit trail)
 *   5. IP extraction (for audit logging)
 * 
 * GEMINI.md §4: "Verify JWT on EVERY request"
 * GEMINI.md §4: "deny by default (zero-trust)"
 */

export interface GuardContext {
    userId: string;
    userRole: UserRole;
    correlationId: string;
    ipAddress: string;
}

export interface GuardOptions {
    /** Required permission for this action. If omitted, only authentication is enforced. */
    requiredPermission?: Permission;
    /** Rate limit: max requests per window. Default: 60 */
    rateLimitMax?: number;
    /** Rate limit window in seconds. Default: 60 */
    rateLimitWindow?: number;
    /** Skip authentication (e.g., for public webhook endpoints). Default: false */
    skipAuth?: boolean;
}

/**
 * Returns either a GuardContext on success or a NextResponse error.
 * 
 * Usage in API routes:
 * ```
 * const guard = await apiGuard(req, { requiredPermission: 'create:rfq' });
 * if (guard instanceof NextResponse) return guard; // Error response
 * // guard.userId, guard.userRole, guard.correlationId, guard.ipAddress available
 * ```
 */
export async function apiGuard(
    req: Request,
    options: GuardOptions = {}
): Promise<GuardContext | NextResponse> {
    const correlationId = crypto.randomUUID();
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
        || req.headers.get('x-real-ip')
        || 'unknown';

    try {
        // 1. Authentication
        if (!options.skipAuth) {
            const cookieStore = await cookies();
            const sessionRaw = cookieStore.get('sunlit_session')?.value;
            const session = parseSessionCookie(sessionRaw);
            
            const userId = session?.user_id;

            if (!userId || !sessionRaw) {
                return NextResponse.json(
                    { error: 'Unauthorized', correlation_id: correlationId },
                    { status: 401 }
                );
            }

            // 2. Rate Limiting
            const limit = options.rateLimitMax ?? 60;
            const window = options.rateLimitWindow ?? 60;
            const allowed = await rateLimit(userId, limit, window);
            if (!allowed) {
                return NextResponse.json(
                    { error: 'Rate limit exceeded. Try again later.', correlation_id: correlationId },
                    { status: 429 }
                );
            }

            // 3. RBAC 
            let userRole: UserRole | undefined = session?.role as UserRole;

            // 4. Permission Check (deny-by-default)
            if (options.requiredPermission) {
                try {
                    RbacEngine.enforcePermission(userRole, options.requiredPermission);
                } catch (e: unknown) {
                    const message = e instanceof Error ? e.message : 'Forbidden';
                    return NextResponse.json(
                        { error: message, correlation_id: correlationId },
                        { status: 403 }
                    );
                }
            }

            return {
                userId,
                userRole: userRole ?? 'project_owner',
                correlationId,
                ipAddress,
            };
        }

        // For skipAuth routes
        return {
            userId: 'system',
            userRole: 'admin' as UserRole,
            correlationId,
            ipAddress,
        };
    } catch (e: unknown) {
        console.error('[ApiGuard] Unhandled error:', e);
        return NextResponse.json(
            { error: 'Internal Server Error Contextualized', detail: e instanceof Error ? e.message : String(e), correlation_id: correlationId },
            { status: 500 }
        );
    }
}
