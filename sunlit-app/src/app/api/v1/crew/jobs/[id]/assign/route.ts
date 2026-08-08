import { NextResponse } from 'next/server';
import { AssignCrewSchema, sanitizePayload } from '@/shared/validators/schemas';
import { apiGuard, GuardContext } from '@/shared/api/api-guard';
import { createBackendContext, buildAuditCtx } from '@/shared/api/backend-context';
import { StateMachineEngine } from '@/core/state-machine/engine';

/**
 * POST /api/v1/crew/jobs/[id]/assign
 *
 * Assigns a crew member from an approved application.
 * Auth: Required
 * RBAC: Requires 'assign:crew' (installer, epc_contractor)
 *
 * CrewLink SM: APPLICATION_REVIEWED → CREW_ASSIGNED
 */
export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const guard = await apiGuard(req, { requiredPermission: 'assign:crew' });
    if (guard instanceof NextResponse) return guard;

    const guardCtx = guard as GuardContext;
    const { id: jobId } = await params;

    try {
        const payload = await req.json();
        const sanitized = sanitizePayload(payload);

        const validation = AssignCrewSchema.safeParse(sanitized);
        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.format(), correlation_id: guardCtx.correlationId },
                { status: 400 }
            );
        }

        // State machine enforcement
        StateMachineEngine.enforceCrewLinkTransition('APPLICATION_REVIEWED', 'CREW_ASSIGNED');

        const ctx = createBackendContext();
        if (!ctx) {
            return NextResponse.json({
                success: true, message: 'Crew assigned (scaffold mode).',
                correlation_id: guardCtx.correlationId,
            });
        }

        const auditCtx = buildAuditCtx(guardCtx);
        const { application_id } = validation.data;

        // Accept the application
        await ctx.dataService.update('crew_applications', { id: application_id }, {
            status: 'accepted',
            reviewed_at: new Date().toISOString(),
        }, auditCtx);

        // Update job status
        await ctx.dataService.update('crew_jobs', { id: jobId }, { status: 'assigned' }, auditCtx);

        await ctx.eventBus.emit('crew_assigned', {
            timestamp: new Date().toISOString(), actor_id: guardCtx.userId,
            correlation_id: guardCtx.correlationId, job_id: jobId,
            application_id,
        });

        await ctx.auditLogger.log({
            user_id: guardCtx.userId, action_type: 'crew.assign',
            correlation_id: guardCtx.correlationId,
            payload: { job_id: jobId, application_id },
            ip_address: guardCtx.ipAddress,
        });

        return NextResponse.json({
            success: true, message: 'Crew member assigned.',
            job_id: jobId, application_id, correlation_id: guardCtx.correlationId,
        });
    } catch (e: unknown) {
        console.error('Crew assign error:', e);
        return NextResponse.json(
            { error: e instanceof Error ? e.message : 'Internal Server Error', correlation_id: guardCtx.correlationId },
            { status: 500 }
        );
    }
}
