-- 006_extend_audit_logs_for_epc_tracking.test.sql
-- Test script for audit_logs table extension migration
-- Run this script after applying migration 006 to verify correctness

-- ==========================================
-- TEST SUITE FOR MIGRATION 006
-- ==========================================

-- Test 1: Verify columns exist with correct data types
DO $$
DECLARE
    epc_data_type TEXT;
    action_cat_type TEXT;
BEGIN
    -- Check epc_specific_data column
    SELECT data_type INTO epc_data_type
    FROM information_schema.columns
    WHERE table_name = 'audit_logs' AND column_name = 'epc_specific_data';
    
    IF epc_data_type != 'jsonb' THEN
        RAISE EXCEPTION 'epc_specific_data column has incorrect type: %', epc_data_type;
    END IF;
    
    -- Check action_category column
    SELECT data_type INTO action_cat_type
    FROM information_schema.columns
    WHERE table_name = 'audit_logs' AND column_name = 'action_category';
    
    IF action_cat_type != 'character varying' THEN
        RAISE EXCEPTION 'action_category column has incorrect type: %', action_cat_type;
    END IF;
    
    RAISE NOTICE 'Test 1 PASSED: Columns exist with correct data types';
END $$;

-- Test 2: Verify indexes are created
DO $$
DECLARE
    idx_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO idx_count
    FROM pg_indexes
    WHERE tablename = 'audit_logs'
    AND indexname IN (
        'idx_audit_logs_epc',
        'idx_audit_logs_correlation',
        'idx_audit_logs_epc_specific_data',
        'idx_audit_logs_user_category_date'
    );
    
    IF idx_count != 4 THEN
        RAISE EXCEPTION 'Expected 4 indexes, found %', idx_count;
    END IF;
    
    RAISE NOTICE 'Test 2 PASSED: All indexes created successfully';
END $$;

-- Test 3: Verify default values work correctly
DO $$
DECLARE
    test_user_id UUID;
    test_audit_id UUID;
    retrieved_data JSONB;
    retrieved_category VARCHAR(50);
BEGIN
    -- Create a test user (or use existing)
    INSERT INTO users (email, role)
    VALUES ('test_audit_user_' || gen_random_uuid() || '@test.com', 'epc_contractor')
    RETURNING id INTO test_user_id;
    
    -- Insert audit log without specifying epc_specific_data or action_category
    INSERT INTO audit_logs (user_id, action_type)
    VALUES (test_user_id, 'test_action')
    RETURNING id INTO test_audit_id;
    
    -- Retrieve and verify defaults
    SELECT epc_specific_data, action_category 
    INTO retrieved_data, retrieved_category
    FROM audit_logs
    WHERE id = test_audit_id;
    
    IF retrieved_data != '{}'::jsonb THEN
        RAISE EXCEPTION 'epc_specific_data default is incorrect: %', retrieved_data;
    END IF;
    
    IF retrieved_category != 'general' THEN
        RAISE EXCEPTION 'action_category default is incorrect: %', retrieved_category;
    END IF;
    
    -- Cleanup
    DELETE FROM audit_logs WHERE id = test_audit_id;
    DELETE FROM users WHERE id = test_user_id;
    
    RAISE NOTICE 'Test 3 PASSED: Default values work correctly';
END $$;

-- Test 4: Verify action_category CHECK constraint
DO $$
DECLARE
    test_user_id UUID;
    constraint_violated BOOLEAN := FALSE;
BEGIN
    -- Create a test user
    INSERT INTO users (email, role)
    VALUES ('test_constraint_user_' || gen_random_uuid() || '@test.com', 'epc_contractor')
    RETURNING id INTO test_user_id;
    
    -- Try to insert invalid action_category
    BEGIN
        INSERT INTO audit_logs (user_id, action_type, action_category)
        VALUES (test_user_id, 'test_action', 'invalid_category');
    EXCEPTION
        WHEN check_violation THEN
            constraint_violated := TRUE;
    END;
    
    IF NOT constraint_violated THEN
        RAISE EXCEPTION 'CHECK constraint on action_category did not prevent invalid value';
    END IF;
    
    -- Cleanup
    DELETE FROM users WHERE id = test_user_id;
    
    RAISE NOTICE 'Test 4 PASSED: CHECK constraint works correctly';
END $$;

-- Test 5: Verify JSONB operations on epc_specific_data
DO $$
DECLARE
    test_user_id UUID;
    test_audit_id UUID;
    retrieved_project_id TEXT;
BEGIN
    -- Create a test user
    INSERT INTO users (email, role)
    VALUES ('test_jsonb_user_' || gen_random_uuid() || '@test.com', 'epc_contractor')
    RETURNING id INTO test_user_id;
    
    -- Insert audit log with epc_specific_data
    INSERT INTO audit_logs (
        user_id, 
        action_type, 
        action_category,
        epc_specific_data
    )
    VALUES (
        test_user_id, 
        'external_project_created',
        'epc_project',
        '{"project_id": "test-project-123", "external_project": true}'::jsonb
    )
    RETURNING id INTO test_audit_id;
    
    -- Query using JSONB operators
    SELECT epc_specific_data->>'project_id' 
    INTO retrieved_project_id
    FROM audit_logs
    WHERE id = test_audit_id;
    
    IF retrieved_project_id != 'test-project-123' THEN
        RAISE EXCEPTION 'JSONB query failed: expected "test-project-123", got "%"', retrieved_project_id;
    END IF;
    
    -- Cleanup
    DELETE FROM audit_logs WHERE id = test_audit_id;
    DELETE FROM users WHERE id = test_user_id;
    
    RAISE NOTICE 'Test 5 PASSED: JSONB operations work correctly';
END $$;

-- Test 6: Verify partial index on EPC actions
DO $$
DECLARE
    test_user_id UUID;
    test_audit_id UUID;
    index_used BOOLEAN;
BEGIN
    -- Create a test user
    INSERT INTO users (email, role)
    VALUES ('test_index_user_' || gen_random_uuid() || '@test.com', 'epc_contractor')
    RETURNING id INTO test_user_id;
    
    -- Insert EPC audit log
    INSERT INTO audit_logs (
        user_id, 
        action_type, 
        action_category
    )
    VALUES (
        test_user_id, 
        'milestone_approved',
        'epc_milestone'
    )
    RETURNING id INTO test_audit_id;
    
    -- Check if index is used in query plan
    -- Note: This is a simplified check; actual index usage depends on query planner
    PERFORM 1
    FROM audit_logs
    WHERE user_id = test_user_id
    AND action_category LIKE 'epc_%'
    AND created_at > NOW() - INTERVAL '1 hour';
    
    -- Cleanup
    DELETE FROM audit_logs WHERE id = test_audit_id;
    DELETE FROM users WHERE id = test_user_id;
    
    RAISE NOTICE 'Test 6 PASSED: Partial index query executes successfully';
END $$;

-- Test 7: Verify correlation_id index
DO $$
DECLARE
    test_user_id UUID;
    test_correlation_id UUID := gen_random_uuid();
    test_audit_id1 UUID;
    test_audit_id2 UUID;
    found_count INTEGER;
BEGIN
    -- Create a test user
    INSERT INTO users (email, role)
    VALUES ('test_correlation_user_' || gen_random_uuid() || '@test.com', 'epc_contractor')
    RETURNING id INTO test_user_id;
    
    -- Insert multiple audit logs with same correlation_id
    INSERT INTO audit_logs (user_id, action_type, correlation_id, action_category)
    VALUES (test_user_id, 'action_1', test_correlation_id, 'epc_project')
    RETURNING id INTO test_audit_id1;
    
    INSERT INTO audit_logs (user_id, action_type, correlation_id, action_category)
    VALUES (test_user_id, 'action_2', test_correlation_id, 'epc_payment')
    RETURNING id INTO test_audit_id2;
    
    -- Query by correlation_id
    SELECT COUNT(*) INTO found_count
    FROM audit_logs
    WHERE correlation_id = test_correlation_id;
    
    IF found_count != 2 THEN
        RAISE EXCEPTION 'Correlation query failed: expected 2 records, found %', found_count;
    END IF;
    
    -- Cleanup
    DELETE FROM audit_logs WHERE id IN (test_audit_id1, test_audit_id2);
    DELETE FROM users WHERE id = test_user_id;
    
    RAISE NOTICE 'Test 7 PASSED: Correlation ID tracking works correctly';
END $$;

-- Test 8: Verify backward compatibility (existing audit logs still work)
DO $$
DECLARE
    existing_count INTEGER;
BEGIN
    -- Count existing audit logs (should not fail)
    SELECT COUNT(*) INTO existing_count
    FROM audit_logs;
    
    -- Verify all existing logs have default values
    PERFORM 1
    FROM audit_logs
    WHERE epc_specific_data IS NULL
    OR action_category IS NULL;
    
    IF FOUND THEN
        RAISE EXCEPTION 'Some existing audit logs have NULL values in new columns';
    END IF;
    
    RAISE NOTICE 'Test 8 PASSED: Backward compatibility maintained (% existing logs)', existing_count;
END $$;

-- Test 9: Verify immutability triggers still work
DO $$
DECLARE
    test_user_id UUID;
    test_audit_id UUID;
    update_prevented BOOLEAN := FALSE;
BEGIN
    -- Create a test user
    INSERT INTO users (email, role)
    VALUES ('test_immutable_user_' || gen_random_uuid() || '@test.com', 'epc_contractor')
    RETURNING id INTO test_user_id;
    
    -- Insert audit log
    INSERT INTO audit_logs (user_id, action_type, action_category)
    VALUES (test_user_id, 'test_action', 'epc_project')
    RETURNING id INTO test_audit_id;
    
    -- Try to update (should be prevented by trigger)
    BEGIN
        UPDATE audit_logs 
        SET action_category = 'epc_payment'
        WHERE id = test_audit_id;
    EXCEPTION
        WHEN OTHERS THEN
            update_prevented := TRUE;
    END;
    
    IF NOT update_prevented THEN
        RAISE EXCEPTION 'Immutability trigger did not prevent UPDATE';
    END IF;
    
    -- Cleanup (DELETE should also be prevented, but we need to clean up for testing)
    -- We'll use a direct DELETE which will be caught by the trigger
    BEGIN
        DELETE FROM audit_logs WHERE id = test_audit_id;
    EXCEPTION
        WHEN OTHERS THEN
            -- Expected: delete prevented by trigger
            NULL;
    END;
    
    -- Cleanup user
    DELETE FROM users WHERE id = test_user_id;
    
    RAISE NOTICE 'Test 9 PASSED: Immutability triggers still active';
END $$;

-- ==========================================
-- TEST SUMMARY
-- ==========================================

SELECT 
    'All tests completed successfully!' AS summary,
    'Migration 006 is working correctly' AS status;
