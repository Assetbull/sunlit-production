import { Metadata } from 'next';
import { CableSizingClient } from './CableSizingClient';

export const metadata: Metadata = {
  title: 'Solar Cable Sizing Calculator Nigeria — Conductor Gauge (mm²) | Sunlit',
  description: 'Calculate DC & AC solar cable cross-section (mm²) and voltage drop in Nigeria.',
  keywords: 'solar cable sizing calculator nigeria, dc cable calculator lagos, voltage drop calculator',
  alternates: { canonical: 'https://sunlitenergy.com/tools/cable-sizing' },
  openGraph: {
    title: 'Solar Cable Sizing Calculator — Sunlit Energy',
    description: 'Size solar cables to maintain voltage drop below 3%.',
    url: 'https://sunlitenergy.com/tools/cable-sizing',
    siteName: 'Sunlit Energy',
    locale: 'en_NG',
    type: 'website',
  },
};

export default function CableSizingPage() {
  return <CableSizingClient />;
}
