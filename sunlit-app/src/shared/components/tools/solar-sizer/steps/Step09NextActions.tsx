'use client';

import React, { useState } from 'react';

interface Step09Props {
  onRestart: () => void;
  onClose: () => void;
}

export function Step09NextActions({ onRestart, onClose }: Step09Props) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const handleDownloadBOM = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setActionNotice('Engineering Report & Bill of Materials PDF compiled successfully!');
    }, 1200);
  };

  const handleRequestQuote = () => {
    setActionNotice('Quotation request submitted to top-rated verified Sunlit EPC contractors!');
  };

  const handleScheduleSurvey = () => {
    setActionNotice('Site engineering survey request registered. A Sunlit representative will contact you.');
  };

  const handleSaveSession = () => {
    setCopied(true);
    setActionNotice('Solar system sizing result saved to your session account.');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      <div>
        <span className="text-xs font-semibold text-[#00490e] uppercase tracking-wider block mb-1">
          Step 09 of 09
        </span>
        <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#191d17]">
          Recommended Next Actions
        </h2>
        <p className="font-sans text-sm text-[#41493e] mt-1">
          Select your preferred next step to convert this engineering sizing into an installation contract or official proposal.
        </p>
      </div>

      {/* Toast Notice Banner */}
      {actionNotice && (
        <div className="p-4 bg-[#aef4a5]/30 border border-[#00490e]/30 rounded-2xl text-[#00490e] flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base">check_circle</span>
            <span>{actionNotice}</span>
          </div>
          <button
            onClick={() => setActionNotice(null)}
            className="text-[#00490e] font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Action 1: Request EPC Quote */}
        <button
          type="button"
          onClick={handleRequestQuote}
          className="p-5 rounded-2xl border border-[#00490e] bg-gradient-to-br from-[#00490e] to-[#003006] text-white text-left transition-all hover:shadow-lg group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white mb-3">
              <span className="material-symbols-outlined text-2xl">request_quote</span>
            </div>
            <h4 className="font-headline font-bold text-lg">Request EPC Vendor Quotations</h4>
            <p className="font-sans text-xs text-[#dce6d5] mt-1">
              Submit your sizing report to verified Sunlit EPC installation contractors for binding quotes.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#aef4a5] group-hover:translate-x-1 transition-transform">
            <span>Request Quotes</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </div>
        </button>

        {/* Action 2: Download PDF Report */}
        <button
          type="button"
          onClick={handleDownloadBOM}
          className="p-5 rounded-2xl border border-[#c0c9bb]/50 bg-white/80 backdrop-blur-md text-[#191d17] text-left transition-all hover:border-[#00490e] hover:shadow-md group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#ecefe6] flex items-center justify-center text-[#00490e] mb-3">
              <span className="material-symbols-outlined text-2xl">description</span>
            </div>
            <h4 className="font-headline font-bold text-lg">
              {downloading ? 'Compiling PDF Report...' : 'Download Engineering Report PDF'}
            </h4>
            <p className="font-sans text-xs text-[#41493e] mt-1">
              Export comprehensive technical specification PDF with complete Bill of Materials (BOM).
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#00490e] group-hover:translate-x-1 transition-transform">
            <span>Download PDF</span>
            <span className="material-symbols-outlined text-sm">download</span>
          </div>
        </button>

        {/* Action 3: Schedule Survey */}
        <button
          type="button"
          onClick={handleScheduleSurvey}
          className="p-5 rounded-2xl border border-[#c0c9bb]/50 bg-white/80 backdrop-blur-md text-[#191d17] text-left transition-all hover:border-[#00490e] hover:shadow-md group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#dce6d5] flex items-center justify-center text-[#5e675a] mb-3">
              <span className="material-symbols-outlined text-2xl">event</span>
            </div>
            <h4 className="font-headline font-bold text-lg">Schedule Site Engineering Survey</h4>
            <p className="font-sans text-xs text-[#41493e] mt-1">
              Book an on-site rooftop structural and electrical panel audit with a certified Sunlit engineer.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#00490e] group-hover:translate-x-1 transition-transform">
            <span>Schedule Visit</span>
            <span className="material-symbols-outlined text-sm">calendar_month</span>
          </div>
        </button>

        {/* Action 4: Save Result */}
        <button
          type="button"
          onClick={handleSaveSession}
          className="p-5 rounded-2xl border border-[#c0c9bb]/50 bg-white/80 backdrop-blur-md text-[#191d17] text-left transition-all hover:border-[#00490e] hover:shadow-md group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#d8e3fb] flex items-center justify-center text-[#101c2d] mb-3">
              <span className="material-symbols-outlined text-2xl">bookmark</span>
            </div>
            <h4 className="font-headline font-bold text-lg">
              {copied ? 'Result Saved!' : 'Save Result to Dashboard'}
            </h4>
            <p className="font-sans text-xs text-[#41493e] mt-1">
              Store this sizing session design state in your Sunlit user account for future access.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#00490e] group-hover:translate-x-1 transition-transform">
            <span>{copied ? 'Saved' : 'Save Session'}</span>
            <span className="material-symbols-outlined text-sm">check</span>
          </div>
        </button>
      </div>

      {/* Bottom Control Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-[#c0c9bb]/30 gap-3">
        <button
          onClick={onRestart}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full border border-[#c0c9bb] text-[#191d17] font-sans text-sm font-semibold hover:bg-[#ecefe6] transition-all"
        >
          <span className="material-symbols-outlined text-base">restart_alt</span>
          <span>Start New Sizing Session</span>
        </button>

        <button
          onClick={onClose}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#00490e] hover:bg-[#003006] text-white px-8 py-3 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md"
        >
          <span className="material-symbols-outlined text-base">task_alt</span>
          <span>Complete Sizing & Close</span>
        </button>
      </div>
    </div>
  );
}
