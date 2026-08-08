'use client';

/**
 * Milestone Review & OTP Payment Release
 *
 * Stitch Screens:
 *   - e6f84760b330493b9e97488c6439c2d2 — Milestone Review
 *   - ebddf9f2bf4f4db996f7d5049209eb0c — OTP Confirmation
 *   - 21e5bae207c54d53b8ff420ebb897681 — Payment Release Confirmation
 *
 * Flow:
 *   INSTALLER → submit milestone
 *   SYSTEM → validate
 *   OWNER → review deliverables + proof
 *   OWNER → approve → OTP modal
 *   OWNER → enter OTP → confirm
 *   SYSTEM → release funds to installer
 *
 * Crew Isolation: ENFORCED — zero crew data exposure.
 * Luminous Precision Design — zero inline styles.
 */

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  X,
  AlertCircle,
  Shield,
  Clock,
  ChevronRight,
  FileText,
  Zap,
  Upload,
  Lock,
  Image as ImageIcon,
  ExternalLink,
} from 'lucide-react';

interface Deliverable {
  id: string;
  label: string;
  completed: boolean;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  status: string;
  submitted_at?: string;
  proof_urls?: string[];
  deliverables?: Deliverable[];
  proof_notes?: string;
  sequence_order?: number;
  project_id: string;
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(n);
}

// ── OTP Modal ─────────────────────────────────────────────────────────────
function OTPModal({
  milestone,
  onConfirm,
  onClose,
}: {
  milestone: Milestone;
  onConfirm: (otp: string) => Promise<void>;
  onClose: () => void;
}) {
  const [otp, setOtp] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');

  async function requestOtp() {
    setSending(true);
    setError('');
    try {
      const r = await fetch(`/api/v1/milestones/${milestone.id}/approve/request-otp`, { method: 'POST' });
      const d = await r.json();
      if (d.success) {
        setSent(true);
        setCountdown(300);
      } else {
        setError(d.error ?? 'Failed to send OTP');
      }
    } catch {
      setError('Network error');
    } finally {
      setSending(false);
    }
  }

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  async function confirm() {
    if (otp.length !== 6) {
      setError('Enter the 6-digit OTP');
      return;
    }
    setConfirming(true);
    setError('');
    try {
      await onConfirm(otp);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Confirmation failed');
    } finally {
      setConfirming(false);
    }
  }

  const COMMISSION = 0.04;
  const commissionAmt = milestone.amount * COMMISSION;
  const installerAmt = milestone.amount - commissionAmt;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-[1.75rem] shadow-2xl relative animate-in slide-in-from-bottom-4 duration-300 overflow-hidden">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 bg-surface-container-lowest rounded-xl flex items-center justify-center text-on-surface-variant/40 hover:text-on-surface transition-colors z-10"
        >
          <X size={16} />
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-7">
            <div className="w-12 h-12 rounded-2xl cta-gradient flex items-center justify-center shadow-lg shadow-primary/20">
              <Shield size={22} className="text-white" />
            </div>
            <div>
              <h2 className="font-headline text-lg font-extrabold text-on-surface tracking-tight">
                Confirm Payment Release
              </h2>
              <p className="text-xs text-on-surface-variant/60 font-medium">
                OTP-secured fund transfer
              </p>
            </div>
          </div>

          {/* Payment Breakdown */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/20 mb-6">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant/50 mb-4">
              Payment Breakdown
            </p>
            <div className="space-y-3">
              {[
                { label: 'Milestone Amount', value: fmt(milestone.amount), color: 'text-on-surface' },
                { label: `Platform Commission (${COMMISSION * 100}%)`, value: `- ${fmt(commissionAmt)}`, color: 'text-error' },
                { label: 'Installer Receives', value: fmt(installerAmt), color: 'text-emerald-600' },
              ].map((r) => (
                <div
                  key={r.label}
                  className="flex justify-between items-center py-2 border-b border-outline-variant/10 last:border-none"
                >
                  <span className="text-xs font-medium text-on-surface-variant">{r.label}</span>
                  <span className={`text-sm font-extrabold ${r.color}`}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* OTP Flow */}
          {!sent ? (
            <button
              onClick={requestOtp}
              disabled={sending}
              className="w-full h-14 cta-gradient text-white rounded-xl font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {sending ? (
                <>
                  <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                  Sending OTP…
                </>
              ) : (
                'Send OTP to My Phone/Email'
              )}
            </button>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-on-surface-variant text-center">
                Enter the 6-digit code sent to your contact{' '}
                {countdown > 0 ? (
                  <span className="font-bold text-on-surface">({countdown}s)</span>
                ) : (
                  <span className="font-bold text-error">Expired</span>
                )}
              </p>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full h-16 text-center font-headline text-3xl font-extrabold tracking-[0.4em] text-on-surface bg-surface-container-lowest border-2 border-outline-variant/20 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                style={{ fontFamily: 'monospace' }}
              />

              {error && (
                <div className="flex items-center gap-2 text-error text-xs font-bold text-center justify-center">
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}

              <button
                onClick={confirm}
                disabled={confirming || otp.length !== 6}
                className={`w-full h-14 rounded-xl font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                  otp.length === 6
                    ? 'cta-gradient text-white shadow-lg shadow-primary/20 hover:brightness-105 active:scale-[0.98]'
                    : 'bg-surface-container text-on-surface-variant/40 cursor-not-allowed'
                }`}
              >
                {confirming ? (
                  <>
                    <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                    Releasing Funds…
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    Confirm Release
                  </>
                )}
              </button>

              {countdown === 0 && (
                <button
                  onClick={requestOtp}
                  className="w-full text-center text-primary font-extrabold text-xs hover:underline transition-all"
                >
                  Resend OTP
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────
function ReviewSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="h-4 w-32 bg-surface-container rounded-full" />
      </div>
      <div>
        <div className="h-5 w-40 bg-surface-container rounded-full mb-3" />
        <div className="h-10 w-72 bg-surface-container-high rounded-2xl mb-2" />
        <div className="h-4 w-96 bg-surface-container rounded-full" />
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-28 bg-surface-container-lowest rounded-[1.75rem]" />
      ))}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────
export default function MilestoneReviewPage({
  params,
}: {
  params: Promise<{ projectId: string; milestoneId: string }>;
}) {
  const { projectId, milestoneId } = use(params);
  const router = useRouter();
  const [ms, setMs] = useState<Milestone | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOtp, setShowOtp] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/v1/milestones/${milestoneId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setMs(d.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [milestoneId]);

  async function handleApprove(otp: string) {
    const r = await fetch(`/api/v1/milestones/${milestoneId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_id: projectId, otp }),
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error ?? 'Approval failed');
    setShowOtp(false);
    setSuccess('Payment released successfully!');
    setMs((prev) => (prev ? { ...prev, status: 'PAID' } : prev));
    setTimeout(() => router.push(`/dashboard/project-owner/projects/${projectId}/execution`), 2500);
  }

  async function handleReject() {
    setRejecting(true);
    const r = await fetch(`/api/v1/milestones/${milestoneId}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_id: projectId, reason: 'Rejected by project owner' }),
    });
    const d = await r.json();
    setRejecting(false);
    if (d.success) {
      setSuccess('Milestone rejected.');
      router.push(`/dashboard/project-owner/projects/${projectId}/execution`);
    } else {
      setError(d.error ?? 'Failed to reject');
    }
  }

  if (loading) return <ReviewSkeleton />;

  if (!ms)
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <AlertCircle size={48} className="text-error mb-4" />
        <h2 className="font-headline text-2xl font-extrabold text-on-surface mb-2">Milestone Not Found</h2>
        <Link
          href={`/dashboard/project-owner/projects/${projectId}/execution`}
          className="text-primary font-bold hover:underline"
        >
          Back to Execution
        </Link>
      </div>
    );

  const isPaid = ms.status === 'PAID';
  const isSubmitted = ms.status === 'SUBMITTED';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-10 max-w-4xl mx-auto">
      {showOtp && <OTPModal milestone={ms} onConfirm={handleApprove} onClose={() => setShowOtp(false)} />}

      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link href={`/dashboard/project-owner/projects/${projectId}/execution`} className="flex items-center gap-2 group">
          <div className="p-2 bg-surface-container-lowest rounded-xl text-on-surface-variant/40 group-hover:text-primary transition-all">
            <ArrowLeft size={16} />
          </div>
          <span className="text-[10px] font-extrabold text-on-surface-variant/50 uppercase tracking-widest group-hover:text-on-surface transition-colors">
            Execution
          </span>
        </Link>
        <ChevronRight size={10} className="text-on-surface-variant/30" />
        <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest">Review Milestone</span>
      </div>

      {/* Toast Notifications */}
      {success && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <CheckCircle2 size={18} />
          </div>
          <span className="text-sm font-bold text-emerald-800">{success}</span>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-error/5 border border-error/20 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="w-9 h-9 rounded-xl bg-error/10 flex items-center justify-center text-error flex-shrink-0">
            <AlertCircle size={18} />
          </div>
          <span className="text-sm font-bold text-error">{error}</span>
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-[0.1em] bg-primary/8 text-primary border border-primary/20">
              Stage {ms.sequence_order ?? 1}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-[0.1em] border ${
                isSubmitted
                  ? 'bg-amber-50 text-amber-600 border-amber-200'
                  : isPaid
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                    : ms.status === 'REJECTED'
                      ? 'bg-error/8 text-error border-error/20'
                      : 'bg-surface-container text-on-surface-variant border-outline-variant/20'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isSubmitted
                    ? 'bg-amber-500 animate-pulse'
                    : isPaid
                      ? 'bg-emerald-500'
                      : ms.status === 'REJECTED'
                        ? 'bg-error'
                        : 'bg-on-surface-variant/40'
                }`}
              />
              {isSubmitted ? 'Awaiting Review' : isPaid ? 'Released' : ms.status}
            </span>
          </div>

          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary/70 mb-3 flex items-center gap-2">
            <span className="w-6 h-[2px] bg-primary" />
            Milestone Review
          </p>
          <h1 className="font-headline text-3xl md:text-4xl font-extrabold tracking-tight text-on-surface leading-tight">
            {ms.title}
          </h1>
          <p className="text-on-surface-variant font-medium mt-2 max-w-xl">{ms.description}</p>
        </div>

        <div className="text-right flex-shrink-0">
          <p className="text-[10px] font-extrabold text-on-surface-variant/60 uppercase tracking-widest mb-1">
            Stage Value
          </p>
          <p className="font-headline text-3xl font-extrabold text-on-surface tracking-tight">{fmt(ms.amount)}</p>
          {ms.submitted_at && (
            <p className="text-xs text-on-surface-variant/50 mt-1">
              Submitted {new Date(ms.submitted_at).toLocaleDateString()}
            </p>
          )}
        </div>
      </header>

      {/* Deliverables Checklist */}
      {ms.deliverables && ms.deliverables.length > 0 && (
        <div className="liquid-glass rounded-[2rem] p-8">
          <h3 className="font-headline text-lg font-extrabold text-on-surface tracking-tight mb-6 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-primary" />
            Deliverables Checklist
          </h3>
          <div className="space-y-3">
            {ms.deliverables.map((d) => (
              <div
                key={d.id}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  d.completed
                    ? 'bg-emerald-50/50 border-emerald-200/50'
                    : 'bg-surface-container-lowest border-outline-variant/20'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    d.completed ? 'bg-emerald-500 text-white' : 'bg-surface-container text-on-surface-variant/40'
                  }`}
                >
                  {d.completed ? <CheckCircle2 size={14} /> : <Clock size={12} />}
                </div>
                <span className={`flex-1 text-sm ${d.completed ? 'font-bold text-on-surface' : 'font-medium text-on-surface-variant'}`}>
                  {d.label}
                </span>
                <span
                  className={`text-[10px] font-extrabold uppercase tracking-widest ${
                    d.completed ? 'text-emerald-600' : 'text-on-surface-variant/40'
                  }`}
                >
                  {d.completed ? 'Done' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Proof of Work */}
      {ms.proof_urls && ms.proof_urls.length > 0 && (
        <div className="liquid-glass rounded-[2rem] p-8">
          <h3 className="font-headline text-lg font-extrabold text-on-surface tracking-tight mb-6 flex items-center gap-2">
            <Upload size={18} className="text-primary" />
            Proof of Work
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {ms.proof_urls.map((url, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="group aspect-[4/3] bg-surface-container-lowest border border-outline-variant/20 rounded-2xl overflow-hidden flex items-center justify-center hover:-translate-y-0.5 hover:shadow-md transition-all"
              >
                {url.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? (
                  <img src={url} alt={`Proof ${i + 1}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-primary group-hover:scale-105 transition-transform">
                    <FileText size={28} />
                    <span className="text-[10px] font-extrabold uppercase tracking-widest">View File</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <ExternalLink size={20} className="text-white drop-shadow-md" />
                </div>
              </a>
            ))}
          </div>
          {ms.proof_notes && (
            <div className="mt-6 bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/20">
              <p className="text-[10px] font-extrabold text-on-surface-variant/50 uppercase tracking-widest mb-2">
                Submission Notes
              </p>
              <p className="text-sm text-on-surface leading-relaxed">{ms.proof_notes}</p>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      {isSubmitted && !isPaid && (
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setShowOtp(true)}
            className="flex-1 h-14 cta-gradient text-white rounded-xl font-extrabold text-sm uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-lg shadow-primary/20 hover:brightness-105 active:scale-[0.98] transition-all cta-glow"
          >
            <Shield size={18} />
            Approve & Release Payment
          </button>
          <button
            onClick={handleReject}
            disabled={rejecting}
            className="h-14 px-8 bg-surface-container-lowest border-2 border-error/20 text-error rounded-xl font-extrabold text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-error/5 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={18} />
            {rejecting ? 'Rejecting…' : 'Reject'}
          </button>
          <Link
            href={`/dashboard/project-owner/projects/${projectId}/disputes/new`}
            className="h-14 px-8 border-2 border-dashed border-outline-variant/30 rounded-xl text-on-surface-variant/60 font-extrabold text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:text-error hover:border-error/30 hover:bg-error/5 transition-all"
          >
            <AlertCircle size={18} />
            Raise Dispute
          </Link>
        </div>
      )}

      {/* Payment Released Banner */}
      {isPaid && (
        <div className="liquid-glass rounded-2xl p-6 flex items-center gap-4 border border-emerald-200/50 bg-emerald-50/30">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="font-headline font-extrabold text-emerald-800 tracking-tight">
              Payment Released
            </p>
            <p className="text-xs text-emerald-700/70 mt-0.5">
              Funds have been transferred to the installer's account.
            </p>
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="liquid-glass rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center text-primary flex-shrink-0">
          <Lock size={18} />
        </div>
        <div className="flex-1">
          <p className="font-headline font-extrabold text-on-surface text-sm tracking-tight">
            OTP-Secured Release Protocol
          </p>
          <p className="text-on-surface-variant text-xs mt-0.5">
            All payment releases require OTP verification. Funds are transferred only after confirmed approval from the project owner.
          </p>
        </div>
      </div>

      {/* Attribution */}
      <p className="text-[10px] text-center text-on-surface-variant/25 font-extrabold uppercase tracking-widest">
        Stitch: e6f84760 · Milestone Review Authority
      </p>
    </div>
  );
}
