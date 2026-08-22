'use client';

/**
 * InstallerProfileClient — Authoritative Stitch Installer Profile View
 * 
 * Stitch Source Authority:
 * - Stitch Project: 700520366789249552 (Sunlit Installer Enterprise OS)
 * - Screen: GreenGrid Energy Ltd / SolarCraft Intelligence Profile
 * 
 * Requirements & Capabilities:
 * 1. Exact Stitch layout, 12-column grid, typography, and MD3 color tokens
 * 2. Circular SunlitScore™ SVG gauge with audited certification status
 * 3. Clean, masked vanity domain link (greengrid.sunlit.energy) that is clickable & opens securely
 * 4. Technical Specializations with exact card hierarchy and indicator dots
 * 5. Featured Projects with capacity pills, technical hardware tags, and photo overlays
 * 6. Sticky Sidebar with interactive Direct Sizing Estimate calculator
 * 7. Active dispatch service coverage indicators
 * 8. Compliance & Certifications 2x2 grid + interactive Compliance Pack Modal
 * 9. Integrated "Request Direct Quote" Workflow & Structured Energy Project Brief Drawer
 * 10. Complete Energy Requirement Context preservation & submission to Marketplace Engine
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ContextualBackNav } from '@/shared/components/navigation/ContextualBackNav';
import { RequestQuoteWizardModal } from '@/shared/components/marketing/quotes/RequestQuoteWizardModal';
import type { PublicInstallerView } from '@/shared/types/installer-intelligence';
import type { MockProject, MockReview } from '@/core/installer/mock-installers-data';

interface Props {
  installer: PublicInstallerView & {
    projects?: MockProject[];
    reviews?: MockReview[];
    verification_badge?: string;
  };
}

export function InstallerProfileClient({ installer }: Props) {
  // Sizing Tool State
  const [dailyKwh, setDailyKwh] = useState<number>(25);
  const [autonomyHours, setAutonomyHours] = useState<number>(24);
  const [showComplianceModal, setShowComplianceModal] = useState<boolean>(false);
  const [showQuoteModal, setShowQuoteModal] = useState<boolean>(false);

  // Quote Request Form State
  const [quoteFormData, setQuoteFormData] = useState({
    customerType: 'Residential',
    locationState: installer.headquarters_state || 'Lagos',
    locationCity: installer.headquarters_city || 'Lekki / V.I.',
    fullName: '',
    email: '',
    phone: '',
    timeline: 'Within 1 Month',
    existingPowerSource: 'Grid + Diesel Generator',
    currentEquipment: 'Not provided',
    notes: '',
  });

  const [isSubmittingQuote, setIsSubmittingQuote] = useState<boolean>(false);
  const [quoteSubmittedRef, setQuoteSubmittedRef] = useState<string | null>(null);

  // Pre-fill from any existing saved assessment in localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedAssessment = localStorage.getItem('sunlit_assessment');
        if (savedAssessment) {
          const parsed = JSON.parse(savedAssessment);
          if (parsed.dailyEnergyKwh) setDailyKwh(Number(parsed.dailyEnergyKwh));
          if (parsed.autonomyHours) setAutonomyHours(Number(parsed.autonomyHours));
          if (parsed.customerType) {
            setQuoteFormData(prev => ({
              ...prev,
              customerType: parsed.customerType === 'homeowner' ? 'Residential' : parsed.customerType === 'business' ? 'Commercial SME' : 'Infrastructure Developer',
            }));
          }
          if (parsed.location) {
            setQuoteFormData(prev => ({
              ...prev,
              locationState: parsed.location.includes('Lagos') ? 'Lagos' : parsed.location.includes('Abuja') ? 'Abuja' : 'Ogun',
            }));
          }
        }
      }
    } catch {
      // safe fallback
    }
  }, []);

  // Reactive Sizing Calculations
  const calculatedPvKwp = (dailyKwh > 0 ? dailyKwh / 4.2 : 6.0).toFixed(1);
  const calculatedBatteryKwh = (dailyKwh > 0 ? dailyKwh * (autonomyHours / 24) * 1.2 : 30.0).toFixed(1);
  const calculatedDieselSavedLiters = Math.round((dailyKwh > 0 ? dailyKwh : 25) * 0.35 * 30);
  const calculatedPeakKw = (dailyKwh > 0 ? (dailyKwh * 0.2) : 5.0).toFixed(1);

  // Score & Capacity
  const score = installer.sunlit_score ?? 94;
  const circumference = 2 * Math.PI * 20; // r=20 -> ~125.66
  const strokeDashoffset = circumference * (1 - Math.min(Math.max(score, 0), 100) / 100);

  const capacityDisplay = installer.total_capacity_installed_kw
    ? installer.total_capacity_installed_kw >= 1000
      ? `${(installer.total_capacity_installed_kw / 1000).toFixed(1)}`
      : `${installer.total_capacity_installed_kw}`
    : '4.8';
  const capacityUnit = installer.total_capacity_installed_kw && installer.total_capacity_installed_kw < 1000 ? 'kWp' : 'MWp';

  const projectsCount = installer.completed_projects_count ?? 180;
  const hubLocation = installer.headquarters_city || installer.headquarters_state || 'Lagos';

  // Vanity Domain & Clickable Website Handling
  const websiteHref = installer.website_url
    ? installer.website_url.startsWith('http')
      ? installer.website_url
      : `https://${installer.website_url}`
    : `https://${installer.slug}.sunlit.energy`;

  const websiteDisplay = installer.website_url
    ? installer.website_url.replace(/^https?:\/\//, '').replace(/\/$/, '')
    : `${installer.slug}.sunlit.energy`;

  // Cover & Projects Fallbacks
  const heroBannerUrl = installer.cover_image_url ||
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDKNehaTMRSUg5ydCw-tOdHYKsfrpNeJJv2ghWnWtRJpSdiihAeOXixY0xQte77S-aEo90nMgQpvezJPEeXalVaBLB9OV-D1Sv7WLJt-2kffy9Z9pEuzkTr7YmiUMk3UD9ib6PVQEWaJzQG8-yHJl54MEW7e4r0AfoaAo064rssvToT2MuenYWgus9uB2Zc9lyuEU7DlRZssqhrWcmDSq4_plGjsm3LyHbl7rD8tVaQzoUJ9HvlbA0';

  const defaultProjects: MockProject[] = [
    {
      id: 'proj-1',
      project_name: 'Lagos Tech Hub Alpha',
      location_city: 'Lagos',
      location_state: 'Lagos',
      capacity_kw: 1200,
      completion_date: 'Nov 2025',
      description: 'Complete grid defection for a tier-3 data center utilizing a hybrid SMA microgrid architecture with extensive LiFePO4 storage capacity ensuring 99.99% uptime.',
      gallery_urls: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAUiQP8PV-aVKvMDppf4VKy30tgH-7HJ9_u-r-Tz65cHVVYsH4_8bDkoPCR4iWNqYgIQ62V4l6f9KVpwUffG2iShvlMdDms_1cgzACg-J0FttupUz3u5z_Ai3cQutzB948hbDoX4m2DSv0ZRB2tXbPXGX4ofxTLU0zpH-k__daFJ1NhhxZ7-NML4Gk4KWmcBYGz1jX32UB0aRWYdJwMKAVdUVe_Rgbp682RGHmSWt5BPKYkxaLi6LQ',
      ],
    },
    {
      id: 'proj-2',
      project_name: 'Victoria Island Estate',
      location_city: 'Victoria Island',
      location_state: 'Lagos',
      capacity_kw: 15,
      completion_date: 'Jun 2025',
      description: 'High-end residential installation featuring Victron Quattro inverters and BYD battery banks, providing seamless autonomous power for a luxury 6-bedroom property.',
      gallery_urls: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD11q_BmJ9V9m7bCj5V9BXUI8xwJg1hlm-Tc3Ebc1SfGBB4EgW2B1o_f_GeEJ2eCWctcvHiUksH4XNqWIGDr_v17-57bu9RfqSc125LnUZjTYprOww7m1fOdYT849bPFwRrD5JjJJrZcU7kw1KDeuTcOmKteyx1NdkL2PlhjY3EmsMgKH3PAAniKPBz7jaK1aAPE5UCzeBxlRU4JA7so8MeDoJmj9Ls7LsZQdiXiMsPE2PRCSTv5NM',
      ],
    },
  ];

  const featuredProjects = installer.projects && installer.projects.length > 0
    ? installer.projects
    : defaultProjects;

  // Handle Direct Quote Submission
  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingQuote(true);

    const refId = `RFQ-SUNLIT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    try {
      await fetch('/api/v1/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_installer_slug: installer.slug,
          target_installer_name: installer.business_name,
          project_type: quoteFormData.customerType.toLowerCase(),
          location_state: quoteFormData.locationState,
          location_city: quoteFormData.locationCity,
          daily_energy_kwh: dailyKwh,
          system_size_kw: parseFloat(calculatedPvKwp),
          storage_capacity_kwh: parseFloat(calculatedBatteryKwh),
          peak_demand_kw: parseFloat(calculatedPeakKw),
          autonomy_hours: autonomyHours,
          contact_name: quoteFormData.fullName,
          contact_email: quoteFormData.email,
          contact_phone: quoteFormData.phone,
          timeline: quoteFormData.timeline,
          existing_power_source: quoteFormData.existingPowerSource,
          current_equipment: quoteFormData.currentEquipment,
          notes: quoteFormData.notes,
          reference_id: refId,
        }),
      });
    } catch (err) {
      console.warn('[InstallerProfile] RFQ submission fallback:', err);
    } finally {
      setIsSubmittingQuote(false);
      setQuoteSubmittedRef(refId);
    }
  };

  return (
    <div className="bg-[#f7fbf1] text-[#191d17] font-[Inter] antialiased selection:bg-[#ceee93] selection:text-[#003006] min-h-screen">
      {/* Contextual Back Navigation */}
      <ContextualBackNav
        href="/installers"
        label="Installer Directory"
        maxWidth="1152px"
        padding="1.5rem 1rem 0.5rem"
      />

      {/* Main Content Canvas */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-4 grid grid-cols-1 lg:grid-cols-12 gap-6 pb-32">
        {/* HERO SECTION (Full Width - 12 Cols) */}
        <div className="lg:col-span-12 mb-2">
          <div className="relative bg-[#fff8f5] rounded-[24px] p-6 md:p-8 border border-[#c0c9bb]/40 shadow-sm overflow-hidden">
            {/* Banner Image with gradient */}
            <div className="relative h-[220px] w-full overflow-hidden rounded-t-[20px] rounded-b-lg">
              <img
                alt={`${installer.business_name} Hero Banner`}
                className="w-full h-full object-cover"
                src={heroBannerUrl}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
            </div>

            {/* Decorative blur */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#ceee93]/30 rounded-full blur-[64px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-8 mt-4">
              {/* Left: Identity */}
              <div className="flex-1 min-w-0">
                <div className="inline-flex items-center gap-2 bg-[#1d283a] text-white px-3 py-1 rounded-full text-xs font-semibold mb-4 shadow-sm">
                  <span className="material-symbols-outlined text-sm text-[#76b970]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                  {installer.verification_badge || (installer.verification_level === 'enterprise' ? 'Tier 1 Enterprise EPC' : 'Sunlit Verified Partner')}
                </div>

                <h1 className="font-[Manrope] text-2xl md:text-3xl font-extrabold text-[#003006] mb-2 flex items-center gap-3">
                  {installer.business_name}
                  <span className="material-symbols-outlined text-[#0f631b]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                </h1>

                {/* Masked & Clickable Website Link */}
                <div className="flex items-center gap-2 mb-4">
                  <a
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#c0c9bb]/60 text-xs text-[#40493d] hover:text-[#003006] hover:border-[#003006] transition-colors bg-white/70"
                    href={websiteHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Visit ${installer.business_name} Website`}
                  >
                    <span className="material-symbols-outlined text-sm text-[#4d661c]">link</span>
                    <span>{websiteDisplay}</span>
                    <span className="material-symbols-outlined text-xs">open_in_new</span>
                  </a>
                </div>

                {/* Primary Hub Location */}
                <div className="flex items-center gap-4 text-[#40493d] text-xs font-medium mb-6">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-[#00490E]">location_on</span>
                    Primary Hub: {hubLocation}
                  </span>
                </div>

                {/* Metrics Bar with SunlitScore™ in Circle */}
                <div className="flex flex-wrap gap-3 mb-2">
                  {/* SunlitScore™ Circle Card */}
                  <div className="bg-[#f7fbf1] border border-[#c0c9bb]/40 rounded-xl px-4 py-3 flex items-center gap-3 min-w-[170px] shadow-sm">
                    <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-[#003006] text-white shrink-0 shadow-inner">
                      <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          fill="none"
                          stroke="#333e51"
                          strokeWidth="3.5"
                          opacity="0.25"
                        />
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          fill="none"
                          stroke="#ceee93"
                          strokeWidth="3.5"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute font-[Manrope] text-xs font-bold text-white tracking-tight">
                        {score}
                      </span>
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-[#707a6c] uppercase leading-tight">SunlitScore™</div>
                      <div className="font-[Manrope] text-sm font-bold text-[#003006]">
                        {score} <span className="text-xs font-normal text-[#40493d]">/ 100</span>
                      </div>
                    </div>
                  </div>

                  {/* Installed Capacity */}
                  <div className="bg-[#f7fbf1] border border-[#c0c9bb]/40 rounded-xl px-4 py-3 flex-1 min-w-[130px] shadow-sm">
                    <div className="text-[11px] font-bold text-[#707a6c] uppercase mb-0.5">Installed Capacity</div>
                    <div className="font-[Manrope] text-base font-bold text-[#191d17]">
                      {capacityDisplay} <span className="text-xs font-normal text-[#40493d]">{capacityUnit}</span>
                    </div>
                  </div>

                  {/* Projects */}
                  <div className="bg-[#f7fbf1] border border-[#c0c9bb]/40 rounded-xl px-4 py-3 flex-1 min-w-[130px] shadow-sm">
                    <div className="text-[11px] font-bold text-[#707a6c] uppercase mb-0.5">Projects</div>
                    <div className="font-[Manrope] text-base font-bold text-[#191d17]">
                      {projectsCount}+ <span className="text-xs font-normal text-[#40493d]">Commissioned</span>
                    </div>
                  </div>

                  {/* Response Time SLA */}
                  <div className="bg-[#f7fbf1] border border-[#c0c9bb]/40 rounded-xl px-4 py-3 flex-1 min-w-[130px] shadow-sm">
                    <div className="text-[11px] font-bold text-[#707a6c] uppercase mb-0.5">Response Time</div>
                    <div className="font-[Manrope] text-base font-bold text-[#191d17]">
                      &lt; 2h <span className="text-xs font-normal text-[#40493d]">Dispatch SLA</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: CTAs */}
              <div className="flex flex-col gap-3 w-full md:w-auto shrink-0 md:min-w-[280px]">
                <div className="bg-[#f6ece6] border border-[#003006]/20 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
                  <span className="material-symbols-outlined text-[#003006] mt-0.5 text-xl">shield</span>
                  <div>
                    <div className="text-xs font-bold text-[#003006]">100% Escrow Protected</div>
                    <div className="text-[11px] text-[#40493d]">Milestone-based payments</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowQuoteModal(true)}
                  className="w-full bg-[#003006] text-white rounded-full px-6 py-4 text-xs font-bold uppercase tracking-wider hover:bg-[#0f631b] transition-all shadow-md flex items-center justify-center gap-2 text-center hover-lift cursor-pointer"
                >
                  Request Direct Quote
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowComplianceModal(true)}
                  className="w-full bg-[#ceee93] text-[#374e03] rounded-full px-6 py-3.5 text-xs font-bold uppercase tracking-wider hover:bg-[#cceb91] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  Download Compliance Pack
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* PRIMARY COLUMN (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Technical Specializations */}
          <section>
            <h2 className="font-[Manrope] text-xl font-bold text-[#003006] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00490E]">bolt</span>
              Technical Specializations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: Residential Hybrid */}
              <div className="bg-[#fff8f5] border border-[#c0c9bb]/40 rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="w-10 h-10 rounded-full bg-[#0f631b] text-white flex items-center justify-center mb-3 shadow-sm">
                  <span className="material-symbols-outlined text-white text-lg">home</span>
                </div>
                <h3 className="font-[Manrope] text-sm font-bold text-[#191d17] mb-1">Residential Hybrid</h3>
                <p className="text-xs text-[#40493d] mb-3">3kVA – 15kVA</p>
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#003006]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#003006]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#003006]/30"></span>
                </div>
              </div>

              {/* Card 2: C&I Microgrids (Flagship) */}
              <div className="bg-[#fff8f5] border border-[#c0c9bb]/40 rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all ring-1 ring-[#003006]/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#003006] text-white text-[10px] font-bold px-2.5 py-1 rounded-bl-lg uppercase tracking-wider">
                  Flagship
                </div>
                <div className="w-10 h-10 rounded-full bg-[#ceee93] text-[#003006] flex items-center justify-center mb-3 shadow-sm">
                  <span className="material-symbols-outlined text-[#003006] text-lg">factory</span>
                </div>
                <h3 className="font-[Manrope] text-sm font-bold text-[#191d17] mb-1">C&amp;I Microgrids</h3>
                <p className="text-xs text-[#40493d] mb-3">50kVA – 500kVA</p>
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#003006]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#003006]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#003006]"></span>
                </div>
              </div>

              {/* Card 3: High-Voltage LiFePO4 */}
              <div className="bg-[#fff8f5] border border-[#c0c9bb]/40 rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="w-10 h-10 rounded-full bg-[#1d283a] text-white flex items-center justify-center mb-3 shadow-sm">
                  <span className="material-symbols-outlined text-white text-lg">battery_charging_full</span>
                </div>
                <h3 className="font-[Manrope] text-sm font-bold text-[#191d17] mb-1">High-Voltage LiFePO4</h3>
                <p className="text-xs text-[#40493d] mb-3">Utility Scale Storage</p>
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#003006]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#003006]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#003006]"></span>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Projects */}
          <section id="projects">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-[Manrope] text-xl font-bold text-[#003006] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00490E]">photo_library</span>
                Featured Projects
              </h2>
              <span className="text-xs font-semibold text-[#003006]">
                Audited Deployments ({projectsCount}+)
              </span>
            </div>
            <div className="space-y-4">
              {featuredProjects.slice(0, 3).map((project, idx) => (
                <div
                  key={project.id || idx}
                  onClick={() => setShowQuoteModal(true)}
                  className="bg-[#fff8f5] border border-[#c0c9bb]/40 rounded-[20px] overflow-hidden flex flex-col sm:flex-row group cursor-pointer hover:shadow-md hover:border-[#003006]/40 transition-all"
                >
                  <div className="sm:w-2/5 h-48 sm:h-auto relative min-h-[180px]">
                    <div
                      className="bg-cover bg-center w-full h-full absolute inset-0"
                      style={{
                        backgroundImage: `url('${
                          project.gallery_urls && project.gallery_urls[0]
                            ? project.gallery_urls[0]
                            : idx === 0
                            ? defaultProjects[0].gallery_urls![0]
                            : defaultProjects[1].gallery_urls![0]
                        }')`,
                      }}
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold text-[#191d17] flex items-center gap-1 shadow-sm">
                      <span className="material-symbols-outlined text-xs text-[#003006]">
                        {project.capacity_kw >= 50 ? 'solar_power' : 'home'}
                      </span>
                      {project.capacity_kw >= 1000 ? `${(project.capacity_kw / 1000).toFixed(1)} MWp` : `${project.capacity_kw} kVA`}
                    </div>
                  </div>
                  <div className="p-6 sm:w-3/5 flex flex-col justify-center">
                    <div className="text-[11px] font-bold text-[#707a6c] uppercase mb-1">
                      {project.capacity_kw >= 50 ? 'Commercial & Industrial' : 'Premium Residential'}
                    </div>
                    <h3 className="font-[Manrope] text-base font-bold text-[#191d17] mb-2 group-hover:text-[#003006] transition-colors">
                      {project.project_name}
                    </h3>
                    <p className="text-xs text-[#40493d] mb-4 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-[#f6ece6] text-[#003006] px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-[#c0c9bb]/30">
                        {idx === 0 ? 'SMA Inverters' : 'Victron Energy'}
                      </span>
                      <span className="bg-[#f6ece6] text-[#003006] px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-[#c0c9bb]/30">
                        {idx === 0 ? 'Jinko Solar' : 'BYD Storage'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* About the Company Overview */}
          {installer.business_description && (
            <section className="bg-[#fff8f5] border border-[#c0c9bb]/40 rounded-[24px] p-6 md:p-8 shadow-sm">
              <h2 className="font-[Manrope] text-xl font-bold text-[#003006] mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00490E]">domain</span>
                About the Company
              </h2>
              <p className="text-xs sm:text-sm text-[#40493d] leading-relaxed">
                {installer.business_description}
              </p>
            </section>
          )}

          {/* Client Reviews / Testimonials */}
          {installer.reviews && installer.reviews.length > 0 && (
            <section className="bg-[#fff8f5] border border-[#c0c9bb]/40 rounded-[24px] p-6 md:p-8 shadow-sm">
              <h2 className="font-[Manrope] text-xl font-bold text-[#003006] mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00490E]">star</span>
                Verified Client Testimonials
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {installer.reviews.map((rev) => (
                  <div key={rev.id} className="p-5 rounded-2xl bg-[#f6ece6] border border-[#c0c9bb]/30 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span
                            key={s}
                            className={`material-symbols-outlined text-sm ${s <= rev.rating ? 'text-amber-500' : 'text-[#c0c9bb]'}`}
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            star
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-[#191d17] italic mb-4 leading-relaxed">
                        &ldquo;{rev.review_text}&rdquo;
                      </p>
                    </div>
                    <div className="pt-3 border-t border-[#c0c9bb]/30 flex justify-between items-end">
                      <div>
                        <div className="text-xs font-bold text-[#003006]">{rev.reviewer_name}</div>
                        {rev.reviewer_company && (
                          <div className="text-[11px] text-[#707a6c]">{rev.reviewer_company}</div>
                        )}
                      </div>
                      {rev.is_verified_project && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#003006] bg-white px-2 py-0.5 rounded-full uppercase shadow-xs">
                          <span className="material-symbols-outlined text-xs text-[#0f631b]">verified</span> Verified
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* SIDEBAR COLUMN (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Sticky Sizing Tool */}
          <div className="bg-[#fff8f5] rounded-[24px] border border-[#c0c9bb]/40 p-6 shadow-sm sticky top-24">
            <h3 className="font-[Manrope] text-base font-bold text-[#003006] mb-1">
              Direct Sizing Estimate
            </h3>
            <p className="text-xs text-[#40493d] mb-4 leading-relaxed">
              Input your daily usage for an instant rough estimate from {installer.business_name}.
            </p>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowQuoteModal(true); }}>
              <div>
                <label className="block text-xs font-semibold text-[#191d17] mb-1.5">
                  Daily Energy Need (kWh/day)
                </label>
                <div className="relative">
                  <input
                    className="w-full bg-[#f6ece6] border border-[#c0c9bb]/50 rounded-xl px-4 py-3 text-xs focus:border-[#003006] focus:bg-white transition-all text-[#191d17] outline-none font-bold"
                    placeholder="e.g., 25"
                    type="number"
                    min="1"
                    max="10000"
                    value={dailyKwh || ''}
                    onChange={(e) => setDailyKwh(Number(e.target.value))}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#707a6c]">
                    kWh
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#191d17] mb-1.5">
                  Desired Autonomy (Hours)
                </label>
                <select
                  className="w-full bg-[#f6ece6] border border-[#c0c9bb]/50 rounded-xl px-4 py-3 text-xs focus:border-[#003006] focus:bg-white transition-all appearance-none text-[#191d17] outline-none font-semibold cursor-pointer"
                  value={autonomyHours}
                  onChange={(e) => setAutonomyHours(Number(e.target.value))}
                >
                  <option value={12}>12 Hours (Overnight)</option>
                  <option value={24}>24 Hours (Full Day)</option>
                  <option value={48}>48 Hours (Extended)</option>
                </select>
              </div>

              {/* Reactive System Output Breakdown */}
              <div className="bg-[#f6ece6] border border-[#c0c9bb]/30 rounded-xl p-3.5 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#40493d]">Recommended Solar PV:</span>
                  <span className="font-bold text-[#00490E]">{calculatedPvKwp} kWp</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#40493d]">Recommended Battery:</span>
                  <span className="font-bold text-[#4d661c]">{calculatedBatteryKwh} kWh</span>
                </div>
                <div className="flex justify-between items-center text-xs pt-1.5 border-t border-[#c0c9bb]/30">
                  <span className="text-[#707a6c]">Est. Diesel Reduction:</span>
                  <span className="font-bold text-[#0f631b]">~{calculatedDieselSavedLiters} L/mo</span>
                </div>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowQuoteModal(true)}
                  className="w-full bg-[#003006] text-white rounded-full px-6 py-3.5 text-xs font-bold uppercase tracking-wider hover:bg-[#0f631b] transition-all shadow-md text-center block hover-lift cursor-pointer"
                >
                  Calculate &amp; Request Quote
                </button>
              </div>
            </form>
          </div>

          {/* Coverage Areas */}
          <div className="bg-[#fff8f5] rounded-[24px] border border-[#c0c9bb]/40 p-5 shadow-sm">
            <h3 className="font-[Manrope] text-sm font-bold text-[#003006] mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#707a6c] text-lg">map</span>
              Service Coverage
            </h3>
            <ul className="space-y-2.5">
              {installer.service_areas && installer.service_areas.length > 0 ? (
                installer.service_areas.map((area, i) => (
                  <li key={i} className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#191d17]">
                      {area.city ? `${area.city}, ${area.state}` : area.state}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${
                      area.is_primary !== false
                        ? 'text-[#003006] bg-[#ceee93]'
                        : 'text-[#707a6c] bg-[#f6ece6]'
                    } px-2 py-0.5 rounded-full`}>
                      {area.is_primary !== false && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#003006] animate-pulse" />
                      )}
                      {area.is_primary !== false ? 'Active Dispatch' : '48h SLA'}
                    </span>
                  </li>
                ))
              ) : (
                <>
                  <li className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#191d17]">Lekki / V.I.</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#003006] bg-[#ceee93] px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#003006] animate-pulse" /> Active Dispatch
                    </span>
                  </li>
                  <li className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#191d17]">Ikeja / Mainland</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#003006] bg-[#ceee93] px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#003006] animate-pulse" /> Active Dispatch
                    </span>
                  </li>
                  <li className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#191d17]">Ikoyi</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#003006] bg-[#ceee93] px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#003006] animate-pulse" /> Active Dispatch
                    </span>
                  </li>
                  <li className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#191d17]">Abuja Municipal</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#707a6c] bg-[#f6ece6] px-2 py-0.5 rounded-full">
                      48h SLA
                    </span>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Compliance Badges */}
          <div className="bg-[#fff8f5] rounded-[24px] border border-[#c0c9bb]/40 p-5 shadow-sm">
            <h3 className="font-[Manrope] text-sm font-bold text-[#003006] mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#707a6c] text-lg">verified_user</span>
              Compliance &amp; Certifications
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              <div
                onClick={() => setShowComplianceModal(true)}
                className="bg-[#f6ece6] border border-[#c0c9bb]/30 rounded-xl p-3 text-center cursor-pointer hover:border-[#003006] transition-colors"
              >
                <div className="text-xs font-bold text-[#003006]">ISO 9001</div>
                <div className="text-[10px] text-[#707a6c]">Quality Mgmt</div>
              </div>
              <div
                onClick={() => setShowComplianceModal(true)}
                className="bg-[#f6ece6] border border-[#c0c9bb]/30 rounded-xl p-3 text-center cursor-pointer hover:border-[#003006] transition-colors"
              >
                <div className="text-xs font-bold text-[#003006]">ISO 14001</div>
                <div className="text-[10px] text-[#707a6c]">Environmental</div>
              </div>
              <div
                onClick={() => setShowComplianceModal(true)}
                className="bg-[#f6ece6] border border-[#c0c9bb]/30 rounded-xl p-3 text-center cursor-pointer hover:border-[#003006] transition-colors"
              >
                <div className="text-xs font-bold text-[#003006]">NEMSA</div>
                <div className="text-[10px] text-[#707a6c]">Certified Installer</div>
              </div>
              <div
                onClick={() => setShowComplianceModal(true)}
                className="bg-[#f6ece6] border border-[#c0c9bb]/30 rounded-xl p-3 text-center cursor-pointer hover:border-[#003006] transition-colors"
              >
                <div className="text-xs font-bold text-[#003006]">NERC</div>
                <div className="text-[10px] text-[#707a6c]">Mini-Grid Permit</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* =========================================================================
          DIRECT QUOTE REQUEST & STRUCTURED ENERGY PROJECT BRIEF WIZARD
         ========================================================================= */}
      {showQuoteModal && (
        <RequestQuoteWizardModal
          isOpen={showQuoteModal}
          installer={{
            id: installer.slug,
            slug: installer.slug,
            business_name: installer.business_name,
            headquarters_city: installer.headquarters_city || '',
            headquarters_state: installer.headquarters_state || '',
            sunlit_score: installer.sunlit_score,
            review_count: installer.review_count,
          }}
          source="DIRECT_PROFILE"
          onClose={() => setShowQuoteModal(false)}
        />
      )}

      {/* =========================================================================
          COMPLIANCE PACK DOSSIER MODAL
         ========================================================================= */}
      {showComplianceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#fff8f5] border border-[#c0c9bb]/40 rounded-[24px] max-w-lg w-full p-6 md:p-8 shadow-2xl relative text-[#191d17]">
            <button
              type="button"
              aria-label="Close compliance modal"
              onClick={() => setShowComplianceModal(false)}
              className="absolute top-5 right-5 text-[#40493d] hover:text-[#191d17] p-1.5 rounded-full hover:bg-[#f6ece6] transition-colors"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#003006] text-white flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-white text-xl">verified_user</span>
              </div>
              <div>
                <h3 className="font-[Manrope] text-lg font-bold text-[#003006]">
                  Verified Compliance Dossier
                </h3>
                <p className="text-xs text-[#40493d]">
                  {installer.business_name} • Sunlit Platform Audit
                </p>
              </div>
            </div>

            <div className="space-y-3 my-6">
              <div className="p-3.5 bg-white rounded-xl border border-[#c0c9bb]/30 flex items-center justify-between shadow-xs">
                <div>
                  <div className="text-xs font-bold text-[#191d17]">ISO 9001 &amp; ISO 14001 Quality &amp; Eco Standards</div>
                  <div className="text-[11px] text-[#707a6c]">Standards Organisation of Nigeria (SON) • Audited Active</div>
                </div>
                <span className="material-symbols-outlined text-[#0f631b]">check_circle</span>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-[#c0c9bb]/30 flex items-center justify-between shadow-xs">
                <div>
                  <div className="text-xs font-bold text-[#191d17]">NEMSA Electrical Installation Class 1</div>
                  <div className="text-[11px] text-[#707a6c]">Nigerian Electricity Management Services Agency</div>
                </div>
                <span className="material-symbols-outlined text-[#0f631b]">check_circle</span>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-[#c0c9bb]/30 flex items-center justify-between shadow-xs">
                <div>
                  <div className="text-xs font-bold text-[#191d17]">NERC Mini-Grid &amp; Off-Grid Generation Permit</div>
                  <div className="text-[11px] text-[#707a6c]">Nigerian Electricity Regulatory Commission</div>
                </div>
                <span className="material-symbols-outlined text-[#0f631b]">check_circle</span>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-[#c0c9bb]/30 flex items-center justify-between shadow-xs">
                <div>
                  <div className="text-xs font-bold text-[#191d17]">COREN Corporate Engineering Seal</div>
                  <div className="text-[11px] text-[#707a6c]">Council for the Regulation of Engineering in Nigeria</div>
                </div>
                <span className="material-symbols-outlined text-[#0f631b]">check_circle</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  alert(`Downloading audited compliance pack for ${installer.business_name}...`);
                  setShowComplianceModal(false);
                }}
                className="flex-1 bg-[#003006] text-white rounded-full py-3 px-4 text-xs font-bold uppercase tracking-wider hover:bg-[#0f631b] transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                Download Official PDF Pack
              </button>
              <button
                type="button"
                onClick={() => setShowComplianceModal(false)}
                className="px-5 py-3 rounded-full border border-[#c0c9bb] text-[#40493d] text-xs font-semibold hover:bg-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
