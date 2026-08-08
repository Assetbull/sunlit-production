-- 004_create_crew_project_assignments_table.rollback.sql
-- Rollback script for crew_project_assignments table migration
-- Execute this script to undo migration 004

-- ==========================================
-- ROLLBACK MIGRATION 004
-- ==========================================

-- Drop RLS policies
DROP POLICY IF EXISTS "Deny all public access to crew_project_assignments" ON crew_project_assignments;
DROP POLICY IF EXISTS "Project owners can view crew assignments" ON crew_project_assignments;
DROP POLICY IF EXISTS "EPC contractors can manage their project crew assignments" ON crew_project_assignments;

-- Drop indexes
DROP INDEX IF EXISTS idx_crew_project_assignments_performance_metrics;
DROP INDEX IF EXISTS idx_crew_project_assignments_milestone_assignments;
DROP INDEX IF EXISTS idx_crew_project_assignments_project_status;
DROP INDEX IF EXISTS idx_crew_project_assignments_status;
DROP INDEX IF EXISTS idx_crew_project_assignments_crew_id;
DROP INDEX IF EXISTS idx_crew_project_assignments_project_id;

-- Drop trigger
DROP TRIGGER IF EXISTS set_crew_project_assignments_updated_at ON crew_project_assignments;

-- Drop table
DROP TABLE IF EXISTS crew_project_assignments;

-- Verify rollback
SELECT 'Rollback complete: crew_project_assignments table removed' AS status;
