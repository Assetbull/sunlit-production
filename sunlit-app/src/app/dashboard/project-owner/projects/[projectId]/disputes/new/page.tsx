'use client';

/**
 * Dispute Center — File New Dispute
 *
 * Stitch Screen: 8e4eb1f42d8847d786d4a27d46cb4a5d
 *
 * Flow: Category → Milestone Ref → Description → Evidence → Submit
 * CRITICAL: Filing a dispute LOCKS ALL ESCROW PAYMENTS.
 *
 * Crew Isolation: ENFORCED — zero crew data exposure.
 */

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  AlertCircle,
  Shield,
  ChevronRight,
  Lock,
  FileText,
  Send,
  Upload,
} from 'lucide-react';

const DISPUTE_TYPES = [
  { id: 'QUALITY', label: 'Quality Dispute', desc: 'Work quality does not meet specifications' },
  { id: 'TIMELINE', label: 'Timeline Breach', desc: 'Installer missed agreed deadlines' },
  { id: 'FRAUD', label: 'Fraud / Misrepresentation', desc: 'Evidence or claims are falsified' },
  { id: 'INCOMPLETE', label: 'Incomplete Deliverables', desc: 'Milestone deliverables not fully completed' },
  { id: 'OTHER', label: 'Other', desc: 'Other reason not listed above' },
];

export default function DisputeNewPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const router = useRouter();

  const [disputeType, setDisputeType] = useState('');
  const [milestoneRef, setMilestoneRef] = useState('');
  const [description, setDescription] = useState('');
  const [evidence, setEvidence] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!disputeType || !description.trim()) {
      setError('Dispute type and description are required.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const r = await fetch('/api/v1/disputes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: projectId,
          dispute_type: disputeType,
          milestone_id: milestoneRef || undefined,
          description: description.trim(),
          evidence_notes: evidence.trim() || undefined,
        }),
      });
      const d = await r.json();
      if (d.success) {
        router.push(`/dashboard/project-owner/projects/${projectId}/execution`);
      } else {
        setError(d.error ?? 'Failed to file dispute.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-10 max-w-3xl mx-auto">
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
        <span className="text-[10px] font-extrabold text-error uppercase tracking-widest">File Dispute</span>
      </div>

      {/* Warning Banner */}
      <div className="bg-error/5 border border-error/20 rounded-2xl p-6 flex gap-4 items-start">
        <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center text-error flex-shrink-0">
          <Lock size={20} />
        </div>
        <div>
          <p className="font-headline font-extrabold text-error text-base mb-1">Dispute Lock Warning</p>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            Filing a dispute will <strong className="text-on-surface">immediately lock all escrow payments</strong> for this project until resolved. This includes milestone approvals and final buffer release. Only file if you have exhausted direct communication.
          </p>
        </div>
      </div>

      {/* Header */}
      <header>
        <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary/70 mb-3 flex items-center gap-2">
          <span className="w-6 h-[2px] bg-primary" />
          Secure Arbitration
        </p>
        <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface leading-tight">
          Dispute <span className="text-error">Center</span>
        </h1>
        <p className="text-on-surface-variant font-medium mt-2">
          All disputes are logged immutably and reviewed by the Sunlit arbitration team.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Dispute Type */}
        <div className="liquid-glass rounded-[2rem] p-8">
          <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant/60 mb-5 flex items-center gap-2">
            <AlertCircle size={12} /> Dispute Category
          </h3>
          <div className="flex flex-col gap-3">
            {DISPUTE_TYPES.map(dt => (
              <label
                key={dt.id}
                className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all active:scale-[0.99] ${
                  disputeType === dt.id
                    ? 'border-error/40 bg-error/5'
                    : 'border-outline-variant/30 bg-surface-container-lowest hover:border-outline-variant/50'
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  value={dt.id}
                  checked={disputeType === dt.id}
                  onChange={e => setDisputeType(e.target.value)}
                  className="w-5 h-5 accent-error flex-shrink-0"
                />
                <div>
                  <p className="font-headline font-extrabold text-on-surface text-sm tracking-tight">{dt.label}</p>
                  <p className="text-on-surface-variant text-xs mt-0.5">{dt.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Milestone Reference */}
        <div className="liquid-glass rounded-[2rem] p-8">
          <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant/60 mb-4">
            Milestone Reference <span className="text-on-surface-variant/40 font-medium normal-case">(Optional)</span>
          </h3>
          <input
            type="text"
            value={milestoneRef}
            onChange={e => setMilestoneRef(e.target.value)}
            placeholder="Milestone ID or stage name..."
            className="w-full h-12 px-4 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-error/30 focus:border-error/50 transition-all"
          />
        </div>

        {/* Description */}
        <div className="liquid-glass rounded-[2rem] p-8">
          <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant/60 mb-4">
            Dispute Description <span className="text-error">*</span>
          </h3>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={6}
            placeholder="Describe the issue in detail. Include specific dates, amounts, and what was agreed vs what was delivered..."
            className="w-full p-4 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-error/30 focus:border-error/50 transition-all resize-none leading-relaxed"
          />
          <p className="text-[10px] font-bold text-on-surface-variant/40 mt-2 text-right">
            {description.length} characters
          </p>
        </div>

        {/* Evidence */}
        <div className="liquid-glass rounded-[2rem] p-8">
          <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant/60 mb-4 flex items-center gap-2">
            <Upload size={12} /> Supporting Evidence <span className="text-on-surface-variant/40 font-medium normal-case">(Optional)</span>
          </h3>
          <textarea
            value={evidence}
            onChange={e => setEvidence(e.target.value)}
            rows={4}
            placeholder="List file URLs, contract clauses, communication timestamps, or other supporting references..."
            className="w-full p-4 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-error/30 focus:border-error/50 transition-all resize-none leading-relaxed"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-error/8 border border-error/20 rounded-xl text-error font-extrabold text-sm animate-in fade-in duration-300">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={submitting || !disputeType || !description.trim()}
            className="flex-1 h-14 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-extrabold flex items-center justify-center gap-2.5 shadow-lg shadow-error/20 hover:brightness-105 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
            ) : (
              <>
                <Shield size={18} />
                File Dispute & Lock Escrow
              </>
            )}
          </button>
          <Link
            href={`/dashboard/project-owner/projects/${projectId}/execution`}
            className="h-14 px-8 bg-surface-container-lowest border border-outline-variant/30 text-on-surface-variant rounded-xl font-extrabold flex items-center justify-center hover:border-primary/30 active:scale-95 transition-all"
          >
            Cancel
          </Link>
        </div>
      </form>

      {/* Attribution */}
      <p className="text-[10px] text-center text-on-surface-variant/25 font-extrabold uppercase tracking-widest">
        Stitch: 8e4eb1f4 · Dispute Authority
      </p>
    </div>
  );
}
