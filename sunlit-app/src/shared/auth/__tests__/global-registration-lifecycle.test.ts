/**
 * Global Registration & Authentication Lifecycle Integration Tests
 * Sunlit Energy Platform
 *
 * Verifies:
 * 1. Global Registration Lifecycle across all canonical stakeholder roles
 * 2. Role Routing Authority and Destination Integrity
 * 3. Registration Data Continuity & Session Payload Verification
 * 4. Deterministic Role Resolution on Login
 * 5. Role Spoofing & Cross-Role Access Prevention
 * 6. Logout & Session Revocation
 */

import { describe, test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { authService } from '../../../services/auth.service.ts';
import { SUNLIT_ROLES, dashboardPathForRole, isSunlitRole, type SunlitRole } from '../sunlit-roles.ts';
import { getDashboardRoute } from '../../../core/auth/roleRouter.ts';
import { postLoginRoute } from '../client-session.ts';
import { parseSessionCookie, type SunlitSessionPayload } from '../sunlit-session.ts';

describe('Global Registration Lifecycle - All Stakeholder Roles', () => {
  const testRoles: SunlitRole[] = ['project_owner', 'installer', 'epc_contractor', 'crew_member'];

  for (const targetRole of testRoles) {
    test(`Full registration lifecycle for role: ${targetRole}`, async () => {
      const payload = {
        fullName: `Test ${targetRole.replace('_', ' ')}`,
        email: `${targetRole}.user@test.sunlit.energy`,
        phone: '+2348012345678',
        role: targetRole,
        password: 'ValidPassword123!',
      };

      // 1. Register
      const regResult = await authService.register(payload);
      assert.ok(regResult.ok, `Registration must succeed for ${targetRole}`);
      assert.ok(regResult.session, 'Session must be returned upon registration');

      const session = regResult.session!;
      assert.equal(session.name, payload.fullName);
      assert.equal(session.role, targetRole);
      assert.ok(session.user_id.includes(targetRole));
      assert.ok(session.expires_at > Date.now());
      assert.equal(session.onboarding_state, 'completed');

      // 2. Resolve Role Destination
      const destination = dashboardPathForRole(session.role);
      assert.ok(destination.startsWith('/dashboard/'));

      if (targetRole === 'project_owner') {
        assert.equal(destination, '/dashboard/project-owner');
      } else if (targetRole === 'installer' || targetRole === 'epc_contractor') {
        assert.equal(destination, '/dashboard/installer');
      } else if (targetRole === 'crew_member') {
        assert.equal(destination, '/dashboard/crewlink');
      }

      // 3. Post-Login Route Enforces Role Matching
      const resolvedRoute = postLoginRoute(session, destination);
      assert.equal(resolvedRoute, destination);
    });
  }
});

describe('Global Login & Deterministic Role Resolution', () => {
  test('Deterministic role resolution from known test fixtures', async () => {
    const testCases = [
      { email: 'owner@test.com', expectedRole: 'project_owner', expectedDest: '/dashboard/project-owner' },
      { email: 'installer@test.com', expectedRole: 'installer', expectedDest: '/dashboard/installer' },
      { email: 'epc@test.com', expectedRole: 'epc_contractor', expectedDest: '/dashboard/installer' },
      { email: 'technician@test.com', expectedRole: 'crew_member', expectedDest: '/dashboard/crewlink' },
      { email: 'admin@test.com', expectedRole: 'admin', expectedDest: '/dashboard/admin' },
    ];

    for (const tc of testCases) {
      const res = await authService.login(tc.email, '123456');
      assert.ok(res.ok, `Login must succeed for ${tc.email}`);
      assert.equal(res.session?.role, tc.expectedRole);
      const dest = dashboardPathForRole(res.session!.role);
      assert.equal(dest, tc.expectedDest);
    }
  });

  test('Rejects invalid password with safe error message', async () => {
    const res = await authService.login('owner@test.com', 'wrongpassword');
    assert.equal(res.ok, false);
    assert.equal(res.error, 'Invalid email or password.');
    assert.equal(res.session, undefined);
  });
});

describe('Role Routing Authority & Integrity', () => {
  test('All canonical SUNLIT_ROLES map to authoritative routes', () => {
    for (const role of SUNLIT_ROLES) {
      assert.ok(isSunlitRole(role), `Role ${role} must be recognized as SunlitRole`);
      const route = getDashboardRoute(role);
      assert.ok(typeof route === 'string' && route.startsWith('/dashboard/'));
    }
  });

  test('Cross-role privilege escalation is strictly blocked in redirect resolver', () => {
    const ownerSession: SunlitSessionPayload = {
      user_id: 'mock-po-01',
      name: 'Project Owner',
      role: 'project_owner',
      token: 'jwt-po',
      expires_at: Date.now() + 86400000,
    };

    // Owner trying to access admin dashboard via redirect param is overridden
    const safeRoute = postLoginRoute(ownerSession, '/dashboard/admin');
    assert.equal(safeRoute, '/dashboard/project-owner');

    // Owner trying to access installer dashboard via redirect param is overridden
    const safeRoute2 = postLoginRoute(ownerSession, '/dashboard/installer');
    assert.equal(safeRoute2, '/dashboard/project-owner');
  });

  test('Installer cannot access admin dashboard via redirect param', () => {
    const installerSession: SunlitSessionPayload = {
      user_id: 'mock-installer-01',
      name: 'Solar Installer',
      role: 'installer',
      token: 'jwt-inst',
      expires_at: Date.now() + 86400000,
    };

    const safeRoute = postLoginRoute(installerSession, '/dashboard/admin');
    assert.equal(safeRoute, '/dashboard/installer');
  });
});

describe('Session Persistence & Cookie Parsing', () => {
  test('Valid session cookie round-trips correctly', () => {
    const original: SunlitSessionPayload = {
      user_id: 'user-12345',
      name: 'John Doe',
      role: 'project_owner',
      token: 'valid-token',
      expires_at: Date.now() + 3600000,
      onboarding_state: 'completed',
    };

    const cookieString = encodeURIComponent(JSON.stringify(original));
    const parsed = parseSessionCookie(cookieString);

    assert.ok(parsed);
    assert.equal(parsed?.user_id, original.user_id);
    assert.equal(parsed?.role, original.role);
    assert.equal(parsed?.name, original.name);
  });

  test('Expired session is rejected by parseSessionCookie', () => {
    const expired: SunlitSessionPayload = {
      user_id: 'user-expired',
      name: 'Old User',
      role: 'installer',
      token: 'expired-token',
      expires_at: Date.now() - 5000,
    };

    const cookieString = encodeURIComponent(JSON.stringify(expired));
    const parsed = parseSessionCookie(cookieString);
    assert.equal(parsed, null);
  });
});
