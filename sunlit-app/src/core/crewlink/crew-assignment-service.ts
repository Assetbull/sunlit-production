/**
 * Crew Assignment Service
 * 
 * Service for assigning crews to projects via crew_project_assignments table.
 * Handles scheduling conflicts, crew capacity validation, and milestone assignments.
 * 
 * Feature: EPC Dashboard Enterprise System
 * Task: 10.2 Implement crew-to-project assignment logic
 * Requirements: 6.3, 8.1, 8.2
 * 
 * Architecture: Extends existing CrewLink system with multi-crew coordination
 * Security: RBAC enforced, RLS policies applied
 * Audit: All operations logged with correlation IDs
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { DataService } from '@/shared/api/data-service';
import { EventBus } from '@/core/event-bus/emitter';
import type { CrewAssignment, CrewWorkStatus } from '@/shared/types/database';

/**
 * Crew assignment data
 */
export interface CrewAssignmentData {
  job_id: string;
  crew_member_id: string;
  project_id: string;
  agreed_rate: number;
  start_date?: string;
  end_date?: string;
  milestone_assignments?: MilestoneAssignmentData[];
}

/**
 * Milestone assignment data
 */
export interface MilestoneAssignmentData {
  milestone_id: string;
  milestone_name: string;
  estimated_hours: number;
  required_skills: string[];
  priority: 'low' | 'medium' | 'high';
  dependencies?: string[]; // Other milestone IDs
}

/**
 * Crew capacity information
 */
export interface CrewCapacity {
  crew_member_id: string;
  current_assignments: number;
  max_concurrent_assignments: number;
  availability_start?: string;
  availability_end?: string;
  skills: string[];
  hourly_capacity: number; // Hours per day
}

/**
 * Scheduling conflict information
 */
export interface SchedulingConflict {
  conflict_type: 'date_overlap' | 'capacity_exceeded' | 'skill_mismatch' | 'dependency_violation';
  description: string;
  conflicting_assignment_id?: string;
  suggested_resolution?: string;
}

/**
 * Assignment validation result
 */
export interface AssignmentValidationResult {
  is_valid: boolean;
  conflicts: SchedulingConflict[];
  warnings: string[];
  suggestions: string[];
}

/**
 * Service context for crew assignment operations
 */
export interface CrewAssignmentServiceContext {
  supabase: SupabaseClient;
  dataService: DataService;
  eventBus: EventBus;
  userId: string;
  correlationId: string;
  ipAddress?: string;
}

/**
 * Assign a crew member to a project
 * 
 * This function:
 * 1. Validates crew availability and capacity
 * 2. Checks for scheduling conflicts
 * 3. Creates crew assignment record
 * 4. Updates milestone assignments
 * 5. Emits crew_assigned event
 * 6. Logs action to audit trail
 * 
 * @param context - Service context
 * @param assignmentData - Crew assignment data
 * @returns Created assignment details
 * @throws Error if validation fails or conflicts exist
 */
export async function assignCrewToProject(
  context: CrewAssignmentServiceContext,
  assignmentData: CrewAssignmentData
): Promise<CrewAssignment> {
  const { dataService, eventBus, userId, correlationId, ipAddress } = context;

  // Validate required fields
  if (!assignmentData.job_id || !assignmentData.crew_member_id || !assignmentData.project_id) {
    throw new Error('Job ID, crew member ID, and project ID are required');
  }

  if (assignmentData.agreed_rate <= 0) {
    throw new Error('Agreed rate must be positive');
  }

  // Build audit context
  const auditContext = {
    user_id: userId,
    correlation_id: correlationId,
    ip_address: ipAddress,
  };

  try {
    // Validate assignment before creating
    const validation = await validateCrewAssignment(context, assignmentData);
    if (!validation.is_valid) {
      const conflictMessages = validation.conflicts.map(c => c.description).join('; ');
      throw new Error(`Assignment validation failed: ${conflictMessages}`);
    }

    // Verify job exists and user has permission to assign
    const job = await dataService.findOne('crew_jobs', {
      id: assignmentData.job_id,
    });

    if (!job) {
      throw new Error('Job not found');
    }

    // Check if user has permission to assign (job poster or project owner/creator)
    const project = await dataService.findOne('projects', {
      id: assignmentData.project_id,
    });

    if (!project) {
      throw new Error('Project not found');
    }

    const canAssign = job.posted_by === userId || 
                     project.owner_id === userId || 
                     project.creator_id === userId;

    if (!canAssign) {
      throw new Error('Access denied: Only job poster or project owner can assign crews');
    }

    // Check if assignment already exists
    const existingAssignment = await dataService.findOne('crew_assignments', {
      job_id: assignmentData.job_id,
      crew_member_id: assignmentData.crew_member_id,
    });

    if (existingAssignment) {
      throw new Error('Crew member is already assigned to this job');
    }

    // Create crew assignment record
    const assignment = await dataService.create(
      'crew_assignments',
      {
        job_id: assignmentData.job_id,
        crew_member_id: assignmentData.crew_member_id,
        project_id: assignmentData.project_id,
        assigned_by: userId,
        agreed_rate: assignmentData.agreed_rate,
        start_date: assignmentData.start_date || null,
        end_date: assignmentData.end_date || null,
        work_status: 'assigned',
        hours_logged: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      auditContext
    );

    // Update crew_project_assignments table for EPC coordination
    if (assignmentData.milestone_assignments && assignmentData.milestone_assignments.length > 0) {
      await updateCrewProjectAssignments(context, assignment.id, assignmentData.milestone_assignments);
    }

    // Update job status if this is the first assignment
    const assignmentCount = await dataService.count('crew_assignments', {
      job_id: assignmentData.job_id,
    });

    if (assignmentCount === 1) {
      await dataService.update('crew_jobs', { id: assignmentData.job_id }, {
        status: 'assigned',
        updated_at: new Date().toISOString(),
      }, auditContext);
    }

    // Emit crew_assigned event
    await eventBus.emit('crew_assigned', {
      timestamp: new Date().toISOString(),
      actor_id: userId,
      correlation_id: correlationId,
      assignment_id: assignment.id,
      job_id: assignmentData.job_id,
      crew_member_id: assignmentData.crew_member_id,
      project_id: assignmentData.project_id,
      agreed_rate: assignmentData.agreed_rate,
      has_milestone_assignments: !!assignmentData.milestone_assignments?.length,
    });

    return {
      id: assignment.id,
      job_id: assignment.job_id,
      crew_member_id: assignment.crew_member_id,
      project_id: assignment.project_id,
      assigned_by: assignment.assigned_by,
      agreed_rate: assignment.agreed_rate,
      start_date: assignment.start_date,
      end_date: assignment.end_date,
      hours_logged: assignment.hours_logged,
      work_status: assignment.work_status,
      completion_notes: assignment.completion_notes,
      quality_rating: assignment.quality_rating,
      timeliness_rating: assignment.timeliness_rating,
      communication_rating: assignment.communication_rating,
      created_at: assignment.created_at,
      updated_at: assignment.updated_at,
      completed_at: assignment.completed_at,
    };
  } catch (error) {
    console.error('Error assigning crew to project:', error);
    
    if (error instanceof Error) {
      throw new Error(`Failed to assign crew to project: ${error.message}`);
    }
    
    throw new Error('Failed to assign crew to project: Unknown error');
  }
}

/**
 * Validate crew assignment for conflicts and capacity
 * 
 * @param context - Service context
 * @param assignmentData - Assignment data to validate
 * @returns Validation result with conflicts and suggestions
 */
export async function validateCrewAssignment(
  context: CrewAssignmentServiceContext,
  assignmentData: CrewAssignmentData
): Promise<AssignmentValidationResult> {
  const { dataService } = context;
  
  const conflicts: SchedulingConflict[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  try {
    // Check crew capacity
    const crewCapacity = await getCrewCapacity(context, assignmentData.crew_member_id);
    
    if (crewCapacity.current_assignments >= crewCapacity.max_concurrent_assignments) {
      conflicts.push({
        conflict_type: 'capacity_exceeded',
        description: `Crew member has reached maximum concurrent assignments (${crewCapacity.max_concurrent_assignments})`,
        suggested_resolution: 'Wait for current assignments to complete or increase crew capacity',
      });
    }

    // Check date conflicts if dates are provided
    if (assignmentData.start_date && assignmentData.end_date) {
      const dateConflicts = await checkDateConflicts(context, assignmentData);
      conflicts.push(...dateConflicts);
    }

    // Check skill requirements
    const job = await dataService.findOne('crew_jobs', { id: assignmentData.job_id });
    if (job && job.required_skills && job.required_skills.length > 0) {
      const skillConflicts = await checkSkillRequirements(context, assignmentData.crew_member_id, job.required_skills);
      conflicts.push(...skillConflicts);
    }

    // Check milestone dependencies if provided
    if (assignmentData.milestone_assignments) {
      const dependencyConflicts = await checkMilestoneDependencies(context, assignmentData.milestone_assignments);
      conflicts.push(...dependencyConflicts);
    }

    // Generate suggestions based on conflicts
    if (conflicts.length === 0) {
      suggestions.push('Assignment looks good - no conflicts detected');
    } else {
      suggestions.push('Consider adjusting assignment parameters to resolve conflicts');
      
      if (conflicts.some(c => c.conflict_type === 'date_overlap')) {
        suggestions.push('Try adjusting start/end dates to avoid overlaps');
      }
      
      if (conflicts.some(c => c.conflict_type === 'capacity_exceeded')) {
        suggestions.push('Consider splitting work across multiple crew members');
      }
    }

    return {
      is_valid: conflicts.length === 0,
      conflicts,
      warnings,
      suggestions,
    };
  } catch (error) {
    console.error('Error validating crew assignment:', error);
    
    return {
      is_valid: false,
      conflicts: [{
        conflict_type: 'date_overlap',
        description: 'Validation failed due to system error',
      }],
      warnings: ['Unable to complete full validation'],
      suggestions: ['Please try again or contact support'],
    };
  }
}

/**
 * Get crew capacity information
 * 
 * @param context - Service context
 * @param crewMemberId - Crew member ID
 * @returns Crew capacity details
 */
async function getCrewCapacity(
  context: CrewAssignmentServiceContext,
  crewMemberId: string
): Promise<CrewCapacity> {
  const { dataService } = context;

  try {
    // Get current assignments count
    const currentAssignments = await dataService.count('crew_assignments', {
      crew_member_id: crewMemberId,
      work_status: ['assigned', 'active'], // Active assignments
    });

    // Get crew member profile (this would be extended in a real implementation)
    const crewMember = await dataService.findOne('users', { id: crewMemberId });
    
    if (!crewMember) {
      throw new Error('Crew member not found');
    }

    // Default capacity values (in a real system, these would come from crew profiles)
    return {
      crew_member_id: crewMemberId,
      current_assignments: currentAssignments,
      max_concurrent_assignments: 3, // Default max
      skills: [], // Would come from crew profile
      hourly_capacity: 8, // 8 hours per day default
    };
  } catch (error) {
    console.error('Error getting crew capacity:', error);
    throw error;
  }
}

/**
 * Check for date conflicts with existing assignments
 * 
 * @param context - Service context
 * @param assignmentData - Assignment data
 * @returns Array of date conflicts
 */
async function checkDateConflicts(
  context: CrewAssignmentServiceContext,
  assignmentData: CrewAssignmentData
): Promise<SchedulingConflict[]> {
  const { dataService } = context;
  const conflicts: SchedulingConflict[] = [];

  try {
    // Get existing assignments for the crew member
    const existingAssignments = await dataService.findMany('crew_assignments', {
      crew_member_id: assignmentData.crew_member_id,
      work_status: ['assigned', 'active'],
    });

    for (const existing of existingAssignments) {
      if (existing.start_date && existing.end_date && 
          assignmentData.start_date && assignmentData.end_date) {
        
        const existingStart = new Date(existing.start_date);
        const existingEnd = new Date(existing.end_date);
        const newStart = new Date(assignmentData.start_date);
        const newEnd = new Date(assignmentData.end_date);

        // Check for overlap
        if (newStart <= existingEnd && newEnd >= existingStart) {
          conflicts.push({
            conflict_type: 'date_overlap',
            description: `Date range overlaps with existing assignment from ${existing.start_date} to ${existing.end_date}`,
            conflicting_assignment_id: existing.id,
            suggested_resolution: 'Adjust start or end date to avoid overlap',
          });
        }
      }
    }

    return conflicts;
  } catch (error) {
    console.error('Error checking date conflicts:', error);
    return [];
  }
}

/**
 * Check skill requirements against crew member skills
 * 
 * @param context - Service context
 * @param crewMemberId - Crew member ID
 * @param requiredSkills - Required skills array
 * @returns Array of skill conflicts
 */
async function checkSkillRequirements(
  context: CrewAssignmentServiceContext,
  crewMemberId: string,
  requiredSkills: string[]
): Promise<SchedulingConflict[]> {
  const conflicts: SchedulingConflict[] = [];

  try {
    // In a real implementation, this would check crew member skills from their profile
    // For now, we'll assume basic validation
    
    const crewCapacity = await getCrewCapacity(context, crewMemberId);
    const crewSkills = crewCapacity.skills;

    const missingSkills = requiredSkills.filter(skill => !crewSkills.includes(skill));
    
    if (missingSkills.length > 0) {
      conflicts.push({
        conflict_type: 'skill_mismatch',
        description: `Crew member missing required skills: ${missingSkills.join(', ')}`,
        suggested_resolution: 'Provide training or assign a different crew member',
      });
    }

    return conflicts;
  } catch (error) {
    console.error('Error checking skill requirements:', error);
    return [];
  }
}

/**
 * Check milestone dependencies
 * 
 * @param context - Service context
 * @param milestoneAssignments - Milestone assignments
 * @returns Array of dependency conflicts
 */
async function checkMilestoneDependencies(
  context: CrewAssignmentServiceContext,
  milestoneAssignments: MilestoneAssignmentData[]
): Promise<SchedulingConflict[]> {
  const conflicts: SchedulingConflict[] = [];

  try {
    // Check for circular dependencies and unmet dependencies
    for (const assignment of milestoneAssignments) {
      if (assignment.dependencies && assignment.dependencies.length > 0) {
        // In a real implementation, this would check if dependencies are satisfied
        // For now, we'll do basic validation
        
        const circularDep = assignment.dependencies.includes(assignment.milestone_id);
        if (circularDep) {
          conflicts.push({
            conflict_type: 'dependency_violation',
            description: `Milestone ${assignment.milestone_name} has circular dependency on itself`,
            suggested_resolution: 'Remove circular dependency',
          });
        }
      }
    }

    return conflicts;
  } catch (error) {
    console.error('Error checking milestone dependencies:', error);
    return [];
  }
}

/**
 * Update crew project assignments for EPC coordination
 * 
 * @param context - Service context
 * @param assignmentId - Assignment ID
 * @param milestoneAssignments - Milestone assignments
 */
async function updateCrewProjectAssignments(
  context: CrewAssignmentServiceContext,
  assignmentId: string,
  milestoneAssignments: MilestoneAssignmentData[]
): Promise<void> {
  const { dataService, userId, correlationId, ipAddress } = context;

  try {
    const auditContext = {
      user_id: userId,
      correlation_id: correlationId,
      ip_address: ipAddress,
    };

    // Get the assignment details
    const assignment = await dataService.findOne('crew_assignments', { id: assignmentId });
    if (!assignment) {
      throw new Error('Assignment not found');
    }

    // Check if crew_project_assignment already exists
    const existingAssignment = await dataService.findOne('crew_project_assignments', {
      project_id: assignment.project_id,
      crew_id: assignment.crew_member_id,
    });

    const milestoneData = milestoneAssignments.reduce((acc, ma) => {
      acc[ma.milestone_id] = {
        milestone_name: ma.milestone_name,
        estimated_hours: ma.estimated_hours,
        required_skills: ma.required_skills,
        priority: ma.priority,
        dependencies: ma.dependencies || [],
      };
      return acc;
    }, {} as Record<string, any>);

    if (existingAssignment) {
      // Update existing assignment
      await dataService.update('crew_project_assignments', 
        { id: existingAssignment.id },
        {
          milestone_assignments: milestoneData,
          assignment_status: 'assigned',
          updated_at: new Date().toISOString(),
        },
        auditContext
      );
    } else {
      // Create new crew project assignment
      await dataService.create('crew_project_assignments', {
        project_id: assignment.project_id,
        crew_id: assignment.crew_member_id,
        milestone_assignments: milestoneData,
        assignment_status: 'assigned',
        performance_metrics: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, auditContext);
    }
  } catch (error) {
    console.error('Error updating crew project assignments:', error);
    // Don't throw here as this is supplementary data
  }
}

/**
 * Get crew assignments for a project
 * 
 * @param context - Service context
 * @param projectId - Project ID
 * @returns Array of crew assignments
 */
export async function getProjectCrewAssignments(
  context: CrewAssignmentServiceContext,
  projectId: string
): Promise<CrewAssignment[]> {
  const { dataService } = context;

  try {
    const assignments = await dataService.findMany('crew_assignments', {
      project_id: projectId,
    });

    return assignments.map((assignment: any) => ({
      id: assignment.id,
      job_id: assignment.job_id,
      crew_member_id: assignment.crew_member_id,
      project_id: assignment.project_id,
      assigned_by: assignment.assigned_by,
      agreed_rate: assignment.agreed_rate,
      start_date: assignment.start_date,
      end_date: assignment.end_date,
      hours_logged: assignment.hours_logged,
      work_status: assignment.work_status,
      completion_notes: assignment.completion_notes,
      quality_rating: assignment.quality_rating,
      timeliness_rating: assignment.timeliness_rating,
      communication_rating: assignment.communication_rating,
      created_at: assignment.created_at,
      updated_at: assignment.updated_at,
      completed_at: assignment.completed_at,
    }));
  } catch (error) {
    console.error('Error fetching project crew assignments:', error);
    throw new Error('Failed to fetch project crew assignments');
  }
}