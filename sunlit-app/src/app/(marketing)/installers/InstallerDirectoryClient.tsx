'use client';

/**
 * InstallerDirectoryClient — Main Directory Landing Page
 * 
 * Stitch Source: installer-directory.html (screen 41a2eb5a)
 * Faithful reproduction of the approved Stitch design:
 * - Hero with gradient overlay + search bar
 * - Trust indicators (2,500+ verified, 15k+ projects, 4.9/5 reviews)
 * - Network activity feed (3-column cards)
 * - Footer
 * 
 * Typography: Manrope (headlines), Inter (body)
 * Colors: #003006 primary, #4d661c secondary, #f9faf3 background
 * Shape: rounded-[20px] cards, rounded-full buttons, glass panels
 */

import React, { useState, useEffect, useCallback } from 'react';
import type { PublicInstallerCardView } from '@/shared/types/installer-intelligence';

// =============================================
// InstallerCard — From Stitch Visual Design
// =============================================
function InstallerCard({ installer }: { installer: PublicInstallerCardView }) {
  const verificationBadge = {
    unverified: { label: 'Unverified', color: 'bg-gray-100 text-gray-600' },
    basic: { label: 'Basic', color: 'bg-blue-50 text-blue-700' },
    standard: { label: 'Verified', color: 'bg-green-50 text-green-700' },
    advanced: { label: 'Advanced', color: 'bg-emerald-50 text-emerald-800' },
    enterprise: { label: 'Enterprise', color: 'bg-amber-50 text-amber-800' },
  }[installer.verification_level] || { label: 'Unverified', color: 'bg-gray-100 text-gray-600' };

  return (
    <a
      href={`/installers/${installer.slug}`}
      className="group bg-[#fff8f5] rounded-[20px] p-6 shadow-[0_4px_40px_rgba(0,25,2,0.04)] hover:-translate-y-1 transition-all duration-300 block"
    >
      <div className="flex items-start gap-4 mb-4">
        {installer.logo_url ? (
          <img
            src={installer.logo_url}
            alt={installer.business_name}
            className="w-14 h-14 rounded-xl object-cover"
          />
        ) : (
          <div className="w-14 h-14 rounded-xl bg-[#003006]/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-[#003006] text-2xl">solar_power</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-[Manrope] font-semibold text-[#191c18] text-lg truncate group-hover:text-[#003006] transition-colors">
            {installer.business_name}
          </h3>
          <p className="font-[Inter] text-sm text-[#42493f]">
            {installer.headquarters_city && `${installer.headquarters_city}, `}
            {installer.headquarters_state}
          </p>
        </div>
      </div>

      {/* Trust Signals */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${verificationBadge.color}`}>
          <span className="material-symbols-outlined text-xs" style={{ fontSize: '14px' }}>verified</span>
          {verificationBadge.label}
        </span>
        {installer.sunlit_score != null && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#003006]/10 text-[#003006]">
            <span className="material-symbols-outlined text-xs" style={{ fontSize: '14px' }}>star</span>
            {installer.sunlit_score}/100
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-[#42493f] font-[Inter]">
        {installer.average_rating != null && (
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-amber-500" style={{ fontSize: '16px' }}>star</span>
            {installer.average_rating.toFixed(1)} ({installer.review_count})
          </span>
        )}
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[#003006]" style={{ fontSize: '16px' }}>check_circle</span>
          {installer.completed_projects_count} projects
        </span>
      </div>

      {/* Services */}
      {installer.services && installer.services.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {installer.services.slice(0, 3).map((service) => (
            <span key={service} className="px-2 py-0.5 rounded-full bg-[#ceee93]/30 text-[#4d661c] text-xs font-[Inter]">
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
}: {
  onSearch: (query: string, location: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, location);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 rounded-full mt-12 shadow-[0_4px_40px_rgba(0,25,2,0.04)]"
      style={{
        background: 'rgba(249, 250, 243, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <form className="flex items-center gap-4 w-full" onSubmit={handleSubmit}>
        <div className="flex-grow flex items-center bg-white rounded-full px-6 py-3 border border-[#003006]/20 focus-within:border-[#003006] transition-colors">
          <span className="material-symbols-outlined text-[#42493f] mr-3">search</span>
          <input
            className="w-full bg-transparent border-none outline-none font-[Inter] text-base text-[#191c18] placeholder:text-[#72796e] focus:ring-0"
            placeholder="What do you need?"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="hidden md:flex items-center bg-white rounded-full px-6 py-3 border border-[#003006]/20">
          <span className="material-symbols-outlined text-[#42493f] mr-3">location_on</span>
          <input
            className="w-32 bg-transparent border-none outline-none font-[Inter] text-base text-[#191c18] placeholder:text-[#72796e] focus:ring-0"
            placeholder="Current Location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-[#003006] text-white px-8 py-4 rounded-full font-[Inter] text-sm font-semibold tracking-wider hover:bg-[#003006]/90 transition-colors whitespace-nowrap"
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
    <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-16">
      {indicators.map((item) => (
        <div key={item.label} className="flex flex-col items-center">
          <span className="font-[Manrope] text-[32px] leading-[40px] font-semibold text-[#003006]">
            {item.value}
          </span>
          <span className="font-[Inter] text-sm font-semibold text-[#42493f] uppercase tracking-widest mt-2">
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
    <div className="bg-[#fff8f5] rounded-[20px] p-6 shadow-[0_4px_40px_rgba(0,25,2,0.04)] hover:-translate-y-1 transition-transform duration-300">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-[#003006]/10 flex items-center justify-center text-[#003006]">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div>
          <h3 className="font-[Inter] text-sm font-semibold text-[#191c18]">{title}</h3>
          <p className="text-sm text-[#72796e]">{timestamp}</p>
        </div>
      </div>
      <p className="font-[Inter] text-base text-[#42493f] line-clamp-2">{description}</p>
    </div>
  );
}

// =============================================
// Main Directory Client Component
// =============================================
export function InstallerDirectoryClient() {
  const [installers, setInstallers] = useState<PublicInstallerCardView[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const fetchInstallers = useCallback(async (query?: string, location?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (location) params.set('state', location);
      params.set('limit', '12');

      const res = await fetch(`/api/v1/installers?${params.toString()}`);
      const data = await res.json();
      setInstallers(data.data || []);
      setSearched(true);
    } catch {
      console.error('Failed to fetch installers');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = useCallback(
    (query: string, location: string) => {
      fetchInstallers(query, location);
    },
    [fetchInstallers]
  );

  return (
    <div className="bg-[#f9faf3] text-[#191c18] min-h-screen flex flex-col antialiased">
      {/* Hero Section — Stitch: installer-directory.html */}
      <section className="relative min-h-[819px] flex items-center justify-center px-5 md:px-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#f9faf3] to-[#f9faf3] z-10 opacity-80" />
          <div className="w-full h-full bg-gradient-to-br from-[#003006]/5 via-transparent to-[#4d661c]/5" />
        </div>
        <div className="relative z-10 w-full max-w-5xl mx-auto text-center space-y-8 mt-12">
          <h1 className="font-[Manrope] text-5xl md:text-7xl font-bold text-[#003006] leading-tight tracking-tight">
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
          <p className="font-[Inter] text-lg text-[#42493f] max-w-2xl mx-auto">
            Connect with our verified network of enterprise-grade installers and ecological innovators across Nigeria.
          </p>
          <SearchBar onSearch={handleSearch} />
          <TrustIndicators />
        </div>
      </section>

      {/* Search Results (shown after search) */}
      {searched && (
        <section className="py-20 px-5 md:px-20 bg-[#f3f4ed]">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="font-[Manrope] text-3xl md:text-4xl font-semibold text-[#003006] mb-4">
                  {installers.length > 0
                    ? `${installers.length} Installer${installers.length !== 1 ? 's' : ''} Found`
                    : 'No Installers Found'}
                </h2>
                <p className="font-[Inter] text-base text-[#42493f]">
                  {installers.length > 0
                    ? 'Verified businesses matching your search criteria.'
                    : 'Try adjusting your search terms or location.'}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-[#fff8f5] rounded-[20px] p-6 animate-pulse">
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
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {installers.map((installer) => (
                  <InstallerCard key={installer.slug} installer={installer} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Network Activity Section — Stitch Design */}
      <section className="py-40 px-5 md:px-20 bg-[#f3f4ed]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-[Manrope] text-3xl md:text-4xl font-semibold text-[#003006] mb-4">
                Latest Network Activity
              </h2>
              <p className="font-[Inter] text-base text-[#42493f]">
                Real-time updates from our ecosystem.
              </p>
            </div>
            <button className="hidden md:flex items-center text-[#003006] font-[Inter] text-sm font-semibold hover:text-[#4d661c] transition-colors">
              View All Activity{' '}
              <span className="material-symbols-outlined ml-2 text-sm">arrow_forward</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ActivityCard
              icon="solar_power"
              title="New Installation Certified"
              timestamp="Just now • Lagos, Nigeria"
              description="SolarCraft Energy successfully deployed a 50kW commercial array, verified by Sunlit protocols."
            />
            <ActivityCard
              icon="verified"
              title="Partner Verified"
              timestamp="2 hours ago • Abuja, Nigeria"
              description="Apex Energy Partners achieved Tier 1 Enterprise status after completing ecological compliance reviews."
            />
            <ActivityCard
              icon="handshake"
              title="Project Matched"
              timestamp="5 hours ago • Port Harcourt, Nigeria"
              description="A major commercial grid resilience project was successfully matched with 3 certified local vendors."
            />
          </div>
        </div>
      </section>
    </div>
  );
}
