import { NextResponse } from 'next/server';
import { apiGuard, GuardContext } from '@/shared/api/api-guard';
import { createBackendContext } from '@/shared/api/backend-context';

/**
 * GET /api/v1/crew/jobs/[id]
 * Retrieves details for a specific crew job along with its applications (if authorized).
 *
 * Auth: Required
 * RBAC: Requires 'view:marketplace'
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const guard = await apiGuard(req, { requiredPermission: 'view:marketplace' });
    if (guard instanceof NextResponse) return guard;

    const guardCtx = guard as GuardContext;
    const { id: jobId } = await params;

    try {
        const ctx = createBackendContext();
        if (!ctx) {
            return NextResponse.json({
                success: true,
                message: 'Supabase not configured.',
                job: {
                    id: jobId,
                    title: 'Senior Solar Installer (Scaffold Mode)',
                    description: 'Mock description for scaffold mode.',
                    status: 'published',
                },
                applications: [],
                correlation_id: guardCtx.correlationId,
            });
        }

        const job = await ctx.dataService.findOne('crew_jobs', { id: jobId });
        
        if (!job) {
            return NextResponse.json(
                { error: 'Crew job not found', correlation_id: guardCtx.correlationId },
                { status: 404 }
            );
        }

        // Fetch applications if the user is the job owner
        let applications = [];
        if (job.posted_by === guardCtx.userId) {
            applications = await ctx.dataService.findMany('crew_applications', { job_id: jobId }) || [];
        }

        return NextResponse.json({
            success: true,
            job,
            applications, // Only populated if the user is the owner
            correlation_id: guardCtx.correlationId,
        });

    } catch (e: unknown) {
        console.error('Crew job detail fetch error:', e);
        return NextResponse.json(
            { error: 'Internal Server Error', correlation_id: guardCtx.correlationId },
            { status: 500 }
        );
    }
}
