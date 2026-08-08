-- 005_create_epc_project_funding_table.test.sql
-- Test script for epc_project_funding table migration
-- Run this after applying the migration to verify correctness

-- ==========================================
-- TEST SETUP
-- ==========================================

-- Create test users
INSERT INTO users (id, clerk_id, email, first_name, last_name) VALUES
    ('11111111-1111-1111-1111-111111111111', 'test_epc_1', 'epc1@test.com', 'EPC', 'Contractor'),
    ('22222222-2222-2222-2222-222222222222', 'test_installer_1', 'installer1@test.com', 'Installer', 'One'),
    ('33333333-3333-3333-3333-333333333333', 'test_owner_1', 'owner1@test.com', 'Project', 'Owner');

-- Assign roles
INSERT INTO roles (user_id, role_name, enhanced_permissions) VALUES
    ('11111111-1111-1111-1111-111111111111', 'epc_contractor', '{"create:project": true, "fund:payment": true}'),
    ('22222222-2222-2222-2222-222222222222', 'installer', '{}'),
    ('33333333-3333-3333-3333-333333333333', 'project_owner', '{}');

-- Create test external projects
INSERT INTO projects (id, owner_id, installer_id, title, description, location_state, location_city, status, system_size_kw, project_source, creator_id, approval_authority) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'External Solar Project 1', 'Large commercial installation', 'Lagos', 'Ikeja', 'in_progress', 100.5, 'external', '11111111-1111-1111-1111-111111111111', 'epc_contractor'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', NULL, 'External Solar Project 2', 'Residential complex', 'Abuja', 'Wuse', 'pending', 50.0, 'external', '11111111-1111-1111-1111-111111111111', 'epc_contractor');

-- ==========================================
-- TEST 1: Basic Table Structure
-- ==========================================

-- Verify table exists
SELECT 'TEST 1.1: Table exists' AS test_name,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'epc_project_funding'
    ) THEN 'PASS' ELSE 'FAIL' END AS result;

-- Verify all columns exist with correct types
SELECT 'TEST 1.2: All columns exist' AS test_name,
    CASE WHEN (
        SELECT COUNT(*) FROM information_schema.columns 
        WHERE table_name = 'epc_project_funding'
        AND column_name IN ('id', 'project_id', 'epc_contractor_id', 'funding_amount', 'escrow_status', 'milestone_schedule', 'commission_agreement', 'created_at', 'updated_at')
    ) = 9 THEN 'PASS' ELSE 'FAIL' END AS result;

-- Verify funding_amount is DECIMAL(15,2)
SELECT 'TEST 1.3: funding_amount is DECIMAL(15,2)' AS test_name,
    CASE WHEN (
        SELECT data_type = 'numeric' 
        AND numeric_precision = 15 
        AND numeric_scale = 2
        FROM information_schema.columns 
        WHERE table_name = 'epc_project_funding' 
        AND column_name = 'funding_amount'
    ) THEN 'PASS' ELSE 'FAIL' END AS result;

-- ==========================================
-- TEST 2: Constraints and Defaults
-- ==========================================

-- Test default values
INSERT INTO epc_project_funding (project_id, epc_contractor_id, funding_amount, milestone_schedule, commission_agreement) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 5000000.00, 
     '[{"milestone_id": "m1", "percentage": 30, "amount": 1500000.00, "status": "pending"}]'::jsonb,
     '{"platform_commission": 5, "crew_commission": 10}'::jsonb);

SELECT 'TEST 2.1: Default values applied' AS test_name,
    CASE WHEN (
        SELECT escrow_status = 'pending'
        FROM epc_project_funding 
        WHERE project_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
    ) THEN 'PASS' ELSE 'FAIL' END AS result;

-- Test UNIQUE constraint on project_id
DO $$
BEGIN
    BEGIN
        INSERT INTO epc_project_funding (project_id, epc_contractor_id, funding_amount, milestone_schedule, commission_agreement) VALUES
            ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 3000000.00, 
             '[]'::jsonb, '{}'::jsonb);
        RAISE EXCEPTION 'TEST 2.2: UNIQUE constraint on project_id - FAIL (duplicate allowed)';
    EXCEPTION WHEN unique_violation THEN
        RAISE NOTICE 'TEST 2.2: UNIQUE constraint on project_id - PASS';
    END;
END $$;

-- Test CHECK constraint on escrow_status
DO $$
BEGIN
    BEGIN
        INSERT INTO epc_project_funding (project_id, epc_contractor_id, funding_amount, escrow_status, milestone_schedule, commission_agreement) VALUES
            ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 2000000.00, 'invalid_status',
             '[]'::jsonb, '{}'::jsonb);
        RAISE EXCEPTION 'TEST 2.3: CHECK constraint on escrow_status - FAIL (invalid status allowed)';
    EXCEPTION WHEN check_violation THEN
        RAISE NOTICE 'TEST 2.3: CHECK constraint on escrow_status - PASS';
    END;
END $$;

-- Test CHECK constraint on funding_amount (must be positive)
DO $$
BEGIN
    BEGIN
        INSERT INTO epc_project_funding (project_id, epc_contractor_id, funding_amount, milestone_schedule, commission_agreement) VALUES
            ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', -1000.00,
             '[]'::jsonb, '{}'::jsonb);
        RAISE EXCEPTION 'TEST 2.4: CHECK constraint on funding_amount - FAIL (negative amount allowed)';
    EXCEPTION WHEN check_violation THEN
        RAISE NOTICE 'TEST 2.4: CHECK constraint on funding_amount - PASS';
    END;
END $$;

-- Test NOT NULL constraints
DO $$
BEGIN
    BEGIN
        INSERT INTO epc_project_funding (project_id, epc_contractor_id, funding_amount, milestone_schedule) VALUES
            ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 2000000.00,
             '[]'::jsonb);
        RAISE EXCEPTION 'TEST 2.5: NOT NULL constraint on commission_agreement - FAIL (NULL allowed)';
    EXCEPTION WHEN not_null_violation THEN
        RAISE NOTICE 'TEST 2.5: NOT NULL constraint on commission_agreement - PASS';
    END;
END $$;

-- ==========================================
-- TEST 3: Foreign Key Constraints
-- ==========================================

-- Test project_id foreign key
DO $$
BEGIN
    BEGIN
        INSERT INTO epc_project_funding (project_id, epc_contractor_id, funding_amount, milestone_schedule, commission_agreement) VALUES
            ('99999999-9999-9999-9999-999999999999', '11111111-1111-1111-1111-111111111111', 1000000.00,
             '[]'::jsonb, '{}'::jsonb);
        RAISE EXCEPTION 'TEST 3.1: project_id FK - FAIL (invalid project allowed)';
    EXCEPTION WHEN foreign_key_violation THEN
        RAISE NOTICE 'TEST 3.1: project_id FK - PASS';
    END;
END $$;

-- Test epc_contractor_id foreign key
DO $$
BEGIN
    BEGIN
        INSERT INTO epc_project_funding (project_id, epc_contractor_id, funding_amount, milestone_schedule, commission_agreement) VALUES
            ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '99999999-9999-9999-9999-999999999999', 1000000.00,
             '[]'::jsonb, '{}'::jsonb);
        RAISE EXCEPTION 'TEST 3.2: epc_contractor_id FK - FAIL (invalid contractor allowed)';
    EXCEPTION WHEN foreign_key_violation THEN
        RAISE NOTICE 'TEST 3.2: epc_contractor_id FK - PASS';
    END;
END $$;

-- ==========================================
-- TEST 4: Indexes
-- ==========================================

-- Verify all indexes exist
SELECT 'TEST 4.1: All indexes exist' AS test_name,
    CASE WHEN (
        SELECT COUNT(*) FROM pg_indexes 
        WHERE tablename = 'epc_project_funding'
        AND indexname IN (
            'idx_epc_project_funding_contractor_id',
            'idx_epc_project_funding_escrow_status',
            'idx_epc_project_funding_contractor_status',
            'idx_epc_project_funding_milestone_schedule',
            'idx_epc_project_funding_commission_agreement',
            'idx_epc_project_funding_amount'
        )
    ) = 6 THEN 'PASS' ELSE 'FAIL' END AS result;

-- Verify GIN indexes for JSONB columns
SELECT 'TEST 4.2: GIN indexes for JSONB columns' AS test_name,
    CASE WHEN (
        SELECT COUNT(*) FROM pg_indexes 
        WHERE tablename = 'epc_project_funding'
        AND indexdef LIKE '%USING gin%'
    ) = 2 THEN 'PASS' ELSE 'FAIL' END AS result;

-- ==========================================
-- TEST 5: Triggers
-- ==========================================

-- Test updated_at trigger
INSERT INTO epc_project_funding (project_id, epc_contractor_id, funding_amount, escrow_status, milestone_schedule, commission_agreement) VALUES
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 3000000.00, 'pending',
     '[{"milestone_id": "m1", "percentage": 50, "amount": 1500000.00}]'::jsonb,
     '{"platform_commission": 5}'::jsonb);

-- Wait a moment and update
SELECT pg_sleep(1);

UPDATE epc_project_funding 
SET escrow_status = 'locked' 
WHERE project_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

SELECT 'TEST 5.1: updated_at trigger' AS test_name,
    CASE WHEN (
        SELECT updated_at > created_at 
        FROM epc_project_funding 
        WHERE project_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
    ) THEN 'PASS' ELSE 'FAIL' END AS result;

-- ==========================================
-- TEST 6: JSONB Functionality
-- ==========================================

-- Test milestone_schedule JSONB queries
SELECT 'TEST 6.1: milestone_schedule JSONB query' AS test_name,
    CASE WHEN (
        SELECT jsonb_array_length(milestone_schedule) > 0
        FROM epc_project_funding 
        WHERE project_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
    ) THEN 'PASS' ELSE 'FAIL' END AS result;

-- Test commission_agreement JSONB queries
SELECT 'TEST 6.2: commission_agreement JSONB query' AS test_name,
    CASE WHEN (
        SELECT (commission_agreement->>'platform_commission')::int = 5
        FROM epc_project_funding 
        WHERE project_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
    ) THEN 'PASS' ELSE 'FAIL' END AS result;

-- Test JSONB update operations
UPDATE epc_project_funding 
SET milestone_schedule = milestone_schedule || '[{"milestone_id": "m2", "percentage": 70, "amount": 3500000.00}]'::jsonb
WHERE project_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

SELECT 'TEST 6.3: JSONB array append' AS test_name,
    CASE WHEN (
        SELECT jsonb_array_length(milestone_schedule) = 2
        FROM epc_project_funding 
        WHERE project_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
    ) THEN 'PASS' ELSE 'FAIL' END AS result;

-- ==========================================
-- TEST 7: RLS Policies
-- ==========================================

-- Verify RLS is enabled
SELECT 'TEST 7.1: RLS enabled' AS test_name,
    CASE WHEN (
        SELECT relrowsecurity 
        FROM pg_class 
        WHERE relname = 'epc_project_funding'
    ) THEN 'PASS' ELSE 'FAIL' END AS result;

-- Verify policies exist
SELECT 'TEST 7.2: RLS policies exist' AS test_name,
    CASE WHEN (
        SELECT COUNT(*) FROM pg_policies 
        WHERE tablename = 'epc_project_funding'
    ) >= 3 THEN 'PASS' ELSE 'FAIL' END AS result;

-- ==========================================
-- TEST 8: Cascade Behavior
-- ==========================================

-- Test ON DELETE CASCADE for project_id
DELETE FROM projects WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

SELECT 'TEST 8.1: ON DELETE CASCADE for project_id' AS test_name,
    CASE WHEN NOT EXISTS (
        SELECT 1 FROM epc_project_funding 
        WHERE project_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
    ) THEN 'PASS' ELSE 'FAIL' END AS result;

-- Test ON DELETE RESTRICT for epc_contractor_id (should prevent deletion)
DO $$
BEGIN
    BEGIN
        DELETE FROM users WHERE id = '11111111-1111-1111-1111-111111111111';
        RAISE EXCEPTION 'TEST 8.2: ON DELETE RESTRICT for epc_contractor_id - FAIL (deletion allowed)';
    EXCEPTION WHEN foreign_key_violation THEN
        RAISE NOTICE 'TEST 8.2: ON DELETE RESTRICT for epc_contractor_id - PASS';
    END;
END $$;

-- ==========================================
-- TEST 9: Financial Data Precision
-- ==========================================

-- Test decimal precision for large amounts
UPDATE epc_project_funding 
SET funding_amount = 9999999999999.99
WHERE project_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

SELECT 'TEST 9.1: Decimal precision for large amounts' AS test_name,
    CASE WHEN (
        SELECT funding_amount = 9999999999999.99
        FROM epc_project_funding 
        WHERE project_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
    ) THEN 'PASS' ELSE 'FAIL' END AS result;

-- Test decimal precision for small amounts with cents
UPDATE epc_project_funding 
SET funding_amount = 1234.56
WHERE project_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

SELECT 'TEST 9.2: Decimal precision for cents' AS test_name,
    CASE WHEN (
        SELECT funding_amount = 1234.56
        FROM epc_project_funding 
        WHERE project_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
    ) THEN 'PASS' ELSE 'FAIL' END AS result;

-- ==========================================
-- TEST 10: Escrow Status Transitions
-- ==========================================

-- Test valid escrow status transitions
UPDATE epc_project_funding SET escrow_status = 'pending' WHERE project_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
UPDATE epc_project_funding SET escrow_status = 'locked' WHERE project_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
UPDATE epc_project_funding SET escrow_status = 'released' WHERE project_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

SELECT 'TEST 10.1: Valid escrow status transitions' AS test_name,
    CASE WHEN (
        SELECT escrow_status = 'released'
        FROM epc_project_funding 
        WHERE project_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
    ) THEN 'PASS' ELSE 'FAIL' END AS result;

-- Test disputed status
UPDATE epc_project_funding SET escrow_status = 'disputed' WHERE project_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

SELECT 'TEST 10.2: Disputed status' AS test_name,
    CASE WHEN (
        SELECT escrow_status = 'disputed'
        FROM epc_project_funding 
        WHERE project_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
    ) THEN 'PASS' ELSE 'FAIL' END AS result;

-- ==========================================
-- TEST CLEANUP
-- ==========================================

-- Clean up test data
DELETE FROM epc_project_funding WHERE project_id IN ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
DELETE FROM projects WHERE id IN ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
DELETE FROM roles WHERE user_id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333');
DELETE FROM users WHERE id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333');

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
