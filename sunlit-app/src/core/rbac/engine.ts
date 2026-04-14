import { UserRole } from '@/shared/types/database';
import { Permission, RolePermissions } from './permissions';

/**
 * Validates if a given role has the required permission.
 * Deny-by-default architecture.
 */
export class RbacEngine {
  
  static hasPermission(role: UserRole | undefined, permission: Permission): boolean {
    if (!role) return false;
    
    const allowedPermissions = RolePermissions[role];
    if (!allowedPermissions) return false;
    
    return allowedPermissions.includes(permission);
  }

  static enforcePermission(role: UserRole | undefined, permission: Permission) {
    if (!this.hasPermission(role, permission)) {
      throw new Error(`Forbidden: Role ${role} does not have permission '${permission}'`);
    }
  }
}
