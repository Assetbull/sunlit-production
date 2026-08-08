'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { getSession } from '@/shared/session/sessionManager';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Briefcase, 
  CheckCircle,
  FileText,
  AlertCircle,
  Nfc,
  Upload,
  Send
} from 'lucide-react';
import { fetchJobDetails, submitApplication } from '@/dashboards/crewlink/services/crewlink-api';
import type { CrewJob } from '@/dashboards/crewlink/types/crew';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', { 
    style: 'currency', 
    currency: 'NGN', 
    maximumFractionDigits: 0 
  }).format(amount);
}

export default function CrewLinkJobDetail({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = use(params);
  const router = useRouter();

  const [job, setJob] = useState<CrewJob | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [coverNote, setCoverNote] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  
  const session = getSession();
  const isPoster = job ? (session?.name === job.posted_by || session?.id === job.posted_by) : false;

  useEffect(() => {
    async function load() {
      const res = await fetchJobDetails(jobId);
      if (res.success && res.data) {
        setJob(res.data.job);
      }
      setLoading(false);
    }
    load();
  }, [jobId]);

  const handleApply = async () => {
    setIsApplying(true);
    const res = await submitApplication(jobId, coverNote);
    if (res.success) {
      setApplySuccess(true);
      setTimeout(() => {
         router.push('/dashboard/crewlink/applications');
      }, 2000);
    }
    setIsApplying(false);
  };

  if (loading) {
     return (
       <div className="space-y-6">
         <div className="skeleton h-12 w-1/4 rounded-2xl mb-8" />
         <div className="skeleton h-64 w-full rounded-[32px]" />
         <div className="skeleton h-96 w-full rounded-[32px]" />
       </div>
     );
  }

  if (!job) {
     return (
       <div className="flex flex-col items-center justify-center min-h-[60vh]">
         <div className="w-20 h-20 bg-slate-200 text-slate-400 rounded-3xl flex items-center justify-center mb-6">
           <AlertCircle size={32} />
         </div>
         <h2 className="text-2xl font-black text-slate-900 tracking-tight">Job Not Found</h2>
         <p className="text-slate-500 font-medium mt-2">This job may have been assigned or removed by the poster.</p>
         <Link href="/dashboard/crewlink" className="mt-8 px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-slate-900 transition-colors">
           Return to Job Board
         </Link>
       </div>
     );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Link href="/dashboard/crewlink" className="inline-flex items-center gap-2 group mb-8">
        <div className="p-2 bg-white rounded-xl shadow-sm text-slate-400 group-hover:text-primary group-hover:-translate-x-1 transition-all">
          <ArrowLeft size={16} />
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-900 transition-colors">Job Board</span>
      </Link>

      {applySuccess && (
        <div className="mb-8 p-6 bg-emerald-50 border border-emerald-100 rounded-[24px] flex items-center gap-4 text-emerald-800">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
             <CheckCircle size={24} className="text-emerald-600" />
          </div>
          <div>
            <h3 className="text-base font-black">Application Successfully Submitted</h3>
            <p className="text-sm font-medium mt-1 opacity-80">The project owner will review your profile and respond shortly. Redirecting to your trace hub...</p>
          </div>
        </div>
      )}

      {/* Main Hero Card */}
      <div className="bg-white p-8 md:p-12 border border-slate-200 shadow-sm rounded-[40px] relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-8">
           <div>
             <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                  Job REF: {job.id.slice(0,8).toUpperCase()}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <Clock size={12} /> Posted {new Date(job.created_at).toLocaleDateString()}
                </span>
             </div>
             
             <h1 className="text-4xl md:text-5xl font-black font-headline text-slate-900 tracking-tighter leading-tight mb-4">
               {job.title}
             </h1>
             
             <div className="flex flex-wrap items-center gap-6 mt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-primary">
                    <Nfc size={18} />
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Posted By</span>
                    <span className="text-sm font-black text-slate-900">{job.posted_by}</span>
                  </div>
                </div>
                
                <div className="h-8 w-px bg-slate-200 hidden md:block" />
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Target Zone</span>
                    <span className="text-sm font-black text-slate-900">{job.location_state || 'Remote / Nationwide'}</span>
                  </div>
                </div>
             </div>
           </div>
           
           <div className="md:text-right bg-slate-50 p-6 rounded-3xl border border-slate-100 min-w-[200px]">
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Compensation</span>
              <p className="text-4xl font-black text-slate-900 tracking-tighter">
                {job.pay_rate ? formatCurrency(job.pay_rate) : 'TBD'}
              </p>
              <span className="block mt-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center md:justify-end gap-1">
                 <Briefcase size={12} /> Verified Payment Track
              </span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Job Details */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-200">
             <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                <FileText size={20} className="text-slate-400" />
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest">Operation Scope</h3>
             </div>
             <p className="text-base text-slate-600 leading-relaxed font-medium">
               {job.description || 'No detailed scope provided. Contact the installer directly upon assignment.'}
             </p>
             
             {job.required_skills && job.required_skills.length > 0 && (
               <div className="mt-8 pt-6 border-t border-slate-100">
                 <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Required Certifications & Skills</span>
                 <div className="flex flex-wrap gap-2">
                   {job.required_skills.map(skill => (
                     <div key={skill} className="px-4 py-2 bg-primary/10 text-primary text-xs font-black uppercase tracking-widest rounded-xl border border-primary/20">
                       {skill}
                     </div>
                   ))}
                 </div>
               </div>
             )}
           </div>
        </div>

        {/* Right Column: Apply Form */}
        <div>
           <div className="bg-slate-950 p-8 rounded-[32px] text-white shadow-xl sticky top-8">
             <h3 className="text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-3">
               <Send className="text-primary" /> Application
             </h3>
             
             {isPoster ? (
               <div className="flex flex-col items-center justify-center py-8 text-center bg-white/5 border border-white/10 rounded-2xl p-6">
                 <div className="w-16 h-16 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mb-4">
                   <AlertCircle size={32} />
                 </div>
                 <p className="text-sm font-black text-white">Owner Access</p>
                 <p className="text-xs text-slate-400 mt-2">You are the Project Lead for this job. You cannot apply to your own posting.</p>
               </div>
             ) : !applySuccess ? (
               <div className="space-y-6">
                 <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                     Cover Note (Optional)
                   </label>
                   <textarea 
                     rows={4}
                     className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder-slate-600 focus:border-primary outline-none transition-colors resize-none"
                     placeholder="Highlight your experience or confirm your availability..."
                     value={coverNote}
                     onChange={(e) => setCoverNote(e.target.value)}
                   />
                 </div>
                 
                 <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Upload size={12} /> Profile Snapshot
                    </span>
                    <p className="text-xs text-slate-300">Your verified CrewLink profile, including past completions and rating score, will be attached automatically.</p>
                 </div>
                 
                 <button 
                   onClick={handleApply}
                   disabled={isApplying}
                   className="w-full py-4 bg-primary text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4 shadow-[0_0_20px_rgba(0,184,148,0.3)] hover:shadow-[0_0_30px_rgba(0,184,148,0.5)]"
                 >
                   {isApplying ? (
                     <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                   ) : (
                     <>Submit Application</>
                   )}
                 </button>
               </div>
             ) : (
               <div className="flex flex-col items-center justify-center py-8 text-center">
                 <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-4">
                   <CheckCircle size={32} />
                 </div>
                 <p className="text-sm font-black text-white">Encrypted & Sent</p>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
