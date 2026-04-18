import { NextResponse } from 'next/server';
import { apiGuard, GuardContext } from '@/shared/api/api-guard';
import { DataService } from '@/shared/api/data-service';
import { createClient } from '@supabase/supabase-js';
import { resolveDbUserIdFromClerk } from '@/shared/api/resolve-db-user';

type KycUiStatus = 'pending' | 'verified' | 'failed' | 'needs_review';

function mapDbStatus(db: string | undefined): KycUiStatus {
    switch (db) {
        case 'verified':
            return 'verified';
        case 'rejected':
            return 'failed';
        case 'needs_review':
            return 'needs_review';
        default:
            return 'pending';
    }
}

/**
 * GET /api/v1/kyc/status
 */
export async function GET(req: Request) {
    const guard = await apiGuard(req);
    if (guard instanceof NextResponse) return guard;

    const guardCtx = guard as GuardContext;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey
        || supabaseUrl.includes('your-project-id')
        || supabaseKey.includes('your-service-role-key')) {
        return NextResponse.json({
            success: true,
            data: { status: 'pending' as const, canFundEscrow: false },
            correlation_id: guardCtx.correlationId,
        });
    }

    try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const dataService = new DataService(supabase);
        const internalId = await resolveDbUserIdFromClerk(dataService, guardCtx.userId);

        if (!internalId) {
            return NextResponse.json({
                success: true,
                data: { status: 'pending' as const, canFundEscrow: false },
                correlation_id: guardCtx.correlationId,
            });
        }

        let record: { status?: string } | null = null;
        try {
            record = await dataService.findOne('kyc_records', { user_id: internalId });
        } catch {
            record = null;
        }

        const status = mapDbStatus(record?.status);
        const canFundEscrow = status === 'verified';

        return NextResponse.json({
            success: true,
            data: { status, canFundEscrow },
            correlation_id: guardCtx.correlationId,
        });
    } catch (e: unknown) {
        console.error('[kyc/status]', e);
        return NextResponse.json(
            { error: 'Internal Server Error', correlation_id: guardCtx.correlationId },
            { status: 500 }
        );
    }
}
