-- 006_extend_audit_logs_for_epc_tracking.sql
-- Description: Extend audit_logs table for EPC-specific tracking
-- Feature: EPC Dashboard Enterprise System
-- Task: 1.5 Extend audit_logs table for EPC-specific tracking
-- Requirements: 9.1, 11.1

-- ==========================================
-- UP MIGRATION
-- ==========================================

-- Add EPC-specific columns to audit_logs table
-- These columns enable enhanced audit tracking for EPC contractor activities

-- Add epc_specific_data column for storing EPC-related audit metadata
ALTER TABLE audit_logs 
ADD COLUMN epc_specific_data JSONB DEFAULT '{}' NOT NULL;

-- Add action_category column for categorizing audit actions
ALTER TABLE audit_logs 
ADD COLUMN action_category VARCHAR(50) DEFAULT 'general' NOT NULL 
    CHECK (action_category IN ('general', 'epc_project', 'epc_crew', 'epc_payment', 'epc_milestone'));

-- Note: correlation_id column already exists in the audit_logs table from migration 001
-- No need to add it again

-- Add comments for documentation
COMMENT ON COLUMN audit_logs.epc_specific_data IS 'EPC-specific audit metadata stored as JSONB. Example: {"project_id": "uuid", "external_project": true, "milestone_id": "uuid", "crew_id": "uuid"}';
COMMENT ON COLUMN audit_logs.action_category IS 'Category of audit action: general (standard actions), epc_project (external project operations), epc_crew (crew coordination), epc_payment (funding operations), epc_milestone (milestone approvals)';

-- ==========================================
-- PERFORMANCE INDEXES
-- ==========================================

-- Partial index for EPC audit queries (only indexes EPC-related actions)
-- This index optimizes queries filtering by user_id, action_category, and created_at for EPC actions
CREATE INDEX idx_audit_logs_epc 
    ON audit_logs(user_id, action_category, created_at) 
    WHERE action_category LIKE 'epc_%';

-- Partial index for correlation tracking (only indexes rows with correlation_id)
-- This index optimizes queries tracing related actions across system components
CREATE INDEX idx_audit_logs_correlation 
    ON audit_logs(correlation_id) 
    WHERE correlation_id IS NOT NULL;

-- GIN index for efficient JSONB queries on epc_specific_data
CREATE INDEX idx_audit_logs_epc_specific_data 
    ON audit_logs USING GIN (epc_specific_data);

-- Composite index for EPC contractor audit queries (user + category + date)
CREATE INDEX idx_audit_logs_user_category_date 
    ON audit_logs(user_id, action_category, created_at DESC);

-- ==========================================
-- BACKWARD COMPATIBILITY
-- ==========================================

-- This migration is fully backward compatible:
-- - epc_specific_data defaults to empty JSON object for existing rows
-- - action_category defaults to 'general' for existing rows
-- - correlation_id already exists from migration 001
-- - No changes to existing RLS policies or triggers
-- - Immutability triggers (prevent_audit_logs_update, prevent_audit_logs_delete) remain active

-- ==========================================
-- DOWN MIGRATION (ROLLBACK)
-- ==========================================

-- To rollback this migration, run the following:
-- DROP INDEX IF EXISTS idx_audit_logs_user_category_date;
-- DROP INDEX IF EXISTS idx_audit_logs_epc_specific_data;
-- DROP INDEX IF EXISTS idx_audit_logs_correlation;
-- DROP INDEX IF EXISTS idx_audit_logs_epc;
-- ALTER TABLE audit_logs DROP COLUMN IF EXISTS action_category;
-- ALTER TABLE audit_logs DROP COLUMN IF EXISTS epc_specific_data;
