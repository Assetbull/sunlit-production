import { NextResponse } from 'next/server';
import { DisputeSchema, sanitizePayload } from '@/shared/validators/schemas';
import { apiGuard, GuardContext } from '@/shared/api/api-guard';
import { createBackendContext, buildAuditCtx } from '@/shared/api/backend-context';
import { apiError, apiSuccess } from '@/shared/api/api-error';
import crypto from 'crypto';

/**
 * POST /api/v1/disputes
 *
 * Raises a dispute on a project/escrow.
 * Auth: Required
 * RBAC: Requires 'raise:dispute' permission
 *
 * CRITICAL: Creating a dispute MUST block escrow release (GEMINI.md §4).
 *   IF dispute == TRUE → BLOCK
 */
export async function POST(req: Request) {
    const guard = await apiGuard(req, { requiredPermission: 'raise:dispute' });
    if (guard instanceof NextResponse) return guard;

    const guardCtx = guard as GuardContext;

    try {
        const payload = await req.json();
        const sanitized = sanitizePayload(payload);

        // === Schema validation ===
        const validation = DisputeSchema.safeParse(sanitized);
        if (!validation.success) {
            return apiError(
                guardCtx.correlationId,
                400,
                'VALIDATION_FAILED',
                'Validation failed',
                { details: validation.error.format() }
            );
        }

        const { project_id, escrow_id, reason } = validation.data;

        // === Generate Case ID ===
        const caseId = `DSP-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

        let disputeRecord = null;

        const backendCtx = createBackendContext();
        if (backendCtx) {
            const auditCtx = buildAuditCtx(guardCtx);

            // === Create dispute record ===
            disputeRecord = await backendCtx.dataService.create(
                'disputes',
                {
                    project_id,
                    escrow_id,
                    raised_by: guardCtx.userId,
                    organization_id: guardCtx.organizationId || null,
                    workspace_id: guardCtx.workspaceId || null,
                    reason,
                    case_id: caseId,
                    is_resolved: false,
                },
                auditCtx
            );

            // === CRITICAL: Block escrow release by setting status to 'disputed' ===
            await backendCtx.dataService.update(
                'escrow',
                { id: escrow_id },
                { status: 'disputed' },
                auditCtx
            );

            // === Emit dispute_created event (GEMINI.md §5) ===
            await backendCtx.eventBus.emit('dispute_created', {
                timestamp: new Date().toISOString(),
                actor_id: guardCtx.userId,
                correlation_id: guardCtx.correlationId,
                dispute_id: disputeRecord?.id,
                case_id: caseId,
                project_id,
                escrow_id,
            });

            // === Audit log ===
            await backendCtx.auditLogger.log({
                user_id: guardCtx.userId,
                action_type: 'dispute.create',
                correlation_id: guardCtx.correlationId,
                payload: {
                    project_id,
                    escrow_id,
                    case_id: caseId,
                    reason,
                },
                ip_address: guardCtx.ipAddress,
            });
        }

        return apiSuccess(
            guardCtx.correlationId,
            {
                message: 'Dispute recorded. Escrow locked.',
                case_id: caseId,
                dispute_id: disputeRecord?.id || null,
            },
            201
        );
    } catch (e: unknown) {
        console.error('Dispute error:', e);
        return apiError(guardCtx.correlationId, 500, 'INTERNAL_ERROR', 'Internal Server Error');
    }
}

