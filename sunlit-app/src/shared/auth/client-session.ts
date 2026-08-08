'use client';

import type { SunlitSessionPayload } from './sunlit-session';
import { dashboardPathForRole, type SunlitRole } from './sunlit-roles';
import { USE_REAL_API } from '@/config/runtime';

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
  // Sync with cookie so middleware can read it when USE_REAL_API is false
  if (typeof document !== 'undefined') {
    document.cookie = `sunlit_session=${encodeURIComponent(JSON.stringify(session))}; path=/; max-age=86400; SameSite=Lax`;
  }
}

export async function bootstrapMockSession(partial: {
  user_id: string;
  name?: string;
  role: SunlitRole;
  token?: string;
}): Promise<SunlitSessionPayload | null> {
  const sessionData: SunlitSessionPayload = {
    user_id: partial.user_id,
    name: partial.name ?? 'Mock User',
    role: partial.role,
    token: partial.token ?? 'mock-jwt',
    expires_at: Date.now() + 1000 * 60 * 60 * 24, // 1 day
    onboarding_state: 'completed',
  };

  if (!USE_REAL_API) {
    writeLocalSession(sessionData);
    return sessionData;
  }

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

export async function loginWithOTP(
  email: string,
  otp: string
): Promise<{ ok: true; session: SunlitSessionPayload } | { ok: false; error: string }> {
  
  if (!USE_REAL_API) {
    if (otp !== '123456') {
      return { ok: false, error: 'Invalid verification code. Please use 123456 for the debug session.' };
    }
    const sessionData: SunlitSessionPayload = {
      user_id: 'mock-uuid-bayo',
      name: 'Adebayo Wale',
      email: 'bayo@test.com',
      role: 'project_owner',
      token: 'mock-jwt',
      expires_at: Date.now() + 1000 * 60 * 60 * 24,
      onboarding_state: 'completed',
    };
    writeLocalSession(sessionData);
    return { ok: true, session: sessionData };
  }

  const res = await fetch(`${baseUrl()}/api/v1/auth/mock-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
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
  if (!USE_REAL_API) {
    return readLocalSession();
  }

  const res = await fetch(`${baseUrl()}/api/v1/auth/session`, {
    credentials: 'include',
    cache: 'no-store',
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { authenticated?: boolean; session?: SunlitSessionPayload };
  if (data.authenticated && data.session) return data.session;
  return null;
}

export async function logoutClient(): Promise<void> {
  const clearSessionData = () => {
    localStorage.removeItem(LS_KEY);
    localStorage.removeItem('sunlit_onboarding_role');
    if (typeof document !== 'undefined') {
      document.cookie = `sunlit_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
    }
  };

  if (!USE_REAL_API) {
    clearSessionData();
    window.location.href = '/login';
    return;
  }

  try {
    await fetch(`${baseUrl()}/api/v1/auth/session`, { method: 'DELETE', credentials: 'include' });
  } catch (e) {
    console.warn('Silent logout failure', e);
  }
  
  clearSessionData();
  window.location.href = '/login';
}

export function postLoginRoute(
  session: SunlitSessionPayload,
  redirectParam?: string | null
): string {
  const userRole = session.role;
  if (!userRole) {
    console.error("[AUTH] ROLE_NOT_ASSIGNED during redirect resolution");
    throw new Error("ROLE_NOT_ASSIGNED");
  }

  const roleDashboard = dashboardPathForRole(userRole as SunlitRole);
  
  // LOG: Redirect decision tracking
  console.log(`[AUTH] role=${userRole} redirect_param=${redirectParam || 'none'} role_dashboard=${roleDashboard}`);

  const safeRedirect = redirectParam ? decodeURIComponent(redirectParam) : null;

  // SECURITY: NEVER TRUST redirect blindly
  if (safeRedirect && safeRedirect.startsWith('/dashboard')) {
    // ENFORCE ROLE MATCH
    if (!safeRedirect.startsWith(roleDashboard)) {
      console.warn(`[AUTH] REDIRECT_OVERRIDE: param=${safeRedirect} role_target=${roleDashboard} action=BLOCKED`);
      return roleDashboard;
    }
    console.log(`[AUTH] REDIRECT_VALIDATED: param=${safeRedirect} matches role_target=${roleDashboard}`);
    return safeRedirect;
  }

  console.log(`[AUTH] REDIRECT_DEFAULT: target=${roleDashboard}`);
  return roleDashboard;
}
