'use client';

import { useRouter } from 'next/navigation';
import { LogOut, HardHat } from 'lucide-react';
import { logoutClient } from '@/shared/auth/client-session';

export default function InstallerDashboardPage() {
  const router = useRouter();

  async function handleLogout() {
    await logoutClient();
    router.push('/');
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center mb-6">
        <HardHat size={32} />
      </div>
      <h1 className="text-3xl font-headline font-bold text-on-surface mb-3">Installer workspace</h1>
      <p className="body-lg text-muted max-w-md mb-10">
        This dashboard shell is live for routing and auth validation. Installer workflows will land here next.
      </p>
      <button type="button" className="btn btn-secondary gap-2" onClick={handleLogout}>
        <LogOut size={18} />
        Log out
      </button>
    </div>
  );
}
