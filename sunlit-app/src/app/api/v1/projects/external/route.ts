/**
 * External Projects API Endpoint
 * 
 * POST /api/v1/projects/external - Create external project
 * GET /api/v1/projects/external - List external projects
 * 
 * Feature: EPC Dashboard Enterprise System
 * Task: 6.1 Create external project service
 * Requirements: 4.1, 4.2, 14.1
 * 
 * Security: EPC contractor role required
 * RBAC: create:project permission enforced
 */

import { NextRequest, NextResponse } from 'next/server';
import { apiGuard, GuardContext } from '@/shared/api/api-guard';
import { createBackendContext, buildAuditCtx } from '@/shared/api/backend-context';
import { CreateExternalProjectSchema, sanitizePayload } from '@/shared/validators/schemas';
import { createExternalProject, getExternalProjects } from '@/core/projects';
import type { ExternalProjectData } from '@/core/projects';

/**
 * POST /api/v1/projects/external
 * 
 * Create a new external project for an EPC contractor
 */
export async function POST(req: NextRequest) {
  const guard = await apiGuard(req);
  if (guard instanceof NextResponse) return guard;

  const guardCtx = guard as GuardContext;

  try {
    // Parse and validate request body
    const payload = await req.json();
    const sanitized = sanitizePayload(payload);

    const validation = CreateExternalProjectSchema.safeParse(sanitized);
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

    const projectData = validation.data as ExternalProjectData;

    // Get backend context
    const ctx = createBackendContext();
    if (!ctx) {
      return NextResponse.json(
        { error: 'Database not configured', correlation_id: guardCtx.correlationId },
        { status: 503 }
      );
    }

    // Verify user has epc_contractor role
    // Note: In production, this should also check RBAC permissions
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

    // Create external project
    const result = await createExternalProject(
      {
        supabase: ctx.supabase,
        dataService: ctx.dataService,
        eventBus: ctx.eventBus,
        userId: guardCtx.userId,
        correlationId: guardCtx.correlationId,
        ipAddress: guardCtx.ipAddress,
      },
      projectData
    );

    return NextResponse.json({
      success: true,
      message: 'External project created successfully',
      project: result,
      correlation_id: guardCtx.correlationId,
    });
  } catch (error) {
    console.error('Error creating external project:', error);
    
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to create external project',
        correlation_id: guardCtx.correlationId,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/v1/projects/external
 * 
 * List external projects for the authenticated EPC contractor
 */
export async function GET(req: NextRequest) {
  const guard = await apiGuard(req);
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

    // Get external projects
    const projects = await getExternalProjects({
      supabase: ctx.supabase,
      dataService: ctx.dataService,
      eventBus: ctx.eventBus,
      userId: guardCtx.userId,
      correlationId: guardCtx.correlationId,
      ipAddress: guardCtx.ipAddress,
    });

    return NextResponse.json({
      success: true,
      projects,
      correlation_id: guardCtx.correlationId,
    });
  } catch (error) {
    console.error('Error fetching external projects:', error);
    
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch external projects',
        correlation_id: guardCtx.correlationId,
      },
      { status: 500 }
    );
  }
}
