import { getDashboardRoute } from '@/core/auth/roleRouter';

/**
 * GEMINI.md §1.5: All stakeholder roles for the marketplace.
 * Build sequence: PO → Installer → CrewLink → EPC → Admin
 */
export const SUNLIT_ROLES = [
  'project_owner',
  'installer',
  'crew_member', // Changed from crewlink to crew_member
  'epc_contractor',
  'admin',
  'supplier',
  'mini_grid',
] as const;

export type SunlitRole = (typeof SUNLIT_ROLES)[number];

export function isSunlitRole(value: unknown): value is SunlitRole {
  return typeof value === 'string' && (SUNLIT_ROLES as readonly string[]).includes(value);
}

const ROLE_DASHBOARD: Record<SunlitRole, string> = {
  project_owner: '/dashboard/project-owner',
  installer: '/dashboard/installer',
  crew_member: '/dashboard/crewlink',
  epc_contractor: '/dashboard/installer',
  admin: '/dashboard/admin',
  supplier: '/dashboard/supplier',
  mini_grid: '/dashboard/mini-grid',
};

export function dashboardPathForRole(role: SunlitRole): string {
  return getDashboardRoute(role);
}

export function requiredRoleForDashboardPath(pathname: string): SunlitRole | null {
  if (pathname === '/dashboard' || pathname.startsWith('/dashboard/project-owner')) return 'project_owner';
  if (pathname.startsWith('/installer/dashboard') || pathname.startsWith('/dashboard/installer')) return 'installer';
  if (pathname.startsWith('/technician/dashboard') || pathname.startsWith('/Technician') || pathname.startsWith('/technician') || pathname.startsWith('/dashboard/crewlink')) return 'crew_member';
  if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard/admin')) return 'admin';
  if (pathname.startsWith('/dashboard/supplier')) return 'supplier';
  if (pathname.startsWith('/dashboard/mini-grid')) return 'mini_grid';
  // EPC contractors share the installer dashboard path (roleRouter.ts)
  // but if a dedicated EPC path is added in the future, it should be mapped here.
  return null;
}

