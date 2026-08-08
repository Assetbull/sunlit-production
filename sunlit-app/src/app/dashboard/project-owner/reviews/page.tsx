'use client';

/**
 * Reviews & Ratings Hub
 *
 * Stitch Screen: b5c157ad47174690aaef7c9751b0e42b
 *
 * Shows submitted reviews and pending review prompts.
 * Connected to fetchSubmittedReviews() and fetchPendingReviews().
 *
 * Crew Isolation: ENFORCED — zero crew data exposure.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Star,
  Clock,
  CheckCircle2,
  ChevronRight,
  MessageSquare,
  Award,
  Plus,
} from 'lucide-react';
import {
  fetchSubmittedReviews,
  fetchPendingReviews,
} from '@/dashboards/project-owner/services/project-owner-api';

interface SubmittedReview {
  id: string;
  installer: string;
  project: string;
  avatar: string;
  rating: number;
  date: string;
  review: string;
  tags: string[];
  status: string;
}

interface PendingReview {
  id: string;
  projectId: string;
  installer: string;
  project: string;
  avatar: string;
}

function Stars({ count, size = 14 }: { count: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={size}
          className={i <= count ? 'fill-amber-400 text-amber-400' : 'text-surface-container-high'}
        />
      ))}
    </div>
  );
}

function ReviewsSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-4 w-32 bg-surface-container rounded-full" />
      <div className="h-12 w-72 bg-surface-container-high rounded-2xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-56 bg-surface-container-lowest rounded-[1.75rem]" />
        ))}
      </div>
    </div>
  );
}

export default function ReviewsPage() {
  const [submitted, setSubmitted] = useState<SubmittedReview[]>([]);
  const [pending, setPending] = useState<PendingReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchSubmittedReviews(), fetchPendingReviews()])
      .then(([subRes, penRes]) => {
        if (subRes.success && subRes.data) setSubmitted(subRes.data as SubmittedReview[]);
        if (penRes.success && penRes.data) setPending(penRes.data as PendingReview[]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ReviewsSkeleton />;

  const avgRating =
    submitted.length > 0
      ? (submitted.reduce((s, r) => s + r.rating, 0) / submitted.length).toFixed(1)
      : '—';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-10">
      {/* Header */}
      <header>
        <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary/70 mb-3 flex items-center gap-2">
          <span className="w-6 h-[2px] bg-primary" />
          Quality Trust
        </p>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface leading-tight">
              Reviews &amp; <span className="text-primary">Ratings</span>
            </h1>
            <p className="text-on-surface-variant font-medium mt-2 max-w-xl">
              Your feedback builds trust. Rate your installers after every project completion.
            </p>
          </div>
        </div>
      </header>

      {/* Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            label: 'Average Rating',
            value: avgRating,
            icon: Star,
            accent: 'text-amber-500',
            bg: 'bg-amber-50',
          },
          {
            label: 'Total Reviews',
            value: String(submitted.length),
            icon: MessageSquare,
            accent: 'text-primary',
            bg: 'bg-primary/8',
          },
          {
            label: 'Pending Reviews',
            value: String(pending.length),
            icon: Clock,
            accent: 'text-amber-600',
            bg: 'bg-amber-50',
          },
          {
            label: 'Trust Score',
            value: submitted.length > 0 ? 'Active' : 'New',
            icon: Award,
            accent: 'text-emerald-600',
            bg: 'bg-emerald-50',
          },
        ].map(kpi => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="liquid-glass rounded-[1.75rem] p-6 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-extrabold text-on-surface-variant/60 uppercase tracking-widest">{kpi.label}</p>
                <div className={`w-9 h-9 rounded-xl ${kpi.bg} flex items-center justify-center ${kpi.accent}`}>
                  <Icon size={18} />
                </div>
              </div>
              <p className={`font-headline text-2xl font-extrabold tracking-tight ${kpi.accent}`}>{kpi.value}</p>
            </div>
          );
        })}
      </div>

      {/* Pending Reviews */}
      {pending.length > 0 && (
        <section>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant/60 mb-5 flex items-center gap-2">
            <Clock size={12} className="text-amber-600" /> Awaiting Your Review
          </p>
          <div className="space-y-3">
            {pending.map(p => (
              <div
                key={p.id}
                className="liquid-glass rounded-[1.75rem] p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 ring-1 ring-amber-200 shadow-md"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center font-extrabold text-amber-600 tracking-tight text-sm flex-shrink-0">
                  {p.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-headline text-base font-extrabold text-on-surface tracking-tight">{p.installer}</h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">{p.project}</p>
                </div>
                <Link
                  href={`/dashboard/project-owner/projects/${p.projectId}/reviews`}
                  className="h-11 px-5 cta-gradient text-white rounded-xl font-extrabold text-xs flex items-center gap-2 shadow-md shadow-primary/15 hover:brightness-105 active:scale-95 transition-all flex-shrink-0"
                >
                  Write Review <ChevronRight size={12} />
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Submitted Reviews */}
      <section>
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant/60 mb-5 flex items-center gap-2">
          <CheckCircle2 size={12} className="text-primary" /> Your Reviews
        </p>

        {submitted.length === 0 ? (
          <div className="border-2 border-dashed border-outline-variant/30 rounded-[2rem] py-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center text-on-surface-variant/30 mb-6">
              <MessageSquare size={36} />
            </div>
            <h3 className="font-headline text-2xl font-extrabold text-on-surface tracking-tight mb-2">No Reviews Yet</h3>
            <p className="text-on-surface-variant font-medium max-w-sm">
              Complete your first project to leave a review and build community trust.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {submitted.map(rv => (
              <div
                key={rv.id}
                className="liquid-glass rounded-[1.75rem] p-7 flex flex-col gap-5 hover:-translate-y-0.5 transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/8 flex items-center justify-center font-extrabold text-primary tracking-tight text-sm flex-shrink-0">
                      {rv.avatar}
                    </div>
                    <div>
                      <h4 className="font-headline text-base font-extrabold text-on-surface tracking-tight">{rv.installer}</h4>
                      <p className="text-xs text-on-surface-variant mt-0.5">{rv.project}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-primary/8 text-primary">
                    <CheckCircle2 size={10} /> Submitted
                  </span>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-3">
                  <Stars count={rv.rating} size={16} />
                  <span className="font-headline text-sm font-extrabold text-on-surface">{rv.rating}.0</span>
                  <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest">{rv.date}</span>
                </div>

                {/* Review Text */}
                <p className="text-sm text-on-surface-variant leading-relaxed">{rv.review}</p>

                {/* Tags */}
                {rv.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {rv.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-surface-container text-on-surface-variant border border-outline-variant/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Attribution */}
      <p className="text-[10px] text-center text-on-surface-variant/25 font-extrabold uppercase tracking-widest">
        Stitch: b5c157ad · Reviews & Trust Authority
      </p>
    </div>
  );
}
