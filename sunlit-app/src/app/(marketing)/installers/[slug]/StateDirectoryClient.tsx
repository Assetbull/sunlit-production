'use client';

/**
 * StateDirectoryClient — State Directory Page
 * 
 * Stitch Source: solar-installers-lagos.html (screen fa57695d)
 * Displays city navigation, filtered installer directory, and matching CTA.
 */

import React, { useState, useEffect } from 'react';
import { SunlitIcon } from '@/shared/components/ui/SunlitIcon';
import type { PublicInstallerCardView } from '@/shared/types/installer-intelligence';

interface Props {
  stateSlug: string;
  stateName: string;
}

const STATE_CITIES: Record<string, { name: string; slug: string }[]> = {
  lagos: [
    { name: 'Lekki', slug: 'lekki' },
    { name: 'Victoria Island', slug: 'victoria-island' },
    { name: 'Ikoyi', slug: 'ikoyi' },
    { name: 'Ikeja', slug: 'ikeja' },
    { name: 'Ajah', slug: 'ajah' },
    { name: 'Surulere', slug: 'surulere' },
    { name: 'Yaba', slug: 'yaba' },
  ],
  abuja: [
    { name: 'Maitama', slug: 'maitama' },
    { name: 'Wuse', slug: 'wuse' },
    { name: 'Garki', slug: 'garki' },
    { name: 'Asokoro', slug: 'asokoro' },
    { name: 'Jabi', slug: 'jabi' },
  ],
  rivers: [
    { name: 'Port Harcourt', slug: 'port-harcourt' },
    { name: 'Obio-Akpor', slug: 'obio-akpor' },
  ],
  ogun: [
    { name: 'Sagamu', slug: 'sagamu' },
    { name: 'Abeokuta', slug: 'abeokuta' },
    { name: 'Ota', slug: 'ota' },
  ],
};

export function StateDirectoryClient({ stateSlug, stateName }: Props) {
  const [installers, setInstallers] = useState<PublicInstallerCardView[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const cities = STATE_CITIES[stateSlug] || [];

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('state', stateName);
        if (selectedService) params.set('services', selectedService);
        params.set('limit', '20');

        const res = await fetch(`/api/v1/installers?${params.toString()}`);
        const data = await res.json();
        setInstallers(data.data || []);
      } catch (err) {
        console.error('Failed to load state installers:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [stateName, selectedService]);

  return (
    <div className="bg-[#fdf9f0] text-[#1c1c17] min-h-screen antialiased flex flex-col">
      {/* Hero Section — Stitch: solar-installers-lagos.html */}
      <section className="relative pt-24 pb-20 px-4 md:px-16 overflow-hidden border-b border-[#e6e2d9]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-3/5 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E6F0D2] rounded-full border border-[#003006]/10">
                <SunlitIcon name="location_on" size={14} className="text-[#003006]" />
                <span className="font-[Inter] text-xs font-semibold text-[#003006] uppercase tracking-widest">
                  {stateName} State Hub
                </span>
              </div>
              <h1 className="font-[Manrope] text-4xl md:text-5xl font-bold text-[#001902] leading-tight">
                Solar Installers in {stateName}
              </h1>
              <p className="font-[Inter] text-lg text-[#42493f] max-w-xl">
                Navigate the unique energy landscape of {stateName}. Find verified, enterprise-grade installers capable of designing solar and storage systems built for local grid conditions and ambient climate.
              </p>
            </div>

            {/* Quick Match Card */}
            <div className="md:w-2/5 w-full">
              <div className="bg-white rounded-[20px] p-6 shadow-[0px_4px_20px_rgba(0,48,6,0.04)] border border-[#e6e2d9] space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#003006]/10 flex items-center justify-center text-[#003006]">
                    <SunlitIcon name="bolt" size={22} />
                  </div>
                  <div>
                    <h3 className="font-[Manrope] font-semibold text-base text-[#1c1c17]">Get Matched in {stateName}</h3>
                    <p className="font-[Inter] text-xs text-[#42493f]">3 verified quotes within 24 hours</p>
                  </div>
                </div>
                <a
                  href={`/request-quote?state=${encodeURIComponent(stateName)}`}
                  className="block text-center w-full py-3.5 bg-[#001902] text-white rounded-full font-[Inter] text-sm font-semibold hover:bg-[#003006] transition-colors shadow-md"
                >
                  Start Match Wizard
                </a>
              </div>
            </div>
          </div>

          {/* City Navigation Pills */}
          {cities.length > 0 && (
            <div className="mt-12 pt-8 border-t border-[#e6e2d9]">
              <p className="font-[Inter] text-xs font-semibold text-[#42493f] uppercase tracking-wider mb-4">
                Popular Cities in {stateName}
              </p>
              <div className="flex flex-wrap gap-2.5">
                {cities.map((city) => (
                  <a
                    key={city.slug}
                    href={`/installers/${stateSlug}/${city.slug}`}
                    className="px-4 py-2 bg-white rounded-full text-sm font-[Inter] text-[#1c1c17] hover:bg-[#003006] hover:text-white border border-[#e6e2d9] transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <SunlitIcon name="location_on" size={13} className="text-[#003006]" />
                    {city.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Directory Grid */}
      <section className="py-16 px-4 md:px-16 flex-grow">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-[Manrope] text-2xl font-bold text-[#001902]">
              Verified Installers in {stateName}
            </h2>
            <span className="text-sm font-[Inter] text-[#42493f]">
              {installers.length} Verified Profile{installers.length !== 1 ? 's' : ''}
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-[20px] p-6 animate-pulse border border-[#e6e2d9]">
                  <div className="h-6 bg-gray-200 rounded w-2/3 mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                </div>
              ))}
            </div>
          ) : installers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {installers.map((inst) => (
                <a
                  key={inst.slug}
                  href={`/installers/${inst.slug}`}
                  className="bg-white rounded-[20px] p-6 shadow-[0px_4px_20px_rgba(0,48,6,0.04)] border border-[#e6e2d9] hover:-translate-y-1 transition-all duration-300 block"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-[#003006]/10 text-[#003006] flex items-center justify-center flex-shrink-0">
                      <SunlitIcon name="solar_power" size={28} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-[Manrope] font-semibold text-lg text-[#1c1c17] truncate">{inst.business_name}</h3>
                      <p className="font-[Inter] text-sm text-[#42493f] flex items-center gap-1 mt-0.5">
                        <SunlitIcon name="location_on" size={13} className="text-[#4d661c]" />
                        {inst.headquarters_city || stateName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
                      <SunlitIcon name="shield_check" size={12} />
                      {inst.verification_level === 'enterprise' ? 'Enterprise Verified' : 'Sunlit Verified'}
                    </span>
                    {inst.sunlit_score != null && (
                      <span className="px-2.5 py-1 bg-[#003006]/10 text-[#003006] text-xs font-bold rounded-full">
                        Score: {inst.sunlit_score}/100
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#42493f] font-[Inter] pt-4 border-t border-[#e6e2d9]">
                    <span>{inst.completed_projects_count} projects</span>
                    <span className="flex items-center gap-1 font-semibold text-[#191c18]">
                      <SunlitIcon name="star" size={13} className="text-amber-500" fill />
                      {inst.average_rating ? `${inst.average_rating.toFixed(1)} (${inst.review_count})` : '5.0'}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[20px] p-12 text-center border border-[#e6e2d9] max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-[#003006]/10 text-[#003006] flex items-center justify-center mx-auto mb-4">
                <SunlitIcon name="search" size={32} />
              </div>
              <h3 className="font-[Manrope] text-lg font-semibold text-[#1c1c17] mb-2">No Installers Found in {stateName}</h3>
              <p className="font-[Inter] text-sm text-[#42493f] mb-6">We are actively onboarding verified installers in {stateName}.</p>
              <a
                href="/request-quote"
                className="px-6 py-2.5 bg-[#001902] text-white rounded-full font-[Inter] text-sm font-semibold inline-block hover:bg-[#003006]"
              >
                Request Quote via Network
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
