import { UserRole } from '@/shared/types/database';
import { Permission, RolePermissions } from './permissions';

/**
 * Enhanced permissions stored in the database as JSONB.
 * Example: {"create:project": true, "approve:milestone": true, "fund:payment": true}
 */
export type EnhancedPermissions = Record<string, boolean>;

/**
 * Validates if a given role has the required permission.
 * Deny-by-default architecture (Zero-Trust).
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

  /**
   * Checks if a user has an enhanced permission stored in the database.
   * Enhanced permissions are stored as JSONB in the roles table.
   */
  static hasEnhancedPermission(
    enhancedPermissions: EnhancedPermissions | undefined,
    permission: Permission
  ): boolean {
    if (!enhancedPermissions) return false;
    return enhancedPermissions[permission] === true;
  }

  /**
   * Validates if a user has a permission, checking both role-based and enhanced permissions.
   */
  static hasPermissionWithEnhanced(
    role: UserRole | undefined,
    enhancedPermissions: EnhancedPermissions | undefined,
    permission: Permission
  ): boolean {
    if (this.hasPermission(role, permission)) {
      return true;
    }
    return this.hasEnhancedPermission(enhancedPermissions, permission);
  }

  /**
   * Enforces permission check including enhanced permissions.
   * Throws an error if the user doesn't have the required permission.
   */
  static enforcePermissionWithEnhanced(
    role: UserRole | undefined,
    enhancedPermissions: EnhancedPermissions | undefined,
    permission: Permission
  ) {
    if (!this.hasPermissionWithEnhanced(role, enhancedPermissions, permission)) {
      throw new Error(
        `Forbidden: Role ${role} does not have permission '${permission}' (checked both role and enhanced permissions)`
      );
    }
  }
}

/**
 * Convenience helper to verify user permission against the Zero-Trust RBAC matrix.
 */
export function checkPermission(user: { role?: UserRole } | null | undefined, permission: Permission): boolean {
  if (!user || !user.role) return false;
  return RbacEngine.hasPermission(user.role, permission);
}

/**
 * Convenience helper to verify user role against expected canonical role.
 */
export function hasRole(user: { role?: UserRole } | null | undefined, role: UserRole): boolean {
  if (!user || !user.role) return false;
  return user.role === role;
}
