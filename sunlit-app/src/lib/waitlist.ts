'use server';

import { createClient } from '@supabase/supabase-js';

export interface WaitlistEntry {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  state: string;
  city?: string;
  interest: string;
  message?: string;
  agreed_to_updates: boolean;
}

export async function submitWaitlist(entry: WaitlistEntry): Promise<{ success: boolean; error?: string }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    // Graceful fallback when Supabase is not configured
    console.warn('[Waitlist] Supabase not configured — entry logged to console only');
    console.log('[Waitlist] Entry:', entry);
    return { success: true };
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase.from('waitlist').insert([
      {
        first_name: entry.first_name,
        last_name: entry.last_name,
        email: entry.email,
        phone: entry.phone,
        state: entry.state,
        city: entry.city ?? null,
        interest: entry.interest,
        message: entry.message ?? null,
        agreed_to_updates: entry.agreed_to_updates,
        created_at: new Date().toISOString(),
        source: 'landing_page',
      },
    ]);

    if (error) {
      // Duplicate email is a soft error — treat as success
      if (error.code === '23505') {
        return { success: true };
      }
      console.error('[Waitlist] Supabase error:', error);
      return { success: false, error: 'Failed to save your registration. Please try again.' };
    }

    return { success: true };
  } catch (err) {
    console.error('[Waitlist] Unexpected error:', err);
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
}
