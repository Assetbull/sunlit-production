-- =====================================================
-- Migration 009: Extend Milestones Table for EPC Approval Tracking
-- =====================================================
-- Feature: EPC Dashboard Enterprise System
-- Task: 8.1, 8.2 Implement milestone approval authority logic
-- Requirements: 5.1, 5.2, 5.3, 5.4
--
-- Purpose:
--   Extends the milestones table to track who approved milestones
--   and when they were approved. This supports EPC contractor
--   milestone approval authority on external projects.
--
-- Changes:
--   1. Add approved_at timestamp column
--   2. Add approved_by user reference column
--   3. Create index for approval queries
--
-- Backward Compatibility:
--   - Existing milestones remain unchanged (columns nullable)
--   - No breaking changes to existing queries
-- =====================================================

-- Add approval tracking columns
ALTER TABLE milestones
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES users(id) ON DELETE SET NULL;

-- Add comments for documentation
COMMENT ON COLUMN milestones.approved_at IS 'Timestamp when the milestone was approved';
COMMENT ON COLUMN milestones.approved_by IS 'User ID of who approved the milestone (project owner or EPC contractor)';

-- Create index for approval queries
CREATE INDEX IF NOT EXISTS idx_milestones_approved 
ON milestones(approved_by, approved_at) 
WHERE is_approved = true;

-- Create index for project milestone queries
CREATE INDEX IF NOT EXISTS idx_milestones_project_status 
ON milestones(project_id, is_completed, is_approved);

-- =====================================================
-- ROLLBACK SCRIPT
-- =====================================================
-- To rollback this migration, run:
--
-- DROP INDEX IF EXISTS idx_milestones_project_status;
-- DROP INDEX IF EXISTS idx_milestones_approved;
-- ALTER TABLE milestones DROP COLUMN IF EXISTS approved_by;
-- ALTER TABLE milestones DROP COLUMN IF EXISTS approved_at;
-- =====================================================

-- =====================================================
-- TEST SCRIPT
-- =====================================================
-- Test 1: Verify columns exist
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'milestones'
-- AND column_name IN ('approved_at', 'approved_by');
--
-- Expected: Both columns should exist with correct types
--
-- Test 2: Verify indexes exist
-- SELECT indexname, indexdef
-- FROM pg_indexes
-- WHERE tablename = 'milestones'
-- AND indexname IN ('idx_milestones_approved', 'idx_milestones_project_status');
--
-- Expected: Both indexes should exist
--
-- Test 3: Test approval tracking
-- -- Create test data
-- INSERT INTO milestones (
--   project_id,
--   title,
--   amount,
--   position,
--   is_completed,
--   is_approved,
--   approved_at,
--   approved_by
-- ) VALUES (
--   'test-project-id',
--   'Test Milestone',
--   1000000,
--   1,
--   true,
--   true,
--   CURRENT_TIMESTAMP,
--   'test-user-id'
-- );
--
-- Expected: Insert should succeed
--
-- Test 4: Query approved milestones
-- SELECT id, title, is_approved, approved_at, approved_by
-- FROM milestones
-- WHERE is_approved = true
-- AND approved_by IS NOT NULL;
--
-- Expected: Should return milestones with approval tracking
--
-- Test 5: Verify backward compatibility
-- INSERT INTO milestones (
--   project_id,
--   title,
--   amount,
--   position,
--   is_completed,
--   is_approved
-- ) VALUES (
--   'test-project-id-2',
--   'Legacy Milestone',
--   500000,
--   1,
--   true,
--   true
-- );
--
-- SELECT id, title, is_approved, approved_at, approved_by
-- FROM milestones
-- WHERE project_id = 'test-project-id-2';
--
-- Expected: approved_at and approved_by should be NULL (backward compatible)
-- =====================================================

-- =====================================================
-- IMPLEMENTATION NOTES
-- =====================================================
-- 1. The approved_at and approved_by columns are nullable to maintain
--    backward compatibility with existing milestones
--
-- 2. New milestone approvals should always set both fields
--
-- 3. The idx_milestones_approved index is a partial index that only
--    includes approved milestones for efficient queries
--
-- 4. The idx_milestones_project_status index supports common queries
--    that filter by project_id and milestone status
--
-- 5. The approved_by column references users(id) with ON DELETE SET NULL
--    to preserve approval history even if the approver is deleted
--
-- 6. This migration supports the EPC milestone approval authority feature:
--    - EPC contractors can approve milestones on their external projects
--    - Project owners can approve milestones on marketplace projects
--    - Approval tracking provides audit trail
-- =====================================================
