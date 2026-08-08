/**
 * EPC Dashboard Data Service
 * 
 * Server-side service for loading EPC dashboard data.
 * Fetches external projects, active crews, enhanced metrics, and audit log summaries.
 * 
 * Feature: EPC Dashboard Enterprise System
 * Task: 4.1 Create EPC dashboard data service
 * Requirements: 2.1, 2.2
 */

import { SupabaseClient } from '@supabase/supabase-js';
import {
  EPCDashboardData,
  ExternalProjectSummary,
  CrewAssignment,
  EPCMetrics,
  AuditLogSummary,
} from '../types';
import { InstallerDashboardSummary } from '@/dashboards/installer/services/installer-api';

/**
 * Load EPC dashboard data for a given EPC contractor
 * 
 * @param supabase - Supabase client instance
 * @param epcContractorId - UUID of the EPC contractor
 * @returns EPCDashboardData with all dashboard metrics and summaries
 */
export async function loadEPCDashboardData(
  supabase: SupabaseClient,
  epcContractorId: string
): Promise<EPCDashboardData> {
  // Fetch external projects created by this EPC contractor
  const externalProjects = await fetchExternalProjects(supabase, epcContractorId);
  
  // Fetch active crew assignments for EPC contractor's projects
  const activeCrews = await fetchActiveCrews(supabase, epcContractorId);
  
  // Calculate enhanced metrics
  const enhancedMetrics = await calculateEnhancedMetrics(
    supabase,
    epcContractorId,
    externalProjects
  );
  
  // Fetch audit log summary
  const auditLogAccess = await fetchAuditLogSummary(supabase, epcContractorId);
  
  // Get base installer dashboard data
  // For now, return mock data - this will be replaced with actual installer data loading
  const installerData: InstallerDashboardSummary = {
    activeProjects: externalProjects.filter(p => p.status === 'in_progress').length,
    pendingBids: 0, // EPC contractors may not have pending bids in the same way
    totalEarnings: enhancedMetrics.externalProjectRevenue,
    crewJobsPosted: activeCrews.length,
    pendingMilestones: 0, // Will be calculated from projects
    newMatches: 0,
  };
  
  return {
    ...installerData,
    externalProjects,
    activeCrews,
    enhancedMetrics,
    auditLogAccess,
  };
}

/**
 * Fetch external projects created by the EPC contractor
 */
async function fetchExternalProjects(
  supabase: SupabaseClient,
  epcContractorId: string
): Promise<ExternalProjectSummary[]> {
  const { data: projects, error } = await supabase
    .from('projects')
    .select(`
      id,
      title,
      status,
      location_state,
      location_city,
      system_size_kw,
      funding_source,
      created_at
    `)
    .eq('project_source', 'external')
    .eq('creator_id', epcContractorId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching external projects:', error);
    throw new Error(`Failed to fetch external projects: ${error.message}`);
  }

  // Fetch milestone counts for each project
  const projectsWithMilestones = await Promise.all(
    (projects || []).map(async (project) => {
      const { data: milestones, error: milestonesError } = await supabase
        .from('milestones')
        .select('id, is_completed')
        .eq('project_id', project.id);

      if (milestonesError) {
        console.error(`Error fetching milestones for project ${project.id}:`, milestonesError);
      }

      const milestones_total = milestones?.length || 0;
      const milestones_completed = milestones?.filter(m => m.is_completed).length || 0;

      return {
        ...project,
        milestones_total,
        milestones_completed,
      };
    })
  );

  return projectsWithMilestones;
}

/**
 * Fetch active crew assignments for EPC contractor's projects
 */
async function fetchActiveCrews(
  supabase: SupabaseClient,
  epcContractorId: string
): Promise<CrewAssignment[]> {
  // First, get all project IDs for this EPC contractor
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('id')
    .eq('project_source', 'external')
    .eq('creator_id', epcContractorId);

  if (projectsError) {
    console.error('Error fetching EPC projects for crew assignments:', projectsError);
    throw new Error(`Failed to fetch projects: ${projectsError.message}`);
  }

  if (!projects || projects.length === 0) {
    return [];
  }

  const projectIds = projects.map(p => p.id);

  // Fetch crew assignments for these projects
  const { data: assignments, error: assignmentsError } = await supabase
    .from('crew_project_assignments')
    .select(`
      id,
      project_id,
      crew_id,
      assignment_status,
      milestone_assignments,
      created_at
    `)
    .in('project_id', projectIds)
    .in('assignment_status', ['assigned', 'active']);

  if (assignmentsError) {
    console.error('Error fetching crew assignments:', assignmentsError);
    throw new Error(`Failed to fetch crew assignments: ${assignmentsError.message}`);
  }

  // Enrich with project titles
  const enrichedAssignments = await Promise.all(
    (assignments || []).map(async (assignment) => {
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('title')
        .eq('id', assignment.project_id)
        .single();

      if (projectError) {
        console.error(`Error fetching project title for ${assignment.project_id}:`, projectError);
      }

      return {
        ...assignment,
        project_title: project?.title || 'Unknown Project',
      };
    })
  );

  return enrichedAssignments;
}

/**
 * Calculate enhanced metrics for EPC contractor
 */
async function calculateEnhancedMetrics(
  supabase: SupabaseClient,
  epcContractorId: string,
  externalProjects: ExternalProjectSummary[]
): Promise<EPCMetrics> {
  // External project count
  const externalProjectCount = externalProjects.length;

  // Total crews managed (count unique crews across all projects)
  const { data: crewAssignments, error: crewError } = await supabase
    .from('crew_project_assignments')
    .select('crew_id')
    .in(
      'project_id',
      externalProjects.map(p => p.id)
    );

  if (crewError) {
    console.error('Error fetching crew assignments for metrics:', crewError);
  }

  const uniqueCrewIds = new Set(crewAssignments?.map(a => a.crew_id) || []);
  const totalCrewsManaged = uniqueCrewIds.size;

  // External project revenue (sum of all milestone amounts for external projects)
  let externalProjectRevenue = 0;
  
  for (const project of externalProjects) {
    const { data: milestones, error: milestonesError } = await supabase
      .from('milestones')
      .select('amount')
      .eq('project_id', project.id);

    if (milestonesError) {
      console.error(`Error fetching milestones for revenue calculation (project ${project.id}):`, milestonesError);
      continue;
    }

    const projectRevenue = milestones?.reduce((sum, m) => sum + (Number(m.amount) || 0), 0) || 0;
    externalProjectRevenue += projectRevenue;
  }

  return {
    externalProjectCount,
    totalCrewsManaged,
    externalProjectRevenue,
  };
}

/**
 * Fetch audit log summary for EPC contractor
 */
async function fetchAuditLogSummary(
  supabase: SupabaseClient,
  epcContractorId: string
): Promise<AuditLogSummary> {
  // Fetch recent EPC-specific audit logs (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: auditLogs, error } = await supabase
    .from('audit_logs')
    .select('created_at')
    .eq('user_id', epcContractorId)
    .like('action_category', 'epc_%')
    .gte('created_at', thirtyDaysAgo.toISOString())
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching audit logs:', error);
    return {
      recentActions: 0,
    };
  }

  return {
    recentActions: auditLogs?.length || 0,
    lastActionTimestamp: auditLogs?.[0]?.created_at,
  };
}
