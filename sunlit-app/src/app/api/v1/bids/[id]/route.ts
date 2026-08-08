import { NextResponse } from 'next/server';
import { z } from 'zod';
import { apiGuard, GuardContext } from '@/shared/api/api-guard';
import { sanitizePayload } from '@/shared/validators/schemas';
import { DataService } from '@/shared/api/data-service';
import { EventBus } from '@/core/event-bus/emitter';
import { AuditLogger } from '@/core/audit/logger';
import { createClient } from '@supabase/supabase-js';

/**
 * GET /api/v1/bids/[id]
 * 
 * Fetches a single bid by ID.
 * Auth: Required
 * RBAC: Requires 'view:bids' permission
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const guard = await apiGuard(req, { requiredPermission: 'view:bids' });
    if (guard instanceof NextResponse) return guard;
    const guardCtx = guard as GuardContext;

    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey
            || supabaseUrl.includes('your-project-id')
            || supabaseKey.includes('your-service-role-key')) {
            return NextResponse.json({
                success: false,
                error: 'Supabase not configured.',
                correlation_id: guardCtx.correlationId,
            }, { status: 503 });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);
        const dataService = new DataService(supabase);

        const bid = await dataService.findOne('bids', { id });

        if (!bid) {
            return NextResponse.json(
                { error: 'Bid not found', correlation_id: guardCtx.correlationId },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            bid,
            correlation_id: guardCtx.correlationId,
        });
    } catch (e: unknown) {
        console.error('Bid GET error:', e);
        return NextResponse.json(
            { error: 'Internal Server Error', correlation_id: guardCtx.correlationId },
            { status: 500 }
        );
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
 *
 * FLOW:
 *   1. Authenticate + RBAC check (project_owner only)
 *   2. Validate rejection reason via RejectBidSchema
 *   3. Validate bid exists and is in 'submitted' state (state machine enforcement)
 *   4. Update bid status → 'rejected'
 *   5. Emit 'bid_rejected' event
 *   6. Log audit trail
 *
 * FAIL IF:
 *   - Bid is not in 'submitted' state
 *   - Rejection reason not provided
 *   - Event not emitted
 */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    // Project owner needs accept:bid permission to accept OR reject bids
    const guard = await apiGuard(req, { requiredPermission: 'accept:bid' });
    if (guard instanceof NextResponse) return guard;
    const guardCtx = guard as GuardContext;

    try {
        const payload = await req.json();
        const sanitized = sanitizePayload(payload);

        // === Schema validation ===
        const validation = RejectBidSchema.safeParse(sanitized);
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

        const { reason, note } = validation.data;

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey
            || supabaseUrl.includes('your-project-id')
            || supabaseKey.includes('your-service-role-key')) {
            // Graceful mock fallback — log and return success
            console.warn('[BID REJECT] Supabase not configured — mock success returned.');
            return NextResponse.json({
                success: true,
                message: 'Bid rejected (mock mode).',
                bid_id: id,
                reason,
                correlation_id: guardCtx.correlationId,
            });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);
        const dataService = new DataService(supabase);
        const eventBus = new EventBus(dataService);
        const auditLogger = new AuditLogger(dataService);

        const auditCtx = {
            user_id: guardCtx.userId,
            correlation_id: guardCtx.correlationId,
            ip_address: guardCtx.ipAddress,
        };

        // === State machine enforcement: only 'submitted' bids can be rejected ===
        const existingBid = await dataService.findOne('bids', { id });
        if (!existingBid) {
            return NextResponse.json(
                { error: 'Bid not found', correlation_id: guardCtx.correlationId },
                { status: 404 }
            );
        }
        if (existingBid.status !== 'submitted') {
            return NextResponse.json(
                {
                    error: `Bid cannot be rejected in current state: ${existingBid.status}`,
                    correlation_id: guardCtx.correlationId,
                },
                { status: 409 }
            );
        }

        // === Update bid status to rejected ===
        await dataService.update(
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

        // === Emit bid_rejected event ===
        await eventBus.emit('bid_rejected', {
            timestamp: new Date().toISOString(),
            actor_id: guardCtx.userId,
            correlation_id: guardCtx.correlationId,
            bid_id: id,
            rfq_id: existingBid.rfq_id,
            installer_id: existingBid.installer_id,
            reason,
            note: note || null,
        });

        // === Audit log ===
        await auditLogger.log({
            user_id: guardCtx.userId,
            action_type: 'bid.reject',
            correlation_id: guardCtx.correlationId,
            payload: { bid_id: id, reason, note },
            ip_address: guardCtx.ipAddress,
        });

        return NextResponse.json({
            success: true,
            message: 'Bid rejected successfully.',
            bid_id: id,
            reason,
            correlation_id: guardCtx.correlationId,
        });
    } catch (e: unknown) {
        console.error('Bid reject error:', e);
        return NextResponse.json(
            { error: 'Internal Server Error', correlation_id: guardCtx.correlationId },
            { status: 500 }
        );
    }
}
