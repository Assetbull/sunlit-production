'use client';

import { useEffect, useState, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { fetchBidsForRfq, acceptBid } from '@/dashboards/project-owner/services/project-owner-api';
import type { BidComparisonItem } from '@/dashboards/project-owner/types/dashboard';
import { CompareBids } from '@/shared/screens/bids/CompareBids';
import type { BidCompareCardProps } from '@/shared/screens/bids/types';

/**
 * Bid Comparison Page Orchestrator
 *
 * Stitch Screens:
 *   - ed5fd6f90de0415da7e544a839cec46e — "Bid Comparison | Technical Matrix"
 *   - d70be1ce32934272ae1acbbca82900d3 — "Mobile Bid Comparison | Proposal Triage"
 *   - 93f2e38aac1d4cba82bbe41c7ec856a0 — "Bid Management | Active RFQs" (linked from bids list)
 *
 * Lifecycle:
 * 1. fetchBidsForRfq(rfqId)  → loads all received proposals
 * 2. handleQuickAccept(bidId) → calls acceptBid() → POST /api/v1/contracts
 *                            → emits bid_accepted + contract_created events
 *                            → navigates to contract signing after 1.5s
 * 3. onViewDetail(bidId)     → pushes to /bids/[rfqId]/[bidId] for deep review
 * 4. onReject(bidId)         → pushes to /bids/[rfqId]/[bidId]?action=reject for rejection flow
 */

export default function BidsComparisonPage({ params }: { params: Promise<{ rfqId: string }> }) {
  const { rfqId } = use(params);
  const router = useRouter();

  const [rawBids, setRawBids] = useState<BidComparisonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetchBidsForRfq(rfqId);
      if (res.success && res.data) setRawBids(res.data);
      setLoading(false);
    }
    load();
  }, [rfqId]);

  // Navigate to deep-dive proposal view
  const handleViewDetail = useCallback(
    (bidId: string) => {
      router.push(`/dashboard/project-owner/bids/${rfqId}/${bidId}`);
    },
    [rfqId, router]
  );

  // Navigate to rejection flow
  // Routes to BidRejectedFeedback screen via bid detail page with ?action=reject
  const handleReject = useCallback(
    (bidId: string) => {
      router.push(`/dashboard/project-owner/bids/${rfqId}/${bidId}?action=reject`);
    },
    [rfqId, router]
  );

  // Quick-accept: calls POST /api/v1/contracts via acceptBid, then routes to contract signing
  // State machine: BID_ACCEPTED → CONTRACT_CREATED → CONTRACT_SIGNED (next page)
  const handleQuickAccept = useCallback(
    async (bidId: string) => {
      setAccepting(bidId);

      // Find the raw bid so we can pass installer_id + amount directly
      const rawBid = rawBids.find((b) => b.id === bidId);

      const res = await acceptBid(rfqId, bidId, {
        installerId: rawBid?.installerId,
        totalAmount: rawBid?.amount,
      });

      if (res.success) {
        setAccepted(true);
        // Route to contract signing — correct next step after CONTRACT_CREATED
        // Falls back to project overview if no contractId (mock mode)
        const contractId = res.data?.contractId;
        setTimeout(() => {
          if (contractId) {
            router.push(`/dashboard/project-owner/contracts/${contractId}/sign`);
          } else {
            router.push(`/dashboard/project-owner/bids/${rfqId}/${bidId}`);
          }
        }, 1500);
      }
      setAccepting(null);
    },
    [rfqId, rawBids, router]
  );

  // Derive sorted props for the Stitch component.
  // Sort: highest sunlitScore first → best technical value badge on [0].
  const sortedBids: BidCompareCardProps[] = [...rawBids]
    .sort((a, b) => (b.sunlitScore ?? 0) - (a.sunlitScore ?? 0))
    .map((bid, index) => ({
      id: bid.id,
      installerName: bid.installerName,
      installerCompany: bid.installerName, // use name as company fallback
      installerRating: bid.installerRating,
      sunlitScore: bid.sunlitScore,
      totalAmount: bid.amount,             // map amount → totalAmount (new Stitch field)
      amount: bid.amount,                  // keep legacy alias
      completionDays: bid.proposedTimelineDays,
      proposedTimelineDays: bid.proposedTimelineDays,
      warrantyYears: 5,                    // default; real data from bid spec
      isBest: index === 0,
      onViewDetail: handleViewDetail,
      onQuickAccept: handleQuickAccept,
      isAccepting: accepting === bid.id,
    }));

  return (
    <div className="solar-flare-bg min-h-screen font-body text-on-surface pb-24">
      {/* Ambient decorative blob */}
      <div className="fixed top-0 right-0 -z-10 w-1/2 h-1/2 bg-gradient-to-bl from-primary-container/10 to-transparent rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 pt-12">
        <CompareBids
          bids={sortedBids}
          rfqId={rfqId}
          onReject={handleReject}
          loading={loading}
          accepted={accepted}
        />
      </div>
    </div>
  );
}
