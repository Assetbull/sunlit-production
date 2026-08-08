import { sanitizePayload } from '@/shared/validators/sanitize';
import type {
    DashboardSummary, ContractListItem,
    ContractView,
    RfqListItem, BidComparisonItem,
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
            paymentBalance: 4_500_000,
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

    const staticRfqs: RfqListItem[] = [
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
    ];

    let dynamicRfqs: RfqListItem[] = [];
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('mock_rfqs');
        if (stored) {
            const parsed = JSON.parse(stored);
            dynamicRfqs = parsed.map((item: any) => ({
                id: item.id,
                projectTitle: item.title || 'Dynamic RFQ',
                projectId: item.id,
                status: item.status || 'open',
                budgetMin: 1000000,
                budgetMax: 5000000,
                timelineDays: 30,
                bidsCount: 0,
                locationState: 'Lagos',
                locationCity: 'Lekki',
                systemSizeKw: 5,
                createdAt: item.created_at,
            }));
        }
    }

    return {
        success: true,
        correlation_id: generateCorrelationId(),
        data: [...dynamicRfqs, ...staticRfqs],
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
        const id = `rfq_${Date.now()}`;
        const newRfq = {
            id,
            status: "open",
            created_at: new Date().toISOString()
        };
        
        if (typeof window !== 'undefined') {
          const existing = JSON.parse(localStorage.getItem('mock_rfqs') || '[]');
          localStorage.setItem('mock_rfqs', JSON.stringify([...existing, newRfq]));
          window.dispatchEvent(new CustomEvent('rfq_created', { detail: newRfq }));
        }

        return {
            success: true,
            correlation_id: generateCorrelationId(),
            data: { rfqId: id },
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

/**
 * acceptBid — Bid Acceptance Lifecycle Entry Point
 *
 * ARCHITECTURE LAW (governance/architecture_lock.md §4):
 *   Bidding owns bids only. Contract owns contracts only.
 *
 * GEMINI.md §5 — Correct event chain enforcement:
 *   bid_accepted (bid layer) → contract_created (contract layer) → contract_signed
 *
 * REAL API PATH:
 *   Step 1: Fetch bid record → extract installer_id, amount
 *   Step 2: POST /api/v1/contracts with full payload
 *           → enforces state machine: BID_ACCEPTED → CONTRACT_CREATED
 *           → emits bid_accepted + contract_created events
 *           → returns contract_id for escrow routing
 *
 * MOCK PATH:
 *   Simulates acceptance + emits browser CustomEvents for local dev.
 */
export async function acceptBid(
    rfqId: string,
    bidId: string,
    overrides?: { projectId?: string; installerId?: string; totalAmount?: number }
): Promise<ApiResponse<{ contractId?: string; rfqId: string; bidId: string }>> {

    if (!USE_REAL_API) {
        // Mock mode — fire browser events for local dev reactivity
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('bid_accepted', { detail: { rfqId, bidId } }));
            setTimeout(() => {
                window.dispatchEvent(
                    new CustomEvent('contract_created', {
                        detail: { contract_id: `contract-${bidId}`, rfq_id: rfqId, bid_id: bidId },
                    })
                );
            }, 800);
        }
        return {
            success: true,
            correlation_id: generateCorrelationId(),
            data: { contractId: `contract-${bidId}`, rfqId, bidId },
        };
    }

    // ── REAL API: Step 1 — Fetch bid to extract installer_id and amount ──────
    let installerId = overrides?.installerId;
    let totalAmount = overrides?.totalAmount;
    let projectId = overrides?.projectId ?? rfqId; // rfq_id is the project scope until project service wires up

    if (!installerId || !totalAmount) {
        const bidsRes = await apiCall<Record<string, unknown>>(`/rfq/${encodeURIComponent(rfqId)}/bids`);
        if (bidsRes.success && bidsRes.data) {
            const envelope = bidsRes.data as Record<string, unknown>;
            const rows = (envelope.bids ?? []) as Record<string, unknown>[];
            const match = rows.find((b) => String(b.id) === bidId);
            if (match) {
                installerId = installerId ?? String(match.installer_id ?? '');
                totalAmount = totalAmount ?? Number(match.amount ?? 0);
            }
        }
    }

    // ── REAL API: Step 2 — POST /api/v1/contracts (proper lifecycle route) ──
    // This route:
    //   1. Enforces StateMachineEngine: BID_ACCEPTED → CONTRACT_CREATED
    //   2. Creates contract record
    //   3. Updates bid status to 'accepted', rfq status to 'matched'
    //   4. Emits 'bid_accepted' + 'contract_created' events
    //   5. Logs audit trail
    const res = await apiCall<Record<string, unknown>>('/contracts', {
        method: 'POST',
        body: JSON.stringify({
            project_id: projectId,
            rfq_id: rfqId,
            bid_id: bidId,
            installer_id: installerId ?? '',
            total_amount: totalAmount ?? 0,
        }),
    });

    if (!res.success) {
        return { success: false, error: res.error, correlation_id: res.correlation_id };
    }

    const d = res.data as Record<string, unknown>;
    return {
        success: true,
        correlation_id: res.correlation_id,
        data: {
            contractId: String(d?.contract_id ?? ''),
            rfqId,
            bidId,
        },
    };
}


/**
 * rejectBid — Bid Rejection Lifecycle Entry Point
 *
 * ARCHITECTURE LAW: Bidding domain owns bid lifecycle only.
 *
 * FLOW:
 *   REAL API: PATCH /api/v1/bids/[id] with reason + optional note
 *             → enforces state machine: BID_SUBMITTED → BID_REJECTED
 *             → emits bid_rejected event
 *             → logs audit trail
 *
 *   MOCK:     Simulates rejection + fires browser CustomEvent for local dev.
 */
export async function rejectBid(
    bidId: string,
    reason: string,
    note?: string
): Promise<ApiResponse<{ bidId: string }>> {
    if (!USE_REAL_API) {
        await delay(400);
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('bid_rejected', { detail: { bidId, reason } }));
        }
        return {
            success: true,
            correlation_id: generateCorrelationId(),
            data: { bidId },
        };
    }

    const res = await apiCall<Record<string, unknown>>(`/bids/${encodeURIComponent(bidId)}`, {
        method: 'PATCH',
        body: JSON.stringify({ reason, note: note || undefined }),
    });

    if (!res.success) {
        return { success: false, error: res.error, correlation_id: res.correlation_id };
    }

    return {
        success: true,
        correlation_id: res.correlation_id,
        data: { bidId },
    };
}

// ---- Contracts ----

export async function fetchContracts(): Promise<ApiResponse<ContractListItem[]>> {
    if (USE_REAL_API) {
        return apiCall<ContractListItem[]>('/contracts');
    }
    await delay();
    return {
        success: true,
        correlation_id: generateCorrelationId(),
        data: [
            {
                id: 'con-1234',
                rfqId: 'rfq-5678',
                projectTitle: '5kW Residential Solar Installation',
                installerName: 'Lumos Energy',
                totalAmount: 2800000,
                status: 'pending_signatures',
                createdAt: '2026-04-10T10:00:00Z',
            },
            {
                id: 'con-9101',
                rfqId: 'rfq-1121',
                projectTitle: '10kW Commercial Array',
                installerName: 'SunPower NG',
                totalAmount: 5500000,
                status: 'active',
                createdAt: '2026-03-15T09:00:00Z',
                signedAt: '2026-03-18T14:30:00Z',
            }
        ]
    };
}

export async function fetchContract(contractId: string): Promise<ApiResponse<ContractView>> {
    if (USE_REAL_API) {
        return apiCall<ContractView>(`/contracts/${encodeURIComponent(contractId)}`);
    }
    await delay();
    return {
        success: true,
        correlation_id: generateCorrelationId(),
        data: {
            id: contractId,
            rfqId: 'rfq-mock',
            projectId: 'proj-mock',
            installerId: 'inst-mock',
            projectTitle: '5kW Residential Solar Installation',
            installerName: 'Lumos Energy',
            totalAmount: 2800000,
            status: 'pending_signatures',
            createdAt: '2026-04-10T10:00:00Z',
            signatures: {
                ownerSigned: true,
                ownerSignedAt: '2026-04-11T12:00:00Z',
                installerSigned: false,
            },
            milestones: [
                 {
                    id: 'ms-001',
                    title: 'System Design & Procurement',
                    amount: 1400000,
                    position: 1,
                    isCompleted: false,
                    isApproved: false,
                    paymentStatus: 'pending'
                 },
                 {
                    id: 'ms-002',
                    title: 'Installation & Commissioning',
                    amount: 1400000,
                    position: 2,
                    isCompleted: false,
                    isApproved: false,
                    paymentStatus: 'pending'
                 }
            ]
        }
    };
}

export async function signContract(contractId: string, payload: { signatureData: string, signedName: string }): Promise<ApiResponse<ContractView>> {
    if (USE_REAL_API) {
        return apiCall<ContractView>(`/contracts/${contractId}/sign`, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    }

    await delay();
    return {
        success: true,
        correlation_id: generateCorrelationId(),
        data: {
            id: contractId,
            rfqId: 'RFQ-002',
            projectId: 'PROJ-002',
            projectTitle: 'Residential Solar & Battery System',
            installerId: 'INST-444',
            installerName: 'Lumina Energy Solutions',
            totalAmount: 18500000,
            status: 'pending_signatures',
            createdAt: '2026-04-10T09:00:00Z',
            signatures: {
                ownerSigned: true,
                ownerSignedAt: new Date().toISOString(),
                installerSigned: false,
            },
            milestones: []
        }
    };
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
                    paymentStatus: 'released',
                    paymentId: 'esc-001',
                },
                {
                    id: 'ms-002',
                    title: 'Installation & Wiring',
                    amount: 840_000,
                    position: 2,
                    isCompleted: false,
                    isApproved: false,
                    paymentStatus: 'funded',
                    paymentId: 'esc-002',
                },
                {
                    id: 'ms-003',
                    title: 'Testing & Commissioning',
                    amount: 280_000,
                    position: 3,
                    isCompleted: false,
                    isApproved: false,
                    paymentStatus: 'pending',
                },
                {
                    id: 'ms-004',
                    title: 'Final Handover',
                    amount: 280_000,
                    position: 4,
                    isCompleted: false,
                    isApproved: false,
                    paymentStatus: 'pending',
                },
            ],
            payments: [
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
    paymentId?: string | null;
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
                paymentId: 'esc-mock-001',
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
            paymentId: (d.escrow_id as string) ?? null,
        },
    };
}

// ---- Payment Control ----

export async function releasePayment(
    paymentId: string,
    projectId: string,
    milestoneId: string
): Promise<ApiResponse<void>> {
    const sanitized = sanitizePayload({ escrow_id: paymentId, project_id: projectId, milestone_id: milestoneId });

    if (!USE_REAL_API) {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('payment_released', { detail: { paymentId, milestoneId } }));
        }
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
    paymentId: string,
    reason: string
): Promise<ApiResponse<{ caseId: string }>> {
    const sanitized = sanitizePayload({ project_id: projectId, escrow_id: paymentId, reason });

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
                actionType: 'PAYMENT_FUNDED',
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
                actionType: 'PAYMENT_RELEASED',
                details: 'Project Owner released funds for Milestone 1.',
                timestamp: '2026-04-05T14:00:00Z',
                correlationId: 'corr_ghi012',
            },
        ],
    };
}

// ---- Reviews ----

export async function submitReview(projectId: string, rating: number, comment: string, tags?: string[]): Promise<ApiResponse<void>> {
    if (!USE_REAL_API) {
        await delay();
        return {
            success: true,
            correlation_id: generateCorrelationId(),
        };
    }

    return apiCall<void>(`/projects/${encodeURIComponent(projectId)}/reviews`, {
        method: 'POST',
        body: JSON.stringify({ rating, comment, tags }),
    });
}

export async function fetchPendingReviews(): Promise<ApiResponse<{ id: string; projectId: string; installer: string; project: string; avatar: string }[]>> {
    if (!USE_REAL_API) {
        await delay();
        return {
            success: true,
            correlation_id: generateCorrelationId(),
            data: [
                { id: 'pr1', projectId: 'proj-001', installer: 'SunPower Installations Ltd.', project: 'Lekki Residential Solar', avatar: 'SI' },
            ],
        };
    }
    const res = await apiCall<Record<string, unknown>>('/reviews/pending');
    if (!res.success) return { success: false, error: res.error };
    const d = res.data as Record<string, unknown>;
    const rows = (d.reviews ?? d.data) as unknown;
    return { success: true, data: Array.isArray(rows) ? rows as any[] : [], correlation_id: res.correlation_id };
}

export async function fetchSubmittedReviews(): Promise<ApiResponse<{ id: string; installer: string; project: string; avatar: string; rating: number; date: string; review: string; tags: string[]; status: string }[]>> {
    if (!USE_REAL_API) {
        await delay();
        return {
            success: true,
            correlation_id: generateCorrelationId(),
            data: [
                {
                    id: 'r1',
                    installer: 'SunPower Installations Ltd.',
                    project: 'Victoria Island Commercial',
                    avatar: 'SI',
                    rating: 5,
                    date: 'Mar 30, 2026',
                    review: 'Exceptional work from start to finish. The team was professional, punctual, and completed the 25kW installation ahead of schedule. Highly recommend to any business owner in Lagos.',
                    tags: ['Professional', 'On Time', 'Great Warranty'],
                    status: 'submitted',
                },
            ],
        };
    }
    const res = await apiCall<Record<string, unknown>>('/reviews');
    if (!res.success) return { success: false, error: res.error };
    const d = res.data as Record<string, unknown>;
    const rows = (d.reviews ?? d.data) as unknown;
    return { success: true, data: Array.isArray(rows) ? rows as any[] : [], correlation_id: res.correlation_id };
}

// ---- Escrow Accounts ----

export async function fetchEscrowAccounts(): Promise<ApiResponse<{
    id: string; project: string; contractId: string; totalAmount: number;
    funded: number; released: number; held: number; commission: number; finalBuffer: number;
    milestones: { id: string; title: string; amount: number; percentage: number; status: string; date?: string }[];
}[]>> {
    if (!USE_REAL_API) {
        await delay();
        return {
            success: true,
            correlation_id: generateCorrelationId(),
            data: [
                {
                    id: 'esc-001',
                    project: 'Lekki Residential Solar',
                    contractId: 'con-1234',
                    totalAmount: 4800000,
                    funded: 4800000,
                    released: 1440000,
                    held: 480000,
                    commission: 192000,
                    finalBuffer: 480000,
                    milestones: [
                        { id: 'ms-1', title: 'Mobilisation & Site Prep', amount: 1440000, percentage: 30, status: 'released', date: 'Apr 15' },
                        { id: 'ms-2', title: 'Panel Installation', amount: 1440000, percentage: 30, status: 'funded', date: 'Pending approval' },
                        { id: 'ms-3', title: 'Wiring & Inverter Setup', amount: 960000, percentage: 20, status: 'held' },
                        { id: 'ms-4', title: 'Testing & Commissioning', amount: 480000, percentage: 10, status: 'pending' },
                        { id: 'ms-5', title: 'Final Buffer (Completion)', amount: 480000, percentage: 10, status: 'held' },
                    ],
                },
                {
                    id: 'esc-002',
                    project: 'Victoria Island Commercial',
                    contractId: 'con-9101',
                    totalAmount: 12500000,
                    funded: 12500000,
                    released: 3750000,
                    held: 1250000,
                    commission: 375000,
                    finalBuffer: 750000,
                    milestones: [
                        { id: 'ms-1', title: 'Initial Mobilisation', amount: 3750000, percentage: 30, status: 'released', date: 'Mar 28' },
                        { id: 'ms-2', title: 'Structural Work', amount: 3750000, percentage: 30, status: 'funded', date: 'In review' },
                        { id: 'ms-3', title: 'Equipment Installation', amount: 2500000, percentage: 20, status: 'held' },
                        { id: 'ms-4', title: 'Grid Connection', amount: 1250000, percentage: 10, status: 'pending' },
                        { id: 'ms-5', title: 'Final Buffer', amount: 1250000, percentage: 10, status: 'held' },
                    ],
                },
            ],
        };
    }

    const res = await apiCall<Record<string, unknown>>('/escrow/accounts');
    if (!res.success) return { success: false, error: res.error };
    const d = res.data as Record<string, unknown>;
    const rows = (d.accounts ?? d.data) as unknown;
    return { success: true, data: Array.isArray(rows) ? rows as any[] : [], correlation_id: res.correlation_id };
}

// ---- Disputes ----

export async function fetchDisputes(): Promise<ApiResponse<{
    id: string; project: string; projectId: string; installer: string; amount: number;
    reason: string; status: string; openedDate: string; evidenceCount: number;
    timeline: { date: string; actor: string; action: string; note?: string }[];
}[]>> {
    if (!USE_REAL_API) {
        await delay();
        return {
            success: true,
            correlation_id: generateCorrelationId(),
            data: [
                {
                    id: 'dsp-001',
                    project: 'Lekki Residential Solar',
                    projectId: 'proj-001',
                    installer: 'SunPower Installations Ltd.',
                    amount: 960000,
                    reason: 'Milestone 3 work quality does not meet agreed specification. Wiring job incomplete per scope.',
                    status: 'in_mediation',
                    openedDate: 'Apr 20, 2026',
                    evidenceCount: 3,
                    timeline: [
                        { date: 'Apr 20', actor: 'You', action: 'Raised dispute — wiring quality issue' },
                        { date: 'Apr 21', actor: 'Sunlit Admin', action: 'Dispute acknowledged. Mediation assigned.' },
                        { date: 'Apr 23', actor: 'SunPower Installations', action: 'Submitted counter-evidence (2 documents)' },
                        { date: 'Apr 24', actor: 'Sunlit Admin', action: 'Mediation session scheduled for Apr 28' },
                    ],
                },
            ],
        };
    }

    const res = await apiCall<Record<string, unknown>>('/disputes');
    if (!res.success) return { success: false, error: res.error };
    const d = res.data as Record<string, unknown>;
    const rows = (d.disputes ?? d.data) as unknown;
    return { success: true, data: Array.isArray(rows) ? rows as any[] : [], correlation_id: res.correlation_id };
}


export type KycUiStatus = 'pending' | 'verified' | 'failed' | 'needs_review';

export interface KycStatusPayload {
    status: KycUiStatus;
    canFundPayment: boolean;
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
                data: { status: 'pending', canFundPayment: false },
            };
        }
        const verified = res.data.status === 'verified';
        return {
            success: true,
            data: {
                status: res.data.status,
                canFundPayment: res.data.canFundPayment ?? verified,
            },
            correlation_id: res.correlation_id,
        };
    }

    await delay();
    return {
        success: true,
        correlation_id: generateCorrelationId(),
        data: { status: 'pending', canFundPayment: false },
    };
}

// ---- Messaging (Lifecycle-Gated) ----

export async function fetchActiveProjects(): Promise<ApiResponse<{ id: string; title: string; status: string }[]>> {
    if (!USE_REAL_API) {
        await delay();
        return {
            success: true,
            correlation_id: generateCorrelationId(),
            data: [
                { id: 'proj-001', title: 'Lekki Residential Solar', status: 'PROJECT_ACTIVATED' },
                { id: 'proj-002', title: 'Victoria Island Commercial', status: 'MILESTONES_EXECUTING' },
            ],
        };
    }
    return apiCall<{ id: string; title: string; status: string }[]>('/projects?status=active');
}

export async function fetchMessageThreads(): Promise<ApiResponse<{
    id: string; projectId: string; projectTitle: string; counterparty: string;
    counterpartyRole: string; avatar: string; lastMessage: string;
    lastTimestamp: string; unreadCount: number; status: string;
}[]>> {
    if (!USE_REAL_API) {
        await delay();
        return {
            success: true,
            correlation_id: generateCorrelationId(),
            data: [
                {
                    id: 'th-001', projectId: 'proj-001', projectTitle: 'Lekki Residential Solar',
                    counterparty: 'SunPower Installations Ltd.', counterpartyRole: 'installer',
                    avatar: 'SI', lastMessage: 'Panel delivery confirmed for Monday morning. Site crew will arrive by 8am.',
                    lastTimestamp: '2h ago', unreadCount: 2, status: 'active',
                },
                {
                    id: 'th-002', projectId: 'proj-002', projectTitle: 'Victoria Island Commercial',
                    counterparty: 'GreenGrid EPC Ltd.', counterpartyRole: 'epc',
                    avatar: 'GG', lastMessage: 'Milestone 2 inspection report has been uploaded to the portal.',
                    lastTimestamp: '1d ago', unreadCount: 0, status: 'active',
                },
            ],
        };
    }
    const res = await apiCall<Record<string, unknown>>('/messages/threads');
    if (!res.success) return { success: false, error: res.error };
    const d = res.data as Record<string, unknown>;
    const rows = (d.threads ?? d.data) as unknown;
    return { success: true, data: Array.isArray(rows) ? rows as any[] : [], correlation_id: res.correlation_id };
}

export async function fetchThreadMessages(threadId: string): Promise<ApiResponse<{
    id: string; threadId: string; sender: string; text: string;
    timestamp: string; status: string;
    attachments?: { name: string; size: string; url?: string }[];
}[]>> {
    if (!USE_REAL_API) {
        await delay();
        const mockMessages: Record<string, any[]> = {
            'th-001': [
                { id: 'm1', threadId: 'th-001', sender: 'counterparty', text: 'Good morning! We have completed the structural assessment for the rooftop installation. All checks passed.', timestamp: '09:14 AM', status: 'read' },
                { id: 'm2', threadId: 'th-001', sender: 'owner', text: 'Great to hear. When does the panel delivery arrive?', timestamp: '09:32 AM', status: 'read' },
                { id: 'm3', threadId: 'th-001', sender: 'counterparty', text: 'Panel delivery confirmed for Monday morning. Site crew will arrive by 8am.', timestamp: '11:05 AM', status: 'read' },
                { id: 'm4', threadId: 'th-001', sender: 'counterparty', text: 'I have also uploaded the progress report for Milestone 1. Please review and approve at your earliest convenience.', timestamp: '11:06 AM', status: 'delivered', attachments: [{ name: 'Milestone_1_Report.pdf', size: '2.4 MB' }] },
            ],
            'th-002': [
                { id: 'm1', threadId: 'th-002', sender: 'counterparty', text: 'Milestone 2 inspection report has been uploaded to the portal.', timestamp: 'Yesterday', status: 'read' },
            ],
        };
        return {
            success: true,
            correlation_id: generateCorrelationId(),
            data: mockMessages[threadId] || [],
        };
    }
    return apiCall<any[]>(`/messages/threads/${encodeURIComponent(threadId)}/messages`);
}

export async function sendThreadMessage(threadId: string, text: string): Promise<ApiResponse<{
    id: string; threadId: string; sender: string; text: string; timestamp: string; status: string;
}>> {
    if (!USE_REAL_API) {
        await delay(200);
        return {
            success: true,
            correlation_id: generateCorrelationId(),
            data: {
                id: `m${Date.now()}`,
                threadId,
                sender: 'owner',
                text,
                timestamp: new Date().toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' }),
                status: 'sent',
            },
        };
    }
    return apiCall<any>(`/messages/threads/${encodeURIComponent(threadId)}/messages`, {
        method: 'POST',
        body: JSON.stringify({ text }),
    });
}

// ---- Funding Setup ----

export async function fetchFundingStatus(projectId: string): Promise<ApiResponse<{
    projectId: string; projectTitle: string; contractId: string;
    totalAmount: number; amountFunded: number; status: string;
    virtualAccount?: { accountNumber: string; accountName: string; bankName: string; expiresAt: string; reference: string };
    paymentMethod?: string; fundedAt?: string;
}>> {
    if (!USE_REAL_API) {
        await delay();
        return {
            success: true,
            correlation_id: generateCorrelationId(),
            data: {
                projectId,
                projectTitle: 'Lekki Residential Solar',
                contractId: 'con-1234',
                totalAmount: 4800000,
                amountFunded: 4800000,
                status: 'funded',
                virtualAccount: {
                    accountNumber: '9904512378',
                    accountName: 'Sunlit Escrow / Lekki Solar',
                    bankName: 'Wema Bank (Paystack)',
                    expiresAt: '2026-06-15T00:00:00Z',
                    reference: 'SLT-PAY-20260420-001',
                },
                paymentMethod: 'bank_transfer',
                fundedAt: '2026-04-20T14:30:00Z',
            },
        };
    }
    return apiCall<any>(`/projects/${encodeURIComponent(projectId)}/funding`);
}

export async function initiateFunding(projectId: string, paymentMethod: string): Promise<ApiResponse<{
    virtualAccount: { accountNumber: string; accountName: string; bankName: string; expiresAt: string; reference: string };
    status: string;
}>> {
    if (!USE_REAL_API) {
        await delay(800);
        return {
            success: true,
            correlation_id: generateCorrelationId(),
            data: {
                virtualAccount: {
                    accountNumber: '9904512378',
                    accountName: 'Sunlit Escrow / Lekki Solar',
                    bankName: 'Wema Bank (Paystack)',
                    expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
                    reference: `SLT-PAY-${Date.now()}`,
                },
                status: 'account_generated',
            },
        };
    }
    return apiCall<any>(`/projects/${encodeURIComponent(projectId)}/funding/initiate`, {
        method: 'POST',
        body: JSON.stringify({ paymentMethod }),
    });
}

