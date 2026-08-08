import { Metadata } from 'next';
import { SolarSavingsClient } from './SolarSavingsClient';

export const metadata: Metadata = {
  title: 'Solar Savings Calculator Nigeria — Diesel & Grid Cost Offset | Sunlit',
  description: 'Calculate monthly and annual financial savings by replacing grid tariffs and diesel generator spending in Nigeria.',
  keywords: 'solar savings calculator nigeria, diesel savings calculator lagos, solar cost offset nigeria',
  alternates: { canonical: 'https://sunlitenergy.com/tools/solar-savings' },
  openGraph: {
    title: 'Solar Savings Calculator — Sunlit Energy',
    description: 'Calculate monthly and 10-year cumulative fuel and grid savings.',
    url: 'https://sunlitenergy.com/tools/solar-savings',
    siteName: 'Sunlit Energy',
    locale: 'en_NG',
    type: 'website',
  },
};

export default function SolarSavingsPage() {
  return <SolarSavingsClient />;
}
