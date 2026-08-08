-- 004_create_crew_project_assignments_table.test.sql
-- Test script for crew_project_assignments table migration
-- Run this after applying the migration to verify correctness

-- ==========================================
-- TEST SETUP
-- ==========================================

-- Create test users
INSERT INTO users (id, clerk_id, email, first_name, last_name) VALUES
    ('11111111-1111-1111-1111-111111111111', 'test_epc_1', 'epc1@test.com', 'EPC', 'Contractor'),
    ('22222222-2222-2222-2222-222222222222', 'test_crew_1', 'crew1@test.com', 'Crew', 'Member'),
    ('33333333-3333-3333-3333-333333333333', 'test_crew_2', 'crew2@test.com', 'Crew', 'Member2'),
    ('44444444-4444-4444-4444-444444444444', 'test_owner_1', 'owner1@test.com', 'Project', 'Owner');

-- Assign roles
INSERT INTO roles (user_id, role_name, enhanced_permissions) VALUES
    ('11111111-1111-1111-1111-111111111111', 'epc_contractor', '{"create:project": true, "approve:milestone": true, "coordinate:multi_crew": true}'),
    ('22222222-2222-2222-2222-222222222222', 'crewlink', '{}'),
    ('33333333-3333-3333-3333-333333333333', 'crewlink', '{}'),
    ('44444444-4444-4444-4444-444444444444', 'project_owner', '{}');

-- Create test projects
INSERT INTO projects (id, owner_id, title, description, location_state, location_city, status, system_size_kw, project_source, creator_id, approval_authority) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 'External Solar Project 1', 'Large commercial installation', 'Lagos', 'Ikeja', 'in_progress', 100.5, 'external', '11111111-1111-1111-1111-111111111111', 'epc_contractor'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 'External Solar Project 2', 'Residential complex', 'Abuja', 'Wuse', 'in_progress', 50.0, 'external', '11111111-1111-1111-1111-111111111111', 'epc_contractor');

-- ==========================================
-- TEST 1: Basic Table Structure
-- ==========================================

-- Verify table exists
SELECT 'TEST 1.1: Table exists' AS test_name,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'crew_project_assignments'
    ) THEN 'PASS' ELSE 'FAIL' END AS result;

-- Verify all columns exist with correct types
SELECT 'TEST 1.2: All columns exist' AS test_name,
    CASE WHEN (
        SELECT COUNT(*) FROM information_schema.columns 
        WHERE table_name = 'crew_project_assignments'
        AND column_name IN ('id', 'project_id', 'crew_id', 'milestone_assignments', 'assignment_status', 'performance_metrics', 'created_at', 'updated_at')
    ) = 8 THEN 'PASS' ELSE 'FAIL' END AS result;

-- ==========================================
-- TEST 2: Constraints and Defaults
-- ==========================================

-- Test default values
INSERT INTO crew_project_assignments (project_id, crew_id) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222');

SELECT 'TEST 2.1: Default values applied' AS test_name,
    CASE WHEN (
        SELECT assignment_status = 'assigned' 
        AND milestone_assignments::text = '{}'
        AND performance_metrics::text = '{}'
        FROM crew_project_assignments 
        WHERE project_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' 
        AND crew_id = '22222222-2222-2222-2222-222222222222'
    ) THEN 'PASS' ELSE 'FAIL' END AS result;

-- Test UNIQUE constraint (project_id, crew_id)
DO $$
BEGIN
    BEGIN
        INSERT INTO crew_project_assignments (project_id, crew_id) VALUES
            ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222');
        RAISE EXCEPTION 'TEST 2.2: UNIQUE constraint - FAIL (duplicate allowed)';
    EXCEPTION WHEN unique_violation THEN
        RAISE NOTICE 'TEST 2.2: UNIQUE constraint - PASS';
    END;
END $$;

-- Test CHECK constraint on assignment_status
DO $$
BEGIN
    BEGIN
        INSERT INTO crew_project_assignments (project_id, crew_id, assignment_status) VALUES
            ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 'invalid_status');
        RAISE EXCEPTION 'TEST 2.3: CHECK constraint - FAIL (invalid status allowed)';
    EXCEPTION WHEN check_violation THEN
        RAISE NOTICE 'TEST 2.3: CHECK constraint - PASS';
    END;
END $$;

-- ==========================================
-- TEST 3: Foreign Key Constraints
-- ==========================================

-- Test project_id foreign key
DO $$
BEGIN
    BEGIN
        INSERT INTO crew_project_assignments (project_id, crew_id) VALUES
            ('99999999-9999-9999-9999-999999999999', '22222222-2222-2222-2222-222222222222');
        RAISE EXCEPTION 'TEST 3.1: project_id FK - FAIL (invalid project allowed)';
    EXCEPTION WHEN foreign_key_violation THEN
        RAISE NOTICE 'TEST 3.1: project_id FK - PASS';
    END;
END $$;

-- Test crew_id foreign key
DO $$
BEGIN
    BEGIN
        INSERT INTO crew_project_assignments (project_id, crew_id) VALUES
            ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '99999999-9999-9999-9999-999999999999');
        RAISE EXCEPTION 'TEST 3.2: crew_id FK - FAIL (invalid crew allowed)';
    EXCEPTION WHEN foreign_key_violation THEN
        RAISE NOTICE 'TEST 3.2: crew_id FK - PASS';
    END;
END $$;

-- ==========================================
-- TEST 4: Indexes
-- ==========================================

-- Verify all indexes exist
SELECT 'TEST 4.1: All indexes exist' AS test_name,
    CASE WHEN (
        SELECT COUNT(*) FROM pg_indexes 
        WHERE tablename = 'crew_project_assignments'
        AND indexname IN (
            'idx_crew_project_assignments_project_id',
            'idx_crew_project_assignments_crew_id',
            'idx_crew_project_assignments_status',
            'idx_crew_project_assignments_project_status',
            'idx_crew_project_assignments_milestone_assignments',
            'idx_crew_project_assignments_performance_metrics'
        )
    ) = 6 THEN 'PASS' ELSE 'FAIL' END AS result;

-- ==========================================
-- TEST 5: Triggers
-- ==========================================

-- Test updated_at trigger
INSERT INTO crew_project_assignments (project_id, crew_id, assignment_status) VALUES
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 'assigned');

-- Wait a moment and update
SELECT pg_sleep(1);

UPDATE crew_project_assignments 
SET assignment_status = 'active' 
WHERE project_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' 
AND crew_id = '33333333-3333-3333-3333-333333333333';

SELECT 'TEST 5.1: updated_at trigger' AS test_name,
    CASE WHEN (
        SELECT updated_at > created_at 
        FROM crew_project_assignments 
        WHERE project_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' 
        AND crew_id = '33333333-3333-3333-3333-333333333333'
    ) THEN 'PASS' ELSE 'FAIL' END AS result;

-- ==========================================
-- TEST 6: JSONB Functionality
-- ==========================================

-- Test milestone_assignments JSONB
UPDATE crew_project_assignments 
SET milestone_assignments = '{"milestone_1": {"tasks": ["Foundation", "Electrical"], "start_date": "2024-01-15"}}'
WHERE project_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' 
AND crew_id = '22222222-2222-2222-2222-222222222222';

SELECT 'TEST 6.1: milestone_assignments JSONB' AS test_name,
    CASE WHEN (
        SELECT milestone_assignments->>'milestone_1' IS NOT NULL
        FROM crew_project_assignments 
        WHERE project_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' 
        AND crew_id = '22222222-2222-2222-2222-222222222222'
    ) THEN 'PASS' ELSE 'FAIL' END AS result;

-- Test performance_metrics JSONB
UPDATE crew_project_assignments 
SET performance_metrics = '{"completion_rate": 95, "quality_score": 4.5, "on_time_delivery": true}'
WHERE project_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' 
AND crew_id = '22222222-2222-2222-2222-222222222222';

SELECT 'TEST 6.2: performance_metrics JSONB' AS test_name,
    CASE WHEN (
        SELECT (performance_metrics->>'completion_rate')::int = 95
        FROM crew_project_assignments 
        WHERE project_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' 
        AND crew_id = '22222222-2222-2222-2222-222222222222'
    ) THEN 'PASS' ELSE 'FAIL' END AS result;

-- ==========================================
-- TEST 7: RLS Policies
-- ==========================================

-- Verify RLS is enabled
SELECT 'TEST 7.1: RLS enabled' AS test_name,
    CASE WHEN (
        SELECT relrowsecurity 
        FROM pg_class 
        WHERE relname = 'crew_project_assignments'
    ) THEN 'PASS' ELSE 'FAIL' END AS result;

-- Verify policies exist
SELECT 'TEST 7.2: RLS policies exist' AS test_name,
    CASE WHEN (
        SELECT COUNT(*) FROM pg_policies 
        WHERE tablename = 'crew_project_assignments'
    ) >= 2 THEN 'PASS' ELSE 'FAIL' END AS result;

-- ==========================================
-- TEST 8: Cascade Behavior
-- ==========================================

-- Test ON DELETE CASCADE for project_id
DELETE FROM projects WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

SELECT 'TEST 8.1: ON DELETE CASCADE for project_id' AS test_name,
    CASE WHEN NOT EXISTS (
        SELECT 1 FROM crew_project_assignments 
        WHERE project_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
    ) THEN 'PASS' ELSE 'FAIL' END AS result;

-- Test ON DELETE RESTRICT for crew_id (should prevent deletion)
DO $$
BEGIN
    BEGIN
        DELETE FROM users WHERE id = '33333333-3333-3333-3333-333333333333';
        RAISE EXCEPTION 'TEST 8.2: ON DELETE RESTRICT for crew_id - FAIL (deletion allowed)';
    EXCEPTION WHEN foreign_key_violation THEN
        RAISE NOTICE 'TEST 8.2: ON DELETE RESTRICT for crew_id - PASS';
    END;
END $$;

-- ==========================================
-- TEST CLEANUP
-- ==========================================

-- Clean up test data
DELETE FROM crew_project_assignments WHERE project_id IN ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
DELETE FROM projects WHERE id IN ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
DELETE FROM roles WHERE user_id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444');
DELETE FROM users WHERE id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444');

SELECT 'TEST CLEANUP: Complete' AS status;

-- ==========================================
-- TEST SUMMARY
-- ==========================================

SELECT '
========================================
MIGRATION TEST SUMMARY
========================================
All tests should show PASS or display PASS in notices.
If any test shows FAIL, review the migration script.
========================================
' AS summary;
