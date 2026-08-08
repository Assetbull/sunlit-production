-- 002_add_enhanced_permissions_to_roles.sql
-- Description: Extend roles table with enhanced_permissions JSONB column for EPC-specific permissions
-- Feature: EPC Dashboard Enterprise System
-- Task: 1.1 Extend roles table with enhanced_permissions JSONB column
-- Requirements: 1.1, 1.3

-- ==========================================
-- UP MIGRATION
-- ==========================================

-- Add enhanced_permissions column to roles table
-- This column stores EPC-specific permissions as JSONB
-- Example: {"create:project": true, "approve:milestone": true, "fund:payment": true}
ALTER TABLE roles 
ADD COLUMN enhanced_permissions JSONB DEFAULT '{}' NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN roles.enhanced_permissions IS 'EPC-specific permissions stored as JSONB. Example: {"create:project": true, "approve:milestone": true, "fund:payment": true, "view:audit_logs": true, "manage:external_projects": true, "coordinate:multi_crew": true}';

-- Create index for efficient querying of enhanced permissions
CREATE INDEX idx_roles_enhanced_permissions ON roles USING GIN (enhanced_permissions);

-- ==========================================
-- DOWN MIGRATION (ROLLBACK)
-- ==========================================

-- To rollback this migration, run the following:
-- DROP INDEX IF EXISTS idx_roles_enhanced_permissions;
-- ALTER TABLE roles DROP COLUMN IF EXISTS enhanced_permissions;
