import { NextResponse } from 'next/server';
import { sanitizePayload, KycVerifySchema } from '@/shared/validators/schemas';
import { apiGuard } from '@/shared/api/api-guard';

/**
 * POST /api/v1/kyc/verify
 * 
 * Submits KYC verification data.
 * Auth: Required
 * RBAC: No specific permission (self-service KYC)
 * 
 * Requirements.md §8: KYC required for installers, escrow release, transactions > NGN 500,000
 */
export async function POST(req: Request) {
    const guard = await apiGuard(req);
    if (guard instanceof NextResponse) return guard;

    try {
        const payload = await req.json();
        const sanitized = sanitizePayload(payload);

        const validation = KycVerifySchema.safeParse(sanitized);
        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.format(), correlation_id: guard.correlationId },
                { status: 400 }
            );
        }

        // TODO: Wire to KYC providers (Smile Identity, Dojah, VerifyMe)
        // 1. Validate NIN/BVN/CAC via external provider
        // 2. dataService.update('kyc_records', { user_id: guard.userId }, { status: 'verified', ... })
        // 3. eventBus.emit('kyc_verified', { actor_id: guard.userId, correlation_id: guard.correlationId, ... })
        // 4. auditLogger.log({ user_id: guard.userId, action_type: 'kyc.submit', ... })

        return NextResponse.json(
            { success: true, message: 'KYC data submitted for verification.', correlation_id: guard.correlationId }
        );
    } catch (e: unknown) {
        console.error('KYC error:', e);
        return NextResponse.json(
            { error: 'Internal Server Error', correlation_id: guard.correlationId },
            { status: 500 }
        );
    }
}
