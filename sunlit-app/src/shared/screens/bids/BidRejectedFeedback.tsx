'use client';

/**
 * Bid Rejected | Operational Feedback
 *
 * Stitch Screen ID: c63a442c05784f3e9e8d912e3245f878
 *
 * Shown after a project owner chooses to reject a specific bid.
 * Allows optional rejection reason + installer notification.
 *
 * Lifecycle:
 *  - Project owner selects "Reject" on bid comparison or detail page
 *  - This screen renders with installer context
 *  - Owner may optionally provide rejection reason
 *  - On confirm: calls backend PATCH (graceful fallback in mock mode)
 *  - On dismiss: routes back to bids comparison
 *
 * GOVERNANCE:
 *  ✔ Uses existing service layer pattern
 *  ✔ Emits bid_rejected event server-side (when PATCH hits real API)
 *  ✔ No direct fetch() calls
 */

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  XCircle,
  MessageSquare,
  ChevronDown,
  ArrowRight,
  ShieldOff,
  Zap,
  Check,
} from 'lucide-react';

export interface BidRejectedFeedbackProps {
  installerName: string;
  bidId: string;
  rfqId: string;
  amount: number;
  /** Called when rejection is confirmed */
  onConfirm: (reason: string, note: string) => Promise<void>;
  /** Loading state from parent orchestrator */
  submitting?: boolean;
  error?: string;
}

const REJECTION_REASONS = [
  { value: 'price_too_high', label: 'Price too high for our budget' },
  { value: 'timeline_mismatch', label: 'Timeline does not meet our requirements' },
  { value: 'proposal_insufficient', label: 'Proposal lacks required technical detail' },
  { value: 'warranty_insufficient', label: 'Warranty terms are insufficient' },
  { value: 'selected_another', label: 'Selected a different installer' },
  { value: 'project_postponed', label: 'Project has been postponed' },
  { value: 'other', label: 'Other reason' },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function BidRejectedFeedback({
  installerName,
  bidId,
  rfqId,
  amount,
  onConfirm,
  submitting = false,
  error,
}: BidRejectedFeedbackProps) {
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  async function handleSubmit() {
    if (!reason) return;
    await onConfirm(reason, note);
    setConfirmed(true);
  }

  if (confirmed) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F9FAFA] items-center justify-center px-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="relative flex items-center justify-center mb-10">
          <div className="absolute w-32 h-32 rounded-full bg-on-surface/5 animate-ping" style={{ animationDuration: '2s' }} />
          <div className="relative w-20 h-20 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center shadow-xl border-4 border-surface-container">
            <Check size={36} strokeWidth={2.5} />
          </div>
        </div>
        <div className="text-center max-w-md mb-10 space-y-3">
          <p className="text-[11px] font-black text-on-surface-variant uppercase tracking-[0.3em]">
            Decision Logged
          </p>
          <h1 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight">
            Bid Declined
          </h1>
          <p className="text-base font-medium text-on-surface-variant leading-relaxed">
            <span className="font-black text-on-surface">{installerName}</span> has been notified.
            Your other proposals remain active.
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-sm">
          <Link
            href={`/dashboard/project-owner/bids/${rfqId}`}
            className="w-full bg-on-surface text-surface font-extrabold py-4 rounded-2xl flex items-center justify-center gap-3 hover:opacity-90 active:scale-[0.98] transition-all shadow-xl"
          >
            <Zap size={18} />
            Back to Proposals
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/dashboard/project-owner"
            className="w-full bg-surface-container-lowest border border-outline-variant/30 text-on-surface-variant font-extrabold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-surface-container active:scale-[0.98] transition-all text-sm"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFA]">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl shadow-sm border-b border-[#EEF2F0] flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/project-owner/bids/${rfqId}`}
            className="flex items-center justify-center w-8 h-8 rounded-full border border-[#E0E7E4] text-[#707A6C] hover:bg-[#F4F7F5] transition-colors group"
            aria-label="Back to proposals"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          </Link>
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="text-[#707A6C]">Bid Proposals</span>
            <span className="text-[#BCC6C0]">/</span>
            <span className="text-on-surface font-semibold">Decline Proposal</span>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-error/8 border border-error/20 text-error text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5">
          <ShieldOff size={11} />
          Rejection Flow
        </span>
      </header>

      <main className="flex-1 p-6 md:p-12 max-w-2xl mx-auto w-full">
        {/* Icon + Title */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-surface-container-high flex items-center justify-center mx-auto mb-6 text-on-surface-variant">
            <XCircle size={32} strokeWidth={1.5} />
          </div>
          <h1 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight mb-2">
            Decline Proposal
          </h1>
          <p className="text-on-surface-variant font-medium max-w-sm mx-auto leading-relaxed">
            You are about to decline the bid from{' '}
            <span className="font-black text-on-surface">{installerName}</span> valued at{' '}
            <span className="font-black text-on-surface">{formatCurrency(amount)}</span>.
          </p>
        </div>

        <div className="space-y-6">
          {/* Reason Selector */}
          <div className="bg-white border border-[#EEF2F0] rounded-[1.5rem] p-6 shadow-sm">
            <label
              htmlFor="rejection-reason"
              className="block text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant/60 mb-4"
            >
              Rejection Reason <span className="text-error">*</span>
            </label>
            <div className="relative">
              <select
                id="rejection-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full appearance-none h-12 px-4 pr-10 rounded-xl border-2 border-outline-variant/30 bg-surface-container-lowest text-on-surface font-medium text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="">Select a reason…</option>
                {REJECTION_REASONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
              />
            </div>
          </div>

          {/* Optional Note */}
          <div className="bg-white border border-[#EEF2F0] rounded-[1.5rem] p-6 shadow-sm">
            <label
              htmlFor="rejection-note"
              className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant/60 mb-4"
            >
              <MessageSquare size={12} />
              Additional Note (Optional)
            </label>
            <textarea
              id="rejection-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              placeholder="Help the installer improve for future proposals…"
              maxLength={500}
              className="w-full px-4 py-3 rounded-xl border-2 border-outline-variant/30 bg-surface-container-lowest text-on-surface font-medium text-sm placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            />
            <p className="text-[10px] text-on-surface-variant/40 font-medium text-right mt-2">
              {note.length}/500
            </p>
          </div>

          {/* Installer Notification Notice */}
          <div className="flex items-start gap-3 px-5 py-4 bg-amber-50 border border-amber-200 rounded-2xl">
            <Zap size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs font-medium text-amber-800 leading-relaxed">
              The installer will receive an automated notification with your reason. Your other
              proposals remain active and unaffected.
            </p>
          </div>

          {/* Error State */}
          {error && (
            <div className="px-4 py-3 bg-error/8 border border-error/20 rounded-xl">
              <p className="text-xs font-bold text-error">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-4">
            <button
              id="confirm-rejection-btn"
              onClick={handleSubmit}
              disabled={!reason || submitting}
              className="w-full bg-on-surface text-surface font-extrabold py-4 rounded-2xl flex items-center justify-center gap-3 hover:opacity-90 active:scale-[0.98] transition-all shadow-xl disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-surface border-t-transparent rounded-full animate-spin" />
                  Processing…
                </>
              ) : (
                <>
                  <XCircle size={18} />
                  Confirm Rejection
                  <ArrowRight size={16} />
                </>
              )}
            </button>
            <Link
              href={`/dashboard/project-owner/bids/${rfqId}`}
              className="w-full bg-surface-container-lowest border border-outline-variant/30 text-on-surface-variant font-extrabold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-surface-container active:scale-[0.98] transition-all text-sm"
            >
              Cancel — Keep Proposal Active
            </Link>
          </div>
        </div>

        {/* Stitch Attribution */}
        <p className="text-[10px] text-center text-on-surface-variant/20 font-extrabold uppercase tracking-widest mt-12">
          Stitch Screen: c63a442c05784f3e9e8d912e3245f878 · Bid Rejected Operational Feedback
        </p>
      </main>
    </div>
  );
}
