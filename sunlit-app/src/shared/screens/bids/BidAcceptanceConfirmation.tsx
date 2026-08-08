'use client';

import { CheckCircle2, ArrowRight, Lock, Shield, Zap, Star } from 'lucide-react';
import Link from 'next/link';

interface BidAcceptanceConfirmationProps {
  installerName: string;
  amount: number;
  projectId: string;
  rfqId: string;
  /** Contract ID returned by POST /api/v1/contracts. Routes user to signing step. */
  contractId?: string;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function BidAcceptanceConfirmation({
  installerName,
  amount,
  projectId,
  rfqId,
  contractId,
}: BidAcceptanceConfirmationProps) {
  // Route to contract signing if contractId is available, otherwise escrow funding
  const nextHref = contractId
    ? `/dashboard/project-owner/contracts/${contractId}/sign`
    : `/dashboard/project-owner/projects/${projectId}/escrow-funding`;
  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFA] items-center justify-center px-6">
      {/* Confetti glow ring */}
      <div className="relative flex items-center justify-center mb-10">
        <div className="absolute w-40 h-40 rounded-full bg-[#0F631B]/10 animate-ping" style={{ animationDuration: '2s' }} />
        <div className="absolute w-32 h-32 rounded-full bg-[#0F631B]/15 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.3s' }} />
        <div className="relative w-24 h-24 rounded-full bg-[#0F631B] text-white flex items-center justify-center shadow-2xl shadow-[#0F631B]/30">
          <CheckCircle2 size={44} strokeWidth={2.5} />
        </div>
      </div>

      {/* Confirmation Text */}
      <div className="text-center max-w-lg mb-12 space-y-3">
        <p className="text-[11px] font-black text-[#0F631B] uppercase tracking-[0.3em]">
          Handshake Complete
        </p>
        <h1 className="text-4xl font-headline font-black tracking-tight text-[#1A1C19]">
          Bid Accepted
        </h1>
        <p className="text-base font-medium text-[#707A6C] leading-relaxed">
          You've selected <span className="font-black text-[#1A1C19]">{installerName}</span> as your installation
          partner. Your project is now moving to Smart Escrow funding.
        </p>
      </div>

      {/* Stats Card */}
      <div className="bg-white border border-[#EEF2F0] rounded-[32px] shadow-xl p-10 w-full max-w-md mb-10 space-y-6">
        <div className="flex justify-between items-center pb-5 border-b border-[#F4F7F5]">
          <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#BCC6C0]">
            Proposal Value
          </span>
          <span className="text-2xl font-black text-[#1A1C19]">{formatCurrency(amount)}</span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#E8F3EB] flex items-center justify-center text-[#0F631B]">
              <Lock size={16} />
            </div>
            <div>
              <p className="text-xs font-black text-[#1A1C19]">Smart Escrow Activated</p>
              <p className="text-[10px] font-medium text-[#A0AA9C]">Funds held securely until milestones are verified</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#E8F3EB] flex items-center justify-center text-[#0F631B]">
              <Shield size={16} />
            </div>
            <div>
              <p className="text-xs font-black text-[#1A1C19]">Dispute Protection On</p>
              <p className="text-[10px] font-medium text-[#A0AA9C]">Raise a dispute at any milestone if issues arise</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#E8F3EB] flex items-center justify-center text-[#0F631B]">
              <Star size={16} />
            </div>
            <div>
              <p className="text-xs font-black text-[#1A1C19]">Contract Ready to Sign</p>
              <p className="text-[10px] font-medium text-[#A0AA9C]">Your project contract has been generated and awaits signature</p>
            </div>
          </div>
        </div>
      </div>

      {/* Next Step — State Machine: CONTRACT_CREATED → CONTRACT_SIGNED → PAYMENT_FUNDED */}
      <div className="w-full max-w-md space-y-4">
        <Link
          href={nextHref}
          className="w-full bg-[#1A1C19] text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[#1A1C19]/20"
        >
          {contractId ? (
            <>
              <Star size={20} />
              Review &amp; Sign Contract
              <ArrowRight size={18} />
            </>
          ) : (
            <>
              <Zap size={20} />
              Fund Escrow Now
              <ArrowRight size={18} />
            </>
          )}
        </Link>
        <Link
          href="/dashboard/project-owner"
          className="w-full bg-white border border-[#EEF2F0] text-[#707A6C] font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#F4F7F5] transition-all text-sm"
        >
          Return to Command Center
        </Link>
      </div>

      <p className="text-[10px] text-center font-black text-[#BCC6C0] uppercase tracking-[0.2em] mt-8">
        Sunlit Secure Network · Escrow Authority Active
      </p>
    </div>
  );
}
