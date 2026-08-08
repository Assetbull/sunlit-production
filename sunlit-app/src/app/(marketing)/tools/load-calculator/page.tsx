import { Metadata } from 'next';
import { LoadCalculatorClient } from './LoadCalculatorClient';

export const metadata: Metadata = {
  title: 'Solar Appliance Load Calculator Nigeria — Energy Consumption | Sunlit',
  description:
    'Calculate electrical appliance load, peak surge demand, and daily kWh energy consumption for solar sizing in Nigeria.',
  keywords:
    'appliance load calculator nigeria, solar energy load calculation, daily kwh calculator lagos',
  alternates: { canonical: 'https://sunlitenergy.com/tools/load-calculator' },
  openGraph: {
    title: 'Appliance Load Calculator — Sunlit Energy',
    description: 'Calculate total watts, surge demand, and daily energy consumption.',
    url: 'https://sunlitenergy.com/tools/load-calculator',
    siteName: 'Sunlit Energy',
    locale: 'en_NG',
    type: 'website',
  },
};

export default function LoadCalculatorPage() {
  return <LoadCalculatorClient />;
}
