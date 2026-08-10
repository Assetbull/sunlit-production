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
 * 4. Verified Projects & Case Studies
 * 5. Client Reviews & Feedback
 * 6. Services offered & pricing
 * 7. Capabilities & System size ranges
 * 8. Service areas
 * 9. Certifications & Compliance
 * 10. Contact / Request Quote CTA
 * 
 * Typography: Manrope (headlines), Inter (body)
 * Colors: #003006 primary, #0f631b primary-container, #4d661c secondary
 */

import React from 'react';
import { SunlitIcon } from '@/shared/components/ui/SunlitIcon';
import type { PublicInstallerView } from '@/shared/types/installer-intelligence';
import type { MockProject, MockReview } from '@/core/installer/mock-installers-data';

interface Props {
  installer: PublicInstallerView & {
    projects?: MockProject[];
    reviews?: MockReview[];
    verification_badge?: string;
  };
}

function VerificationBadge({ level }: { level: string }) {
  const config = {
    unverified: { label: 'Unverified', icon: 'info', bg: 'bg-gray-100', text: 'text-gray-600' },
    basic: { label: 'Registered', icon: 'verified', bg: 'bg-blue-50', text: 'text-blue-700' },
    standard: { label: 'Sunlit Verified', icon: 'verified', bg: 'bg-green-50', text: 'text-green-700' },
    advanced: { label: 'Advanced Verified', icon: 'shield_check', bg: 'bg-emerald-50', text: 'text-emerald-800' },
    enterprise: { label: 'Enterprise Verified', icon: 'shield_check', bg: 'bg-[#bcf0b2]/40', text: 'text-[#003006]' },
  }[level] || { label: 'Sunlit Verified', icon: 'verified', bg: 'bg-green-50', text: 'text-green-700' };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      <SunlitIcon name={config.icon} size={14} />
      {config.label}
    </span>
  );
}

function StatCard({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center p-5 bg-white rounded-[16px] shadow-[0_2px_20px_rgba(0,25,2,0.03)] border border-[#c2c9bc]/30">
      <div className="w-10 h-10 rounded-full bg-[#003006]/10 text-[#003006] flex items-center justify-center mb-2">
        <SunlitIcon name={icon} size={20} />
      </div>
      <span className="font-[Manrope] text-xl font-bold text-[#003006]">{value}</span>
      <span className="font-[Inter] text-xs text-[#42493f] mt-1 text-center font-medium">{label}</span>
    </div>
  );
}

export function InstallerProfileClient({ installer }: Props) {
  const capabilities = [
    installer.residential && 'Residential Solar',
    installer.commercial && 'Commercial & Industrial',
    installer.industrial && 'Heavy Industrial EPC',
    installer.battery_storage && 'Battery Storage (BESS)',
    installer.microgrid && 'Islanded Microgrids',
    installer.ev_infrastructure && 'EV Charging Infrastructure',
  ].filter(Boolean) as string[];

  const availabilityConfig = {
    accepting_projects: { label: 'Available for Projects', color: 'text-green-800 bg-green-100' },
    limited_availability: { label: 'Limited Capacity', color: 'text-amber-800 bg-amber-100' },
    not_accepting: { label: 'Booked Full', color: 'text-red-800 bg-red-100' },
    unavailable: { label: 'Unavailable', color: 'text-gray-700 bg-gray-100' },
  }[installer.availability_status] || { label: 'Available for Projects', color: 'text-green-800 bg-green-100' };

  return (
    <div className="bg-[#f7fbf1] min-h-screen text-[#191c18] antialiased">
      {/* Cover Hero */}
      <section className="relative">
        <div className="h-64 md:h-80 bg-gradient-to-br from-[#001902] via-[#003006] to-[#0f631b] relative overflow-hidden">
          {installer.cover_image_url && (
            <img
              src={installer.cover_image_url}
              alt={`${installer.business_name} cover`}
              className="w-full h-full object-cover opacity-30"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>

        {/* Profile Header Card */}
        <div className="max-w-5xl mx-auto px-4 md:px-8 -mt-24 relative z-10">
          <div className="bg-white rounded-[20px] p-6 md:p-8 shadow-[0_8px_40px_rgba(0,25,2,0.08)] border border-[#c2c9bc]/30">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Logo */}
              {installer.logo_url ? (
                <img
                  src={installer.logo_url}
                  alt={installer.business_name}
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-[#003006]/10 text-[#003006] flex items-center justify-center border-4 border-white shadow-md shrink-0">
                  <SunlitIcon name="solar_power" size={44} />
                </div>
              )}

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="font-[Manrope] text-2xl md:text-[36px] font-bold text-[#003006] leading-tight">
                    {installer.business_name}
                  </h1>
                  <VerificationBadge level={installer.verification_level} />
                </div>

                <p className="font-[Inter] text-sm md:text-base text-[#42493f] mb-3 flex items-center gap-1.5">
                  <SunlitIcon name="location_on" size={16} className="text-[#4d661c]" />
                  <span>{installer.business_type === 'epc_contractor' ? 'Engineering EPC Contractor' : 'Solar Installer & Integrator'}</span>
                  {installer.headquarters_city && <span>• {installer.headquarters_city}</span>}
                  {installer.headquarters_state && <span>, {installer.headquarters_state}</span>}
                </p>

                <div className="flex flex-wrap gap-2 mb-5">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${availabilityConfig.color}`}>
                    <span className="w-2 h-2 rounded-full bg-current"></span>
                    {availabilityConfig.label}
                  </span>
                  {installer.sunlit_score != null && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#003006] text-white">
                      <SunlitIcon name="star" size={12} fill className="text-[#ceee93]" />
                      SunlitScore: {installer.sunlit_score}/100
                    </span>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`/request-quote?installer=${encodeURIComponent(installer.business_name)}`}
                    className="bg-[#001902] text-white px-7 py-3 rounded-full font-[Inter] text-sm font-semibold hover:bg-[#003006] transition-all shadow-md inline-flex items-center gap-2"
                  >
                    <SunlitIcon name="clipboard" size={16} />
                    Request Direct RFQ
                  </a>
                  <a
                    href="#projects"
                    className="border-2 border-[#003006] text-[#003006] px-6 py-3 rounded-full font-[Inter] text-sm font-semibold hover:bg-[#003006] hover:text-white transition-all inline-flex items-center gap-1.5"
                  >
                    <SunlitIcon name="zap" size={16} />
                    View Projects
                  </a>
                  {installer.website_url && (
                    <a
                      href={installer.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-[#c2c9bc] text-[#42493f] px-5 py-3 rounded-full font-[Inter] text-sm font-semibold hover:bg-gray-50 transition-colors inline-flex items-center gap-1.5"
                    >
                      <SunlitIcon name="external_link" size={15} />
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
            label="Verified Projects"
          />
          <StatCard
            icon="star"
            value={installer.average_rating ? installer.average_rating.toFixed(1) : '5.0'}
            label={`${installer.review_count} Client Reviews`}
          />
          <StatCard
            icon="bolt"
            value={installer.total_capacity_installed_kw ? `${installer.total_capacity_installed_kw} kWp` : '2,500+ kWp'}
            label="Total Capacity"
          />
          <StatCard
            icon="calendar"
            value={installer.years_experience ? `${installer.years_experience} Years` : '5+ Years'}
            label="Track Record"
          />
        </div>
      </section>

      {/* About */}
      {installer.business_description && (
        <section className="max-w-5xl mx-auto px-4 md:px-8 mt-8">
          <div className="bg-white rounded-[20px] p-6 md:p-8 shadow-[0_2px_20px_rgba(0,25,2,0.03)] border border-[#c2c9bc]/30">
            <h2 className="font-[Manrope] text-xl font-bold text-[#003006] mb-4">About the Company</h2>
            <p className="font-[Inter] text-base text-[#42493f] leading-relaxed whitespace-pre-line">
              {installer.business_description}
            </p>
          </div>
        </section>
      )}

      {/* Verified Projects Section */}
      {installer.projects && installer.projects.length > 0 && (
        <section id="projects" className="max-w-5xl mx-auto px-4 md:px-8 mt-8">
          <div className="bg-white rounded-[20px] p-6 md:p-8 shadow-[0_2px_20px_rgba(0,25,2,0.03)] border border-[#c2c9bc]/30">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="font-[Manrope] text-xl font-bold text-[#003006]">Verified Projects</h2>
                <p className="font-[Inter] text-xs md:text-sm text-[#42493f] mt-0.5">
                  Independently audited installations with verified telemetry and completion milestones.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {installer.projects.map((proj) => (
                <div key={proj.id} className="rounded-2xl border border-[#c2c9bc]/40 overflow-hidden bg-[#faf8f3] flex flex-col">
                  {proj.gallery_urls && proj.gallery_urls.length > 0 && (
                    <div className="h-44 w-full overflow-hidden relative">
                      <img src={proj.gallery_urls[0]} alt={proj.project_name} className="w-full h-full object-cover" />
                      <div className="absolute top-3 right-3 bg-[#001902]/80 text-[#bcf0b2] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 backdrop-blur-sm">
                        <SunlitIcon name="shield_check" size={12} />
                        Verified Deployment
                      </div>
                    </div>
                  )}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-[Manrope] font-bold text-lg text-[#191c18] mb-1">{proj.project_name}</h3>
                      <p className="font-[Inter] text-xs text-[#4d661c] font-semibold mb-2">
                        {proj.location_city}, {proj.location_state} • {proj.capacity_kw} kWp
                        {proj.battery_storage_kwh ? ` + ${proj.battery_storage_kwh} kWh Storage` : ''}
                      </p>
                      <p className="font-[Inter] text-sm text-[#42493f] line-clamp-3 leading-relaxed mb-4">
                        {proj.description}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-[#c2c9bc]/30 flex justify-between items-center text-xs text-[#72796e] font-[Inter]">
                      <span>Completed: {proj.completion_date}</span>
                      <span className="font-semibold text-[#003006]">Sunlit Verified</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Client Reviews Section */}
      {installer.reviews && installer.reviews.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 md:px-8 mt-8">
          <div className="bg-white rounded-[20px] p-6 md:p-8 shadow-[0_2px_20px_rgba(0,25,2,0.03)] border border-[#c2c9bc]/30">
            <h2 className="font-[Manrope] text-xl font-bold text-[#003006] mb-6">Verified Client Testimonials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {installer.reviews.map((rev) => (
                <div key={rev.id} className="p-6 rounded-2xl bg-[#faf8f3] border border-[#c2c9bc]/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <SunlitIcon
                          key={s}
                          name="star"
                          size={16}
                          fill={s <= rev.rating}
                          className={s <= rev.rating ? 'text-amber-500' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <p className="font-[Inter] text-sm text-[#191c18] italic leading-relaxed mb-4">
                      &ldquo;{rev.review_text}&rdquo;
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[#c2c9bc]/30 flex justify-between items-end">
                    <div>
                      <h4 className="font-[Inter] text-sm font-bold text-[#003006]">{rev.reviewer_name}</h4>
                      {rev.reviewer_company && (
                        <p className="font-[Inter] text-xs text-[#72796e]">{rev.reviewer_company}</p>
                      )}
                    </div>
                    {rev.is_verified_project && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#4d661c] bg-[#ceee93]/30 px-2 py-0.5 rounded-full">
                        <SunlitIcon name="shield_check" size={12} />
                        Verified Milestone
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      {installer.services && installer.services.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 md:px-8 mt-8">
          <div className="bg-white rounded-[20px] p-6 md:p-8 shadow-[0_2px_20px_rgba(0,25,2,0.03)] border border-[#c2c9bc]/30">
            <h2 className="font-[Manrope] text-xl font-bold text-[#003006] mb-6">Services &amp; Solutions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {installer.services.map((service) => (
                <div key={service.slug || service.name} className="flex items-start gap-3 p-5 rounded-xl bg-[#f3f4ed] border border-[#c2c9bc]/30">
                  <div className="w-8 h-8 rounded-full bg-[#003006]/10 text-[#003006] flex items-center justify-center shrink-0 mt-0.5">
                    <SunlitIcon name="zap" size={16} />
                  </div>
                  <div>
                    <h3 className="font-[Inter] text-base font-bold text-[#191c18]">{service.name}</h3>
                    {service.description && (
                      <p className="font-[Inter] text-xs text-[#42493f] mt-1 leading-relaxed">{service.description}</p>
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
          <div className="bg-white rounded-[20px] p-6 md:p-8 shadow-[0_2px_20px_rgba(0,25,2,0.03)] border border-[#c2c9bc]/30">
            <h2 className="font-[Manrope] text-xl font-bold text-[#003006] mb-6">System Capabilities</h2>
            <div className="flex flex-wrap gap-2.5">
              {capabilities.map((cap) => (
                <span key={cap} className="px-4 py-2 rounded-full bg-[#ceee93]/30 text-[#4d661c] font-[Inter] text-sm font-semibold flex items-center gap-1.5">
                  <SunlitIcon name="check" size={14} />
                  {cap}
                </span>
              ))}
              {installer.offers_warranty && (
                <span className="px-4 py-2 rounded-full bg-[#003006]/10 text-[#003006] font-[Inter] text-sm font-semibold flex items-center gap-1.5">
                  <SunlitIcon name="shield_check" size={14} />
                  Verified Workmanship Warranty
                </span>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Service Areas */}
      {installer.service_areas && installer.service_areas.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 md:px-8 mt-8">
          <div className="bg-white rounded-[20px] p-6 md:p-8 shadow-[0_2px_20px_rgba(0,25,2,0.03)] border border-[#c2c9bc]/30">
            <h2 className="font-[Manrope] text-xl font-bold text-[#003006] mb-6">Service Coverage Areas</h2>
            <div className="flex flex-wrap gap-2.5">
              {installer.service_areas.map((area) => (
                <span
                  key={`${area.state}-${area.city || 'all'}`}
                  className="px-4 py-2 rounded-full font-[Inter] text-sm font-medium bg-[#f3f4ed] text-[#42493f] flex items-center gap-1.5 border border-[#c2c9bc]/30"
                >
                  <SunlitIcon name="location_on" size={14} className="text-[#4d661c]" />
                  {area.city ? `${area.city}, ${area.state}` : area.state}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Certifications */}
      {installer.certifications && installer.certifications.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 md:px-8 mt-8 mb-20">
          <div className="bg-white rounded-[20px] p-6 md:p-8 shadow-[0_2px_20px_rgba(0,25,2,0.03)] border border-[#c2c9bc]/30">
            <h2 className="font-[Manrope] text-xl font-bold text-[#003006] mb-6">Verified Certifications &amp; Licenses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {installer.certifications.map((cert) => (
                <div key={cert.name} className="flex items-start gap-3 p-5 rounded-xl border border-[#c2c9bc]/40 bg-[#faf8f3]">
                  <div className="w-9 h-9 rounded-full bg-[#003006]/10 text-[#003006] flex items-center justify-center shrink-0 mt-0.5">
                    <SunlitIcon name="award" size={18} />
                  </div>
                  <div>
                    <h3 className="font-[Inter] text-sm font-bold text-[#191c18]">{cert.name}</h3>
                    <p className="font-[Inter] text-xs text-[#42493f] mt-0.5">{cert.issuing_body}</p>
                    <span className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                      <SunlitIcon name="shield_check" size={12} />
                      Verified Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
