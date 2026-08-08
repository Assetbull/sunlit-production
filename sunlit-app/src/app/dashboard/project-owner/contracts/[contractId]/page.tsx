'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  FileSignature,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  FileText,
  UserCheck,
  Banknote,
  Download,
  Eye,
  Activity,
  ChevronRight,
  Shield
} from 'lucide-react';
import { fetchContract } from '@/dashboards/project-owner/services/project-owner-api';
import type { ContractView, ContractStatus } from '@/dashboards/project-owner/types/dashboard';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', { 
    style: 'currency', 
    currency: 'NGN', 
    maximumFractionDigits: 0 
  }).format(amount);
}

const statusMap: Record<ContractStatus, { label: string, color: string, bg: string, icon: any }> = {
  pending_signatures: { label: 'Awaiting Signatures', color: '#F5A623', bg: 'rgba(245,166,35,0.08)', icon: FileSignature },
  signed: { label: 'Fully Signed', color: '#00C2A8', bg: 'rgba(0,194,168,0.08)', icon: CheckCircle2 },
  active: { label: 'In Execution', color: '#3B82F6', bg: 'rgba(59,130,246,0.08)', icon: Clock },
  completed: { label: 'Completed', color: '#10B981', bg: 'rgba(16,185,129,0.08)', icon: ShieldCheck },
  disputed: { label: 'Disputed', color: '#EF4444', bg: 'rgba(239,68,68,0.08)', icon: AlertCircle },
};

export default function ContractDetailPage({ params }: { params: Promise<{ contractId: string }> }) {
  const { contractId } = use(params);
  const router = useRouter();
  
  const [contract, setContract] = useState<ContractView | null>(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetchContract(contractId);
      if (res.success && res.data) {
        setContract(res.data);
      }
      setLoading(false);
    }
    load();
  }, [contractId]);

  const handleSign = async () => {
    setSigning(true);
    // Simulate API call for signing
    setTimeout(() => {
      if (contract) {
        setContract({
          ...contract,
          signatures: {
            ...contract.signatures,
            ownerSigned: true,
            ownerSignedAt: new Date().toISOString()
          },
          status: contract.signatures.installerSigned ? 'signed' : 'pending_signatures'
        });
      }
      setSigning(false);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="skeleton h-12 w-1/3 rounded-[12px] mb-8" />
        <div className="flex flex-col lg:flex-row gap-8">
           <div className="skeleton h-[600px] flex-grow rounded-[32px]" />
           <div className="skeleton h-[400px] w-full lg:w-[400px] rounded-[32px]" />
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
         <div className="w-20 h-20 bg-slate-100 text-slate-300 rounded-3xl flex items-center justify-center mb-6">
           <AlertCircle size={32} />
         </div>
         <h2 className="text-2xl font-black text-slate-900 mb-2">Contract Not Found</h2>
         <p className="text-slate-500 max-w-md text-center">We could not locate this contract in your vault. It may have been archived or access is restricted.</p>
         <Link href="/dashboard/project-owner/contracts" className="mt-8 px-6 py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all">
           Return to Vault
         </Link>
      </div>
    );
  }

  const statusConfig = statusMap[contract.status];
  const StatusIcon = statusConfig.icon;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/dashboard/project-owner/contracts" className="flex items-center gap-2 group">
             <div className="p-2 bg-white rounded-xl shadow-sm text-slate-400 group-hover:text-primary transition-all group-hover:scale-110">
               <ArrowLeft size={16} />
             </div>
             <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest group-hover:text-slate-900 transition-colors">Contract Vault</span>
          </Link>
          <ChevronRight size={10} className="text-slate-300" />
          <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest">Master Agreement</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
           <div>
             <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                  {contract.id.slice(0, 13).toUpperCase()}
                </span>
                <span className="text-slate-300 text-xs px-2">•</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Created {new Date(contract.createdAt).toLocaleDateString()}
                </span>
             </div>
             <h1 className="text-3xl md:text-5xl font-black font-headline text-slate-900 tracking-tighter">
               {contract.projectTitle}
             </h1>
           </div>
           
           <div 
             className="flex items-center gap-3 px-5 py-3 rounded-2xl w-fit"
             style={{ backgroundColor: statusConfig.bg, color: statusConfig.color }}
           >
              <StatusIcon size={20} />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest leading-none opacity-80 mb-0.5">Authority Status</span>
                <span className="text-xs font-black uppercase tracking-widest leading-none">
                  {statusConfig.label}
                </span>
              </div>
           </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
         {/* Main Contract Body */}
         <div className="flex-grow space-y-8">
            {/* Parties */}
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-100">
               <div className="flex-1 md:pr-8">
                  <div className="flex items-center gap-2 text-slate-400 mb-6">
                    <UserCheck size={18} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Principal (You)</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-1">Project Owner</h3>
                  <div className="flex items-center gap-2 mt-4 text-[10px] uppercase font-bold tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Identity Verified
                  </div>
               </div>
               
               <div className="flex-1 md:pl-8 pt-8 md:pt-0">
                  <div className="flex items-center gap-2 text-primary mb-6">
                    <Shield size={18} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Executer</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-1">{contract.installerName}</h3>
                  <div className="flex items-center gap-2 mt-4 text-[10px] uppercase font-bold tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Sunlit Certified Installer
                  </div>
               </div>
            </div>

            {/* Contract Terms Summary */}
            <div className="bg-white p-10 rounded-[32px] border border-slate-200 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" />
               <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest mb-8 relative z-10">Smart Contract Terms</h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                 <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Valuation</span>
                    <p className="text-4xl font-black font-headline text-slate-900 mt-2 flex items-center gap-3">
                      {formatCurrency(contract.totalAmount)}
                    </p>
                 </div>
                 
                 <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Settlement Protocol</span>
                    <div className="mt-3 flex items-center gap-3 px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl w-fit">
                      <Banknote size={16} className="text-primary" />
                      <span className="text-xs font-bold text-slate-700">Sunlit Milestone Payment Control</span>
                    </div>
                 </div>
               </div>

               <div className="mt-10 pt-8 border-t border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Milestone Schedule</span>
                  <div className="space-y-4">
                     {contract.milestones.map((ms, i) => (
                        <div key={ms.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl gap-4">
                           <div className="flex items-center gap-4">
                             <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-[10px] font-black text-slate-600">
                               0{i + 1}
                             </div>
                             <div>
                               <p className="text-sm font-black text-slate-900">{ms.title}</p>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Weight: {((ms.amount / contract.totalAmount) * 100).toFixed(0)}%</p>
                             </div>
                           </div>
                           <div className="text-right">
                             <p className="text-base font-black text-slate-900">{formatCurrency(ms.amount)}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>

         {/* Sidebar Actions & Signatures */}
         <div className="w-full lg:w-[400px] flex-shrink-0 space-y-6">
            <div className="bg-slate-950 rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden">
               <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl mix-blend-screen" />
               <h3 className="text-lg font-black uppercase tracking-widest mb-8 flex items-center gap-3">
                 <FileSignature className="text-primary" /> Multi-Sig Status
               </h3>

               <div className="space-y-6 relative z-10">
                  {/* Owner Signature */}
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Project Owner (You)</span>
                      {contract.signatures.ownerSigned ? (
                         <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                           <CheckCircle2 size={12} />
                         </div>
                      ) : (
                         <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center">
                           <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                         </div>
                      )}
                    </div>
                    
                    {contract.signatures.ownerSigned ? (
                      <div>
                        <p className="text-sm font-black text-emerald-400">Cryptographically Signed</p>
                        <p className="text-[9px] font-mono text-slate-400 mt-1 uppercase opacity-60">
                           TS: {new Date(contract.signatures.ownerSignedAt!).toISOString()}
                        </p>
                      </div>
                    ) : (
                      <Link 
                        href={`/dashboard/project-owner/contracts/${contractId}/sign`}
                        className="w-full py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                      >
                        <FileSignature size={14} />
                        Authorize Signature
                      </Link>
                    )}
                  </div>

                  {/* Installer Signature */}
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lead Installer</span>
                      {contract.signatures.installerSigned ? (
                         <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                           <CheckCircle2 size={12} />
                         </div>
                      ) : (
                         <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center">
                           <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                         </div>
                      )}
                    </div>
                    {contract.signatures.installerSigned ? (
                      <div>
                        <p className="text-sm font-black text-emerald-400">Cryptographically Signed</p>
                        <p className="text-[9px] font-mono text-slate-400 mt-1 uppercase opacity-60">
                           TS: {new Date(contract.signatures.installerSignedAt!).toISOString()}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs font-bold text-amber-500 flex items-center gap-2">
                         <Clock size={12} /> Awaiting counterpart signature
                      </p>
                    )}
                  </div>
               </div>

               {contract.signatures.ownerSigned && contract.signatures.installerSigned && (
                 <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-3">
                   <Link href={`/dashboard/project-owner/projects/${contract.projectId}/escrow-funding`} className="w-full py-4 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-100 transition-all text-center">
                      Initialize Trusted Payment
                   </Link>
                 </div>
               )}
            </div>

            {/* Document Actions */}
            <div className="bg-slate-50 rounded-[32px] p-2 border border-slate-200">
               <button className="w-full p-4 flex items-center justify-between rounded-3xl hover:bg-white hover:shadow-sm transition-all group">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                        <Eye size={18} />
                     </div>
                     <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Verify Document Source</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-400 group-hover:text-primary transition-colors" />
               </button>
               <button className="w-full p-4 flex items-center justify-between rounded-3xl hover:bg-white hover:shadow-sm transition-all group mt-1">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-slate-200 text-slate-500 rounded-xl flex items-center justify-center">
                        <Download size={18} />
                     </div>
                     <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Export PDF Render</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-400 group-hover:text-primary transition-colors" />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
