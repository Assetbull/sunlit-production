-- 005_create_epc_project_funding_table.sql
-- Description: Create epc_project_funding table for payment tracking
-- Feature: EPC Dashboard Enterprise System
-- Task: 1.4 Create epc_project_funding table for payment tracking
-- Requirements: 7.1, 10.1

-- ==========================================
-- UP MIGRATION
-- ==========================================

-- Create epc_project_funding table for tracking EPC contractor funding of external projects
-- This table enables EPC contractors to fund their external projects through the escrow system
CREATE TABLE epc_project_funding (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    epc_contractor_id UUID REFERENCES users(id) ON DELETE RESTRICT NOT NULL,
    funding_amount DECIMAL(15,2) NOT NULL CHECK (funding_amount > 0),
    escrow_status VARCHAR(20) DEFAULT 'pending' NOT NULL 
        CHECK (escrow_status IN ('pending', 'locked', 'released', 'disputed')),
    milestone_schedule JSONB NOT NULL,
    commission_agreement JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id)
);

-- Add trigger for automatic updated_at timestamp
CREATE TRIGGER set_epc_project_funding_updated_at 
    BEFORE UPDATE ON epc_project_funding 
    FOR EACH ROW 
    EXECUTE FUNCTION trigger_set_updated_at();

-- Add comments for documentation
COMMENT ON TABLE epc_project_funding IS 'Tracks EPC contractor funding for external projects with escrow management';
COMMENT ON COLUMN epc_project_funding.project_id IS 'Reference to the external project being funded (one funding record per project)';
COMMENT ON COLUMN epc_project_funding.epc_contractor_id IS 'Reference to the EPC contractor providing the funding';
COMMENT ON COLUMN epc_project_funding.funding_amount IS 'Total funding amount in NGN (must be positive)';
COMMENT ON COLUMN epc_project_funding.escrow_status IS 'Current escrow status: pending (awaiting lock), locked (in escrow), released (paid out), disputed (under dispute)';
COMMENT ON COLUMN epc_project_funding.milestone_schedule IS 'JSONB mapping of milestones to payment amounts. Example: [{"milestone_id": "uuid", "percentage": 30, "amount": 1500000.00, "status": "pending"}]';
COMMENT ON COLUMN epc_project_funding.commission_agreement IS 'JSONB defining commission structure. Example: {"platform_commission": 5, "crew_commission": 10, "payment_terms": "net_30"}';

-- ==========================================
-- PERFORMANCE INDEXES
-- ==========================================

-- Index for querying funding by EPC contractor (most common query pattern)
CREATE INDEX idx_epc_project_funding_contractor_id 
    ON epc_project_funding(epc_contractor_id);

-- Index for querying funding by escrow status (for financial dashboards)
CREATE INDEX idx_epc_project_funding_escrow_status 
    ON epc_project_funding(escrow_status) 
    WHERE escrow_status IN ('pending', 'locked');

-- Composite index for EPC contractor queries (contractor + status)
CREATE INDEX idx_epc_project_funding_contractor_status 
    ON epc_project_funding(epc_contractor_id, escrow_status);

-- GIN index for efficient JSONB queries on milestone schedule
CREATE INDEX idx_epc_project_funding_milestone_schedule 
    ON epc_project_funding USING GIN (milestone_schedule);

-- GIN index for efficient JSONB queries on commission agreement
CREATE INDEX idx_epc_project_funding_commission_agreement 
    ON epc_project_funding USING GIN (commission_agreement);

-- Index for funding amount range queries (for financial reporting)
CREATE INDEX idx_epc_project_funding_amount 
    ON epc_project_funding(funding_amount);

-- ==========================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on epc_project_funding table
ALTER TABLE epc_project_funding ENABLE ROW LEVEL SECURITY;

-- Policy: EPC contractors can manage their own funding records
CREATE POLICY "EPC contractors can manage their own funding" 
    ON epc_project_funding
    FOR ALL 
    USING (epc_contractor_id = auth.uid());

-- Policy: Project owners can view funding for their projects
CREATE POLICY "Project owners can view project funding" 
    ON epc_project_funding
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM projects p 
            WHERE p.id = epc_project_funding.project_id 
            AND p.owner_id = auth.uid()
        )
    );

-- Policy: Installers assigned to projects can view funding status
CREATE POLICY "Installers can view funding for their projects" 
    ON epc_project_funding
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM projects p 
            WHERE p.id = epc_project_funding.project_id 
            AND p.installer_id = auth.uid()
        )
    );

-- Default deny-all policy for public access (following existing pattern)
CREATE POLICY "Deny all public access to epc_project_funding" 
    ON epc_project_funding 
    FOR ALL 
    USING (false);

-- ==========================================
-- DATA VALIDATION
-- ==========================================

-- Ensure project_id references an external project (enforced at application layer)
-- The application should validate that project_id has project_source='external' before insertion

-- Ensure epc_contractor_id references a user with epc_contractor role (enforced at application layer)
-- The application should validate that epc_contractor_id has 'epc_contractor' role before insertion

-- Ensure milestone_schedule and commission_agreement have valid structure (enforced at application layer)
-- The application should validate JSONB structure before insertion

-- ==========================================
-- DOWN MIGRATION (ROLLBACK)
-- ==========================================

-- To rollback this migration, run the following:
-- DROP POLICY IF EXISTS "Deny all public access to epc_project_funding" ON epc_project_funding;
-- DROP POLICY IF EXISTS "Installers can view funding for their projects" ON epc_project_funding;
-- DROP POLICY IF EXISTS "Project owners can view project funding" ON epc_project_funding;
-- DROP POLICY IF EXISTS "EPC contractors can manage their own funding" ON epc_project_funding;
-- DROP INDEX IF EXISTS idx_epc_project_funding_amount;
-- DROP INDEX IF EXISTS idx_epc_project_funding_commission_agreement;
-- DROP INDEX IF EXISTS idx_epc_project_funding_milestone_schedule;
-- DROP INDEX IF EXISTS idx_epc_project_funding_contractor_status;
-- DROP INDEX IF EXISTS idx_epc_project_funding_escrow_status;
-- DROP INDEX IF EXISTS idx_epc_project_funding_contractor_id;
-- DROP TRIGGER IF EXISTS set_epc_project_funding_updated_at ON epc_project_funding;
-- DROP TABLE IF EXISTS epc_project_funding;
