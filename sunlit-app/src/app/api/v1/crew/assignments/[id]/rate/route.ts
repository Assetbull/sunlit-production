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
import { getSession } from '@/shared/session/sessionManager';
import { DataService } from '@/shared/api/data-service';
import { EventBus } from '@/core/event-bus/emitter';
import { submitPerformanceRating } from '@/core/crewlink/crew-performance-service';
import { createClient } from '@supabase/supabase-js';
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
  try {
    // Await params (Next.js 15+ requirement)
    const { id: assignmentId } = await params;

    // Get session
    const session = getSession();
    if (!session?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify EPC contractor role (or project owner - checked in service)
    const isEpcContractor = session.role === 'epc_contractor';
    const isInstaller = session.role === 'installer';
    
    if (!isEpcContractor && !isInstaller) {
      return NextResponse.json(
        { error: 'Access denied. EPC contractor or installer role required.' },
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
          details: validationResult.error.issues 
        },
        { status: 400 }
      );
    }

    const ratingData = validationResult.data;

    // Generate correlation ID for audit trail
    const correlationId = `rate-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    // Get client IP
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';

    // Initialize services
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const dataService = new DataService(supabase);
    const eventBus = new EventBus(dataService);

    // Submit performance rating
    await submitPerformanceRating(
      {
        supabase,
        dataService,
        eventBus,
        userId: session.id,
        correlationId,
        ipAddress,
      },
      assignmentId,
      ratingData
    );

    return NextResponse.json({
      success: true,
      message: 'Performance rating submitted successfully',
      correlation_id: correlationId,
    });
  } catch (error) {
    console.error('Error submitting performance rating:', error);
    
    if (error instanceof Error) {
      // Handle specific error cases
      if (error.message.includes('not found')) {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        );
      }
      
      if (error.message.includes('Access denied') || error.message.includes('already been rated')) {
        return NextResponse.json(
          { error: error.message },
          { status: 403 }
        );
      }
      
      if (error.message.includes('Ratings must be')) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to submit performance rating' },
      { status: 500 }
    );
  }
}
