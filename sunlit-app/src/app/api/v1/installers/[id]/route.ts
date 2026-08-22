/**
 * GET /api/v1/installers/[id] — Get installer by slug (public)
 * PATCH /api/v1/installers/[id] — Update installer profile (authenticated owner)
 * 
 * [id] is the installer slug (e.g. "solarcraft-energy-a8f42c"),
 * NOT the internal database UUID.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { InstallerService } from '@/core/installer/InstallerService';
import { parseSessionCookie } from '@/shared/auth/sunlit-session';

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || url.includes('your-project-id') || key.includes('your-service-role-key')) {
    return null;
  }
  return createClient(url, key);
}

function getAnonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes('your-project-id') || key.includes('your-anon-key')) {
    return null;
  }
  return createClient(url, key);
}

/**
 * GET /api/v1/installers/[id]
 * 
 * Public endpoint. Returns PublicInstallerView.
 * Never returns raw database records or internal IDs.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: slug } = await params;
    
    const supabase = getAnonClient();
    const service = new InstallerService(supabase);
    const installer = await service.getBySlug(slug);

    if (!installer) {
      return NextResponse.json(
        { error: 'Installer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(installer, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('[API] GET /api/v1/installers/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve installer' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/v1/installers/[id]
 * 
 * Authenticated endpoint — owner only.
 * Updates the installer profile.
 * The slug is NEVER updated (immutable).
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const raw = request.cookies.get('sunlit_session')?.value;
    const session = parseSessionCookie(raw);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Prevent slug modification
    if ('slug' in body) {
      return NextResponse.json(
        { error: 'Slug is immutable and cannot be changed' },
        { status: 400 }
      );
    }

    // Prevent status modification via PATCH (use dedicated endpoints)
    if ('status' in body) {
      return NextResponse.json(
        { error: 'Use /publish or /suspend endpoints to change status' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();
    const service = new InstallerService(supabase);
    
    const updated = await service.update(session.user_id, body);

    console.log(`[AUDIT] INSTALLER_PROFILE_UPDATED user=${session.user_id} slug=${updated.slug}`);

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[API] PATCH /api/v1/installers/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update installer profile' },
      { status: 500 }
    );
  }
}
