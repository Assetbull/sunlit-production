/**
 * Installer Dashboard API Service
 *
 * Client-side functions for fetching installer-specific data.
 * All calls go through the authenticated API layer.
 *
 * GEMINI.md: "NO direct DB access from frontend"
 */

// =============================================
// Types
// =============================================

export interface InstallerDashboardSummary {
  activeProjects: number;
  pendingBids: number;
  totalEarnings: number;
  crewJobsPosted: number;
  pendingMilestones: number;
  newMatches: number;
}

export interface MarketplaceItem {
  id: string;
  type: 'rfq' | 'crew_job';
  title: string;
  location_state?: string;
  location_city?: string;
  budget?: number;
  budgetMin?: number;
  budgetMax?: number;
  systemSizeKw?: number;
  projectType?: string;
  status: string;
  posted_by: string;
  bidsCount?: number;
  timeline?: string;
  created_at: string;
}

export interface InstallerBid {
  id: string;
  rfq_id: string;
  project_title: string;
  amount: number;
  proposed_timeline_days?: number;
  proposal_text?: string;
  status: 'submitted' | 'accepted' | 'rejected' | 'withdrawn';
  budget_min?: number;
  budget_max?: number;
  created_at: string;
}

export interface InstallerProject {
  id: string;
  title: string;
  status: string;
  client_name?: string;
  contract_value: number;
  location_state?: string;
  location_city?: string;
  milestones_total: number;
  milestones_completed: number;
  payment_funded: number;
  payment_released: number;
  created_at: string;
}

export interface ActivityItem {
  id: string;
  type: 'bid_accepted' | 'bid_rejected' | 'milestone_approved' | 'new_match' | 'payment_released' | 'crew_applied';
  title: string;
  description: string;
  timestamp: string;
}

// =============================================
// API Result Wrapper
// =============================================

interface ApiResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function apiCall<T>(url: string, options?: RequestInit): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    const json = await res.json();
    if (!res.ok) {
      return { success: false, error: json.error || `HTTP ${res.status}` };
    }
    return { success: true, data: json as T };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Network error' };
  }
}

// =============================================
// Dashboard Summary
// =============================================

export async function fetchInstallerDashboard(): Promise<ApiResult<InstallerDashboardSummary>> {
  // Scaffold mode: return mock data until backend is wired
  return {
    success: true,
    data: {
      activeProjects: 3,
      pendingBids: 7,
      totalEarnings: 12450000,
      crewJobsPosted: 2,
      pendingMilestones: 2,
      newMatches: 1,
    },
  };
}

// =============================================
// Marketplace
// =============================================

export async function fetchMarketplace(filters?: {
  location?: string;
  budgetMin?: number;
  budgetMax?: number;
  projectType?: string;
}): Promise<ApiResult<{ items: MarketplaceItem[] }>> {
  const params = new URLSearchParams();
  if (filters?.location) params.set('location', filters.location);
  if (filters?.budgetMin) params.set('budget_min', String(filters.budgetMin));
  if (filters?.budgetMax) params.set('budget_max', String(filters.budgetMax));
  if (filters?.projectType) params.set('project_type', filters.projectType);

  return apiCall(`/api/v1/marketplace?${params.toString()}`);
}

// =============================================
// Bids
// =============================================

export async function fetchMyBids(): Promise<ApiResult<{ bids: InstallerBid[] }>> {
  return apiCall('/api/v1/bids?scope=mine');
}

export async function submitBid(rfqId: string, data: {
  amount: number;
  proposed_timeline_days?: number;
  proposal_text: string;
}): Promise<ApiResult<{ bid_id: string }>> {
  return apiCall('/api/v1/bids', {
    method: 'POST',
    body: JSON.stringify({ rfq_id: rfqId, ...data }),
  });
}

export async function withdrawBid(bidId: string): Promise<ApiResult<void>> {
  return apiCall(`/api/v1/bids/${bidId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'withdrawn' }),
  });
}

// =============================================
// Projects
// =============================================

export async function fetchActiveProjects(): Promise<ApiResult<{ projects: InstallerProject[] }>> {
  return apiCall('/api/v1/projects?scope=installer');
}

export async function fetchProjectDetail(projectId: string): Promise<ApiResult<InstallerProject>> {
  return apiCall(`/api/v1/projects/${projectId}`);
}

// =============================================
// Milestones
// =============================================

export async function updateMilestone(milestoneId: string, data: {
  progress: number;
  notes?: string;
  proof_url?: string;
}): Promise<ApiResult<void>> {
  return apiCall(`/api/v1/milestones/${milestoneId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// =============================================
// Activity Feed
// =============================================

export async function fetchRecentActivity(): Promise<ApiResult<{ items: ActivityItem[] }>> {
  // Scaffold mode: return mock data
  return {
    success: true,
    data: {
      items: [
        {
          id: '1', type: 'bid_accepted',
          title: 'Bid Accepted',
          description: 'Your bid for "Lekki Residential Solar" was accepted',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: '2', type: 'milestone_approved',
          title: 'Milestone Approved',
          description: 'Site Survey milestone approved for "Modernist Villa"',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          id: '3', type: 'new_match',
          title: 'New Match',
          description: 'A new 25kW commercial project in Lagos matches your profile',
          timestamp: new Date(Date.now() - 14400000).toISOString(),
        },
        {
          id: '4', type: 'payment_released',
          title: 'Payment Released',
          description: '₦1,260,000 released for equipment procurement milestone',
          timestamp: new Date(Date.now() - 28800000).toISOString(),
        },
        {
          id: '5', type: 'crew_applied',
          title: 'Crew Application',
          description: '2 new applications for "Solar Panel Installer" position',
          timestamp: new Date(Date.now() - 43200000).toISOString(),
        },
      ],
    },
  };
}
