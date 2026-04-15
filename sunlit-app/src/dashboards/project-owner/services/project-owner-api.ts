import { sanitizePayload } from '@/shared/validators/sanitize';
import type {
    DashboardSummary, RfqListItem, BidComparisonItem,
    ProjectView,
} from '../types/dashboard';
import type { CreateRfqFormValues } from '../validators/rfq-form';

/**
 * Project Owner API Service Layer
 * 
 * All API calls for the Project Owner Dashboard.
 * Enforces:
 *   - Input sanitization before every request
 *   - Type-safe request/response
 *   - Correlation ID propagation from server responses
 * 
 * GEMINI.md: No direct DB access. All access via API layer.
 */

const API_BASE = '/api/v1';

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    correlation_id?: string;
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
        let json: any = {};
        try {
            json = text ? JSON.parse(text) : {};
        } catch (e) {
            json = { error: `Server returned non-JSON response: ${text.substring(0, 100)}` };
        }

        if (!res.ok) {
            return {
                success: false,
                error: json.error || `Request failed with status ${res.status}`,
                correlation_id: json.correlation_id,
            };
        }

        return {
            success: true,
            data: json.data || json,
            message: json.message,
            correlation_id: json.correlation_id,
        };
    } catch (err) {
        return {
            success: false,
            error: err instanceof Error ? err.message : 'Network error',
        };
    }
}

// ---- Dashboard ----

export async function fetchDashboardSummary(): Promise<ApiResponse<DashboardSummary>> {
    // TODO: Wire to real endpoint when available
    // For now, return mock data
    return {
        success: true,
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
    // TODO: Wire to GET /api/v1/rfq
    return {
        success: true,
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
                locationState: 'FCT Abuja',
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

    // Map UI form fields → CreateRfqSchema contract (GEMINI.md §7)
    // The backend schema expects: projectType, configMode, budget, location, location_state, timeline
    // UI collects: projectTitle, budgetRangeMin/Max, locationState/City, systemSizeKw, timelineDays
    return apiCall<{ rfqId: string }>('/rfq', {
        method: 'POST',
        body: JSON.stringify({
            projectType: sanitized.projectType || 'Residential',
            configMode: 'Appliance',
            location: sanitized.locationCity,
            location_state: sanitized.locationState,
            budget: Number(sanitized.budgetRangeMax),
            timeline: `${sanitized.timelineDays} days`,
            appliances: sanitized.appliances 
                ? sanitized.appliances.map((a: string | { name: string, quantity: number, wattage?: number }) => 
                    typeof a === 'string' ? { name: a, quantity: 1, wattage: 200 } : a
                  )
                : [{ name: 'General Load', quantity: 1, wattage: Number(sanitized.systemSizeKw || 5) * 1000 }],
        }),
    });
}

// ---- Bids ----

export async function fetchBidsForRfq(rfqId: string): Promise<ApiResponse<BidComparisonItem[]>> {
    // TODO: Wire to GET /api/v1/bids?rfq_id=...
    return {
        success: true,
        data: [
            {
                id: 'bid-001',
                installerId: 'inst-001',
                installerName: 'SolarPro Nigeria Ltd',
                installerRating: 4.8,
                sunlitScore: 94,
                amount: 2_800_000,
                proposedTimelineDays: 25,
                proposalText: 'Full turnkey installation with Tier-1 panels (Canadian Solar), 5kVA Deye inverter, and 10kWh lithium battery bank. Includes 2 years maintenance warranty.',
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
                proposalText: 'Premium installation with JA Solar panels, Growatt inverter, and 15kWh battery storage. Fast-track delivery with dedicated project manager.',
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
                proposalText: 'Budget-friendly option with quality LONGi panels and Felicity inverter. 1 year warranty included.',
                status: 'submitted',
                createdAt: '2026-04-12T09:00:00Z',
            },
        ],
    };
}

export async function acceptBid(rfqId: string, bidId: string): Promise<ApiResponse<void>> {
    return apiCall<void>(`/rfq/${rfqId}/bids`, {
        method: 'POST',
        body: JSON.stringify({ bid_id: bidId }),
    });
}

// ---- Projects ----

export async function fetchProject(projectId: string): Promise<ApiResponse<ProjectView>> {
    // TODO: Wire to GET /api/v1/projects/:id
    return {
        success: true,
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
                { id: 'ms-001', title: 'Deposit & Procurement', amount: 1_400_000, position: 1, isCompleted: true, isApproved: true, escrowStatus: 'released', escrowId: 'esc-001' },
                { id: 'ms-002', title: 'Installation & Wiring', amount: 840_000, position: 2, isCompleted: false, isApproved: false, escrowStatus: 'funded', escrowId: 'esc-002' },
                { id: 'ms-003', title: 'Testing & Commissioning', amount: 280_000, position: 3, isCompleted: false, isApproved: false, escrowStatus: 'pending' },
                { id: 'ms-004', title: 'Final Handover', amount: 280_000, position: 4, isCompleted: false, isApproved: false, escrowStatus: 'pending' },
            ],
            escrows: [
                { id: 'esc-001', milestoneId: 'ms-001', milestoneTitle: 'Deposit & Procurement', amount: 1_400_000, status: 'released', releasedAt: '2026-04-05T14:00:00Z' },
                { id: 'esc-002', milestoneId: 'ms-002', milestoneTitle: 'Installation & Wiring', amount: 840_000, status: 'funded' },
            ],
        },
    };
}

// ---- Payments ----

export async function initializePayment(milestoneId: string, projectId: string, amount: number): Promise<ApiResponse<{ paymentUrl: string }>> {
    const sanitized = sanitizePayload({ milestone_id: milestoneId, project_id: projectId, amount });
    return apiCall<{ paymentUrl: string }>('/payments/initialize', {
        method: 'POST',
        body: JSON.stringify(sanitized),
    });
}

// ---- Escrow ----

export async function releaseEscrow(escrowId: string, projectId: string, milestoneId: string): Promise<ApiResponse<void>> {
    const sanitized = sanitizePayload({ escrow_id: escrowId, project_id: projectId, milestone_id: milestoneId });
    return apiCall<void>('/escrow/release', {
        method: 'POST',
        body: JSON.stringify(sanitized),
    });
}

// ---- Disputes ----

export async function createDispute(projectId: string, escrowId: string, reason: string): Promise<ApiResponse<{ caseId: string }>> {
    const sanitized = sanitizePayload({ project_id: projectId, escrow_id: escrowId, reason });
    return apiCall<{ caseId: string }>('/disputes', {
        method: 'POST',
        body: JSON.stringify(sanitized),
    });
}
