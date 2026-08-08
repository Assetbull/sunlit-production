'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Lock, 
  ChevronRight, 
  ShieldCheck, 
  Info,
  Calendar,
  DollarSign,
  Building2,
  Copy,
  CheckCircle2,
  ExternalLink,
  CreditCard,
  Wallet
} from 'lucide-react';

/**
 * Escrow Funding Screen - "The Glass Ledger"
 * Target: escrow_funding.html
 */

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
}

export default function FundPaymentPage({ params }: { params: Promise<{ milestoneId: string }> }) {
  const { milestoneId } = use(params);
  const [copied, setCopied] = useState(false);
  const [fundingSource, setFundingSource] = useState('bank'); // 'bank' or 'wallet'

  // Mock data matching escrow_funding.html
  const milestone = {
    id: milestoneId,
    title: 'Installation & Wiring Milestone',
    amount: 840000,
    projectId: 'PRJ-2023-8894',
    projectTitle: 'Lagos Residential 5kW Solar',
    installer: 'Luminous Solar Systems Ltd.',
    dueDate: 'Oct 24, 2023',
    accountNumber: '9984712032',
    bankName: 'Titan Trust Bank (Paystack)',
    accountName: 'Sunlit Payment Matrix - PRJ-8894'
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(milestone.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFA]">
      {/* Transactional Header */}
      <header className="sticky top-0 w-full z-50 flex items-center justify-between px-8 h-20 bg-white/80 backdrop-blur-xl shadow-sm border-b border-[#EEF2F0]">
        <div className="flex items-center">
          <Link href={`/dashboard/project-owner/projects/${milestone.projectId}`} className="mr-4 flex items-center justify-center w-8 h-8 rounded-full border border-[#E0E7E4] text-[#707A6C] hover:bg-[#F4F7F5] transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          </Link>
          <div className="flex items-center gap-2 text-sm font-medium tracking-tight">
            <span className="text-[#707A6C]">Escrow Management</span>
            <ChevronRight size={14} className="text-[#BCC6C0]" />
            <span className="text-[#1A1C19] font-semibold">Secure Funding</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#0F631B]">Secured by Paystack</span>
          <div className="w-8 h-8 rounded-full bg-[#E8F3EB] flex items-center justify-center text-[#0F631B]">
            <Lock size={14} />
          </div>
        </div>
      </header>

      <main className="flex-1 p-8 lg:p-12 max-w-7xl mx-auto w-full">
        <div className="mb-10 space-y-2">
          <h1 className="text-4xl font-headline font-black tracking-tight text-[#1A1C19]">Initiate Secure Funding</h1>
          <p className="text-sm font-medium text-[#707A6C]">Confirm milestone details and execute funding into the project ledger.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Financial Details */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Project Context */}
              <section className="bg-white border border-[#EEF2F0] shadow-sm rounded-3xl p-8 space-y-6">
                <h3 className="text-xs uppercase tracking-[0.2em] font-black text-[#BCC6C0] border-b border-[#F4F7F5] pb-4">Project Context</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                     <div className="w-10 h-10 rounded-xl bg-[#F4F7F5] flex items-center justify-center text-[#0F631B]">
                        <Building2 size={20} />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-[#BCC6C0] uppercase tracking-wider mb-0.5">Deployment</p>
                        <p className="text-sm font-black text-[#1A1C19]">{milestone.projectTitle}</p>
                     </div>
                  </div>
                  <div className="flex items-start gap-4">
                     <div className="w-10 h-10 rounded-xl bg-[#F4F7F5] flex items-center justify-center text-[#0F631B]">
                        <ShieldCheck size={20} />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-[#BCC6C0] uppercase tracking-wider mb-0.5">EPC Contractor</p>
                        <p className="text-sm font-black text-[#1A1C19]">{milestone.installer}</p>
                     </div>
                  </div>
                </div>
              </section>

              {/* Financial Summary */}
              <section className="bg-[#1A1C19] text-white rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -mr-16 -mt-16 pointer-events-none" />
                <h3 className="text-xs uppercase tracking-[0.2em] font-black text-[#0F631B] border-b border-white/5 pb-4 mb-6 relative z-10">Financial Summary</h3>
                <div className="space-y-6 relative z-10">
                   <div>
                      <p className="text-[10px] font-black text-[#BCC6C0] uppercase tracking-wider mb-1">Milestone Value</p>
                      <p className="text-3xl font-black text-white">{formatCurrency(milestone.amount)}</p>
                   </div>
                   <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-[#C6E7D0]">
                        <Calendar size={14} />
                        Due {milestone.dueDate}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-[#C6E7D0]">
                        <DollarSign size={14} />
                        ID: {milestone.id}
                      </div>
                   </div>
                </div>
              </section>
            </div>

            {/* Funding Source Selection */}
            <section className="bg-white border border-[#EEF2F0] shadow-sm rounded-3xl p-10 overflow-hidden">
               <h3 className="text-lg font-black text-[#1A1C19] mb-8 flex items-center gap-2">
                 <Wallet size={20} className="text-[#0F631B]" />
                 Select Funding Source
               </h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button 
                    onClick={() => setFundingSource('bank')}
                    className={`flex flex-col items-start p-6 rounded-2xl border-2 transition-all text-left ${
                      fundingSource === 'bank' ? 'border-[#0F631B] bg-[#E8F3EB]/30' : 'border-[#F4F7F5] hover:border-[#EEF2F0]'
                    }`}
                  >
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                       fundingSource === 'bank' ? 'bg-[#0F631B] text-white' : 'bg-[#F4F7F5] text-[#707A6C]'
                     }`}>
                        <Building2 size={20} />
                     </div>
                     <p className="text-sm font-black text-[#1A1C19] mb-1">Direct Bank Transfer</p>
                     <p className="text-[10px] font-medium text-[#707A6C] leading-relaxed">Fund via unique Virtual Account provided by Paystack.</p>
                  </button>

                  <button 
                    onClick={() => setFundingSource('wallet')}
                    className={`flex flex-col items-start p-6 rounded-2xl border-2 transition-all text-left group ${
                      fundingSource === 'wallet' ? 'border-[#0F631B] bg-[#E8F3EB]/30' : 'border-[#F4F7F5] opacity-50 cursor-not-allowed'
                    }`}
                    disabled
                  >
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                       fundingSource === 'wallet' ? 'bg-[#0F631B] text-white' : 'bg-[#F4F7F5] text-[#707A6C]'
                     }`}>
                        <CreditCard size={20} />
                     </div>
                     <p className="text-sm font-black text-[#1A1C19] mb-1">Ledger Wallet</p>
                     <p className="text-[10px] font-medium text-[#707A6C] leading-relaxed">Pay using available balance in your Sunlit wallet. (Coming Soon)</p>
                  </button>
               </div>

               {fundingSource === 'bank' && (
                 <div className="mt-10 p-10 bg-[#F9FAFA] border border-[#EEF2F0] rounded-2xl animate-in fade-in slide-in-from-top-2 duration-500">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-8 pb-8 border-b border-[#EEF2F0]">
                       <div>
                          <p className="text-[10px] font-black text-[#BCC6C0] uppercase tracking-wider mb-2">Virtual Account Number</p>
                          <div className="flex items-center gap-4">
                             <span className="text-4xl font-black text-[#1A1C19] tracking-tight">{milestone.accountNumber}</span>
                             <button 
                               onClick={handleCopy}
                               className="p-2 rounded-lg border border-[#E0E7E4] text-[#707A6C] hover:bg-white hover:text-[#0F631B] transition-all"
                             >
                                {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                             </button>
                          </div>
                       </div>
                       <div className="text-right md:text-left">
                          <p className="text-[10px] font-black text-[#BCC6C0] uppercase tracking-wider mb-2">Account Bank</p>
                          <p className="text-lg font-black text-[#1A1C19]">{milestone.bankName}</p>
                       </div>
                    </div>
                    
                    <div className="space-y-4">
                       <div className="flex justify-between items-center text-sm">
                          <span className="font-medium text-[#707A6C]">Account Beneficiary</span>
                          <span className="font-black text-[#1A1C19]">{milestone.accountName}</span>
                       </div>
                       <div className="flex justify-between items-center text-sm">
                          <span className="font-medium text-[#707A6C]">Milestone Valuation</span>
                          <span className="font-black text-[#1A1C19]">{formatCurrency(milestone.amount)}</span>
                       </div>
                    </div>
                 </div>
               )}
            </section>
          </div>

          {/* Right: Sticky Action Panel */}
          <div className="lg:col-span-4 sticky top-28">
             <div className="bg-white border-2 border-[#EEF2F0] shadow-2xl rounded-[32px] p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#0F631B]/5 rounded-bl-full -mr-12 -mt-12" />
                <h3 className="text-2xl font-black text-[#1A1C19] tracking-tight mb-6">Escrow Confirmation</h3>
                
                <div className="space-y-6 mb-10">
                   <div className="p-4 bg-[#E8F3EB] rounded-2xl flex items-start gap-4">
                      <div className="mt-1 text-[#0F631B]">
                         <Info size={18} />
                      </div>
                      <p className="text-xs font-bold text-[#0F631B] leading-relaxed italic">
                        Once transferred, funds will be verified within 2-5 minutes. Payment will only be released to the EPC Contractor after your final approval.
                      </p>
                   </div>
                   
                   <div className="space-y-4 pt-4 border-t border-[#F4F7F5]">
                      <div className="flex items-center gap-3 text-xs font-bold text-[#40493D]">
                         <div className="w-5 h-5 rounded-full bg-[#E8F3EB] flex items-center justify-center text-[#0F631B]">
                            <Lock size={12} />
                         </div>
                         Smart Escrow Protection
                      </div>
                      <div className="flex items-center gap-3 text-xs font-bold text-[#40493D]">
                         <div className="w-5 h-5 rounded-full bg-[#E8F3EB] flex items-center justify-center text-[#0F631B]">
                            <ExternalLink size={12} />
                         </div>
                         Real-time Webhook Audit
                      </div>
                   </div>
                </div>

                <button 
                  className="w-full bg-[#1A1C19] text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[#1A1C19]/20"
                  onClick={() => alert('Simulating Secure Handshake... Webhook audit initiated. Milestone funding will reflect in 120s.')}
                >
                  I have made this transfer
                  <ChevronRight size={18} />
                </button>

                <p className="text-[10px] text-center font-black text-[#BCC6C0] uppercase tracking-[0.2em] mt-8">Cryptographically Secured Node</p>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
