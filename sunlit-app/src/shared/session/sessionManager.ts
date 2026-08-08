export interface SessionUser {
  id?: string;
  name: string;
  email: string;
  role: string;
  auth_provider?: string;
}

export function getSession(): SessionUser | null {
  if (typeof window === 'undefined') return null;
  const session = localStorage.getItem('sunlit_session');
  if (!session) return null;
  try {
    return JSON.parse(session) as SessionUser;
  } catch (e) {
    return null;
  }
}

export function setSession(user: SessionUser) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('sunlit_session', JSON.stringify(user));
}

export function clearSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('sunlit_session');
}
