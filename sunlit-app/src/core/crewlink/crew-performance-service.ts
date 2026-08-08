/**
 * Crew Performance Service
 * 
 * Service for tracking and managing crew performance metrics.
 * Integrates with milestone progression and provides performance history.
 * 
 * Feature: EPC Dashboard Enterprise System
 * Task: 10.4 Implement crew performance tracking
 * Requirements: 6.5, 8.4
 * 
 * Architecture: Extends existing CrewLink system with performance tracking
 * Security: RBAC enforced, RLS policies applied
 * Audit: All operations logged with correlation IDs
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { DataService } from '@/shared/api/data-service';
import { EventBus } from '@/core/event-bus/emitter';

/**
 * Performance metrics structure stored in crew_project_assignments.performance_metrics
 */
export interface PerformanceMetrics {
  milestone_completions: Record<string, MilestoneCompletion>;
  aggregate_scores: AggregateScores;
  completion_rate: number; // Percentage of assigned milestones completed
  on_time_rate: number; // Percentage of milestones completed on time
  total_hours: number;
  last_updated: string;
}

/**
 * Milestone completion details
 */
export interface MilestoneCompletion {
  completed_at: string;
  quality_score?: number; // 1-5
  timeliness_score?: number; // 1-5
  hours_worked: number;
  was_on_time: boolean;
  notes?: string;
}

/**
 * Aggregate performance scores
 */
export interface AggregateScores {
  quality_avg: number;
  timeliness_avg: number;
  communication_avg: number;
  total_hours: number;
}

/**
 * Crew work completion data
 */
export interface CrewWorkCompletionData {
  assignment_id: string;
  milestone_id: string;
  hours_worked: number;
  quality_score?: number; // 1-5
  timeliness_score?: number; // 1-5
  completion_notes?: string;
}

/**
 * Performance rating data
 */
export interface PerformanceRatingData {
  quality_rating: number; // 1-5
  timeliness_rating: number; // 1-5
  communication_rating: number; // 1-5
  completion_notes?: string;
}

/**
 * Performance history entry
 */
export interface PerformanceHistoryEntry {
  project_id: string;
  project_title: string;
  assignment_id: string;
  milestone_completions: number;
  quality_avg: number;
  timeliness_avg: number;
  communication_avg: number;
  total_hours: number;
  completion_rate: number;
  on_time_rate: number;
  created_at: string;
  updated_at: string;
}

/**
 * Service context for crew performance operations
 */
export interface CrewPerformanceServiceContext {
  supabase: SupabaseClient;
  dataService: DataService;
  eventBus: EventBus;
  userId: string;
  correlationId: string;
  ipAddress?: string;
}

/**
 * Update crew performance metrics in crew_project_assignments
 * 
 * This function updates the performance_metrics JSONB field with:
 * - Milestone completion data
 * - Aggregate performance scores
 * - Completion and on-time rates
 * 
 * @param context - Service context
 * @param projectId - Project ID
 * @param crewId - Crew member ID
 * @param metrics - Performance metrics to update
 * @returns Updated performance metrics
 */
export async function updateCrewPerformanceMetrics(
  context: CrewPerformanceServiceContext,
  projectId: string,
  crewId: string,
  metrics: Partial<PerformanceMetrics>
): Promise<PerformanceMetrics> {
  const { dataService, eventBus, userId, correlationId, ipAddress } = context;

  try {
    // Get existing crew project assignment
    const assignment = await dataService.findOne('crew_project_assignments', {
      project_id: projectId,
      crew_id: crewId,
    });

    if (!assignment) {
      throw new Error('Crew project assignment not found');
    }

    // Merge with existing metrics
    const existingMetrics = (assignment.performance_metrics || {}) as PerformanceMetrics;
    const updatedMetrics: PerformanceMetrics = {
      milestone_completions: {
        ...(existingMetrics.milestone_completions || {}),
        ...(metrics.milestone_completions || {}),
      },
      aggregate_scores: {
        ...(existingMetrics.aggregate_scores || { quality_avg: 0, timeliness_avg: 0, communication_avg: 0, total_hours: 0 }),
        ...(metrics.aggregate_scores || {}),
      },
      completion_rate: metrics.completion_rate ?? existingMetrics.completion_rate ?? 0,
      on_time_rate: metrics.on_time_rate ?? existingMetrics.on_time_rate ?? 0,
      total_hours: metrics.total_hours ?? existingMetrics.total_hours ?? 0,
      last_updated: new Date().toISOString(),
    };

    // Update crew project assignment
    await dataService.update(
      'crew_project_assignments',
      { id: assignment.id },
      {
        performance_metrics: updatedMetrics,
        updated_at: new Date().toISOString(),
      },
      {
        user_id: userId,
        correlation_id: correlationId,
        ip_address: ipAddress,
      }
    );

    // Emit performance updated event
    await eventBus.emit('crew_performance_updated', {
      timestamp: new Date().toISOString(),
      actor_id: userId,
      correlation_id: correlationId,
      project_id: projectId,
      crew_id: crewId,
      assignment_id: assignment.id,
      metrics: updatedMetrics,
    });

    return updatedMetrics;
  } catch (error) {
    console.error('Error updating crew performance metrics:', error);
    throw new Error(`Failed to update crew performance metrics: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Record crew work completion for a milestone
 * 
 * This function:
 * 1. Records milestone completion in performance_metrics
 * 2. Calculates timeliness (on-time vs late)
 * 3. Updates aggregate scores
 * 4. Emits milestone_crew_completion_recorded event
 * 
 * @param context - Service context
 * @param completionData - Crew work completion data
 * @returns Updated performance metrics
 */
export async function recordCrewWorkCompletion(
  context: CrewPerformanceServiceContext,
  completionData: CrewWorkCompletionData
): Promise<PerformanceMetrics> {
  const { dataService, eventBus, userId, correlationId, ipAddress } = context;

  try {
    // Get crew assignment
    const assignment = await dataService.findOne('crew_assignments', {
      id: completionData.assignment_id,
    });

    if (!assignment) {
      throw new Error('Crew assignment not found');
    }

    // Get milestone details to check schedule
    const milestone = await dataService.findOne('milestones', {
      id: completionData.milestone_id,
    });

    if (!milestone) {
      throw new Error('Milestone not found');
    }

    // Determine if completion was on time
    const completedAt = new Date();
    const scheduledDate = milestone.scheduled_date ? new Date(milestone.scheduled_date) : null;
    const wasOnTime = scheduledDate ? completedAt <= scheduledDate : true;

    // Create milestone completion record
    const milestoneCompletion: MilestoneCompletion = {
      completed_at: completedAt.toISOString(),
      quality_score: completionData.quality_score,
      timeliness_score: completionData.timeliness_score,
      hours_worked: completionData.hours_worked,
      was_on_time: wasOnTime,
      notes: completionData.completion_notes,
    };

    // Get existing crew project assignment
    const crewProjectAssignment = await dataService.findOne('crew_project_assignments', {
      project_id: assignment.project_id,
      crew_id: assignment.crew_member_id,
    });

    if (!crewProjectAssignment) {
      throw new Error('Crew project assignment not found');
    }

    const existingMetrics = (crewProjectAssignment.performance_metrics || {}) as PerformanceMetrics;
    const milestoneCompletions = {
      ...(existingMetrics.milestone_completions || {}),
      [completionData.milestone_id]: milestoneCompletion,
    };

    // Calculate aggregate scores
    const completions = Object.values(milestoneCompletions);
    const qualityScores = completions.filter(c => c.quality_score).map(c => c.quality_score!);
    const timelinessScores = completions.filter(c => c.timeliness_score).map(c => c.timeliness_score!);
    const totalHours = completions.reduce((sum, c) => sum + c.hours_worked, 0);
    const onTimeCount = completions.filter(c => c.was_on_time).length;

    // Get milestone assignments to calculate completion rate
    const milestoneAssignments = crewProjectAssignment.milestone_assignments || {};
    const totalAssignedMilestones = Object.keys(milestoneAssignments).length;
    const completedMilestones = Object.keys(milestoneCompletions).length;

    const aggregateScores: AggregateScores = {
      quality_avg: qualityScores.length > 0 ? qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length : 0,
      timeliness_avg: timelinessScores.length > 0 ? timelinessScores.reduce((a, b) => a + b, 0) / timelinessScores.length : 0,
      communication_avg: existingMetrics.aggregate_scores?.communication_avg || 0, // Updated separately via ratings
      total_hours: totalHours,
    };

    const updatedMetrics: PerformanceMetrics = {
      milestone_completions: milestoneCompletions,
      aggregate_scores: aggregateScores,
      completion_rate: totalAssignedMilestones > 0 ? (completedMilestones / totalAssignedMilestones) * 100 : 0,
      on_time_rate: completions.length > 0 ? (onTimeCount / completions.length) * 100 : 0,
      total_hours: totalHours,
      last_updated: new Date().toISOString(),
    };

    // Update crew project assignment
    await dataService.update(
      'crew_project_assignments',
      { id: crewProjectAssignment.id },
      {
        performance_metrics: updatedMetrics,
        updated_at: new Date().toISOString(),
      },
      {
        user_id: userId,
        correlation_id: correlationId,
        ip_address: ipAddress,
      }
    );

    // Update crew assignment hours logged
    await dataService.update(
      'crew_assignments',
      { id: completionData.assignment_id },
      {
        hours_logged: (assignment.hours_logged || 0) + completionData.hours_worked,
        updated_at: new Date().toISOString(),
      },
      {
        user_id: userId,
        correlation_id: correlationId,
        ip_address: ipAddress,
      }
    );

    // Emit milestone crew completion event
    await eventBus.emit('milestone_crew_completion_recorded', {
      timestamp: new Date().toISOString(),
      actor_id: userId,
      correlation_id: correlationId,
      project_id: assignment.project_id,
      crew_id: assignment.crew_member_id,
      milestone_id: completionData.milestone_id,
      assignment_id: completionData.assignment_id,
      hours_worked: completionData.hours_worked,
      was_on_time: wasOnTime,
    });

    return updatedMetrics;
  } catch (error) {
    console.error('Error recording crew work completion:', error);
    throw new Error(`Failed to record crew work completion: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get crew performance history for a crew member
 * 
 * @param context - Service context
 * @param crewId - Crew member ID
 * @returns Array of performance history entries
 */
export async function getCrewPerformanceHistory(
  context: CrewPerformanceServiceContext,
  crewId: string
): Promise<PerformanceHistoryEntry[]> {
  const { dataService } = context;

  try {
    // Get all crew project assignments for this crew member
    const assignments = await dataService.findMany('crew_project_assignments', {
      crew_id: crewId,
    });

    // Get project details for each assignment
    const history: PerformanceHistoryEntry[] = [];

    for (const assignment of assignments) {
      const project = await dataService.findOne('projects', {
        id: assignment.project_id,
      });

      if (!project) continue;

      const metrics = (assignment.performance_metrics || {}) as PerformanceMetrics;
      const milestoneCompletions = Object.keys(metrics.milestone_completions || {}).length;

      history.push({
        project_id: assignment.project_id,
        project_title: project.title || 'Untitled Project',
        assignment_id: assignment.id,
        milestone_completions: milestoneCompletions,
        quality_avg: metrics.aggregate_scores?.quality_avg || 0,
        timeliness_avg: metrics.aggregate_scores?.timeliness_avg || 0,
        communication_avg: metrics.aggregate_scores?.communication_avg || 0,
        total_hours: metrics.total_hours || 0,
        completion_rate: metrics.completion_rate || 0,
        on_time_rate: metrics.on_time_rate || 0,
        created_at: assignment.created_at,
        updated_at: assignment.updated_at,
      });
    }

    // Sort by most recent first
    history.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

    return history;
  } catch (error) {
    console.error('Error getting crew performance history:', error);
    throw new Error(`Failed to get crew performance history: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Calculate aggregate performance scores across all projects
 * 
 * @param context - Service context
 * @param crewId - Crew member ID
 * @returns Aggregate performance scores
 */
export async function calculateAggregatePerformance(
  context: CrewPerformanceServiceContext,
  crewId: string
): Promise<AggregateScores & { projects_completed: number; total_milestones: number }> {
  const { dataService } = context;

  try {
    // Get all crew project assignments
    const assignments = await dataService.findMany('crew_project_assignments', {
      crew_id: crewId,
    });

    let totalQuality = 0;
    let totalTimeliness = 0;
    let totalCommunication = 0;
    let totalHours = 0;
    let totalMilestones = 0;
    let qualityCount = 0;
    let timelinessCount = 0;
    let communicationCount = 0;

    for (const assignment of assignments) {
      const metrics = (assignment.performance_metrics || {}) as PerformanceMetrics;
      
      if (metrics.aggregate_scores) {
        if (metrics.aggregate_scores.quality_avg > 0) {
          totalQuality += metrics.aggregate_scores.quality_avg;
          qualityCount++;
        }
        if (metrics.aggregate_scores.timeliness_avg > 0) {
          totalTimeliness += metrics.aggregate_scores.timeliness_avg;
          timelinessCount++;
        }
        if (metrics.aggregate_scores.communication_avg > 0) {
          totalCommunication += metrics.aggregate_scores.communication_avg;
          communicationCount++;
        }
      }

      totalHours += metrics.total_hours || 0;
      totalMilestones += Object.keys(metrics.milestone_completions || {}).length;
    }

    return {
      quality_avg: qualityCount > 0 ? totalQuality / qualityCount : 0,
      timeliness_avg: timelinessCount > 0 ? totalTimeliness / timelinessCount : 0,
      communication_avg: communicationCount > 0 ? totalCommunication / communicationCount : 0,
      total_hours: totalHours,
      projects_completed: assignments.filter(a => a.assignment_status === 'completed').length,
      total_milestones: totalMilestones,
    };
  } catch (error) {
    console.error('Error calculating aggregate performance:', error);
    throw new Error(`Failed to calculate aggregate performance: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Submit performance rating for a crew assignment
 * 
 * This function:
 * 1. Updates crew_assignments table with ratings
 * 2. Updates crew_project_assignments.performance_metrics
 * 3. Recalculates aggregate scores
 * 4. Emits crew_rated event
 * 
 * @param context - Service context
 * @param assignmentId - Crew assignment ID
 * @param ratingData - Performance rating data
 * @returns Updated assignment with ratings
 */
export async function submitPerformanceRating(
  context: CrewPerformanceServiceContext,
  assignmentId: string,
  ratingData: PerformanceRatingData
): Promise<void> {
  const { dataService, eventBus, userId, correlationId, ipAddress } = context;

  try {
    // Validate ratings are in range 1-5
    if (ratingData.quality_rating < 1 || ratingData.quality_rating > 5 ||
        ratingData.timeliness_rating < 1 || ratingData.timeliness_rating > 5 ||
        ratingData.communication_rating < 1 || ratingData.communication_rating > 5) {
      throw new Error('Ratings must be between 1 and 5');
    }

    // Get crew assignment
    const assignment = await dataService.findOne('crew_assignments', {
      id: assignmentId,
    });

    if (!assignment) {
      throw new Error('Crew assignment not found');
    }

    // Check if already rated
    if (assignment.quality_rating || assignment.timeliness_rating || assignment.communication_rating) {
      throw new Error('This assignment has already been rated');
    }

    // Verify user has permission to rate (EPC contractor or project owner)
    const project = await dataService.findOne('projects', {
      id: assignment.project_id,
    });

    if (!project) {
      throw new Error('Project not found');
    }

    const canRate = project.owner_id === userId || project.creator_id === userId;
    if (!canRate) {
      throw new Error('Access denied: Only project owner or creator can rate crews');
    }

    // Update crew assignment with ratings
    await dataService.update(
      'crew_assignments',
      { id: assignmentId },
      {
        quality_rating: ratingData.quality_rating,
        timeliness_rating: ratingData.timeliness_rating,
        communication_rating: ratingData.communication_rating,
        completion_notes: ratingData.completion_notes || assignment.completion_notes,
        updated_at: new Date().toISOString(),
      },
      {
        user_id: userId,
        correlation_id: correlationId,
        ip_address: ipAddress,
      }
    );

    // Update crew project assignment performance metrics
    const crewProjectAssignment = await dataService.findOne('crew_project_assignments', {
      project_id: assignment.project_id,
      crew_id: assignment.crew_member_id,
    });

    if (crewProjectAssignment) {
      const existingMetrics = (crewProjectAssignment.performance_metrics || {}) as PerformanceMetrics;
      
      // Update communication average in aggregate scores
      const updatedAggregateScores: AggregateScores = {
        ...(existingMetrics.aggregate_scores || { quality_avg: 0, timeliness_avg: 0, communication_avg: 0, total_hours: 0 }),
        communication_avg: ratingData.communication_rating,
      };

      await dataService.update(
        'crew_project_assignments',
        { id: crewProjectAssignment.id },
        {
          performance_metrics: {
            ...existingMetrics,
            aggregate_scores: updatedAggregateScores,
            last_updated: new Date().toISOString(),
          },
          updated_at: new Date().toISOString(),
        },
        {
          user_id: userId,
          correlation_id: correlationId,
          ip_address: ipAddress,
        }
      );
    }

    // Emit crew_rated event
    await eventBus.emit('crew_rated', {
      timestamp: new Date().toISOString(),
      actor_id: userId,
      correlation_id: correlationId,
      assignment_id: assignmentId,
      crew_id: assignment.crew_member_id,
      project_id: assignment.project_id,
      quality_rating: ratingData.quality_rating,
      timeliness_rating: ratingData.timeliness_rating,
      communication_rating: ratingData.communication_rating,
    });
  } catch (error) {
    console.error('Error submitting performance rating:', error);
    throw new Error(`Failed to submit performance rating: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
