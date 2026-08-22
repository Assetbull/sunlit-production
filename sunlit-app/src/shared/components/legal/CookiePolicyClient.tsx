'use client';

/**
 * CookiePolicyClient — Stitch-Faithful Bento Cookie & Tracking Management
 *
 * Stitch Source: 26646cd207cc45f78acb5af676f50ff2 (Cookie Policy)
 */

import React, { useState } from 'react';
import { SunlitIcon } from '@/shared/components/ui/SunlitIcon';
import { ContextualBackNav } from '@/shared/components/navigation/ContextualBackNav';

interface CookieItem {
  name: string;
  type: 'Session' | 'Persistent' | 'Local Storage';
  duration: string;
  purpose: string;
}

export function CookiePolicyClient() {
  const [preferences, setPreferences] = useState({
    essential: true, // Always true
    functional: true,
    analytics: true,
    marketing: false,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sunlit_cookie_consent', JSON.stringify(preferences));
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const essentialCookies: CookieItem[] = [
    { name: 'sunlit_session_token', type: 'Session', duration: 'Browser Session', purpose: 'Maintains authenticated customer and installer session state.' },
    { name: 'sunlit_csrf_token', type: 'Session', duration: 'Browser Session', purpose: 'Protects forms and sizing calculators against Cross-Site Request Forgery (CSRF).' },
    { name: 'sunlit_cookie_consent', type: 'Persistent', duration: '12 Months', purpose: 'Stores your consented cookie category preferences.' },
  ];

  const functionalCookies: CookieItem[] = [
    { name: 'sunlit_state_pref', type: 'Persistent', duration: '6 Months', purpose: 'Remembers your selected state (Lagos, Abuja, Ogun) for installer pricing.' },
    { name: 'sunlit_calc_snapshot', type: 'Local Storage', duration: 'Persistent', purpose: 'Preserves appliance load and solar calculator inputs between page views.' },
  ];

  const analyticsCookies: CookieItem[] = [
    { name: 'sunlit_perf_metrics', type: 'Persistent', duration: '30 Days', purpose: 'Measures Nigerian network latency and calculator response times.' },
  ];

  const marketingCookies: CookieItem[] = [
    { name: 'sunlit_campaign_ref', type: 'Persistent', duration: '30 Days', purpose: 'Attribution for clean energy educational campaigns and community awareness.' },
  ];

  return (
    <div className="bg-[#f7fbf1] text-[#191d17] min-h-screen flex flex-col antialiased selection:bg-[#cceb91] selection:text-[#131f00]">
      <div className="pt-28 pb-4 px-4 sm:px-8 max-w-6xl mx-auto w-full">
        <ContextualBackNav href="/legal" label="Legal & Compliance Hub" maxWidth="none" padding="0" />
      </div>

      <main className="flex-grow max-w-6xl mx-auto px-4 sm:px-8 pb-20 w-full">
        {/* Header */}
        <header className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#bcf0b2]/40 text-[#003006] text-xs font-bold uppercase tracking-wider mb-4">
            <SunlitIcon name="shield" size={13} />
            Data Protection & Transparency
          </div>
          <h1 className="font-[Manrope] text-3xl sm:text-5xl font-bold text-[#003006] mb-4 tracking-tight">
            Cookie &amp; Tracking Policy
          </h1>
          <p className="font-[Inter] text-base sm:text-lg text-[#41493e] max-w-3xl leading-relaxed">
            We use cookies to keep our verified solar marketplace fast, secure, and personalized. This policy explains how we utilize local storage and cookies in accordance with the Nigeria Data Protection Act (NDPA) 2023.
          </p>
        </header>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* 1. Essential Cookies */}
          <div className="bg-[#fff8f5] rounded-[24px] p-6 sm:p-8 border border-[#bfcaba]/40 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#003006] text-white flex items-center justify-center">
                    <SunlitIcon name="lock" size={20} />
                  </div>
                  <div>
                    <h2 className="font-[Manrope] text-xl font-bold text-[#003006]">Essential Cookies</h2>
                    <span className="text-[11px] font-bold text-[#707a6c] uppercase">Always Active</span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#eae1da] text-[#003006] text-xs font-bold">Required</span>
              </div>
              <p className="font-[Inter] text-xs sm:text-sm text-[#41493e] mb-6 leading-relaxed">
                Strictly necessary for security, authentication, and platform integrity. These cookies protect sessions and CSRF tokens.
              </p>
              <div className="space-y-3">
                {essentialCookies.map((c, i) => (
                  <div key={i} className="p-3 rounded-xl bg-[#f7fbf1] border border-[#bfcaba]/30 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <code className="font-mono font-bold text-[#003006]">{c.name}</code>
                      <span className="text-[10px] bg-[#eae1da] px-2 py-0.5 rounded text-[#41493e]">{c.type}</span>
                    </div>
                    <p className="text-[#41493e] text-[11px]">{c.purpose}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Functional Cookies */}
          <div className="bg-[#fff8f5] rounded-[24px] p-6 sm:p-8 border border-[#bfcaba]/40 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#cceb91] text-[#003006] flex items-center justify-center">
                    <SunlitIcon name="settings" size={20} />
                  </div>
                  <div>
                    <h2 className="font-[Manrope] text-xl font-bold text-[#003006]">Functional Cookies</h2>
                    <span className="text-[11px] font-bold text-[#707a6c] uppercase">Preferences</span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.functional}
                    onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#eae1da] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#eae1da] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#003006]"></div>
                </label>
              </div>
              <p className="font-[Inter] text-xs sm:text-sm text-[#41493e] mb-6 leading-relaxed">
                Remember your configuration choices, such as selected Nigerian states and appliance sizing parameters.
              </p>
              <div className="space-y-3">
                {functionalCookies.map((c, i) => (
                  <div key={i} className="p-3 rounded-xl bg-[#f7fbf1] border border-[#bfcaba]/30 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <code className="font-mono font-bold text-[#003006]">{c.name}</code>
                      <span className="text-[10px] bg-[#eae1da] px-2 py-0.5 rounded text-[#41493e]">{c.type}</span>
                    </div>
                    <p className="text-[#41493e] text-[11px]">{c.purpose}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Analytics Cookies */}
          <div className="bg-[#fff8f5] rounded-[24px] p-6 sm:p-8 border border-[#bfcaba]/40 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#eae1da] text-[#003006] flex items-center justify-center">
                    <SunlitIcon name="trending_up" size={20} />
                  </div>
                  <div>
                    <h2 className="font-[Manrope] text-xl font-bold text-[#003006]">Analytics Cookies</h2>
                    <span className="text-[11px] font-bold text-[#707a6c] uppercase">Performance</span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#eae1da] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#eae1da] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#003006]"></div>
                </label>
              </div>
              <p className="font-[Inter] text-xs sm:text-sm text-[#41493e] mb-6 leading-relaxed">
                Collect aggregated telemetry to diagnose latency across Nigerian network carriers and optimize calculator calculations.
              </p>
              <div className="space-y-3">
                {analyticsCookies.map((c, i) => (
                  <div key={i} className="p-3 rounded-xl bg-[#f7fbf1] border border-[#bfcaba]/30 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <code className="font-mono font-bold text-[#003006]">{c.name}</code>
                      <span className="text-[10px] bg-[#eae1da] px-2 py-0.5 rounded text-[#41493e]">{c.type}</span>
                    </div>
                    <p className="text-[#41493e] text-[11px]">{c.purpose}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Marketing Cookies */}
          <div className="bg-[#fff8f5] rounded-[24px] p-6 sm:p-8 border border-[#bfcaba]/40 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#eae1da] text-[#003006] flex items-center justify-center">
                    <SunlitIcon name="group" size={20} />
                  </div>
                  <div>
                    <h2 className="font-[Manrope] text-xl font-bold text-[#003006]">Marketing Cookies</h2>
                    <span className="text-[11px] font-bold text-[#707a6c] uppercase">Campaign Outreach</span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#eae1da] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#eae1da] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#003006]"></div>
                </label>
              </div>
              <p className="font-[Inter] text-xs sm:text-sm text-[#41493e] mb-6 leading-relaxed">
                Measure the effectiveness of solar education and clean energy transition initiatives across Nigeria.
              </p>
              <div className="space-y-3">
                {marketingCookies.map((c, i) => (
                  <div key={i} className="p-3 rounded-xl bg-[#f7fbf1] border border-[#bfcaba]/30 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <code className="font-mono font-bold text-[#003006]">{c.name}</code>
                      <span className="text-[10px] bg-[#eae1da] px-2 py-0.5 rounded text-[#41493e]">{c.type}</span>
                    </div>
                    <p className="text-[#41493e] text-[11px]">{c.purpose}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Save Preferences Bar */}
        <div className="p-6 rounded-2xl bg-[#003006] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div>
            <h3 className="font-[Manrope] text-lg font-bold">Save Your Preferences</h3>
            <p className="font-[Inter] text-xs text-[#eff2e9]">Your choices are saved locally and honored across your visits.</p>
          </div>
          <div className="flex items-center gap-3">
            {saved && (
              <span className="text-xs font-bold text-[#ceee93] flex items-center gap-1">
                <SunlitIcon name="check_circle" size={16} />
                Preferences Saved
              </span>
            )}
            <button
              onClick={handleSave}
              type="button"
              className="px-6 py-2.5 rounded-full bg-[#ceee93] text-[#003006] font-[Inter] text-xs font-bold hover:bg-[#bcf0b2] transition-colors cursor-pointer"
            >
              Save Cookie Preferences
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
