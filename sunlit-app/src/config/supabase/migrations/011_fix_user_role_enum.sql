-- 011_fix_user_role_enum.sql
-- Description: Aligns database user_role enum with TypeScript UserRole type.
--
-- FINDING H-05: The database enum uses 'crewlink' but TypeScript code uses
-- 'crew_member'. This creates a type mismatch that can cause data integrity
-- issues when roles are stored via the service layer.
--
-- This migration adds 'crew_member' to the enum. The 'crewlink' value is
-- preserved for backward compatibility with any existing records.
--
-- SAFE: Additive change only. No existing data is modified.

-- Add 'crew_member' to user_role enum if not already present
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum
        WHERE enumlabel = 'crew_member'
        AND enumtypid = 'user_role'::regtype
    ) THEN
        ALTER TYPE user_role ADD VALUE 'crew_member';
    END IF;
END
$$;

-- Add 'supplier' to user_role enum if not already present
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum
        WHERE enumlabel = 'supplier'
        AND enumtypid = 'user_role'::regtype
    ) THEN
        ALTER TYPE user_role ADD VALUE 'supplier';
    END IF;
END
$$;

-- Add 'mini_grid' to user_role enum if not already present
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum
        WHERE enumlabel = 'mini_grid'
        AND enumtypid = 'user_role'::regtype
    ) THEN
        ALTER TYPE user_role ADD VALUE 'mini_grid';
    END IF;
END
$$;
