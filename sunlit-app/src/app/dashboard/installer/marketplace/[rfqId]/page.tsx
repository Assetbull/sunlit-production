'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Zap,
  CheckCircle,
  FileText,
  Image,
  Send,
  ChevronRight,
  ShieldCheck,
  Briefcase,
  Award,
  Shield,
  Users,
  AlertTriangle
} from 'lucide-react';
import { submitBid } from '@/dashboards/installer/services/installer-api';
import { getSession } from '@/shared/session/sessionManager';

/**
 * RFQ Detail + Bid Submission (Modernized)
 * Target: Luminous Command Center (rfq_detail.html)
 */

// Mock project data matching the extracted HTML context
const MOCK_PROJECTS: Record<string, any> = {
  'rfq-001': {
    id: 'RFQ-2023-8894',
    title: 'Lagos Residential 5kW Solar Installation',
    location: 'Lekki Phase 1, Lagos, Nigeria',
    systemSize: 5.0,
    batteryStorage: 10.0,
    inverterType: 'Hybrid Single Phase',
    projectType: 'Residential',
    closesIn: '4 days',
    overview: 'Seeking a certified EPC contractor to supply, install, and commission a 5kW hybrid solar system for a residential property. The system must prioritize self-consumption during peak tariff hours and include battery storage capable of sustaining critical loads during grid outages (estimated 6-8 hours daily).',
    requirements: [
      'Structural integrity assessment of the roof is required prior to installation.',
      'All equipment must meet tier-1 standards and come with standard manufacturer warranties.',
      'Tier-1 monocrystalline panels preferred',
      'Grid-tie inverter with auto-changeover'
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=80', label: 'Primary installation surface - South-facing roof' },
      { url: 'https://images.unsplash.com/photo-1509391366360-fe5bb58583fb?auto=format&fit=crop&w=400&q=80', label: 'Existing Main Panel' },
      { url: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=400&q=80', label: 'Meter & Conduit' }
    ]
  }
};

function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function RfqDetailPage({ params }: { params: Promise<{ rfqId: string }> }) {
  const { rfqId } = use(params);
  const project = MOCK_PROJECTS[rfqId] || MOCK_PROJECTS['rfq-001'];

  const session = getSession();
  const isEpcContractor = session?.role === 'epc_contractor';

  // Base bid fields
  const [bidAmount, setBidAmount] = useState('');
  const [timeline, setTimeline] = useState('1-2 Weeks');
  const [warranty, setWarranty] = useState('5');
  const [proposal, setProposal] = useState('');

  // EPC-specific enhanced fields
  const [showEnhancedFields, setShowEnhancedFields] = useState(isEpcContractor);
  const [projectManagementPlan, setProjectManagementPlan] = useState('');
  const [crewCoordinationStrategy, setCrewCoordinationStrategy] = useState('');
  const [riskMitigationApproach, setRiskMitigationApproach] = useState('');
  const [qualityAssurancePlan, setQualityAssurancePlan] = useState('');
  const [estimatedCrewSize, setEstimatedCrewSize] = useState('');
  const [equipmentList, setEquipmentList] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<string[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!bidAmount || Number(bidAmount) <= 0) {
      setError('Please enter a valid bid amount');
      return;
    }

    setSubmitting(true);

    const bidPayload: any = {
      amount: Number(bidAmount),
      proposed_timeline_days: timeline === '1-2 Weeks' ? 14 : 30,
      proposal_text: proposal,
      warranty_years: Number(warranty)
    };

    if (showEnhancedFields && isEpcContractor) {
      bidPayload.project_management_plan = projectManagementPlan;
      bidPayload.crew_coordination_strategy = crewCoordinationStrategy;
      bidPayload.risk_mitigation_approach = riskMitigationApproach;
      bidPayload.quality_assurance_plan = qualityAssurancePlan;
      bidPayload.estimated_crew_size = Number(estimatedCrewSize);
      bidPayload.equipment_list = equipmentList;
      bidPayload.certifications = certifications;
    }

    const result = await submitBid(rfqId, bidPayload);

    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error || 'Failed to submit bid');
    }
    setSubmitting(false);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6 animate-bounce">
          <ShieldCheck size={40} />
        </div>
        <h2 className="text-3xl font-black font-headline tracking-tight text-on-surface mb-2">Bid Successfully Submitted</h2>
        <p className="text-on-surface-variant max-w-md mb-8 leading-relaxed">
          Your competitive proposal for <span className="font-bold text-on-surface">{project.title}</span> has been entered into the ledger.
        </p>
        <Link href="/dashboard/installer/bids" className="btn-kinetic px-8 py-4 rounded-xl text-white font-bold shadow-lg hover:scale-[1.02] transition-all">
          View Submission Ledger
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      {/* Top Bar Context */}
      <header className="sticky top-0 w-full z-50 flex items-center justify-between px-8 h-20 bg-white/80 backdrop-blur-xl shadow-sm border-b border-surface-3">
        <div className="flex items-center">
          <Link href="/dashboard/installer/marketplace" className="mr-4 flex items-center justify-center w-8 h-8 rounded-full border border-surface-3 text-on-surface-variant hover:bg-surface-2 transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          </Link>
          <div className="flex items-center gap-2 text-sm font-medium tracking-tight">
            <span className="text-on-surface-variant">Marketplace</span>
            <ChevronRight size={14} className="text-surface-3" />
            <span className="text-on-surface font-semibold truncate max-w-[200px]">{project.title}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-surface-2 border border-surface-3 overflow-hidden">
            <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {session?.name?.charAt(0) || 'I'}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-8 lg:p-12 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-[11px] font-bold tracking-wider uppercase">
                <ShieldCheck size={14} fill="currentColor" className="opacity-20" />
                Open for Bidding
              </span>
              <span className="text-sm font-mono text-on-surface-variant">{project.id}</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border border-surface-3 text-on-surface-variant">
                {project.projectType}
              </span>
            </div>
            <h1 className="text-[2.5rem] leading-tight font-headline font-black tracking-tight text-on-surface">{project.title}</h1>
            <div className="flex items-center gap-6 mt-4 text-sm text-on-surface-variant">
              <div className="flex items-center gap-1.5 font-medium">
                <MapPin size={18} className="text-primary" />
                {project.location}
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Clock size={18} className="text-amber-500" />
                Closes in {project.closesIn}
              </div>
            </div>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Details */}
          <div className="lg:col-span-8 space-y-8">
            <section className="bg-white border border-surface-3 shadow-sm rounded-2xl p-8 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16" />
              <h3 className="text-lg font-black text-on-surface mb-6 border-b border-surface-2 pb-4 flex items-center gap-2">
                <FileText size={20} className="text-primary" />
                Project Intelligence
              </h3>
              <div className="prose prose-sm text-on-surface-variant max-w-none space-y-6 font-body leading-relaxed">
                <p>{project.overview}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-black text-muted block mb-1">System Capacity</span>
                    <span className="text-2xl font-black text-on-surface">{project.systemSize} <span className="text-sm font-medium text-muted">kWp</span></span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-black text-muted block mb-1">Energy Storage</span>
                    <span className="text-2xl font-black text-on-surface">{project.batteryStorage} <span className="text-sm font-medium text-muted">kWh</span></span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-black text-muted block mb-1">Architecture</span>
                    <span className="text-2xl font-black text-on-surface">{project.inverterType.split(' ')[0]}</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white border border-surface-3 shadow-sm rounded-2xl p-8">
              <h3 className="text-lg font-black text-on-surface mb-6 flex items-center gap-2">
                <Image size={20} className="text-primary" />
                Site Context Matrix
              </h3>
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 md:col-span-8">
                  <div className="rounded-2xl overflow-hidden bg-surface-2 relative group h-80 border border-surface-3">
                    <img src={project.images[0].url} alt={project.images[0].label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/40 backdrop-blur-md text-white text-xs font-medium">
                      {project.images[0].label}
                    </div>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-4 flex flex-col gap-4">
                  {project.images.slice(1).map((img: { url: string; label: string }, i: number) => (
                    <div key={i} className="flex-1 rounded-2xl overflow-hidden bg-surface-2 border border-surface-3 relative group min-h-[140px]">
                      <img src={img.url} alt={img.label} className="w-full h-full object-cover transition-all group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="bg-white border border-surface-3 shadow-sm rounded-2xl p-8">
              <h3 className="text-lg font-black text-on-surface mb-6 flex items-center gap-2">
                <Zap size={20} className="text-primary" />
                Technical Requirements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.requirements.map((req: string, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-surface-2 rounded-xl border border-surface-3">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <p className="text-xs font-bold text-on-surface-variant leading-relaxed">{req}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Sticky Bid Form */}
          <div className="lg:col-span-4 sticky top-28">
            <div className="bg-white border-2 border-primary/20 shadow-xl shadow-primary/5 rounded-[32px] p-8 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16" />
              <h3 className="text-2xl font-black text-on-surface mb-2 tracking-tight">Bid Configuration</h3>
              <p className="text-xs text-muted mb-8 leading-relaxed font-medium">Enter your binding proposal for this deployment. Total cost must be inclusive of all logistics.</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-black text-muted mb-3">Total Project Value (NGN)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold text-lg">₦</span>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      className="w-full bg-surface-2 border-0 border-b-2 border-surface-3 py-4 pl-10 pr-4 text-xl font-black text-on-surface focus:ring-0 focus:border-primary transition-all placeholder:text-muted rounded-t-xl"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] font-black text-muted mb-2">Est. Timeline</label>
                    <select
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      className="w-full bg-surface-2 border-0 border-b-2 border-surface-3 py-3 px-4 text-xs font-bold text-on-surface focus:ring-0 focus:border-primary transition-all rounded-t-xl appearance-none"
                    >
                      <option>1-2 Weeks</option>
                      <option>3-4 Weeks</option>
                      <option>1-2 Months</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] font-black text-muted mb-2">Warranty (Yrs)</label>
                    <input
                      type="number"
                      value={warranty}
                      onChange={(e) => setWarranty(e.target.value)}
                      className="w-full bg-surface-2 border-0 border-b-2 border-surface-3 py-3 px-4 text-xs font-bold text-on-surface focus:ring-0 focus:border-primary transition-all rounded-t-xl text-right"
                      placeholder="5"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-black text-muted mb-2">Technical Proposal</label>
                  <textarea
                    value={proposal}
                    onChange={(e) => setProposal(e.target.value)}
                    className="w-full bg-surface-2 border-0 border-b-2 border-surface-3 py-4 px-4 text-xs font-medium text-on-surface focus:ring-0 focus:border-primary transition-all placeholder:text-muted rounded-t-xl resize-none h-32"
                    placeholder="Describe your execution strategy..."
                    required
                  />
                  <div className="flex justify-between mt-1 px-1">
                    <span className="text-[9px] font-bold text-muted uppercase tracking-widest">{proposal.length}/50 min characters</span>
                  </div>
                </div>

                {isEpcContractor && (
                  <div className="pt-4 space-y-4">
                    <button
                      type="button"
                      onClick={() => setShowEnhancedFields(!showEnhancedFields)}
                      className="w-full py-2 bg-surface-2 border border-surface-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:bg-surface-3 transition-colors flex items-center justify-center gap-2"
                    >
                      <Briefcase size={14} />
                      {showEnhancedFields ? 'Collapse Enterprise Fields' : 'Expand Enterprise Bid Specs'}
                    </button>

                    {showEnhancedFields && (
                      <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                        <div>
                          <label className="block text-[10px] uppercase tracking-[0.2em] font-black text-muted mb-2">Management Plan</label>
                          <textarea
                            value={projectManagementPlan}
                            onChange={(e) => setProjectManagementPlan(e.target.value)}
                            className="w-full bg-surface-2 border-0 border-b-2 border-surface-3 py-3 px-4 text-[11px] font-medium text-on-surface focus:ring-0 focus:border-primary transition-all rounded-t-xl resize-none h-24"
                            placeholder="Deployment phases & milestones..."
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2">
                            <label className="block text-[10px] uppercase tracking-[0.2em] font-black text-muted mb-2">Estimated Crew Size</label>
                            <input
                              type="number"
                              value={estimatedCrewSize}
                              onChange={(e) => setEstimatedCrewSize(e.target.value)}
                              className="w-full bg-surface-2 border-0 border-b-2 border-surface-3 py-3 px-4 text-xs font-bold text-on-surface rounded-t-xl"
                              placeholder="e.g. 15"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-6 border-t border-surface-2">
                  <div className="flex justify-between items-center mb-6 px-2">
                    <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Platform Escrow Fee</span>
                    <span className="text-xs font-mono font-black text-on-surface-variant italic">Calculated at release</span>
                  </div>

                  {error && <p className="text-[10px] font-bold text-error mb-4 px-2 italic">{error}</p>}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full btn-kinetic text-white font-black text-sm py-5 rounded-2xl flex items-center justify-center gap-3 transition-transform duration-200 hover:scale-[0.98] shadow-xl shadow-primary/20"
                  >
                    {submitting ? 'Authenticating Bid...' : 'Submit Competitive Bid'}
                    <Send size={18} />
                  </button>
                </div>

                <div className="flex items-start gap-2 px-2 mt-4 opacity-70">
                  <AlertTriangle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[9px] font-bold text-muted uppercase leading-relaxed tracking-wider">
                    By submitting, you agree to the Smart Escrow terms and Sunlit Marketplace Protocol.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
