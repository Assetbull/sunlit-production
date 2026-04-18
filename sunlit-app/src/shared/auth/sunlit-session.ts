import type { SunlitRole } from './sunlit-roles';
import { isSunlitRole } from './sunlit-roles';

export type SunlitSessionPayload = {
  user_id: string;
  name?: string;
  role: SunlitRole;
  token: string;
  expires_at: number;
};

export const MOCK_TEST_USER = {
  email: 'Bayo@test.com',
  password: '123346',
  user_id: 'user_001',
  name: 'Adebayo Wale',
  role: 'project_owner' as const,
  token: 'mock-jwt',
};

const SESSION_TTL_MS = 86400 * 1000;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function tryLoginMockCredentials(
  email: string,
  password: string
): SunlitSessionPayload | null {
  const e = normalizeEmail(email);
  if (
    e === normalizeEmail(MOCK_TEST_USER.email) &&
    password === MOCK_TEST_USER.password
  ) {
    return buildSessionPayload({
      user_id: MOCK_TEST_USER.user_id,
      name: MOCK_TEST_USER.name,
      role: MOCK_TEST_USER.role,
      token: MOCK_TEST_USER.token,
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
  try {
    const data = JSON.parse(raw) as Record<string, unknown>;
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
  } catch {
    return null;
  }
}

export function mockAuthAllowed(): boolean {
  return process.env.NEXT_PUBLIC_USE_REAL !== 'true';
}
