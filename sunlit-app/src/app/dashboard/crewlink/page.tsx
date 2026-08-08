'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Clock, 
  Nfc,
  Filter,
  ArrowRight
} from 'lucide-react';
import { fetchAvailableJobs } from '@/dashboards/crewlink/services/crewlink-api';
import type { CrewJob } from '@/dashboards/crewlink/types/crew';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', { 
    style: 'currency', 
    currency: 'NGN', 
    maximumFractionDigits: 0 
  }).format(amount);
}

export default function CrewLinkJobBoard() {
  const [jobs, setJobs] = useState<CrewJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function load() {
      const res = await fetchAvailableJobs();
      if (res.success && res.data) {
        setJobs(res.data);
      }
      setLoading(false);
    }
    load();
  }, []);

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.location_state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.required_skills?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
     return (
       <div className="space-y-6">
         <div className="skeleton h-32 w-full rounded-[32px]" />
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="skeleton h-64 w-full rounded-[32px]" />
            <div className="skeleton h-64 w-full rounded-[32px]" />
         </div>
       </div>
     );
  }

  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-8 w-full max-w-[1440px] mx-auto">
      {/* Sidebar Filters (Desktop) */}
      <aside className="hidden lg:flex flex-col w-72 shrink-0 h-[calc(100vh-8rem)] overflow-y-auto pr-4 custom-scrollbar">
        <div className="bg-surface-1 rounded-xl shadow-sm border border-surface-3 p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-surface-3 pb-4">
            <h2 className="font-headline font-extrabold text-[20px] text-on-surface tracking-tight">Filters</h2>
            <button className="text-sm font-label text-primary hover:underline">Clear all</button>
          </div>
          
          {/* Project Type */}
          <div className="flex flex-col gap-3">
            <h3 className="font-headline font-bold text-[16px] text-on-surface">Project Type</h3>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-surface-3 text-primary focus:ring-primary bg-surface-2" />
              <span className="font-body text-[14px] text-muted group-hover:text-on-surface transition-colors">Residential</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-surface-3 text-primary focus:ring-primary bg-surface-2" />
              <span className="font-body text-[14px] text-muted group-hover:text-on-surface transition-colors">Commercial</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-5 h-5 rounded border-surface-3 text-primary focus:ring-primary bg-surface-2" />
              <span className="font-body text-[14px] text-muted group-hover:text-on-surface transition-colors">Utility Scale</span>
            </label>
          </div>

          {/* Location */}
          <div className="flex flex-col gap-3">
            <h3 className="font-headline font-bold text-[16px] text-on-surface">Location</h3>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search city..." 
                className="w-full bg-surface-2 rounded-lg py-2 pl-9 pr-4 text-[14px] font-body border border-surface-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-on-surface"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[12px] font-label font-bold flex items-center gap-1 cursor-pointer hover:bg-primary/20 transition-colors">
                Lagos <span className="text-[14px]">×</span>
              </span>
              <span className="bg-surface-2 text-muted border border-surface-3 px-3 py-1 rounded-full text-[12px] font-label font-bold cursor-pointer hover:bg-surface-3 transition-colors">Abuja</span>
              <span className="bg-surface-2 text-muted border border-surface-3 px-3 py-1 rounded-full text-[12px] font-label font-bold cursor-pointer hover:bg-surface-3 transition-colors">Port Harcourt</span>
            </div>
          </div>

          {/* Certifications */}
          <div className="flex flex-col gap-3">
            <h3 className="font-headline font-bold text-[16px] text-on-surface">Required Certs</h3>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-surface-3 text-primary focus:ring-primary bg-surface-2" />
              <span className="font-body text-[14px] text-muted group-hover:text-on-surface transition-colors">COREN</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-surface-3 text-primary focus:ring-primary bg-surface-2" />
              <span className="font-body text-[14px] text-muted group-hover:text-on-surface transition-colors">HSE Level 3</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-5 h-5 rounded border-surface-3 text-primary focus:ring-primary bg-surface-2" />
              <span className="font-body text-[14px] text-muted group-hover:text-on-surface transition-colors">NEMSA</span>
            </label>
          </div>

          {/* Daily Rate Slider */}
          <div className="flex flex-col gap-3 mt-2">
            <div className="flex justify-between items-center">
              <h3 className="font-headline font-bold text-[16px] text-on-surface">Min Daily Rate</h3>
              <span className="font-label text-[12px] text-primary font-bold">₦80k+</span>
            </div>
            <div className="h-2 w-full bg-surface-3 rounded-full overflow-hidden mt-1">
              <div className="h-full bg-primary w-[40%] rounded-full"></div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Job Feed */}
      <main className="flex-1 flex flex-col gap-6 lg:h-[calc(100vh-8rem)] lg:overflow-y-auto pb-24 md:pb-8 pr-2 custom-scrollbar">
        {/* Feed Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
          <div>
            <h1 className="font-headline font-extrabold text-[30px] tracking-tight text-on-surface leading-tight">Available Assignments</h1>
            <p className="font-body text-[16px] text-muted mt-1">Showing {filteredJobs.length} matches based on your profile</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-label text-[14px] font-bold text-muted uppercase tracking-wider">Sort by:</span>
            <select className="bg-surface-1 border border-surface-3 rounded-lg text-[14px] font-body font-bold text-on-surface focus:ring-2 focus:ring-primary py-2 px-3 cursor-pointer shadow-sm">
              <option>Highest Match</option>
              <option>Newest</option>
              <option>Highest Rate</option>
            </select>
          </div>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="bg-surface-1 border-2 border-dashed border-surface-3 rounded-xl p-16 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-surface-2 rounded-2xl flex items-center justify-center text-muted mb-6 shadow-sm border border-surface-3">
              <Briefcase className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-headline font-bold text-on-surface mb-2">No Gigs Found</h3>
            <p className="text-muted font-medium max-w-md">
              Adjust your filters or check back later. Installers post new jobs daily.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredJobs.map(job => (
              <article key={job.id} className="bg-surface-1 rounded-xl shadow-sm border border-surface-3 p-6 flex flex-col gap-5 hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 transition-transform group-hover:scale-110 duration-500"></div>
                
                <div className="flex justify-between items-start gap-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-surface-2 border border-surface-3 flex items-center justify-center shrink-0">
                      <Nfc className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-headline font-bold text-[18px] text-on-surface leading-tight">{job.title}</h3>
                        <span className="bg-amber-500/10 text-amber-700 border border-amber-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Urgent</span>
                      </div>
                      <p className="font-body text-[14px] text-muted flex items-center gap-1 font-medium">
                        <Briefcase className="w-4 h-4" /> {job.posted_by}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="bg-surface-2 text-muted border border-surface-3 px-2.5 py-1 rounded-md text-[12px] font-label font-bold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {job.location_state || 'Nationwide'}
                  </span>
                  <span className="bg-surface-2 text-muted border border-surface-3 px-2.5 py-1 rounded-md text-[12px] font-label font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {Math.floor((Date.now() - new Date(job.created_at).getTime()) / 3600000)}h ago
                  </span>
                  {job.required_skills?.slice(0, 1).map(skill => (
                     <span key={skill} className="bg-surface-2 text-muted border border-surface-3 px-2.5 py-1 rounded-md text-[12px] font-label font-bold flex items-center gap-1">
                       {skill}
                     </span>
                  ))}
                </div>

                <p className="font-body text-[14px] text-muted line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                <div className="flex items-center gap-4 py-4 border-y border-surface-3">
                  <div className="flex flex-col">
                    <span className="font-label text-[10px] font-bold uppercase tracking-wider text-muted mb-1">Daily Rate</span>
                    <span className="font-headline font-extrabold text-[20px] text-primary">{job.pay_rate ? formatCurrency(job.pay_rate) : 'Negotiable'}</span>
                  </div>
                  <div className="h-8 w-px bg-surface-3"></div>
                  <div className="flex flex-col w-full">
                    <span className="font-label text-[10px] font-bold uppercase tracking-wider text-muted mb-1">Match Score</span>
                    <div className="flex items-center gap-2">
                      <span className="font-headline font-bold text-[18px] text-on-surface">98%</span>
                      <div className="flex-1 h-1.5 bg-surface-3 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[98%] rounded-full shadow-[0_0_8px_rgba(0,73,14,0.5)]"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-surface-3 border-2 border-surface-1 flex items-center justify-center text-[10px] font-bold text-muted">CO</div>
                    <div className="w-8 h-8 rounded-full bg-surface-3 border-2 border-surface-1 flex items-center justify-center text-[10px] font-bold text-muted">HS</div>
                  </div>
                  <Link href={`/dashboard/crewlink/jobs/${job.id}`} className="bg-gradient-to-r from-primary to-primary-container text-white font-label font-bold uppercase text-[12px] tracking-wider px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 group cursor-pointer">
                    Review Job
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
