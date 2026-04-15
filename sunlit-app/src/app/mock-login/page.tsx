'use client';

import { useRouter } from 'next/navigation';
import { Sun, Briefcase, Zap, Shield, HardHat, ChevronRight, AlertTriangle } from 'lucide-react';
import styles from './page.module.css';

const MOCK_ROLES = [
  { id: 'project-owner', label: 'Project Owner', icon: <Briefcase className={styles.roleIcon} />, path: '/dashboard/project-owner' },
  { id: 'installer', label: 'Solar Installer', icon: <HardHat className={styles.roleIcon} />, path: '/dashboard/installer' },
  { id: 'epc', label: 'EPC Contractor', icon: <Zap className={styles.roleIcon} />, path: '/dashboard/epc' },
  { id: 'minigrid', label: 'Mini-Grid Developer', icon: <Sun className={styles.roleIcon} />, path: '/dashboard/minigrid' },
  { id: 'admin', label: 'System Admin', icon: <Shield className={styles.roleIcon} />, path: '/dashboard/admin' },
];

export default function MockLogin() {
  const router = useRouter();

  const handleLogin = (role: typeof MOCK_ROLES[0]) => {
    // Set a mock super cookie to bypass real auth
    document.cookie = `sunlit_mock_role=${role.id}; path=/; max-age=86400`;
    router.push(role.path);
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <Sun size={48} strokeWidth={1.5} />
        </div>
        <h1 className={styles.title}>Sunlit Test Portal</h1>
        <p className={styles.subtitle}>
          Select a role to mimic authentication. This portal is only enabled in specific test and Vercel branch environments.
        </p>

        <div className={styles.roleList}>
          {MOCK_ROLES.map((role) => (
            <button
              key={role.id}
              onClick={() => handleLogin(role)}
              className={styles.roleButton}
            >
              <span className={styles.roleContent}>
                {role.icon}
                {role.label}
              </span>
              <ChevronRight className={styles.arrowIcon} />
            </button>
          ))}
        </div>

        <div className={styles.warning}>
          <AlertTriangle size={14} />
          <span>This bypasses real Clerk authentication for testing.</span>
        </div>
      </div>
    </div>
  );
}
