/**
 * External Project Funding API Endpoint
 * 
 * POST /api/v1/projects/[projectId]/fund - Fund external project
 * GET /api/v1/projects/[projectId]/fund - Get funding status
 * 
 * Feature: EPC Dashboard Enterprise System
 * Task: 11.1 Implement EPC external project funding service
 * Requirements: 7.1, 7.2, 10.1, 10.2
 * 
 * Security: EPC contractor role required
 * RBAC: fund:payment permission enforced
 * 
 * Architecture Compliance:
 * - Extends existing payment system (architecture_lock.md)
 * - Uses existing DataService and EventBus
 * - Follows existing RBAC patterns
 * - Maintains security-first approach
 */

import { NextRequest, NextResponse } from 'next/server';
import { apiGuard, GuardContext } from '@/shared/api/api-guard';
import { createBackendContext } from '@/shared/api/backend-context';
import { FundExternalProjectSchema, sanitizePayload } from '@/shared/validators/schemas';
import { EPCFundingService } from '@/core/payments';
import { AuditLogger } from '@/core/audit/logger';

/**
 * POST /api/v1/projects/[projectId]/fund
 * 
 * Fund an external project with escrow integration
 * 
 * Request Body:
 * {
 *   "epc_contractor_id": "uuid",
 *   "project_id": "uuid",
 *   "funding_amount": 10000000,
 *   "milestone_schedule": [
 *     {
 *       "milestone_id": "uuid",
 *       "amount": 5000000,
 *       "sequence": 1
 *     }
 *   ],
 *   "commission_agreement": {
 *     "rate": 0.05,
 *     "type": "percentage"
 *   }
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "funding_id": "uuid",
 *   "project_id": "uuid",
 *   "payment_mode": "escrow" | "direct",
 *   "escrow_records": [...],
 *   "message": "Project funded successfully",
 *   "correlation_id": "uuid"
 * }
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const guard = await apiGuard(req);
  if (guard instanceof NextResponse) return guard;

  const guardCtx = guard as GuardContext;

  try {
    // Parse and validate request body
    const payload = await req.json();
    const sanitized = sanitizePayload(payload);

    // Ensure project_id matches URL parameter
    sanitized.project_id = projectId;

    const validation = FundExternalProjectSchema.safeParse(sanitized);
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

    const fundingData = validation.data;

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

    // Verify the authenticated user matches the epc_contractor_id in the request
    if (guardCtx.userId !== fundingData.epc_contractor_id) {
      return NextResponse.json(
        {
          error: 'Forbidden - Cannot fund project on behalf of another EPC contractor',
          correlation_id: guardCtx.correlationId,
        },
        { status: 403 }
      );
    }

    // Initialize EPC Funding Service
    const auditLogger = new AuditLogger(ctx.dataService);
    const fundingService = new EPCFundingService(
      ctx.dataService,
      ctx.eventBus,
      auditLogger
    );

    // Fund the external project
    const result = await fundingService.fundExternalProject(
      fundingData,
      {
        user_id: guardCtx.userId,
        correlation_id: guardCtx.correlationId,
        ip_address: guardCtx.ipAddress,
      }
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('[API] Error funding external project:', error);

    // Handle specific error types
    if (error instanceof Error) {
      const errorName = error.constructor.name;

      if (errorName === 'EPCFundingValidationError') {
        return NextResponse.json(
          {
            error: error.message,
            correlation_id: guardCtx.correlationId,
          },
          { status: 400 }
        );
      }

      if (errorName === 'InsufficientPermissionsError') {
        return NextResponse.json(
          {
            error: error.message,
            correlation_id: guardCtx.correlationId,
          },
          { status: 403 }
        );
      }

      if (errorName === 'EscrowIntegrationError' || errorName === 'PaymentModeError') {
        return NextResponse.json(
          {
            error: error.message,
            correlation_id: guardCtx.correlationId,
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fund external project',
        correlation_id: guardCtx.correlationId,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/v1/projects/[projectId]/fund
 * 
 * Get funding status for an external project
 * 
 * Response:
 * {
 *   "funding_id": "uuid",
 *   "project_id": "uuid",
 *   "epc_contractor_id": "uuid",
 *   "funding_amount": 10000000,
 *   "escrow_status": "pending" | "funded" | "released" | "disputed",
 *   "payment_mode": "escrow" | "direct",
 *   "milestone_schedule": [...],
 *   "commission_agreement": {...},
 *   "escrow_records": [...],
 *   "payment_completion_status": {
 *     "total_milestones": 3,
 *     "funded_milestones": 2,
 *     "released_milestones": 1,
 *     "pending_milestones": 0
 *   },
 *   "created_at": "2024-01-01T00:00:00Z",
 *   "updated_at": "2024-01-01T00:00:00Z"
 * }
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
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

    // Initialize EPC Funding Service
    const auditLogger = new AuditLogger(ctx.dataService);
    const fundingService = new EPCFundingService(
      ctx.dataService,
      ctx.eventBus,
      auditLogger
    );

    // Get funding status
    const status = await fundingService.getEPCFundingStatus(projectId);

    // Verify the authenticated user is the EPC contractor who funded the project
    if (guardCtx.userId !== status.epc_contractor_id) {
      return NextResponse.json(
        {
          error: 'Forbidden - Cannot view funding status for projects funded by other EPC contractors',
          correlation_id: guardCtx.correlationId,
        },
        { status: 403 }
      );
    }

    return NextResponse.json(status, { status: 200 });
  } catch (error) {
    console.error('[API] Error fetching funding status:', error);

    // Handle specific error types
    if (error instanceof Error) {
      const errorName = error.constructor.name;

      if (errorName === 'EPCFundingValidationError') {
        return NextResponse.json(
          {
            error: error.message,
            correlation_id: guardCtx.correlationId,
          },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch funding status',
        correlation_id: guardCtx.correlationId,
      },
      { status: 500 }
    );
  }
}
