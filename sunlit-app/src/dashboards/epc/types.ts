/**
 * EPC Dashboard Types
 * 
 * Type definitions for EPC dashboard data structures.
 * Extends existing installer dashboard types with EPC-specific metrics.
 */

import { InstallerDashboardSummary } from '@/dashboards/installer/services/installer-api';

/**
 * External project summary for EPC dashboard
 */
export interface ExternalProjectSummary {
  id: string;
  title: string;
  status: string;
  location_state?: string;
  location_city?: string;
  system_size_kw?: number;
  funding_source: 'client' | 'epc_funded';
  created_at: string;
  milestones_total: number;
  milestones_completed: number;
}

/**
 * Active crew assignment for EPC dashboard
 */
export interface CrewAssignment {
  id: string;
  project_id: string;
  project_title: string;
  crew_id: string;
  assignment_status: 'assigned' | 'active' | 'completed' | 'cancelled';
  milestone_assignments: Record<string, unknown>;
  created_at: string;
}

/**
 * Enhanced metrics for EPC contractors
 */
export interface EPCMetrics {
  externalProjectCount: number;
  totalCrewsManaged: number;
  externalProjectRevenue: number;
}

/**
 * Audit log summary for EPC dashboard
 */
export interface AuditLogSummary {
  recentActions: number;
  lastActionTimestamp?: string;
}

/**
 * EPC Dashboard Data
 * Extends InstallerDashboardSummary with EPC-specific data
 */
export interface EPCDashboardData extends InstallerDashboardSummary {
  externalProjects: ExternalProjectSummary[];
  activeCrews: CrewAssignment[];
  enhancedMetrics: EPCMetrics;
  auditLogAccess: AuditLogSummary;
}
