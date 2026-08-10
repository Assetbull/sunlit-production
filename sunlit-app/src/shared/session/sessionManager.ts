import { readLocalSession, writeLocalSession, logoutClient } from '@/shared/auth/client-session';
import type { SunlitSessionPayload } from '@/shared/auth/sunlit-session';
import type { SunlitRole } from '@/shared/auth/sunlit-roles';

export interface SessionUser {
  id?: string;
  user_id?: string;
  name: string;
  email: string;
  role: string;
  auth_provider?: string;
  token?: string;
}

export function getSession(): SessionUser | null {
  const session = readLocalSession();
  if (!session) return null;
  return {
    id: session.user_id,
    user_id: session.user_id,
    name: session.name || '',
    email: session.email || '',
    role: session.role,
    token: session.token,
  };
}

export function setSession(user: SessionUser) {
  const payload: SunlitSessionPayload = {
    user_id: user.user_id || user.id || 'usr_unknown',
    name: user.name,
    email: user.email,
    role: (user.role as SunlitRole) || 'project_owner',
    token: user.token || 'mock-jwt',
    expires_at: Date.now() + 86400 * 1000,
    onboarding_state: 'completed',
  };
  writeLocalSession(payload);
}

export function clearSession() {
  logoutClient();
}

