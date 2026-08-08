-- 007_extend_payments_for_epc_funding.rollback.sql
-- Rollback script for payments table extension migration
-- Execute this script to undo migration 007

-- ==========================================
-- ROLLBACK MIGRATION 007
-- ==========================================

-- Drop indexes (in reverse order of creation)
DROP INDEX IF EXISTS idx_payments_epc_contractor;
DROP INDEX IF EXISTS idx_payments_epc_funding_details;
DROP INDEX IF EXISTS idx_payments_epc_funded;
DROP INDEX IF EXISTS idx_payments_funding_source;

-- Drop columns (in reverse order of creation)
ALTER TABLE payments DROP COLUMN IF EXISTS epc_funding_details;
ALTER TABLE payments DROP COLUMN IF EXISTS funding_source;

-- Verify rollback
SELECT 'Rollback complete: payments EPC extensions removed' AS status;
