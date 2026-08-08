import { Metadata } from 'next';
import { RoiCalculatorClient } from './RoiCalculatorClient';

export const metadata: Metadata = {
  title: 'Solar ROI & Payback Calculator Nigeria — 25-Year NPV & Return | Sunlit',
  description: 'Calculate payback period in years, simple ROI %, and 25-year Net Present Value (NPV) for solar in Nigeria.',
  keywords: 'solar roi calculator nigeria, solar payback period lagos, solar investment return nigeria',
  alternates: { canonical: 'https://sunlitenergy.com/tools/roi-calculator' },
  openGraph: {
    title: 'Solar ROI & Payback Calculator — Sunlit Energy',
    description: 'Calculate solar payback period and 25-year NPV.',
    url: 'https://sunlitenergy.com/tools/roi-calculator',
    siteName: 'Sunlit Energy',
    locale: 'en_NG',
    type: 'website',
  },
};

export default function RoiCalculatorPage() {
  return <RoiCalculatorClient />;
}
