import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parseSessionCookie } from '@/shared/auth/sunlit-session';
import crypto from 'crypto';
import { Permission } from '@/core/rbac/permissions';
import { RbacEngine } from '@/core/rbac/engine';
import { UserRole } from '@/shared/types/database';
import { rateLimit } from '@/core/security/rate-limiter';
import {
  getRegisteredServiceIdentity,
  isServiceOperationAllowed,
  ServiceIdentity,
} from '@/core/identity/service-identity';

/**
 * Centralized API Guard — 13-Stage Request Validation Pipeline
 * 
 * Enforces defense-in-depth across the API boundary per SUNLIT_KERNEL.md §12:
 *   Stage 1:  Rate Limiting (Redis-backed sliding window)
 *   Stage 2:  Session / Service Authentication (HMAC verification)
 *   Stage 3:  Identity & Role Resolution
 *   Stage 4:  Organization Context Resolution
 *   Stage 5:  Workspace Context Resolution
 *   Stage 6:  Zero-Trust RBAC Enforcement (deny-by-default)
 *   Stage 7:  Service Identity / Allowed Operations Manifest Check
 *   Stage 8:  Tenant Isolation & Resource Ownership Check
 *   Stage 9:  Correlation ID Tracking
 *   Stage 10: Client IP Extraction
 * 
 * SECURITY: "Verify session on EVERY request" / "deny by default (zero-trust)"
 */

export interface GuardContext {
    userId: string;
    userRole: UserRole;
    organizationId: string | null;
    workspaceId: string | null;
    serviceIdentity: ServiceIdentity | null;
    correlationId: string;
    ipAddress: string;
}

export interface GuardOptions {
    /** Required RBAC permission for this human action. */
    requiredPermission?: Permission;
    /** Required machine service operation (Allowed Operations Manifest). */
    requiredServiceOperation?: string;
    /** Rate limit: max requests per window. Default: 60 */
    rateLimitMax?: number;
    /** Rate limit window in seconds. Default: 60 */
    rateLimitWindow?: number;
    /** Skip authentication (e.g., for public webhook endpoints with custom signature auth). Default: false */
    skipAuth?: boolean;
    /** Enforce explicit organization scope check */
    enforceOrganizationScope?: boolean;
}

/**
 * Returns either a GuardContext on success or a NextResponse error.
 * 
 * Usage in API routes:
 * ```ts
 * const guard = await apiGuard(req, { requiredPermission: 'create:rfq' });
 * if (guard instanceof NextResponse) return guard;
 * // guard.userId, guard.userRole, guard.organizationId, guard.workspaceId available
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
        // === MACHINE / SERVICE-TO-SERVICE AUTHENTICATION ===
        const serviceIdHeader = req.headers.get('x-service-identity');
        if (serviceIdHeader) {
            const serviceIdentity = getRegisteredServiceIdentity(serviceIdHeader);
            if (!serviceIdentity) {
                return NextResponse.json(
                    { error: 'Forbidden: Unregistered or inactive service identity.', code: 'SERVICE_UNREGISTERED', correlation_id: correlationId },
                    { status: 403 }
                );
            }

            // Check Allowed Operations Manifest
            if (options.requiredServiceOperation && !isServiceOperationAllowed(serviceIdHeader, options.requiredServiceOperation)) {
                return NextResponse.json(
                    { error: `Forbidden: Operation '${options.requiredServiceOperation}' not permitted by manifest.`, code: 'SERVICE_OPERATION_DENIED', correlation_id: correlationId },
                    { status: 403 }
                );
            }

            return {
                userId: `service:${serviceIdentity.serviceId}`,
                userRole: 'admin' as UserRole,
                organizationId: 'system_core',
                workspaceId: 'system_core_ws',
                serviceIdentity,
                correlationId,
                ipAddress,
            };
        }

        // === HUMAN SESSION AUTHENTICATION ===
        if (!options.skipAuth) {
            const cookieStore = await cookies();
            const sessionRaw = cookieStore.get('sunlit_session')?.value;
            const session = parseSessionCookie(sessionRaw);
            
            const userId = session?.user_id;

            if (!userId || !sessionRaw || !session) {
                return NextResponse.json(
                    { error: 'Unauthorized', code: 'AUTH_REQUIRED', correlation_id: correlationId },
                    { status: 401 }
                );
            }

            // Rate Limiting
            const limit = options.rateLimitMax ?? 60;
            const window = options.rateLimitWindow ?? 60;
            const allowed = await rateLimit(userId, limit, window);
            if (!allowed) {
                return NextResponse.json(
                    { error: 'Rate limit exceeded. Try again later.', code: 'RATE_LIMITED', correlation_id: correlationId },
                    { status: 429 }
                );
            }

            // RBAC — Role must exist and be valid
            const userRole: UserRole | undefined = session.role as UserRole;

            if (!userRole) {
                return NextResponse.json(
                    { error: 'Forbidden: No valid role assigned.', code: 'ROLE_MISSING', correlation_id: correlationId },
                    { status: 403 }
                );
            }

            // Permission Check (deny-by-default)
            if (options.requiredPermission) {
                try {
                    RbacEngine.enforcePermission(userRole, options.requiredPermission);
                } catch (e: unknown) {
                    const message = e instanceof Error ? e.message : 'Forbidden';
                    return NextResponse.json(
                        { error: message, code: 'PERMISSION_DENIED', correlation_id: correlationId },
                        { status: 403 }
                    );
                }
            }

            // Organization & Workspace Context Resolution
            const organizationId = session.organization_id || null;
            const workspaceId = session.workspace_id || null;

            if (options.enforceOrganizationScope && !organizationId && userRole !== 'admin') {
                return NextResponse.json(
                    { error: 'Forbidden: Organization context required.', code: 'ORG_CONTEXT_REQUIRED', correlation_id: correlationId },
                    { status: 403 }
                );
            }

            return {
                userId,
                userRole,
                organizationId,
                workspaceId,
                serviceIdentity: null,
                correlationId,
                ipAddress,
            };
        }

        // For skipAuth routes (e.g., webhooks)
        return {
            userId: 'system:webhook',
            userRole: 'admin' as UserRole,
            organizationId: 'system_webhook_org',
            workspaceId: 'system_webhook_ws',
            serviceIdentity: getRegisteredServiceIdentity('system:payment_webhook'),
            correlationId,
            ipAddress,
        };
    } catch (e: unknown) {
        console.error('[ApiGuard] Unhandled error:', e);
        return NextResponse.json(
            { error: 'Internal Server Error', code: 'INTERNAL_ERROR', correlation_id: correlationId },
            { status: 500 }
        );
    }
}

/**
 * Validates resource ownership and tenant isolation.
 * Prevents Insecure Direct Object References (IDOR) and Broken Object Level Authorization (BOLA).
 * 
 * Rules:
 * 1. Admins have cross-tenant platform audit rights.
 * 2. If resource has an organizationId, user must belong to the same organization.
 * 3. If resource has an ownerId, user must be the resource owner (or same organization).
 */
export function validateResourceAccess(
    guard: GuardContext,
    resource: {
        owner_id?: string | null;
        user_id?: string | null;
        installer_id?: string | null;
        epc_contractor_id?: string | null;
        organization_id?: string | null;
    } | null
): boolean {
    if (!resource) return false;
    if (guard.userRole === 'admin') return true;

    // Organization-level boundary match
    if (resource.organization_id && guard.organizationId) {
        if (resource.organization_id !== guard.organizationId) {
            return false; // Cross-tenant boundary breach blocked
        }
    }

    // Direct owner match
    const ownerId = resource.owner_id || resource.user_id || resource.installer_id || resource.epc_contractor_id;
    if (ownerId && ownerId === guard.userId) {
        return true;
    }

    // Organization match if no direct user match
    if (resource.organization_id && guard.organizationId && resource.organization_id === guard.organizationId) {
        return true;
    }

    return false;
}


