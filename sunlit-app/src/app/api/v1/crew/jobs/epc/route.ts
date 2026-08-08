/**
 * EPC CrewLink Jobs API Endpoint
 * 
 * POST /api/v1/crew/jobs/epc - Create EPC crew job with project assignment
 * GET /api/v1/crew/jobs/epc - List EPC crew jobs
 * 
 * Feature: EPC Dashboard Enterprise System
 * Task: 10.1 Extend CrewLink job posting for project assignment
 * Requirements: 6.1, 6.2
 * 
 * Security: EPC contractor role required
 * RBAC: create:crew_job permission enforced
 */

import { NextRequest, NextResponse } from 'next/server';
import { apiGuard, GuardContext } from '@/shared/api/api-guard';
import { createBackendContext, buildAuditCtx } from '@/shared/api/backend-context';
import { CreateEPCCrewJobSchema, sanitizePayload } from '@/shared/validators/schemas';
import { createEPCCrewJob, getEPCCrewJobs } from '@/core/crewlink';
import type { EPCCrewJobData } from '@/core/crewlink';

/**
 * POST /api/v1/crew/jobs/epc
 * 
 * Create a new EPC crew job with project assignment and milestone integration
 */
export async function POST(req: NextRequest) {
  const guard = await apiGuard(req, { requiredPermission: 'create:crew_job' });
  if (guard instanceof NextResponse) return guard;

  const guardCtx = guard as GuardContext;

  try {
    // Parse and validate request body
    const payload = await req.json();
    const sanitized = sanitizePayload(payload);

    const validation = CreateEPCCrewJobSchema.safeParse(sanitized);
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

    const jobData = validation.data as EPCCrewJobData;

    // Get backend context
    const ctx = createBackendContext();
    if (!ctx) {
      return NextResponse.json(
        { error: 'Database not configured', correlation_id: guardCtx.correlationId },
        { status: 503 }
      );
    }

    // Verify user has epc_contractor role
    const sessionCookie = req.cookies.get('sunlit_session')?.value;
    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Unauthorized', correlation_id: guardCtx.correlationId },
        { status: 401 }
      );
    }

    const session = JSON.parse(sessionCookie);
    if (session.role !== 'epc_contractor') {
      return NextResponse.json(
        {
          error: 'Forbidden - EPC contractor role required',
          correlation_id: guardCtx.correlationId,
        },
        { status: 403 }
      );
    }

    // Create EPC crew job
    const result = await createEPCCrewJob(
      {
        supabase: ctx.supabase,
        dataService: ctx.dataService,
        eventBus: ctx.eventBus,
        userId: guardCtx.userId,
        correlationId: guardCtx.correlationId,
        ipAddress: guardCtx.ipAddress,
      },
      jobData
    );

    return NextResponse.json({
      success: true,
      message: 'EPC crew job created successfully',
      job: result,
      correlation_id: guardCtx.correlationId,
    });
  } catch (error) {
    console.error('Error creating EPC crew job:', error);
    
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to create EPC crew job',
        correlation_id: guardCtx.correlationId,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/v1/crew/jobs/epc
 * 
 * List EPC crew jobs for the authenticated EPC contractor
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

    // Verify user has epc_contractor role
    const sessionCookie = req.cookies.get('sunlit_session')?.value;
    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Unauthorized', correlation_id: guardCtx.correlationId },
        { status: 401 }
      );
    }

    const session = JSON.parse(sessionCookie);
    if (session.role !== 'epc_contractor') {
      return NextResponse.json(
        {
          error: 'Forbidden - EPC contractor role required',
          correlation_id: guardCtx.correlationId,
        },
        { status: 403 }
      );
    }

    // Parse query parameters for filtering
    const url = new URL(req.url);
    const filters: any = {};
    
    if (url.searchParams.get('project_id')) {
      filters.project_id = url.searchParams.get('project_id');
    }
    
    if (url.searchParams.get('status')) {
      filters.status = url.searchParams.get('status');
    }
    
    if (url.searchParams.get('project_assignment')) {
      filters.project_assignment = url.searchParams.get('project_assignment');
    }

    // Get EPC crew jobs
    const jobs = await getEPCCrewJobs({
      supabase: ctx.supabase,
      dataService: ctx.dataService,
      eventBus: ctx.eventBus,
      userId: guardCtx.userId,
      correlationId: guardCtx.correlationId,
      ipAddress: guardCtx.ipAddress,
    }, filters);

    return NextResponse.json({
      success: true,
      jobs,
      count: jobs.length,
      correlation_id: guardCtx.correlationId,
    });
  } catch (error) {
    console.error('Error fetching EPC crew jobs:', error);
    
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch EPC crew jobs',
        correlation_id: guardCtx.correlationId,
      },
      { status: 500 }
    );
  }
}