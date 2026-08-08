-- 004_create_crew_project_assignments_table.sql
-- Description: Create crew_project_assignments table for multi-crew coordination
-- Feature: EPC Dashboard Enterprise System
-- Task: 1.3 Create crew_project_assignments table for multi-crew coordination
-- Requirements: 6.1, 8.1

-- ==========================================
-- UP MIGRATION
-- ==========================================

-- Create crew_project_assignments table for tracking crew assignments to projects
-- This table enables EPC contractors to coordinate multiple crews on single projects
CREATE TABLE crew_project_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    crew_id UUID REFERENCES users(id) ON DELETE RESTRICT NOT NULL,
    milestone_assignments JSONB DEFAULT '{}' NOT NULL,
    assignment_status VARCHAR(20) DEFAULT 'assigned' NOT NULL 
        CHECK (assignment_status IN ('assigned', 'active', 'completed', 'cancelled')),
    performance_metrics JSONB DEFAULT '{}' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, crew_id)
);

-- Add trigger for automatic updated_at timestamp
CREATE TRIGGER set_crew_project_assignments_updated_at 
    BEFORE UPDATE ON crew_project_assignments 
    FOR EACH ROW 
    EXECUTE FUNCTION trigger_set_updated_at();

-- Add comments for documentation
COMMENT ON TABLE crew_project_assignments IS 'Tracks crew assignments to projects for multi-crew coordination by EPC contractors';
COMMENT ON COLUMN crew_project_assignments.project_id IS 'Reference to the project this crew is assigned to';
COMMENT ON COLUMN crew_project_assignments.crew_id IS 'Reference to the crew (user with crewlink role) assigned to the project';
COMMENT ON COLUMN crew_project_assignments.milestone_assignments IS 'JSONB mapping of milestone IDs to crew responsibilities. Example: {"milestone_id_1": {"tasks": ["Foundation", "Electrical"], "start_date": "2024-01-15"}}';
COMMENT ON COLUMN crew_project_assignments.assignment_status IS 'Current status of the crew assignment: assigned (scheduled), active (working), completed (finished), cancelled (terminated)';
COMMENT ON COLUMN crew_project_assignments.performance_metrics IS 'JSONB tracking crew performance metrics. Example: {"completion_rate": 95, "quality_score": 4.5, "on_time_delivery": true}';

-- ==========================================
-- PERFORMANCE INDEXES
-- ==========================================

-- Index for querying assignments by project (most common query pattern)
CREATE INDEX idx_crew_project_assignments_project_id 
    ON crew_project_assignments(project_id);

-- Index for querying assignments by crew
CREATE INDEX idx_crew_project_assignments_crew_id 
    ON crew_project_assignments(crew_id);

-- Index for querying active assignments (for dashboard and coordination views)
CREATE INDEX idx_crew_project_assignments_status 
    ON crew_project_assignments(assignment_status) 
    WHERE assignment_status IN ('assigned', 'active');

-- Composite index for EPC contractor queries (project + status)
CREATE INDEX idx_crew_project_assignments_project_status 
    ON crew_project_assignments(project_id, assignment_status);

-- GIN index for efficient JSONB queries on milestone assignments
CREATE INDEX idx_crew_project_assignments_milestone_assignments 
    ON crew_project_assignments USING GIN (milestone_assignments);

-- GIN index for efficient JSONB queries on performance metrics
CREATE INDEX idx_crew_project_assignments_performance_metrics 
    ON crew_project_assignments USING GIN (performance_metrics);

-- ==========================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on crew_project_assignments table
ALTER TABLE crew_project_assignments ENABLE ROW LEVEL SECURITY;

-- Policy: EPC contractors can manage crew assignments for their external projects
CREATE POLICY "EPC contractors can manage their project crew assignments" 
    ON crew_project_assignments
    FOR ALL 
    USING (
        -- Allow access if user is the creator of an external project
        EXISTS (
            SELECT 1 FROM projects p 
            WHERE p.id = crew_project_assignments.project_id 
            AND p.creator_id = auth.uid() 
            AND p.project_source = 'external'
        )
        OR
        -- Allow access if user is the installer on a marketplace project
        EXISTS (
            SELECT 1 FROM projects p 
            WHERE p.id = crew_project_assignments.project_id 
            AND p.installer_id = auth.uid()
        )
        OR
        -- Allow access if user is the assigned crew member
        crew_project_assignments.crew_id = auth.uid()
    );

-- Policy: Project owners can view crew assignments for their projects
CREATE POLICY "Project owners can view crew assignments" 
    ON crew_project_assignments
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM projects p 
            WHERE p.id = crew_project_assignments.project_id 
            AND p.owner_id = auth.uid()
        )
    );

-- Default deny-all policy for public access (following existing pattern)
CREATE POLICY "Deny all public access to crew_project_assignments" 
    ON crew_project_assignments 
    FOR ALL 
    USING (false);

-- ==========================================
-- DATA VALIDATION
-- ==========================================

-- Ensure crew_id references a user with crewlink role (optional constraint)
-- This is enforced at the application layer, but we document it here
-- The application should validate that crew_id has 'crewlink' role before insertion

-- ==========================================
-- DOWN MIGRATION (ROLLBACK)
-- ==========================================

-- To rollback this migration, run the following:
-- DROP POLICY IF EXISTS "Deny all public access to crew_project_assignments" ON crew_project_assignments;
-- DROP POLICY IF EXISTS "Project owners can view crew assignments" ON crew_project_assignments;
-- DROP POLICY IF EXISTS "EPC contractors can manage their project crew assignments" ON crew_project_assignments;
-- DROP INDEX IF EXISTS idx_crew_project_assignments_performance_metrics;
-- DROP INDEX IF EXISTS idx_crew_project_assignments_milestone_assignments;
-- DROP INDEX IF EXISTS idx_crew_project_assignments_project_status;
-- DROP INDEX IF EXISTS idx_crew_project_assignments_status;
-- DROP INDEX IF EXISTS idx_crew_project_assignments_crew_id;
-- DROP INDEX IF EXISTS idx_crew_project_assignments_project_id;
-- DROP TRIGGER IF EXISTS set_crew_project_assignments_updated_at ON crew_project_assignments;
-- DROP TABLE IF EXISTS crew_project_assignments;
