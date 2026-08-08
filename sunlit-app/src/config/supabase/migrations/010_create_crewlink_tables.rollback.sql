-- 010_create_crewlink_tables.rollback.sql
-- Description: Rollback CrewLink tables creation
-- Feature: EPC Dashboard Enterprise System
-- Task: 10.1 Extend CrewLink job posting for project assignment

-- ==========================================
-- 1. DROP TABLES (in reverse dependency order)
-- ==========================================

-- Drop crew assignments first (has foreign keys to crew_jobs)
DROP TABLE IF EXISTS crew_assignments CASCADE;

-- Drop crew applications (has foreign key to crew_jobs)
DROP TABLE IF EXISTS crew_applications CASCADE;

-- Drop crew jobs
DROP TABLE IF EXISTS crew_jobs CASCADE;

-- ==========================================
-- 2. DROP ENUM TYPES
-- ==========================================

DROP TYPE IF EXISTS crew_application_status CASCADE;
DROP TYPE IF EXISTS crew_job_status CASCADE;

-- ==========================================
-- 3. VERIFICATION
-- ==========================================

-- Verify tables are dropped
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name IN ('crew_jobs', 'crew_applications', 'crew_assignments')) THEN
        RAISE EXCEPTION 'CrewLink tables still exist after rollback';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname IN ('crew_job_status', 'crew_application_status')) THEN
        RAISE EXCEPTION 'CrewLink enum types still exist after rollback';
    END IF;
    
    RAISE NOTICE 'CrewLink tables rollback completed successfully';
END $$;