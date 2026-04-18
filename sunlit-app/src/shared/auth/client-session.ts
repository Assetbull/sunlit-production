'use client';

import type { SunlitSessionPayload } from './sunlit-session';
import { dashboardPathForRole, type SunlitRole } from './sunlit-roles';

const LS_KEY = 'sunlit_session';

function baseUrl(): string {
  if (typeof window !== 'undefined') return '';
  return process.env.NEXT_PUBLIC_BASE_URL ?? '';
}

export function readLocalSession(): SunlitSessionPayload | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as SunlitSessionPayload;
    if (!data.expires_at || data.expires_at < Date.now()) {
      localStorage.removeItem(LS_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function writeLocalSession(session: SunlitSessionPayload) {
  localStorage.setItem(LS_KEY, JSON.stringify(session));
}

export async function bootstrapMockSession(partial: {
  user_id: string;
  name?: string;
  role: SunlitRole;
  token?: string;
}): Promise<SunlitSessionPayload | null> {
  const res = await fetch(`${baseUrl()}/api/v1/auth/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(partial),
    credentials: 'include',
  });
  const data = (await res.json()) as { session?: SunlitSessionPayload; error?: string };
  if (!res.ok || !data.session) return null;
  writeLocalSession(data.session);
  return data.session;
}

export async function loginWithMockCredentials(
  email: string,
  password: string
): Promise<{ ok: true; session: SunlitSessionPayload } | { ok: false; error: string }> {
  const res = await fetch(`${baseUrl()}/api/v1/auth/mock-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });
  const data = (await res.json()) as {
    session?: SunlitSessionPayload;
    error?: string;
  };
  if (!res.ok || !data.session) {
    return { ok: false, error: data.error ?? 'Login failed' };
  }
  writeLocalSession(data.session);
  return { ok: true, session: data.session };
}

export async function fetchServerSession(): Promise<SunlitSessionPayload | null> {
  const res = await fetch(`${baseUrl()}/api/v1/auth/session`, {
    credentials: 'include',
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { authenticated?: boolean; session?: SunlitSessionPayload };
  if (data.authenticated && data.session) return data.session;
  return null;
}

export async function logoutClient(): Promise<void> {
  await fetch(`${baseUrl()}/api/v1/auth/session`, { method: 'DELETE', credentials: 'include' });
  localStorage.removeItem(LS_KEY);
  localStorage.removeItem('sunlit_onboarding_role');
}

export function postLoginRoute(
  session: SunlitSessionPayload,
  redirectParam?: string | null
): string {
  const base = dashboardPathForRole(session.role);
  if (redirectParam && redirectParam.startsWith(base)) {
    return redirectParam;
  }
  return base;
}
