/**
 * EPC Dashboard API Endpoint
 * 
 * GET /api/v1/dashboard/epc
 * 
 * Returns EPC dashboard data including:
 * - Standard installer metrics
 * - External projects
 * - Active crew assignments
 * - Enhanced EPC metrics
 * - Audit log summary
 * 
 * Feature: EPC Dashboard Enterprise System
 * Task: 4.2 Enhance installer dashboard page with EPC features
 * Requirements: 2.1, 2.2
 */

import { NextRequest, NextResponse } from 'next/server';
import { createBackendContext } from '@/shared/api/backend-context';
import { loadEPCDashboardData } from '@/dashboards/epc';

export async function GET(request: NextRequest) {
  const context = createBackendContext();
  
  if (!context) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    );
  }

  // Get user ID from session cookie
  const sessionCookie = request.cookies.get('sunlit_session')?.value;
  
  if (!sessionCookie) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    // Parse session to get user ID
    const session = JSON.parse(sessionCookie);
    const userId = session.id;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    // Verify user has epc_contractor role
    if (session.role !== 'epc_contractor') {
      return NextResponse.json(
        { error: 'Forbidden - EPC contractor role required' },
        { status: 403 }
      );
    }

    // Load EPC dashboard data
    const dashboardData = await loadEPCDashboardData(
      context.supabase,
      userId
    );

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Error loading EPC dashboard:', error);
    return NextResponse.json(
      { error: 'Failed to load dashboard data' },
      { status: 500 }
    );
  }
}
