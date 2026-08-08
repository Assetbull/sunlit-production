-- 002_test_migration.sql
-- Description: Test script to verify migration 002 was applied correctly
-- This script can be run after applying migration 002 to verify the changes

-- ==========================================
-- VERIFICATION QUERIES
-- ==========================================

-- 1. Check if enhanced_permissions column exists
SELECT 
    column_name, 
    data_type, 
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'roles' 
AND column_name = 'enhanced_permissions';

-- Expected result: One row showing:
-- column_name: enhanced_permissions
-- data_type: jsonb
-- column_default: '{}'::jsonb
-- is_nullable: NO

-- 2. Check if the GIN index exists
SELECT 
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'roles'
AND indexname = 'idx_roles_enhanced_permissions';

-- Expected result: One row showing the index definition

-- 3. Check column comment
SELECT 
    col_description('roles'::regclass, 
        (SELECT ordinal_position 
         FROM information_schema.columns 
         WHERE table_name = 'roles' 
         AND column_name = 'enhanced_permissions')
    ) as column_comment;

-- Expected result: The comment describing EPC-specific permissions

-- ==========================================
-- FUNCTIONAL TESTS
-- ==========================================

-- 4. Test inserting a role with enhanced_permissions
-- (This is a dry-run test - wrapped in a transaction that will be rolled back)
BEGIN;

-- Insert a test user (if not exists)
INSERT INTO users (clerk_id, email, first_name, last_name)
VALUES ('test_clerk_id_migration_002', 'test_migration_002@example.com', 'Test', 'User')
ON CONFLICT (clerk_id) DO NOTHING
RETURNING id;

-- Get the user ID
DO $$
DECLARE
    test_user_id UUID;
BEGIN
    SELECT id INTO test_user_id 
    FROM users 
    WHERE clerk_id = 'test_clerk_id_migration_002';
    
    -- Insert a role with enhanced_permissions
    INSERT INTO roles (user_id, role_name, enhanced_permissions)
    VALUES (
        test_user_id,
        'epc_contractor',
        '{"create:project": true, "approve:milestone": true, "fund:payment": true}'::jsonb
    );
    
    -- Verify the insert
    IF EXISTS (
        SELECT 1 FROM roles 
        WHERE user_id = test_user_id 
        AND enhanced_permissions->>'create:project' = 'true'
    ) THEN
        RAISE NOTICE 'SUCCESS: Enhanced permissions inserted and queryable';
    ELSE
        RAISE EXCEPTION 'FAILED: Enhanced permissions not properly stored';
    END IF;
END $$;

-- Rollback the test transaction
ROLLBACK;

-- ==========================================
-- SUMMARY
-- ==========================================

SELECT 'Migration 002 verification complete. Check the results above.' as status;
