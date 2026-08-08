-- 010_create_crewlink_tables.test.sql
-- Description: Test script for CrewLink tables creation
-- Feature: EPC Dashboard Enterprise System
-- Task: 10.1 Extend CrewLink job posting for project assignment

-- ==========================================
-- 1. SETUP TEST DATA
-- ==========================================

-- Create test users
INSERT INTO users (id, clerk_id, email, first_name, last_name) VALUES
    ('11111111-1111-1111-1111-111111111111', 'test_epc_1', 'epc1@test.com', 'EPC', 'Contractor'),
    ('22222222-2222-2222-2222-222222222222', 'test_crew_1', 'crew1@test.com', 'Crew', 'Member'),
    ('33333333-3333-3333-3333-333333333333', 'test_crew_2', 'crew2@test.com', 'Crew', 'Member2');

-- Create test roles
INSERT INTO roles (user_id, role_name) VALUES
    ('11111111-1111-1111-1111-111111111111', 'epc_contractor'),
    ('22222222-2222-2222-2222-222222222222', 'crew_member'),
    ('33333333-3333-3333-3333-333333333333', 'crew_member');

-- Create test external project
INSERT INTO projects (id, owner_id, title, project_source, creator_id, approval_authority) VALUES
    ('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'Test External Project', 'external', '11111111-1111-1111-1111-111111111111', 'epc_contractor');

-- ==========================================
-- 2. TEST CREW JOBS TABLE
-- ==========================================

-- Test 1: Basic crew job creation
INSERT INTO crew_jobs (
    id, project_id, posted_by, title, description, 
    location_state, location_city, required_skills, 
    pay_rate, pay_type, estimated_duration_days,
    project_assignment, milestone_integration, crew_coordination_config
) VALUES (
    '55555555-5555-5555-5555-555555555555',
    '44444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    'Solar Panel Installation Crew Needed',
    'Looking for experienced crew for commercial solar installation',
    'Lagos',
    'Victoria Island',
    ARRAY['solar_installation', 'electrical_work', 'safety_certified'],
    15000,
    'daily',
    30,
    '44444444-4444-4444-4444-444444444444',
    '{"milestone_1": {"crew_size": 2, "skills": ["installation"]}, "milestone_2": {"crew_size": 1, "skills": ["testing"]}}',
    '{"max_concurrent_crews": 3, "coordination_method": "daily_standup", "communication_channel": "whatsapp"}'
);

-- Verify crew job was created
SELECT 
    id, title, status, project_assignment IS NOT NULL as has_project_assignment,
    milestone_integration IS NOT NULL as has_milestone_integration,
    crew_coordination_config IS NOT NULL as has_coordination_config
FROM crew_jobs 
WHERE id = '55555555-5555-5555-5555-555555555555';

-- Test 2: Crew job status transitions
UPDATE crew_jobs SET status = 'published' WHERE id = '55555555-5555-5555-5555-555555555555';

-- Verify status update
SELECT id, status FROM crew_jobs WHERE id = '55555555-5555-5555-5555-555555555555';

-- ==========================================
-- 3. TEST CREW APPLICATIONS TABLE
-- ==========================================

-- Test 3: Crew application creation
INSERT INTO crew_applications (
    id, job_id, applicant_id, cover_note, 
    proposed_rate, availability_start, availability_end
) VALUES (
    '66666666-6666-6666-6666-666666666666',
    '55555555-5555-5555-5555-555555555555',
    '22222222-2222-2222-2222-222222222222',
    'I have 5 years experience in solar installations',
    16000,
    CURRENT_DATE + INTERVAL '1 week',
    CURRENT_DATE + INTERVAL '6 weeks'
);

-- Verify application was created
SELECT id, job_id, applicant_id, status, proposed_rate 
FROM crew_applications 
WHERE id = '66666666-6666-6666-6666-666666666666';

-- Test 4: Application status update
UPDATE crew_applications 
SET status = 'accepted', reviewed_at = CURRENT_TIMESTAMP, reviewed_by = '11111111-1111-1111-1111-111111111111'
WHERE id = '66666666-6666-6666-6666-666666666666';

-- ==========================================
-- 4. TEST CREW ASSIGNMENTS TABLE
-- ==========================================

-- Test 5: Crew assignment creation
INSERT INTO crew_assignments (
    id, job_id, crew_member_id, project_id, assigned_by,
    agreed_rate, start_date, end_date, work_status
) VALUES (
    '77777777-7777-7777-7777-777777777777',
    '55555555-5555-5555-5555-555555555555',
    '22222222-2222-2222-2222-222222222222',
    '44444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    16000,
    CURRENT_DATE + INTERVAL '1 week',
    CURRENT_DATE + INTERVAL '5 weeks',
    'assigned'
);

-- Verify assignment was created
SELECT id, job_id, crew_member_id, work_status, agreed_rate 
FROM crew_assignments 
WHERE id = '77777777-7777-7777-7777-777777777777';

-- Test 6: Work progress tracking
UPDATE crew_assignments 
SET hours_logged = 40, work_status = 'active'
WHERE id = '77777777-7777-7777-7777-777777777777';

-- Test 7: Performance rating
UPDATE crew_assignments 
SET quality_rating = 5, timeliness_rating = 4, communication_rating = 5,
    work_status = 'completed', completed_at = CURRENT_TIMESTAMP
WHERE id = '77777777-7777-7777-7777-777777777777';

-- ==========================================
-- 5. TEST CONSTRAINTS AND VALIDATIONS
-- ==========================================

-- Test 8: Positive pay rate constraint
DO $$
BEGIN
    BEGIN
        INSERT INTO crew_jobs (project_id, posted_by, title, pay_rate) 
        VALUES ('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'Test Job', -100);
        RAISE EXCEPTION 'Negative pay rate should have been rejected';
    EXCEPTION WHEN check_violation THEN
        RAISE NOTICE 'Test 8 PASSED: Negative pay rate correctly rejected';
    END;
END $$;

-- Test 9: Valid date range constraint
DO $$
BEGIN
    BEGIN
        INSERT INTO crew_applications (job_id, applicant_id, availability_start, availability_end) 
        VALUES ('55555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', '2024-12-31', '2024-01-01');
        RAISE EXCEPTION 'Invalid date range should have been rejected';
    EXCEPTION WHEN check_violation THEN
        RAISE NOTICE 'Test 9 PASSED: Invalid date range correctly rejected';
    END;
END $$;

-- Test 10: Rating range constraint
DO $$
BEGIN
    BEGIN
        UPDATE crew_assignments SET quality_rating = 10 WHERE id = '77777777-7777-7777-7777-777777777777';
        RAISE EXCEPTION 'Invalid rating should have been rejected';
    EXCEPTION WHEN check_violation THEN
        RAISE NOTICE 'Test 10 PASSED: Invalid rating correctly rejected';
    END;
END $$;

-- ==========================================
-- 6. TEST INDEXES AND PERFORMANCE
-- ==========================================

-- Test 11: Verify indexes exist
SELECT 
    schemaname, tablename, indexname, indexdef
FROM pg_indexes 
WHERE tablename IN ('crew_jobs', 'crew_applications', 'crew_assignments')
ORDER BY tablename, indexname;

-- ==========================================
-- 7. TEST RLS POLICIES
-- ==========================================

-- Test 12: RLS is enabled
SELECT 
    schemaname, tablename, rowsecurity
FROM pg_tables 
WHERE tablename IN ('crew_jobs', 'crew_applications', 'crew_assignments');

-- Test 13: Policies exist
SELECT 
    schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename IN ('crew_jobs', 'crew_applications', 'crew_assignments')
ORDER BY tablename, policyname;

-- ==========================================
-- 8. TEST EPC ENHANCEMENTS
-- ==========================================

-- Test 14: Project assignment functionality
SELECT 
    cj.id, cj.title, cj.project_assignment,
    p.title as assigned_project_title,
    p.project_source, p.approval_authority
FROM crew_jobs cj
LEFT JOIN projects p ON p.id = cj.project_assignment
WHERE cj.id = '55555555-5555-5555-5555-555555555555';

-- Test 15: Milestone integration JSONB
SELECT 
    id, title,
    milestone_integration->>'milestone_1' as milestone_1_config,
    crew_coordination_config->>'max_concurrent_crews' as max_crews
FROM crew_jobs 
WHERE id = '55555555-5555-5555-5555-555555555555';

-- ==========================================
-- 9. CLEANUP TEST DATA
-- ==========================================

-- Clean up in reverse dependency order
DELETE FROM crew_assignments WHERE id = '77777777-7777-7777-7777-777777777777';
DELETE FROM crew_applications WHERE id = '66666666-6666-6666-6666-666666666666';
DELETE FROM crew_jobs WHERE id = '55555555-5555-5555-5555-555555555555';
DELETE FROM projects WHERE id = '44444444-4444-4444-4444-444444444444';
DELETE FROM roles WHERE user_id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333');
DELETE FROM users WHERE id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333');

-- ==========================================
-- 10. FINAL VERIFICATION
-- ==========================================

SELECT 'CrewLink tables test completed successfully' as test_result;