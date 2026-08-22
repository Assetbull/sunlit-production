'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getDashboardRoute } from '@/core/auth/roleRouter';
import { readLocalSession } from '@/shared/auth/client-session';

export default function DashboardLayoutGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const session = readLocalSession();
    
    if (!session) {
      router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!session.role) {
      router.replace('/auth/login');
      return;
    }

    try {
      const correctRoute = getDashboardRoute(session.role);
      
      // Enforce correct routing if mismatched
      if (!pathname.startsWith(correctRoute)) {
        console.warn(`[AUTH] Route Guard: Enforcing redirect to ${correctRoute}`);
        router.replace(correctRoute);
      } else {
        setIsVerified(true);
      }
    } catch (e) {
      console.error('[AUTH] Guard failure:', e);
      router.replace('/auth/login');
    }
  }, [router, pathname]);

  if (!isVerified) {
    return null; // Silent render while verifying root
  }

  return <>{children}</>;
}

