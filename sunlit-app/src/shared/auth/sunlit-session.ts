import type { SunlitRole } from './sunlit-roles';
import { isSunlitRole } from './sunlit-roles';

export type SunlitSessionPayload = {
  user_id: string;
  name?: string;
  email?: string;
  role: SunlitRole;
  token: string;
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
    otp: '123456',
  },
  {
    email: 'installer@test.com',
    user_id: 'installer_001',
    name: 'Sunlit Installer Inc.',
    role: 'installer' as const,
    token: 'mock-jwt-installer',
    otp: '123456',
  },
  {
    email: 'epc@test.com',
    user_id: 'epc_001',
    name: 'Mega Solar EPC',
    role: 'epc_contractor' as const,
    token: 'mock-jwt-epc',
    otp: '123456',
  },
  {
    email: 'minigrid@test.com',
    user_id: 'minigrid_001',
    name: 'Grid Builders',
    role: 'mini_grid' as const,
    token: 'mock-jwt-minigrid',
    otp: '123456',
  },
  {
    email: 'admin@test.com',
    user_id: 'admin_001',
    name: 'System Admin',
    role: 'admin' as const,
    token: 'mock-jwt-admin',
    otp: '123456',
  }
];

const SESSION_TTL_MS = 86400 * 1000;

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
    });
  }
  return null;
}

export function buildSessionPayload(partial: {
  user_id: string;
  name?: string;
  role: SunlitRole;
  token?: string;
  ttlMs?: number;
}): SunlitSessionPayload {
  const ttl = partial.ttlMs ?? SESSION_TTL_MS;
  return {
    user_id: partial.user_id,
    name: partial.name,
    role: partial.role,
    token: partial.token ?? 'mock-jwt',
    expires_at: Date.now() + ttl,
  };
}

export function parseSessionCookie(raw: string | undefined): SunlitSessionPayload | null {
  if (!raw) return null;
  
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
    expires_at: data.expires_at,
  };
}

export function mockAuthAllowed(): boolean {
  return process.env.NEXT_PUBLIC_USE_REAL !== 'true';
}
