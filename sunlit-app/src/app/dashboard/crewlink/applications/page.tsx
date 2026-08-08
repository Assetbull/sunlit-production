'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  FileText,
  Clock, 
  MapPin, 
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  XCircle,
  MoreHorizontal
} from 'lucide-react';
import { fetchMyApplications } from '@/dashboards/crewlink/services/crewlink-api';
import type { CrewApplication } from '@/dashboards/crewlink/types/crew';

export default function CrewLinkApplications() {
  const [applications, setApplications] = useState<CrewApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetchMyApplications();
      if (res.success && res.data) {
        setApplications(res.data);
      }
      setLoading(false);
    }
    load();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-100">
            <Clock size={12} /> Under Review
          </span>
        );
      case 'reviewed':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100">
            <ShieldCheck size={12} /> Shortlisted
          </span>
        );
      case 'accepted':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">
            <CheckCircle size={12} /> Assigned
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-red-100">
            <XCircle size={12} /> Closed
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
     return (
       <div className="space-y-6">
         <div className="skeleton h-24 w-full md:w-1/2 rounded-[32px]" />
         <div className="grid grid-cols-1 gap-4">
            <div className="skeleton h-32 w-full rounded-[24px]" />
            <div className="skeleton h-32 w-full rounded-[24px]" />
         </div>
       </div>
     );
  }

  return (
    <div>
      <header className="mb-10">
        <h1 className="text-3xl md:text-5xl font-black font-headline text-slate-900 tracking-tight">
          My <span className="text-primary italic">Trace Hub</span>
        </h1>
        <p className="text-slate-500 font-medium mt-2 max-w-xl">
          Track the status of your applications and manage your active CrewLink assignments.
        </p>
      </header>

      {applications.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[40px] p-16 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-[24px] flex items-center justify-center text-slate-300 mb-6 border border-slate-100 shadow-sm shadow-slate-100/50">
                <FileText size={40} />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">No Applications Yet</h3>
            <p className="text-slate-500 font-medium max-w-md">
                You haven't applied to any gigs right now. Head over to the Job Board to find your next project.
            </p>
            <Link href="/dashboard/crewlink" className="mt-8 px-6 py-3 bg-primary text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest shadow-[0_0_24px_rgba(0,184,148,0.3)] hover:shadow-[0_0_32px_rgba(0,184,148,0.5)] hover:-translate-y-0.5 transition-all">
                Explore Job Board
            </Link>
        </div>
      ) : (
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="hidden md:grid grid-cols-12 gap-4 p-6 border-b border-slate-100 bg-slate-50/50">
             <div className="col-span-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Gig</div>
             <div className="col-span-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Date Applied</div>
             <div className="col-span-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</div>
             <div className="col-span-1"></div>
          </div>
          
          <div className="divide-y divide-slate-100">
            {applications.map(app => (
              <div key={app.id} className="group flex flex-col md:grid md:grid-cols-12 gap-4 p-6 items-center hover:bg-slate-50 transition-colors">
                 
                 <div className="w-full md:col-span-5">
                   <div className="flex items-center justify-between md:hidden mb-3">
                     {getStatusBadge(app.status)}
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(app.created_at).toLocaleDateString()}</span>
                   </div>
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                       <FileText size={20} className="text-slate-400 group-hover:text-primary" />
                     </div>
                     <div>
                       <Link href={`/dashboard/crewlink/jobs/${app.job_id}`} className="block text-sm font-black text-slate-900 hover:text-primary transition-colors truncate max-w-xs mb-1">
                         Job REF: {app.job_id.slice(0,8).toUpperCase()}
                       </Link>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                         <MapPin size={10} className="text-emerald-500" /> Crew Assignment
                       </p>
                     </div>
                   </div>
                 </div>

                 <div className="w-full md:col-span-3 flex md:justify-center items-center">
                   <span className="hidden md:block text-sm font-bold text-slate-600">
                     {new Date(app.created_at).toLocaleDateString()}
                   </span>
                 </div>

                 <div className="w-full md:col-span-3 flex md:justify-center items-center">
                   <div className="hidden md:block">
                     {getStatusBadge(app.status)}
                   </div>
                 </div>

                 <div className="w-full md:col-span-1 flex md:justify-end items-center">
                   <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
                     <MoreHorizontal size={20} />
                   </button>
                 </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
