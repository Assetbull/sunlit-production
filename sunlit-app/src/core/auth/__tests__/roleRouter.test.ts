/**
 * Role Router Tests
 * 
 * GEMINI.md §6: AUTH & ROLE ROUTING RULES (HARD ENFORCEMENT)
 * 
 * Tests the single source of truth for dashboard routing.
 */

import { getDashboardRoute } from '../roleRouter';

describe('getDashboardRoute', () => {
  describe('Primary Roles', () => {
    it('should route project_owner to /dashboard/project-owner', () => {
      expect(getDashboardRoute('project_owner')).toBe('/dashboard/project-owner');
    });

    it('should route installer to /dashboard/installer', () => {
      expect(getDashboardRoute('installer')).toBe('/dashboard/installer');
    });

    it('should route epc_contractor to /dashboard/installer', () => {
      expect(getDashboardRoute('epc_contractor')).toBe('/dashboard/installer');
    });

    it('should route crew_member to /dashboard/crewlink', () => {
      expect(getDashboardRoute('crew_member')).toBe('/dashboard/crewlink');
    });

    it('should route admin to /dashboard/admin', () => {
      expect(getDashboardRoute('admin')).toBe('/dashboard/admin');
    });
  });

  describe('Legacy Role Aliases', () => {
    it('should route crewlink (legacy) to /dashboard/crewlink', () => {
      expect(getDashboardRoute('crewlink')).toBe('/dashboard/crewlink');
    });

    it('should route technician (legacy) to /dashboard/crewlink', () => {
      expect(getDashboardRoute('technician')).toBe('/dashboard/crewlink');
    });
  });

  describe('Future Roles', () => {
    it('should route supplier to /dashboard/supplier', () => {
      expect(getDashboardRoute('supplier')).toBe('/dashboard/supplier');
    });

    it('should route mini_grid to /dashboard/mini-grid', () => {
      expect(getDashboardRoute('mini_grid')).toBe('/dashboard/mini-grid');
    });
  });

  describe('Error Cases', () => {
    it('should throw ROLE_UNDEFINED when role is empty string', () => {
      expect(() => getDashboardRoute('')).toThrow('ROLE_UNDEFINED');
    });

    it('should throw ROLE_UNDEFINED when role is undefined', () => {
      expect(() => getDashboardRoute(undefined as any)).toThrow('ROLE_UNDEFINED');
    });

    it('should throw INVALID_ROLE for unknown role', () => {
      expect(() => getDashboardRoute('unknown_role')).toThrow('INVALID_ROLE');
    });

    it('should throw INVALID_ROLE for null', () => {
      expect(() => getDashboardRoute(null as any)).toThrow('ROLE_UNDEFINED');
    });
  });

  describe('Security - No Default Routes', () => {
    it('should never return a default route for invalid input', () => {
      const invalidRoles = ['', 'fake', 'hacker', '../../admin', '<script>alert(1)</script>'];
      
      invalidRoles.forEach(role => {
        expect(() => getDashboardRoute(role)).toThrow();
      });
    });
  });

  describe('GEMINI.md Compliance', () => {
    it('should enforce NO hardcoded fallback to /dashboard/installer', () => {
      // This test ensures we never default to installer dashboard
      const testRoles = ['', 'invalid', 'unknown'];
      
      testRoles.forEach(role => {
        try {
          const result = getDashboardRoute(role);
          // If it doesn't throw, it should NEVER be /dashboard/installer
          expect(result).not.toBe('/dashboard/installer');
        } catch (error) {
          // Expected to throw - this is correct behavior
          expect(error).toBeDefined();
        }
      });
    });

    it('should log errors for undefined roles', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      try {
        getDashboardRoute('');
      } catch (e) {
        // Expected
      }
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[AUTH] ROLE_UNDEFINED')
      );
      
      consoleSpy.mockRestore();
    });

    it('should log errors for invalid roles', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      try {
        getDashboardRoute('invalid_role');
      } catch (e) {
        // Expected
      }
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[AUTH] INVALID_ROLE')
      );
      
      consoleSpy.mockRestore();
    });
  });
});
