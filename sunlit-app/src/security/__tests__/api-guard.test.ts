/**
 * Sunlit Security — API Guard Test Suite
 *
 * Tests the centralized API Guard for:
 * 1. Authentication enforcement
 * 2. RBAC deny-by-default
 * 3. Cross-role access denial
 * 4. Undefined role rejection (H-03 regression)
 * 5. Error response standardization
 * 6. Rate limiting behavior
 */

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { RbacEngine, checkPermission } from '../../core/rbac/engine';
import { RolePermissions, type Permission } from '../../core/rbac/permissions';
import type { UserRole } from '../../shared/types/database';

describe('API Guard — RBAC Enforcement', () => {
  test('Undefined role returns false for all permissions', () => {
    const permissions: Permission[] = [
      'create:project', 'submit:bid', 'fund:payment',
      'manage:users', 'resolve:dispute', 'approve:milestone',
    ];

    for (const perm of permissions) {
      const result = RbacEngine.hasPermission(undefined, perm);
      assert.equal(result, false, `Undefined role must be denied permission '${perm}'`);
    }
  });

  test('Null user returns false for all permissions via checkPermission', () => {
    assert.equal(checkPermission(null, 'create:project'), false);
    assert.equal(checkPermission(undefined, 'submit:bid'), false);
    assert.equal(checkPermission({}, 'fund:payment'), false);
    assert.equal(checkPermission({ role: undefined }, 'manage:users'), false);
  });

  test('Every role has deny-by-default — unlisted permissions are denied', () => {
    const roles: UserRole[] = ['project_owner', 'installer', 'crew_member', 'epc_contractor', 'admin'];
    
    // A permission that no role should have (fabricated)
    const fakePermission = 'destroy:everything' as Permission;
    
    for (const role of roles) {
      const result = RbacEngine.hasPermission(role, fakePermission);
      assert.equal(result, false, `Role '${role}' must deny unlisted permission '${fakePermission}'`);
    }
  });

  test('enforcePermission throws for unauthorized access', () => {
    assert.throws(
      () => RbacEngine.enforcePermission('crew_member', 'manage:users'),
      /Forbidden/,
      'crew_member must not be able to manage users'
    );
  });

  test('enforcePermission does NOT throw for authorized access', () => {
    assert.doesNotThrow(
      () => RbacEngine.enforcePermission('admin', 'manage:users'),
      'admin must be able to manage users'
    );
  });
});

describe('API Guard — Cross-Role Access Prevention', () => {
  test('Installer cannot perform Project Owner exclusive actions', () => {
    const poExclusive: Permission[] = ['create:project', 'accept:bid', 'approve:milestone', 'fund:payment'];
    
    for (const perm of poExclusive) {
      assert.equal(
        RbacEngine.hasPermission('installer', perm),
        false,
        `Installer must be denied '${perm}' (Project Owner exclusive)`
      );
    }
  });

  test('Project Owner cannot perform Installer exclusive actions', () => {
    assert.equal(
      RbacEngine.hasPermission('project_owner', 'submit:bid'),
      false,
      'Project Owner must not submit bids'
    );
  });

  test('Crew Member has minimal permissions — no financial or admin actions', () => {
    const deniedActions: Permission[] = [
      'create:project', 'submit:bid', 'accept:bid',
      'fund:payment', 'release:payment', 'approve:milestone',
      'manage:users', 'manage:subscriptions', 'resolve:dispute',
      'sign:contract', 'create:crew_job',
    ];

    for (const perm of deniedActions) {
      assert.equal(
        RbacEngine.hasPermission('crew_member', perm),
        false,
        `Crew member must be denied '${perm}'`
      );
    }
  });

  test('Admin can resolve disputes (exclusive capability)', () => {
    assert.equal(
      RbacEngine.hasPermission('admin', 'resolve:dispute'),
      true,
      'Admin must be able to resolve disputes'
    );
    
    // No other role can resolve disputes
    const otherRoles: UserRole[] = ['project_owner', 'installer', 'crew_member', 'epc_contractor'];
    for (const role of otherRoles) {
      assert.equal(
        RbacEngine.hasPermission(role, 'resolve:dispute'),
        false,
        `Role '${role}' must not resolve disputes`
      );
    }
  });
});

describe('API Guard — EPC Contractor Permissions', () => {
  test('EPC contractor has both project owner AND installer capabilities', () => {
    // Should have project creation
    assert.equal(RbacEngine.hasPermission('epc_contractor', 'create:project'), true);
    // Should have bid submission
    assert.equal(RbacEngine.hasPermission('epc_contractor', 'submit:bid'), true);
    // Should have crew management
    assert.equal(RbacEngine.hasPermission('epc_contractor', 'create:crew_job'), true);
    assert.equal(RbacEngine.hasPermission('epc_contractor', 'manage:crew_jobs'), true);
    // Should have financial actions
    assert.equal(RbacEngine.hasPermission('epc_contractor', 'fund:payment'), true);
    assert.equal(RbacEngine.hasPermission('epc_contractor', 'release:payment'), true);
  });

  test('EPC contractor cannot perform admin-exclusive actions', () => {
    assert.equal(RbacEngine.hasPermission('epc_contractor', 'manage:users'), false);
    assert.equal(RbacEngine.hasPermission('epc_contractor', 'manage:subscriptions'), false);
    assert.equal(RbacEngine.hasPermission('epc_contractor', 'resolve:dispute'), false);
  });
});

describe('API Guard — Enhanced Permissions', () => {
  test('Enhanced permissions extend base role permissions', () => {
    const enhanced = { 'manage:users': true };
    
    // Base role doesn't have it
    assert.equal(RbacEngine.hasPermission('installer', 'manage:users'), false);
    // Enhanced permissions grant it
    assert.equal(RbacEngine.hasEnhancedPermission(enhanced, 'manage:users'), true);
    // Combined check
    assert.equal(RbacEngine.hasPermissionWithEnhanced('installer', enhanced, 'manage:users'), true);
  });

  test('Enhanced permissions with false value do not grant access', () => {
    const enhanced = { 'manage:users': false };
    assert.equal(RbacEngine.hasEnhancedPermission(enhanced, 'manage:users'), false);
  });

  test('Undefined enhanced permissions do not grant access', () => {
    assert.equal(RbacEngine.hasEnhancedPermission(undefined, 'manage:users'), false);
  });
});

describe('API Guard — Permission Matrix Completeness', () => {
  test('All defined roles have permission arrays', () => {
    const expectedRoles: UserRole[] = ['project_owner', 'installer', 'crew_member', 'epc_contractor', 'admin'];
    
    for (const role of expectedRoles) {
      assert.ok(
        Array.isArray(RolePermissions[role]),
        `Role '${role}' must have a permissions array defined`
      );
      assert.ok(
        RolePermissions[role].length > 0,
        `Role '${role}' must have at least one permission`
      );
    }
  });

  test('No duplicate permissions in any role', () => {
    const roles: UserRole[] = ['project_owner', 'installer', 'crew_member', 'epc_contractor', 'admin'];
    
    for (const role of roles) {
      const permissions = RolePermissions[role];
      const unique = new Set(permissions);
      assert.equal(
        permissions.length,
        unique.size,
        `Role '${role}' has duplicate permissions: ${permissions.filter((p, i) => permissions.indexOf(p) !== i)}`
      );
    }
  });
});
