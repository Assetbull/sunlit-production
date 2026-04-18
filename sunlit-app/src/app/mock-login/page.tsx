'use client';

import { useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Sun, Briefcase, HardHat, Package, ChevronRight, AlertTriangle } from 'lucide-react';
import { bootstrapMockSession } from '@/shared/auth/client-session';
import { dashboardPathForRole, type SunlitRole } from '@/shared/auth/sunlit-roles';
import styles from './page.module.css';

const MOCK_ROLES: { id: SunlitRole; label: string; icon: ReactNode }[] = [
  { id: 'project_owner', label: 'Project Owner', icon: <Briefcase className={styles.roleIcon} /> },
  { id: 'installer', label: 'Solar Installer', icon: <HardHat className={styles.roleIcon} /> },
  { id: 'supplier', label: 'Supplier', icon: <Package className={styles.roleIcon} /> },
  { id: 'mini_grid', label: 'Mini-Grid Developer', icon: <Sun className={styles.roleIcon} /> },
];

export default function MockLogin() {
  const router = useRouter();
  const [busy, setBusy] = useState<SunlitRole | null>(null);

  const handleLogin = async (role: SunlitRole) => {
    setBusy(role);
    const session = await bootstrapMockSession({
      user_id: `mock_portal_${role}`,
      name: 'Test User',
      role,
    });
    setBusy(null);
    if (session) {
      router.push(dashboardPathForRole(role));
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <Sun size={48} strokeWidth={1.5} />
        </div>
        <h1 className={styles.title}>Sunlit Test Portal</h1>
        <p className={styles.subtitle}>
          Select a role to establish a mock session. For internal QA only when NEXT_PUBLIC_USE_REAL is not true.
        </p>

        <div className={styles.roleList}>
          {MOCK_ROLES.map((role) => (
            <button
              key={role.id}
              type="button"
              disabled={busy !== null}
              onClick={() => handleLogin(role.id)}
              className={styles.roleButton}
            >
              <span className={styles.roleContent}>
                {role.icon}
                {busy === role.id ? 'Signing in…' : role.label}
              </span>
              <ChevronRight className={styles.arrowIcon} />
            </button>
          ))}
        </div>

        <div className={styles.warning}>
          <AlertTriangle size={14} />
          <span>Uses mock auth cookies and a local session mirror.</span>
        </div>
      </div>
    </div>
  );
}
