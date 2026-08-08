/**
 * Shared types for Bid Flow Stitch Components.
 * Derived from BidComparisonItem and the MOCK_BID shape.
 */

export interface BidFinancialRow {
  item: string;
  type: 'Equipment' | 'Materials' | 'Labor';
  cost: number;
}

export interface BidDetail {
  id: string;
  installer: string;
  installerRating: number;
  reviews: number;
  location: string;
  amount: number;
  timeline: string;
  warranty: string;
  verified: boolean;
  proposalText: string;
  financials: BidFinancialRow[];
  managementPlan: string;
  crewSize: number;
  projectsCompleted: number;
  sunlitScore?: number;
}

// ---- CompareBids component props ----
export interface BidCompareCardProps {
  id: string;
  installerName: string;
  installerCompany?: string;
  installerRating?: number;
  sunlitScore?: number;
  /** Primary total cost (Stitch: totalAmount shown in comparison matrix) */
  totalAmount: number;
  /** Legacy alias — kept for backward compat with page orchestrator */
  amount?: number;
  completionDays?: number;
  /** Legacy alias — kept for backward compat */
  proposedTimelineDays?: number;
  warrantyYears?: number;
  isBest?: boolean;
  /** @deprecated — card links directly to /bids/[rfqId]/[bidId] */
  onViewDetail?: (bidId: string) => void;
  /** @deprecated — accept is handled from the detail page */
  onQuickAccept?: (bidId: string) => void;
  /** Optional: routes to bid rejection flow */
  onReject?: (bidId: string) => void;
  isAccepting?: boolean;
}

export interface CompareBidsProps {
  bids: BidCompareCardProps[];
  rfqId: string;
  /** Optional: routes to rejection flow */
  onReject?: (bidId: string) => void;
  loading?: boolean;
  accepted?: boolean;
}

// ---- BidDetailReview component props ----
export interface BidDetailReviewProps {
  bid: BidDetail;
  rfqId: string;
  bidId: string;
  onAccept: () => Promise<void>;
  submitting: boolean;
  error: string;
}
