import { NextResponse } from 'next/server';
import { apiGuard } from '@/shared/api/api-guard';

/**
 * GET /api/v1/matching/[rfqId]
 * 
 * Returns matched installers for an RFQ.
 * Auth: Required
 * RBAC: Requires 'read:rfq' permission
 * 
 * In production, this integrates with the Python Matching Engine
 * via an internal API call or event-based request.
 */
export async function GET(req: Request, { params }: { params: Promise<{ rfqId: string }> }) {
    const guard = await apiGuard(req, { requiredPermission: 'read:rfq' });
    if (guard instanceof NextResponse) return guard;

    try {
        const { rfqId } = await params;

        // TODO: Wire to Python Matching Engine via internal service call
        // 1. Validate rfqId exists via DataService
        // 2. Call matching engine: POST http://localhost:8000/match { rfq_id: rfqId }
        // 3. auditLogger.log({ user_id: guard.userId, action_type: 'matching.query', correlation_id: guard.correlationId, payload: { rfq_id: rfqId }, ip_address: guard.ipAddress })

        // Placeholder response until matching engine is wired
        return NextResponse.json({
            success: true,
            rfq_id: rfqId,
            matches: [],
            correlation_id: guard.correlationId,
        });
    } catch (e: unknown) {
        console.error('Matching error:', e);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
