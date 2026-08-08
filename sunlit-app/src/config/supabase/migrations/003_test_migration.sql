-- 003_test_migration.sql
-- Description: Test script to verify migration 003 was applied correctly
-- This script can be run after applying migration 003 to verify the changes

-- ==========================================
-- VERIFICATION QUERIES
-- ==========================================

-- 1. Check if all new columns exist with correct data types
SELECT 
    column_name, 
    data_type, 
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'projects' 
AND column_name IN (
    'project_source', 
    'creator_id', 
    'approval_authority', 
    'custom_milestone_schedule', 
    'funding_source'
)
ORDER BY column_name;

-- Expected result: Five rows showing:
-- project_source: character varying, 'marketplace', NO
-- creator_id: uuid, NULL, YES
-- approval_authority: character varying, 'project_owner', NO
-- custom_milestone_schedule: jsonb, '{}'::jsonb, NO
-- funding_source: character varying, 'client', NO

-- 2. Check if the partial index for EPC external projects exists
SELECT 
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'projects'
AND indexname = 'idx_projects_epc_external';

-- Expected result: One row showing the partial index definition with WHERE clause

-- 3. Check if the approval authority index exists
SELECT 
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'projects'
AND indexname = 'idx_projects_approval_authority';

-- Expected result: One row showing the partial index definition

-- 4. Check column comments
SELECT 
    cols.column_name,
    col_description('projects'::regclass, cols.ordinal_position) as column_comment
FROM information_schema.columns cols
WHERE cols.table_name = 'projects' 
AND cols.column_name IN (
    'project_source', 
    'creator_id', 
    'approval_authority', 
    'custom_milestone_schedule', 
    'funding_source'
)
ORDER BY cols.column_name;

-- Expected result: Five rows with descriptive comments

-- 5. Verify CHECK constraints exist
SELECT 
    con.conname as constraint_name,
    pg_get_constraintdef(con.oid) as constraint_definition
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
WHERE rel.relname = 'projects'
AND con.contype = 'c'
AND con.conname LIKE '%project_source%' 
   OR con.conname LIKE '%approval_authority%'
   OR con.conname LIKE '%funding_source%';

-- Expected result: Three CHECK constraints for the enum-like columns

-- ==========================================
-- FUNCTIONAL TESTS
-- ==========================================

-- 6. Test inserting a marketplace project (default behavior)
-- (This is a dry-run test - wrapped in a transaction that will be rolled back)
BEGIN;

-- Insert a test user (if not exists)
INSERT INTO users (clerk_id, email, first_name, last_name)
VALUES ('test_clerk_id_migration_003_owner', 'test_migration_003_owner@example.com', 'Test', 'Owner')
ON CONFLICT (clerk_id) DO NOTHING;

-- Get the user ID
DO $$
DECLARE
    test_owner_id UUID;
BEGIN
    SELECT id INTO test_owner_id 
    FROM users 
    WHERE clerk_id = 'test_clerk_id_migration_003_owner';
    
    -- Insert a marketplace project (should use defaults)
    INSERT INTO projects (
        owner_id, 
        title, 
        description, 
        location_state, 
        location_city, 
        system_size_kw
    )
    VALUES (
        test_owner_id,
        'Test Marketplace Project',
        'Testing default values for marketplace projects',
        'Lagos',
        'Ikeja',
        50.0
    );
    
    -- Verify the defaults
    IF EXISTS (
        SELECT 1 FROM projects 
        WHERE owner_id = test_owner_id 
        AND title = 'Test Marketplace Project'
        AND project_source = 'marketplace'
        AND creator_id IS NULL
        AND approval_authority = 'project_owner'
        AND custom_milestone_schedule = '{}'::jsonb
        AND funding_source = 'client'
    ) THEN
        RAISE NOTICE 'SUCCESS: Marketplace project created with correct defaults';
    ELSE
        RAISE EXCEPTION 'FAILED: Marketplace project defaults not correct';
    END IF;
END $$;

ROLLBACK;

-- 7. Test inserting an external project
BEGIN;

-- Insert test users
INSERT INTO users (clerk_id, email, first_name, last_name)
VALUES 
    ('test_clerk_id_migration_003_epc', 'test_migration_003_epc@example.com', 'Test', 'EPC'),
    ('test_clerk_id_migration_003_client', 'test_migration_003_client@example.com', 'Test', 'Client')
ON CONFLICT (clerk_id) DO NOTHING;

-- Get the user IDs
DO $$
DECLARE
    test_epc_id UUID;
    test_client_id UUID;
BEGIN
    SELECT id INTO test_epc_id 
    FROM users 
    WHERE clerk_id = 'test_clerk_id_migration_003_epc';
    
    SELECT id INTO test_client_id 
    FROM users 
    WHERE clerk_id = 'test_clerk_id_migration_003_client';
    
    -- Insert an external project
    INSERT INTO projects (
        owner_id,
        creator_id,
        title,
        description,
        location_state,
        location_city,
        system_size_kw,
        project_source,
        approval_authority,
        custom_milestone_schedule,
        funding_source
    )
    VALUES (
        test_client_id,
        test_epc_id,
        'Test External Project',
        'Testing external project with custom milestones',
        'Abuja',
        'Central',
        100.0,
        'external',
        'epc_contractor',
        '[{"name": "Foundation", "percentage": 30, "criteria": ["Site prepared"]}, {"name": "Installation", "percentage": 70, "criteria": ["Panels installed"]}]'::jsonb,
        'epc_funded'
    );
    
    -- Verify the external project
    IF EXISTS (
        SELECT 1 FROM projects 
        WHERE creator_id = test_epc_id 
        AND title = 'Test External Project'
        AND project_source = 'external'
        AND approval_authority = 'epc_contractor'
        AND funding_source = 'epc_funded'
        AND jsonb_array_length(custom_milestone_schedule) = 2
    ) THEN
        RAISE NOTICE 'SUCCESS: External project created with custom values';
    ELSE
        RAISE EXCEPTION 'FAILED: External project not properly stored';
    END IF;
    
    -- Test the partial index is being used
    EXPLAIN (FORMAT TEXT) 
    SELECT * FROM projects 
    WHERE project_source = 'external' 
    AND creator_id = test_epc_id;
    
    RAISE NOTICE 'Check EXPLAIN output above - should use idx_projects_epc_external';
END $$;

ROLLBACK;

-- 8. Test CHECK constraint validation
BEGIN;

-- Insert a test user
INSERT INTO users (clerk_id, email, first_name, last_name)
VALUES ('test_clerk_id_migration_003_check', 'test_migration_003_check@example.com', 'Test', 'Check')
ON CONFLICT (clerk_id) DO NOTHING;

-- Get the user ID
DO $$
DECLARE
    test_user_id UUID;
    constraint_violated BOOLEAN := FALSE;
BEGIN
    SELECT id INTO test_user_id 
    FROM users 
    WHERE clerk_id = 'test_clerk_id_migration_003_check';
    
    -- Try to insert with invalid project_source (should fail)
    BEGIN
        INSERT INTO projects (owner_id, title, project_source)
        VALUES (test_user_id, 'Invalid Source', 'invalid_source');
    EXCEPTION WHEN check_violation THEN
        constraint_violated := TRUE;
        RAISE NOTICE 'SUCCESS: CHECK constraint prevented invalid project_source';
    END;
    
    IF NOT constraint_violated THEN
        RAISE EXCEPTION 'FAILED: CHECK constraint did not prevent invalid project_source';
    END IF;
    
    constraint_violated := FALSE;
    
    -- Try to insert with invalid approval_authority (should fail)
    BEGIN
        INSERT INTO projects (owner_id, title, approval_authority)
        VALUES (test_user_id, 'Invalid Authority', 'invalid_authority');
    EXCEPTION WHEN check_violation THEN
        constraint_violated := TRUE;
        RAISE NOTICE 'SUCCESS: CHECK constraint prevented invalid approval_authority';
    END;
    
    IF NOT constraint_violated THEN
        RAISE EXCEPTION 'FAILED: CHECK constraint did not prevent invalid approval_authority';
    END IF;
    
    constraint_violated := FALSE;
    
    -- Try to insert with invalid funding_source (should fail)
    BEGIN
        INSERT INTO projects (owner_id, title, funding_source)
        VALUES (test_user_id, 'Invalid Funding', 'invalid_funding');
    EXCEPTION WHEN check_violation THEN
        constraint_violated := TRUE;
        RAISE NOTICE 'SUCCESS: CHECK constraint prevented invalid funding_source';
    END;
    
    IF NOT constraint_violated THEN
        RAISE EXCEPTION 'FAILED: CHECK constraint did not prevent invalid funding_source';
    END IF;
END $$;

ROLLBACK;

-- 9. Test backward compatibility - verify existing projects have correct defaults
SELECT 
    COUNT(*) as total_projects,
    COUNT(*) FILTER (WHERE project_source = 'marketplace') as marketplace_projects,
    COUNT(*) FILTER (WHERE approval_authority = 'project_owner') as owner_authority_projects,
    COUNT(*) FILTER (WHERE funding_source = 'client') as client_funded_projects,
    COUNT(*) FILTER (WHERE custom_milestone_schedule = '{}'::jsonb) as default_milestone_projects
FROM projects;

-- Expected result: All existing projects should have marketplace defaults

-- ==========================================
-- SUMMARY
-- ==========================================

SELECT 'Migration 003 verification complete. Check the results above.' as status;
