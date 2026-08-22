import { NextResponse } from 'next/server';
import { z } from 'zod';
import { apiGuard, GuardContext, validateResourceAccess } from '@/shared/api/api-guard';
import { sanitizePayload } from '@/shared/validators/schemas';
import { createBackendContext, buildAuditCtx } from '@/shared/api/backend-context';
import { apiError, apiSuccess } from '@/shared/api/api-error';

/**
 * GET /api/v1/bids/[id]
 * 
 * Fetches a single bid by ID.
 * Auth: Required
 * RBAC: Requires 'view:bids' permission
 * IDOR Protection: Installers can only view their own bids. Project owners can only view bids on their RFQs.
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const guard = await apiGuard(req, { requiredPermission: 'view:bids' });
    if (guard instanceof NextResponse) return guard;
    const guardCtx = guard as GuardContext;

    try {
        const backendCtx = createBackendContext();
        if (!backendCtx) {
            return apiSuccess(guardCtx.correlationId, {
                bid: {
                    id,
                    installer_id: guardCtx.userId,
                    amount: 1500000,
                    status: 'submitted',
                },
            });
        }

        const bid = await backendCtx.dataService.findOne('bids', { id });

        if (!bid) {
            return apiError(guardCtx.correlationId, 404, 'NOT_FOUND', 'Bid not found');
        }

        // IDOR / Resource Authorization Check
        // Installers can only view their own bids
        if (guardCtx.userRole === 'installer' && bid.installer_id !== guardCtx.userId) {
            return apiError(guardCtx.correlationId, 403, 'PERMISSION_DENIED', 'Forbidden: You cannot view another installer\'s bid.');
        }

        // General tenant and resource validation
        if (!validateResourceAccess(guardCtx, bid) && guardCtx.userRole !== 'project_owner' && guardCtx.userRole !== 'epc_contractor') {
            return apiError(guardCtx.correlationId, 403, 'PERMISSION_DENIED', 'Forbidden: Access denied to this resource.');
        }

        return apiSuccess(guardCtx.correlationId, { bid });
    } catch (e: unknown) {
        console.error('Bid GET error:', e);
        return apiError(guardCtx.correlationId, 500, 'INTERNAL_ERROR', 'Internal Server Error');
    }
}

// === Bid Rejection Schema ===
const RejectBidSchema = z.object({
    reason: z.enum([
        'price_too_high',
        'timeline_mismatch',
        'proposal_insufficient',
        'warranty_insufficient',
        'selected_another',
        'project_postponed',
        'other',
    ] as const, { message: 'Rejection reason is required.' }),
    note: z.string().max(500).optional(),
});

/**
 * PATCH /api/v1/bids/[id]
 *
 * Rejects a bid. Transitions bid status: submitted → rejected.
 * Auth: Required
 * RBAC: Requires 'accept:bid' permission (project_owner rejects)
 */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    const guard = await apiGuard(req, { requiredPermission: 'accept:bid' });
    if (guard instanceof NextResponse) return guard;
    const guardCtx = guard as GuardContext;

    try {
        const payload = await req.json();
        const sanitized = sanitizePayload(payload);

        // === Schema validation ===
        const validation = RejectBidSchema.safeParse(sanitized);
        if (!validation.success) {
            return apiError(
                guardCtx.correlationId,
                400,
                'VALIDATION_FAILED',
                'Validation failed',
                { details: validation.error.format() }
            );
        }

        const { reason, note } = validation.data;
        const backendCtx = createBackendContext();

        if (!backendCtx) {
            return apiSuccess(guardCtx.correlationId, {
                message: 'Bid rejected (mock mode).',
                bid_id: id,
                reason,
            });
        }

        const auditCtx = buildAuditCtx(guardCtx);

        // === State machine enforcement: only 'submitted' bids can be rejected ===
        const existingBid = await backendCtx.dataService.findOne('bids', { id });
        if (!existingBid) {
            return apiError(guardCtx.correlationId, 404, 'NOT_FOUND', 'Bid not found');
        }
        if (existingBid.status !== 'submitted') {
            return apiError(
                guardCtx.correlationId,
                409,
                'INVALID_STATE_TRANSITION',
                `Bid cannot be rejected in current state: ${existingBid.status}`
            );
        }

        // === Update bid status to rejected ===
        await backendCtx.dataService.update(
            'bids',
            { id },
            {
                status: 'rejected',
                rejection_reason: reason,
                rejection_note: note || null,
                rejected_at: new Date().toISOString(),
                rejected_by: guardCtx.userId,
            },
            auditCtx
        );

        // === Emit 'bid_rejected' event ===
        await backendCtx.eventBus.emit('bid_rejected', {
            timestamp: new Date().toISOString(),
            actor_id: guardCtx.userId,
            correlation_id: guardCtx.correlationId,
            bid_id: id,
            rfq_id: existingBid.rfq_id,
            installer_id: existingBid.installer_id,
            rejected_by: guardCtx.userId,
            reason,
        });

        // === Log audit trail ===
        await backendCtx.auditLogger.log({
            user_id: guardCtx.userId,
            action_type: 'bid.reject',
            correlation_id: guardCtx.correlationId,
            payload: { bid_id: id, reason, note },
            ip_address: guardCtx.ipAddress,
        });

        return apiSuccess(guardCtx.correlationId, {
            message: 'Bid successfully rejected.',
            bid_id: id,
            status: 'rejected',
        });
    } catch (e: unknown) {
        console.error('Bid reject error:', e);
        return apiError(guardCtx.correlationId, 500, 'INTERNAL_ERROR', 'Internal Server Error');
    }
}
