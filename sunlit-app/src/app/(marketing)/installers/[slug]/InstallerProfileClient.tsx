'use client';

/**
 * InstallerProfileClient — Installer Profile Page
 * 
 * Stitch Source: installer-homepage.html (screen eb03153d)
 * Faithful reproduction of the approved Stitch design.
 * 
 * Sections:
 * 1. Cover hero with logo, name, verification badge, SunlitScore
 * 2. Quick stats bar (projects, rating, capacity, experience)
 * 3. About / description
 * 4. Services offered
 * 5. Service areas
 * 6. Certifications
 * 7. Contact / Request Quote CTA
 * 
 * Typography: Manrope (headlines), Inter (body)
 * Colors: #003006 primary, #0f631b primary-container, #4d661c secondary
 */

import React from 'react';
import type { PublicInstallerView } from '@/shared/types/installer-intelligence';

interface Props {
  installer: PublicInstallerView;
}

function VerificationBadge({ level }: { level: string }) {
  const config = {
    unverified: { label: 'Unverified', icon: 'help', bg: 'bg-gray-100', text: 'text-gray-600' },
    basic: { label: 'Basic Verified', icon: 'verified_user', bg: 'bg-blue-50', text: 'text-blue-700' },
    standard: { label: 'Sunlit Verified', icon: 'verified', bg: 'bg-green-50', text: 'text-green-700' },
    advanced: { label: 'Advanced Verified', icon: 'workspace_premium', bg: 'bg-emerald-50', text: 'text-emerald-800' },
    enterprise: { label: 'Enterprise Verified', icon: 'shield', bg: 'bg-amber-50', text: 'text-amber-800' },
  }[level] || { label: 'Unverified', icon: 'help', bg: 'bg-gray-100', text: 'text-gray-600' };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{config.icon}</span>
      {config.label}
    </span>
  );
}

function StatCard({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-[16px] shadow-[0_2px_20px_rgba(0,25,2,0.03)]">
      <span className="material-symbols-outlined text-[#003006] mb-2" style={{ fontSize: '24px' }}>{icon}</span>
      <span className="font-[Manrope] text-xl font-bold text-[#003006]">{value}</span>
      <span className="font-[Inter] text-xs text-[#42493f] mt-1 text-center">{label}</span>
    </div>
  );
}

export function InstallerProfileClient({ installer }: Props) {
  const capabilities = [
    installer.residential && 'Residential',
    installer.commercial && 'Commercial',
    installer.industrial && 'Industrial',
    installer.battery_storage && 'Battery Storage',
    installer.microgrid && 'Microgrids',
    installer.ev_infrastructure && 'EV Infrastructure',
  ].filter(Boolean) as string[];

  const availabilityConfig = {
    accepting_projects: { label: 'Accepting Projects', color: 'text-green-700 bg-green-50' },
    limited_availability: { label: 'Limited Availability', color: 'text-amber-700 bg-amber-50' },
    not_accepting: { label: 'Not Accepting', color: 'text-red-700 bg-red-50' },
    unavailable: { label: 'Unavailable', color: 'text-gray-600 bg-gray-100' },
  }[installer.availability_status] || { label: 'Unknown', color: 'text-gray-600 bg-gray-100' };

  return (
    <div className="bg-[#f7fbf1] min-h-screen text-[#191c18] antialiased">
      {/* Cover Hero */}
      <section className="relative">
        <div className="h-64 md:h-80 bg-gradient-to-br from-[#003006] via-[#0f631b] to-[#003006] relative overflow-hidden">
          {installer.cover_image_url && (
            <img
              src={installer.cover_image_url}
              alt={`${installer.business_name} cover`}
              className="w-full h-full object-cover opacity-30"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        {/* Profile Card */}
        <div className="max-w-5xl mx-auto px-4 md:px-8 -mt-24 relative z-10">
          <div className="bg-white rounded-[20px] p-6 md:p-8 shadow-[0_4px_40px_rgba(0,25,2,0.08)]">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Logo */}
              {installer.logo_url ? (
                <img
                  src={installer.logo_url}
                  alt={installer.business_name}
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-[#003006]/10 flex items-center justify-center border-4 border-white shadow-lg">
                  <span className="material-symbols-outlined text-[#003006] text-4xl">solar_power</span>
                </div>
              )}

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="font-[Manrope] text-2xl md:text-[40px] font-bold text-[#003006] leading-tight">
                    {installer.business_name}
                  </h1>
                  <VerificationBadge level={installer.verification_level} />
                </div>

                <p className="font-[Inter] text-base text-[#42493f] mb-3">
                  {installer.business_type === 'epc_contractor' ? 'EPC Contractor' : 'Solar Installer'}
                  {installer.headquarters_city && ` • ${installer.headquarters_city}`}
                  {installer.headquarters_state && `, ${installer.headquarters_state}`}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${availabilityConfig.color}`}>
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>circle</span>
                    {availabilityConfig.label}
                  </span>
                  {installer.sunlit_score != null && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-[#003006] text-white">
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>star</span>
                      SunlitScore: {installer.sunlit_score}/100
                    </span>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3">
                  <button className="bg-[#003006] text-white px-6 py-3 rounded-full font-[Inter] text-sm font-semibold hover:bg-[#003006]/90 transition-colors">
                    Request Quote
                  </button>
                  <button className="border border-[#003006] text-[#003006] px-6 py-3 rounded-full font-[Inter] text-sm font-semibold hover:bg-[#003006]/5 transition-colors">
                    View Projects
                  </button>
                  {installer.website_url && (
                    <a
                      href={installer.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-[#42493f]/30 text-[#42493f] px-6 py-3 rounded-full font-[Inter] text-sm font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>open_in_new</span>
                      Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="max-w-5xl mx-auto px-4 md:px-8 mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon="check_circle"
            value={String(installer.completed_projects_count)}
            label="Completed Projects"
          />
          <StatCard
            icon="star"
            value={installer.average_rating ? installer.average_rating.toFixed(1) : 'N/A'}
            label={`${installer.review_count} Reviews`}
          />
          <StatCard
            icon="bolt"
            value={installer.total_capacity_installed_kw > 0 ? `${(installer.total_capacity_installed_kw / 1000).toFixed(1)} MW` : 'N/A'}
            label="Total Capacity"
          />
          <StatCard
            icon="calendar_month"
            value={installer.years_experience ? `${installer.years_experience} yrs` : 'N/A'}
            label="Experience"
          />
        </div>
      </section>

      {/* About */}
      {installer.business_description && (
        <section className="max-w-5xl mx-auto px-4 md:px-8 mt-8">
          <div className="bg-white rounded-[20px] p-6 md:p-8 shadow-[0_2px_20px_rgba(0,25,2,0.03)]">
            <h2 className="font-[Manrope] text-xl font-semibold text-[#003006] mb-4">About</h2>
            <p className="font-[Inter] text-base text-[#42493f] leading-relaxed whitespace-pre-line">
              {installer.business_description}
            </p>
          </div>
        </section>
      )}

      {/* Services */}
      {installer.services && installer.services.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 md:px-8 mt-8">
          <div className="bg-white rounded-[20px] p-6 md:p-8 shadow-[0_2px_20px_rgba(0,25,2,0.03)]">
            <h2 className="font-[Manrope] text-xl font-semibold text-[#003006] mb-6">Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {installer.services.map((service) => (
                <div key={service.slug} className="flex items-start gap-3 p-4 rounded-xl bg-[#f3f4ed]">
                  <span className="material-symbols-outlined text-[#0f631b] mt-0.5" style={{ fontSize: '20px' }}>check_circle</span>
                  <div>
                    <p className="font-[Inter] text-sm font-medium text-[#191c18]">{service.name}</p>
                    {service.description && (
                      <p className="font-[Inter] text-xs text-[#42493f] mt-1">{service.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Capabilities */}
      {capabilities.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 md:px-8 mt-8">
          <div className="bg-white rounded-[20px] p-6 md:p-8 shadow-[0_2px_20px_rgba(0,25,2,0.03)]">
            <h2 className="font-[Manrope] text-xl font-semibold text-[#003006] mb-6">Capabilities</h2>
            <div className="flex flex-wrap gap-3">
              {capabilities.map((cap) => (
                <span key={cap} className="px-4 py-2 rounded-full bg-[#ceee93]/30 text-[#4d661c] font-[Inter] text-sm font-medium">
                  {cap}
                </span>
              ))}
              {installer.system_size_min_kw != null && installer.system_size_max_kw != null && (
                <span className="px-4 py-2 rounded-full bg-[#003006]/10 text-[#003006] font-[Inter] text-sm font-medium">
                  {installer.system_size_min_kw}–{installer.system_size_max_kw} kW
                </span>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Service Areas */}
      {installer.service_areas && installer.service_areas.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 md:px-8 mt-8">
          <div className="bg-white rounded-[20px] p-6 md:p-8 shadow-[0_2px_20px_rgba(0,25,2,0.03)]">
            <h2 className="font-[Manrope] text-xl font-semibold text-[#003006] mb-6">Service Areas</h2>
            <div className="flex flex-wrap gap-3">
              {installer.service_areas.map((area) => (
                <span
                  key={`${area.state}-${area.city}`}
                  className={`px-4 py-2 rounded-full font-[Inter] text-sm font-medium ${
                    area.is_primary
                      ? 'bg-[#003006] text-white'
                      : 'bg-[#f3f4ed] text-[#42493f]'
                  }`}
                >
                  <span className="material-symbols-outlined mr-1" style={{ fontSize: '14px', verticalAlign: 'middle' }}>location_on</span>
                  {area.city ? `${area.city}, ${area.state}` : area.state}
                  {area.is_primary && ' (HQ)'}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Certifications */}
      {installer.certifications && installer.certifications.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 md:px-8 mt-8">
          <div className="bg-white rounded-[20px] p-6 md:p-8 shadow-[0_2px_20px_rgba(0,25,2,0.03)]">
            <h2 className="font-[Manrope] text-xl font-semibold text-[#003006] mb-6">Certifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {installer.certifications.map((cert) => (
                <div key={cert.name} className="flex items-start gap-3 p-4 rounded-xl border border-[#c2c9bc]">
                  <span className="material-symbols-outlined text-[#0f631b]" style={{ fontSize: '24px' }}>workspace_premium</span>
                  <div>
                    <p className="font-[Inter] text-sm font-medium text-[#191c18]">{cert.name}</p>
                    <p className="font-[Inter] text-xs text-[#42493f]">{cert.issuing_body}</p>
                    {cert.verified_at && (
                      <span className="inline-flex items-center gap-1 mt-2 text-xs text-green-700">
                        <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>verified</span>
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Additional Info */}
      <section className="max-w-5xl mx-auto px-4 md:px-8 mt-8 mb-20">
        <div className="bg-white rounded-[20px] p-6 md:p-8 shadow-[0_2px_20px_rgba(0,25,2,0.03)]">
          <h2 className="font-[Manrope] text-xl font-semibold text-[#003006] mb-6">Additional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {installer.offers_warranty && (
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#0f631b]" style={{ fontSize: '20px' }}>shield</span>
                <div>
                  <p className="font-[Inter] text-sm font-medium text-[#191c18]">Warranty</p>
                  <p className="font-[Inter] text-xs text-[#42493f]">Offers warranty coverage</p>
                </div>
              </div>
            )}
            {installer.offers_maintenance && (
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#0f631b]" style={{ fontSize: '20px' }}>build</span>
                <div>
                  <p className="font-[Inter] text-sm font-medium text-[#191c18]">Maintenance</p>
                  <p className="font-[Inter] text-xs text-[#42493f]">Provides maintenance services</p>
                </div>
              </div>
            )}
            {installer.offers_financing && (
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#0f631b]" style={{ fontSize: '20px' }}>payments</span>
                <div>
                  <p className="font-[Inter] text-sm font-medium text-[#191c18]">Financing</p>
                  <p className="font-[Inter] text-xs text-[#42493f]">Financing options available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
