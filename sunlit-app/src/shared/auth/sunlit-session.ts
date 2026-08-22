import type { SunlitRole } from './sunlit-roles';
import { isSunlitRole } from './sunlit-roles';
import crypto from 'crypto';

export type SunlitSessionPayload = {
  user_id: string;
  name?: string;
  email?: string;
  role: SunlitRole;
  token: string;
  organization_id?: string;
  workspace_id?: string;
  expires_at: number;
  onboarding_state?: string;
};

export const MOCK_TEST_USERS = [
  {
    email: 'owner@test.com',
    user_id: 'user_001',
    name: 'Adebayo Wale',
    role: 'project_owner' as const,
    token: 'mock-jwt-owner',
    organization_id: 'org_owner_default',
    workspace_id: 'ws_owner_default',
    otp: '123456',
  },
  {
    email: 'installer@test.com',
    user_id: 'installer_001',
    name: 'Sunlit Installer Inc.',
    role: 'installer' as const,
    token: 'mock-jwt-installer',
    organization_id: 'org_installer_default',
    workspace_id: 'ws_installer_default',
    otp: '123456',
  },
  {
    email: 'epc@test.com',
    user_id: 'epc_001',
    name: 'Mega Solar EPC',
    role: 'epc_contractor' as const,
    token: 'mock-jwt-epc',
    organization_id: 'org_epc_default',
    workspace_id: 'ws_epc_default',
    otp: '123456',
  },
  {
    email: 'minigrid@test.com',
    user_id: 'minigrid_001',
    name: 'Grid Builders',
    role: 'mini_grid' as const,
    token: 'mock-jwt-minigrid',
    organization_id: 'org_minigrid_default',
    workspace_id: 'ws_minigrid_default',
    otp: '123456',
  },
  {
    email: 'admin@test.com',
    user_id: 'admin_001',
    name: 'System Admin',
    role: 'admin' as const,
    token: 'mock-jwt-admin',
    organization_id: 'org_admin_default',
    workspace_id: 'ws_admin_default',
    otp: '123456',
  }
];

const SESSION_TTL_MS = 86400 * 1000;

/**
 * Session Cookie Signing — HMAC-SHA256
 *
 * SECURITY: Session cookies MUST be signed to prevent forgery.
 * Without signing, any client can craft a cookie with arbitrary
 * user_id, role, and token values to impersonate any user.
 *
 * Format: base64(payload).base64(signature)
 * The signature covers the entire payload to detect tampering.
 */
const SESSION_COOKIE_SEPARATOR = '.';

function getSessionSecret(): string {
  return process.env.SESSION_SECRET || 'sunlit-dev-session-secret-change-in-production';
}

/**
 * Signs a session payload and returns a tamper-proof cookie string.
 * Format: base64url(JSON payload).base64url(HMAC-SHA256 signature)
 */
export function signSessionCookie(session: SunlitSessionPayload): string {
  const payload = Buffer.from(JSON.stringify(session)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', getSessionSecret())
    .update(payload)
    .digest('base64url');
  return `${payload}${SESSION_COOKIE_SEPARATOR}${signature}`;
}

/**
 * Verifies the HMAC signature on a signed session cookie.
 * Returns the parsed payload if valid, null if tampered or malformed.
 */
export function verifySignedSessionCookie(raw: string): SunlitSessionPayload | null {
  const separatorIndex = raw.lastIndexOf(SESSION_COOKIE_SEPARATOR);
  if (separatorIndex === -1) return null;

  const payload = raw.substring(0, separatorIndex);
  const signature = raw.substring(separatorIndex + 1);

  // Recompute expected signature
  const expectedSignature = crypto
    .createHmac('sha256', getSessionSecret())
    .update(payload)
    .digest('base64url');

  // Timing-safe comparison to prevent timing attacks
  const sigBuffer = Buffer.from(signature, 'base64url');
  const expectedBuffer = Buffer.from(expectedSignature, 'base64url');

  if (sigBuffer.length !== expectedBuffer.length) return null;
  if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) return null;

  // Signature valid — parse payload
  try {
    const decoded = Buffer.from(payload, 'base64url').toString('utf-8');
    return JSON.parse(decoded) as SunlitSessionPayload;
  } catch {
    return null;
  }
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Validates a mock OTP for a given identifier.
 * OTP logic is mock-only for debug phase.
 */
export function validateMockOTP(
  identifier: string,
  otp: string
): SunlitSessionPayload | null {
  const normalizedIdentifier = normalizeEmail(identifier);
  
  const user = MOCK_TEST_USERS.find(
    (u) => normalizeEmail(u.email) === normalizedIdentifier && u.otp === otp
  );

  if (user) {
    return buildSessionPayload({
      user_id: user.user_id,
      name: user.name,
      role: user.role,
      token: user.token,
      organization_id: user.organization_id,
      workspace_id: user.workspace_id,
    });
  }
  return null;
}

export function buildSessionPayload(partial: {
  user_id: string;
  name?: string;
  role: SunlitRole;
  token?: string;
  organization_id?: string;
  workspace_id?: string;
  ttlMs?: number;
}): SunlitSessionPayload {
  const ttl = partial.ttlMs ?? SESSION_TTL_MS;
  return {
    user_id: partial.user_id,
    name: partial.name,
    role: partial.role,
    token: partial.token ?? 'mock-jwt',
    organization_id: partial.organization_id,
    workspace_id: partial.workspace_id,
    expires_at: Date.now() + ttl,
  };
}

/**
 * Parses a session cookie value.
 *
 * Supports two formats for backward compatibility:
 * 1. Signed format: base64url(payload).base64url(HMAC) — preferred, verified
 * 2. Legacy unsigned JSON format — accepted only in non-production
 *
 * SECURITY: In production, only signed cookies are accepted.
 * Legacy unsigned cookies are rejected to prevent forgery.
 */
export function parseSessionCookie(raw: string | undefined): SunlitSessionPayload | null {
  if (!raw) return null;

  // Attempt 1: Verify as signed cookie (preferred path)
  const signed = verifySignedSessionCookie(raw);
  if (signed) {
    return validateSessionFields(signed);
  }

  // Attempt 2: Legacy unsigned JSON (non-production only)
  if (process.env.NODE_ENV === 'production') {
    // In production, ONLY signed cookies are accepted
    return null;
  }

  let data: Record<string, unknown>;
  try {
    data = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    try {
      const decoded = decodeURIComponent(raw);
      data = JSON.parse(decoded) as Record<string, unknown>;
    } catch {
      return null;
    }
  }

  return validateSessionFields(data);
}

/**
 * Validates session payload fields after parsing.
 * Enforces type checks and expiration.
 */
function validateSessionFields(data: Record<string, unknown>): SunlitSessionPayload | null {
  if (
    typeof data.user_id !== 'string' ||
    typeof data.expires_at !== 'number' ||
    typeof data.token !== 'string' ||
    !isSunlitRole(data.role)
  ) {
    return null;
  }
  if (data.expires_at < Date.now()) return null;
  return {
    user_id: data.user_id,
    name: typeof data.name === 'string' ? data.name : undefined,
    role: data.role,
    token: data.token,
    organization_id: typeof data.organization_id === 'string' ? data.organization_id : undefined,
    workspace_id: typeof data.workspace_id === 'string' ? data.workspace_id : undefined,
    expires_at: data.expires_at,
  };
}

/**
 * Determines if mock authentication is allowed.
 *
 * SECURITY: Mock auth is NEVER allowed in production, regardless of
 * environment variable settings. This prevents accidental mock auth
 * exposure if NEXT_PUBLIC_USE_REAL is misconfigured.
 */
export function mockAuthAllowed(): boolean {
  if (process.env.NODE_ENV === 'production') return false;
  return process.env.NEXT_PUBLIC_USE_REAL !== 'true';
}
