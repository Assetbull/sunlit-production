import { NextResponse } from 'next/server';
import { SubmitBidSchema, sanitizePayload } from '@/shared/validators/schemas';
import { apiGuard } from '@/shared/api/api-guard';

/**
 * POST /api/v1/bids
 * 
 * Submits a bid on an RFQ.
 * Auth: Required
 * RBAC: Requires 'submit:bid' permission (installer, crewlink, epc_contractor)
 */
export async function POST(req: Request) {
    const guard = await apiGuard(req, { requiredPermission: 'submit:bid' });
    if (guard instanceof NextResponse) return guard;

    try {
        const payload = await req.json();
        const sanitized = sanitizePayload(payload);

        const validation = SubmitBidSchema.safeParse(sanitized);
        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.format(), correlation_id: guard.correlationId },
                { status: 400 }
            );
        }

        // TODO: Wire to DataService + EventBus
        // 1. dataService.create('bids', { installer_id: guard.userId, ...validation.data })
        // 2. eventBus.emit('bid_submitted', { actor_id: guard.userId, correlation_id: guard.correlationId, ... })
        // 3. auditLogger.log({ user_id: guard.userId, action_type: 'bid.submit', correlation_id: guard.correlationId, payload: validation.data, ip_address: guard.ipAddress })

        return NextResponse.json(
            { success: true, message: 'Bid submitted.', correlation_id: guard.correlationId }
        );
    } catch (e: unknown) {
        console.error('Bid submit error:', e);
        return NextResponse.json(
            { error: 'Internal Server Error', correlation_id: guard.correlationId },
            { status: 500 }
        );
    }
}
