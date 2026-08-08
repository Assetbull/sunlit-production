-- 005_create_epc_project_funding_table.rollback.sql
-- Rollback script for epc_project_funding table migration
-- Execute this script to undo migration 005

-- ==========================================
-- ROLLBACK MIGRATION 005
-- ==========================================

-- Drop RLS policies
DROP POLICY IF EXISTS "Deny all public access to epc_project_funding" ON epc_project_funding;
DROP POLICY IF EXISTS "Installers can view funding for their projects" ON epc_project_funding;
DROP POLICY IF EXISTS "Project owners can view project funding" ON epc_project_funding;
DROP POLICY IF EXISTS "EPC contractors can manage their own funding" ON epc_project_funding;

-- Drop indexes
DROP INDEX IF EXISTS idx_epc_project_funding_amount;
DROP INDEX IF EXISTS idx_epc_project_funding_commission_agreement;
DROP INDEX IF EXISTS idx_epc_project_funding_milestone_schedule;
DROP INDEX IF EXISTS idx_epc_project_funding_contractor_status;
DROP INDEX IF EXISTS idx_epc_project_funding_escrow_status;
DROP INDEX IF EXISTS idx_epc_project_funding_contractor_id;

-- Drop trigger
DROP TRIGGER IF EXISTS set_epc_project_funding_updated_at ON epc_project_funding;

-- Drop table
DROP TABLE IF EXISTS epc_project_funding;

-- Verify rollback
SELECT 'Rollback complete: epc_project_funding table removed' AS status;
