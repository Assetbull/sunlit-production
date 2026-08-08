import { NextResponse } from 'next/server';
import { ApproveMilestoneSchema, sanitizePayload } from '@/shared/validators/schemas';
import { apiGuard, GuardContext } from '@/shared/api/api-guard';
import { createBackendContext, buildAuditCtx } from '@/shared/api/backend-context';
import { StateMachineEngine } from '@/core/state-machine/engine';

/**
 * POST /api/v1/milestones/[id]/approve
 *
 * Approves a completed milestone (project owner or EPC).
 * Auth: Required
 * RBAC: Requires 'approve:milestone'
 *
 * State Machine: MILESTONE_UPDATED → MILESTONE_APPROVED
 *
 * This is a prerequisite for escrow release.
 * GEMINI.md §4: "IF milestone_complete == FALSE → HOLD"
 * 
 * EPC Enhancement (Task 8.1, 8.2):
 * - Checks project approval_authority field
 * - EPC contractors can only approve milestones on their external projects
 * - Project owners can approve milestones on marketplace projects
 * - Triggers payment release if project is funded
 * - Emits milestone_approved_by_epc event for EPC approvals
 */
export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const guard = await apiGuard(req, { requiredPermission: 'approve:milestone' });
    if (guard instanceof NextResponse) return guard;

    const guardCtx = guard as GuardContext;
    const { id: milestoneId } = await params;

    try {
        const payload = await req.json();
        const sanitized = sanitizePayload(payload);

        const validation = ApproveMilestoneSchema.safeParse(sanitized);
        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.format(), correlation_id: guardCtx.correlationId },
                { status: 400 }
            );
        }

        // Enforce state transition
        StateMachineEngine.enforceRfqTransition('MILESTONE_UPDATED', 'MILESTONE_APPROVED');

        const ctx = createBackendContext();
        if (!ctx) {
            return NextResponse.json({
                success: true, message: 'Milestone approved (scaffold mode).',
                correlation_id: guardCtx.correlationId,
            });
        }

        const auditCtx = buildAuditCtx(guardCtx);

        // Verify milestone exists and is completed
        const milestone = await ctx.dataService.findOne('milestones', { id: milestoneId });
        if (!milestone) {
            return NextResponse.json(
                { error: 'Milestone not found.', correlation_id: guardCtx.correlationId },
                { status: 404 }
            );
        }
        if (!milestone.is_completed) {
            return NextResponse.json(
                { error: 'Milestone is not yet completed. Cannot approve.', correlation_id: guardCtx.correlationId },
                { status: 400 }
            );
        }

        // Get project to check approval authority
        const project = await ctx.dataService.findOne('projects', { id: validation.data.project_id });
        if (!project) {
            return NextResponse.json(
                { error: 'Project not found.', correlation_id: guardCtx.correlationId },
                { status: 404 }
            );
        }

        // Verify milestone belongs to the project
        if (milestone.project_id !== validation.data.project_id) {
            return NextResponse.json(
                { error: 'Milestone does not belong to this project.', correlation_id: guardCtx.correlationId },
                { status: 400 }
            );
        }

        // Check approval authority based on project type
        const approvalAuthority = project.approval_authority || 'project_owner';
        const isEpcProject = approvalAuthority === 'epc_contractor';
        const isProjectOwner = project.owner_id === guardCtx.userId;
        const isEpcCreator = project.creator_id === guardCtx.userId;

        // Authorization logic:
        // - For marketplace projects (approval_authority = 'project_owner'): Only project owner can approve
        // - For external projects (approval_authority = 'epc_contractor'): Only EPC creator can approve
        if (isEpcProject) {
            // EPC external project - only EPC creator can approve
            if (!isEpcCreator) {
                return NextResponse.json(
                    { 
                        error: 'Forbidden. Only the EPC contractor who created this external project can approve milestones.',
                        correlation_id: guardCtx.correlationId 
                    },
                    { status: 403 }
                );
            }
        } else {
            // Marketplace project - only project owner can approve
            if (!isProjectOwner) {
                return NextResponse.json(
                    { 
                        error: 'Forbidden. Only the project owner can approve milestones on marketplace projects.',
                        correlation_id: guardCtx.correlationId 
                    },
                    { status: 403 }
                );
            }
        }

        // Approve milestone
        await ctx.dataService.update('milestones', { id: milestoneId }, {
            is_approved: true,
            approved_at: new Date().toISOString(),
            approved_by: guardCtx.userId,
        }, auditCtx);

        // Emit appropriate event based on who approved
        const eventName = isEpcProject ? 'milestone_approved_by_epc' : 'milestone_approved';
        await ctx.eventBus.emit(eventName, {
            timestamp: new Date().toISOString(), 
            actor_id: guardCtx.userId,
            correlation_id: guardCtx.correlationId, 
            milestone_id: milestoneId,
            project_id: validation.data.project_id,
            approval_authority: approvalAuthority,
            is_epc_approval: isEpcProject,
        });

        // Log audit trail
        await ctx.auditLogger.log({
            user_id: guardCtx.userId, 
            action_type: isEpcProject ? 'milestone.approve.epc' : 'milestone.approve',
            correlation_id: guardCtx.correlationId,
            payload: { 
                milestone_id: milestoneId, 
                project_id: validation.data.project_id,
                approval_authority: approvalAuthority,
            },
            ip_address: guardCtx.ipAddress,
        });

        // Check if project is funded and trigger payment release
        // Note: This is a simplified check. In production, you'd check escrow status
        let paymentReleaseTriggered = false;
        if (project.funding_source === 'epc_funded' || project.funding_source === 'client') {
            // Check if there's an escrow record for this milestone
            const escrowRecord = await ctx.dataService.findOne('escrow', { 
                milestone_id: milestoneId,
                project_id: validation.data.project_id,
            });

            if (escrowRecord && escrowRecord.status === 'funded') {
                // Emit event to trigger payment release
                await ctx.eventBus.emit('milestone_approved_payment_pending', {
                    timestamp: new Date().toISOString(),
                    actor_id: guardCtx.userId,
                    correlation_id: guardCtx.correlationId,
                    milestone_id: milestoneId,
                    project_id: validation.data.project_id,
                    escrow_id: escrowRecord.id,
                    amount: escrowRecord.amount,
                });
                paymentReleaseTriggered = true;
            }
        }

        return NextResponse.json({
            success: true, 
            message: paymentReleaseTriggered 
                ? 'Milestone approved. Payment release initiated.'
                : 'Milestone approved. Escrow release now available.',
            milestone_id: milestoneId, 
            is_epc_approval: isEpcProject,
            payment_release_triggered: paymentReleaseTriggered,
            correlation_id: guardCtx.correlationId,
        });
    } catch (e: unknown) {
        console.error('Milestone approve error:', e);
        return NextResponse.json(
            { error: e instanceof Error ? e.message : 'Internal Server Error', correlation_id: guardCtx.correlationId },
            { status: 500 }
        );
    }
}
