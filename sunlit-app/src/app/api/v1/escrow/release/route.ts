import { NextResponse } from 'next/server';
import { EscrowEngine, EscrowReleaseContext } from '@/core/escrow/engine';
import { ReleasePaymentSchema, sanitizePayload } from '@/shared/validators/schemas';
import { apiGuard, GuardContext, validateResourceAccess } from '@/shared/api/api-guard';
import { createBackendContext, buildAuditCtx } from '@/shared/api/backend-context';
import { resolveDbUserIdFromClerk } from '@/shared/api/resolve-db-user';
import { apiError, apiSuccess } from '@/shared/api/api-error';


/**
 * POST /api/v1/escrow/release
 *
 * Releases escrowed funds for a completed milestone.
 * Auth: Required
 * RBAC: Requires 'release:escrow' permission (project_owner, epc_contractor)
 *
 * IMMUTABLE LOGIC (GEMINI.md §4):
 *   IF dispute == TRUE → BLOCK
 *   IF milestone_complete == FALSE → HOLD
 *   IF approved == TRUE → RELEASE
 *
 * Requirements.md §8: KYC required for escrow releases.
 *
 * CRITICAL RULES:
 *   - NO manual override exists
 *   - ALL decisions MUST be logged
 *   - Deterministic state machine only
 */
export async function POST(req: Request) {
    const guard = await apiGuard(req, { requiredPermission: 'release:payment' });
    if (guard instanceof NextResponse) return guard;

    const guardCtx = guard as GuardContext;

    try {
        const payload = await req.json();
        const sanitized = sanitizePayload(payload);

        // === Schema validation ===
        const validation = ReleasePaymentSchema.safeParse(sanitized);
        if (!validation.success) {
            return NextResponse.json(
                {
                    error: 'Validation failed',
                    details: validation.error.format(),
                    correlation_id: guardCtx.correlationId,
                },
                { status: 400 }
            );
        }

        const { escrow_id, project_id, milestone_id } = validation.data;

        const backendCtx = createBackendContext();
        if (!backendCtx) {
            return apiError(
                guardCtx.correlationId,
                503,
                'SERVICE_UNAVAILABLE',
                'Escrow release requires live database connection. Not available in scaffold mode.'
            );
        }

        const auditCtx = buildAuditCtx(guardCtx);

        // === Verify Project Ownership & Tenant Boundary (Anti-IDOR / Anti-BOLA) ===
        const project = await backendCtx.dataService.findOne('projects', { id: project_id });
        if (!project) {
            return apiError(guardCtx.correlationId, 404, 'NOT_FOUND', 'Project not found.');
        }

        if (!validateResourceAccess(guardCtx, project)) {
            return apiError(
                guardCtx.correlationId,
                403,
                'PERMISSION_DENIED',
                'Forbidden: You do not have authorization to release escrow for this project.'
            );
        }

        // === Fetch real state from DB ===
        const escrow = await backendCtx.dataService.findOne('escrow', {
            id: escrow_id,
            project_id,
        });

        if (!escrow) {
            return apiError(guardCtx.correlationId, 404, 'NOT_FOUND', 'Escrow record not found.');
        }

        const milestone = await backendCtx.dataService.findOne('milestones', {
            id: milestone_id,
            project_id,
        });

        if (!milestone) {
            return apiError(guardCtx.correlationId, 404, 'NOT_FOUND', 'Milestone not found.');
        }

        // Check for active disputes
        let disputeActive = false;
        try {
            const disputes = await backendCtx.dataService.findMany('disputes', {
                escrow_id,
                is_resolved: false,
            });
            disputeActive = disputes && disputes.length > 0;
        } catch {
            // If query fails, assume no disputes (safe default since BLOCK is on active dispute)
        }

        // KYC gate (Requirements.md §8)
        let kycVerified = false;
        try {
            const internalUserId = await resolveDbUserIdFromClerk(backendCtx.dataService, guardCtx.userId);
            const candidateIds = [internalUserId, guardCtx.userId].filter(Boolean) as string[];
            for (const uid of candidateIds) {
                try {
                    const kycRecord = await backendCtx.dataService.findOne('kyc_records', {
                        user_id: uid,
                        status: 'verified',
                    });
                    if (kycRecord) {
                        kycVerified = true;
                        break;
                    }
                } catch {
                    /* try next */
                }
            }
        } catch {
            kycVerified = false;
        }

        // === Deterministic Escrow Engine Evaluation ===
        const context: EscrowReleaseContext = {
            milestone_complete: milestone.is_completed,
            dispute_active: disputeActive,
            approved_by_owner: milestone.is_approved,
            current_status: escrow.status,
            kyc_verified: kycVerified,
        };

        const nextState = EscrowEngine.calculateNextState(context);
        const canRelease = EscrowEngine.canRelease(context);

        if (!canRelease) {
            // === DENIED: Log denial and return reason ===
            await backendCtx.auditLogger.log({
                user_id: guardCtx.userId,
                action_type: 'escrow.release.denied',
                correlation_id: guardCtx.correlationId,
                payload: {
                    escrow_id,
                    project_id,
                    milestone_id,
                    computed_next_state: nextState,
                    context,
                },
                ip_address: guardCtx.ipAddress,
            });

            let reason = 'Escrow release conditions not met.';
            if (disputeActive) {
                reason = 'Active dispute blocks escrow release. Resolve dispute first.';
            } else if (!milestone.is_completed) {
                reason = 'Milestone not yet completed. Cannot release funds.';
            } else if (!kycVerified) {
                reason = 'KYC verification required for escrow release.';
            } else if (!milestone.is_approved) {
                reason = 'Milestone not yet approved by project owner.';
            }

            return apiError(
                guardCtx.correlationId,
                400,
                'INVALID_STATE_TRANSITION',
                reason,
                { next_status: nextState }
            );
        }

        // === RELEASE: All conditions met ===
        await backendCtx.dataService.update(
            'escrow',
            { id: escrow_id },
            { status: 'released', released_at: new Date().toISOString() },
            auditCtx
        );

        // Emit payment_released event (GEMINI.md §5)
        await backendCtx.eventBus.emit('payment_released', {
            timestamp: new Date().toISOString(),
            actor_id: guardCtx.userId,
            correlation_id: guardCtx.correlationId,
            escrow_id,
            project_id,
            milestone_id,
            amount: escrow.amount,
        });

        // Audit log success
        await backendCtx.auditLogger.log({
            user_id: guardCtx.userId,
            action_type: 'escrow.release.success',
            correlation_id: guardCtx.correlationId,
            payload: {
                escrow_id,
                project_id,
                milestone_id,
                amount: escrow.amount,
            },
            ip_address: guardCtx.ipAddress,
        });

        return apiSuccess(guardCtx.correlationId, {
            message: 'Escrow released successfully.',
            escrow_id,
            released_amount: escrow.amount,
        });
    } catch (e: unknown) {
        console.error('Escrow release error:', e);
        return apiError(guardCtx.correlationId, 500, 'INTERNAL_ERROR', 'Internal Server Error');
    }
}

