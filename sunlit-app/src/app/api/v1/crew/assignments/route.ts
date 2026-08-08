/**
 * Crew Assignments API Endpoint
 * 
 * POST /api/v1/crew/assignments - Assign crew to project
 * GET /api/v1/crew/assignments - List crew assignments
 * 
 * Feature: EPC Dashboard Enterprise System
 * Task: 10.2 Implement crew-to-project assignment logic
 * Requirements: 6.3, 8.1, 8.2
 * 
 * Security: EPC contractor or installer role required
 * RBAC: assign:crew permission enforced
 */

import { NextRequest, NextResponse } from 'next/server';
import { apiGuard, GuardContext } from '@/shared/api/api-guard';
import { createBackendContext, buildAuditCtx } from '@/shared/api/backend-context';
import { AssignCrewToProjectSchema, sanitizePayload } from '@/shared/validators/schemas';
import { assignCrewToProject, getProjectCrewAssignments } from '@/core/crewlink';
import type { CrewAssignmentData } from '@/core/crewlink';

/**
 * POST /api/v1/crew/assignments
 * 
 * Assign a crew member to a project with milestone integration
 */
export async function POST(req: NextRequest) {
  const guard = await apiGuard(req, { requiredPermission: 'assign:crew' });
  if (guard instanceof NextResponse) return guard;

  const guardCtx = guard as GuardContext;

  try {
    // Parse and validate request body
    const payload = await req.json();
    const sanitized = sanitizePayload(payload);

    const validation = AssignCrewToProjectSchema.safeParse(sanitized);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.format(),
          correlation_id: guardCtx.correlationId,
        },
        { status: 400 }
      );
    }

    const assignmentData = validation.data as CrewAssignmentData;

    // Get backend context
    const ctx = createBackendContext();
    if (!ctx) {
      return NextResponse.json(
        { error: 'Database not configured', correlation_id: guardCtx.correlationId },
        { status: 503 }
      );
    }

    // Verify user has appropriate role (EPC contractor or installer)
    const sessionCookie = req.cookies.get('sunlit_session')?.value;
    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Unauthorized', correlation_id: guardCtx.correlationId },
        { status: 401 }
      );
    }

    const session = JSON.parse(sessionCookie);
    if (!['epc_contractor', 'installer'].includes(session.role)) {
      return NextResponse.json(
        {
          error: 'Forbidden - EPC contractor or installer role required',
          correlation_id: guardCtx.correlationId,
        },
        { status: 403 }
      );
    }

    // Assign crew to project
    const result = await assignCrewToProject(
      {
        supabase: ctx.supabase,
        dataService: ctx.dataService,
        eventBus: ctx.eventBus,
        userId: guardCtx.userId,
        correlationId: guardCtx.correlationId,
        ipAddress: guardCtx.ipAddress,
      },
      assignmentData
    );

    return NextResponse.json({
      success: true,
      message: 'Crew assigned to project successfully',
      assignment: result,
      correlation_id: guardCtx.correlationId,
    });
  } catch (error) {
    console.error('Error assigning crew to project:', error);
    
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to assign crew to project',
        correlation_id: guardCtx.correlationId,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/v1/crew/assignments
 * 
 * List crew assignments for a project
 */
export async function GET(req: NextRequest) {
  const guard = await apiGuard(req, { requiredPermission: 'view:crew_jobs' });
  if (guard instanceof NextResponse) return guard;

  const guardCtx = guard as GuardContext;

  try {
    // Get backend context
    const ctx = createBackendContext();
    if (!ctx) {
      return NextResponse.json(
        { error: 'Database not configured', correlation_id: guardCtx.correlationId },
        { status: 503 }
      );
    }

    // Parse query parameters
    const url = new URL(req.url);
    const projectId = url.searchParams.get('project_id');
    
    if (!projectId) {
      return NextResponse.json(
        {
          error: 'project_id query parameter is required',
          correlation_id: guardCtx.correlationId,
        },
        { status: 400 }
      );
    }

    // Get crew assignments for project
    const assignments = await getProjectCrewAssignments({
      supabase: ctx.supabase,
      dataService: ctx.dataService,
      eventBus: ctx.eventBus,
      userId: guardCtx.userId,
      correlationId: guardCtx.correlationId,
      ipAddress: guardCtx.ipAddress,
    }, projectId);

    return NextResponse.json({
      success: true,
      assignments,
      count: assignments.length,
      correlation_id: guardCtx.correlationId,
    });
  } catch (error) {
    console.error('Error fetching crew assignments:', error);
    
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch crew assignments',
        correlation_id: guardCtx.correlationId,
      },
      { status: 500 }
    );
  }
}