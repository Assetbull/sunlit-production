/**
 * Dashboard-specific types for the Project Owner view.
 * These are UI/view-model types derived from database types.
 */
import type {
    Project, Rfq, Bid, Milestone, Escrow,
    ProjectStatus, RfqStatus, BidStatus, EscrowStatus,
} from '@/shared/types/database';

// ---- Dashboard Summary ----

export interface DashboardSummary {
    totalProjects: number;
    activeRfqs: number;
    pendingBids: number;
    escrowBalance: number;
    completedProjects: number;
    disputedProjects: number;
}

// ---- RFQ Views ----

export interface RfqListItem {
    id: string;
    projectTitle: string;
    projectId: string;
    status: RfqStatus;
    budgetMin?: number;
    budgetMax?: number;
    timelineDays?: number;
    bidsCount: number;
    locationState: string;
    locationCity: string;
    systemSizeKw?: number;
    createdAt: string;
}

export interface CreateRfqFormData {
    projectTitle: string;
    description?: string;
    locationState: string;
    locationCity: string;
    systemSizeKw: number;
    budgetRangeMin: number;
    budgetRangeMax: number;
    timelineDays: number;
}

// ---- Bid Views ----

export interface BidComparisonItem {
    id: string;
    installerId: string;
    installerName: string;
    installerRating?: number;
    sunlitScore?: number;
    amount: number;
    proposedTimelineDays?: number;
    proposalText: string;
    status: BidStatus;
    createdAt: string;
}

// ---- Project Views ----

export interface ProjectView {
    id: string;
    title: string;
    description?: string;
    status: ProjectStatus;
    locationState: string;
    locationCity: string;
    systemSizeKw?: number;
    installerName?: string;
    milestones: MilestoneView[];
    escrows: EscrowView[];
    totalBudget: number;
    totalPaid: number;
    progressPercent: number;
    createdAt: string;
}

export interface MilestoneView {
    id: string;
    title: string;
    amount: number;
    position: number;
    isCompleted: boolean;
    isApproved: boolean;
    escrowStatus?: EscrowStatus;
    escrowId?: string;
}

export interface EscrowView {
    id: string;
    milestoneId: string;
    milestoneTitle: string;
    amount: number;
    status: EscrowStatus;
    releasedAt?: string;
}

// ---- Form States ----

export type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export interface FormState<T = unknown> {
    status: FormStatus;
    data?: T;
    error?: string;
    correlationId?: string;
}

// ---- Nigeria Location Data ----

export const NIGERIA_STATES = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
    'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo',
    'Ekiti', 'Enugu', 'FCT Abuja', 'Gombe', 'Imo', 'Jigawa',
    'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
    'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun',
    'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
] as const;

export type NigeriaState = typeof NIGERIA_STATES[number];
