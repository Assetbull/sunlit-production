import { sanitizePayload } from '@/shared/validators/sanitize';
import type {
    DashboardSummary, RfqListItem, BidComparisonItem,
    ProjectView,
} from '../types/dashboard';
import type { CreateRfqFormValues } from '../validators/rfq-form';
import type { BidStatus, RfqStatus } from '@/shared/types/database';

/**
 * Project Owner API Service Layer
 *
 * All dashboard data flows through here. UI must not call fetch() directly.
 *
 * const USE_REAL_API = process.env.NEXT_PUBLIC_USE_REAL === "true"
 * — real mode hits /api/v1/*; mock mode uses in-memory fixtures with simulated latency.
 */

const API_BASE = '/api/v1';
export const USE_REAL_API = process.env.NEXT_PUBLIC_USE_REAL === 'true';

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    correlation_id?: string;
}

const delay = (ms?: number) =>
    new Promise<void>((resolve) =>
        setTimeout(resolve, ms ?? Math.floor(Math.random() * 500) + 300)
    );

function generateCorrelationId() {
    return `corr_${Math.random().toString(36).substring(2, 15)}`;
}

async function apiCall<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    try {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        const text = await res.text();
        let json: Record<string, unknown> = {};
        try {
            json = text ? (JSON.parse(text) as Record<string, unknown>) : {};
        } catch {
            return {
                success: false,
                error: `Server returned non-JSON response: ${text.substring(0, 100)}`,
            };
        }

        if (!res.ok) {
            return {
                success: false,
                error: (json.error as string) || `Request failed with status ${res.status}`,
                correlation_id: json.correlation_id as string | undefined,
            };
        }

        const data = (json.data !== undefined ? json.data : json) as T;

        return {
            success: json.success !== false,
            data,
            message: json.message as string | undefined,
            correlation_id: json.correlation_id as string | undefined,
        };
    } catch (err) {
        return {
            success: false,
            error: err instanceof Error ? err.message : 'Network error',
        };
    }
}

function mapRfqRow(row: Record<string, unknown>): RfqListItem {
    const budget = Number(row.budget ?? row.budget_range_max ?? 0) || 1;
    const title =
        (row.project_title as string) ||
        `${row.project_type || 'Residential'} Solar — ${row.location || 'Project'}`;
    return {
        id: String(row.id),
        projectTitle: title,
        projectId: String(row.project_id ?? row.id),
        status: (row.status as RfqStatus) || 'open',
        budgetMin: row.budget_range_min != null ? Number(row.budget_range_min) : Math.round(budget * 0.85),
        budgetMax: row.budget_range_max != null ? Number(row.budget_range_max) : budget,
        timelineDays:
            row.timeline_days != null
                ? Number(row.timeline_days)
                : parseInt(String(row.timeline || '30').replace(/\D/g, ''), 10) || 30,
        bidsCount: Number(row.bids_count ?? 0),
        locationState: String(row.location_state || 'Lagos'),
        locationCity: String(row.location || row.location_city || 'Lagos').split(',')[0].trim(),
        systemSizeKw: row.system_size_kw != null ? Number(row.system_size_kw) : 5,
        createdAt: String(row.created_at || new Date().toISOString()),
    };
}

function mapBidRow(row: Record<string, unknown>): BidComparisonItem {
    return {
        id: String(row.id),
        installerId: String(row.installer_id ?? 'unknown'),
        installerName: String(
            row.installer_name ?? `Installer ${String(row.installer_id ?? '').slice(0, 8)}`
        ),
        installerRating: row.installer_rating != null ? Number(row.installer_rating) : 4.5,
        sunlitScore: row.sunlit_score != null ? Number(row.sunlit_score) : 85,
        amount: Number(row.amount),
        proposedTimelineDays:
            row.proposed_timeline_days != null ? Number(row.proposed_timeline_days) : 30,
        proposalText: String(row.proposal_text ?? ''),
        status: (row.status as BidStatus) || 'submitted',
        createdAt: String(row.created_at || new Date().toISOString()),
    };
}

// ---- Dashboard ----

export async function fetchDashboardSummary(): Promise<ApiResponse<DashboardSummary>> {
    if (USE_REAL_API) {
        const res = await apiCall<DashboardSummary | Record<string, unknown>>('/dashboard/summary');
        if (!res.success) return res as ApiResponse<DashboardSummary>;
        const d = res.data as Record<string, unknown>;
        if (d && typeof d.totalProjects === 'number') {
            return {
                success: true,
                data: d as unknown as DashboardSummary,
                correlation_id: res.correlation_id,
            };
        }
        return { success: false, error: 'Invalid dashboard summary payload' };
    }

    await delay();
    return {
        success: true,
        correlation_id: generateCorrelationId(),
        data: {
            totalProjects: 8,
            activeRfqs: 3,
            pendingBids: 12,
            escrowBalance: 4_500_000,
            completedProjects: 4,
            disputedProjects: 1,
        },
    };
}

// ---- RFQs ----

export async function fetchRfqs(): Promise<ApiResponse<RfqListItem[]>> {
    if (USE_REAL_API) {
        const res = await apiCall<Record<string, unknown>>('/rfq');
        if (!res.success) return { success: false, error: res.error };
        const envelope = res.data as Record<string, unknown>;
        const rows = (envelope.rfqs ?? envelope.data) as unknown;
        if (!Array.isArray(rows)) {
            return { success: false, error: 'Invalid RFQ list response' };
        }
        return {
            success: true,
            data: (rows as Record<string, unknown>[]).map(mapRfqRow),
            correlation_id: envelope.correlation_id as string | undefined,
        };
    }

    await delay();
    return {
        success: true,
        correlation_id: generateCorrelationId(),
        data: [
            {
                id: 'rfq-001',
                projectTitle: '5kW Residential Solar Installation',
                projectId: 'proj-001',
                status: 'open',
                budgetMin: 2_000_000,
                budgetMax: 3_500_000,
                timelineDays: 30,
                bidsCount: 4,
                locationState: 'Lagos',
                locationCity: 'Lekki',
                systemSizeKw: 5,
                createdAt: '2026-04-10T09:00:00Z',
            },
            {
                id: 'rfq-002',
                projectTitle: '10kW Commercial Office Solar',
                projectId: 'proj-002',
                status: 'matched',
                budgetMin: 5_000_000,
                budgetMax: 8_000_000,
                timelineDays: 45,
                bidsCount: 7,
                locationState: 'FCT',
                locationCity: 'Garki',
                systemSizeKw: 10,
                createdAt: '2026-04-08T14:00:00Z',
            },
            {
                id: 'rfq-003',
                projectTitle: '3kW Home Backup System',
                projectId: 'proj-003',
                status: 'closed',
                budgetMin: 1_200_000,
                budgetMax: 1_800_000,
                timelineDays: 21,
                bidsCount: 3,
                locationState: 'Rivers',
                locationCity: 'Port Harcourt',
                systemSizeKw: 3,
                createdAt: '2026-03-25T10:00:00Z',
            },
        ],
    };
}

export async function createRfq(data: CreateRfqFormValues): Promise<ApiResponse<{ rfqId: string }>> {
    const sanitized = sanitizePayload(data);

    const body = {
        projectType: sanitized.projectType || 'Residential',
        configMode: 'Appliance' as const,
        location: sanitized.locationCity,
        location_state: sanitized.locationState,
        budget: Number(sanitized.budgetRangeMax),
        timeline: `${sanitized.timelineDays} days`,
        appliances: sanitized.appliances
            ? sanitized.appliances.map(
                  (a: string | { name: string; quantity: number; wattage?: number }) =>
                      typeof a === 'string'
                          ? { name: a, quantity: 1, wattage: 200 }
                          : a
              )
            : [
                  {
                      name: 'General Load',
                      quantity: 1,
                      wattage: Number(sanitized.systemSizeKw || 5) * 1000,
                  },
              ],
    };

    if (!USE_REAL_API) {
        await delay();
        return {
            success: true,
            correlation_id: generateCorrelationId(),
            data: { rfqId: `rfq-mock-${Date.now()}` },
        };
    }

    const res = await apiCall<Record<string, unknown>>('/rfq', {
        method: 'POST',
        body: JSON.stringify(body),
    });

    if (!res.success) {
        return { success: false, error: res.error, correlation_id: res.correlation_id };
    }

    const d = res.data as Record<string, unknown>;
    const id = d?.rfq_id ?? d?.rfqId ?? d?.id;
    return {
        success: true,
        correlation_id: res.correlation_id,
        data: { rfqId: String(id ?? 'unknown') },
    };
}

// ---- Bids ----

export async function fetchBidsForRfq(rfqId: string): Promise<ApiResponse<BidComparisonItem[]>> {
    if (USE_REAL_API) {
        const res = await apiCall<Record<string, unknown>>(`/rfq/${encodeURIComponent(rfqId)}/bids`);
        if (!res.success) return { success: false, error: res.error };
        const envelope = res.data as Record<string, unknown>;
        const rows = envelope.bids as unknown;
        if (!Array.isArray(rows)) {
            return { success: false, error: 'Invalid bids response' };
        }
        return {
            success: true,
            data: (rows as Record<string, unknown>[]).map(mapBidRow),
            correlation_id: envelope.correlation_id as string | undefined,
        };
    }

    await delay();
    return {
        success: true,
        correlation_id: generateCorrelationId(),
        data: [
            {
                id: 'bid-001',
                installerId: 'inst-001',
                installerName: 'SolarPro Nigeria Ltd',
                installerRating: 4.8,
                sunlitScore: 94,
                amount: 2_800_000,
                proposedTimelineDays: 25,
                proposalText:
                    'Full turnkey installation with Tier-1 panels (Canadian Solar), 5kVA Deye inverter, and 10kWh lithium battery bank. Includes 2 years maintenance warranty.',
                status: 'submitted',
                createdAt: '2026-04-11T08:00:00Z',
            },
            {
                id: 'bid-002',
                installerId: 'inst-002',
                installerName: 'GreenWatt Solutions',
                installerRating: 4.5,
                sunlitScore: 88,
                amount: 3_100_000,
                proposedTimelineDays: 21,
                proposalText:
                    'Premium installation with JA Solar panels, Growatt inverter, and 15kWh battery storage. Fast-track delivery with dedicated project manager.',
                status: 'submitted',
                createdAt: '2026-04-11T11:00:00Z',
            },
            {
                id: 'bid-003',
                installerId: 'inst-003',
                installerName: 'Raysun Energy',
                installerRating: 4.2,
                sunlitScore: 79,
                amount: 2_400_000,
                proposedTimelineDays: 35,
                proposalText:
                    'Budget-friendly option with quality LONGi panels and Felicity inverter. 1 year warranty included.',
                status: 'submitted',
                createdAt: '2026-04-12T09:00:00Z',
            },
        ],
    };
}

export async function acceptBid(rfqId: string, bidId: string): Promise<ApiResponse<void>> {
    if (!USE_REAL_API) {
        await delay();
        return { success: true, correlation_id: generateCorrelationId() };
    }
    return apiCall<void>(`/rfq/${encodeURIComponent(rfqId)}/bids`, {
        method: 'POST',
        body: JSON.stringify({ bid_id: bidId }),
    });
}

// ---- Projects ----

export async function fetchProject(projectId: string): Promise<ApiResponse<ProjectView>> {
    if (USE_REAL_API) {
        const res = await apiCall<Record<string, unknown>>(
            `/projects/${encodeURIComponent(projectId)}`
        );
        if (!res.success) {
            return {
                success: false,
                error: res.error,
                correlation_id: res.correlation_id,
            };
        }
        const envelope = res.data as Record<string, unknown>;
        const project = (envelope.project ?? envelope.data) as ProjectView | undefined;
        if (project && typeof project === 'object' && 'id' in project) {
            return {
                success: true,
                data: project,
                correlation_id: res.correlation_id,
            };
        }
        return { success: false, error: 'Invalid project response' };
    }

    await delay();
    return {
        success: true,
        correlation_id: generateCorrelationId(),
        data: {
            id: projectId,
            title: '5kW Residential Solar Installation',
            description: 'Complete solar power system for a 4-bedroom duplex in Lekki Phase 1',
            status: 'in_progress',
            locationState: 'Lagos',
            locationCity: 'Lekki',
            systemSizeKw: 5,
            installerName: 'SolarPro Nigeria Ltd',
            totalBudget: 2_800_000,
            totalPaid: 1_400_000,
            progressPercent: 50,
            createdAt: '2026-04-01T09:00:00Z',
            milestones: [
                {
                    id: 'ms-001',
                    title: 'Deposit & Procurement',
                    amount: 1_400_000,
                    position: 1,
                    isCompleted: true,
                    isApproved: true,
                    escrowStatus: 'released',
                    escrowId: 'esc-001',
                },
                {
                    id: 'ms-002',
                    title: 'Installation & Wiring',
                    amount: 840_000,
                    position: 2,
                    isCompleted: false,
                    isApproved: false,
                    escrowStatus: 'funded',
                    escrowId: 'esc-002',
                },
                {
                    id: 'ms-003',
                    title: 'Testing & Commissioning',
                    amount: 280_000,
                    position: 3,
                    isCompleted: false,
                    isApproved: false,
                    escrowStatus: 'pending',
                },
                {
                    id: 'ms-004',
                    title: 'Final Handover',
                    amount: 280_000,
                    position: 4,
                    isCompleted: false,
                    isApproved: false,
                    escrowStatus: 'pending',
                },
            ],
            escrows: [
                {
                    id: 'esc-001',
                    milestoneId: 'ms-001',
                    milestoneTitle: 'Deposit & Procurement',
                    amount: 1_400_000,
                    status: 'released',
                    releasedAt: '2026-04-05T14:00:00Z',
                },
                {
                    id: 'esc-002',
                    milestoneId: 'ms-002',
                    milestoneTitle: 'Installation & Wiring',
                    amount: 840_000,
                    status: 'funded',
                },
            ],
        },
    };
}

// ---- Payments ----

export interface PaymentInitResult {
    paymentUrl: string;
    authorizationUrl?: string;
    escrowId?: string | null;
}

export async function initializePayment(
    milestoneId: string,
    projectId: string,
    amount: number
): Promise<ApiResponse<PaymentInitResult>> {
    const sanitized = sanitizePayload({ milestone_id: milestoneId, project_id: projectId, amount });

    if (!USE_REAL_API) {
        await delay();
        const mockUrl = 'https://checkout.paystack.com/#mock-authorization';
        return {
            success: true,
            correlation_id: generateCorrelationId(),
            data: {
                paymentUrl: mockUrl,
                authorizationUrl: mockUrl,
                escrowId: 'esc-mock-001',
            },
        };
    }

    const res = await apiCall<Record<string, unknown>>('/payments/initialize', {
        method: 'POST',
        body: JSON.stringify(sanitized),
    });

    if (!res.success) {
        return { success: false, error: res.error, correlation_id: res.correlation_id };
    }

    const d = res.data as Record<string, unknown>;
    const authUrl = String(d.authorization_url || d.paymentUrl || '');
    return {
        success: true,
        correlation_id: res.correlation_id,
        data: {
            paymentUrl: authUrl,
            authorizationUrl: authUrl,
            escrowId: (d.escrow_id as string) ?? null,
        },
    };
}

// ---- Escrow ----

export async function releaseEscrow(
    escrowId: string,
    projectId: string,
    milestoneId: string
): Promise<ApiResponse<void>> {
    const sanitized = sanitizePayload({ escrow_id: escrowId, project_id: projectId, milestone_id: milestoneId });

    if (!USE_REAL_API) {
        await delay();
        return { success: true, correlation_id: generateCorrelationId() };
    }

    return apiCall<void>('/escrow/release', {
        method: 'POST',
        body: JSON.stringify(sanitized),
    });
}

// ---- Disputes ----

export async function createDispute(
    projectId: string,
    escrowId: string,
    reason: string
): Promise<ApiResponse<{ caseId: string }>> {
    const sanitized = sanitizePayload({ project_id: projectId, escrow_id: escrowId, reason });

    if (!USE_REAL_API) {
        await delay();
        return {
            success: true,
            correlation_id: generateCorrelationId(),
            data: { caseId: `DISP-MOCK-${Date.now()}` },
        };
    }

    const res = await apiCall<Record<string, unknown>>('/disputes', {
        method: 'POST',
        body: JSON.stringify(sanitized),
    });

    if (!res.success) {
        return { success: false, error: res.error, correlation_id: res.correlation_id };
    }

    const d = res.data as Record<string, unknown>;
    const caseId = String(d.case_id ?? d.caseId ?? d.id ?? 'unknown');
    return { success: true, data: { caseId }, correlation_id: res.correlation_id };
}

// ---- Messaging ----

export interface Message {
    id: string;
    sender: string;
    senderId: string;
    text: string;
    timestamp: string;
    isFromMe: boolean;
}

export async function fetchMessages(projectId: string): Promise<ApiResponse<Message[]>> {
    if (USE_REAL_API) {
        const res = await apiCall<Record<string, unknown>>(
            `/projects/${encodeURIComponent(projectId)}/messages`
        );
        if (!res.success) return { success: false, error: res.error };
        const envelope = res.data as Record<string, unknown>;
        const list = envelope.messages ?? envelope.data;
        if (!Array.isArray(list)) {
            return { success: false, error: 'Invalid messages response' };
        }
        return {
            success: true,
            data: list as Message[],
            correlation_id: res.correlation_id,
        };
    }

    await delay();
    return {
        success: true,
        correlation_id: generateCorrelationId(),
        data: [
            {
                id: 'm-1',
                sender: 'SolarPro Support',
                senderId: 'inst-001',
                text: 'Welcome to your project workspace! We will update you here as we progress.',
                timestamp: '2026-04-15T10:00:00Z',
                isFromMe: false,
            },
            {
                id: 'm-2',
                sender: 'You',
                senderId: 'user-001',
                text: 'Thank you. When do we expect the procurement to finish?',
                timestamp: '2026-04-15T10:05:00Z',
                isFromMe: true,
            },
            {
                id: 'm-3',
                sender: 'SolarPro Support',
                senderId: 'inst-001',
                text: 'Procurement is 90% complete. We should start installation on Monday.',
                timestamp: '2026-04-15T10:10:00Z',
                isFromMe: false,
            },
        ],
    };
}

export async function sendMessage(projectId: string, text: string): Promise<ApiResponse<Message>> {
    const sanitized = sanitizePayload({ text });
    if (USE_REAL_API) {
        const res = await apiCall<Record<string, unknown>>(
            `/projects/${encodeURIComponent(projectId)}/messages`,
            {
                method: 'POST',
                body: JSON.stringify(sanitized),
            }
        );
        if (!res.success) return { success: false, error: res.error };
        const envelope = res.data as Record<string, unknown>;
        const msg = (envelope.message ?? envelope.data) as Message | undefined;
        if (msg && msg.id) {
            return { success: true, data: msg, correlation_id: res.correlation_id };
        }
        return { success: false, error: 'Invalid message response' };
    }

    await delay();
    return {
        success: true,
        correlation_id: generateCorrelationId(),
        data: {
            id: `m-${Date.now()}`,
            sender: 'You',
            senderId: 'user-001',
            text: String(sanitized.text),
            timestamp: new Date().toISOString(),
            isFromMe: true,
        },
    };
}

// ---- Audit Logs ----

export interface AuditLogItem {
    id: string;
    actionType: string;
    details: string;
    timestamp: string;
    correlationId: string;
}

export async function fetchAuditLogs(projectId: string): Promise<ApiResponse<AuditLogItem[]>> {
    if (USE_REAL_API) {
        const res = await apiCall<Record<string, unknown>>(
            `/projects/${encodeURIComponent(projectId)}/audit-logs`
        );
        if (!res.success) return { success: false, error: res.error };
        const envelope = res.data as Record<string, unknown>;
        const logs = envelope.logs ?? envelope.audit_logs ?? envelope.data;
        if (!Array.isArray(logs)) {
            return { success: false, error: 'Invalid audit log response' };
        }
        return {
            success: true,
            data: logs as AuditLogItem[],
            correlation_id: res.correlation_id,
        };
    }

    await delay();
    return {
        success: true,
        correlation_id: generateCorrelationId(),
        data: [
            {
                id: 'log-1',
                actionType: 'CONTRACT_SIGNED',
                details: 'Project Owner signed the contract securely.',
                timestamp: '2026-04-01T09:00:00Z',
                correlationId: 'corr_xyz123',
            },
            {
                id: 'log-2',
                actionType: 'ESCROW_FUNDED',
                details: 'Milestone 1 funded: ₦1,400,000.',
                timestamp: '2026-04-01T10:00:00Z',
                correlationId: 'corr_abc456',
            },
            {
                id: 'log-3',
                actionType: 'MILESTONE_COMPLETED',
                details: 'Installer marked Milestone 1 as complete.',
                timestamp: '2026-04-05T08:00:00Z',
                correlationId: 'corr_def789',
            },
            {
                id: 'log-4',
                actionType: 'ESCROW_RELEASED',
                details: 'Project Owner released funds for Milestone 1.',
                timestamp: '2026-04-05T14:00:00Z',
                correlationId: 'corr_ghi012',
            },
        ],
    };
}

// ---- KYC (Nigeria: BVN / NIN) ----

export type KycUiStatus = 'pending' | 'verified' | 'failed' | 'needs_review';

export interface KycStatusPayload {
    status: KycUiStatus;
    canFundEscrow: boolean;
}

export async function submitKycVerification(payload: {
    bvn?: string;
    nin?: string;
}): Promise<ApiResponse<{ status: KycUiStatus }>> {
    const body = sanitizePayload(payload);

    if (!USE_REAL_API) {
        await delay();
        return {
            success: true,
            correlation_id: generateCorrelationId(),
            data: { status: 'verified' },
        };
    }

    const res = await apiCall<Record<string, unknown>>('/kyc/verify', {
        method: 'POST',
        body: JSON.stringify(body),
    });
    if (!res.success) {
        return { success: false, error: res.error, correlation_id: res.correlation_id };
    }
    const d = res.data as Record<string, unknown>;
    const status = (d?.status as KycUiStatus) || 'pending';
    return { success: true, data: { status }, correlation_id: res.correlation_id };
}

export async function fetchKycStatus(): Promise<ApiResponse<KycStatusPayload>> {
    if (USE_REAL_API) {
        const res = await apiCall<KycStatusPayload>('/kyc/status');
        if (!res.success || !res.data) {
            return {
                success: true,
                data: { status: 'pending', canFundEscrow: false },
            };
        }
        const verified = res.data.status === 'verified';
        return {
            success: true,
            data: {
                status: res.data.status,
                canFundEscrow: res.data.canFundEscrow ?? verified,
            },
            correlation_id: res.correlation_id,
        };
    }

    await delay();
    return {
        success: true,
        correlation_id: generateCorrelationId(),
        data: { status: 'pending', canFundEscrow: false },
    };
}
