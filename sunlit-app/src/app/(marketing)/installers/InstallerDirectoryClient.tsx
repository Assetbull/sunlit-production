'use client';

/**
 * InstallerDirectoryClient — Main Directory Landing Page
 * 
 * Stitch Source: installer-directory.html (screen 41a2eb5a)
 * Faithful reproduction of the approved Stitch design:
 * - Hero with gradient overlay + search bar + filter chips
 * - Trust indicators (2,500+ verified, 15k+ projects, 4.9/5 reviews)
 * - Interactive directory grid with live filters and state handling
 * - Network activity feed (3-column cards)
 * - High-performance SVG icons (SunlitIcon)
 * 
 * Typography: Manrope (headlines), Inter (body)
 * Colors: #003006 primary, #4d661c secondary, #f9faf3 background
 * Shape: rounded-[20px] cards, rounded-full buttons, glass panels
 */

import React, { useState, useEffect, useCallback } from 'react';
import { SunlitIcon } from '@/shared/components/ui/SunlitIcon';
import type { PublicInstallerCardView } from '@/shared/types/installer-intelligence';

// =============================================
// InstallerCard — From Stitch Visual Design
// =============================================
function InstallerCard({ installer }: { installer: PublicInstallerCardView }) {
  const verificationBadge = {
    unverified: { label: 'Unverified', color: 'bg-gray-100 text-gray-600', icon: 'info' },
    basic: { label: 'Registered', color: 'bg-blue-50 text-blue-700', icon: 'verified' },
    tier_3_verified: { label: 'Registered', color: 'bg-blue-50 text-blue-700', icon: 'verified' },
    standard: { label: 'Verified Partner', color: 'bg-green-50 text-green-700', icon: 'verified' },
    tier_2_verified: { label: 'Verified Partner', color: 'bg-green-50 text-green-700', icon: 'verified' },
    advanced: { label: 'Advanced EPC', color: 'bg-emerald-50 text-emerald-800', icon: 'shield_check' },
    enterprise: { label: 'Enterprise EPC', color: 'bg-[#bcf0b2]/40 text-[#003006]', icon: 'shield_check' },
    tier_1_verified: { label: 'Enterprise EPC', color: 'bg-[#bcf0b2]/40 text-[#003006]', icon: 'shield_check' },
  }[installer.verification_level] || { label: 'Verified Partner', color: 'bg-green-50 text-green-700', icon: 'verified' };

  return (
    <a
      href={`/installers/${installer.slug}`}
      className="group bg-[#fff8f5] rounded-[20px] p-6 shadow-[0_4px_40px_rgba(0,25,2,0.04)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between border border-[#c2c9bc]/30 hover:border-[#003006]/30"
    >
      <div>
        <div className="flex items-start gap-4 mb-4">
          {installer.logo_url ? (
            <img
              src={installer.logo_url}
              alt={installer.business_name}
              className="w-14 h-14 rounded-xl object-cover border border-[#c2c9bc]/30"
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-[#003006]/10 text-[#003006] flex items-center justify-center shrink-0">
              <SunlitIcon name="solar_power" size={28} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-[Manrope] font-semibold text-[#191c18] text-lg truncate group-hover:text-[#003006] transition-colors">
              {installer.business_name}
            </h3>
            <p className="font-[Inter] text-sm text-[#42493f] flex items-center gap-1 mt-0.5">
              <SunlitIcon name="location_on" size={14} className="text-[#4d661c]" />
              {installer.headquarters_city && `${installer.headquarters_city}, `}
              {installer.headquarters_state}
            </p>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${verificationBadge.color}`}>
            <SunlitIcon name={verificationBadge.icon} size={13} />
            {verificationBadge.label}
          </span>
          {installer.sunlit_score != null && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#003006]/10 text-[#003006]">
              <SunlitIcon name="star" size={12} fill />
              {installer.sunlit_score}/100
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-[#42493f] font-[Inter] mb-4">
          {installer.average_rating != null && (
            <span className="flex items-center gap-1 font-semibold text-[#191c18]">
              <SunlitIcon name="star" size={15} className="text-amber-500" fill />
              {installer.average_rating.toFixed(1)} <span className="text-[#72796e] font-normal">({installer.review_count})</span>
            </span>
          )}
          <span className="flex items-center gap-1">
            <SunlitIcon name="check_circle" size={15} className="text-[#003006]" />
            {installer.completed_projects_count} projects
          </span>
        </div>
      </div>

      {/* Services */}
      {installer.services && installer.services.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#c2c9bc]/20">
          {installer.services.slice(0, 3).map((service) => (
            <span key={service} className="px-2.5 py-0.5 rounded-full bg-[#ceee93]/30 text-[#4d661c] text-xs font-medium font-[Inter]">
              {service}
            </span>
          ))}
          {installer.services.length > 3 && (
            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-[Inter]">
              +{installer.services.length - 3}
            </span>
          )}
        </div>
      )}
    </a>
  );
}

// =============================================
// SearchBar — Stitch Glass Panel Design
// =============================================
function SearchBar({
  onSearch,
  currentQuery = '',
  currentLocation = '',
}: {
  onSearch: (query: string, location: string) => void;
  currentQuery?: string;
  currentLocation?: string;
}) {
  const [query, setQuery] = useState(currentQuery);
  const [location, setLocation] = useState(currentLocation);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, location);
  };

  return (
    <div
      className="max-w-3xl mx-auto p-3 md:p-4 rounded-full mt-10 shadow-[0_8px_40px_rgba(0,25,2,0.06)]"
      style={{
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(0, 48, 6, 0.1)',
      }}
    >
      <form className="flex flex-col sm:flex-row items-center gap-3 w-full" onSubmit={handleSubmit}>
        <div className="flex-grow flex items-center bg-white rounded-full px-5 py-3 border border-[#003006]/15 focus-within:border-[#003006] transition-colors w-full">
          <SunlitIcon name="search" size={20} className="text-[#42493f] mr-3" />
          <input
            className="w-full bg-transparent border-none outline-none font-[Inter] text-base text-[#191c18] placeholder:text-[#72796e] focus:ring-0"
            placeholder="Search installer name, capability, or service..."
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="hidden md:flex items-center bg-white rounded-full px-5 py-3 border border-[#003006]/15 focus-within:border-[#003006] transition-colors">
          <SunlitIcon name="location_on" size={20} className="text-[#42493f] mr-3" />
          <input
            className="w-36 bg-transparent border-none outline-none font-[Inter] text-base text-[#191c18] placeholder:text-[#72796e] focus:ring-0"
            placeholder="State or City"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto bg-[#001902] text-white px-8 py-3.5 rounded-full font-[Inter] text-sm font-semibold tracking-wider hover:bg-[#003006] transition-all shadow-md whitespace-nowrap cursor-pointer"
        >
          Search Directory
        </button>
      </form>
    </div>
  );
}

// =============================================
// TrustIndicators — Stitch Design
// =============================================
function TrustIndicators() {
  const indicators = [
    { value: '2,500+', label: 'Verified Businesses' },
    { value: '15k+', label: 'Active Projects' },
    { value: '4.9/5', label: 'Verified Reviews' },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-12">
      {indicators.map((item) => (
        <div key={item.label} className="flex flex-col items-center">
          <span className="font-[Manrope] text-[32px] leading-[40px] font-bold text-[#003006]">
            {item.value}
          </span>
          <span className="font-[Inter] text-xs font-semibold text-[#42493f] uppercase tracking-widest mt-1">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// =============================================
// ActivityCard — Stitch Design
// =============================================
function ActivityCard({
  icon,
  title,
  timestamp,
  description,
}: {
  icon: string;
  title: string;
  timestamp: string;
  description: string;
}) {
  return (
    <div className="bg-[#fff8f5] rounded-[20px] p-6 shadow-[0_4px_40px_rgba(0,25,2,0.04)] hover:-translate-y-1 transition-transform duration-300 border border-[#c2c9bc]/30">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-[#003006]/10 flex items-center justify-center text-[#003006]">
          <SunlitIcon name={icon} size={24} />
        </div>
        <div>
          <h3 className="font-[Inter] text-sm font-semibold text-[#191c18]">{title}</h3>
          <p className="text-xs text-[#72796e] mt-0.5">{timestamp}</p>
        </div>
      </div>
      <p className="font-[Inter] text-sm text-[#42493f] line-clamp-2 leading-relaxed">{description}</p>
    </div>
  );
}

// =============================================
// Main Directory Client Component
// =============================================
export function InstallerDirectoryClient() {
  const [installers, setInstallers] = useState<PublicInstallerCardView[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [queryText, setQueryText] = useState('');
  const [locationText, setLocationText] = useState('');

  const fetchInstallers = useCallback(async (query?: string, location?: string, filterKey?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (location) params.set('state', location);

      if (filterKey === 'lagos') params.set('state', 'Lagos');
      if (filterKey === 'abuja') params.set('state', 'Abuja');
      if (filterKey === 'ogun') params.set('state', 'Ogun');
      if (filterKey === 'rivers') params.set('state', 'Rivers');
      if (filterKey === 'tier_1') params.set('verification', 'tier_1_verified');
      if (filterKey === 'commercial') params.set('q', 'commercial');
      if (filterKey === 'residential') params.set('q', 'residential');

      params.set('limit', '16');

      const res = await fetch(`/api/v1/installers?${params.toString()}`);
      const data = await res.json();
      setInstallers(data.data || []);
    } catch {
      console.error('Failed to fetch installers');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load on component mount
  useEffect(() => {
    fetchInstallers();
  }, [fetchInstallers]);

  const handleSearch = useCallback(
    (query: string, location: string) => {
      setQueryText(query);
      setLocationText(location);
      setActiveFilter('custom');
      fetchInstallers(query, location);
    },
    [fetchInstallers]
  );

  const handleFilterClick = (filterKey: string) => {
    setActiveFilter(filterKey);
    setQueryText('');
    setLocationText('');
    fetchInstallers(undefined, undefined, filterKey);
  };

  const filterButtons = [
    { key: 'all', label: 'All Installers' },
    { key: 'lagos', label: 'Lagos Hub' },
    { key: 'abuja', label: 'Abuja Hub' },
    { key: 'ogun', label: 'Ogun Hub' },
    { key: 'rivers', label: 'Rivers Hub' },
    { key: 'tier_1', label: 'Tier 1 Enterprise' },
    { key: 'commercial', label: 'Commercial & EPC' },
    { key: 'residential', label: 'Residential Solar' },
  ];

  return (
    <div className="bg-[#f9faf3] text-[#191c18] min-h-screen flex flex-col antialiased">
      {/* Hero Section — Stitch: installer-directory.html */}
      <section className="relative min-h-[750px] flex items-center justify-center px-5 md:px-20 overflow-hidden pt-28 pb-16">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#f9faf3]/60 via-[#f9faf3] to-[#f9faf3] z-10" />
          <div className="w-full h-full bg-gradient-to-br from-[#003006]/5 via-transparent to-[#4d661c]/5" />
        </div>
        <div className="relative z-10 w-full max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#bcf0b2]/30 text-[#003006] text-xs font-bold uppercase tracking-wider mb-2">
            <SunlitIcon name="shield_check" size={14} />
            Verified Energy Network
          </div>
          <h1 className="font-[Manrope] text-4xl sm:text-6xl md:text-7xl font-bold text-[#003006] leading-tight tracking-tight text-balance">
            Discover{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(to right, #003006, #4d661c)',
              }}
            >
              Resilient
            </span>{' '}
            Energy Solutions
          </h1>
          <p className="font-[Inter] text-base md:text-lg text-[#42493f] max-w-2xl mx-auto text-balance">
            Connect with our verified network of enterprise-grade installers, EPC contractors, and ecological innovators across Nigeria.
          </p>

          <SearchBar
            onSearch={handleSearch}
            currentQuery={queryText}
            currentLocation={locationText}
          />

          {/* Quick Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4 max-w-4xl mx-auto">
            {filterButtons.map((btn) => (
              <button
                key={btn.key}
                onClick={() => handleFilterClick(btn.key)}
                className={`px-4 py-2 rounded-full font-[Inter] text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  activeFilter === btn.key
                    ? 'bg-[#001902] text-white shadow-sm'
                    : 'bg-white/80 hover:bg-white text-[#42493f] border border-[#c2c9bc]/40 hover:border-[#003006]/30'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <TrustIndicators />
        </div>
      </section>

      {/* Directory Grid Section */}
      <section className="py-20 px-5 md:px-20 bg-[#f3f4ed] border-t border-[#c2c9bc]/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4d661c] animate-pulse"></span>
                <span className="font-[Inter] text-xs font-bold uppercase tracking-wider text-[#4d661c]">
                  Active Intelligence Directory
                </span>
              </div>
              <h2 className="font-[Manrope] text-3xl md:text-4xl font-semibold text-[#003006]">
                {loading
                  ? 'Loading Verified Installers...'
                  : installers.length > 0
                  ? `${installers.length} Verified Installer${installers.length !== 1 ? 's' : ''}`
                  : 'No Installers Found'}
              </h2>
              <p className="font-[Inter] text-sm md:text-base text-[#42493f] mt-1">
                {installers.length > 0
                  ? 'Independent technical due diligence, verified project milestones, and real client reviews.'
                  : 'Try broadening your search or choosing another state hub.'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="/request-quote"
                className="bg-[#001902] text-white px-6 py-2.5 rounded-full font-[Inter] text-xs font-semibold hover:bg-[#003006] transition-all shadow-sm flex items-center gap-1.5"
              >
                <SunlitIcon name="clipboard" size={14} />
                Post Project RFQ
              </a>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-[#fff8f5] rounded-[20px] p-6 animate-pulse border border-[#c2c9bc]/20">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gray-200" />
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : installers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {installers.map((installer) => (
                <InstallerCard key={installer.slug} installer={installer} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#fff8f5] rounded-[20px] p-8 border border-dashed border-[#c2c9bc]">
              <div className="w-16 h-16 rounded-full bg-[#003006]/10 text-[#003006] flex items-center justify-center mx-auto mb-4">
                <SunlitIcon name="search" size={32} />
              </div>
              <h3 className="font-[Manrope] text-xl font-semibold text-[#191c18] mb-2">No matching installers found</h3>
              <p className="font-[Inter] text-sm text-[#42493f] max-w-md mx-auto mb-6">
                We couldn&apos;t find any verified installers matching your exact filter. Try clearing filters to view all available providers.
              </p>
              <button
                onClick={() => handleFilterClick('all')}
                className="bg-[#001902] text-white px-6 py-2.5 rounded-full font-[Inter] text-sm font-semibold hover:bg-[#003006] transition-all cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Network Activity Section — Stitch Design */}
      <section className="py-32 px-5 md:px-20 bg-[#f9faf3] border-t border-[#c2c9bc]/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-[Manrope] text-3xl md:text-4xl font-semibold text-[#003006] mb-2">
                Latest Network Activity
              </h2>
              <p className="font-[Inter] text-base text-[#42493f]">
                Real-time milestone verifications and telemetry updates across Nigeria.
              </p>
            </div>
            <a
              href="/installers"
              className="hidden md:flex items-center text-[#003006] font-[Inter] text-sm font-semibold hover:text-[#4d661c] transition-colors gap-1"
            >
              View Full Feed <SunlitIcon name="arrow_forward" size={16} />
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ActivityCard
              icon="solar_power"
              title="New Installation Certified"
              timestamp="Just now • Lekki, Lagos"
              description="SolarCraft Energy successfully deployed and telemetry-verified a 1.2MWp industrial microgrid."
            />
            <ActivityCard
              icon="shield_check"
              title="Partner Tier 1 Verified"
              timestamp="2 hours ago • Maitama, Abuja"
              description="HelioCore Energy achieved Tier 1 Enterprise status after completing COREN and NEMSA compliance reviews."
            />
            <ActivityCard
              icon="zap"
              title="Agro Microgrid Matched"
              timestamp="5 hours ago • Sagamu, Ogun"
              description="A 450 kWp agro-processing solar-plus-storage project was matched with verified EPC engineering contractors."
            />
          </div>
        </div>
      </section>
    </div>
  );
}
