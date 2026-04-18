export const SUNLIT_ROLES = [
  'project_owner',
  'installer',
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
  supplier: '/dashboard/supplier',
  mini_grid: '/dashboard/mini-grid',
};

export function dashboardPathForRole(role: SunlitRole): string {
  return ROLE_DASHBOARD[role];
}

export function requiredRoleForDashboardPath(pathname: string): SunlitRole | null {
  if (pathname.startsWith('/dashboard/project-owner')) return 'project_owner';
  if (pathname.startsWith('/dashboard/installer')) return 'installer';
  if (pathname.startsWith('/dashboard/supplier')) return 'supplier';
  if (pathname.startsWith('/dashboard/mini-grid')) return 'mini_grid';
  return null;
}
