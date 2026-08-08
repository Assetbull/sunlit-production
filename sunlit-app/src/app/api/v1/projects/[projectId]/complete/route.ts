import { NextResponse } from 'next/server';
import { apiGuard, GuardContext } from '@/shared/api/api-guard';
import { createBackendContext, buildAuditCtx } from '@/shared/api/backend-context';
import crypto from 'crypto';

/**
 * POST /api/v1/projects/[projectId]/complete
 *
 * Marks a project as COMPLETED.
 * Auth: Required (project_owner or epc_contractor)
 * RBAC: Requires 'complete:project' permission
 *
 * GUARDS (ALL MUST PASS):
 * 1. All milestones must be in PAID state
 * 2. No active dispute on the project
 * 3. Caller must be the project owner or authorized EPC
 * 4. Project must currently be in ACTIVE state
 *
 * LIFECYCLE:
 * PROJECT_ACTIVE → PROJECT_COMPLETED
 *
 * EFFECTS:
 * - Sets project.status = COMPLETED
 * - Triggers final buffer release workflow
 * - Emits project_completed event
 * - Creates completion record in audit log
 *
 * GEMINI.md §4 — Final Buffer Release:
 * Buffer release requires: project_completed = TRUE, no dispute, approval_confirmed = TRUE
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const guard = await apiGuard(req, { requiredPermission: 'complete:project' });
  if (guard instanceof NextResponse) return guard;

  const guardCtx = guard as GuardContext;
  const { projectId } = await params;

  try {
    const ctx = createBackendContext();

    if (!ctx) {
      return NextResponse.json({
        success: true,
        message: 'Project marked as completed (scaffold mode).',
        project_id: projectId,
        completed_at: new Date().toISOString(),
        correlation_id: guardCtx.correlationId,
      });
    }

    const auditCtx = buildAuditCtx(guardCtx);

    // === Verify project exists ===
    const project = await ctx.dataService.findOne('projects', { id: projectId });
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found.', correlation_id: guardCtx.correlationId },
        { status: 404 }
      );
    }

    // === Guard: Project must be ACTIVE ===
    if (project.status !== 'ACTIVE') {
      return NextResponse.json(
        {
          error: `Project must be in ACTIVE state to complete. Current: ${project.status}`,
          correlation_id: guardCtx.correlationId,
        },
        { status: 400 }
      );
    }

    // === Guard: Caller must be project owner or authorized EPC ===
    const isOwner = project.owner_id === guardCtx.userId;
    const isEpcCreator = project.creator_id === guardCtx.userId && project.approval_authority === 'epc_contractor';
    if (!isOwner && !isEpcCreator) {
      return NextResponse.json(
        { error: 'Forbidden. Only the project owner or authorized EPC can complete this project.', correlation_id: guardCtx.correlationId },
        { status: 403 }
      );
    }

    // === Guard: No active dispute ===
    const activeDispute = await ctx.dataService.findOne('disputes', {
      project_id: projectId,
      status: 'OPEN',
    });
    if (activeDispute) {
      return NextResponse.json(
        {
          error: 'Project has an active dispute. Resolve it before marking complete.',
          dispute_id: activeDispute.id,
          correlation_id: guardCtx.correlationId,
        },
        { status: 403 }
      );
    }

    // === Guard: All milestones must be PAID ===
    const milestones = await ctx.dataService.findMany('milestones', { project_id: projectId });
    const unpaid = milestones.filter(
      (ms: Record<string, unknown>) => ms.status !== 'PAID'
    );
    if (unpaid.length > 0) {
      return NextResponse.json(
        {
          error: 'Not all milestones have been paid. Complete all milestone payments before marking project as complete.',
          unpaid_milestone_ids: unpaid.map((ms: Record<string, unknown>) => ms.id),
          unpaid_count: unpaid.length,
          total_milestones: milestones.length,
          correlation_id: guardCtx.correlationId,
        },
        { status: 400 }
      );
    }

    const completedAt = new Date().toISOString();
    const completionRef = crypto.randomUUID();

    // === Update project status ===
    await ctx.dataService.update(
      'projects',
      { id: projectId },
      {
        status: 'COMPLETED',
        completed_at: completedAt,
        completion_ref: completionRef,
        completed_by: guardCtx.userId,
      },
      auditCtx
    );

    // === Trigger final buffer release workflow ===
    const escrow = await ctx.dataService.findOne('escrow', { project_id: projectId });
    if (escrow && escrow.final_buffer_amount > 0) {
      await ctx.eventBus.emit('final_buffer_release_pending', {
        timestamp: completedAt,
        actor_id: guardCtx.userId,
        correlation_id: guardCtx.correlationId,
        project_id: projectId,
        escrow_id: escrow.id,
        buffer_amount: escrow.final_buffer_amount,
        completion_ref: completionRef,
      });

      // Update escrow status — awaiting final buffer release
      await ctx.dataService.update(
        'escrow',
        { id: escrow.id },
        { status: 'AWAITING_BUFFER_RELEASE', project_completed: true },
        auditCtx
      );
    }

    // === Emit project_completed event ===
    await ctx.eventBus.emit('project_completed', {
      timestamp: completedAt,
      actor_id: guardCtx.userId,
      correlation_id: guardCtx.correlationId,
      project_id: projectId,
      completion_ref: completionRef,
      milestone_count: milestones.length,
    });

    // === Audit log ===
    await ctx.auditLogger.log({
      user_id: guardCtx.userId,
      action_type: 'project.complete',
      correlation_id: guardCtx.correlationId,
      payload: {
        project_id: projectId,
        completion_ref: completionRef,
        milestone_count: milestones.length,
      },
      ip_address: guardCtx.ipAddress,
    });

    return NextResponse.json({
      success: true,
      message: 'Project marked as completed. Final buffer release has been initiated.',
      project_id: projectId,
      status: 'COMPLETED',
      completed_at: completedAt,
      completion_ref: completionRef,
      buffer_release_pending: !!(escrow?.final_buffer_amount > 0),
      correlation_id: guardCtx.correlationId,
    });
  } catch (e: unknown) {
    console.error('Project complete error:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Internal Server Error', correlation_id: guardCtx.correlationId },
      { status: 500 }
    );
  }
}
