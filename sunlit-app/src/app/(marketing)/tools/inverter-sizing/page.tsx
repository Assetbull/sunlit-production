import { Metadata } from 'next';
import { InverterSizingClient } from './InverterSizingClient';

export const metadata: Metadata = {
  title: 'Inverter Sizing Calculator Nigeria — kVA & Power Factor | Sunlit',
  description:
    'Calculate inverter kVA size, continuous kW capacity, and DC bus voltage for solar installations in Nigeria.',
  keywords:
    'inverter sizing calculator nigeria, kva calculator lagos, hybrid inverter sizing',
  alternates: { canonical: 'https://sunlitenergy.com/tools/inverter-sizing' },
  openGraph: {
    title: 'Inverter Sizing Calculator — Sunlit Energy',
    description: 'Calculate inverter kVA size and surge requirements.',
    url: 'https://sunlitenergy.com/tools/inverter-sizing',
    siteName: 'Sunlit Energy',
    locale: 'en_NG',
    type: 'website',
  },
};

export default function InverterSizingPage() {
  return <InverterSizingClient />;
}
