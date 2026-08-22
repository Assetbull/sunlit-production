'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface EngineeringFAQProps {
  faqs: FAQItem[];
  toolName: string;
}

export function EngineeringFAQ({ faqs, toolName }: EngineeringFAQProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="bg-white/80 backdrop-blur-md border border-[#c0c9bb]/40 rounded-3xl p-6 sm:p-8 shadow-sm mb-10">
      <div className="flex items-center gap-3 border-b border-stone-200/80 pb-4 mb-6">
        <div className="w-10 h-10 rounded-full bg-[#aef4a5]/40 flex items-center justify-center text-[#00490e]">
          <HelpCircle size={20} />
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#00490e] block">
            Frequently Answered Questions
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1f1b17]">
            {toolName} — Engineering Insights
          </h2>
        </div>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="border border-stone-200 rounded-2xl overflow-hidden bg-stone-50/50 transition-colors"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between p-5 text-left font-bold text-stone-900 text-sm sm:text-base hover:bg-stone-100/60 transition-colors"
                aria-expanded={isOpen}
              >
                <span>{faq.question}</span>
                <ChevronDown
                  size={18}
                  className={`text-stone-500 transition-transform duration-200 shrink-0 ml-4 ${
                    isOpen ? 'rotate-180 text-[#00490e]' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
