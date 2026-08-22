/**
 * SEEDED TEST FIXTURE — KNOWN SAFE PATTERNS
 * Used strictly to verify that Sunlit Security Scanner does not generate false positives on safe code.
 */

import { z } from 'zod';

// 1. Safe Parameterized Query
async function runSafeQuery(db: any, userInput: string) {
  return await db.query('SELECT * FROM users WHERE email = $1', [userInput]);
}

// 2. Safe Cookie Setting
function setSafeCookie(response: any, token: string) {
  response.cookies.set('sunlit_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
}

// 3. Safe Cryptographic Token
import crypto from 'crypto';
function generateSecureToken() {
  return crypto.randomBytes(32).toString('hex');
}

// 4. Safe Schema Validation
const UserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
});
