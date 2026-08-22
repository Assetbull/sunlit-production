/**
 * Service Identity and Discovery Registry
 *
 * Implements SERVICE_IDENTITY_REGISTRY_OS.md (Registry ID 63)
 * Tier 0 Core Platform Service — Machine-to-Machine Identity Authority.
 *
 * Guaranteed Properties:
 * 1. No anonymous internal background process anywhere on the platform.
 * 2. Closed Allowed Operations Manifest per service identity.
 * 3. Machine-to-machine actors operate under least privilege.
 */

export interface ServiceIdentity {
  serviceId: string;
  serviceName: string;
  classification: 'TIER_0' | 'SHARED' | 'BACKGROUND_WORKER';
  allowedOperations: readonly string[];
  isActive: boolean;
}

/**
 * Authoritative Canonical Service Identity Registry
 */
export const CANONICAL_SERVICE_IDENTITIES: Record<string, ServiceIdentity> = {
  'system:payment_webhook': {
    serviceId: 'system:payment_webhook',
    serviceName: 'Payment Provider Inbound Webhook Processor',
    classification: 'SHARED',
    allowedOperations: [
      'payments:update_status',
      'escrow:fund',
      'audit:log',
      'events:emit',
    ],
    isActive: true,
  },
  'system:cron_job': {
    serviceId: 'system:cron_job',
    serviceName: 'Platform Scheduled Maintenance & Expiration Worker',
    classification: 'BACKGROUND_WORKER',
    allowedOperations: [
      'rfq:expire_stale',
      'subscriptions:sync_status',
      'audit:log',
      'events:emit',
    ],
    isActive: true,
  },
  'system:audit_archiver': {
    serviceId: 'system:audit_archiver',
    serviceName: 'Immutable Audit Trail Verification & Archiver',
    classification: 'TIER_0',
    allowedOperations: [
      'audit:read',
      'audit:verify_chain',
      'audit:log',
    ],
    isActive: true,
  },
  'system:fraud_detection': {
    serviceId: 'system:fraud_detection',
    serviceName: 'Marketplace Integrity & Fraud Signal Engine',
    classification: 'SHARED',
    allowedOperations: [
      'marketplace:evaluate_risk',
      'fraud_signals:create',
      'audit:log',
      'events:emit',
    ],
    isActive: true,
  },
  'system:monitoring_agent': {
    serviceId: 'system:monitoring_agent',
    serviceName: 'Platform Telemetry & Health Probe Agent',
    classification: 'TIER_0',
    allowedOperations: [
      'health:probe',
      'telemetry:collect',
    ],
    isActive: true,
  },
} as const;

/**
 * Resolves a registered Service Identity by its canonical identifier.
 * Returns null if the service is unregistered or inactive.
 */
export function getRegisteredServiceIdentity(serviceId: string): ServiceIdentity | null {
  if (!serviceId) return null;
  const identity = CANONICAL_SERVICE_IDENTITIES[serviceId];
  if (!identity || !identity.isActive) {
    return null;
  }
  return identity;
}

/**
 * Validates whether a machine service identity is explicitly allowed
 * to perform a requested operation according to its Allowed Operations Manifest.
 */
export function isServiceOperationAllowed(serviceId: string, operation: string): boolean {
  const identity = getRegisteredServiceIdentity(serviceId);
  if (!identity) return false;
  return identity.allowedOperations.includes(operation);
}

/**
 * Enforces Service Identity operation allowance, throwing on violation.
 */
export function enforceServiceOperation(serviceId: string, operation: string): void {
  if (!isServiceOperationAllowed(serviceId, operation)) {
    throw new Error(
      `Service Authorization Denied: Service '${serviceId}' is not authorized for operation '${operation}' in its Allowed Operations Manifest.`
    );
  }
}

/**
 * Resolves all canonical registered service identities.
 */
export function getAllServiceIdentities(): ServiceIdentity[] {
  return Object.values(CANONICAL_SERVICE_IDENTITIES);
}

/**
 * Service Identity Registry Namespace
 */
export const ServiceIdentityRegistry = {
  get: getRegisteredServiceIdentity,
  isAllowed: isServiceOperationAllowed,
  enforce: enforceServiceOperation,
  getAllServiceIdentities,
};


