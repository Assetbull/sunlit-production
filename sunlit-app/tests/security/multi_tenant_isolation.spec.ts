/**
 * Multi-Tenant IAM & Tenant Isolation Test Suite (Layer 2)
 *
 * Validates:
 * 1. Cross-Organization Boundary Enforcement (Anti-BOLA / Anti-IDOR)
 * 2. Cross-Tenant Resource Access Denial
 * 3. Prevention of Vertical & Horizontal Privilege Escalation
 * 4. Machine-to-Machine Service Identity Allowed Operations Manifests
 */

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import {
  validateResourceAccess,
  GuardContext,
} from '../../src/shared/api/api-guard';

import { RbacEngine } from '../../src/core/rbac/engine';

import {
  getRegisteredServiceIdentity,
  isServiceOperationAllowed,
  enforceServiceOperation,
} from '../../src/core/identity/service-identity';

describe('Layer 2: Multi-Tenant IAM — Cross-Organization Boundary Enforcement', () => {
  const userAContext: GuardContext = {
    userId: 'usr_installer_001',
    userRole: 'installer',
    organizationId: 'org_solar_power_inc',
    workspaceId: 'ws_abuja_hq',
    correlationId: 'corr_test_user_a',
  };

  const userBContext: GuardContext = {
    userId: 'usr_installer_002',
    userRole: 'installer',
    organizationId: 'org_apex_renewables',
    workspaceId: 'ws_kano_site',
    correlationId: 'corr_test_user_b',
  };

  const adminContext: GuardContext = {
    userId: 'usr_admin_999',
    userRole: 'admin',
    organizationId: 'org_sunlit_internal',
    correlationId: 'corr_admin_audit',
  };

  test('Organization A user cannot access Organization B project or contract', () => {
    const orgBProject = {
      id: 'proj_apex_001',
      organization_id: 'org_apex_renewables',
      title: 'Apex 50kW Commercial Installation',
    };

    const hasAccess = validateResourceAccess(userAContext, orgBProject);
    assert.equal(hasAccess, false, 'User from Org A must be denied access to Org B resource');
  });

  test('Organization A user can access Organization A resource', () => {
    const orgAProject = {
      id: 'proj_solar_power_001',
      organization_id: 'org_solar_power_inc',
      title: 'Solar Power Inc 10kW Residential',
    };

    const hasAccess = validateResourceAccess(userAContext, orgAProject);
    assert.equal(hasAccess, true, 'User from Org A must have access to Org A resource');
  });

  test('Admin user has cross-tenant audit and oversight visibility', () => {
    const anyOrgResource = {
      id: 'res_arbitrary_123',
      organization_id: 'org_customer_private',
    };

    const hasAccess = validateResourceAccess(adminContext, anyOrgResource);
    assert.equal(hasAccess, true, 'Admin must possess system-wide audit visibility');
  });

  test('Attacker cannot access victim bid or milestone by direct UUID injection (Anti-IDOR)', () => {
    const victimBid = {
      id: 'bid_victim_confidential_999',
      organization_id: 'org_victim_corp',
      installer_id: 'usr_victim_contractor',
      bid_amount: 15000000,
    };

    const attackerContext: GuardContext = {
      userId: 'usr_attacker_666',
      userRole: 'installer',
      organizationId: 'org_attacker_enterprise',
      correlationId: 'corr_attack_attempt',
    };

    assert.equal(validateResourceAccess(attackerContext, victimBid), false);
  });
});

describe('Layer 2: Multi-Tenant IAM — RBAC & Privilege Escalation Defenses', () => {
  test('Installer role is blocked from Project Owner exclusive actions', () => {
    assert.equal(RbacEngine.hasPermission('installer', 'create:project'), false);
    assert.equal(RbacEngine.hasPermission('installer', 'fund:payment'), false);
    assert.equal(RbacEngine.hasPermission('installer', 'release:payment'), false);
  });

  test('Project Owner role is blocked from Installer exclusive actions', () => {
    assert.equal(RbacEngine.hasPermission('project_owner', 'submit:bid'), false);
    assert.equal(RbacEngine.hasPermission('project_owner', 'manage:crew'), false);
  });

  test('Non-admin roles are strictly blocked from dispute resolution & financial overrides', () => {
    assert.equal(RbacEngine.hasPermission('installer', 'resolve:dispute'), false);
    assert.equal(RbacEngine.hasPermission('project_owner', 'resolve:dispute'), false);
    assert.equal(RbacEngine.hasPermission('epc_contractor', 'resolve:dispute'), false);

    assert.throws(
      () => RbacEngine.enforcePermission('installer', 'resolve:dispute'),
      /Forbidden: Role installer does not have permission/
    );
  });
});


describe('Layer 2: Service Identity — Allowed Operations Manifests', () => {
  test('Payment webhook service is allowed only for registered operations', () => {
    const serviceId = 'system:payment_webhook';
    assert.equal(isServiceOperationAllowed(serviceId, 'payments:update_status'), true);
    assert.equal(isServiceOperationAllowed(serviceId, 'escrow:fund'), true);
    assert.equal(isServiceOperationAllowed(serviceId, 'audit:log'), true);

    // Block unmanifested operations (e.g. creating projects or altering roles)
    assert.equal(isServiceOperationAllowed(serviceId, 'user:change_role'), false);
    assert.equal(isServiceOperationAllowed(serviceId, 'projects:delete'), false);

    assert.throws(
      () => enforceServiceOperation(serviceId, 'user:change_role'),
      /Service Authorization Denied/
    );
  });
});
