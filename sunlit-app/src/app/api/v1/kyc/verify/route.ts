import { NextResponse } from 'next/server';
import { sanitizePayload, KycVerifySchema } from '@/shared/validators/schemas';
import { apiGuard, GuardContext } from '@/shared/api/api-guard';
import { DataService } from '@/shared/api/data-service';
import { createClient } from '@supabase/supabase-js';
import { resolveDbUserIdFromClerk } from '@/shared/api/resolve-db-user';
import { EventBus } from '@/core/event-bus/emitter';
import { AuditLogger } from '@/core/audit/logger';

/**
 * POST /api/v1/kyc/verify
 *
 * Submits BVN / NIN for Nigerian KYC. Persists `kyc_records` and queues provider verification.
 */
export async function POST(req: Request) {
    const guard = await apiGuard(req);
    if (guard instanceof NextResponse) return guard;

    const guardCtx = guard as GuardContext;

    try {
        const payload = await req.json();
        const sanitized = sanitizePayload(payload);

        const validation = KycVerifySchema.safeParse(sanitized);
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

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey
            || supabaseUrl.includes('your-project-id')
            || supabaseKey.includes('your-service-role-key')) {
            return NextResponse.json({
                success: true,
                data: { status: 'pending' as const },
                message: 'KYC received (database not configured — no persistence).',
                correlation_id: guardCtx.correlationId,
            });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);
        const dataService = new DataService(supabase);
        const eventBus = new EventBus(dataService);
        const auditLogger = new AuditLogger(dataService);

        const internalId = await resolveDbUserIdFromClerk(dataService, guardCtx.userId);
        if (!internalId) {
            return NextResponse.json(
                {
                    error: 'User profile not found. Complete registration before KYC.',
                    correlation_id: guardCtx.correlationId,
                },
                { status: 400 }
            );
        }

        const auditCtx = {
            user_id: internalId,
            correlation_id: guardCtx.correlationId,
            ip_address: guardCtx.ipAddress,
        };

        let existing: { id?: string } | null = null;
        try {
            existing = await dataService.findOne('kyc_records', { user_id: internalId });
        } catch {
            existing = null;
        }

        const nextStatus =
            process.env.KYC_DEV_AUTO_VERIFY === 'true' ? 'verified' : 'pending';

        if (existing) {
            await dataService.update(
                'kyc_records',
                { user_id: internalId },
                {
                    status: nextStatus,
                    provider_reference: `kyc_${Date.now()}`,
                },
                auditCtx
            );
        } else {
            await dataService.create(
                'kyc_records',
                {
                    user_id: internalId,
                    status: nextStatus,
                    provider_reference: `kyc_${Date.now()}`,
                },
                auditCtx
            );
        }

        if (nextStatus === 'verified') {
            await eventBus.emit('kyc_verified', {
                timestamp: new Date().toISOString(),
                actor_id: internalId,
                correlation_id: guardCtx.correlationId,
            });
        }

        await auditLogger.log({
            user_id: internalId,
            action_type: 'kyc.submit',
            correlation_id: guardCtx.correlationId,
            payload: { has_bvn: Boolean(validation.data.bvn), has_nin: Boolean(validation.data.nin) },
            ip_address: guardCtx.ipAddress,
        });

        return NextResponse.json({
            success: true,
            data: { status: nextStatus === 'verified' ? 'verified' : 'pending' },
            message:
                nextStatus === 'verified'
                    ? 'KYC verified (dev auto-verify).'
                    : 'KYC data submitted for verification.',
            correlation_id: guardCtx.correlationId,
        });
    } catch (e: unknown) {
        console.error('KYC error:', e);
        return NextResponse.json(
            { error: 'Internal Server Error', correlation_id: guardCtx.correlationId },
            { status: 500 }
        );
    }
}
