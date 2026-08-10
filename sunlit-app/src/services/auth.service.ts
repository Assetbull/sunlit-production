import { bootstrapMockSession, writeLocalSession, readLocalSession, logoutClient } from '@/shared/auth/client-session';
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
    if (password !== '123456') {
      return { ok: false, error: 'Invalid email or password.' };
    }

    const lowerEmail = email.toLowerCase();
    
    // Resolve role deterministically
    const dbUser = MOCK_DB.find((u) => u.email === lowerEmail);
    const role = dbUser ? (dbUser.role as SunlitRole) : this.resolveUserRole(lowerEmail);

    const session = await bootstrapMockSession({
      user_id: `mock-${role}-${Date.now()}`,
      name: email.split('@')[0],
      role: role,
      token: `jwt-mock-${role}`,
    });

    if (!session) {
      return { ok: false, error: 'Could not establish session. Please try again.' };
    }

    return { ok: true, session };
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
    const session = await bootstrapMockSession({
      user_id: `mock-new-${userData.role}-${Date.now()}`,
      name: userData.fullName,
      role: userData.role,
      token: `jwt-mock-new-${userData.role}`,
    });

    if (!session) {
      return { ok: false, error: 'Could not register session. Please try again.' };
    }

    return { ok: true, session };
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
