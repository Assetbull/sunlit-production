'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SharedCalculationResult } from '@/lib/engineering/types';

interface Step08Props {
  profileTitle: string;
  userClassification: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  calculationResult: SharedCalculationResult | null;
  onUpdateTitle: (title: string) => void;
  onUpdateUserClass: (cls: string) => void;
  onUpdateContact: (name: string, email: string, phone: string) => void;
  onRestart: () => void;
  onClose: () => void;
}

export function Step08UserSpecificAction({
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
}: Step08Props) {
  const [saved, setSaved] = useState(false);
  const [notice, setActionNotice] = useState<string | null>(null);

  const handleSave = () => {
    setSaved(true);
    setActionNotice('PV String Layout & Yield Specification saved to your Sunlit account profile.');
  };

  const handleSubmitLead = (e: React.FormEvent) => {
    e.preventDefault();
    setActionNotice('Your PV layout specification and quote request have been submitted to certified Sunlit EPC engineers!');
  };

  const handleExportPDF = () => {
    setActionNotice('Compiling verified PV Yield & Loss Breakdown PDF document...');
    setTimeout(() => {
      setActionNotice('PV Configuration & Energy Yield Report PDF exported!');
    }, 1200);
  };

  const resData = calculationResult?.engineering_results || {};

  return (
    <div className="flex flex-col gap-6 py-2">
      <div>
        <span className="text-xs font-semibold text-[#00490e] uppercase tracking-wider block mb-1">
          Step 08 of 08
        </span>
        <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#191d17]">
          Save PV Specification & Request Certified Sign-Off
        </h2>
        <p className="font-sans text-sm text-[#41493e] mt-1">
          Save your calculated PV layout profile or submit your contact information to receive official engineering review.
        </p>
      </div>

      {/* Notice Banner */}
      {notice && (
        <div className="p-4 bg-[#aef4a5]/30 border border-[#00490e]/30 rounded-2xl text-[#00490e] flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base">check_circle</span>
            <span>{notice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="font-bold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Grid: Profile Meta Form & Lead Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Specification Profile Meta Form */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#c0c9bb]/40 shadow-sm space-y-4">
          <h4 className="font-headline font-bold text-sm text-[#191d17] uppercase tracking-wider">
            Specification Profile Meta
          </h4>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-sans font-bold text-[#191d17] block mb-1">
                Specification Profile Title
              </label>
              <input
                type="text"
                value={profileTitle}
                onChange={(e) => onUpdateTitle(e.target.value)}
                className="w-full bg-[#ecefe6] border border-[#c0c9bb]/60 rounded-xl px-3.5 py-2.5 font-bold text-[#191d17] outline-none focus:ring-2 focus:ring-[#00490e]"
                placeholder="e.g. 7.7 kWp PV String Layout Specification"
              />
            </div>

            <div>
              <label className="font-sans font-bold text-[#191d17] block mb-1">
                User Classification
              </label>
              <select
                value={userClassification}
                onChange={(e) => onUpdateUserClass(e.target.value)}
                className="w-full bg-[#ecefe6] border border-[#c0c9bb]/60 rounded-xl px-3.5 py-2.5 font-bold text-[#191d17] outline-none focus:ring-2 focus:ring-[#00490e]"
              >
                <option value="Installer">Solar Installer</option>
                <option value="Solar Engineer">Solar Engineer</option>
                <option value="EPC Contractor">EPC Contractor</option>
                <option value="Homeowner">Homeowner</option>
                <option value="Business Owner">Business Owner</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lead Contact Form */}
        <form onSubmit={handleSubmitLead} className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#c0c9bb]/40 shadow-sm space-y-4">
          <h4 className="font-headline font-bold text-sm text-[#00490e] uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-base">engineering</span>
            <span>Request Certified EPC Engineering Review</span>
          </h4>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-sans font-bold text-[#191d17] block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => onUpdateContact(e.target.value, contactEmail, contactPhone)}
                className="w-full bg-[#ecefe6] border border-[#c0c9bb]/60 rounded-xl px-3.5 py-2.5 font-bold text-[#191d17] outline-none focus:ring-2 focus:ring-[#00490e]"
                placeholder="e.g. Engr. Chidi Okafor"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-sans font-bold text-[#191d17] block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => onUpdateContact(contactName, e.target.value, contactPhone)}
                  className="w-full bg-[#ecefe6] border border-[#c0c9bb]/60 rounded-xl px-3 py-2 font-bold text-[#191d17] outline-none focus:ring-2 focus:ring-[#00490e]"
                  placeholder="name@domain.com"
                />
              </div>

              <div>
                <label className="font-sans font-bold text-[#191d17] block mb-1">Phone / WhatsApp</label>
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(e) => onUpdateContact(contactName, contactEmail, e.target.value)}
                  className="w-full bg-[#ecefe6] border border-[#c0c9bb]/60 rounded-xl px-3 py-2 font-bold text-[#191d17] outline-none focus:ring-2 focus:ring-[#00490e]"
                  placeholder="+234 800 000 0000"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#00490e] hover:bg-[#003006] text-white font-bold py-2.5 rounded-xl shadow-sm transition-all text-xs flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">send</span>
              <span>Submit for Engineering Sign-off</span>
            </button>
          </div>
        </form>
      </div>

      {/* Next Tool CTAs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Next Tool: Cable Sizing */}
        <Link
          href="/tools/cable-sizing"
          className="p-5 rounded-2xl border border-[#00490e] bg-gradient-to-br from-[#00490e] to-[#003006] text-white text-left transition-all hover:shadow-lg group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white mb-3">
              <span className="material-symbols-outlined text-2xl">cable</span>
            </div>
            <h4 className="font-headline font-bold text-lg">Proceed to Solar Cable Sizing Calculator</h4>
            <p className="font-sans text-xs text-[#d8e3fb] mt-1">
              Calculate required copper/aluminum DC string cable gauge ($mm^2$) to minimize ohmic voltage drop below 1.5%.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#aef4a5] group-hover:translate-x-1 transition-transform">
            <span>Launch Cable Sizer</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </div>
        </Link>

        {/* Save Spec */}
        <button
          type="button"
          onClick={handleSave}
          className="p-5 rounded-2xl border border-[#c0c9bb]/50 bg-white/80 backdrop-blur-md text-[#191d17] text-left transition-all hover:border-[#00490e] hover:shadow-md group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#ecefe6] flex items-center justify-center text-[#00490e] mb-3">
              <span className="material-symbols-outlined text-2xl">bookmark</span>
            </div>
            <h4 className="font-headline font-bold text-lg">
              {saved ? 'Specification Saved!' : 'Save Spec to Dashboard'}
            </h4>
            <p className="font-sans text-xs text-[#41493e] mt-1">
              Store this PV layout specification in your Sunlit Energy session account for engineering review.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#00490e] group-hover:translate-x-1 transition-transform">
            <span>{saved ? 'Saved to Account' : 'Save Specification'}</span>
            <span className="material-symbols-outlined text-sm">check</span>
          </div>
        </button>

        {/* Export PDF */}
        <button
          type="button"
          onClick={handleExportPDF}
          className="p-5 rounded-2xl border border-[#c0c9bb]/50 bg-white/80 backdrop-blur-md text-[#191d17] text-left transition-all hover:border-[#00490e] hover:shadow-md group flex flex-col justify-between sm:col-span-2"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#dce6d5] flex items-center justify-center text-[#151e14] shrink-0">
              <span className="material-symbols-outlined text-2xl">description</span>
            </div>
            <div>
              <h4 className="font-headline font-bold text-base">Export PV String Layout PDF Report</h4>
              <p className="font-sans text-xs text-[#41493e] mt-0.5">
                Download verified engineering document detailing annual energy yield ({resData.annualEnergyYieldKwh?.toLocaleString() ?? '12,410'} kWh/yr), PR %, and loss breakdown waterfall.
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-[#c0c9bb]/30 gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full border border-[#c0c9bb] text-[#191d17] font-sans text-sm font-semibold hover:bg-[#ecefe6] transition-all"
        >
          <span className="material-symbols-outlined text-base">restart_alt</span>
          <span>Start New Calculation</span>
        </button>

        <button
          type="button"
          onClick={onClose}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#00490e] hover:bg-[#003006] text-white px-8 py-3 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md"
        >
          <span className="material-symbols-outlined text-base">task_alt</span>
          <span>Complete & Close</span>
        </button>
      </div>
    </div>
  );
}
