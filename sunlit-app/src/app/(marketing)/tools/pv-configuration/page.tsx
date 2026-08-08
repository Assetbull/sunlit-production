import { Metadata } from 'next';
import { PvConfigurationClient } from './PvConfigurationClient';

export const metadata: Metadata = {
  title: 'PV String Layout Configurator Nigeria — MPPT Series-Parallel | Sunlit',
  description: 'Optimize solar panel series-parallel string layouts for inverter MPPT voltage windows in Nigeria.',
  keywords: 'pv string calculator nigeria, mppt string calculator, solar panel string layout',
  alternates: { canonical: 'https://sunlitenergy.com/tools/pv-configuration' },
  openGraph: {
    title: 'PV String Layout Configurator — Sunlit Energy',
    description: 'Optimize string layouts for MPPT voltage windows.',
    url: 'https://sunlitenergy.com/tools/pv-configuration',
    siteName: 'Sunlit Energy',
    locale: 'en_NG',
    type: 'website',
  },
};

export default function PvConfigurationPage() {
  return <PvConfigurationClient />;
}
