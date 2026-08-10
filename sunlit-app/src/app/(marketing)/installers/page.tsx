/**
 * /installers — Installer Intelligence Directory Landing Page
 * 
 * Stitch Source of Truth: installer-directory.html (screen 41a2eb5a)
 * Visual Design: Faithfully reproduces the Stitch approved design.
 * 
 * PUBLIC PAGE — no authentication required.
 * Returns PublicInstallerCardView[] only.
 * Never exposes private data.
 */

import { Metadata } from 'next';
import { InstallerDirectoryClient } from './InstallerDirectoryClient';

export const metadata: Metadata = {
  title: 'Find Verified Solar Installers | Installer Intelligence Directory — Sunlit Energy',
  description:
    'Discover trusted, verified solar energy installers and EPC contractors across Nigeria. Compare SunlitScores, ratings, certifications, and completed projects. Get matched with the right installer for your solar project.',
  keywords:
    'solar installer nigeria, solar contractor lagos, verified solar installer, epc contractor nigeria, solar panel installation, sunlit energy directory, solar installer near me',
  alternates: {
    canonical: 'https://sunlit.energy/installers',
  },
  openGraph: {
    title: 'Find Verified Solar Installers — Sunlit Energy',
    description:
      'Discover trusted, verified solar energy installers across Nigeria. Compare ratings, projects, and certifications.',
    url: 'https://sunlit.energy/installers',
    siteName: 'Sunlit Energy',
    locale: 'en_NG',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function InstallersDirectoryPage() {
  return <InstallerDirectoryClient />;
}
