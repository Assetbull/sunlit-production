'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Users, 
  ShieldCheck, 
  ChevronRight, 
  Star, 
  MapPin, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
  Zap,
  MoreVertical,
  Activity,
  Verified
} from 'lucide-react';

/**
 * CrewLink Applicant Management
 * Target: crewlink_applicants.html
 */

export default function ApplicationReviewPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = use(params);
  const [success, setSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // Mock applicants data matching crewlink_applicants.html context
  const [applicants, setApplicants] = useState([
    {
      id: 'APP-8842',
      name: 'David Olatunji',
      role: 'Lead Installer',
      rating: 4.9,
      reviews: 42,
      location: 'Lekki, Lagos',
      appliedAt: '2h ago',
      verified: true,
      completions: 24,
      status: 'pending',
      avatar: 'D',
      note: 'I have extensive experience with 10kW tier-one panels. Available to start tomorrow morning.'
    },
    {
      id: 'APP-9021',
      name: 'Emma Soyinka',
      role: 'Electrician',
      rating: 4.7,
      reviews: 18,
      location: 'Ikeja, Lagos',
      appliedAt: '5h ago',
      verified: true,
      completions: 12,
      status: 'pending',
      avatar: 'E',
      note: 'Hardworking and ready to assist with wiring and mounting structures.'
    }
  ]);

  const handleAction = (appId: string, action: 'accept' | 'reject') => {
    setIsProcessing(appId);
    
    // Simulate backend assignment flow
    setTimeout(() => {
      setApplicants(current => 
        current.map(app => 
          app.id === appId ? { ...app, status: action === 'accept' ? 'accepted' : 'rejected' } : app
        )
      );
      if (action === 'accept') {
         setSuccess(true);
      }
      setIsProcessing(null);
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFA]">
      {/* Platform Context Header */}
      <header className="sticky top-0 w-full z-50 flex items-center justify-between px-8 h-20 bg-white/80 backdrop-blur-xl shadow-sm border-b border-[#EEF2F0]">
        <div className="flex items-center">
          <Link href="/dashboard/installer/crewlink" className="mr-4 flex items-center justify-center w-8 h-8 rounded-full border border-[#E0E7E4] text-[#707A6C] hover:bg-[#F4F7F5] transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          </Link>
          <div className="flex items-center gap-2 text-sm font-medium tracking-tight">
            <span className="text-[#707A6C]">CrewLink Hub</span>
            <ChevronRight size={14} className="text-[#BCC6C0]" />
            <span className="text-[#1A1C19] font-semibold">Applicant Management</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 px-3 py-1 bg-[#E8F3EB] rounded-full border border-[#C6E7D0]">
              <Activity size={14} className="text-[#0F631B]" />
              <span className="text-[10px] font-black text-[#0F631B] uppercase tracking-widest">Live Feed</span>
           </div>
        </div>
      </header>

      <main className="flex-1 p-8 lg:p-12 max-w-7xl mx-auto w-full">
        {/* Job Header & Status Shield */}
        <div className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <span className="text-[10px] font-black text-[#A0AA9C] uppercase tracking-[0.2em]">{jobId}</span>
                 <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-black tracking-tight border border-amber-100">ACTIVE HIRING</span>
              </div>
              <h1 className="text-4xl font-headline font-black tracking-tight text-[#1A1C19]">Lead Solar Installer - 10kW Array</h1>
              <div className="flex items-center gap-6 text-sm font-medium text-[#707A6C]">
                 <div className="flex items-center gap-2">
                    <Users size={18} className="text-[#0F631B]" />
                    {applicants.length} Total Applicants
                 </div>
                 <div className="w-1 h-1 rounded-full bg-[#BCC6C0]" />
                 <div className="flex items-center gap-2">
                    <Zap size={18} className="text-[#0F631B]" />
                    Urgent Deployment
                 </div>
              </div>
           </div>

           {/* Auto-Reject Shield Widget */}
           <div className="bg-[#1A1C19] p-6 rounded-3xl text-white flex items-center gap-6 shadow-xl shadow-[#1A1C19]/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full -mr-12 -mt-12 transition-all group-hover:w-32 group-hover:h-32" />
              <div className="w-12 h-12 rounded-2xl bg-[#0F631B] flex items-center justify-center shadow-lg shadow-[#0F631B]/20 relative z-10">
                 <ShieldCheck size={24} />
              </div>
              <div className="relative z-10">
                 <p className="text-[10px] font-black text-[#BCC6C0] uppercase tracking-widest mb-1">Auto-Reject Shield</p>
                 <p className="text-sm font-black text-white">Active Enforcement</p>
                 <p className="text-[9px] font-medium text-[#707A6C] mt-0.5 italic">Filtering applicants below 4.5★</p>
              </div>
           </div>
        </div>

        {/* Applicant Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           {/* Left: Team Composition & Stats */}
           <div className="lg:col-span-4 space-y-8">
              <section className="bg-white border border-[#EEF2F0] shadow-sm rounded-3xl p-8">
                 <h3 className="text-xs uppercase tracking-[0.2em] font-black text-[#BCC6C0] border-b border-[#F4F7F5] pb-4 mb-6">Team Composition</h3>
                 <div className="space-y-6">
                    <div>
                       <div className="flex justify-between items-end mb-2">
                          <span className="text-sm font-black text-[#1A1C19]">Lead Installers</span>
                          <span className="text-xs font-bold text-[#707A6C]">1/1 Filled</span>
                       </div>
                       <div className="h-1.5 w-full bg-[#F4F7F5] rounded-full overflow-hidden">
                          <div className="h-full w-full bg-[#0F631B] rounded-full" />
                       </div>
                    </div>
                    <div>
                       <div className="flex justify-between items-end mb-2">
                          <span className="text-sm font-black text-[#1A1C19]">General Crew</span>
                          <span className="text-xs font-bold text-[#707A6C]">0/4 Filled</span>
                       </div>
                       <div className="h-1.5 w-full bg-[#F4F7F5] rounded-full overflow-hidden">
                          <div className="h-full w-0 bg-[#0F631B] rounded-full" />
                       </div>
                    </div>
                 </div>
              </section>

              <section className="bg-[#0F631B]/5 border border-[#0F631B]/10 rounded-3xl p-8">
                 <div className="flex items-center gap-3 mb-4">
                    <AlertCircle size={18} className="text-[#0F631B]" />
                    <h3 className="text-sm font-black text-[#1A1C19]">Recruitment Health</h3>
                 </div>
                 <p className="text-xs font-medium text-[#40493D] leading-relaxed">Your application-to-hire ratio is 14% higher than the market average for Lagos. High liquidity detected.</p>
              </section>
           </div>

           {/* Right: Applicant List */}
           <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between px-2">
                 <h2 className="text-xs uppercase tracking-[0.2em] font-black text-[#BCC6C0]">Verified Professional Feed</h2>
                 <button className="p-2 text-[#707A6C] hover:text-[#1A1C19] transition-colors">
                    <MoreVertical size={16} />
                 </button>
              </div>

              {applicants.map((app) => (
                <div key={app.id} className="bg-white border border-[#EEF2F0] shadow-sm rounded-3xl p-8 flex flex-col md:flex-row gap-8 transition-all hover:shadow-xl hover:shadow-[#EEF2F0]/50 relative group">
                   <div className="flex-1">
                      <div className="flex items-start justify-between mb-6">
                         <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-[#F4F7F5] border border-[#EEF2F0] flex items-center justify-center font-headline text-2xl font-black text-[#0F631B] group-hover:scale-105 transition-transform">
                               {app.avatar}
                            </div>
                            <div className="space-y-1.5">
                               <div className="flex items-center gap-2">
                                  <h3 className="text-xl font-black text-[#1A1C19]">{app.name}</h3>
                                  {app.verified && <Verified size={18} className="text-[#0F631B]" fill="#C6E7D0" />}
                               </div>
                               <div className="flex items-center gap-4 text-xs font-bold text-[#707A6C]">
                                  <div className="flex items-center gap-1">
                                     <Star size={14} className="text-amber-400" fill="currentColor" />
                                     {app.rating} <span className="font-medium opacity-60 ml-0.5">({app.reviews} Reviews)</span>
                                  </div>
                                  <div className="w-1 h-1 rounded-full bg-[#BCC6C0]" />
                                  <div className="flex items-center gap-1 font-medium">
                                     <MapPin size={14} />
                                     {app.location}
                                  </div>
                               </div>
                            </div>
                         </div>
                         <div className="text-right">
                            <span className="text-[10px] font-black text-[#BCC6C0] uppercase tracking-widest">{app.appliedAt}</span>
                         </div>
                      </div>

                      <div className="bg-[#F9FAFA] p-6 rounded-2xl border border-[#EEF2F0] relative overflow-hidden">
                         <FileText size={16} className="absolute top-4 right-4 text-[#EEF2F0]" />
                         <span className="text-[9px] font-black text-[#BCC6C0] uppercase tracking-widest mb-2 block">Cover Insight</span>
                         <p className="text-sm font-medium text-[#40493D] italic leading-relaxed">"{app.note}"</p>
                      </div>

                      <div className="mt-6 flex items-center gap-8">
                         <div className="space-y-1">
                            <span className="text-[10px] uppercase tracking-wider font-black text-[#BCC6C0]">Force completions</span>
                            <p className="text-base font-black text-[#1A1C19]">{app.completions} <span className="text-[10px] font-medium text-[#707A6C]">Gigs</span></p>
                         </div>
                         <div className="space-y-1">
                            <span className="text-[10px] uppercase tracking-wider font-black text-[#BCC6C0]">Primary Role</span>
                            <p className="text-base font-black text-[#1A1C19]">{app.role}</p>
                         </div>
                      </div>
                   </div>

                   {/* Action Column */}
                   <div className="w-full md:w-56 shrink-0 flex flex-col justify-center border-t md:border-t-0 md:border-l border-[#F4F7F5] pt-6 md:pt-0 md:pl-8 gap-4">
                      {app.status === 'pending' ? (
                        <>
                          <button 
                            onClick={() => handleAction(app.id, 'accept')}
                            disabled={!!isProcessing}
                            className="w-full bg-[#1A1C19] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center h-14 shadow-xl shadow-[#1A1C19]/10"
                          >
                             {isProcessing === app.id ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Approve Force'}
                          </button>
                          <button 
                            onClick={() => handleAction(app.id, 'reject')}
                            disabled={!!isProcessing}
                            className="w-full bg-white border border-[#EEF2F0] text-[#707A6C] py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all disabled:opacity-50 h-14"
                          >
                             Reject Node
                          </button>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 bg-[#F9FAFA] rounded-3xl border border-[#EEF2F0]">
                           {app.status === 'accepted' ? (
                             <>
                               <CheckCircle2 size={32} className="text-[#0F631B] mb-3" />
                               <span className="text-[10px] font-black text-[#0F631B] uppercase tracking-widest">Crew Assigned</span>
                             </>
                           ) : (
                             <>
                               <XCircle size={32} className="text-[#707A6C] mb-3" />
                               <span className="text-[10px] font-black text-[#707A6C] uppercase tracking-widest">Node Rejected</span>
                             </>
                           )}
                        </div>
                      )}
                   </div>
                </div>
              ))}
           </div>
        </div>
      </main>
    </div>
  );
}
