import { NextResponse } from 'next/server';
import { apiGuard, GuardContext } from '@/shared/api/api-guard';
import { DataService } from '@/shared/api/data-service';
import { createClient } from '@supabase/supabase-js';
import type { DashboardSummary } from '@/dashboards/project-owner/types/dashboard';

/**
 * GET /api/v1/dashboard/summary
 * Aggregated KPIs for the project owner dashboard.
 */
export async function GET(req: Request) {
    const guard = await apiGuard(req, { requiredPermission: 'view:rfq' });
    if (guard instanceof NextResponse) return guard;

    const guardCtx = guard as GuardContext;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey
        || supabaseUrl.includes('your-project-id')
        || supabaseKey.includes('your-service-role-key')) {
        const empty: DashboardSummary = {
            totalProjects: 0,
            activeRfqs: 0,
            pendingBids: 0,
            paymentBalance: 0,
            completedProjects: 0,
            disputedProjects: 0,
        };
        return NextResponse.json({
            success: true,
            data: empty,
            message: 'Supabase not configured; returning zeroed summary.',
            correlation_id: guardCtx.correlationId,
        });
    }

    try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const dataService = new DataService(supabase);

        const rfqs = await dataService.findMany('rfq', { owner_id: guardCtx.userId }).catch(() => []);

        const rfqList = Array.isArray(rfqs) ? rfqs : [];
        const activeRfqs = rfqList.filter(
            (r: { status?: string }) => r.status === 'open' || r.status === 'matched'
        ).length;

        let pendingBids = 0;
        for (const r of rfqList) {
            const id = (r as { id?: string }).id;
            if (!id) continue;
            try {
                const bids = await dataService.findMany('bids', { rfq_id: id });
                pendingBids += (Array.isArray(bids) ? bids : []).filter(
                    (b: { status?: string }) => b.status === 'submitted'
                ).length;
            } catch {
                /* skip */
            }
        }

        let paymentBalance = 0;
        try {
            const escrows = await dataService.findMany('escrow');
            const list = Array.isArray(escrows) ? escrows : [];
            paymentBalance = list
                .filter((e: { status?: string }) => e.status === 'funded' || e.status === 'held')
                .reduce((sum: number, e: { amount?: number }) => sum + Number(e.amount || 0), 0);
        } catch {
            paymentBalance = 0;
        }

        const data: DashboardSummary = {
            totalProjects: rfqList.length,
            activeRfqs,
            pendingBids,
            paymentBalance,
            completedProjects: rfqList.filter((r: { status?: string }) => r.status === 'closed').length,
            disputedProjects: 0,
        };

        return NextResponse.json({
            success: true,
            data,
            correlation_id: guardCtx.correlationId,
        });
    } catch (e: unknown) {
        console.error('[dashboard/summary]', e);
        return NextResponse.json(
            { error: 'Internal Server Error', correlation_id: guardCtx.correlationId },
            { status: 500 }
        );
    }
}
