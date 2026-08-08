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
    paymentBalance: number;
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
    payments: PaymentView[];
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
    paymentStatus?: EscrowStatus;
    paymentId?: string;
}

export interface PaymentView {
    id: string;
    milestoneId: string;
    milestoneTitle: string;
    amount: number;
    status: EscrowStatus;
    releasedAt?: string;
}

// ---- Contracts ----

export type ContractStatus = 'pending_signatures' | 'signed' | 'active' | 'completed' | 'disputed';

export interface ContractListItem {
    id: string;
    rfqId: string;
    projectTitle: string;
    installerName: string;
    totalAmount: number;
    status: ContractStatus;
    createdAt: string;
    signedAt?: string;
}

export interface ContractView extends ContractListItem {
    projectId: string;
    installerId: string;
    termsUrl?: string; // Optional link to physical PDF
    signatures: {
        ownerSigned: boolean;
        ownerSignedAt?: string;
        installerSigned: boolean;
        installerSignedAt?: string;
    };
    milestones: MilestoneView[];
}

// ---- Lifecycle State Machine ----

export type LifecycleState =
    | 'RFQ_CREATED'
    | 'RFQ_PUBLISHED'
    | 'BIDS_RECEIVED'
    | 'BID_ACCEPTED'
    | 'CONTRACT_GENERATED'
    | 'CONTRACT_SIGNED'
    | 'FUNDING_COMPLETED'
    | 'PROJECT_ACTIVATED'
    | 'MILESTONES_EXECUTING'
    | 'PAYMENTS_RELEASING'
    | 'PROJECT_COMPLETED'
    | 'REVIEW_SUBMITTED'
    | 'DISPUTED';

// ---- Escrow / Funding Views ----

export type EscrowMilestoneStatus = 'funded' | 'released' | 'held' | 'pending';

export interface EscrowMilestoneItem {
    id: string;
    title: string;
    amount: number;
    percentage: number;
    status: EscrowMilestoneStatus;
    date?: string;
}

export interface EscrowAccountView {
    id: string;
    project: string;
    contractId: string;
    totalAmount: number;
    funded: number;
    released: number;
    held: number;
    commission: number;
    finalBuffer: number;
    milestones: EscrowMilestoneItem[];
}

export interface FundingSetupView {
    contractId: string;
    projectTitle: string;
    totalAmount: number;
    paymentMethod?: 'bank_transfer' | 'card' | 'ussd';
    virtualAccountNumber?: string;
    virtualAccountBank?: string;
    virtualAccountName?: string;
    status: 'pending' | 'processing' | 'confirmed' | 'failed';
    expiresAt?: string;
}

// ---- Dispute Views ----

export type DisputeStatus = 'open' | 'in_mediation' | 'resolved' | 'refunded';

export interface DisputeEvent {
    date: string;
    actor: string;
    action: string;
    note?: string;
}

export interface DisputeListItem {
    id: string;
    project: string;
    projectId: string;
    installer: string;
    amount: number;
    reason: string;
    status: DisputeStatus;
    openedDate: string;
    evidenceCount: number;
    timeline: DisputeEvent[];
}

// ---- Review / Completion Views ----

export interface ReviewSubmission {
    projectId: string;
    installerId: string;
    installerName: string;
    projectTitle: string;
    rating: number;
    comment: string;
    tags: string[];
}

export interface ReviewView {
    id: string;
    installer: string;
    project: string;
    avatar: string;
    rating: number;
    date: string;
    review: string;
    tags: string[];
    status: 'submitted' | 'pending';
}

export interface PendingReview {
    id: string;
    projectId: string;
    installer: string;
    project: string;
    avatar: string;
}

export interface CompletionView {
    projectId: string;
    projectTitle: string;
    completedAt: string;
    totalAmount: number;
    milestonesCompleted: number;
    installerName: string;
    rating?: number;
    reviewSubmitted: boolean;
}

// ---- Messaging (Lifecycle-Gated) ----

export type ThreadStatus = 'active' | 'pending' | 'closed';

export interface MessagingThread {
    id: string;
    projectId: string;
    projectTitle: string;
    counterparty: string;
    counterpartyRole: 'installer' | 'epc' | 'admin';
    avatar: string;
    lastMessage: string;
    lastTimestamp: string;
    unreadCount: number;
    status: ThreadStatus;
}

export interface MessagingMessage {
    id: string;
    threadId: string;
    sender: 'owner' | 'counterparty' | 'system';
    text: string;
    timestamp: string;
    status: 'sending' | 'sent' | 'delivered' | 'read';
    attachments?: { name: string; size: string; url?: string }[];
}

// ---- Funding (Virtual Account) ----

export type FundingStatus = 'awaiting_setup' | 'account_generated' | 'payment_pending' | 'payment_processing' | 'funded' | 'failed';

export interface VirtualAccountDetails {
    accountNumber: string;
    accountName: string;
    bankName: string;
    expiresAt: string;
    reference: string;
}

export interface FundingOverview {
    projectId: string;
    projectTitle: string;
    contractId: string;
    totalAmount: number;
    amountFunded: number;
    status: FundingStatus;
    virtualAccount?: VirtualAccountDetails;
    paymentMethod?: 'bank_transfer' | 'card' | 'ussd';
    fundedAt?: string;
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
    'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo', 'Jigawa',
    'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
    'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun',
    'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
] as const;

export type NigeriaState = typeof NIGERIA_STATES[number];
