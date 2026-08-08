import { NextResponse } from 'next/server';
import { ApplyCrewJobSchema, sanitizePayload } from '@/shared/validators/schemas';
import { apiGuard, GuardContext } from '@/shared/api/api-guard';
import { createBackendContext, buildAuditCtx } from '@/shared/api/backend-context';

/**
 * POST /api/v1/crew/jobs/[id]/apply
 *
 * Submits a crew application for a job posting.
 * Auth: Required
 * RBAC: Requires 'apply:crew_job' (crewlink)
 *
 * CrewLink SM: JOB_PUBLISHED → APPLICATION_RECEIVED
 */
export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const guard = await apiGuard(req, { requiredPermission: 'apply:crew_job' });
    if (guard instanceof NextResponse) return guard;

    const guardCtx = guard as GuardContext;
    const { id: jobId } = await params;

    try {
        const payload = await req.json();
        const sanitized = sanitizePayload(payload);

        const validation = ApplyCrewJobSchema.safeParse({ ...sanitized, job_id: jobId });
        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.format(), correlation_id: guardCtx.correlationId },
                { status: 400 }
            );
        }

        const ctx = createBackendContext();
        if (!ctx) {
            return NextResponse.json({
                success: true, message: 'Application submitted (scaffold mode).',
                correlation_id: guardCtx.correlationId,
            });
        }

        const auditCtx = buildAuditCtx(guardCtx);

        const application = await ctx.dataService.create('crew_applications', {
            job_id: jobId,
            applicant_id: guardCtx.userId,
            cover_note: validation.data.cover_note || null,
            status: 'pending',
        }, auditCtx);

        await ctx.eventBus.emit('crew_application_submitted', {
            timestamp: new Date().toISOString(), actor_id: guardCtx.userId,
            correlation_id: guardCtx.correlationId, application_id: application?.id,
            job_id: jobId,
        });

        await ctx.auditLogger.log({
            user_id: guardCtx.userId, action_type: 'crew_application.submit',
            correlation_id: guardCtx.correlationId,
            payload: { job_id: jobId, cover_note: validation.data.cover_note },
            ip_address: guardCtx.ipAddress,
        });

        return NextResponse.json({
            success: true, message: 'Application submitted.',
            application_id: application?.id, correlation_id: guardCtx.correlationId,
        });
    } catch (e: unknown) {
        console.error('Crew apply error:', e);
        return NextResponse.json(
            { error: 'Internal Server Error', correlation_id: guardCtx.correlationId },
            { status: 500 }
        );
    }
}
