import { NextResponse } from 'next/server';
import { apiGuard, GuardContext } from '@/shared/api/api-guard';
import { DataService } from '@/shared/api/data-service';
import { AuditLogger } from '@/core/audit/logger';
import { EventBus } from '@/core/event-bus/emitter';
import { createClient } from '@supabase/supabase-js';

/**
 * GET /api/v1/rfq/[id]/bids
 *
 * Lists all bids for a specific RFQ. Project Owner only.
 * Each bid includes: price, timeline, proposal, installer rating,
 * and FULL SYSTEM DESIGN (inverter, battery, solar panels, additional components).
 *
 * Auth: Required
 * RBAC: Requires 'view:bids' permission
 */
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const guard = await apiGuard(req, { requiredPermission: 'view:bids' });
    if (guard instanceof NextResponse) return guard;

    const guardCtx = guard as GuardContext;
    const { id: rfqId } = await params;

    if (!rfqId || typeof rfqId !== 'string') {
        return NextResponse.json(
            { error: 'Invalid RFQ ID.', correlation_id: guardCtx.correlationId },
            { status: 400 }
        );
    }

    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey
            || supabaseUrl.includes('your-project-id')
            || supabaseKey.includes('your-service-role-key')) {
            return NextResponse.json({
                success: true,
                bids: [],
                message: 'Supabase not configured.',
                correlation_id: guardCtx.correlationId,
            });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);
        const dataService = new DataService(supabase);

        // Verify RFQ belongs to the authenticated owner
        const rfq = await dataService.findOne('rfq', { id: rfqId, owner_id: guardCtx.userId });
        if (!rfq) {
            return NextResponse.json(
                { error: 'RFQ not found or access denied.', correlation_id: guardCtx.correlationId },
                { status: 404 }
            );
        }

        // Fetch all bids for this RFQ
        const bids = await dataService.findMany('bids', { rfq_id: rfqId });

        return NextResponse.json({
            success: true,
            rfq_id: rfqId,
            bids: bids || [],
            correlation_id: guardCtx.correlationId,
        });
    } catch (e: unknown) {
        console.error('Bids list error:', e);
        return NextResponse.json(
            { error: 'Internal Server Error', correlation_id: guardCtx.correlationId },
            { status: 500 }
        );
    }
}

/**
 * POST /api/v1/rfq/[id]/bids/accept
 *
 * Accepts a specific bid on an RFQ. Triggers bid_accepted event.
 * Auth: Required
 * RBAC: Requires 'accept:bid' permission (project_owner)
 */
export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const guard = await apiGuard(req, { requiredPermission: 'accept:bid' });
    if (guard instanceof NextResponse) return guard;

    const guardCtx = guard as GuardContext;
    const { id: rfqId } = await params;

    try {
        const payload = await req.json();
        const bidId = payload?.bid_id;

        if (!bidId || typeof bidId !== 'string') {
            return NextResponse.json(
                { error: 'bid_id is required.', correlation_id: guardCtx.correlationId },
                { status: 400 }
            );
        }

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
        const eventBus = new EventBus(dataService);
        const auditLogger = new AuditLogger(dataService);

        const auditCtx = {
            user_id: guardCtx.userId,
            correlation_id: guardCtx.correlationId,
            ip_address: guardCtx.ipAddress,
        };

        // Verify RFQ ownership
        const rfq = await dataService.findOne('rfq', { id: rfqId, owner_id: guardCtx.userId });
        if (!rfq) {
            return NextResponse.json(
                { error: 'RFQ not found or access denied.', correlation_id: guardCtx.correlationId },
                { status: 404 }
            );
        }

        // Update bid status to accepted
        await dataService.update('bids', { id: bidId, rfq_id: rfqId }, { status: 'accepted' }, auditCtx);

        // Update RFQ status to matched
        await dataService.update('rfq', { id: rfqId }, { status: 'matched' }, auditCtx);

        // Emit contract_signed event (GEMINI.md §5 — bid acceptance triggers contract)
        await eventBus.emit('contract_signed', {
            timestamp: new Date().toISOString(),
            actor_id: guardCtx.userId,
            correlation_id: guardCtx.correlationId,
            rfq_id: rfqId,
            bid_id: bidId,
            action: 'accepted',
        });

        // Audit log
        await auditLogger.log({
            user_id: guardCtx.userId,
            action_type: 'bid.accept',
            correlation_id: guardCtx.correlationId,
            payload: { rfq_id: rfqId, bid_id: bidId },
            ip_address: guardCtx.ipAddress,
        });

        return NextResponse.json({
            success: true,
            message: 'Bid accepted. Contract generation triggered.',
            rfq_id: rfqId,
            bid_id: bidId,
            correlation_id: guardCtx.correlationId,
        });
    } catch (e: unknown) {
        console.error('Bid accept error:', e);
        return NextResponse.json(
            { error: 'Internal Server Error', correlation_id: guardCtx.correlationId },
            { status: 500 }
        );
    }
}
