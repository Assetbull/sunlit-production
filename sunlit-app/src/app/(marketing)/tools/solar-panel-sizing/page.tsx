import { Metadata } from 'next';
import { SolarPanelSizingClient } from './SolarPanelSizingClient';

export const metadata: Metadata = {
  title: 'Solar Panel Sizing Tool Nigeria — Panel Count & Roof Area | Sunlit',
  description: 'Calculate solar panel count, peak kWp rating, and unshaded roof area requirement for Nigeria.',
  keywords: 'solar panel calculator nigeria, panel count calculator lagos, solar roof area calculator',
  alternates: { canonical: 'https://sunlitenergy.com/tools/solar-panel-sizing' },
  openGraph: {
    title: 'Solar Panel Sizing Tool — Sunlit Energy',
    description: 'Calculate panel count and array rating for Nigeria.',
    url: 'https://sunlitenergy.com/tools/solar-panel-sizing',
    siteName: 'Sunlit Energy',
    locale: 'en_NG',
    type: 'website',
  },
};

export default function SolarPanelSizingPage() {
  return <SolarPanelSizingClient />;
}
