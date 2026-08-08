/**
 * EPC CrewLink Service
 * 
 * Service for EPC contractors to post jobs with project assignment and milestone integration.
 * Extends existing CrewLink functionality with multi-crew coordination capabilities.
 * 
 * Feature: EPC Dashboard Enterprise System
 * Task: 10.1 Extend CrewLink job posting for project assignment
 * Requirements: 6.1, 6.2
 * 
 * Architecture: Extends existing CrewLink system without duplication
 * Security: RBAC enforced, RLS policies applied
 * Audit: All operations logged with correlation IDs
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { DataService } from '@/shared/api/data-service';
import { EventBus } from '@/core/event-bus/emitter';
import type { CrewJob, CrewJobStatus, PayType } from '@/shared/types/database';

/**
 * EPC crew job creation data
 */
export interface EPCCrewJobData {
  project_id: string;
  title: string;
  description?: string;
  location_state?: string;
  location_city?: string;
  required_skills?: string[];
  pay_rate?: number;
  pay_type?: PayType;
  estimated_duration_days?: number;
  
  // EPC-specific fields
  project_assignment?: string; // External project ID for assignment
  milestone_integration?: MilestoneIntegration;
  crew_coordination_config?: CrewCoordinationConfig;
}

/**
 * Milestone integration configuration
 */
export interface MilestoneIntegration {
  [milestoneId: string]: {
    crew_size: number;
    skills: string[];
    estimated_hours?: number;
    priority?: 'low' | 'medium' | 'high';
    dependencies?: string[]; // Other milestone IDs this depends on
  };
}

/**
 * Crew coordination configuration
 */
export interface CrewCoordinationConfig {
  max_concurrent_crews: number;
  coordination_method: 'daily_standup' | 'weekly_sync' | 'milestone_based' | 'as_needed';
  communication_channel: 'whatsapp' | 'slack' | 'teams' | 'phone' | 'email';
  shift_schedule?: {
    start_time: string; // HH:MM format
    end_time: string;   // HH:MM format
    break_duration_minutes?: number;
  };
  safety_requirements?: string[];
  equipment_provided?: string[];
  reporting_frequency: 'daily' | 'weekly' | 'milestone' | 'as_needed';
}

/**
 * EPC crew job creation result
 */
export interface EPCCrewJobResult {
  job_id: string;
  title: string;
  status: CrewJobStatus;
  project_assignment?: string;
  has_milestone_integration: boolean;
  has_coordination_config: boolean;
  created_at: string;
}

/**
 * Service context for EPC CrewLink operations
 */
export interface EPCCrewLinkServiceContext {
  supabase: SupabaseClient;
  dataService: DataService;
  eventBus: EventBus;
  userId: string;
  correlationId: string;
  ipAddress?: string;
}

/**
 * Create an EPC crew job with project assignment and milestone integration
 * 
 * This function:
 * 1. Validates EPC contractor permissions
 * 2. Creates crew job with EPC-specific configurations
 * 3. Links job to external project if specified
 * 4. Sets up milestone integration and crew coordination
 * 5. Emits crew_job_created event
 * 6. Logs action to audit trail
 * 
 * @param context - Service context with database and event bus
 * @param jobData - EPC crew job data
 * @returns Created job details
 * @throws Error if validation fails or database operation fails
 */
export async function createEPCCrewJob(
  context: EPCCrewLinkServiceContext,
  jobData: EPCCrewJobData
): Promise<EPCCrewJobResult> {
  const { dataService, eventBus, userId, correlationId, ipAddress } = context;

  // Validate required fields
  if (!jobData.title || jobData.title.length < 5) {
    throw new Error('Job title must be at least 5 characters');
  }

  if (!jobData.project_id) {
    throw new Error('Project ID is required');
  }

  // Validate pay rate if provided
  if (jobData.pay_rate !== undefined && jobData.pay_rate <= 0) {
    throw new Error('Pay rate must be positive');
  }

  // Validate crew coordination config
  if (jobData.crew_coordination_config) {
    const config = jobData.crew_coordination_config;
    if (config.max_concurrent_crews <= 0) {
      throw new Error('Maximum concurrent crews must be positive');
    }
  }

  // Build audit context
  const auditContext = {
    user_id: userId,
    correlation_id: correlationId,
    ip_address: ipAddress,
  };

  try {
    // Verify project exists and user has access
    const project = await dataService.findOne('projects', {
      id: jobData.project_id,
    });

    if (!project) {
      throw new Error('Project not found');
    }

    // For external projects, verify EPC contractor is the creator
    if (project.project_source === 'external' && project.creator_id !== userId) {
      throw new Error('Access denied: Only the EPC contractor who created this external project can post jobs for it');
    }

    // For marketplace projects, verify user is the owner or installer
    if (project.project_source !== 'external' && 
        project.owner_id !== userId && 
        project.installer_id !== userId) {
      throw new Error('Access denied: Only project owner or assigned installer can post jobs');
    }

    // Create crew job record
    const crewJob = await dataService.create(
      'crew_jobs',
      {
        project_id: jobData.project_id,
        posted_by: userId,
        title: jobData.title,
        description: jobData.description || null,
        location_state: jobData.location_state || project.location_state,
        location_city: jobData.location_city || project.location_city,
        required_skills: jobData.required_skills || [],
        pay_rate: jobData.pay_rate || null,
        pay_type: jobData.pay_type || 'hourly',
        estimated_duration_days: jobData.estimated_duration_days || null,
        status: 'draft',
        
        // EPC enhancements
        project_assignment: jobData.project_assignment || null,
        milestone_integration: jobData.milestone_integration || {},
        crew_coordination_config: jobData.crew_coordination_config || {},
        
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      auditContext
    );

    // Emit crew_job_created event for integration
    await eventBus.emit('crew_job_created', {
      timestamp: new Date().toISOString(),
      actor_id: userId,
      correlation_id: correlationId,
      job_id: crewJob.id,
      project_id: jobData.project_id,
      title: crewJob.title,
      is_epc_job: !!jobData.project_assignment,
      has_milestone_integration: Object.keys(jobData.milestone_integration || {}).length > 0,
      has_coordination_config: Object.keys(jobData.crew_coordination_config || {}).length > 0,
      posted_by: userId,
    });

    // Return created job details
    return {
      job_id: crewJob.id,
      title: crewJob.title,
      status: 'draft',
      project_assignment: jobData.project_assignment,
      has_milestone_integration: Object.keys(jobData.milestone_integration || {}).length > 0,
      has_coordination_config: Object.keys(jobData.crew_coordination_config || {}).length > 0,
      created_at: crewJob.created_at,
    };
  } catch (error) {
    console.error('Error creating EPC crew job:', error);
    
    // Re-throw with more context
    if (error instanceof Error) {
      throw new Error(`Failed to create EPC crew job: ${error.message}`);
    }
    
    throw new Error('Failed to create EPC crew job: Unknown error');
  }
}

/**
 * Get EPC crew jobs for a contractor
 * 
 * @param context - Service context
 * @param filters - Optional filters
 * @returns List of EPC crew jobs
 */
export async function getEPCCrewJobs(
  context: EPCCrewLinkServiceContext,
  filters?: {
    project_id?: string;
    status?: CrewJobStatus;
    project_assignment?: string;
  }
): Promise<CrewJob[]> {
  const { dataService, userId } = context;

  try {
    const queryFilters: any = {
      posted_by: userId,
    };

    if (filters?.project_id) {
      queryFilters.project_id = filters.project_id;
    }

    if (filters?.status) {
      queryFilters.status = filters.status;
    }

    if (filters?.project_assignment) {
      queryFilters.project_assignment = filters.project_assignment;
    }

    const jobs = await dataService.findMany('crew_jobs', queryFilters);

    return jobs.map((job: any) => ({
      id: job.id,
      project_id: job.project_id,
      posted_by: job.posted_by,
      title: job.title,
      description: job.description,
      location_state: job.location_state,
      location_city: job.location_city,
      required_skills: job.required_skills,
      pay_rate: job.pay_rate,
      pay_type: job.pay_type,
      estimated_duration_days: job.estimated_duration_days,
      status: job.status,
      project_assignment: job.project_assignment,
      milestone_integration: job.milestone_integration,
      crew_coordination_config: job.crew_coordination_config,
      created_at: job.created_at,
      updated_at: job.updated_at,
    }));
  } catch (error) {
    console.error('Error fetching EPC crew jobs:', error);
    throw new Error('Failed to fetch EPC crew jobs');
  }
}

/**
 * Publish an EPC crew job (make it visible to crew members)
 * 
 * @param context - Service context
 * @param jobId - Job ID to publish
 * @returns Updated job status
 */
export async function publishEPCCrewJob(
  context: EPCCrewLinkServiceContext,
  jobId: string
): Promise<{ job_id: string; status: CrewJobStatus }> {
  const { dataService, eventBus, userId, correlationId, ipAddress } = context;

  try {
    // Verify job exists and user owns it
    const job = await dataService.findOne('crew_jobs', {
      id: jobId,
      posted_by: userId,
    });

    if (!job) {
      throw new Error('Job not found or access denied');
    }

    if (job.status !== 'draft') {
      throw new Error(`Cannot publish job with status: ${job.status}`);
    }

    // Update job status to published
    const auditContext = {
      user_id: userId,
      correlation_id: correlationId,
      ip_address: ipAddress,
    };

    await dataService.update('crew_jobs', { id: jobId }, {
      status: 'published',
      updated_at: new Date().toISOString(),
    }, auditContext);

    // Emit job published event
    await eventBus.emit('crew_job_published', {
      timestamp: new Date().toISOString(),
      actor_id: userId,
      correlation_id: correlationId,
      job_id: jobId,
      project_id: job.project_id,
      title: job.title,
      is_epc_job: !!job.project_assignment,
    });

    return {
      job_id: jobId,
      status: 'published',
    };
  } catch (error) {
    console.error('Error publishing EPC crew job:', error);
    
    if (error instanceof Error) {
      throw new Error(`Failed to publish EPC crew job: ${error.message}`);
    }
    
    throw new Error('Failed to publish EPC crew job: Unknown error');
  }
}

/**
 * Get crew job by ID with EPC enhancements
 * 
 * @param context - Service context
 * @param jobId - Job ID
 * @returns Crew job details
 */
export async function getEPCCrewJobById(
  context: EPCCrewLinkServiceContext,
  jobId: string
): Promise<CrewJob> {
  const { dataService, userId } = context;

  try {
    const job = await dataService.findOne('crew_jobs', {
      id: jobId,
      posted_by: userId,
    });

    if (!job) {
      throw new Error('Job not found or access denied');
    }

    return {
      id: job.id,
      project_id: job.project_id,
      posted_by: job.posted_by,
      title: job.title,
      description: job.description,
      location_state: job.location_state,
      location_city: job.location_city,
      required_skills: job.required_skills,
      pay_rate: job.pay_rate,
      pay_type: job.pay_type,
      estimated_duration_days: job.estimated_duration_days,
      status: job.status,
      project_assignment: job.project_assignment,
      milestone_integration: job.milestone_integration,
      crew_coordination_config: job.crew_coordination_config,
      created_at: job.created_at,
      updated_at: job.updated_at,
    };
  } catch (error) {
    console.error('Error fetching EPC crew job:', error);
    throw new Error('Failed to fetch EPC crew job');
  }
}