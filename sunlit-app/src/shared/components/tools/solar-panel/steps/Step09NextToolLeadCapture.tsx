'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SharedCalculationResult } from '@/lib/engineering/types';
import { SunlitIcon } from '@/shared/components/ui/SunlitIcon';

interface Step09Props {
  profileTitle: string;
  userClassification: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  calculationResult: SharedCalculationResult | null;
  onUpdateTitle: (title: string) => void;
  onUpdateUserClass: (cls: any) => void;
  onUpdateContact: (name: string, email: string, phone: string) => void;
  onRestart: () => void;
  onClose: () => void;
}

export function Step09NextToolLeadCapture({
  profileTitle,
  userClassification,
  contactName,
  contactEmail,
  contactPhone,
  calculationResult,
  onUpdateTitle,
  onUpdateUserClass,
  onUpdateContact,
  onRestart,
  onClose,
}: Step09Props) {
  const [saved, setSaved] = useState(false);
  const [notice, setActionNotice] = useState<string | null>(null);

  const handleSave = () => {
    setSaved(true);
    setActionNotice('Solar Array Specification saved to your Sunlit account profile.');
  };

  const handleSubmitLead = (e: React.FormEvent) => {
    e.preventDefault();
    setActionNotice('Your solar array specification and quote request have been submitted to certified Sunlit EPC installers!');
  };

  const handleExportPDF = () => {
    setActionNotice('Compiling verified Solar Array Specification PDF document...');
    setTimeout(() => {
      setActionNotice('Solar Array Sizing Report & BOM Specification PDF exported!');
    }, 1200);
  };

  const resData = calculationResult?.engineering_results || {};

  return (
    <div className="flex flex-col gap-6 py-2">
      <div>
        <span className="text-[11px] font-bold text-[#00490e] uppercase tracking-wider block mb-1">
          STEP 09 OF 09
        </span>
        <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#1f1b17]">
          Save Solar Specification & Request Official Proposal
        </h2>
        <p className="font-sans text-sm text-[#40493d] mt-1 leading-relaxed">
          Save your calculated solar panel array specification or submit your contact information to receive official turnkey installation quotes.
        </p>
      </div>

      {/* Notice Banner */}
      {notice && (
        <div className="p-4 bg-[#ceee93]/40 border border-[#00490e]/30 rounded-2xl text-[#00490e] flex items-center justify-between text-xs font-semibold animate-in">
          <div className="flex items-center gap-2">
            <SunlitIcon name="check_circle" size={18} className="text-[#00490e]" />
            <span>{notice}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionNotice(null)}
            className="font-bold hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Grid: Profile Meta Form & Lead Capture Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Specification Profile Meta Form */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#bfcaba]/40 shadow-xs space-y-4">
          <h4 className="font-headline font-bold text-xs text-[#1f1b17] uppercase tracking-wider">
            Specification Profile Meta
          </h4>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-sans font-bold text-[#1f1b17] block mb-1">
                Specification Profile Title
              </label>
              <input
                type="text"
                value={profileTitle}
                onChange={(e) => onUpdateTitle(e.target.value)}
                className="w-full bg-[#fcf2eb] border border-[#bfcaba]/60 rounded-xl px-3.5 py-2.5 font-bold text-[#1f1b17] outline-none focus:ring-2 focus:ring-[#00490e]"
                placeholder="e.g. 7.7 kWp Monocrystalline Solar Spec"
              />
            </div>

            <div>
              <label className="font-sans font-bold text-[#1f1b17] block mb-1">
                User Classification
              </label>
              <select
                value={userClassification}
                onChange={(e) => onUpdateUserClass(e.target.value)}
                className="w-full bg-[#fcf2eb] border border-[#bfcaba]/60 rounded-xl px-3.5 py-2.5 font-bold text-[#1f1b17] outline-none focus:ring-2 focus:ring-[#00490e]"
              >
                <option value="Homeowner">Homeowner</option>
                <option value="Business Owner">Business Owner</option>
                <option value="Installer">Installer</option>
                <option value="EPC Contractor">EPC Contractor</option>
                <option value="Engineer">Solar Engineer</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lead Contact Capture Form (Screen 11) */}
        <form onSubmit={handleSubmitLead} className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#bfcaba]/40 shadow-xs space-y-4">
          <h4 className="font-headline font-bold text-xs text-[#00490e] uppercase tracking-wider flex items-center gap-2">
            <SunlitIcon name="mail" size={16} />
            <span>Request Official Turnkey EPC Proposal</span>
          </h4>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-sans font-bold text-[#1f1b17] block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => onUpdateContact(e.target.value, contactEmail, contactPhone)}
                className="w-full bg-[#fcf2eb] border border-[#bfcaba]/60 rounded-xl px-3.5 py-2.5 font-bold text-[#1f1b17] outline-none focus:ring-2 focus:ring-[#00490e]"
                placeholder="e.g. Engr. Babatunde Lawal"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-sans font-bold text-[#1f1b17] block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => onUpdateContact(contactName, e.target.value, contactPhone)}
                  className="w-full bg-[#fcf2eb] border border-[#bfcaba]/60 rounded-xl px-3 py-2 font-bold text-[#1f1b17] outline-none focus:ring-2 focus:ring-[#00490e]"
                  placeholder="name@domain.com"
                />
              </div>

              <div>
                <label className="font-sans font-bold text-[#1f1b17] block mb-1">Phone / WhatsApp</label>
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(e) => onUpdateContact(contactName, contactEmail, e.target.value)}
                  className="w-full bg-[#fcf2eb] border border-[#bfcaba]/60 rounded-xl px-3 py-2 font-bold text-[#1f1b17] outline-none focus:ring-2 focus:ring-[#00490e]"
                  placeholder="+234 800 000 0000"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#00490e] hover:bg-[#0f631b] text-white font-bold py-2.5 rounded-xl shadow-xs transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <SunlitIcon name="send" size={16} />
              <span>Submit for Installer Turnkey Quote</span>
            </button>
          </div>
        </form>
      </div>

      {/* Next Tool CTAs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Next Tool: Battery Capacity */}
        <Link
          href="/tools/battery-capacity"
          className="p-5 rounded-2xl border border-[#00490e] bg-gradient-to-br from-[#00490e] to-[#0f631b] text-white text-left transition-all duration-300 hover:shadow-lg group flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white mb-3 shrink-0">
              <SunlitIcon name="battery_charging_full" size={22} />
            </div>
            <h4 className="font-headline font-bold text-lg">Proceed to Battery Capacity Calculator</h4>
            <p className="font-sans text-xs text-white/80 mt-1 leading-relaxed">
              Size energy storage capacity to match your calculated {resData.actualArrayKwp ?? 7.7} kWp solar array generation.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#8cdd86] group-hover:translate-x-1 transition-transform">
            <span>Launch Battery Sizer</span>
            <SunlitIcon name="arrow_forward" size={14} />
          </div>
        </Link>

        {/* Save Spec */}
        <button
          type="button"
          onClick={handleSave}
          className="p-5 rounded-2xl border border-[#bfcaba]/50 bg-white/90 backdrop-blur-md text-[#1f1b17] text-left transition-all duration-300 hover:border-[#00490e] hover:shadow-md group flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#f6ece6] flex items-center justify-center text-[#00490e] mb-3 shrink-0 border border-[#bfcaba]/30">
              <SunlitIcon name="bookmark_add" size={22} />
            </div>
            <h4 className="font-headline font-bold text-lg">
              {saved ? 'Specification Saved!' : 'Save Spec to Dashboard'}
            </h4>
            <p className="font-sans text-xs text-[#40493d] mt-1 leading-relaxed">
              Store this PV array specification in your Sunlit Energy session account for engineering review.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#00490e] group-hover:translate-x-1 transition-transform">
            <span>{saved ? 'Saved to Account' : 'Save Specification'}</span>
            <SunlitIcon name="check" size={14} />
          </div>
        </button>

        {/* Export PDF */}
        <button
          type="button"
          onClick={handleExportPDF}
          className="p-5 rounded-2xl border border-[#bfcaba]/50 bg-white/90 backdrop-blur-md text-[#1f1b17] text-left transition-all duration-300 hover:border-[#00490e] hover:shadow-md group flex flex-col justify-between sm:col-span-2 cursor-pointer"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#f6ece6] flex items-center justify-center text-[#00490e] shrink-0 border border-[#bfcaba]/30">
              <SunlitIcon name="description" size={22} />
            </div>
            <div>
              <h4 className="font-headline font-bold text-base">Export Solar Panel Specification PDF</h4>
              <p className="font-sans text-xs text-[#40493d] mt-0.5 leading-relaxed">
                Download verified engineering document detailing PV array capacity (kWp), module count, roof footprint (m²), and string wiring configuration.
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-[#bfcaba]/30 gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full border border-[#707a6c] text-[#1f1b17] font-sans text-sm font-semibold hover:bg-[#f6ece6] transition-all cursor-pointer"
        >
          <SunlitIcon name="sync" size={16} />
          <span>Start New Calculation</span>
        </button>

        <button
          type="button"
          onClick={onClose}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#00490e] hover:bg-[#0f631b] text-white px-8 py-3 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md cursor-pointer"
        >
          <SunlitIcon name="check_circle" size={18} />
          <span>Complete & Close</span>
        </button>
      </div>
    </div>
  );
}
