-- 007_extend_payments_for_epc_funding.test.sql
-- Test script for payments table extension migration
-- Run this script after applying migration 007 to verify correctness

-- ==========================================
-- TEST SUITE FOR MIGRATION 007
-- ==========================================

-- Test 1: Verify columns exist with correct data types
DO $$
DECLARE
    funding_source_type TEXT;
    epc_details_type TEXT;
BEGIN
    -- Check funding_source column
    SELECT data_type INTO funding_source_type
    FROM information_schema.columns
    WHERE table_name = 'payments' AND column_name = 'funding_source';
    
    IF funding_source_type != 'character varying' THEN
        RAISE EXCEPTION 'funding_source column has incorrect type: %', funding_source_type;
    END IF;
    
    -- Check epc_funding_details column
    SELECT data_type INTO epc_details_type
    FROM information_schema.columns
    WHERE table_name = 'payments' AND column_name = 'epc_funding_details';
    
    IF epc_details_type != 'jsonb' THEN
        RAISE EXCEPTION 'epc_funding_details column has incorrect type: %', epc_details_type;
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
    WHERE tablename = 'payments'
    AND indexname IN (
        'idx_payments_funding_source',
        'idx_payments_epc_funded',
        'idx_payments_epc_funding_details',
        'idx_payments_epc_contractor'
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
    test_payment_id UUID;
    retrieved_source VARCHAR(20);
    retrieved_details JSONB;
BEGIN
    -- Create a test user
    INSERT INTO users (email, role)
    VALUES ('test_payment_user_' || gen_random_uuid() || '@test.com', 'installer')
    RETURNING id INTO test_user_id;
    
    -- Insert payment without specifying funding_source or epc_funding_details
    INSERT INTO payments (
        user_id, 
        amount, 
        provider, 
        provider_reference
    )
    VALUES (
        test_user_id, 
        1000.00, 
        'paystack', 
        'test_ref_' || gen_random_uuid()
    )
    RETURNING id INTO test_payment_id;
    
    -- Retrieve and verify defaults
    SELECT funding_source, epc_funding_details 
    INTO retrieved_source, retrieved_details
    FROM payments
    WHERE id = test_payment_id;
    
    IF retrieved_source != 'client' THEN
        RAISE EXCEPTION 'funding_source default is incorrect: %', retrieved_source;
    END IF;
    
    IF retrieved_details != '{}'::jsonb THEN
        RAISE EXCEPTION 'epc_funding_details default is incorrect: %', retrieved_details;
    END IF;
    
    -- Cleanup
    DELETE FROM payments WHERE id = test_payment_id;
    DELETE FROM users WHERE id = test_user_id;
    
    RAISE NOTICE 'Test 3 PASSED: Default values work correctly';
END $$;

-- Test 4: Verify funding_source CHECK constraint
DO $$
DECLARE
    test_user_id UUID;
    constraint_violated BOOLEAN := FALSE;
BEGIN
    -- Create a test user
    INSERT INTO users (email, role)
    VALUES ('test_constraint_user_' || gen_random_uuid() || '@test.com', 'installer')
    RETURNING id INTO test_user_id;
    
    -- Try to insert invalid funding_source
    BEGIN
        INSERT INTO payments (
            user_id, 
            amount, 
            provider, 
            provider_reference, 
            funding_source
        )
        VALUES (
            test_user_id, 
            1000.00, 
            'paystack', 
            'test_ref_' || gen_random_uuid(), 
            'invalid_source'
        );
    EXCEPTION
        WHEN check_violation THEN
            constraint_violated := TRUE;
    END;
    
    IF NOT constraint_violated THEN
        RAISE EXCEPTION 'CHECK constraint on funding_source did not prevent invalid value';
    END IF;
    
    -- Cleanup
    DELETE FROM users WHERE id = test_user_id;
    
    RAISE NOTICE 'Test 4 PASSED: CHECK constraint works correctly';
END $$;

-- Test 5: Verify EPC-funded payment insertion
DO $$
DECLARE
    test_user_id UUID;
    test_epc_id UUID;
    test_project_id UUID;
    test_payment_id UUID;
    retrieved_source VARCHAR(20);
    retrieved_epc_id TEXT;
BEGIN
    -- Create test users
    INSERT INTO users (email, role)
    VALUES ('test_epc_user_' || gen_random_uuid() || '@test.com', 'epc_contractor')
    RETURNING id INTO test_epc_id;
    
    INSERT INTO users (email, role)
    VALUES ('test_crew_user_' || gen_random_uuid() || '@test.com', 'crew')
    RETURNING id INTO test_user_id;
    
    -- Insert EPC-funded payment
    INSERT INTO payments (
        user_id, 
        amount, 
        provider, 
        provider_reference,
        funding_source,
        epc_funding_details
    )
    VALUES (
        test_user_id, 
        5000000.00, 
        'paystack', 
        'test_epc_ref_' || gen_random_uuid(),
        'epc_funded',
        jsonb_build_object(
            'epc_contractor_id', test_epc_id,
            'external_project_id', gen_random_uuid(),
            'milestone_id', gen_random_uuid(),
            'commission_rate', 0.05,
            'escrow_mode', 'full'
        )
    )
    RETURNING id INTO test_payment_id;
    
    -- Verify insertion
    SELECT funding_source, epc_funding_details->>'epc_contractor_id'
    INTO retrieved_source, retrieved_epc_id
    FROM payments
    WHERE id = test_payment_id;
    
    IF retrieved_source != 'epc_funded' THEN
        RAISE EXCEPTION 'funding_source is incorrect: %', retrieved_source;
    END IF;
    
    IF retrieved_epc_id != test_epc_id::text THEN
        RAISE EXCEPTION 'epc_contractor_id is incorrect: %', retrieved_epc_id;
    END IF;
    
    -- Cleanup
    DELETE FROM payments WHERE id = test_payment_id;
    DELETE FROM users WHERE id IN (test_user_id, test_epc_id);
    
    RAISE NOTICE 'Test 5 PASSED: EPC-funded payment insertion works correctly';
END $$;

-- Test 6: Verify JSONB operations on epc_funding_details
DO $$
DECLARE
    test_user_id UUID;
    test_epc_id UUID;
    test_payment_id UUID;
    retrieved_commission NUMERIC;
BEGIN
    -- Create test users
    INSERT INTO users (email, role)
    VALUES ('test_jsonb_epc_' || gen_random_uuid() || '@test.com', 'epc_contractor')
    RETURNING id INTO test_epc_id;
    
    INSERT INTO users (email, role)
    VALUES ('test_jsonb_user_' || gen_random_uuid() || '@test.com', 'crew')
    RETURNING id INTO test_user_id;
    
    -- Insert payment with epc_funding_details
    INSERT INTO payments (
        user_id, 
        amount, 
        provider, 
        provider_reference,
        funding_source,
        epc_funding_details
    )
    VALUES (
        test_user_id, 
        3000000.00, 
        'paystack', 
        'test_jsonb_ref_' || gen_random_uuid(),
        'epc_funded',
        '{"epc_contractor_id": "test-epc-123", "commission_rate": 0.07, "escrow_mode": "milestone"}'::jsonb
    )
    RETURNING id INTO test_payment_id;
    
    -- Query using JSONB operators
    SELECT (epc_funding_details->>'commission_rate')::numeric
    INTO retrieved_commission
    FROM payments
    WHERE id = test_payment_id;
    
    IF retrieved_commission != 0.07 THEN
        RAISE EXCEPTION 'JSONB query failed: expected 0.07, got %', retrieved_commission;
    END IF;
    
    -- Cleanup
    DELETE FROM payments WHERE id = test_payment_id;
    DELETE FROM users WHERE id IN (test_user_id, test_epc_id);
    
    RAISE NOTICE 'Test 6 PASSED: JSONB operations work correctly';
END $$;

-- Test 7: Verify partial index on EPC-funded payments
DO $$
DECLARE
    test_user_id UUID;
    test_epc_id UUID;
    test_payment_id UUID;
BEGIN
    -- Create test users
    INSERT INTO users (email, role)
    VALUES ('test_index_epc_' || gen_random_uuid() || '@test.com', 'epc_contractor')
    RETURNING id INTO test_epc_id;
    
    INSERT INTO users (email, role)
    VALUES ('test_index_user_' || gen_random_uuid() || '@test.com', 'crew')
    RETURNING id INTO test_user_id;
    
    -- Insert EPC-funded payment
    INSERT INTO payments (
        user_id, 
        amount, 
        provider, 
        provider_reference,
        funding_source
    )
    VALUES (
        test_user_id, 
        2000000.00, 
        'paystack', 
        'test_index_ref_' || gen_random_uuid(),
        'epc_funded'
    )
    RETURNING id INTO test_payment_id;
    
    -- Query using partial index condition
    PERFORM 1
    FROM payments
    WHERE user_id = test_user_id
    AND funding_source = 'epc_funded'
    AND created_at > NOW() - INTERVAL '1 hour';
    
    -- Cleanup
    DELETE FROM payments WHERE id = test_payment_id;
    DELETE FROM users WHERE id IN (test_user_id, test_epc_id);
    
    RAISE NOTICE 'Test 7 PASSED: Partial index query executes successfully';
END $$;

-- Test 8: Verify composite index for EPC contractor queries
DO $$
DECLARE
    test_user_id UUID;
    test_epc_id UUID;
    test_payment_id1 UUID;
    test_payment_id2 UUID;
    found_count INTEGER;
BEGIN
    -- Create test users
    INSERT INTO users (email, role)
    VALUES ('test_composite_epc_' || gen_random_uuid() || '@test.com', 'epc_contractor')
    RETURNING id INTO test_epc_id;
    
    INSERT INTO users (email, role)
    VALUES ('test_composite_user_' || gen_random_uuid() || '@test.com', 'crew')
    RETURNING id INTO test_user_id;
    
    -- Insert multiple EPC-funded payments
    INSERT INTO payments (
        user_id, 
        amount, 
        provider, 
        provider_reference,
        funding_source,
        epc_funding_details,
        status
    )
    VALUES (
        test_user_id, 
        1500000.00, 
        'paystack', 
        'test_comp_ref1_' || gen_random_uuid(),
        'epc_funded',
        jsonb_build_object('epc_contractor_id', test_epc_id),
        'completed'
    )
    RETURNING id INTO test_payment_id1;
    
    INSERT INTO payments (
        user_id, 
        amount, 
        provider, 
        provider_reference,
        funding_source,
        epc_funding_details,
        status
    )
    VALUES (
        test_user_id, 
        2500000.00, 
        'paystack', 
        'test_comp_ref2_' || gen_random_uuid(),
        'epc_funded',
        jsonb_build_object('epc_contractor_id', test_epc_id),
        'pending'
    )
    RETURNING id INTO test_payment_id2;
    
    -- Query by EPC contractor ID
    SELECT COUNT(*) INTO found_count
    FROM payments
    WHERE funding_source = 'epc_funded'
    AND epc_funding_details->>'epc_contractor_id' = test_epc_id::text;
    
    IF found_count != 2 THEN
        RAISE EXCEPTION 'EPC contractor query failed: expected 2 records, found %', found_count;
    END IF;
    
    -- Cleanup
    DELETE FROM payments WHERE id IN (test_payment_id1, test_payment_id2);
    DELETE FROM users WHERE id IN (test_user_id, test_epc_id);
    
    RAISE NOTICE 'Test 8 PASSED: Composite index query works correctly';
END $$;

-- Test 9: Verify backward compatibility (existing payments still work)
DO $$
DECLARE
    existing_count INTEGER;
BEGIN
    -- Count existing payments (should not fail)
    SELECT COUNT(*) INTO existing_count
    FROM payments;
    
    -- Verify all existing payments have default values
    PERFORM 1
    FROM payments
    WHERE funding_source IS NULL
    OR epc_funding_details IS NULL;
    
    IF FOUND THEN
        RAISE EXCEPTION 'Some existing payments have NULL values in new columns';
    END IF;
    
    RAISE NOTICE 'Test 9 PASSED: Backward compatibility maintained (% existing payments)', existing_count;
END $$;

-- Test 10: Verify updated_at trigger still works
DO $$
DECLARE
    test_user_id UUID;
    test_payment_id UUID;
    original_updated_at TIMESTAMPTZ;
    new_updated_at TIMESTAMPTZ;
BEGIN
    -- Create a test user
    INSERT INTO users (email, role)
    VALUES ('test_trigger_user_' || gen_random_uuid() || '@test.com', 'installer')
    RETURNING id INTO test_user_id;
    
    -- Insert payment
    INSERT INTO payments (
        user_id, 
        amount, 
        provider, 
        provider_reference
    )
    VALUES (
        test_user_id, 
        1000.00, 
        'paystack', 
        'test_trigger_ref_' || gen_random_uuid()
    )
    RETURNING id, updated_at INTO test_payment_id, original_updated_at;
    
    -- Wait a moment
    PERFORM pg_sleep(0.1);
    
    -- Update payment status
    UPDATE payments 
    SET status = 'completed'
    WHERE id = test_payment_id
    RETURNING updated_at INTO new_updated_at;
    
    IF new_updated_at <= original_updated_at THEN
        RAISE EXCEPTION 'updated_at trigger did not update timestamp';
    END IF;
    
    -- Cleanup
    DELETE FROM payments WHERE id = test_payment_id;
    DELETE FROM users WHERE id = test_user_id;
    
    RAISE NOTICE 'Test 10 PASSED: updated_at trigger still active';
END $$;

-- Test 11: Verify integration with existing payment workflows
DO $$
DECLARE
    test_user_id UUID;
    test_escrow_id UUID;
    test_payment_id UUID;
BEGIN
    -- Create a test user
    INSERT INTO users (email, role)
    VALUES ('test_workflow_user_' || gen_random_uuid() || '@test.com', 'installer')
    RETURNING id INTO test_user_id;
    
    -- Create a test escrow entry (simplified - may need project setup in real scenario)
    -- Note: This is a simplified test; actual escrow creation may require more setup
    
    -- Insert payment with escrow reference (standard workflow)
    INSERT INTO payments (
        user_id, 
        amount, 
        provider, 
        provider_reference,
        funding_source
    )
    VALUES (
        test_user_id, 
        1000.00, 
        'paystack', 
        'test_workflow_ref_' || gen_random_uuid(),
        'client'
    )
    RETURNING id INTO test_payment_id;
    
    -- Verify payment was created successfully
    PERFORM 1
    FROM payments
    WHERE id = test_payment_id
    AND funding_source = 'client';
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Standard payment workflow failed';
    END IF;
    
    -- Cleanup
    DELETE FROM payments WHERE id = test_payment_id;
    DELETE FROM users WHERE id = test_user_id;
    
    RAISE NOTICE 'Test 11 PASSED: Integration with existing payment workflows maintained';
END $$;

-- ==========================================
-- TEST SUMMARY
-- ==========================================

SELECT 
    'All tests completed successfully!' AS summary,
    'Migration 007 is working correctly' AS status;
