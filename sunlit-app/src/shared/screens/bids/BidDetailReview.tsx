'use client';

import {
  ArrowLeft,
  ShieldCheck,
  Shield,
  ChevronRight,
  Award,
  MapPin,
  Clock,
  Info,
  DollarSign,
  Briefcase,
  Users,
  CheckCircle2,
  Lock,
  ArrowRight,
  Star,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import type { BidDetailReviewProps } from './types';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function BidDetailReview({ bid, rfqId, bidId, onAccept, submitting, error }: BidDetailReviewProps) {
  const totalAmount = bid.amount;

  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFA]">
      {/* Contextual Header */}
      <header className="sticky top-0 w-full z-50 flex items-center justify-between px-8 h-20 bg-white/80 backdrop-blur-xl shadow-sm border-b border-[#EEF2F0]">
        <div className="flex items-center">
          <Link
            href={`/dashboard/project-owner/bids/${rfqId}`}
            className="mr-4 flex items-center justify-center w-8 h-8 rounded-full border border-[#E0E7E4] text-[#707A6C] hover:bg-[#F4F7F5] transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          </Link>
          <div className="flex items-center gap-2 text-sm font-medium tracking-tight">
            <span className="text-[#707A6C]">Bids Comparison</span>
            <ChevronRight size={14} className="text-[#BCC6C0]" />
            <span className="text-[#1A1C19] font-semibold">Proposal Details</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#A0AA9C]">Status</span>
          <span className="px-2.5 py-1 rounded bg-[#E8F3EB] text-[#0F631B] text-[11px] font-bold tracking-tight border border-[#C6E7D0]">
            PENDING REVIEW
          </span>
        </div>
      </header>

      <main className="flex-1 p-8 lg:p-12 max-w-7xl mx-auto w-full">
        {/* Bid Identity */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-[#0F631B] text-white flex items-center justify-center font-headline text-3xl font-black shadow-lg shadow-[#0F631B]/20">
              {bid.installer.charAt(0)}
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-headline font-black tracking-tight text-[#1A1C19]">{bid.installer}</h1>
                {bid.verified && <ShieldCheck size={20} className="text-[#0F631B]" fill="#C6E7D0" />}
              </div>
              <div className="flex items-center gap-4 text-sm text-[#707A6C]">
                <div className="flex items-center gap-1 font-semibold">
                  <Star size={14} className="text-amber-500" fill="currentColor" />
                  {bid.installerRating.toFixed(1)}{' '}
                  <span className="font-medium text-[#BCC6C0] ml-1">({bid.reviews} Reviews)</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-[#BCC6C0]" />
                <div className="flex items-center gap-1 font-medium italic">
                  <MapPin size={16} />
                  {bid.location}
                </div>
              </div>
              {bid.sunlitScore && (
                <div className="flex items-center gap-2 mt-2">
                  <TrendingUp size={14} className="text-[#0F631B]" />
                  <span className="text-xs font-black text-[#0F631B]">SunlitScore™ {bid.sunlitScore}/100</span>
                  <div className="w-24 h-1.5 bg-[#F4F7F5] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#0F631B] to-[#4CAF50] rounded-full"
                      style={{ width: `${bid.sunlitScore}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 md:gap-8 bg-white border border-[#EEF2F0] p-6 rounded-2xl shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#BCC6C0]">Strategic Timeline</span>
              <p className="text-xl font-black text-[#1A1C19] flex items-center gap-2">
                <Clock size={18} className="text-[#0F631B]" />
                {bid.timeline}
              </p>
            </div>
            <div className="space-y-1 border-l border-[#EEF2F0] pl-6">
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#BCC6C0]">Warranty Ledger</span>
              <p className="text-xl font-black text-[#1A1C19] flex items-center gap-2">
                <Shield size={18} className="text-[#0F631B]" />
                {bid.warranty}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-10">
            {/* Proposal Intelligence */}
            <section className="bg-white border border-[#EEF2F0] shadow-sm rounded-3xl p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F4F7F5] rounded-bl-full -mr-16 -mt-16 group-hover:w-40 group-hover:h-40 transition-all duration-700" />
              <h3 className="text-lg font-black text-[#1A1C19] mb-6 flex items-center gap-2">
                <Info size={20} className="text-[#0F631B]" />
                Proposal Intelligence
              </h3>
              <p className="text-base font-body leading-relaxed text-[#40493D] italic">
                "{bid.proposalText}"
              </p>
            </section>

            {/* Financial Architecture */}
            <section className="bg-white border border-[#EEF2F0] shadow-sm rounded-3xl p-10">
              <h3 className="text-lg font-black text-[#1A1C19] mb-8 flex items-center gap-2">
                <DollarSign size={20} className="text-[#0F631B]" />
                Financial Architecture
              </h3>
              <div className="overflow-hidden border border-[#F4F7F5] rounded-2xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F9FAFA] border-b border-[#EEF2F0]">
                      <th className="px-6 py-4 text-[10px] uppercase tracking-[0.15em] font-black text-[#707A6C]">Asset / Service</th>
                      <th className="px-6 py-4 text-[10px] uppercase tracking-[0.15em] font-black text-[#707A6C]">Type</th>
                      <th className="px-6 py-4 text-[10px] uppercase tracking-[0.15em] font-black text-[#707A6C] text-right">Allocation (₦)</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-body font-medium">
                    {bid.financials.map((row, i) => (
                      <tr key={i} className="border-b border-[#F4F7F5] last:border-0 hover:bg-[#F9FAFA] transition-colors">
                        <td className="px-6 py-4 text-[#1A1C19]">{row.item}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              row.type === 'Equipment'
                                ? 'bg-[#E3EFFF] text-[#005CAF]'
                                : row.type === 'Materials'
                                ? 'bg-[#FFF4E5] text-[#914D00]'
                                : 'bg-[#F2EFFF] text-[#5C00AF]'
                            }`}
                          >
                            {row.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-[#1A1C19]">
                          {new Intl.NumberFormat('en-NG').format(row.cost)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-[#0F631B]/5">
                      <td colSpan={2} className="px-6 py-6 text-base font-black text-[#1A1C19]">
                        Consolidated Proposal Total
                      </td>
                      <td className="px-6 py-6 text-xl font-black text-[#0F631B] text-right">
                        {formatCurrency(totalAmount)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </section>

            {/* Execution Protocol */}
            <section className="bg-[#1A1C19] rounded-[2.5rem] p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-bl-full -mr-24 -mt-24 pointer-events-none" />
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-10">
                <div className="md:col-span-4 space-y-6">
                  <div className="w-12 h-12 bg-[#0F631B] rounded-xl flex items-center justify-center">
                    <Briefcase size={24} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-headline font-black tracking-tight">Execution Protocol</h3>
                  <p className="text-sm text-[#BCC6C0] leading-relaxed">
                    Detailed deployment strategy and resource management plan for this specific architecture.
                  </p>
                </div>
                <div className="md:col-span-8 space-y-8">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-[#0F631B] mb-4">
                      Milestone Roadmap
                    </h4>
                    <p className="text-sm font-body leading-relaxed text-[#F4F7F5]">{bid.managementPlan}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#BCC6C0]">Est. Crew Force</span>
                      <p className="text-xl font-black flex items-center gap-2">
                        <Users size={20} className="text-[#0F631B]" />
                        {bid.crewSize} <span className="text-xs font-medium text-[#BCC6C0]">Members</span>
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#BCC6C0]">Historical Success</span>
                      <p className="text-xl font-black flex items-center gap-2">
                        <CheckCircle2 size={20} className="text-[#0F631B]" />
                        {bid.projectsCompleted} <span className="text-xs font-medium text-[#BCC6C0]">Projects</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Sticky Action Panel */}
          <div className="lg:col-span-4 sticky top-28">
            <div className="bg-white border-2 border-[#EEF2F0] shadow-2xl rounded-[32px] p-10">
              <div className="mb-8">
                <h3 className="text-2xl font-black text-[#1A1C19] tracking-tight mb-2">Accept Selection</h3>
                <p className="text-xs text-[#707A6C] font-medium leading-relaxed">
                  By proceeding, you agree to move this bid to the Smart Escrow funding phase. This action will lock
                  this proposal and begin contract generation.
                </p>
              </div>

              <div className="space-y-6 mb-10">
                <div className="flex justify-between items-center pb-4 border-b border-[#F4F7F5]">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#BCC6C0]">Project Total</span>
                  <span className="text-2xl font-black text-[#1A1C19]">{formatCurrency(totalAmount)}</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs font-bold text-[#40493D]">
                    <div className="w-5 h-5 rounded-full bg-[#E8F3EB] flex items-center justify-center text-[#0F631B]">
                      <Lock size={12} />
                    </div>
                    Escrow Protection Enabled
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-[#40493D]">
                    <div className="w-5 h-5 rounded-full bg-[#E8F3EB] flex items-center justify-center text-[#0F631B]">
                      <CheckCircle2 size={12} />
                    </div>
                    Verified EPC Contractor
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-[#40493D]">
                    <div className="w-5 h-5 rounded-full bg-[#E8F3EB] flex items-center justify-center text-[#0F631B]">
                      <Award size={12} />
                    </div>
                    SunlitScore™ Vetted
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-xs font-bold text-red-600 italic">{error}</p>
                </div>
              )}

              <button
                onClick={onAccept}
                disabled={submitting}
                className="w-full bg-[#1A1C19] text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[#1A1C19]/20 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing Decision...
                  </>
                ) : (
                  <>
                    Accept Proposal & Fund
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <p className="text-[10px] text-center font-black text-[#BCC6C0] uppercase tracking-[0.2em] mt-6">
                Secure Decision Node
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
