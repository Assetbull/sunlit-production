-- 002_add_enhanced_permissions_to_roles_rollback.sql
-- Description: Rollback script for migration 002
-- This script removes the enhanced_permissions column from the roles table

-- ==========================================
-- ROLLBACK MIGRATION
-- ==========================================

-- Drop the GIN index on enhanced_permissions
DROP INDEX IF EXISTS idx_roles_enhanced_permissions;

-- Remove the enhanced_permissions column from roles table
ALTER TABLE roles DROP COLUMN IF EXISTS enhanced_permissions;
