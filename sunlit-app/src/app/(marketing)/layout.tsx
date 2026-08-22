'use client';

import { WaitlistProvider, useWaitlist } from '@/shared/contexts/WaitlistContext';
import { MarketingNavbar } from '@/shared/components/marketing/Navbar';
import { MarketingFooter } from '@/shared/components/marketing/Footer';

import { usePathname } from 'next/navigation';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { openWaitlist } = useWaitlist();
  const pathname = usePathname();
  const isRootLanding = pathname === '/';

  if (isRootLanding) {
    return <>{children}</>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#faf8f3', color: '#1a1c1b' }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 1000, width: '100%', pointerEvents: 'none' }}>
        <MarketingNavbar onWaitlistOpen={openWaitlist} />
      </header>
      <main style={{ flex: 1 }}>
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
