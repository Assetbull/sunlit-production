import { Metadata } from 'next';
import { SolarSystemSizingClient } from './SolarSystemSizingClient';

export const metadata: Metadata = {
  title: 'Solar System Sizing Calculator Nigeria — Panels, Battery & Inverter | Sunlit',
  description:
    'Free solar system sizing calculator for homes and businesses in Nigeria. Calculate solar panel wattage, lithium battery storage capacity, and inverter kVA.',
  keywords:
    'solar system calculator nigeria, solar panel calculator lagos, battery sizing calculator, inverter sizing nigeria',
  alternates: { canonical: 'https://sunlitenergy.com/tools/solar-system-sizing' },
  openGraph: {
    title: 'Solar System Sizing Calculator — Sunlit Energy',
    description: 'Calculate solar panels, battery, and inverter sizing for Nigeria.',
    url: 'https://sunlitenergy.com/tools/solar-system-sizing',
    siteName: 'Sunlit Energy',
    locale: 'en_NG',
    type: 'website',
  },
};

export default function SolarSystemSizingPage() {
  return <SolarSystemSizingClient />;
}
