import { Metadata } from 'next';
import { ToolsMarketingClient } from './ToolsMarketingClient';

export const metadata: Metadata = {
  title: 'Solar Engineering Tools — Enterprise Sizing & System Calculators | Sunlit Energy',
  description:
    'Authoritative, deterministic solar engineering calculators for Nigeria. Model load profiles, panel capacity, battery autonomy, cable ampacity, PV strings, inverter surge, energy yield, and financial ROI.',
  keywords:
    'solar engineering tools nigeria, solar calculator lagos, battery sizing calculator, inverter sizing tool, cable sizing calculator, pv array layout, solar roi calculator',
  alternates: { canonical: 'https://sunlit.energy/tools' },
  openGraph: {
    title: 'Solar Engineering Tools — Sunlit Energy Nigeria',
    description:
      'Deterministic calculation engines for homeowners, solar engineers, and EPC contractors.',
    url: 'https://sunlit.energy/tools',
    siteName: 'Sunlit Energy',
    locale: 'en_NG',
    type: 'website',
  },
};

export default function ToolsIndexPage() {
  return <ToolsMarketingClient />;
}
