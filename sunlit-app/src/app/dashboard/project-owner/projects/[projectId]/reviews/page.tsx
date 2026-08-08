'use client';

/**
 * Project Completion — Review & Handover
 *
 * Stitch Screen: b5c157ad47174690aaef7c9751b0e42b
 * "Project Completion | Review & Handover"
 *
 * Flow:
 *   FINAL MILESTONE COMPLETE → OWNER REVIEW → HANDOVER
 *   → FINAL PAYMENT → REVIEW & RATING → PROJECT CLOSED
 *
 * Crew Isolation: ENFORCED — zero crew data exposure.
 */

import { useState, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Star,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Award,
  MessageSquare,
  ThumbsUp,
  Send,
} from 'lucide-react';
import { submitReview } from '@/dashboards/project-owner/services/project-owner-api';

export default function ReviewCompletionPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSubmitting(true);
    const res = await submitReview(projectId, rating, comment);
    setSubmitting(false);
    if (res.success) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-8">
          <Award size={48} className="text-primary" />
        </div>
        <h1 className="font-headline text-4xl font-extrabold text-on-surface tracking-tight mb-4">
          Project <span className="text-primary">Completed</span>
        </h1>
        <p className="text-on-surface-variant font-medium max-w-md mb-4">
          Thank you for your review! Your project has been officially closed and the final buffer will be released to the installer.
        </p>
        <div className="flex items-center gap-1 mb-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              size={28}
              className={i <= rating ? 'text-amber-400' : 'text-surface-container-high'}
              fill={i <= rating ? 'currentColor' : 'none'}
            />
          ))}
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/project-owner"
            className="h-12 px-6 cta-gradient text-white rounded-xl font-extrabold flex items-center gap-2 shadow-lg shadow-primary/20 hover:brightness-105 active:scale-95 transition-all"
          >
            <ShieldCheck size={16} />
            Return to Dashboard
          </Link>
          <Link
            href="/dashboard/project-owner/projects"
            className="h-12 px-6 bg-surface-container-lowest border border-outline-variant/30 text-on-surface rounded-xl font-extrabold flex items-center gap-2 hover:border-primary/30 active:scale-95 transition-all"
          >
            View All Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-10 max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link href={`/dashboard/project-owner/projects/${projectId}`} className="flex items-center gap-2 group">
          <div className="p-2 bg-surface-container-lowest rounded-xl text-on-surface-variant/40 group-hover:text-primary transition-all">
            <ArrowLeft size={16} />
          </div>
          <span className="text-[10px] font-extrabold text-on-surface-variant/50 uppercase tracking-widest group-hover:text-on-surface transition-colors">
            Project
          </span>
        </Link>
        <ChevronRight size={10} className="text-on-surface-variant/30" />
        <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest">Review & Handover</span>
      </div>

      {/* Header */}
      <header>
        <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary/70 mb-3 flex items-center gap-2">
          <span className="w-6 h-[2px] bg-primary" />
          Project Handover
        </p>
        <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface leading-tight">
          Rate Your <span className="text-primary">Experience</span>
        </h1>
        <p className="text-on-surface-variant font-medium mt-2 max-w-xl">
          Your project is complete. Rate the installer and leave feedback to help the community.
        </p>
      </header>

      {/* Completion Checklist */}
      <div className="liquid-glass rounded-[2rem] p-8">
        <h3 className="font-headline text-lg font-extrabold text-on-surface tracking-tight mb-6">
          Completion Checklist
        </h3>
        <div className="space-y-4">
          {[
            'All milestones approved',
            'Proof of work verified',
            'Final inspection complete',
            'System tested and commissioned',
            'Warranty documentation received',
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center text-primary">
                <CheckCircle2 size={16} />
              </div>
              <span className="text-sm font-bold text-on-surface">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className="liquid-glass rounded-[2rem] p-8">
        <h3 className="font-headline text-lg font-extrabold text-on-surface tracking-tight mb-2">
          Rate the Installer
        </h3>
        <p className="text-on-surface-variant text-sm mb-6">
          How would you rate the overall installation experience?
        </p>

        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              onMouseEnter={() => setHoverRating(i)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(i)}
              className="transition-transform hover:scale-110 active:scale-95"
              aria-label={`Rate ${i} star${i !== 1 ? 's' : ''}`}
            >
              <Star
                size={40}
                className={`transition-colors ${
                  i <= (hoverRating || rating) ? 'text-amber-400' : 'text-surface-container-high'
                }`}
                fill={i <= (hoverRating || rating) ? 'currentColor' : 'none'}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-3 text-lg font-extrabold text-on-surface">
              {rating}/5
            </span>
          )}
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-extrabold text-on-surface-variant/60 uppercase tracking-widest">
            Your Feedback
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this installer..."
            className="w-full h-32 p-4 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleSubmit}
          disabled={rating === 0 || submitting}
          className="flex-1 h-14 cta-gradient text-white rounded-xl font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:brightness-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cta-glow"
        >
          {submitting ? (
            <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
          ) : (
            <>
              <Send size={18} />
              Submit Review & Close Project
            </>
          )}
        </button>
        <Link
          href={`/dashboard/project-owner/projects/${projectId}`}
          className="h-14 px-6 bg-surface-container-lowest border border-outline-variant/30 text-on-surface rounded-xl font-extrabold flex items-center justify-center gap-2 hover:border-primary/30 active:scale-95 transition-all"
        >
          Skip for Now
        </Link>
      </div>

      {/* Attribution */}
      <p className="text-[10px] text-center text-on-surface-variant/25 font-extrabold uppercase tracking-widest">
        Stitch: b5c157ad · Project Completion Authority
      </p>
    </div>
  );
}
