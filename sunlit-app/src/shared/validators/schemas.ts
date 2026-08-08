import { z } from 'zod';
export * from './sanitize';

// =====================================
// AUTH / KYC
// =====================================

export const RegisterUserSchema = z.object({
  email: z.string().email(),
  first_name: z.string().min(2).max(100).optional(),
  last_name: z.string().min(2).max(100).optional(),
  phone_number: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
  role: z.enum(['project_owner', 'installer', 'crew_member', 'epc_contractor']),
});

/**
 * H6 fix: At least one KYC field must be provided.
 * Requirements.md §8: NIN, BVN, CAC verification required.
 */
export const KycVerifySchema = z.object({
  bvn: z.string().length(11).optional(),
  nin: z.string().length(11).optional(),
  cac: z.string().min(5).optional(),
  document_type: z.enum(['drivers_license', 'utility_bill', 'proof_of_address']).optional(),
  document_url: z.string().url().optional(),
}).refine(
  (data) => data.bvn || data.nin || data.cac,
  { message: 'At least one verification field (bvn, nin, or cac) is required.' }
);

// =====================================
// PROJECTS & RFQ
// =====================================

export const CreateProjectSchema = z.object({
  title: z.string().min(5).max(255),
  description: z.string().min(10).optional(),
  location_state: z.string().min(2),
  location_city: z.string().min(2),
  system_size_kw: z.number().positive().optional(),
});

/**
 * External Project Creation Schema (EPC Contractors)
 * 
 * Enhanced schema for EPC contractors creating external projects.
 * Extends base project schema with EPC-specific fields.
 * 
 * Feature: EPC Dashboard Enterprise System
 * Task: 6.2 Implement external project validation
 * Requirements: 4.2, 14.2
 */
export const CreateExternalProjectSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(255, 'Title too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000, 'Description too long').optional(),
  location_state: z.string().min(2, 'State is required'),
  location_city: z.string().min(2, 'City is required'),
  system_size_kw: z.number().positive('System size must be positive').optional(),
  funding_source: z.enum(['client', 'epc_funded']).optional(),
  custom_milestone_schedule: z.record(z.string(), z.unknown()).optional(),
  specifications: z.record(z.string(), z.unknown()).optional(),
});

/**
 * Nigerian states whitelist for location validation.
 * Requirement: Nigeria-only enforcement (PO Dashboard §STEP 4).
 */
const NIGERIA_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
  'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
] as const;

/**
 * Step 3A: Appliance item schema for Residential Appliance-Based flow.
 * Default template: AC(3), Pumping machine(1), Fans(4), TVs(4), Bulbs(10)
 */
export const ApplianceItemSchema = z.object({
  name: z.string().min(1).max(100),
  quantity: z.number().int().min(1).max(500),
  wattage: z.number().positive().optional(),
});

/**
 * Step 3B: System component schema for System Configuration flow.
 * Captures inverter, battery, solar panel specs per spec.
 */
export const SystemComponentSchema = z.object({
  type: z.enum(['inverter', 'battery', 'solar_panel', 'charge_controller', 'other']),
  brand: z.string().min(1).max(100).optional(),
  size: z.string().max(50).optional(),       // e.g. '15KVA', '30KWh'
  wattage: z.number().positive().optional(),  // e.g. 620
  quantity: z.number().int().min(1).optional(),
});

/**
 * Enhanced RFQ Creation Schema — Full Multi-Step Wizard
 *
 * Maps directly to Leapter MCP `create_rfq` tool input schema:
 *   - projectType: Residential | Commercial  (Step 1)
 *   - configMode: System | Appliance          (Step 2)
 *   - appliances / components                 (Step 3A / 3B)
 *   - location, budget, timeline              (Step 4)
 *
 * Validation enforces:
 *   - Nigeria-only location
 *   - Appliance mode requires appliances array
 *   - System mode requires components array
 *   - Budget is required and must be positive
 */
export const CreateRfqSchema = z.object({
  projectType: z.enum(['Residential', 'Commercial']),
  configMode: z.enum(['System', 'Appliance']),
  location: z.string().min(2).max(200).optional(),
  location_state: z.enum(NIGERIA_STATES).optional(),
  budget: z.number().positive({ message: 'Budget must be a positive number.' }),
  timeline: z.string().max(200).optional(),
  appliances: z.array(ApplianceItemSchema).optional(),
  components: z.array(SystemComponentSchema).optional(),
}).refine(
  (data) => {
    // Appliance mode requires at least one appliance
    if (data.configMode === 'Appliance') {
      return data.appliances && data.appliances.length > 0;
    }
    return true;
  },
  { message: 'Appliance-based projects must include at least one appliance.', path: ['appliances'] }
).refine(
  (data) => {
    // System mode requires at least one component
    if (data.configMode === 'System') {
      return data.components && data.components.length > 0;
    }
    return true;
  },
  { message: 'System configuration projects must include at least one component.', path: ['components'] }
);

// =====================================
// BIDS
// =====================================

export const SubmitBidSchema = z.object({
  rfq_id: z.string(),
  amount: z.number().positive(),
  proposed_timeline_days: z.number().int().positive().optional(),
  proposal_text: z.string().min(10),
});

/**
 * Enhanced Bid Schema for EPC Contractors
 * 
 * Extends base bid schema with enterprise-level project management details.
 * EPC contractors can submit enhanced bids with:
 * - Project management plan
 * - Crew coordination strategy
 * - Risk mitigation approach
 * - Quality assurance plan
 * 
 * Feature: EPC Dashboard Enterprise System
 * Task: 7.1 Extend bid submission service for EPC bids
 * Requirements: 3.2, 3.3
 * 
 * Backward Compatibility: Standard installers can still use SubmitBidSchema
 */
export const SubmitEnhancedBidSchema = SubmitBidSchema.extend({
  // EPC-specific enhanced fields (all optional for backward compatibility)
  project_management_plan: z.string().min(50, 'Project management plan must be at least 50 characters').max(5000, 'Plan too long').optional(),
  crew_coordination_strategy: z.string().min(50, 'Crew coordination strategy must be at least 50 characters').max(3000, 'Strategy too long').optional(),
  risk_mitigation_approach: z.string().min(30, 'Risk mitigation approach must be at least 30 characters').max(2000, 'Approach too long').optional(),
  quality_assurance_plan: z.string().min(30, 'Quality assurance plan must be at least 30 characters').max(2000, 'Plan too long').optional(),
  estimated_crew_size: z.number().int().positive('Crew size must be positive').optional(),
  subcontractor_details: z.string().max(1000, 'Subcontractor details too long').optional(),
  equipment_list: z.array(z.string().min(1).max(200)).optional(),
  certifications: z.array(z.string().min(1).max(200)).optional(),
  previous_similar_projects: z.number().int().min(0, 'Cannot be negative').optional(),
});

// =====================================
// PAYMENT CONTROL
// =====================================

export const InitializePaymentSchema = z.object({
  amount: z.number().positive(),
  milestone_id: z.string().uuid(),
  project_id: z.string().uuid(),
});

export const ReleasePaymentSchema = z.object({
  escrow_id: z.string().uuid(),
  project_id: z.string().uuid(),
  milestone_id: z.string().uuid(),
});

export const DisputeSchema = z.object({
  project_id: z.string().uuid(),
  escrow_id: z.string().uuid(),
  reason: z.string().min(20).max(1000),
});

// =====================================
// CONTRACTS
// =====================================

export const CreateContractSchema = z.object({
  project_id: z.string().uuid(),
  rfq_id: z.string().uuid(),
  bid_id: z.string().uuid(),
  installer_id: z.string().uuid(),
  total_amount: z.number().positive(),
});

export const SignContractSchema = z.object({
  contract_id: z.string().uuid(),
});

// =====================================
// REVIEWS
// =====================================

export const SubmitReviewSchema = z.object({
  project_id: z.string().uuid(),
  reviewee_id: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(5).max(2000).optional(),
});

// =====================================
// CREWLINK
// =====================================

export const CreateCrewJobSchema = z.object({
  project_id: z.string().uuid(),
  title: z.string().min(5).max(255),
  description: z.string().min(10).max(5000).optional(),
  location_state: z.string().min(2).optional(),
  required_skills: z.array(z.string().min(1).max(100)).optional(),
  pay_rate: z.number().positive().optional(),
});

export const ApplyCrewJobSchema = z.object({
  job_id: z.string().uuid(),
  cover_note: z.string().min(10).max(2000).optional(),
});

export const AssignCrewSchema = z.object({
  application_id: z.string().uuid(),
});

// EPC CrewLink Schemas
export const CreateEPCCrewJobSchema = z.object({
  project_id: z.string().uuid(),
  title: z.string().min(5).max(255),
  description: z.string().min(10).max(5000).optional(),
  location_state: z.string().min(2).max(100).optional(),
  location_city: z.string().min(2).max(100).optional(),
  required_skills: z.array(z.string().min(1).max(100)).max(20).optional(),
  pay_rate: z.number().positive().optional(),
  pay_type: z.enum(['hourly', 'daily', 'fixed']).optional(),
  estimated_duration_days: z.number().int().positive().max(365).optional(),
  
  // EPC-specific fields
  project_assignment: z.string().uuid().optional(),
  milestone_integration: z.record(z.string(), z.object({
    crew_size: z.number().int().positive().max(50),
    skills: z.array(z.string().min(1).max(100)).max(10),
    estimated_hours: z.number().positive().max(1000).optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    dependencies: z.array(z.string().uuid()).max(10).optional(),
  })).optional(),
  crew_coordination_config: z.object({
    max_concurrent_crews: z.number().int().positive().max(20),
    coordination_method: z.enum(['daily_standup', 'weekly_sync', 'milestone_based', 'as_needed']),
    communication_channel: z.enum(['whatsapp', 'slack', 'teams', 'phone', 'email']),
    shift_schedule: z.object({
      start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/), // HH:MM format
      end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),   // HH:MM format
      break_duration_minutes: z.number().int().min(0).max(480).optional(), // Max 8 hours
    }).optional(),
    safety_requirements: z.array(z.string().min(1).max(200)).max(20).optional(),
    equipment_provided: z.array(z.string().min(1).max(200)).max(50).optional(),
    reporting_frequency: z.enum(['daily', 'weekly', 'milestone', 'as_needed']),
  }).optional(),
});

export const PublishEPCCrewJobSchema = z.object({
  job_id: z.string().uuid(),
});

export const AssignCrewToProjectSchema = z.object({
  job_id: z.string().uuid(),
  crew_member_id: z.string().uuid(),
  project_id: z.string().uuid(),
  agreed_rate: z.number().positive(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  milestone_assignments: z.array(z.object({
    milestone_id: z.string().uuid(),
    milestone_name: z.string().min(1).max(255),
    estimated_hours: z.number().positive().max(1000),
    required_skills: z.array(z.string().min(1).max(100)).max(10),
    priority: z.enum(['low', 'medium', 'high']),
    dependencies: z.array(z.string().uuid()).max(10).optional(),
  })).max(20).optional(),
});

export const ValidateCrewAssignmentSchema = z.object({
  job_id: z.string().uuid(),
  crew_member_id: z.string().uuid(),
  project_id: z.string().uuid(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
});

/**
 * Performance Rating Schema
 * 
 * Schema for submitting performance ratings for crew assignments.
 * 
 * Feature: EPC Dashboard Enterprise System
 * Task: 10.4 Implement crew performance tracking
 * Requirements: 6.5, 8.4
 */
export const PerformanceRatingSchema = z.object({
  quality_rating: z.number().int().min(1, 'Quality rating must be at least 1').max(5, 'Quality rating must be at most 5'),
  timeliness_rating: z.number().int().min(1, 'Timeliness rating must be at least 1').max(5, 'Timeliness rating must be at most 5'),
  communication_rating: z.number().int().min(1, 'Communication rating must be at least 1').max(5, 'Communication rating must be at most 5'),
  completion_notes: z.string().max(1000, 'Completion notes must be at most 1000 characters').optional(),
});

/**
 * Crew Work Completion Schema
 * 
 * Schema for recording crew work completion on milestones.
 */
export const CrewWorkCompletionSchema = z.object({
  assignment_id: z.string().uuid(),
  milestone_id: z.string().uuid(),
  hours_worked: z.number().positive().max(1000),
  quality_score: z.number().int().min(1).max(5).optional(),
  timeliness_score: z.number().int().min(1).max(5).optional(),
  completion_notes: z.string().max(1000).optional(),
});

// =====================================
// MILESTONES
// =====================================

export const ApproveMilestoneSchema = z.object({
  project_id: z.string().uuid(),
});

// =====================================
// CHAT / MESSAGES
// =====================================

export const SendMessageSchema = z.object({
  project_id: z.string().uuid(),
  content: z.string().min(1).max(5000),
  attachment_url: z.string().url().optional(),
});

// =====================================
// EPC EXTERNAL PROJECT FUNDING
// =====================================

/**
 * Milestone Funding Schema
 * 
 * Defines funding allocation for individual project milestones.
 * Used within FundExternalProjectSchema.
 * 
 * Feature: EPC Dashboard Enterprise System
 * Task: 11.1 Implement EPC external project funding service
 * Requirements: 7.1, 7.2, 10.1, 10.2
 */
export const MilestoneFundingSchema = z.object({
  milestone_id: z.string().uuid('Invalid milestone ID format'),
  amount: z.number().positive('Milestone amount must be positive'),
  scheduled_date: z.string().datetime().optional(),
});

/**
 * Commission Agreement Schema
 * 
 * Defines commission structure for EPC-funded projects.
 * Supports both percentage-based and fixed commission models.
 * 
 * Feature: EPC Dashboard Enterprise System
 * Task: 11.1 Implement EPC external project funding service
 * Requirements: 7.1, 10.1
 */
export const CommissionAgreementSchema = z.object({
  commission_rate: z.number().min(0, 'Commission rate cannot be negative').max(100, 'Commission rate cannot exceed 100%'),
  commission_type: z.enum(['percentage', 'fixed'], {
    message: 'Commission type must be either "percentage" or "fixed"',
  }),
  payment_terms: z.string().min(5, 'Payment terms must be at least 5 characters').max(500, 'Payment terms too long'),
});

/**
 * Fund External Project Schema
 * 
 * Main schema for EPC contractors funding their external projects.
 * Validates all funding parameters including milestone schedule and commission agreement.
 * 
 * Validation Rules:
 * - funding_amount must equal sum of milestone amounts
 * - At least one milestone must be defined
 * - All milestone IDs must be valid UUIDs
 * - Commission agreement must be complete
 * 
 * Feature: EPC Dashboard Enterprise System
 * Task: 11.1 Implement EPC external project funding service
 * Requirements: 7.1, 7.2, 10.1, 10.2
 */
export const FundExternalProjectSchema = z.object({
  epc_contractor_id: z.string().uuid('Invalid EPC contractor ID format'),
  project_id: z.string().uuid('Invalid project ID format'),
  funding_amount: z.number().positive('Funding amount must be positive'),
  milestone_schedule: z.array(MilestoneFundingSchema)
    .min(1, 'At least one milestone must be defined')
    .max(50, 'Cannot exceed 50 milestones'),
  commission_agreement: CommissionAgreementSchema,
}).refine(
  (data) => {
    // Validate that funding_amount equals sum of milestone amounts
    const milestoneSum = data.milestone_schedule.reduce((sum, m) => sum + m.amount, 0);
    const tolerance = 0.01; // Allow 1 cent tolerance for floating point precision
    return Math.abs(milestoneSum - data.funding_amount) < tolerance;
  },
  {
    message: 'Funding amount must equal the sum of all milestone amounts',
    path: ['funding_amount'],
  }
);

/**
 * Get EPC Funding Status Schema
 * 
 * Schema for querying EPC funding status for a project.
 * 
 * Feature: EPC Dashboard Enterprise System
 * Task: 11.1 Implement EPC external project funding service
 * Requirements: 7.3
 */
export const GetEPCFundingStatusSchema = z.object({
  project_id: z.string().uuid('Invalid project ID format'),
});


