import { NextResponse } from 'next/server';
import { CreateCrewJobSchema, sanitizePayload } from '@/shared/validators/schemas';
import { apiGuard, GuardContext } from '@/shared/api/api-guard';
import { createBackendContext, buildAuditCtx } from '@/shared/api/backend-context';

/**
 * POST /api/v1/crew/jobs — Create a crew job posting
 * GET  /api/v1/crew/jobs — List available crew jobs
 *
 * Auth: Required
 * RBAC: POST requires 'create:crew_job' (installer, epc_contractor)
 *       GET requires 'view:marketplace' (all authenticated)
 *
 * CrewLink State Machine: JOB_CREATED → JOB_PUBLISHED
 */
export async function POST(req: Request) {
    const guard = await apiGuard(req, { requiredPermission: 'create:crew_job' });
    if (guard instanceof NextResponse) return guard;

    const guardCtx = guard as GuardContext;

    try {
        const payload = await req.json();
        const sanitized = sanitizePayload(payload);

        const validation = CreateCrewJobSchema.safeParse(sanitized);
        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.format(), correlation_id: guardCtx.correlationId },
                { status: 400 }
            );
        }

        const jobData = validation.data;
        const ctx = createBackendContext();
        if (!ctx) {
            return NextResponse.json({
                success: true, message: 'Crew job created (scaffold mode).',
                correlation_id: guardCtx.correlationId,
            });
        }

        const auditCtx = buildAuditCtx(guardCtx);

        const job = await ctx.dataService.create('crew_jobs', {
            project_id: jobData.project_id,
            posted_by: guardCtx.userId,
            title: jobData.title,
            description: jobData.description || null,
            location_state: jobData.location_state || null,
            required_skills: jobData.required_skills || null,
            pay_rate: jobData.pay_rate || null,
            status: 'published',
        }, auditCtx);

        await ctx.eventBus.emit('crew_job_created', {
            timestamp: new Date().toISOString(), actor_id: guardCtx.userId,
            correlation_id: guardCtx.correlationId, job_id: job?.id,
            project_id: jobData.project_id,
        });

        await ctx.auditLogger.log({
            user_id: guardCtx.userId, action_type: 'crew_job.create',
            correlation_id: guardCtx.correlationId, payload: jobData,
            ip_address: guardCtx.ipAddress,
        });

        return NextResponse.json({
            success: true, message: 'Crew job posted.',
            job_id: job?.id, correlation_id: guardCtx.correlationId,
        });
    } catch (e: unknown) {
        console.error('Crew job create error:', e);
        return NextResponse.json(
            { error: 'Internal Server Error', correlation_id: guardCtx.correlationId },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    const guard = await apiGuard(req, { requiredPermission: 'view:marketplace' });
    if (guard instanceof NextResponse) return guard;

    const guardCtx = guard as GuardContext;

    try {
        const ctx = createBackendContext();
        if (!ctx) {
            return NextResponse.json({
                success: true, jobs: [],
                message: 'Supabase not configured.',
                correlation_id: guardCtx.correlationId,
            });
        }

        const jobs = await ctx.dataService.findMany('crew_jobs', { status: 'published' });

        return NextResponse.json({
            success: true, jobs: jobs || [],
            correlation_id: guardCtx.correlationId,
        });
    } catch (e: unknown) {
        console.error('Crew jobs list error:', e);
        return NextResponse.json(
            { error: 'Internal Server Error', correlation_id: guardCtx.correlationId },
            { status: 500 }
        );
    }
}
