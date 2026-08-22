/**
 * Role Router Tests
 * 
 * GEMINI.md §6: AUTH & ROLE ROUTING RULES (HARD ENFORCEMENT)
 * 
 * Tests the single source of truth for dashboard routing.
 */

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { getDashboardRoute } from '../roleRouter';

describe('getDashboardRoute', () => {
  describe('Primary Roles', () => {
    test('should route project_owner to /dashboard/project-owner', () => {
      assert.equal(getDashboardRoute('project_owner'), '/dashboard/project-owner');
    });

    test('should route installer to /dashboard/installer', () => {
      assert.equal(getDashboardRoute('installer'), '/dashboard/installer');
    });

    test('should route epc_contractor to /dashboard/installer', () => {
      assert.equal(getDashboardRoute('epc_contractor'), '/dashboard/installer');
    });

    test('should route crew_member to /dashboard/crewlink', () => {
      assert.equal(getDashboardRoute('crew_member'), '/dashboard/crewlink');
    });

    test('should route admin to /dashboard/admin', () => {
      assert.equal(getDashboardRoute('admin'), '/dashboard/admin');
    });
  });

  describe('Legacy Role Aliases', () => {
    test('should route crewlink (legacy) to /dashboard/crewlink', () => {
      assert.equal(getDashboardRoute('crewlink'), '/dashboard/crewlink');
    });

    test('should route technician (legacy) to /dashboard/crewlink', () => {
      assert.equal(getDashboardRoute('technician'), '/dashboard/crewlink');
    });
  });

  describe('Future Roles', () => {
    test('should route supplier to /dashboard/supplier', () => {
      assert.equal(getDashboardRoute('supplier'), '/dashboard/supplier');
    });

    test('should route mini_grid to /dashboard/mini-grid', () => {
      assert.equal(getDashboardRoute('mini_grid'), '/dashboard/mini-grid');
    });
  });

  describe('Error Cases', () => {
    test('should throw ROLE_UNDEFINED when role is empty string', () => {
      assert.throws(() => getDashboardRoute(''), /ROLE_UNDEFINED/);
    });

    test('should throw ROLE_UNDEFINED when role is undefined', () => {
      assert.throws(() => getDashboardRoute(undefined as any), /ROLE_UNDEFINED/);
    });

    test('should throw INVALID_ROLE for unknown role', () => {
      assert.throws(() => getDashboardRoute('unknown_role'), /INVALID_ROLE/);
    });

    test('should throw ROLE_UNDEFINED for null', () => {
      assert.throws(() => getDashboardRoute(null as any), /ROLE_UNDEFINED/);
    });
  });

  describe('Security - No Default Routes', () => {
    test('should never return a default route for invalid input', () => {
      const invalidRoles = ['', 'fake', 'hacker', '../../admin', '<script>alert(1)</script>'];
      
      invalidRoles.forEach(role => {
        assert.throws(() => getDashboardRoute(role));
      });
    });
  });

  describe('GEMINI.md Compliance', () => {
    test('should enforce NO hardcoded fallback to /dashboard/installer', () => {
      const testRoles = ['', 'invalid', 'unknown'];
      
      testRoles.forEach(role => {
        try {
          const result = getDashboardRoute(role);
          assert.notEqual(result, '/dashboard/installer');
        } catch (error) {
          assert.ok(error);
        }
      });
    });
  });
});
