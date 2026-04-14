/**
 * Database TypeScript Types
 * 
 * M1 fix: Complete type coverage matching 001_initial_schema.sql.
 * Every table in the database has a corresponding interface here.
 */

export type UserRole =
    | 'project_owner'
    | 'installer'
    | 'crewlink'
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
