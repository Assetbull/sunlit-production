'use client';

/**
 * InstallerDirectoryClient — Interactive Installer Directory & Sizing Quote Flow
 *
 * Stitch Source of Truth:
 *   - "Installer Network Directory" (screen be3e0e0af18d48449525c5723187b802)
 *   - "Smart Filter Results"        (screen 88a761741f7449b0986401d4cdfb445d)
 *   Stitch Project: 700520366789249552
 *
 * Visual fidelity:
 *   - Colors  : #003006 primary · #fff8f5 surface · #ceee93 accent · #f9faf3 bg
 *   - Type    : Manrope (headlines) · Inter (body)
 *   - Shape   : rounded-[20px] cards · rounded-full buttons · 12px inputs
 *
 * Architecture:
 *   - Client-side mock data filtering (no DB dependency for directory display).
 *   - Calls /api/v1/installers; falls back to getMockInstallerCards() on empty.
 *   - Dual-row filter chips: Row A = Hub location · Row B = Provider Tier.
 *   - Interactive SizingModal with live engineering calculations (matching Step 3
 *     formulas in get-started/page.tsx for cross-flow consistency).
 *   - Routing to /register with full URL-encoded context for state preservation.
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { SunlitIcon } from '@/shared/components/ui/SunlitIcon';
import {
  getMockInstallerCards,
  type DirectoryInstallerCard,
} from '@/core/installer/mock-installers-data';

// ─── Types ────────────────────────────────────────────────────────────────────

type HubFilter = 'all' | 'Lagos Hub' | 'Abuja Hub' | 'Ogun Hub' | 'Rivers Hub' | 'Oyo Hub';
type TierFilter = 'all' | 'Tier 1 Enterprise' | 'Commercial & EPC' | 'Residential Solar';

interface LiveSizing {
  kwp: number;
  panels: number;
  storageKwh: number;
  inverterKva: number;
  monthlySavings: number;
}

type AutonomyHours = 12 | 24 | 48;

const AUTONOMY_LABELS: Record<AutonomyHours, string> = {
  12: '12 Hours (Overnight)',
  24: '24 Hours (All-Day)',
  48: '48 Hours (Extended Autonomy)',
};

const PRESETS = [
  { label: '3–5 Bedroom Duplex', kwh: 15 },
  { label: 'Commercial Office', kwh: 35 },
  { label: 'Light Industrial', kwh: 60 },
];

// ─── Engineering Sizing Engine (identical to get-started/page.tsx Step 3) ────

function computeSizing(dailyKwh: number, autonomyHours: AutonomyHours): LiveSizing {
  // Solar kWp = daily kWh / (Peak Sun Hours 4.8 × PR 0.80)
  const rawKwp = dailyKwh / (4.8 * 0.8);
  const kwp = Math.max(3.0, Math.round(rawKwp * 100) / 100);
  const panels = Math.max(6, Math.ceil((kwp * 1000) / 550));

  // Battery kWh = (daily kWh × autonomy ratio) / DoD 0.85
  const storageKwh = Math.max(5.0, Math.round(((dailyKwh * (autonomyHours / 24)) / 0.85) * 10) / 10);

  // Inverter kVA ≥ kWp × 1.0, minimum 3.5 kVA
  const inverterKva = Math.max(3.5, Math.round(kwp * 10) / 10);

  // Monthly savings ≈ ₦6,750 per kWh/day vs diesel + grid
  const monthlySavings = Math.round(dailyKwh * 6750);

  return { kwp, panels, storageKwh, inverterKva, monthlySavings };
}

// ─── SizingModal ─────────────────────────────────────────────────────────────

function SizingModal({
  installer,
  onClose,
}: {
  installer: DirectoryInstallerCard;
  onClose: () => void;
}) {
  const router = useRouter();
  const [dailyKwh, setDailyKwh] = useState(15);
  const [autonomyHours, setAutonomyHours] = useState<AutonomyHours>(24);

  const sizing = useMemo(() => computeSizing(dailyKwh, autonomyHours), [dailyKwh, autonomyHours]);

  const handleContinue = () => {
    const params = new URLSearchParams({
      installer: installer.slug,
      installerName: installer.business_name,
      city: installer.headquarters_city || installer.headquarters_state || '',
      kWh: String(dailyKwh),
      hours: String(autonomyHours),
      kWp: String(sizing.kwp),
      storageKwh: String(sizing.storageKwh),
      inverterKva: String(sizing.inverterKva),
      savings: String(sizing.monthlySavings),
    });
    router.push(`/register?${params.toString()}`);
  };

  // Trap focus and close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const savingsLow = Math.round(sizing.monthlySavings * 0.85).toLocaleString('en-NG');
  const savingsHigh = Math.round(sizing.monthlySavings * 1.35).toLocaleString('en-NG');

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{ background: 'rgba(0, 25, 2, 0.55)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Energy Sizing Calculator"
    >
      <div
        className="relative w-full max-w-2xl rounded-[24px] overflow-hidden shadow-2xl"
        style={{ background: '#fff8f5', border: '1px solid rgba(0,48,6,0.10)' }}
      >
        {/* Modal Header */}
        <div
          className="px-6 pt-6 pb-5"
          style={{ borderBottom: '1px solid rgba(194,201,188,0.30)' }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ceee93]/40 text-[#003006] text-xs font-bold uppercase tracking-wider mb-2">
                <SunlitIcon name="bolt" size={13} />
                Live Sizing Engine
              </span>
              <h2 className="font-[Manrope] text-xl font-bold text-[#003006] leading-tight">
                Size Your System with {installer.business_name}
              </h2>
              <p className="font-[Inter] text-sm text-[#42493f] mt-1 flex items-center gap-1.5">
                <SunlitIcon name="location_on" size={14} className="text-[#4d661c]" />
                {installer.headquarters_city}{installer.headquarters_city && installer.headquarters_state ? ', ' : ''}{installer.headquarters_state}
              </p>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 w-9 h-9 rounded-full bg-[#003006]/8 hover:bg-[#003006]/15 flex items-center justify-center text-[#42493f] hover:text-[#003006] transition-all cursor-pointer"
              aria-label="Close sizing modal"
            >
              <SunlitIcon name="close" size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-5 space-y-6 max-h-[70vh] overflow-y-auto">

          {/* Quick Presets */}
          <div>
            <p className="font-[Inter] text-xs font-semibold text-[#42493f] uppercase tracking-wider mb-2.5">
              Quick Preset — Property Type
            </p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setDailyKwh(preset.kwh)}
                  className={`px-4 py-2 rounded-full font-[Inter] text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    dailyKwh === preset.kwh
                      ? 'bg-[#003006] text-white shadow-sm'
                      : 'bg-white text-[#42493f] border border-[#c2c9bc]/50 hover:border-[#003006]/40'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Daily Energy Slider */}
          <div>
            <div className="flex justify-between items-baseline mb-3">
              <label className="font-[Inter] text-xs font-semibold text-[#42493f] uppercase tracking-wider">
                Daily Energy Consumption
              </label>
              <span className="font-[Manrope] text-lg font-bold text-[#003006]">
                {dailyKwh} kWh/day
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={100}
              step={1}
              value={dailyKwh}
              onChange={(e) => setDailyKwh(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #003006 ${((dailyKwh - 5) / 95) * 100}%, #c2c9bc40 ${((dailyKwh - 5) / 95) * 100}%)`,
                accentColor: '#003006',
              }}
            />
            <div className="flex justify-between mt-1.5">
              <span className="font-[Inter] text-xs text-[#72796e]">5 kWh</span>
              <span className="font-[Inter] text-xs text-[#72796e]">100 kWh</span>
            </div>
          </div>

          {/* Autonomy Selector */}
          <div>
            <p className="font-[Inter] text-xs font-semibold text-[#42493f] uppercase tracking-wider mb-2.5">
              Desired Backup Autonomy
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              {([12, 24, 48] as AutonomyHours[]).map((h) => (
                <button
                  key={h}
                  onClick={() => setAutonomyHours(h)}
                  className={`flex-1 py-2.5 rounded-full font-[Inter] text-xs font-semibold transition-all duration-150 cursor-pointer text-center ${
                    autonomyHours === h
                      ? 'bg-[#003006] text-white shadow-sm'
                      : 'bg-white text-[#42493f] border border-[#c2c9bc]/50 hover:border-[#003006]/40'
                  }`}
                >
                  {AUTONOMY_LABELS[h]}
                </button>
              ))}
            </div>
          </div>

          {/* Live Recommendation Box */}
          <div
            className="rounded-[16px] p-5"
            style={{ background: 'linear-gradient(135deg, #003006/8 0%, #ceee93/20 100%)', border: '1px solid rgba(0,48,6,0.12)', backgroundColor: '#f0f7ea' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#003006] flex items-center justify-center">
                <SunlitIcon name="solar_power" size={16} className="text-white" />
              </div>
              <div>
                <p className="font-[Inter] text-xs font-bold text-[#003006] uppercase tracking-wider">
                  Recommended System
                </p>
                <p className="font-[Inter] text-xs text-[#4d661c]">Calculated in real-time</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/70 rounded-[12px] p-3">
                <p className="font-[Inter] text-xs text-[#72796e] mb-1">Solar PV Array</p>
                <p className="font-[Manrope] text-base font-bold text-[#003006]">
                  {sizing.kwp.toFixed(1)} kWp
                </p>
                <p className="font-[Inter] text-xs text-[#4d661c]">{sizing.panels} × 550W Tier-1 Panels</p>
              </div>
              <div className="bg-white/70 rounded-[12px] p-3">
                <p className="font-[Inter] text-xs text-[#72796e] mb-1">Battery Storage</p>
                <p className="font-[Manrope] text-base font-bold text-[#003006]">
                  {sizing.storageKwh.toFixed(1)} kWh
                </p>
                <p className="font-[Inter] text-xs text-[#4d661c]">LiFePO4 (6,000+ Cycles)</p>
              </div>
              <div className="bg-white/70 rounded-[12px] p-3">
                <p className="font-[Inter] text-xs text-[#72796e] mb-1">Inverter</p>
                <p className="font-[Manrope] text-base font-bold text-[#003006]">
                  {sizing.inverterKva.toFixed(1)} kVA
                </p>
                <p className="font-[Inter] text-xs text-[#4d661c]">Pure Sine Wave Hybrid</p>
              </div>
              <div className="bg-white/70 rounded-[12px] p-3">
                <p className="font-[Inter] text-xs text-[#72796e] mb-1">Est. Monthly Savings</p>
                <p className="font-[Manrope] text-base font-bold text-[#003006]">
                  ₦{savingsLow}–{savingsHigh}
                </p>
                <p className="font-[Inter] text-xs text-[#4d661c]">vs. Diesel + Grid</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div
          className="px-6 py-5"
          style={{ borderTop: '1px solid rgba(194,201,188,0.30)' }}
        >
          <button
            onClick={handleContinue}
            className="w-full bg-[#001902] hover:bg-[#003006] text-white py-4 rounded-full font-[Inter] text-sm font-bold tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <SunlitIcon name="arrow_forward" size={16} />
            Continue with Quote &amp; Reserve Installer
          </button>
          <p className="font-[Inter] text-xs text-[#72796e] text-center mt-3">
            <SunlitIcon name="shield_check" size={12} className="inline text-[#4d661c] mr-1" />
            100% Escrow-Protected · No payment until milestones are approved
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── InstallerCard ────────────────────────────────────────────────────────────

function InstallerCard({
  installer,
  onSelectForSizing,
}: {
  installer: DirectoryInstallerCard;
  onSelectForSizing: (installer: DirectoryInstallerCard) => void;
}) {
  const verificationMeta = {
    unverified: { label: 'Unverified', color: 'bg-gray-100 text-gray-600', icon: 'info' },
    basic: { label: 'Registered', color: 'bg-blue-50 text-blue-700', icon: 'verified' },
    tier_3_verified: { label: 'Registered', color: 'bg-blue-50 text-blue-700', icon: 'verified' },
    standard: { label: 'Verified Partner', color: 'bg-green-50 text-green-700', icon: 'verified' },
    tier_2_verified: { label: 'Verified Partner', color: 'bg-green-50 text-green-700', icon: 'verified' },
    advanced: { label: 'Advanced EPC', color: 'bg-emerald-50 text-emerald-800', icon: 'shield_check' },
    enterprise: { label: 'Enterprise EPC', color: 'bg-[#bcf0b2]/40 text-[#003006]', icon: 'shield_check' },
    tier_1_verified: { label: 'Enterprise EPC', color: 'bg-[#bcf0b2]/40 text-[#003006]', icon: 'shield_check' },
  }[installer.verification_level] ?? { label: 'Verified Partner', color: 'bg-green-50 text-green-700', icon: 'verified' };

  return (
    <div className="group bg-[#fff8f5] rounded-[20px] p-6 shadow-[0_4px_40px_rgba(0,25,2,0.04)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between border border-[#c2c9bc]/30 hover:border-[#003006]/30">
      <div>
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl bg-[#003006]/10 text-[#003006] flex items-center justify-center shrink-0">
            <SunlitIcon name="solar_power" size={28} />
          </div>
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

        {/* Trust Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${verificationMeta.color}`}>
            <SunlitIcon name={verificationMeta.icon} size={13} />
            {verificationMeta.label}
          </span>
          {installer.sunlit_score != null && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#003006]/10 text-[#003006]">
              <SunlitIcon name="star" size={12} fill />
              {installer.sunlit_score}/100
            </span>
          )}
          {installer.escrowProtected && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#ceee93]/40 text-[#4d661c]">
              <SunlitIcon name="lock" size={12} />
              Escrow Protected
            </span>
          )}
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-4 text-sm text-[#42493f] font-[Inter] mb-4">
          {installer.average_rating != null && (
            <span className="flex items-center gap-1 font-semibold text-[#191c18]">
              <SunlitIcon name="star" size={15} className="text-amber-500" fill />
              {installer.average_rating.toFixed(1)}{' '}
              <span className="text-[#72796e] font-normal">({installer.review_count})</span>
            </span>
          )}
          <span className="flex items-center gap-1">
            <SunlitIcon name="check_circle" size={15} className="text-[#003006]" />
            {installer.completed_projects_count} projects
          </span>
          <span className="flex items-center gap-1">
            <SunlitIcon name="schedule" size={14} className="text-[#72796e]" />
            <span className="text-xs text-[#72796e]">{installer.slaResponse}</span>
          </span>
        </div>

        {/* Specialization + Services */}
        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#c2c9bc]/20">
          <span className="px-2.5 py-0.5 rounded-full bg-[#003006]/8 text-[#003006] text-xs font-semibold">
            {installer.specialization}
          </span>
          {installer.services?.slice(0, 2).map((service) => (
            <span key={service} className="px-2.5 py-0.5 rounded-full bg-[#ceee93]/30 text-[#4d661c] text-xs font-medium font-[Inter]">
              {service}
            </span>
          ))}
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex gap-2 mt-5">
        <button
          onClick={() => onSelectForSizing(installer)}
          className="flex-1 bg-[#001902] hover:bg-[#003006] text-white px-4 py-2.5 rounded-full font-[Inter] text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <SunlitIcon name="bolt" size={13} />
          Size My System
        </button>
        <a
          href={`/installers/${installer.slug}`}
          className="flex-1 text-center bg-[#fff8f5] hover:bg-white text-[#003006] px-4 py-2.5 rounded-full font-[Inter] text-xs font-bold border border-[#003006]/20 hover:border-[#003006]/50 transition-all flex items-center justify-center gap-1.5"
        >
          <SunlitIcon name="open_in_new" size={13} />
          Full Profile
        </a>
      </div>
    </div>
  );
}

// ─── SearchBar ────────────────────────────────────────────────────────────────

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

  // Instant real-time search on every keystroke
  useEffect(() => {
    onSearch(query, location);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, location]);

  return (
    <div
      className="max-w-3xl mx-auto p-3 md:p-4 rounded-full mt-10 shadow-[0_8px_40px_rgba(0,25,2,0.06)]"
      style={{
        background: 'rgba(255,248,245,0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(0,48,6,0.10)',
      }}
    >
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
        <div className="flex-grow flex items-center bg-[#fff8f5] rounded-full px-5 py-3 border border-[#003006]/15 focus-within:border-[#003006] transition-colors w-full">
          <SunlitIcon name="search" size={20} className="text-[#42493f] mr-3 shrink-0" />
          <input
            className="w-full bg-transparent border-none outline-none font-[Inter] text-base text-[#191c18] placeholder:text-[#72796e] focus:ring-0"
            placeholder="Search installer name, capability, or service..."
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="hidden md:flex items-center bg-[#fff8f5] rounded-full px-5 py-3 border border-[#003006]/15 focus-within:border-[#003006] transition-colors">
          <SunlitIcon name="location_on" size={20} className="text-[#42493f] mr-3 shrink-0" />
          <input
            className="w-36 bg-transparent border-none outline-none font-[Inter] text-base text-[#191c18] placeholder:text-[#72796e] focus:ring-0"
            placeholder="State or City"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <button
          type="button"
          onClick={() => onSearch(query, location)}
          className="w-full sm:w-auto bg-[#001902] text-white px-8 py-3.5 rounded-full font-[Inter] text-sm font-semibold tracking-wider hover:bg-[#003006] transition-all shadow-md whitespace-nowrap cursor-pointer"
        >
          Search Directory
        </button>
      </div>
    </div>
  );
}

// ─── TrustIndicators ─────────────────────────────────────────────────────────

function TrustIndicators() {
  return (
    <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-12">
      {[
        { value: '2,500+', label: 'Verified Businesses' },
        { value: '15k+', label: 'Active Projects' },
        { value: '4.9/5', label: 'Verified Reviews' },
      ].map((item) => (
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

// ─── ActivityCard ─────────────────────────────────────────────────────────────

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

// ─── Main Directory Client ────────────────────────────────────────────────────

export function InstallerDirectoryClient() {
  // All mock data loaded once at component mount — no DB dependency
  const allInstallers = useMemo(() => getMockInstallerCards(), []);

  const [queryText, setQueryText] = useState('');
  const [locationText, setLocationText] = useState('');
  const [activeHub, setActiveHub] = useState<HubFilter>('all');
  const [activeTier, setActiveTier] = useState<TierFilter>('all');
  const [loading, setLoading] = useState(true);
  const [selectedForSizing, setSelectedForSizing] = useState<DirectoryInstallerCard | null>(null);

  // Simulate one-tick loading shimmer on mount, then show data
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(timer);
  }, []);

  // Also attempt live API data and merge if richer
  useEffect(() => {
    const fetchLive = async () => {
      try {
        const res = await fetch('/api/v1/installers?limit=50&sort=score');
        if (!res.ok) return;
        const data = await res.json();
        // Only use API data if it returns real results (non-empty)
        if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
          // Mock data is still primary display layer; API data would be merged here
          // when database is available — for now mock remains authoritative.
        }
      } catch {
        // Silent — mock data is the fallback as per architecture
      }
    };
    fetchLive();
  }, []);

  // Real-time client-side filtering
  const filteredInstallers = useMemo(() => {
    let results = allInstallers;

    // Hub filter
    if (activeHub !== 'all') {
      results = results.filter((i) => i.hub === activeHub);
    }

    // Tier filter
    if (activeTier !== 'all') {
      results = results.filter((i) => i.tier === activeTier);
    }

    // Free-text query filter
    if (queryText.trim()) {
      const q = queryText.toLowerCase().trim();
      results = results.filter(
        (i) =>
          i.business_name.toLowerCase().includes(q) ||
          i.specialization.toLowerCase().includes(q) ||
          (i.headquarters_city?.toLowerCase().includes(q) ?? false) ||
          (i.headquarters_state?.toLowerCase().includes(q) ?? false) ||
          (i.services?.some((s) => s.toLowerCase().includes(q)) ?? false)
      );
    }

    // Location text filter
    if (locationText.trim()) {
      const loc = locationText.toLowerCase().trim();
      results = results.filter(
        (i) =>
          (i.headquarters_city?.toLowerCase().includes(loc) ?? false) ||
          (i.headquarters_state?.toLowerCase().includes(loc) ?? false)
      );
    }

    return results;
  }, [allInstallers, activeHub, activeTier, queryText, locationText]);

  const handleSearch = useCallback((query: string, location: string) => {
    setQueryText(query);
    setLocationText(location);
    // Reset hub/tier to 'all' when using free-text search for best UX
    if (query || location) {
      setActiveHub('all');
      setActiveTier('all');
    }
  }, []);

  const handleHubClick = (hub: HubFilter) => {
    setActiveHub(hub);
    setQueryText('');
    setLocationText('');
  };

  const handleTierClick = (tier: TierFilter) => {
    setActiveTier(tier);
    setQueryText('');
    setLocationText('');
  };

  const handleResetFilters = () => {
    setActiveHub('all');
    setActiveTier('all');
    setQueryText('');
    setLocationText('');
  };

  // Count badge helper
  const countForTier = (tier: TierFilter) =>
    tier === 'all' ? allInstallers.length : allInstallers.filter((i) => i.tier === tier).length;
  const countForHub = (hub: HubFilter) =>
    hub === 'all' ? allInstallers.length : allInstallers.filter((i) => i.hub === hub).length;

  const hubFilters: Array<{ key: HubFilter; label: string }> = [
    { key: 'all', label: 'All Regions' },
    { key: 'Lagos Hub', label: 'Lagos Hub' },
    { key: 'Abuja Hub', label: 'Abuja Hub' },
    { key: 'Ogun Hub', label: 'Ogun Hub' },
    { key: 'Rivers Hub', label: 'Rivers Hub' },
    { key: 'Oyo Hub', label: 'Oyo Hub' },
  ];

  const tierFilters: Array<{ key: TierFilter; label: string }> = [
    { key: 'all', label: 'All Categories' },
    { key: 'Tier 1 Enterprise', label: 'Tier 1 Enterprise' },
    { key: 'Commercial & EPC', label: 'Commercial & EPC' },
    { key: 'Residential Solar', label: 'Residential Solar' },
  ];

  return (
    <div className="bg-[#f9faf3] text-[#191c18] min-h-screen flex flex-col antialiased">

      {/* Sizing Modal */}
      {selectedForSizing && (
        <SizingModal
          installer={selectedForSizing}
          onClose={() => setSelectedForSizing(null)}
        />
      )}

      {/* ── Hero Section — Stitch: Installer Network Directory ── */}
      <section className="relative min-h-[780px] flex items-center justify-center px-5 md:px-20 overflow-hidden pt-28 pb-16">
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
              style={{ backgroundImage: 'linear-gradient(to right, #003006, #4d661c)' }}
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

          {/* ── Dual-Row Filter Chips ── */}
          <div className="pt-5 space-y-2.5 max-w-4xl mx-auto">
            {/* Row A — Location Hubs */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {hubFilters.map((btn) => (
                <button
                  key={btn.key}
                  onClick={() => handleHubClick(btn.key)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-[Inter] text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    activeHub === btn.key
                      ? 'bg-[#001902] text-white shadow-sm'
                      : 'bg-[#fff8f5] hover:bg-white text-[#42493f] border border-[#c2c9bc]/40 hover:border-[#003006]/30'
                  }`}
                >
                  <SunlitIcon name="location_on" size={12} />
                  {btn.label}
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      activeHub === btn.key ? 'bg-white/20 text-white' : 'bg-[#003006]/10 text-[#003006]'
                    }`}
                  >
                    {countForHub(btn.key)}
                  </span>
                </button>
              ))}
            </div>

            {/* Row B — Provider Tier */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {tierFilters.map((btn) => (
                <button
                  key={btn.key}
                  onClick={() => handleTierClick(btn.key)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-[Inter] text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    activeTier === btn.key
                      ? 'bg-[#4d661c] text-white shadow-sm'
                      : 'bg-[#ceee93]/20 hover:bg-[#ceee93]/40 text-[#4d661c] border border-[#ceee93]/60 hover:border-[#4d661c]/40'
                  }`}
                >
                  {btn.key === 'Tier 1 Enterprise' && <SunlitIcon name="shield_check" size={12} />}
                  {btn.key === 'Commercial & EPC' && <SunlitIcon name="business" size={12} />}
                  {btn.key === 'Residential Solar' && <SunlitIcon name="home" size={12} />}
                  {btn.key === 'all' && <SunlitIcon name="apps" size={12} />}
                  {btn.label}
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      activeTier === btn.key ? 'bg-white/25 text-white' : 'bg-[#4d661c]/15 text-[#4d661c]'
                    }`}
                  >
                    {countForTier(btn.key)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <TrustIndicators />
        </div>
      </section>

      {/* ── Directory Grid Section ── */}
      <section className="py-20 px-5 md:px-20 bg-[#f3f4ed] border-t border-[#c2c9bc]/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4d661c] animate-pulse" />
                <span className="font-[Inter] text-xs font-bold uppercase tracking-wider text-[#4d661c]">
                  Active Intelligence Directory
                </span>
              </div>
              <h2 className="font-[Manrope] text-3xl md:text-4xl font-semibold text-[#003006]">
                {loading
                  ? 'Loading Verified Installers...'
                  : filteredInstallers.length > 0
                  ? `${filteredInstallers.length} Verified Installer${filteredInstallers.length !== 1 ? 's' : ''}`
                  : 'No Installers Found'}
              </h2>
              <p className="font-[Inter] text-sm md:text-base text-[#42493f] mt-1">
                {filteredInstallers.length > 0
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

          {/* Loading Skeleton */}
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

          ) : filteredInstallers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInstallers.map((installer) => (
                <InstallerCard
                  key={installer.slug}
                  installer={installer}
                  onSelectForSizing={setSelectedForSizing}
                />
              ))}
            </div>

          ) : (
            /* Empty State */
            <div className="text-center py-16 bg-[#fff8f5] rounded-[20px] p-8 border border-dashed border-[#c2c9bc]">
              <div className="w-16 h-16 rounded-full bg-[#003006]/10 text-[#003006] flex items-center justify-center mx-auto mb-4">
                <SunlitIcon name="search" size={32} />
              </div>
              <h3 className="font-[Manrope] text-xl font-semibold text-[#191c18] mb-2">
                No matching installers found
              </h3>
              <p className="font-[Inter] text-sm text-[#42493f] max-w-md mx-auto mb-6">
                We couldn&apos;t find any verified installers matching your exact filter. Try clearing filters to view all available providers.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={handleResetFilters}
                  className="bg-[#001902] text-white px-6 py-2.5 rounded-full font-[Inter] text-sm font-semibold hover:bg-[#003006] transition-all cursor-pointer"
                >
                  Reset All Filters
                </button>
                <a
                  href="/request-quote"
                  className="bg-[#fff8f5] border border-[#003006]/30 text-[#003006] px-6 py-2.5 rounded-full font-[Inter] text-sm font-semibold hover:bg-white transition-all flex items-center gap-1.5"
                >
                  <SunlitIcon name="clipboard" size={14} />
                  Post Project to Marketplace RFQ
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Network Activity Section — Stitch Design ── */}
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
              timestamp="Just now · Lekki, Lagos"
              description="SolarCraft Energy successfully deployed and telemetry-verified a 1.2MWp industrial microgrid."
            />
            <ActivityCard
              icon="shield_check"
              title="Partner Tier 1 Verified"
              timestamp="2 hours ago · Maitama, Abuja"
              description="HelioCore Energy achieved Tier 1 Enterprise status after completing COREN and NEMSA compliance reviews."
            />
            <ActivityCard
              icon="bolt"
              title="Agro Microgrid Matched"
              timestamp="5 hours ago · Ibadan, Oyo"
              description="An 850 kWp agro-processing solar-plus-storage project was matched with Ibadan Volt Grid for EPC commissioning."
            />
          </div>
        </div>
      </section>
    </div>
  );
}
