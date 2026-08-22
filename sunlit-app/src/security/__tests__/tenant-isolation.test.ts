/**
 * Sunlit Security — Tenant & Workspace Isolation Test Suite
 *
 * Tests multi-tenant isolation, workspace boundaries, IDOR/BOLA prevention,
 * and cross-organization access controls per:
 * - ORGANIZATION_ISOLATION_OS.md (Registry ID 64)
 * - WORKSPACE_KERNEL.md (Registry ID 35)
 * - auth_rbac_review.skill.md & tenant_isolation_review.skill.md
 */

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { validateResourceAccess, GuardContext } from '../../shared/api/api-guard';
import type { UserRole } from '../../shared/types/database';

describe('Tenant Isolation — Cross-Organization Boundary Enforcement', () => {
  const orgAContext: GuardContext = {
    userId: 'user_org_a_001',
    userRole: 'installer' as UserRole,
    organizationId: 'org_alpha_uuid',
    workspaceId: 'ws_alpha_main',
    serviceIdentity: null,
    correlationId: 'corr-test-001',
    ipAddress: '127.0.0.1',
  };

  const orgBContext: GuardContext = {
    userId: 'user_org_b_001',
    userRole: 'installer' as UserRole,
    organizationId: 'org_beta_uuid',
    workspaceId: 'ws_beta_main',
    serviceIdentity: null,
    correlationId: 'corr-test-002',
    ipAddress: '127.0.0.1',
  };

  const adminContext: GuardContext = {
    userId: 'admin_001',
    userRole: 'admin' as UserRole,
    organizationId: 'org_admin_core',
    workspaceId: 'ws_admin_main',
    serviceIdentity: null,
    correlationId: 'corr-admin-001',
    ipAddress: '127.0.0.1',
  };

  test('Organization A cannot access Organization B resource', () => {
    const orgBResource = {
      id: 'proj_beta_999',
      owner_id: 'user_org_b_001',
      organization_id: 'org_beta_uuid',
    };

    const isAllowed = validateResourceAccess(orgAContext, orgBResource);
    assert.equal(isAllowed, false, 'User from Org A must be blocked from accessing Org B resource');
  });

  test('Organization A can access its own organization resource', () => {
    const orgAResource = {
      id: 'proj_alpha_101',
      owner_id: 'user_org_a_002', // colleague in same org
      organization_id: 'org_alpha_uuid',
    };

    const isAllowed = validateResourceAccess(orgAContext, orgAResource);
    assert.equal(isAllowed, true, 'User from Org A must be allowed to access Org A resource');
  });

  test('Admin has cross-tenant audit visibility', () => {
    const anyOrgResource = {
      id: 'proj_gamma_777',
      owner_id: 'user_gamma_001',
      organization_id: 'org_gamma_uuid',
    };

    const isAllowed = validateResourceAccess(adminContext, anyOrgResource);
    assert.equal(isAllowed, true, 'Admin role must have global audit access across tenants');
  });

  test('Null resource returns false for access check', () => {
    assert.equal(validateResourceAccess(orgAContext, null), false);
  });
});

describe('Tenant Isolation — IDOR & BOLA Attack Defenses', () => {
  const attackerContext: GuardContext = {
    userId: 'attacker_uuid',
    userRole: 'installer' as UserRole,
    organizationId: 'attacker_org',
    workspaceId: 'attacker_ws',
    serviceIdentity: null,
    correlationId: 'corr-attack-001',
    ipAddress: '192.168.1.100',
  };

  test('Attacker cannot access victim bid by ID', () => {
    const victimBid = {
      id: 'bid_victim_555',
      installer_id: 'victim_installer_uuid',
      organization_id: 'victim_org',
    };

    const isAllowed = validateResourceAccess(attackerContext, victimBid);
    assert.equal(isAllowed, false, 'Attacker attempting direct object access on victim bid must be denied');
  });

  test('Attacker cannot access victim project by direct ID', () => {
    const victimProject = {
      id: 'project_victim_333',
      owner_id: 'victim_owner_uuid',
      organization_id: 'victim_org',
    };

    const isAllowed = validateResourceAccess(attackerContext, victimProject);
    assert.equal(isAllowed, false, 'Attacker attempting direct object access on victim project must be denied');
  });

  test('Attacker cannot access victim dispute or escrow', () => {
    const victimEscrow = {
      id: 'escrow_victim_777',
      user_id: 'victim_owner_uuid',
      organization_id: 'victim_org',
    };

    const isAllowed = validateResourceAccess(attackerContext, victimEscrow);
    assert.equal(isAllowed, false, 'Attacker attempting access to victim escrow record must be denied');
  });

  test('Direct resource owner can access their own object even if org is unassigned', () => {
    const personalProject = {
      id: 'project_personal_001',
      owner_id: 'attacker_uuid',
      organization_id: null,
    };

    const isAllowed = validateResourceAccess(attackerContext, personalProject);
    assert.equal(isAllowed, true, 'Direct owner matching userId must have access to personal resource');
  });
});

describe('Workspace Context & Isolation Integrity', () => {
  test('GuardContext preserves workspaceId for multi-workspace organizations', () => {
    const multiWsContext: GuardContext = {
      userId: 'eng_lead_001',
      userRole: 'epc_contractor' as UserRole,
      organizationId: 'epc_firm_alpha',
      workspaceId: 'ws_lagos_solar_plant',
      serviceIdentity: null,
      correlationId: 'corr-epc-001',
      ipAddress: '10.0.0.1',
    };

    assert.equal(multiWsContext.workspaceId, 'ws_lagos_solar_plant');
    assert.equal(multiWsContext.organizationId, 'epc_firm_alpha');
  });
});
