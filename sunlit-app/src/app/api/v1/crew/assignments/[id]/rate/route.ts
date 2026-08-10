/**
 * API Route: POST /api/v1/crew/assignments/[id]/rate
 * 
 * Submit performance rating for a crew assignment.
 * 
 * Feature: EPC Dashboard Enterprise System
 * Task: 10.4 Implement crew performance tracking
 * Requirements: 6.5, 8.4
 * 
 * Security: EPC contractor or project owner only
 * Validation: Ratings must be 1-5, assignment must not be already rated
 * Audit: All rating submissions logged
 */

import { NextRequest, NextResponse } from 'next/server';
import { apiGuard, GuardContext } from '@/shared/api/api-guard';
import { createBackendContext } from '@/shared/api/backend-context';
import { submitPerformanceRating } from '@/core/crewlink/crew-performance-service';
import { z } from 'zod';

/**
 * Performance rating schema
 */
const PerformanceRatingSchema = z.object({
  quality_rating: z.number().int().min(1).max(5),
  timeliness_rating: z.number().int().min(1).max(5),
  communication_rating: z.number().int().min(1).max(5),
  completion_notes: z.string().max(1000).optional(),
});

/**
 * POST /api/v1/crew/assignments/[id]/rate
 * 
 * Submit performance rating for a crew assignment
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await apiGuard(request);
  if (guard instanceof NextResponse) return guard;
  const guardCtx = guard as GuardContext;

  try {
    // Await params (Next.js 15+ requirement)
    const { id: assignmentId } = await params;

    // Verify EPC contractor, installer, or project owner role
    const isEpcContractor = guardCtx.userRole === 'epc_contractor';
    const isInstaller = guardCtx.userRole === 'installer';
    const isProjectOwner = guardCtx.userRole === 'project_owner';
    const isAdmin = guardCtx.userRole === 'admin';
    
    if (!isEpcContractor && !isInstaller && !isProjectOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Access denied. Authorized contractor or project owner role required.', correlation_id: guardCtx.correlationId },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    
    // Validate rating data
    const validationResult = PerformanceRatingSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid rating data',
          details: validationResult.error.issues,
          correlation_id: guardCtx.correlationId,
        },
        { status: 400 }
      );
    }

    const ratingData = validationResult.data;

    // Initialize backend services
    const backendCtx = createBackendContext();

    if (backendCtx) {
      // Submit performance rating
      await submitPerformanceRating(
        {
          supabase: backendCtx.supabase,
          dataService: backendCtx.dataService,
          eventBus: backendCtx.eventBus,
          userId: guardCtx.userId,
          correlationId: guardCtx.correlationId,
          ipAddress: guardCtx.ipAddress,
        },
        assignmentId,
        ratingData
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Performance rating submitted successfully',
      correlation_id: guardCtx.correlationId,
    });
  } catch (error) {
    console.error('Error submitting performance rating:', error);
    
    if (error instanceof Error) {
      // Handle specific error cases
      if (error.message.includes('not found')) {
        return NextResponse.json(
          { error: error.message, correlation_id: guardCtx.correlationId },
          { status: 404 }
        );
      }
      
      if (error.message.includes('Access denied') || error.message.includes('already been rated')) {
        return NextResponse.json(
          { error: error.message, correlation_id: guardCtx.correlationId },
          { status: 403 }
        );
      }
      
      if (error.message.includes('Ratings must be')) {
        return NextResponse.json(
          { error: error.message, correlation_id: guardCtx.correlationId },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to submit performance rating', correlation_id: guardCtx.correlationId },
      { status: 500 }
    );
  }
}

