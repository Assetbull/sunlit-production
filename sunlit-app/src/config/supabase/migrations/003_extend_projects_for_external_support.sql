-- 003_extend_projects_for_external_support.sql
-- Description: Extend projects table to support external projects created by EPC contractors
-- Feature: EPC Dashboard Enterprise System
-- Task: 1.2 Extend projects table for external project support
-- Requirements: 4.1, 4.2, 5.1

-- ==========================================
-- UP MIGRATION
-- ==========================================

-- Add columns to support external projects
-- project_source: Distinguishes between marketplace and external projects
ALTER TABLE projects 
ADD COLUMN project_source VARCHAR(20) DEFAULT 'marketplace' NOT NULL 
CHECK (project_source IN ('marketplace', 'external'));

-- creator_id: References the EPC contractor who created the external project
ALTER TABLE projects 
ADD COLUMN creator_id UUID REFERENCES users(id) ON DELETE RESTRICT;

-- approval_authority: Determines who can approve milestones
ALTER TABLE projects 
ADD COLUMN approval_authority VARCHAR(20) DEFAULT 'project_owner' NOT NULL 
CHECK (approval_authority IN ('project_owner', 'epc_contractor'));

-- custom_milestone_schedule: Stores custom milestone definitions for external projects
ALTER TABLE projects 
ADD COLUMN custom_milestone_schedule JSONB DEFAULT '{}' NOT NULL;

-- funding_source: Tracks whether project is client-funded or EPC-funded
ALTER TABLE projects 
ADD COLUMN funding_source VARCHAR(20) DEFAULT 'client' NOT NULL 
CHECK (funding_source IN ('client', 'epc_funded'));

-- Add comments for documentation
COMMENT ON COLUMN projects.project_source IS 'Source of the project: marketplace (from RFQ) or external (created by EPC contractor)';
COMMENT ON COLUMN projects.creator_id IS 'EPC contractor who created the external project. NULL for marketplace projects.';
COMMENT ON COLUMN projects.approval_authority IS 'Who has authority to approve milestones: project_owner or epc_contractor';
COMMENT ON COLUMN projects.custom_milestone_schedule IS 'Custom milestone definitions for external projects. Example: [{"name": "Foundation", "percentage": 30, "criteria": ["Site prepared", "Foundation poured"]}]';
COMMENT ON COLUMN projects.funding_source IS 'Source of project funding: client (project owner) or epc_funded (EPC contractor funded)';

-- Create partial index for efficient EPC external project queries
-- This index only includes external projects, reducing index size and improving query performance
CREATE INDEX idx_projects_epc_external 
ON projects(creator_id, project_source) 
WHERE project_source = 'external';

-- Create index for approval authority queries
CREATE INDEX idx_projects_approval_authority 
ON projects(approval_authority, creator_id) 
WHERE approval_authority = 'epc_contractor';

-- ==========================================
-- DATA MIGRATION
-- ==========================================

-- Ensure all existing projects have proper defaults
-- This is defensive - the DEFAULT clauses should handle this, but we verify explicitly
UPDATE projects 
SET 
    project_source = 'marketplace',
    approval_authority = 'project_owner',
    custom_milestone_schedule = '{}',
    funding_source = 'client'
WHERE project_source IS NULL 
   OR approval_authority IS NULL 
   OR custom_milestone_schedule IS NULL 
   OR funding_source IS NULL;

-- ==========================================
-- DOWN MIGRATION (ROLLBACK)
-- ==========================================

-- To rollback this migration, run the following:
-- DROP INDEX IF EXISTS idx_projects_approval_authority;
-- DROP INDEX IF EXISTS idx_projects_epc_external;
-- ALTER TABLE projects DROP COLUMN IF EXISTS funding_source;
-- ALTER TABLE projects DROP COLUMN IF EXISTS custom_milestone_schedule;
-- ALTER TABLE projects DROP COLUMN IF EXISTS approval_authority;
-- ALTER TABLE projects DROP COLUMN IF EXISTS creator_id;
-- ALTER TABLE projects DROP COLUMN IF EXISTS project_source;
