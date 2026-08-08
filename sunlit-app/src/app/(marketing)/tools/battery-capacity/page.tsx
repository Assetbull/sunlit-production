import { Metadata } from 'next';
import { BatteryCapacityClient } from './BatteryCapacityClient';

export const metadata: Metadata = {
  title: 'Battery Capacity Calculator Nigeria — Lithium & Gel Sizing | Sunlit',
  description:
    'Calculate battery bank storage in kWh and Amp-Hours for 24-hour solar backup power in Nigeria.',
  keywords:
    'battery capacity calculator nigeria, lithium battery sizing lagos, solar battery calculator',
  alternates: { canonical: 'https://sunlitenergy.com/tools/battery-capacity' },
  openGraph: {
    title: 'Battery Capacity Calculator — Sunlit Energy',
    description: 'Calculate battery storage kWh and Amp-Hours.',
    url: 'https://sunlitenergy.com/tools/battery-capacity',
    siteName: 'Sunlit Energy',
    locale: 'en_NG',
    type: 'website',
  },
};

export default function BatteryCapacityPage() {
  return <BatteryCapacityClient />;
}
