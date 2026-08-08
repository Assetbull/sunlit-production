-- 006_extend_audit_logs_for_epc_tracking.rollback.sql
-- Rollback script for audit_logs table extension migration
-- Execute this script to undo migration 006

-- ==========================================
-- ROLLBACK MIGRATION 006
-- ==========================================

-- Drop indexes
DROP INDEX IF EXISTS idx_audit_logs_user_category_date;
DROP INDEX IF EXISTS idx_audit_logs_epc_specific_data;
DROP INDEX IF EXISTS idx_audit_logs_correlation;
DROP INDEX IF EXISTS idx_audit_logs_epc;

-- Drop columns (in reverse order of creation)
ALTER TABLE audit_logs DROP COLUMN IF EXISTS action_category;
ALTER TABLE audit_logs DROP COLUMN IF EXISTS epc_specific_data;

-- Note: correlation_id column is NOT dropped as it was created in migration 001
-- and may be used by other parts of the system

-- Verify rollback
SELECT 'Rollback complete: audit_logs EPC extensions removed' AS status;
