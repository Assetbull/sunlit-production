import { NextResponse } from 'next/server';
import { apiGuard, GuardContext } from '@/shared/api/api-guard';
import { createBackendContext } from '@/shared/api/backend-context';

/**
 * GET /api/v1/crew/applications
 * Retrieves applications submitted by the authenticated user.
 * 
 * Auth: Required
 * RBAC: active for all authenticated users (but typically crewlink role)
 */
export async function GET(req: Request) {
    const guard = await apiGuard(req);
    if (guard instanceof NextResponse) return guard;

    const guardCtx = guard as GuardContext;

    try {
        const ctx = createBackendContext();
        if (!ctx) {
            return NextResponse.json({
                success: true,
                message: 'Supabase not configured.',
                applications: [],
                correlation_id: guardCtx.correlationId,
            });
        }

        // Fetch applications belonging to the current user
        const applications = await ctx.dataService.findMany('crew_applications', { 
            applicant_id: guardCtx.userId 
        });

        return NextResponse.json({
            success: true,
            applications: applications || [],
            correlation_id: guardCtx.correlationId,
        });

    } catch (e: unknown) {
        console.error('Crew applications fetch error:', e);
        return NextResponse.json(
            { error: 'Internal Server Error', correlation_id: guardCtx.correlationId },
            { status: 500 }
        );
    }
}
