/**
 * Database TypeScript Types
 * 
 * M1 fix: Complete type coverage matching 001_initial_schema.sql.
 * Every table in the database has a corresponding interface here.
 */

export type UserRole =
    | 'project_owner'
    | 'installer'
    | 'crew_member'
    | 'epc_contractor'
    | 'admin';

export type ProjectStatus = 'draft' | 'bidding' | 'in_progress' | 'completed' | 'cancelled';
export type RfqStatus = 'open' | 'matched' | 'closed' | 'expired';
export type BidStatus = 'submitted' | 'accepted' | 'rejected' | 'withdrawn';
export type EscrowStatus = 'pending' | 'funded' | 'held' | 'released' | 'disputed' | 'refunded';
export type PaymentStatus = 'pending' | 'successful' | 'failed' | 'refunded';
export type KycStatus = 'pending' | 'verified' | 'rejected' | 'needs_review';
export type SubscriptionTier = 'free' | 'pro' | 'premium';

export interface User {
    id: string;
    clerk_id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    created_at: string;
    updated_at: string;
}

export interface Role {
    id: string;
    user_id: string;
    role_name: UserRole;
    enhanced_permissions?: Record<string, boolean>;
    created_at: string;
}

export interface KycRecord {
    id: string;
    user_id: string;
    status: KycStatus;
    provider_reference?: string;
    verified_at?: string;
    created_at: string;
    updated_at: string;
}

export interface Project {
    id: string;
    owner_id: string;
    title: string;
    description?: string;
    location_state?: string;
    location_city?: string;
    status: ProjectStatus;
    system_size_kw?: number;
    installer_id?: string;
    
    // EPC Enhancement: External project support
    project_source?: 'marketplace' | 'external';
    creator_id?: string;
    approval_authority?: 'project_owner' | 'epc_contractor';
    custom_milestone_schedule?: Record<string, unknown>;
    funding_source?: 'client' | 'epc_funded';
    
    created_at: string;
    updated_at: string;
}

export interface Rfq {
    id: string;
    project_id: string;
    status: RfqStatus;
    budget_range_min?: number;
    budget_range_max?: number;
    timeline_days?: number;
    created_at: string;
    updated_at: string;
}

export interface Bid {
    id: string;
    rfq_id: string;
    installer_id: string;
    amount: number;
    proposed_timeline_days?: number;
    proposal_text?: string;
    status: BidStatus;
    created_at: string;
    updated_at: string;
}

export interface Milestone {
    id: string;
    project_id: string;
    title: string;
    amount: number;
    position: number;
    is_completed: boolean;
    is_approved: boolean;
    created_at: string;
    updated_at: string;
}

export interface Escrow {
    id: string;
    project_id: string;
    milestone_id: string;
    amount: number;
    status: EscrowStatus;
    released_at?: string;
    created_at: string;
    updated_at: string;
}

export interface Payment {
    id: string;
    user_id: string;
    escrow_id?: string;
    amount: number;
    currency: string;
    provider: string;
    provider_reference: string;
    status: PaymentStatus;
    created_at: string;
    updated_at: string;
}

export interface Dispute {
    id: string;
    project_id: string;
    escrow_id: string;
    raised_by: string;
    reason: string;
    is_resolved: boolean;
    resolved_at?: string;
    created_at: string;
    updated_at: string;
}

export interface AuditLog {
    id: string;
    user_id?: string;
    action_type: string;
    correlation_id?: string;
    payload_hash?: string;
    ip_address?: string;
    created_at: string;
}

export interface EventLog {
    id: string;
    event_type: string;
    payload: Record<string, unknown>;
    emitted_by?: string;
    created_at: string;
}

export interface Subscription {
    id: string;
    user_id: string;
    tier: SubscriptionTier;
    is_active: boolean;
    expires_at?: string;
    created_at: string;
    updated_at: string;
}

// =============================================
// Contract (DMS §5 — Links accepted bid to project)
// =============================================
export type ContractStatus = 'created' | 'signed' | 'active' | 'completed' | 'cancelled';

export interface Contract {
    id: string;
    project_id: string;
    rfq_id: string;
    bid_id: string;
    owner_id: string;
    installer_id: string;
    total_amount: number;
    status: ContractStatus;
    signed_at?: string;
    created_at: string;
    updated_at: string;
}

// =============================================
// Reviews / Ratings (DMS §5)
// =============================================
export interface Review {
    id: string;
    project_id: string;
    reviewer_id: string;
    reviewee_id: string;
    rating: number;         // 1-5
    comment?: string;
    created_at: string;
    updated_at: string;
}

// =============================================
// CrewLink (DMS §5 — Labor marketplace)
// =============================================
export type CrewJobStatus = 'draft' | 'published' | 'assigned' | 'in_progress' | 'completed' | 'closed';
export type CrewApplicationStatus = 'pending' | 'reviewed' | 'accepted' | 'rejected' | 'withdrawn';
export type CrewWorkStatus = 'assigned' | 'active' | 'completed' | 'cancelled';
export type PayType = 'hourly' | 'daily' | 'fixed';

export interface CrewJob {
    id: string;
    project_id: string;
    posted_by: string;          // installer_id or epc_contractor_id
    title: string;
    description?: string;
    location_state?: string;
    location_city?: string;
    required_skills?: string[];
    pay_rate?: number;
    pay_type?: PayType;
    estimated_duration_days?: number;
    status: CrewJobStatus;
    
    // EPC Enhancement: Project assignment and milestone integration
    project_assignment?: string; // For EPC external projects
    milestone_integration?: Record<string, unknown>; // Milestone-specific assignments
    crew_coordination_config?: Record<string, unknown>; // Multi-crew coordination settings
    
    created_at: string;
    updated_at: string;
}

export interface CrewApplication {
    id: string;
    job_id: string;
    applicant_id: string;       // crew_member user
    cover_note?: string;
    proposed_rate?: number;     // Counter-offer rate
    availability_start?: string;
    availability_end?: string;
    status: CrewApplicationStatus;
    reviewed_at?: string;
    reviewed_by?: string;
    created_at: string;
    updated_at: string;
}

export interface CrewAssignment {
    id: string;
    job_id: string;
    crew_member_id: string;
    project_id: string;
    assigned_by: string;
    
    // Assignment details
    agreed_rate: number;
    start_date?: string;
    end_date?: string;
    
    // Work tracking
    hours_logged?: number;
    work_status: CrewWorkStatus;
    completion_notes?: string;
    
    // Performance tracking
    quality_rating?: number;    // 1-5 scale
    timeliness_rating?: number; // 1-5 scale
    communication_rating?: number; // 1-5 scale
    
    created_at: string;
    updated_at: string;
    completed_at?: string;
}

// =============================================
// Messages / Chat (DMS §5)
// =============================================
export interface Message {
    id: string;
    project_id: string;
    sender_id: string;
    content: string;
    attachment_url?: string;
    created_at: string;
}

// =============================================
// Marketplace Feed Item (DMS §5 — computed view)
// =============================================
export interface MarketplaceItem {
    id: string;
    type: 'rfq' | 'crew_job';
    title: string;
    location_state?: string;
    budget?: number;
    status: string;
    posted_by: string;
    created_at: string;
}

// =============================================
// Dispute Extended Status (ESS §6)
// =============================================
export type DisputeStatus = 'open' | 'escalated' | 'resolved' | 'closed';

// =============================================
// EPC Project Funding (EPC Dashboard Enterprise System)
// =============================================
export type EPCEscrowStatus = 'pending' | 'locked' | 'released' | 'disputed';

export interface MilestoneFunding {
    milestone_id: string;
    amount: number;
    percentage?: number;
    scheduled_date?: string;
    status?: 'pending' | 'funded' | 'released';
}

export interface CommissionAgreement {
    commission_rate: number; // percentage
    commission_type: 'percentage' | 'fixed';
    payment_terms: string;
    platform_commission?: number;
    crew_commission?: number;
}

export interface EPCProjectFunding {
    id: string;
    project_id: string;
    epc_contractor_id: string;
    funding_amount: number;
    escrow_status: EPCEscrowStatus;
    milestone_schedule: MilestoneFunding[];
    commission_agreement: CommissionAgreement;
    created_at: string;
    updated_at: string;
}

// =============================================
// Crew Project Assignments (Multi-Crew Coordination)
// =============================================
export type CrewAssignmentStatus = 'assigned' | 'active' | 'completed' | 'cancelled';

export interface CrewProjectAssignment {
    id: string;
    project_id: string;
    crew_id: string;
    milestone_assignments: Record<string, unknown>;
    assignment_status: CrewAssignmentStatus;
    performance_metrics: Record<string, unknown>;
    created_at: string;
    updated_at: string;
}

