'use client';

import { use } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  HardHat,
  Star,
} from 'lucide-react';

export default function ReviewCreationPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <div className="max-w-6xl mx-auto px-6 py-8 md:py-12">
        <header className="mb-10 flex flex-col gap-6">
          <Link href={`/dashboard/project-owner/projects/${projectId}`} className="inline-flex items-center gap-2 text-muted hover:text-primary transition-colors font-medium text-sm w-fit group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Project
          </Link>
          <div>
            <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-on-surface mb-2">Project Feedback</h1>
            <p className="text-lg text-muted">Rate your experience with the recent installation to help update the SunlitScore™.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="bg-surface-1 border border-surface-3 rounded-xl p-6 shadow-sm flex-1">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
                  <HardHat className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-headline text-xl font-bold text-on-surface">Installer Details</h3>
                  <p className="font-label text-xs font-bold text-muted mt-1 uppercase tracking-wider">Certified Partner</p>
                </div>
              </div>
              <div className="space-y-4 border-t border-surface-3 pt-6">
                <div className="flex justify-between items-center">
                  <span className="font-body text-sm text-muted">Company</span>
                  <span className="font-body text-base font-semibold text-on-surface">Apex Solar Grid</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-body text-sm text-muted">Project ID</span>
                  <span className="font-mono text-sm text-primary font-bold">#{projectId.slice(0, 8)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-body text-sm text-muted">Completion</span>
                  <span className="font-body text-base text-on-surface">Oct 12, 2026</span>
                </div>
              </div>
              <div className="mt-8 p-4 bg-surface-2 rounded-lg border border-surface-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-label text-xs font-bold text-muted uppercase tracking-wider">Current SunlitScore™</span>
                  <span className="font-mono text-sm text-primary font-bold">94/100</span>
                </div>
                <div className="w-full bg-surface-3 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '94%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 bg-surface-1 border border-surface-3 rounded-xl p-8 shadow-sm">
            <form className="space-y-12">
              <div className="space-y-6">
                {/* Technical Quality */}
                <div className="bg-surface rounded-lg p-5 border border-surface-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <label className="font-headline text-lg font-bold text-on-surface block mb-1">Technical Quality</label>
                      <p className="font-body text-sm text-muted">Equipment handling, mounting precision, and wiring standards.</p>
                    </div>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" className="text-surface-3 hover:text-amber-400 transition-colors focus:outline-none">
                          <Star className={`w-8 h-8 ${star <= 4 ? 'text-amber-400 fill-amber-400' : ''}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Timeline Adherence */}
                <div className="bg-surface rounded-lg p-5 border border-surface-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <label className="font-headline text-lg font-bold text-on-surface block mb-1">Timeline Adherence</label>
                      <p className="font-body text-sm text-muted">Meeting milestones and overall project completion date.</p>
                    </div>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" className="text-surface-3 hover:text-amber-400 transition-colors focus:outline-none">
                          <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Communication */}
                <div className="bg-surface rounded-lg p-5 border border-surface-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <label className="font-headline text-lg font-bold text-on-surface block mb-1">Communication</label>
                      <p className="font-body text-sm text-muted">Responsiveness, clarity, and professionalism during the process.</p>
                    </div>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" className="text-surface-3 hover:text-amber-400 transition-colors focus:outline-none">
                          <Star className={`w-8 h-8 ${star <= 3 ? 'text-amber-400 fill-amber-400' : ''}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-label text-xs font-bold text-muted uppercase tracking-wider block mb-3">Detailed Ledger Notes (Optional)</label>
                <textarea 
                  className="w-full bg-surface-2/50 border border-surface-3 rounded-lg p-4 font-body text-base text-on-surface focus:bg-surface-1 focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-none placeholder:text-muted/50" 
                  placeholder="Provide specific operational feedback..." 
                  rows={4}
                ></textarea>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-surface-3">
                <button type="button" className="px-6 h-12 flex items-center justify-center font-label text-sm font-bold uppercase text-on-surface bg-surface-2 hover:bg-surface-3 border border-surface-3 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="button" className="px-6 h-12 flex items-center justify-center font-label text-sm font-bold uppercase text-white bg-primary hover:bg-primary-container rounded-lg transition-colors shadow-md hover:shadow-lg">
                  Submit to Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
