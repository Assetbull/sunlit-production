import { NextResponse } from 'next/server';
import { sanitizePayload } from '@/shared/validators/schemas';
import { apiGuard, GuardContext } from '@/shared/api/api-guard';
import { createBackendContext, buildAuditCtx } from '@/shared/api/backend-context';
import crypto from 'crypto';

/**
 * POST /api/v1/milestones
 *
 * Creates a new milestone submission (Installer submits work evidence).
 * Auth: Required
 * RBAC: Requires 'submit:milestone' permission (installer)
 *
 * State Machine: MILESTONE_PENDING → MILESTONE_SUBMITTED
 *
 * Crew Isolation: No crew fields stored or returned.
 * All proof is linked to milestones, not crew members.
 *
 * Payload:
 * {
 *   project_id: string
 *   milestone_id: string           // Which milestone this submission covers
 *   proof_urls: string[]           // Uploaded file URLs (photos, docs)
 *   proof_notes: string            // Installer notes (abstracted, no crew refs)
 *   deliverables: { id: string, completed: boolean }[]
 * }
 */
export async function POST(req: Request) {
  const guard = await apiGuard(req, { requiredPermission: 'submit:milestone' });
  if (guard instanceof NextResponse) return guard;

  const guardCtx = guard as GuardContext;

  try {
    const payload = await req.json();
    const sanitized = sanitizePayload(payload);

    // === Validate required fields ===
    const { project_id, milestone_id, proof_urls, proof_notes, deliverables } = sanitized;

    if (!project_id || typeof project_id !== 'string') {
      return NextResponse.json(
        { error: 'project_id is required.', correlation_id: guardCtx.correlationId },
        { status: 400 }
      );
    }
    if (!milestone_id || typeof milestone_id !== 'string') {
      return NextResponse.json(
        { error: 'milestone_id is required.', correlation_id: guardCtx.correlationId },
        { status: 400 }
      );
    }
    if (!Array.isArray(proof_urls) || proof_urls.length === 0) {
      return NextResponse.json(
        { error: 'At least one proof URL is required.', correlation_id: guardCtx.correlationId },
        { status: 400 }
      );
    }

    const ctx = createBackendContext();
    if (!ctx) {
      // Scaffold mode — return success with stub data
      return NextResponse.json({
        success: true,
        message: 'Milestone submitted (scaffold mode).',
        milestone_id,
        status: 'SUBMITTED',
        submitted_at: new Date().toISOString(),
        correlation_id: guardCtx.correlationId,
      });
    }

    const auditCtx = buildAuditCtx(guardCtx);

    // === Verify project exists and is ACTIVE ===
    const project = await ctx.dataService.findOne('projects', { id: project_id });
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found.', correlation_id: guardCtx.correlationId },
        { status: 404 }
      );
    }
    if (project.status !== 'ACTIVE') {
      return NextResponse.json(
        {
          error: 'Project is not in active state. Cannot submit milestone.',
          current_status: project.status,
          correlation_id: guardCtx.correlationId,
        },
        { status: 400 }
      );
    }

    // === Verify installer is authorized on this contract ===
    const contract = await ctx.dataService.findOne('contracts', { project_id });
    if (!contract || contract.installer_id !== guardCtx.userId) {
      return NextResponse.json(
        { error: 'Forbidden. You are not the authorized installer for this project.', correlation_id: guardCtx.correlationId },
        { status: 403 }
      );
    }

    // === Verify milestone belongs to project and is PENDING ===
    const milestone = await ctx.dataService.findOne('milestones', {
      id: milestone_id,
      project_id,
    });
    if (!milestone) {
      return NextResponse.json(
        { error: 'Milestone not found for this project.', correlation_id: guardCtx.correlationId },
        { status: 404 }
      );
    }
    if (milestone.status !== 'PENDING') {
      return NextResponse.json(
        {
          error: `Milestone is already in '${milestone.status}' state. Cannot re-submit.`,
          correlation_id: guardCtx.correlationId,
        },
        { status: 400 }
      );
    }

    // === Check no active dispute on project ===
    const activeDispute = await ctx.dataService.findOne('disputes', {
      project_id,
      status: 'OPEN',
    });
    if (activeDispute) {
      return NextResponse.json(
        {
          error: 'Project has an active dispute. Milestone submission is locked.',
          dispute_id: activeDispute.id,
          correlation_id: guardCtx.correlationId,
        },
        { status: 403 }
      );
    }

    // === Build submission hash for integrity ===
    const submissionHash = crypto
      .createHash('sha256')
      .update(`${milestone_id}:${guardCtx.userId}:${proof_urls.join(',')}:${Date.now()}`)
      .digest('hex');

    // === Update milestone to SUBMITTED ===
    const updateResult = await ctx.dataService.update(
      'milestones',
      { id: milestone_id },
      {
        status: 'SUBMITTED',
        submitted_at: new Date().toISOString(),
        submitted_by: guardCtx.userId,
        proof_urls: proof_urls,
        proof_notes: proof_notes || '',
        deliverables: deliverables || [],
        submission_hash: submissionHash,
        is_completed: true, // marks as ready for review
      },
      auditCtx
    );
    const updatedMilestone = (Array.isArray(updateResult) ? updateResult[0] : updateResult) as Record<string, unknown>;

    // === Emit event ===
    await ctx.eventBus.emit('milestone_submitted', {
      timestamp: new Date().toISOString(),
      actor_id: guardCtx.userId,
      correlation_id: guardCtx.correlationId,
      milestone_id,
      project_id,
      submission_hash: submissionHash,
      proof_count: proof_urls.length,
    });

    // === Audit log ===
    await ctx.auditLogger.log({
      user_id: guardCtx.userId,
      action_type: 'milestone.submit',
      correlation_id: guardCtx.correlationId,
      payload: {
        milestone_id,
        project_id,
        proof_count: proof_urls.length,
        submission_hash: submissionHash,
      },
      ip_address: guardCtx.ipAddress,
    });

    // === Return sanitized response (no crew fields) ===
    return NextResponse.json({
      success: true,
      message: 'Milestone submitted successfully. Awaiting project owner review.',
      milestone_id: updatedMilestone.id,
      status: 'SUBMITTED',
      submitted_at: updatedMilestone.submitted_at,
      submission_hash: submissionHash,
      correlation_id: guardCtx.correlationId,
    });
  } catch (e: unknown) {
    console.error('Milestone submit error:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Internal Server Error', correlation_id: guardCtx.correlationId },
      { status: 500 }
    );
  }
}

/**
 * GET /api/v1/milestones?projectId=[id]
 *
 * Returns all milestones for a project.
 * CREW ISOLATION: All crew fields stripped before response.
 */
export async function GET(req: Request) {
  const guard = await apiGuard(req, { requiredPermission: 'read:milestone' });
  if (guard instanceof NextResponse) return guard;

  const guardCtx = guard as GuardContext;
  const url = new URL(req.url);
  const projectId = url.searchParams.get('projectId');

  if (!projectId) {
    return NextResponse.json(
      { error: 'projectId query parameter is required.', correlation_id: guardCtx.correlationId },
      { status: 400 }
    );
  }

  const ctx = createBackendContext();
  if (!ctx) {
    // Scaffold: return empty list
    return NextResponse.json({
      success: true,
      data: [],
      correlation_id: guardCtx.correlationId,
    });
  }

  try {
    const milestones = await ctx.dataService.findMany('milestones', { project_id: projectId });

    // === CREW ISOLATION: strip forbidden fields ===
    const FORBIDDEN = new Set([
      'crew_id', 'crew_name', 'crew_role', 'assigned_crew', 'crew_assignments',
      'gps', 'gps_logs', 'internal_logs', 'execution_logs', 'installer_notes',
      'crew_performance', 'crew_location', 'crew_status',
    ]);

    const sanitized = milestones.map((ms: Record<string, unknown>) => {
      const clean: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(ms)) {
        if (!FORBIDDEN.has(k)) clean[k] = v;
      }
      return clean;
    });

    return NextResponse.json({
      success: true,
      data: sanitized,
      correlation_id: guardCtx.correlationId,
    });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Internal Server Error', correlation_id: guardCtx.correlationId },
      { status: 500 }
    );
  }
}
