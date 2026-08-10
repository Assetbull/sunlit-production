import { RbacEngine } from '@/core/rbac/engine';
import { Permission } from '@/core/rbac/permissions';
import { UserRole } from '@/shared/types/database';

/**
 * Legacy adapter for RBAC verification.
 * Delegates strictly to the authoritative Sunlit RbacEngine (Zero-Trust).
 */
export function basicRBAC(user: { role?: UserRole } | null | undefined, action: string): boolean {
  if (!user || !user.role) return false;
  return RbacEngine.hasPermission(user.role, action as Permission);
}
