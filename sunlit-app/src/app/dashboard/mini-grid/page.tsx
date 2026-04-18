'use client';

import { useRouter } from 'next/navigation';
import { LogOut, Zap } from 'lucide-react';
import { logoutClient } from '@/shared/auth/client-session';

export default function MiniGridDashboardPage() {
  const router = useRouter();

  async function handleLogout() {
    await logoutClient();
    router.push('/');
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center mb-6">
        <Zap size={32} />
      </div>
      <h1 className="text-3xl font-headline font-bold text-on-surface mb-3">Mini-grid workspace</h1>
      <p className="body-lg text-muted max-w-md mb-10">
        This dashboard shell is live for routing and auth validation. Mini-grid programs will be built out in this area.
      </p>
      <button type="button" className="btn btn-secondary gap-2" onClick={handleLogout}>
        <LogOut size={18} />
        Log out
      </button>
    </div>
  );
}
