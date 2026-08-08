/**
 * RBAC Engine Tests - EPC Contractor Permission Validation
 * 
 * Tests the permission system for EPC contractors to ensure they have
 * all installer permissions plus additional EPC-specific capabilities.
 */

import { RbacEngine } from '../engine';
import { RolePermissions } from '../permissions';
import type { UserRole } from '@/shared/types/database';

describe('RbacEngine - EPC Contractor Permissions', () => {
  describe('EPC Contractor Role Validation', () => {
    it('should have all installer permissions', () => {
      const installerPermissions = RolePermissions.installer;
      const epcPermissions = RolePermissions.epc_contractor;
      
      installerPermissions.forEach(permission => {
        expect(epcPermissions).toContain(permission);
        expect(RbacEngine.hasPermission('epc_contractor', permission)).toBe(true);
      });
    });

    it('should have EPC-specific permissions', () => {
      const epcSpecificPermissions = [
        'create:project',
        'approve:milestone', 
        'fund:payment',
        'view:audit_logs'
      ] as const;

      epcSpecificPermissions.forEach(permission => {
        expect(RbacEngine.hasPermission('epc_contractor', permission)).toBe(true);
      });
    });

    it('should have enhanced project management permissions', () => {
      const projectPermissions = [
        'create:project',
        'read:projects',
        'update:project'
      ] as const;

      projectPermissions.forEach(permission => {
        expect(RbacEngine.hasPermission('epc_contractor', permission)).toBe(true);
      });
    });

    it('should have enhanced payment permissions', () => {
      const paymentPermissions = [
        'fund:payment',
        'release:payment'
      ] as const;

      paymentPermissions.forEach(permission => {
        expect(RbacEngine.hasPermission('epc_contractor', permission)).toBe(true);
      });
    });

    it('should have milestone approval permissions', () => {
      expect(RbacEngine.hasPermission('epc_contractor', 'approve:milestone')).toBe(true);
    });

    it('should have audit log visibility', () => {
      expect(RbacEngine.hasPermission('epc_contractor', 'view:audit_logs')).toBe(true);
    });
  });

  describe('Permission Comparison with Other Roles', () => {
    it('should have more permissions than installer role', () => {
      const installerPermissions = RolePermissions.installer;
      const epcPermissions = RolePermissions.epc_contractor;
      
      expect(epcPermissions.length).toBeGreaterThan(installerPermissions.length);
    });

    it('should not have admin-only permissions', () => {
      const adminOnlyPermissions = [
        'manage:users',
        'manage:subscriptions',
        'resolve:dispute',
        'view:all_projects'
      ] as const;

      adminOnlyPermissions.forEach(permission => {
        expect(RbacEngine.hasPermission('epc_contractor', permission)).toBe(false);
      });
    });

    it('should have project owner-like permissions for project management', () => {
      const sharedPermissions = [
        'create:project',
        'approve:milestone',
        'fund:payment',
        'release:payment'
      ] as const;

      sharedPermissions.forEach(permission => {
        expect(RbacEngine.hasPermission('epc_contractor', permission)).toBe(true);
        expect(RbacEngine.hasPermission('project_owner', permission)).toBe(true);
      });
    });
  });

  describe('Permission Enforcement', () => {
    it('should enforce EPC-specific permissions without throwing', () => {
      const epcPermissions = [
        'create:project',
        'approve:milestone',
        'fund:payment',
        'view:audit_logs'
      ] as const;

      epcPermissions.forEach(permission => {
        expect(() => {
          RbacEngine.enforcePermission('epc_contractor', permission);
        }).not.toThrow();
      });
    });

    it('should throw when enforcing admin-only permissions', () => {
      const adminOnlyPermissions = [
        'manage:users',
        'manage:subscriptions',
        'resolve:dispute'
      ] as const;

      adminOnlyPermissions.forEach(permission => {
        expect(() => {
          RbacEngine.enforcePermission('epc_contractor', permission);
        }).toThrow(`Forbidden: Role epc_contractor does not have permission '${permission}'`);
      });
    });

    it('should throw for undefined role', () => {
      expect(() => {
        RbacEngine.enforcePermission(undefined, 'create:project');
      }).toThrow("Forbidden: Role undefined does not have permission 'create:project'");
    });
  });

  describe('CrewLink Permissions', () => {
    it('should have all CrewLink management permissions', () => {
      const crewLinkPermissions = [
        'create:crew_job',
        'update:crew_job',
        'review:crew_application',
        'assign:crew'
      ] as const;

      crewLinkPermissions.forEach(permission => {
        expect(RbacEngine.hasPermission('epc_contractor', permission)).toBe(true);
      });
    });

    it('should not be able to apply to crew jobs (like installers)', () => {
      expect(RbacEngine.hasPermission('epc_contractor', 'apply:crew_job')).toBe(false);
    });
  });

  describe('Marketplace Permissions', () => {
    it('should have full marketplace participation permissions', () => {
      const marketplacePermissions = [
        'read:rfq',
        'view:rfq',
        'submit:bid',
        'read:bids',
        'view:bids',
        'accept:bid',
        'view:marketplace'
      ] as const;

      marketplacePermissions.forEach(permission => {
        expect(RbacEngine.hasPermission('epc_contractor', permission)).toBe(true);
      });
    });

    it('should be able to create RFQs like project owners', () => {
      expect(RbacEngine.hasPermission('epc_contractor', 'create:rfq')).toBe(true);
    });
  });

  describe('Contract and Communication Permissions', () => {
    it('should have contract management permissions', () => {
      const contractPermissions = [
        'read:contract',
        'view:contracts',
        'sign:contract'
      ] as const;

      contractPermissions.forEach(permission => {
        expect(RbacEngine.hasPermission('epc_contractor', permission)).toBe(true);
      });
    });

    it('should have communication permissions', () => {
      const communicationPermissions = [
        'send:message',
        'read:messages'
      ] as const;

      communicationPermissions.forEach(permission => {
        expect(RbacEngine.hasPermission('epc_contractor', permission)).toBe(true);
      });
    });
  });

  describe('Edge Cases and Security', () => {
    it('should handle invalid role gracefully', () => {
      expect(RbacEngine.hasPermission('invalid_role' as UserRole, 'create:project')).toBe(false);
    });

    it('should handle null role gracefully', () => {
      expect(RbacEngine.hasPermission(null as any, 'create:project')).toBe(false);
    });

    it('should deny permissions not in the system', () => {
      expect(RbacEngine.hasPermission('epc_contractor', 'invalid:permission' as any)).toBe(false);
    });

    it('should maintain deny-by-default security model', () => {
      // Test that EPC doesn't accidentally get permissions they shouldn't have
      const restrictedPermissions = [
        'manage:users',
        'manage:subscriptions', 
        'resolve:dispute',
        'view:all_projects'
      ] as const;

      restrictedPermissions.forEach(permission => {
        expect(RbacEngine.hasPermission('epc_contractor', permission)).toBe(false);
      });
    });
  });

  describe('Enhanced Permissions from Database', () => {
    it('should validate enhanced permissions from JSONB', () => {
      const enhancedPermissions = {
        'manage:external_projects': true,
        'coordinate:multi_crew': true
      };

      expect(RbacEngine.hasEnhancedPermission(enhancedPermissions, 'manage:external_projects')).toBe(true);
      expect(RbacEngine.hasEnhancedPermission(enhancedPermissions, 'coordinate:multi_crew')).toBe(true);
    });

    it('should return false for permissions not in enhanced permissions', () => {
      const enhancedPermissions = {
        'manage:external_projects': true
      };

      expect(RbacEngine.hasEnhancedPermission(enhancedPermissions, 'coordinate:multi_crew')).toBe(false);
    });

    it('should return false for permissions set to false', () => {
      const enhancedPermissions = {
        'manage:external_projects': false
      };

      expect(RbacEngine.hasEnhancedPermission(enhancedPermissions, 'manage:external_projects')).toBe(false);
    });

    it('should handle undefined enhanced permissions', () => {
      expect(RbacEngine.hasEnhancedPermission(undefined, 'manage:external_projects')).toBe(false);
    });

    it('should handle empty enhanced permissions object', () => {
      expect(RbacEngine.hasEnhancedPermission({}, 'manage:external_projects')).toBe(false);
    });
  });

  describe('Combined Role and Enhanced Permissions', () => {
    it('should grant permission if role has it', () => {
      const enhancedPermissions = {};
      
      expect(RbacEngine.hasPermissionWithEnhanced('epc_contractor', enhancedPermissions, 'create:project')).toBe(true);
    });

    it('should grant permission if enhanced permissions have it', () => {
      const enhancedPermissions = {
        'manage:external_projects': true
      };
      
      expect(RbacEngine.hasPermissionWithEnhanced('installer', enhancedPermissions, 'manage:external_projects')).toBe(true);
    });

    it('should grant permission if both have it', () => {
      const enhancedPermissions = {
        'create:project': true
      };
      
      expect(RbacEngine.hasPermissionWithEnhanced('epc_contractor', enhancedPermissions, 'create:project')).toBe(true);
    });

    it('should deny permission if neither have it', () => {
      const enhancedPermissions = {
        'manage:external_projects': true
      };
      
      expect(RbacEngine.hasPermissionWithEnhanced('crew_member', enhancedPermissions, 'create:project')).toBe(false);
    });

    it('should handle undefined enhanced permissions', () => {
      expect(RbacEngine.hasPermissionWithEnhanced('epc_contractor', undefined, 'create:project')).toBe(true);
    });
  });

  describe('Enhanced Permission Enforcement', () => {
    it('should not throw when permission is granted via role', () => {
      const enhancedPermissions = {};
      
      expect(() => {
        RbacEngine.enforcePermissionWithEnhanced('epc_contractor', enhancedPermissions, 'create:project');
      }).not.toThrow();
    });

    it('should not throw when permission is granted via enhanced permissions', () => {
      const enhancedPermissions = {
        'manage:external_projects': true
      };
      
      expect(() => {
        RbacEngine.enforcePermissionWithEnhanced('installer', enhancedPermissions, 'manage:external_projects');
      }).not.toThrow();
    });

    it('should throw when permission is not granted', () => {
      const enhancedPermissions = {
        'manage:external_projects': true
      };
      
      expect(() => {
        RbacEngine.enforcePermissionWithEnhanced('crew_member', enhancedPermissions, 'create:project');
      }).toThrow(/Forbidden: Role crew_member does not have permission 'create:project'/);
    });

    it('should include enhanced permissions in error message', () => {
      const enhancedPermissions = {};
      
      expect(() => {
        RbacEngine.enforcePermissionWithEnhanced('crew_member', enhancedPermissions, 'manage:external_projects');
      }).toThrow(/checked both role and enhanced permissions/);
    });
  });

  describe('EPC-Specific Enhanced Permissions', () => {
    it('should validate manage:external_projects permission', () => {
      expect(RbacEngine.hasPermission('epc_contractor', 'manage:external_projects')).toBe(true);
    });

    it('should validate coordinate:multi_crew permission', () => {
      expect(RbacEngine.hasPermission('epc_contractor', 'coordinate:multi_crew')).toBe(true);
    });

    it('should deny EPC-specific permissions to other roles', () => {
      const roles: UserRole[] = ['project_owner', 'installer', 'crew_member', 'admin'];
      const epcPermissions = ['manage:external_projects', 'coordinate:multi_crew'] as const;

      roles.forEach(role => {
        epcPermissions.forEach(permission => {
          expect(RbacEngine.hasPermission(role, permission)).toBe(false);
        });
      });
    });
  });
});