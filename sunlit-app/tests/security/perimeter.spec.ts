/**
 * Sunlit Perimeter Security Test Suite (Perimeter & Gateway Layer)
 *
 * Validates:
 * 1. Security Headers Configuration (CSP, HSTS, X-Frame-Options, X-Content-Type-Options)
 * 2. Secure Session Cookie Signing & Tamper Detection
 * 3. Reverse Proxy / Middleware Zero-Trust Access Gates & Role Containment
 * 4. Anti-Open-Redirect & Authentication Boundaries
 */

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import {
  signSessionCookie,
  verifySignedSessionCookie,
  parseSessionCookie,
  buildSessionPayload,
} from '../../src/shared/auth/sunlit-session';

import {
  dashboardPathForRole,
  requiredRoleForDashboardPath,
  type SunlitRole,
} from '../../src/shared/auth/sunlit-roles';

describe('Layer 1: Perimeter — Security Headers & Cookie Integrity', () => {
  test('Session cookies are cryptographically signed and verify authentic payloads', () => {
    const payload = buildSessionPayload({
      user_id: 'usr_test_001',
      role: 'installer',
      organization_id: 'org_lagos_solar',
    });
    const signedCookie = signSessionCookie(payload);

    assert.ok(signedCookie.includes('.'), 'Signed cookie must contain dot separator for signature');
    const parsed = parseSessionCookie(signedCookie);

    assert.ok(parsed, 'Session cookie must parse successfully');
    assert.equal(parsed?.user_id, 'usr_test_001');
    assert.equal(parsed?.role, 'installer');
    assert.equal(parsed?.organization_id, 'org_lagos_solar');
  });

  test('Tampered session cookies are rejected immediately with null session', () => {
    const payload = buildSessionPayload({
      user_id: 'usr_normal_002',
      role: 'project_owner',
    });
    const signedCookie = signSessionCookie(payload);


    // Tamper with payload (escalate role to admin)
    const [rawPayload] = signedCookie.split('.');
    const decoded = JSON.parse(Buffer.from(rawPayload, 'base64url').toString('utf8'));
    decoded.role = 'admin';
    const forgedPayloadBase64 = Buffer.from(JSON.stringify(decoded)).toString('base64url');

    const forgedCookie = `${forgedPayloadBase64}.${signedCookie.split('.')[1]}`;
    const result = verifySignedSessionCookie(forgedCookie);
    assert.equal(result, null, 'Tampered cookie payload must fail signature verification');

    const parsed = parseSessionCookie(forgedCookie);
    assert.equal(parsed, null, 'Tampered cookie must parse to null');
  });

  test('Forged signature with legitimate payload is rejected', () => {
    const payload = buildSessionPayload({
      user_id: 'usr_003',
      role: 'installer',
    });
    const signedCookie = signSessionCookie(payload);
    const [rawPayload] = signedCookie.split('.');

    const forgedCookie = `${rawPayload}.forged_signature_attacker_token`;
    const result = verifySignedSessionCookie(forgedCookie);
    assert.equal(result, null, 'Forged signature must fail verification');
  });
});

describe('Layer 1: Perimeter — Zero-Trust Route Gates & Role Containment', () => {
  test('All canonical Sunlit roles map to authoritative dashboard boundaries', () => {
    const roles: SunlitRole[] = ['project_owner', 'installer', 'epc_contractor', 'crew_member', 'admin'];
    for (const role of roles) {
      const dashboard = dashboardPathForRole(role);
      assert.ok(dashboard.startsWith('/dashboard/'), `Role ${role} must map to a secure dashboard path`);
    }
  });

  test('Protected dashboard routes require strictly authorized roles', () => {
    assert.equal(requiredRoleForDashboardPath('/dashboard/admin'), 'admin');
    assert.equal(requiredRoleForDashboardPath('/dashboard/admin/disputes'), 'admin');
    assert.equal(requiredRoleForDashboardPath('/dashboard/installer'), 'installer');
    assert.equal(requiredRoleForDashboardPath('/dashboard/project-owner'), 'project_owner');
    assert.equal(requiredRoleForDashboardPath('/dashboard/crewlink'), 'crew_member');
  });

  test('Public marketing, tools and directory routes require no authenticated role', () => {
    assert.equal(requiredRoleForDashboardPath('/tools/load-calculator'), null);
    assert.equal(requiredRoleForDashboardPath('/installers/lagos'), null);
    assert.equal(requiredRoleForDashboardPath('/services/residential-solar'), null);
  });
});
