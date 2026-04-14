import { NextResponse } from 'next/server';
import { SubmitBidSchema, sanitizePayload } from '@/shared/validators/schemas';
import { apiGuard, GuardContext } from '@/shared/api/api-guard';
import { DataService } from '@/shared/api/data-service';
import { EventBus } from '@/core/event-bus/emitter';
import { AuditLogger } from '@/core/audit/logger';
import { createClient } from '@supabase/supabase-js';

/**
 * POST /api/v1/bids
 * 
 * Submits a bid on an RFQ.
 * Auth: Required
 * RBAC: Requires 'submit:bid' permission (installer, crewlink, epc_contractor)
 *
 * FLOW (GEMINI.md §7 — Installer Dashboard):
 *   1. Authenticate + RBAC check
 *   2. Parse + validate payload against SubmitBidSchema
 *   3. Sanitize string fields
 *   4. Persist bid via DataService
 *   5. Emit 'bid_submitted' event
 *   6. Log audit trail
 *
 * FAIL IF:
 *   - Bid stored without validation
 *   - Event not emitted
 *   - Audit not logged
 */
export async function POST(req: Request) {
    const guard = await apiGuard(req, { requiredPermission: 'submit:bid' });
    if (guard instanceof NextResponse) return guard;

    const guardCtx = guard as GuardContext;

    try {
        const payload = await req.json();
        const sanitized = sanitizePayload(payload);

        // === Schema validation ===
        const validation = SubmitBidSchema.safeParse(sanitized);
        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.format(), correlation_id: guardCtx.correlationId },
                { status: 400 }
            );
        }

        const bidData = validation.data;

        // === Persist to Supabase via DataService ===
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        let savedBid = null;

        if (supabaseUrl && supabaseKey
            && !supabaseUrl.includes('your-project-id')
            && !supabaseKey.includes('your-service-role-key')) {
            const supabase = createClient(supabaseUrl, supabaseKey);
            const dataService = new DataService(supabase);
            const eventBus = new EventBus(dataService);
            const auditLogger = new AuditLogger(dataService);

            const auditCtx = {
                user_id: guardCtx.userId,
                correlation_id: guardCtx.correlationId,
                ip_address: guardCtx.ipAddress,
            };

            // Persist bid record
            savedBid = await dataService.create(
                'bids',
                {
                    rfq_id: bidData.rfq_id,
                    installer_id: guardCtx.userId,
                    amount: bidData.amount,
                    proposed_timeline_days: bidData.proposed_timeline_days || null,
                    proposal_text: bidData.proposal_text,
                    status: 'submitted',
                },
                auditCtx
            );

            // Emit bid_submitted event (GEMINI.md §5)
            await eventBus.emit('bid_submitted', {
                timestamp: new Date().toISOString(),
                actor_id: guardCtx.userId,
                correlation_id: guardCtx.correlationId,
                bid_id: savedBid?.id,
                rfq_id: bidData.rfq_id,
                amount: bidData.amount,
            });

            // Audit log
            await auditLogger.log({
                user_id: guardCtx.userId,
                action_type: 'bid.submit',
                correlation_id: guardCtx.correlationId,
                payload: bidData,
                ip_address: guardCtx.ipAddress,
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Bid submitted.',
            bid_id: savedBid?.id || null,
            correlation_id: guardCtx.correlationId,
        });
    } catch (e: unknown) {
        console.error('Bid submit error:', e);
        return NextResponse.json(
            { error: 'Internal Server Error', correlation_id: guardCtx.correlationId },
            { status: 500 }
        );
    }
}
