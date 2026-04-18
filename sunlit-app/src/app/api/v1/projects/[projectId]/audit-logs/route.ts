import { NextResponse } from 'next/server';
import { apiGuard, GuardContext } from '@/shared/api/api-guard';
import { createClient } from '@supabase/supabase-js';
import { resolveDbUserIdFromClerk } from '@/shared/api/resolve-db-user';
import { DataService } from '@/shared/api/data-service';

/**
 * GET /api/v1/projects/[projectId]/audit-logs
 *
 * Returns recent audit entries for the authenticated user (immutable ledger slice).
 */
export async function GET(
    req: Request,
    { params }: { params: Promise<{ projectId: string }> }
) {
    const guard = await apiGuard(req, { requiredPermission: 'view:audit_logs' });
    if (guard instanceof NextResponse) return guard;

    const guardCtx = guard as GuardContext;
    await params;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey
        || supabaseUrl.includes('your-project-id')
        || supabaseKey.includes('your-service-role-key')) {
        return NextResponse.json({
            success: true,
            logs: [],
            correlation_id: guardCtx.correlationId,
        });
    }

    try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const dataService = new DataService(supabase);
        const internalId = await resolveDbUserIdFromClerk(dataService, guardCtx.userId);

        const orFilters = [guardCtx.userId, internalId].filter(Boolean) as string[];

        let query = supabase            .from('audit_logs')
            .select('id, action_type, correlation_id, created_at')
            .order('created_at', { ascending: false })
            .limit(40);

        if (orFilters.length === 1) {
            query = query.eq('user_id', orFilters[0]);
        } else if (orFilters.length > 1) {
            query = query.or(orFilters.map((id) => `user_id.eq.${id}`).join(','));
        }

        const { data, error } = await query;

        if (error) throw error;

        const logs = (data || []).map((row) => ({
            id: String(row.id),
            actionType: String(row.action_type),
            details: String(row.action_type).replace(/\./g, ' '),
            timestamp: String(row.created_at),
            correlationId: String(row.correlation_id || ''),
        }));

        return NextResponse.json({
            success: true,
            logs,
            correlation_id: guardCtx.correlationId,
        });
    } catch (e: unknown) {
        console.error('[audit-logs GET]', e);
        return NextResponse.json(
            { error: 'Internal Server Error', correlation_id: guardCtx.correlationId },
            { status: 500 }
        );
    }
}
