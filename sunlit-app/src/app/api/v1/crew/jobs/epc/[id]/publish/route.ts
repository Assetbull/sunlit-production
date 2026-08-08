/**
 * EPC CrewLink Job Publish API Endpoint
 * 
 * POST /api/v1/crew/jobs/epc/[id]/publish - Publish EPC crew job
 * 
 * Feature: EPC Dashboard Enterprise System
 * Task: 10.1 Extend CrewLink job posting for project assignment
 * Requirements: 6.1, 6.2
 * 
 * Security: EPC contractor role required
 * RBAC: manage:crew_jobs permission enforced
 */

import { NextRequest, NextResponse } from 'next/server';
import { apiGuard, GuardContext } from '@/shared/api/api-guard';
import { createBackendContext } from '@/shared/api/backend-context';
import { publishEPCCrewJob } from '@/core/crewlink';

/**
 * POST /api/v1/crew/jobs/epc/[id]/publish
 * 
 * Publish an EPC crew job to make it visible to crew members
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await apiGuard(req, { requiredPermission: 'manage:crew_jobs' });
  if (guard instanceof NextResponse) return guard;

  const guardCtx = guard as GuardContext;
  const { id: jobId } = await params;

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

    // Publish EPC crew job
    const result = await publishEPCCrewJob(
      {
        supabase: ctx.supabase,
        dataService: ctx.dataService,
        eventBus: ctx.eventBus,
        userId: guardCtx.userId,
        correlationId: guardCtx.correlationId,
        ipAddress: guardCtx.ipAddress,
      },
      jobId
    );

    return NextResponse.json({
      success: true,
      message: 'EPC crew job published successfully',
      job: result,
      correlation_id: guardCtx.correlationId,
    });
  } catch (error) {
    console.error('Error publishing EPC crew job:', error);
    
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to publish EPC crew job',
        correlation_id: guardCtx.correlationId,
      },
      { status: 500 }
    );
  }
}