import { writeLocalSession, readLocalSession, logoutClient } from '@/shared/auth/client-session';
import type { SunlitRole } from '@/shared/auth/sunlit-roles';
import type { SunlitSessionPayload } from '@/shared/auth/sunlit-session';

/**
 * MOCK DB FOR TESTING
 */
const MOCK_DB = [
  { email: 'owner@test.com', role: 'project_owner' },
  { email: 'installer@test.com', role: 'installer' },
  { email: 'epc@test.com', role: 'epc_contractor' },
  { email: 'technician@test.com', role: 'crew_member' }, 
  { email: 'admin@test.com', role: 'admin' },
];

/**
 * Service Layer for Authentication (No UI Logic Allowed)
 */
export const authService = {
  /**
   * Main login handler
   */
  async login(email: string, password: string): Promise<{ ok: boolean; session?: SunlitSessionPayload; error?: string }> {
    await new Promise((res) => setTimeout(res, 800)); // Simulate network latency

    if (password !== '123456') {
      return { ok: false, error: 'Invalid password. Please use 123456.' };
    }

    const lowerEmail = email.toLowerCase();
    
    // Resolve role deterministically
    const dbUser = MOCK_DB.find((u) => u.email === lowerEmail);
    const role = dbUser ? (dbUser.role as SunlitRole) : this.resolveUserRole(lowerEmail);

    const sessionData: SunlitSessionPayload = {
      user_id: `mock-${role}-${Date.now()}`,
      name: email.split('@')[0],
      email: lowerEmail,
      role: role,
      token: `jwt-mock-${role}`,
      expires_at: Date.now() + 1000 * 60 * 60 * 24, // 1 day
      onboarding_state: 'completed',
    };

    // Store in localStorage & Cookie
    writeLocalSession(sessionData);

    return { ok: true, session: sessionData };
  },

  /**
   * Main registration handler
   */
  async register(userData: {
    fullName: string;
    email: string;
    phone: string;
    role: SunlitRole;
    password: string;
  }): Promise<{ ok: boolean; session?: SunlitSessionPayload; error?: string }> {
    await new Promise((res) => setTimeout(res, 800)); // Simulate latency

    const sessionData: SunlitSessionPayload = {
      user_id: `mock-new-${userData.role}-${Date.now()}`,
      name: userData.fullName,
      email: userData.email.toLowerCase(),
      role: userData.role,
      token: `jwt-mock-new-${userData.role}`,
      expires_at: Date.now() + 1000 * 60 * 60 * 24,
      onboarding_state: 'completed',
    };

    writeLocalSession(sessionData);

    return { ok: true, session: sessionData };
  },

  /**
   * Secure logout
   */
  async logout(): Promise<void> {
    await logoutClient();
  },

  /**
   * Get active session securely
   */
  getSession(): SunlitSessionPayload | null {
    return readLocalSession();
  },

  /**
   * Fallback resolution logic if arbitrary email is used.
   * Prompts: "Resolve user role deterministically"
   */
  resolveUserRole(email: string): SunlitRole {
    if (email.includes('installer')) return 'installer';
    if (email.includes('epc')) return 'epc_contractor';
    if (email.includes('tech') || email.includes('crew')) return 'crew_member';
    if (email.includes('admin')) return 'admin';
    return 'project_owner'; // Default safe role
  },
};
