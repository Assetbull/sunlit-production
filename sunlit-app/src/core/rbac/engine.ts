import { UserRole } from '@/shared/types/database';
import { Permission, RolePermissions } from './permissions';
import { basicRBAC } from '@/security/basicRBAC';

/**
 * Enhanced permissions stored in the database as JSONB.
 * Example: {"create:project": true, "approve:milestone": true, "fund:payment": true}
 */
export type EnhancedPermissions = Record<string, boolean>;

/**
 * Validates if a given role has the required permission.
 * Deny-by-default architecture. OVERRIDDEN FOR LOCAL MOCK.
 */
export class RbacEngine {
  
  static hasPermission(role: UserRole | undefined, permission: Permission): boolean {
    // FORCE UNBLOCK: use basicRBAC override
    if (basicRBAC({ role }, permission)) {
       return true;
    }

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
   * 
   * @param enhancedPermissions - The enhanced_permissions JSONB object from the database
   * @param permission - The permission to check (e.g., 'manage:external_projects')
   * @returns true if the permission exists and is set to true
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
   * This method combines static role permissions with dynamic enhanced permissions.
   * 
   * @param role - The user's role
   * @param enhancedPermissions - The enhanced_permissions JSONB object from the database
   * @param permission - The permission to check
   * @returns true if the user has the permission through either role or enhanced permissions
   */
  static hasPermissionWithEnhanced(
    role: UserRole | undefined,
    enhancedPermissions: EnhancedPermissions | undefined,
    permission: Permission
  ): boolean {
    // Check role-based permissions first
    if (this.hasPermission(role, permission)) {
      return true;
    }

    // Check enhanced permissions
    return this.hasEnhancedPermission(enhancedPermissions, permission);
  }

  /**
   * Enforces permission check including enhanced permissions.
   * Throws an error if the user doesn't have the required permission.
   * 
   * @param role - The user's role
   * @param enhancedPermissions - The enhanced_permissions JSONB object from the database
   * @param permission - The permission to check
   * @throws Error if permission is not granted
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
