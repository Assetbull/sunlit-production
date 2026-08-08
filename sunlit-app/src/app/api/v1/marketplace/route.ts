import { NextResponse } from 'next/server';
import { apiGuard, GuardContext } from '@/shared/api/api-guard';
import { createBackendContext } from '@/shared/api/backend-context';

/**
 * GET /api/v1/marketplace
 *
 * Unified marketplace feed — aggregates open RFQs and published crew jobs.
 * Auth: Required
 * RBAC: Requires 'view:marketplace'
 *
 * Requirements.md §2 PRD: "Unified view combining RFQ feed + CrewLink job feed"
 *
 * Returns a combined, chronologically-sorted feed with type discrimination.
 */
export async function GET(req: Request) {
    const guard = await apiGuard(req, { requiredPermission: 'view:marketplace' });
    if (guard instanceof NextResponse) return guard;

    const guardCtx = guard as GuardContext;

    try {
        const ctx = createBackendContext();
        if (!ctx) {
            return NextResponse.json({
                success: true, items: [],
                message: 'Supabase not configured.',
                correlation_id: guardCtx.correlationId,
            });
        }

        // Fetch open RFQs
        const rfqs = await ctx.dataService.findMany('rfq', { status: 'open' }) || [];

        // Fetch published crew jobs
        const crewJobs = await ctx.dataService.findMany('crew_jobs', { status: 'published' }) || [];

        // Normalize into unified feed items
        type FeedItem = {
            id: string; type: 'rfq' | 'crew_job'; title: string;
            location_state?: string; budget?: number; status: string;
            posted_by: string; created_at: string;
        };

        const rfqItems: FeedItem[] = rfqs.map((r: Record<string, unknown>) => ({
            id: String(r.id),
            type: 'rfq' as const,
            title: `${r.project_type || 'Solar'} ${r.config_mode || 'Project'} RFQ`,
            location_state: r.location_state ? String(r.location_state) : undefined,
            budget: typeof r.budget === 'number' ? r.budget : undefined,
            status: String(r.status || 'open'),
            posted_by: String(r.owner_id || ''),
            created_at: String(r.created_at || ''),
        }));

        const crewItems: FeedItem[] = crewJobs.map((j: Record<string, unknown>) => ({
            id: String(j.id),
            type: 'crew_job' as const,
            title: String(j.title || ''),
            location_state: j.location_state ? String(j.location_state) : undefined,
            budget: typeof j.pay_rate === 'number' ? j.pay_rate : undefined,
            status: String(j.status || 'published'),
            posted_by: String(j.posted_by || ''),
            created_at: String(j.created_at || ''),
        }));

        // Combine and sort by most recent
        const items = [...rfqItems, ...crewItems].sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        return NextResponse.json({
            success: true, items,
            total: items.length,
            correlation_id: guardCtx.correlationId,
        });
    } catch (e: unknown) {
        console.error('Marketplace feed error:', e);
        return NextResponse.json(
            { error: 'Internal Server Error', correlation_id: guardCtx.correlationId },
            { status: 500 }
        );
    }
}
