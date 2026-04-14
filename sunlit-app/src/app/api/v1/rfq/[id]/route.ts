import { NextResponse } from 'next/server';
import { apiGuard, GuardContext } from '@/shared/api/api-guard';
import { DataService } from '@/shared/api/data-service';
import { createClient } from '@supabase/supabase-js';

/**
 * GET /api/v1/rfq/[id]
 *
 * Retrieves a single RFQ by ID for the authenticated project owner.
 * Auth: Required
 * RBAC: Requires 'view:rfq' permission
 */
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const guard = await apiGuard(req, { requiredPermission: 'view:rfq' as any });
    if (guard instanceof NextResponse) return guard;

    const guardCtx = guard as GuardContext;
    const { id } = await params;

    if (!id || typeof id !== 'string') {
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
                success: false,
                error: 'Supabase not configured.',
                correlation_id: guardCtx.correlationId,
            }, { status: 503 });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);
        const dataService = new DataService(supabase);

        const rfq = await dataService.findOne('rfq', { id, owner_id: guardCtx.userId });

        return NextResponse.json({
            success: true,
            rfq,
            correlation_id: guardCtx.correlationId,
        });
    } catch (e: unknown) {
        console.error('RFQ fetch error:', e);
        return NextResponse.json(
            { error: 'RFQ not found or access denied.', correlation_id: guardCtx.correlationId },
            { status: 404 }
        );
    }
}
