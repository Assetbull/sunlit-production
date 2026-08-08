'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

const FAQS = [
  {
    q: 'What is the average cost of solar installation in Nigeria?',
    a: 'Costs vary based on system size, roof type, and location. Our platform allows you to get multiple quotes from verified installers to ensure you get competitive, transparent pricing. You can also use our calculator for a quick estimate.',
  },
  {
    q: 'How does Sunlit verify solar installers and EPC contractors?',
    a: 'We maintain a rigorous vetting process that includes verifying licenses, insurance, past performance data, and financial stability. Only tier-one professionals make it onto our marketplace.',
  },
  {
    q: 'Is my payment secure when using the Sunlit platform?',
    a: 'Funds are held securely in escrow and only released upon successful completion of predefined project milestones (e.g., equipment delivery, installation, final inspection). This protects both the property owner and the installer.',
  },
  {
    q: 'What solar financing options are available for businesses?',
    a: 'Yes, through our platform, you can access a range of financing partners offering solar loans, leases, and Power Purchase Agreements (PPAs) tailored to your financial needs.',
  },
  {
    q: 'How do I request maintenance for my solar energy system?',
    a: 'All installations through Sunlit come with robust warranties. If maintenance is needed, you can easily log a service request directly through your Project Dashboard, and a verified technician will be dispatched.',
  },
];

export function FAQPreview() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-surface" id="faq">
      <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="text-center mb-16">
          <h2 className="text-display-lg-mobile md:text-display-lg font-headline-xl text-on-surface mb-4 font-extrabold tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-body-lg font-body-lg text-on-surface-variant">
            Everything you need to know about transitioning to solar with Sunlit.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {FAQS.map((faq, i) => (
            <div
              key={faq.q}
              className="bg-surface-container-lowest border border-surface-container-highest rounded-2xl overflow-hidden shadow-sm transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex justify-between items-center p-6 w-full text-left cursor-pointer outline-none"
              >
                <h4 className="text-base font-bold text-on-surface pr-8">
                  {faq.q}
                </h4>
                <ChevronDown
                  size={20}
                  className={`text-primary transition-transform duration-300 shrink-0 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openIndex === i && (
                <div className="px-6 pb-6 text-sm text-on-surface-variant leading-relaxed border-t border-surface-container/40 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/faq"
            className="inline-flex items-center gap-1 font-bold text-sm text-primary hover:underline"
          >
            See all FAQs & Help Center →
          </Link>
        </div>
      </div>
    </section>
  );
}
