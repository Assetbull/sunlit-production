import { Metadata } from 'next';
import { CookiePolicyClient } from '@/shared/components/legal/CookiePolicyClient';

export const metadata: Metadata = {
  title: 'Cookie & Tracking Policy | Sunlit Energy',
  description:
    'Detailed breakdown of essential, functional, analytics, and marketing cookies utilized on the Sunlit Energy platform.',
};

export default function CookiePolicyPage() {
  return <CookiePolicyClient />;
}
