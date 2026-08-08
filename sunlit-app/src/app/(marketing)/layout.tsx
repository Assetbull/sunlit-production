'use client';

import { WaitlistProvider, useWaitlist } from '@/shared/contexts/WaitlistContext';
import { AnnouncementBar } from '@/shared/components/marketing/sections/AnnouncementBar';
import { MarketingNavbar } from '@/shared/components/marketing/Navbar';
import { MarketingFooter } from '@/shared/components/marketing/Footer';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { openWaitlist } = useWaitlist();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#fff' }}>
      <AnnouncementBar onWaitlistOpen={openWaitlist} />
      <MarketingNavbar onWaitlistOpen={openWaitlist} />
      <main style={{ flex: 1, paddingTop: '72px' }}>
        {children}
      </main>
      <MarketingFooter />
    </div>
  );
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WaitlistProvider>
      <LayoutContent>{children}</LayoutContent>
    </WaitlistProvider>
  );
}
