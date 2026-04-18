import { DataService } from '@/shared/api/data-service';

/**
 * Maps Clerk `userId` to Supabase `users.id` when the user row exists.
 * Escrow/KYC tables reference internal UUIDs, not Clerk IDs.
 */
export async function resolveDbUserIdFromClerk(
    dataService: DataService,
    clerkUserId: string
): Promise<string | null> {
    try {
        const user = await dataService.findOne('users', { clerk_id: clerkUserId });
        const id = user && typeof user === 'object' && 'id' in user ? (user as { id: string }).id : null;
        return id ?? null;
    } catch {
        return null;
    }
}
