'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PlusCircle, ArrowUpRight } from 'lucide-react';
import { fetchDashboardSummary, fetchRfqs } from '@/dashboards/project-owner/services/project-owner-api';
import KYCModal from './components/KYCModal';
import KPIBanner from './components/KPIBanner';
import MilestoneStrip from './components/MilestoneStrip';
import ProjectListItem from './components/ProjectListItem';
import type { DashboardSummary, RfqListItem } from '@/dashboards/project-owner/types/dashboard';

export default function DashboardOverview() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [rfqs, setRfqs] = useState<RfqListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isKycVerified, setIsKycVerified] = useState(false); // Mock KYC status
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);

  useEffect(() => {
    async function load() {
      const [summaryRes, rfqsRes] = await Promise.all([
        fetchDashboardSummary(),
        fetchRfqs(),
      ]);
      if (summaryRes.success && summaryRes.data) setSummary(summaryRes.data);
      if (rfqsRes.success && rfqsRes.data) setRfqs(rfqsRes.data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse p-6">
        <div className="h-12 bg-surface-container-high rounded-xl w-64 mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-surface-container-low rounded-3xl" />
          ))}
        </div>
        <div className="h-24 bg-surface-container-low rounded-full mb-16" />
        <div className="space-y-6">
          {[1, 2].map(i => (
            <div key={i} className="h-40 bg-surface-container-lowest rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-12 px-2">
      {/* Header Section */}
      <section className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="text-primary font-label text-xs tracking-widest uppercase mb-2 block">Energy Management</span>
          <h1 className="text-4xl lg:text-5xl font-headline font-bold text-on-surface tracking-tight leading-tight">Project Owner<br/>Overview</h1>
        </div>
        <Link 
          href="/dashboard/project-owner/rfq/new"
          className="bg-primary text-white px-8 py-4 rounded-full font-headline font-bold flex items-center gap-3 shadow-[0px_24px_48px_rgba(0,107,92,0.15)] hover:scale-[1.02] transition-transform"
        >
          <PlusCircle size={20} />
          Commission New Project
        </Link>
      </section>

      {/* KYC Modal */}
      <KYCModal 
        isOpen={isKycModalOpen} 
        onClose={() => setIsKycModalOpen(false)} 
        onSuccess={() => setIsKycVerified(true)} 
      />

      {/* KPI Bento Grid */}
      <KPIBanner 
        portfolioValue="₦842.5M"
        activeYield="18.2%"
        carbonOffset="1,240"
      />

      {/* Milestone Strip */}
      <MilestoneStrip />

      {/* Active Projects List */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-headline font-bold text-on-surface tracking-tight">Active Projects</h3>
          <Link href="/dashboard/project-owner/projects" className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
            View All Projects <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="space-y-6">
          {rfqs.map((rfq) => (
            <ProjectListItem
              key={rfq.id}
              id={rfq.id}
              title={rfq.projectTitle}
              description={rfq.status === 'open' ? 'Bidding phase active. Awaiting more installer offers.' : 'System integration phase in progress.'}
              status={rfq.status === 'open' ? 'pending' : rfq.status === 'matched' ? 'active' : 'completed'}
              progress={rfq.status === 'open' ? 10 : rfq.status === 'matched' ? 75 : 100}
              location={`${rfq.locationCity}, ${rfq.locationState}`}
              estCompletion="Nov 2024"
              investment={`₦${(rfq.budgetMax / 1000000).toFixed(1)}M Invested`}
            />
          ))}

          {/* Fallback mock if data is thin */}
          {rfqs.length < 2 && (
            <>
              <ProjectListItem
                id="proj-mock-1"
                title="Lekki Phase 1 Residential Mini-Grid"
                description="System integration phase nearly complete. Battery storage units are being synchronized."
                status="active"
                progress={75}
                location="Lagos, Nigeria"
                estCompletion="Dec 2024"
                investment="₦240.5M Invested"
              />
              <ProjectListItem
                id="proj-mock-2"
                title="Port Harcourt Industrial Cluster"
                description="Land rights verification ongoing. Project timeline currently paused."
                status="disputed"
                progress={10}
                location="Rivers State"
                estCompletion="TBD"
                investment="₦92.0M Committed"
              />
            </>
          )}
        </div>
      </section>
    </div>
  );
}
