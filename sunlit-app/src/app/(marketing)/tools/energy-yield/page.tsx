import { Metadata } from 'next';
import { EnergyYieldClient } from './EnergyYieldClient';

export const metadata: Metadata = {
  title: 'Solar Energy Yield Estimator Nigeria — Daily & Annual kWh | Sunlit',
  description: 'Simulate solar energy yield, daily kWh generation, and 25-year lifetime performance in Nigeria.',
  keywords: 'solar energy yield estimator nigeria, solar kWh yield calculator lagos, annual solar generation',
  alternates: { canonical: 'https://sunlitenergy.com/tools/energy-yield' },
  openGraph: {
    title: 'Solar Energy Yield Estimator — Sunlit Energy',
    description: 'Simulate daily, monthly, and 25-year kWh generation.',
    url: 'https://sunlitenergy.com/tools/energy-yield',
    siteName: 'Sunlit Energy',
    locale: 'en_NG',
    type: 'website',
  },
};

export default function EnergyYieldPage() {
  return <EnergyYieldClient />;
}
