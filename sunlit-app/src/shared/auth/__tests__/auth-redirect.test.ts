/**
 * Authentication & Redirect Security Tests
 * Sunlit Energy Platform
 *
 * Tests covering:
 * 1. postLoginRoute redirection logic for all 5 stakeholder roles
 * 2. Redirect parameter validation with role matching (/dashboard/installer vs other roles)
 * 3. Open redirect security (malicious external URLs, protocol-relative //, javascript:, etc.)
 * 4. parseSessionCookie parsing and expiration checking
 * 5. Role authority and dashboard routing consistency
 */

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { postLoginRoute } from '../client-session.ts';
import { parseSessionCookie, type SunlitSessionPayload } from '../sunlit-session.ts';
import { getDashboardRoute } from '../../../core/auth/roleRouter.ts';
import { dashboardPathForRole, requiredRoleForDashboardPath, type SunlitRole } from '../sunlit-roles.ts';

const MOCK_INSTALLER_SESSION: SunlitSessionPayload = {
  user_id: 'mock-installer-001',
  name: 'Installer User',
  email: 'installer@test.com',
  role: 'installer',
  token: 'mock-jwt-installer',
  expires_at: Date.now() + 86400000,
  onboarding_state: 'completed',
};

const MOCK_OWNER_SESSION: SunlitSessionPayload = {
  user_id: 'mock-owner-001',
  name: 'Owner User',
  email: 'owner@test.com',
  role: 'project_owner',
  token: 'mock-jwt-owner',
  expires_at: Date.now() + 86400000,
  onboarding_state: 'completed',
};

const MOCK_EPC_SESSION: SunlitSessionPayload = {
  user_id: 'mock-epc-001',
  name: 'EPC User',
  email: 'epc@test.com',
  role: 'epc_contractor',
  token: 'mock-jwt-epc',
  expires_at: Date.now() + 86400000,
  onboarding_state: 'completed',
};

const MOCK_ADMIN_SESSION: SunlitSessionPayload = {
  user_id: 'mock-admin-001',
  name: 'Admin User',
  email: 'admin@test.com',
  role: 'admin',
  token: 'mock-jwt-admin',
  expires_at: Date.now() + 86400000,
  onboarding_state: 'completed',
};

describe('Authentication & Redirect Route Authority', () => {
  test('Installer redirect param /dashboard/installer resolves to /dashboard/installer', () => {
    const route = postLoginRoute(MOCK_INSTALLER_SESSION, '/dashboard/installer');
    assert.equal(route, '/dashboard/installer');
  });

  test('Installer redirect param encoded %2Fdashboard%2Finstaller resolves to /dashboard/installer', () => {
    const route = postLoginRoute(MOCK_INSTALLER_SESSION, '%2Fdashboard%2Finstaller');
    assert.equal(route, '/dashboard/installer');
  });

  test('Installer without redirect param resolves to default role dashboard /dashboard/installer', () => {
    const route = postLoginRoute(MOCK_INSTALLER_SESSION, null);
    assert.equal(route, '/dashboard/installer');
  });

  test('Project Owner redirect resolves to /dashboard/project-owner', () => {
    const route = postLoginRoute(MOCK_OWNER_SESSION, '/dashboard/project-owner');
    assert.equal(route, '/dashboard/project-owner');
  });

  test('EPC Contractor redirect resolves to /dashboard/installer', () => {
    const route = postLoginRoute(MOCK_EPC_SESSION, '/dashboard/installer');
    assert.equal(route, '/dashboard/installer');
  });

  test('Admin redirect resolves to /dashboard/admin', () => {
    const route = postLoginRoute(MOCK_ADMIN_SESSION, '/dashboard/admin');
    assert.equal(route, '/dashboard/admin');
  });

  test('Cross-role redirect blocked: Installer attempting /dashboard/admin is redirected to /dashboard/installer', () => {
    const route = postLoginRoute(MOCK_INSTALLER_SESSION, '/dashboard/admin');
    assert.equal(route, '/dashboard/installer');
  });

  test('Cross-role redirect blocked: Project Owner attempting /dashboard/installer is redirected to /dashboard/project-owner', () => {
    const route = postLoginRoute(MOCK_OWNER_SESSION, '/dashboard/installer');
    assert.equal(route, '/dashboard/project-owner');
  });
});

describe('Open Redirect Vulnerability Protection', () => {
  test('Rejects external URL https://malicious.com and defaults to role dashboard', () => {
    const route = postLoginRoute(MOCK_INSTALLER_SESSION, 'https://malicious.com');
    assert.equal(route, '/dashboard/installer');
  });

  test('Rejects protocol-relative //malicious.com and defaults to role dashboard', () => {
    const route = postLoginRoute(MOCK_INSTALLER_SESSION, '//malicious.com');
    assert.equal(route, '/dashboard/installer');
  });

  test('Rejects javascript: URI and defaults to role dashboard', () => {
    const route = postLoginRoute(MOCK_INSTALLER_SESSION, 'javascript:alert(1)');
    assert.equal(route, '/dashboard/installer');
  });

  test('Rejects backslash paths \\\\malicious.com and defaults to role dashboard', () => {
    const route = postLoginRoute(MOCK_INSTALLER_SESSION, '\\\\malicious.com');
    assert.equal(route, '/dashboard/installer');
  });

  test('Rejects invalid URI encoding gracefully without crashing', () => {
    const route = postLoginRoute(MOCK_INSTALLER_SESSION, '%E0%A4%A');
    assert.equal(route, '/dashboard/installer');
  });
});

describe('Session Cookie Parsing & Validation', () => {
  test('Parses valid encoded session cookie correctly', () => {
    const raw = encodeURIComponent(JSON.stringify(MOCK_INSTALLER_SESSION));
    const session = parseSessionCookie(raw);
    assert.ok(session);
    assert.equal(session?.role, 'installer');
    assert.equal(session?.user_id, 'mock-installer-001');
  });

  test('Rejects expired session cookie', () => {
    const expiredSession: SunlitSessionPayload = {
      ...MOCK_INSTALLER_SESSION,
      expires_at: Date.now() - 1000,
    };
    const raw = encodeURIComponent(JSON.stringify(expiredSession));
    const session = parseSessionCookie(raw);
    assert.equal(session, null);
  });

  test('Rejects invalid JSON cookie string', () => {
    const session = parseSessionCookie('invalid-not-json');
    assert.equal(session, null);
  });

  test('Rejects empty or undefined cookie', () => {
    assert.equal(parseSessionCookie(undefined), null);
    assert.equal(parseSessionCookie(''), null);
  });
});

describe('RBAC & Role Routing Authority', () => {
  test('getDashboardRoute returns correct paths for all roles', () => {
    assert.equal(getDashboardRoute('installer'), '/dashboard/installer');
    assert.equal(getDashboardRoute('project_owner'), '/dashboard/project-owner');
    assert.equal(getDashboardRoute('epc_contractor'), '/dashboard/installer');
    assert.equal(getDashboardRoute('crew_member'), '/dashboard/crewlink');
    assert.equal(getDashboardRoute('admin'), '/dashboard/admin');
  });

  test('requiredRoleForDashboardPath identifies required role', () => {
    assert.equal(requiredRoleForDashboardPath('/dashboard/installer'), 'installer');
    assert.equal(requiredRoleForDashboardPath('/dashboard/project-owner'), 'project_owner');
    assert.equal(requiredRoleForDashboardPath('/dashboard/crewlink'), 'crew_member');
    assert.equal(requiredRoleForDashboardPath('/dashboard/admin'), 'admin');
  });
});
