'use client';

import { useState, use, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { acceptBid, fetchBidsForRfq, rejectBid } from '@/dashboards/project-owner/services/project-owner-api';
import { BidDetailReview } from '@/shared/screens/bids/BidDetailReview';
import { BidAcceptanceConfirmation } from '@/shared/screens/bids/BidAcceptanceConfirmation';
import { BidRejectedFeedback } from '@/shared/screens/bids/BidRejectedFeedback';
import type { BidDetail } from '@/shared/screens/bids/types';
import type { BidComparisonItem } from '@/dashboards/project-owner/types/dashboard';

/**
 * Bid Proposal Detail Page Orchestrator
 *
 * Stitch Screens:
 *   - 42a74979fa094ef2940d6b7fc54b928c  →  BidDetailReview  (primary view)
 *   - a46ba38372ba451ba32b5cb8cfc34917  →  BidAcceptanceConfirmation (post-accept)
 *
 * Lifecycle:
 * 1. Load: attempt to hydrate bid from fetchBidsForRfq for live data.
 *          Falls back to mock data when API returns no match (dev mode).
 * 2. Accept: calls acceptBid(rfqId, bidId) → dispatches bid_accepted event.
 *            On success → switches view to BidAcceptanceConfirmation.
 *            User then manually navigates to escrow-funding (giving them a moment to confirm).
 *
 * GOVERNANCE:
 *  ✔ acceptBid is the only mutation — it goes through the API service layer.
 *  ✔ No direct fetch() calls from this component.
 *  ✔ Escrow routing is initiated only after confirmed API success.
 *  ✔ Error surfaces gracefully in the action panel.
 */

// ---------------------------------------------------------------------------
// Fallback mock (used when API returns no matching bid — mock/dev mode)
// ---------------------------------------------------------------------------
function buildFallbackBid(bidId: string, apiMatch?: BidComparisonItem): BidDetail {
  const base: BidDetail = {
    id: bidId,
    installer: 'Luminous Solar Systems Ltd.',
    installerRating: 4.9,
    reviews: 124,
    location: 'Ikeja, Lagos',
    amount: 4_500_000,
    timeline: '14 Days',
    warranty: '5 Years',
    verified: true,
    sunlitScore: 94,
    proposalText:
      'Our approach focuses on maximum efficiency through precision-engineered load balancing. We utilise Tier-1 monocrystalline panels with half-cut cell technology to ensure high performance even in low-light conditions prevalent during the rainy season in Lagos.',
    financials: [
      { item: '10kW Mono-PERC Solar Panels (×18)', type: 'Equipment', cost: 2_100_000 },
      { item: '8kW Hybrid Inverter (Three-Phase)', type: 'Equipment', cost: 1_200_000 },
      { item: '10kWh Lithium LiFePO4 Battery Storage', type: 'Equipment', cost: 850_000 },
      { item: 'Mounting Hardware & DC Cabling', type: 'Materials', cost: 200_000 },
      { item: 'Professional Installation & Commissioning', type: 'Labor', cost: 150_000 },
    ],
    managementPlan:
      'Phase 1: Site Survey & Structural Check (Day 1-2). Phase 2: Logistics & Material Deployment (Day 3-4). Phase 3: Physical Installation (Day 5-10). Phase 4: Testing & Handover (Day 11-14).',
    crewSize: 6,
    projectsCompleted: 85,
  };

  if (!apiMatch) return base;

  // Overlay real API data where available
  return {
    ...base,
    id: apiMatch.id,
    installer: apiMatch.installerName,
    installerRating: apiMatch.installerRating ?? base.installerRating,
    amount: apiMatch.amount,
    sunlitScore: apiMatch.sunlitScore,
    proposalText: apiMatch.proposalText || base.proposalText,
    timeline: apiMatch.proposedTimelineDays
      ? `${apiMatch.proposedTimelineDays} Days`
      : base.timeline,
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function BidProposalPage({
  params,
}: {
  params: Promise<{ rfqId: string; bidId: string }>;
}) {
  const { rfqId, bidId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const actionParam = searchParams.get('action');

  const [bid, setBid] = useState<BidDetail | null>(null);
  // Also track the raw API match so we can pass installer_id to acceptBid
  const [apiMatch, setApiMatch] = useState<BidComparisonItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  // acceptedData holds contractId returned by POST /api/v1/contracts after acceptance
  const [acceptedData, setAcceptedData] = useState<{ contractId?: string } | null>(null);
  // rejection state
  const [isRejecting, setIsRejecting] = useState(actionParam === 'reject');

  // ── Load: try to enrich from live API, fallback to mock ──────────────────
  useEffect(() => {
    async function load() {
      const res = await fetchBidsForRfq(rfqId);
      const match = res.data?.find((b) => b.id === bidId) ?? null;
      setApiMatch(match ?? null);
      setBid(buildFallbackBid(bidId, match ?? undefined));
      setLoading(false);
    }
    load();
  }, [rfqId, bidId]);

  // ── Accept: calls POST /api/v1/contracts via acceptBid service ───────────
  async function handleAccept() {
    if (!bid) return;
    setSubmitting(true);
    setError('');

    try {
      // Pass installer_id + amount from API data so acceptBid can build the
      // full contract payload without a second fetch round-trip.
      const res = await acceptBid(rfqId, bidId, {
        installerId: apiMatch?.installerId,
        totalAmount: apiMatch?.amount ?? bid.amount,
      });
      if (res.success) {
        // Move to confirmation view — contractId enables routing to contract signing
        setAcceptedData({ contractId: res.data?.contractId });
      } else {
        setError(res.error || 'Failed to accept bid. Please try again.');
      }
    } catch {
      setError('An unexpected network error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  // ── Skeleton loader ───────────────────────────────────────────────────────
  if (loading || !bid) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F9FAFA] p-8 lg:p-12 animate-pulse space-y-8 max-w-7xl mx-auto">
        <div className="h-6 w-64 bg-[#EEF2F0] rounded-full" />
        <div className="flex gap-6 items-start">
          <div className="w-20 h-20 bg-[#EEF2F0] rounded-2xl" />
          <div className="space-y-3 flex-1">
            <div className="h-8 w-72 bg-[#EEF2F0] rounded-2xl" />
            <div className="h-4 w-48 bg-[#EEF2F0] rounded-full" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-6">
            <div className="h-48 bg-[#EEF2F0] rounded-3xl" />
            <div className="h-64 bg-[#EEF2F0] rounded-3xl" />
            <div className="h-64 bg-[#EEF2F0] rounded-3xl" />
          </div>
          <div className="lg:col-span-4">
            <div className="h-72 bg-[#EEF2F0] rounded-[32px]" />
          </div>
        </div>
      </div>
    );
  }

  // ── Rejection flow: show BidRejectedFeedback ─────────────────────────────
  if (isRejecting) {
    return (
      <BidRejectedFeedback
        installerName={bid.installer}
        bidId={bidId}
        rfqId={rfqId}
        amount={bid.amount}
        submitting={submitting}
        error={error}
        onConfirm={async (reason, note) => {
          setSubmitting(true);
          setError('');
          try {
            const res = await rejectBid(bidId, reason, note);
            if (!res.success) {
              setError(res.error || 'Failed to reject bid.');
            }
          } catch {
            setError('Unexpected error. Please try again.');
          } finally {
            setSubmitting(false);
          }
        }}
      />
    );
  }

  // ── Post-acceptance: show trust confirmation ──────────────────────────────
  if (acceptedData) {
    return (
      <BidAcceptanceConfirmation
        installerName={bid.installer}
        amount={bid.amount}
        projectId={rfqId}
        rfqId={rfqId}
        contractId={acceptedData.contractId}
      />
    );
  }

  // ── Primary view: deep-dive proposal ─────────────────────────────────────
  return (
    <BidDetailReview
      bid={bid}
      rfqId={rfqId}
      bidId={bidId}
      onAccept={handleAccept}
      submitting={submitting}
      error={error}
    />
  );
}
