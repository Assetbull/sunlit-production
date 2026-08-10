/**
 * /request-quote — Public Request Quote & RFQ Match Page
 * 
 * Stitch Source of Truth: contact-request-quote.html (screen 7722c55f)
 * 
 * Connected to Sunlit RFQ and matching engine.
 * Allows homeowners and commercial entities to request bids from verified installers.
 */

import { Metadata } from 'next';
import { RequestQuoteClient } from './RequestQuoteClient';

export const metadata: Metadata = {
  title: 'Request a Solar Quote | Get Matched with Verified Installers — Sunlit Energy',
  description:
    'Submit your solar project requirements and receive competitive, verified quotes from top-rated solar installers and EPC contractors in Nigeria. 100% free with escrow protection.',
  alternates: {
    canonical: 'https://sunlit.energy/request-quote',
  },
  openGraph: {
    title: 'Request a Solar Quote — Sunlit Energy',
    description: 'Get matched with verified solar installers in Nigeria.',
    url: 'https://sunlit.energy/request-quote',
    siteName: 'Sunlit Energy',
    locale: 'en_NG',
    type: 'website',
  },
};

export default function RequestQuotePage() {
  return <RequestQuoteClient />;
}
