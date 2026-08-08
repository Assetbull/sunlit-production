-- 007_extend_payments_for_epc_funding.sql
-- Description: Extend payments table for EPC funding source tracking
-- Feature: EPC Dashboard Enterprise System
-- Task: 1.6 Extend payments table for EPC funding source tracking
-- Requirements: 7.1, 10.1

-- ==========================================
-- UP MIGRATION
-- ==========================================

-- Add EPC-specific columns to payments table
-- These columns enable tracking of payment funding sources and EPC-specific payment metadata

-- Add funding_source column to distinguish between client-funded and EPC-funded payments
ALTER TABLE payments 
ADD COLUMN funding_source VARCHAR(20) DEFAULT 'client' NOT NULL 
    CHECK (funding_source IN ('client', 'epc_funded'));

-- Add epc_funding_details column for storing EPC-related payment metadata
ALTER TABLE payments 
ADD COLUMN epc_funding_details JSONB DEFAULT '{}' NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN payments.funding_source IS 'Source of payment funding: client (standard marketplace payment) or epc_funded (payment funded by EPC contractor for external projects)';
COMMENT ON COLUMN payments.epc_funding_details IS 'EPC-specific payment metadata stored as JSONB. Example: {"epc_contractor_id": "uuid", "external_project_id": "uuid", "milestone_id": "uuid", "commission_rate": 0.05, "escrow_mode": "full"}';

-- ==========================================
-- PERFORMANCE INDEXES
-- ==========================================

-- Index for EPC-funded payment queries
-- This index optimizes queries filtering by funding_source and status
CREATE INDEX idx_payments_funding_source 
    ON payments(funding_source, status);

-- Partial index for EPC-funded payments only
-- This index optimizes queries specifically for EPC-funded payments
CREATE INDEX idx_payments_epc_funded 
    ON payments(user_id, created_at DESC) 
    WHERE funding_source = 'epc_funded';

-- GIN index for efficient JSONB queries on epc_funding_details
CREATE INDEX idx_payments_epc_funding_details 
    ON payments USING GIN (epc_funding_details);

-- Composite index for EPC contractor payment queries
CREATE INDEX idx_payments_epc_contractor 
    ON payments((epc_funding_details->>'epc_contractor_id'), status, created_at DESC) 
    WHERE funding_source = 'epc_funded';

-- ==========================================
-- BACKWARD COMPATIBILITY
-- ==========================================

-- This migration is fully backward compatible:
-- - funding_source defaults to 'client' for existing rows
-- - epc_funding_details defaults to empty JSON object for existing rows
-- - No changes to existing RLS policies or triggers
-- - Existing payment workflows continue to work without modification
-- - The updated_at trigger (set_payments_updated_at) remains active

-- ==========================================
-- DOWN MIGRATION (ROLLBACK)
-- ==========================================

-- To rollback this migration, run the following:
-- DROP INDEX IF EXISTS idx_payments_epc_contractor;
-- DROP INDEX IF EXISTS idx_payments_epc_funding_details;
-- DROP INDEX IF EXISTS idx_payments_epc_funded;
-- DROP INDEX IF EXISTS idx_payments_funding_source;
-- ALTER TABLE payments DROP COLUMN IF EXISTS epc_funding_details;
-- ALTER TABLE payments DROP COLUMN IF EXISTS funding_source;
