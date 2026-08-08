-- 003_extend_projects_for_external_support_rollback.sql
-- Description: Rollback script for migration 003 - removes external project support columns
-- Feature: EPC Dashboard Enterprise System
-- Task: 1.2 Extend projects table for external project support (ROLLBACK)

-- ==========================================
-- ROLLBACK MIGRATION
-- ==========================================

-- Drop indexes first
DROP INDEX IF EXISTS idx_projects_approval_authority;
DROP INDEX IF EXISTS idx_projects_epc_external;

-- Drop columns in reverse order of creation
ALTER TABLE projects DROP COLUMN IF EXISTS funding_source;
ALTER TABLE projects DROP COLUMN IF EXISTS custom_milestone_schedule;
ALTER TABLE projects DROP COLUMN IF EXISTS approval_authority;
ALTER TABLE projects DROP COLUMN IF EXISTS creator_id;
ALTER TABLE projects DROP COLUMN IF EXISTS project_source;

-- ==========================================
-- VERIFICATION
-- ==========================================

-- Verify columns are removed
SELECT 
    column_name
FROM information_schema.columns
WHERE table_name = 'projects' 
AND column_name IN (
    'project_source', 
    'creator_id', 
    'approval_authority', 
    'custom_milestone_schedule', 
    'funding_source'
);

-- Expected result: No rows (all columns removed)

-- Verify indexes are removed
SELECT 
    indexname
FROM pg_indexes
WHERE tablename = 'projects'
AND indexname IN ('idx_projects_epc_external', 'idx_projects_approval_authority');

-- Expected result: No rows (all indexes removed)
