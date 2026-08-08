-- 010_create_crewlink_tables.sql
-- Description: Create CrewLink tables for labor marketplace functionality
-- Feature: EPC Dashboard Enterprise System
-- Task: 10.1 Extend CrewLink job posting for project assignment
-- Requirements: 6.1, 6.2

-- ==========================================
-- 1. ENUM TYPES FOR CREWLINK
-- ==========================================

CREATE TYPE crew_job_status AS ENUM (
    'draft', 'published', 'assigned', 'in_progress', 'completed', 'closed'
);

CREATE TYPE crew_application_status AS ENUM (
    'pending', 'reviewed', 'accepted', 'rejected', 'withdrawn'
);

-- ==========================================
-- 2. CREWLINK TABLES
-- ==========================================

-- CREW_JOBS - Job postings for crew members
CREATE TABLE crew_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    posted_by UUID REFERENCES users(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location_state VARCHAR(100),
    location_city VARCHAR(100),
    required_skills TEXT[], -- Array of skill requirements
    pay_rate NUMERIC, -- Hourly or daily rate
    pay_type VARCHAR(20) DEFAULT 'hourly' CHECK (pay_type IN ('hourly', 'daily', 'fixed')),
    estimated_duration_days INTEGER,
    status crew_job_status DEFAULT 'draft',
    
    -- EPC Enhancement: Project assignment and milestone integration
    project_assignment UUID REFERENCES projects(id) ON DELETE SET NULL, -- For EPC external projects
    milestone_integration JSONB DEFAULT '{}', -- Milestone-specific assignments
    crew_coordination_config JSONB DEFAULT '{}', -- Multi-crew coordination settings
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- CREW_APPLICATIONS - Applications from crew members for jobs
CREATE TABLE crew_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES crew_jobs(id) ON DELETE CASCADE,
    applicant_id UUID REFERENCES users(id) ON DELETE RESTRICT,
    cover_note TEXT,
    proposed_rate NUMERIC, -- Counter-offer rate if different from job posting
    availability_start DATE,
    availability_end DATE,
    status crew_application_status DEFAULT 'pending',
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(job_id, applicant_id) -- Prevent duplicate applications
);

-- CREW_ASSIGNMENTS - Accepted crew assignments (links jobs to crew members)
CREATE TABLE crew_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES crew_jobs(id) ON DELETE CASCADE,
    crew_member_id UUID REFERENCES users(id) ON DELETE RESTRICT,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES users(id) ON DELETE RESTRICT,
    
    -- Assignment details
    agreed_rate NUMERIC NOT NULL,
    start_date DATE,
    end_date DATE,
    
    -- Work tracking
    hours_logged NUMERIC DEFAULT 0,
    work_status VARCHAR(20) DEFAULT 'assigned' CHECK (work_status IN ('assigned', 'active', 'completed', 'cancelled')),
    completion_notes TEXT,
    
    -- Performance tracking
    quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
    timeliness_rating INTEGER CHECK (timeliness_rating >= 1 AND timeliness_rating <= 5),
    communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    UNIQUE(job_id, crew_member_id) -- One assignment per crew member per job
);

-- ==========================================
-- 3. PERFORMANCE INDEXES
-- ==========================================

-- Crew Jobs indexes
CREATE INDEX idx_crew_jobs_project_id ON crew_jobs(project_id);
CREATE INDEX idx_crew_jobs_posted_by ON crew_jobs(posted_by);
CREATE INDEX idx_crew_jobs_status ON crew_jobs(status);
CREATE INDEX idx_crew_jobs_location ON crew_jobs(location_state, location_city);
CREATE INDEX idx_crew_jobs_project_assignment ON crew_jobs(project_assignment) WHERE project_assignment IS NOT NULL;

-- Crew Applications indexes
CREATE INDEX idx_crew_applications_job_id ON crew_applications(job_id);
CREATE INDEX idx_crew_applications_applicant_id ON crew_applications(applicant_id);
CREATE INDEX idx_crew_applications_status ON crew_applications(status);

-- Crew Assignments indexes
CREATE INDEX idx_crew_assignments_job_id ON crew_assignments(job_id);
CREATE INDEX idx_crew_assignments_crew_member_id ON crew_assignments(crew_member_id);
CREATE INDEX idx_crew_assignments_project_id ON crew_assignments(project_id);
CREATE INDEX idx_crew_assignments_assigned_by ON crew_assignments(assigned_by);
CREATE INDEX idx_crew_assignments_work_status ON crew_assignments(work_status);

-- ==========================================
-- 4. AUTO-UPDATE TRIGGERS
-- ==========================================

CREATE TRIGGER set_crew_jobs_updated_at 
    BEFORE UPDATE ON crew_jobs 
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_crew_applications_updated_at 
    BEFORE UPDATE ON crew_applications 
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_crew_assignments_updated_at 
    BEFORE UPDATE ON crew_assignments 
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ==========================================
-- 5. ROW-LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all CrewLink tables
ALTER TABLE crew_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE crew_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE crew_assignments ENABLE ROW LEVEL SECURITY;

-- Crew Jobs RLS Policies
CREATE POLICY "Users can view published crew jobs" ON crew_jobs
    FOR SELECT USING (status = 'published');

CREATE POLICY "Job posters can manage their own jobs" ON crew_jobs
    FOR ALL USING (posted_by = auth.uid());

CREATE POLICY "EPC contractors can manage jobs for their external projects" ON crew_jobs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM projects p 
            WHERE p.id = project_assignment 
            AND p.creator_id = auth.uid() 
            AND p.project_source = 'external'
        )
    );

-- Crew Applications RLS Policies
CREATE POLICY "Applicants can manage their own applications" ON crew_applications
    FOR ALL USING (applicant_id = auth.uid());

CREATE POLICY "Job posters can view applications for their jobs" ON crew_applications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM crew_jobs cj 
            WHERE cj.id = job_id 
            AND cj.posted_by = auth.uid()
        )
    );

CREATE POLICY "Job posters can update application status" ON crew_applications
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM crew_jobs cj 
            WHERE cj.id = job_id 
            AND cj.posted_by = auth.uid()
        )
    );

-- Crew Assignments RLS Policies
CREATE POLICY "Crew members can view their own assignments" ON crew_assignments
    FOR SELECT USING (crew_member_id = auth.uid());

CREATE POLICY "Assigners can manage assignments they created" ON crew_assignments
    FOR ALL USING (assigned_by = auth.uid());

CREATE POLICY "Project owners can view assignments for their projects" ON crew_assignments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects p 
            WHERE p.id = project_id 
            AND (p.owner_id = auth.uid() OR p.creator_id = auth.uid())
        )
    );

-- Default deny-all policies for public access
CREATE POLICY "Deny all public access to crew_jobs" ON crew_jobs FOR ALL USING (false);
CREATE POLICY "Deny all public access to crew_applications" ON crew_applications FOR ALL USING (false);
CREATE POLICY "Deny all public access to crew_assignments" ON crew_assignments FOR ALL USING (false);

-- ==========================================
-- 6. VALIDATION CONSTRAINTS
-- ==========================================

-- Ensure pay_rate is positive
ALTER TABLE crew_jobs ADD CONSTRAINT crew_jobs_pay_rate_positive 
    CHECK (pay_rate IS NULL OR pay_rate > 0);

ALTER TABLE crew_applications ADD CONSTRAINT crew_applications_proposed_rate_positive 
    CHECK (proposed_rate IS NULL OR proposed_rate > 0);

ALTER TABLE crew_assignments ADD CONSTRAINT crew_assignments_agreed_rate_positive 
    CHECK (agreed_rate > 0);

-- Ensure date ranges are logical
ALTER TABLE crew_applications ADD CONSTRAINT crew_applications_date_range_valid 
    CHECK (availability_start IS NULL OR availability_end IS NULL OR availability_start <= availability_end);

ALTER TABLE crew_assignments ADD CONSTRAINT crew_assignments_date_range_valid 
    CHECK (start_date IS NULL OR end_date IS NULL OR start_date <= end_date);

-- Ensure hours_logged is non-negative
ALTER TABLE crew_assignments ADD CONSTRAINT crew_assignments_hours_logged_non_negative 
    CHECK (hours_logged >= 0);

-- ==========================================
-- 7. COMMENTS FOR DOCUMENTATION
-- ==========================================

COMMENT ON TABLE crew_jobs IS 'Job postings for crew members in the labor marketplace';
COMMENT ON COLUMN crew_jobs.project_assignment IS 'EPC Enhancement: Links job to specific external project for multi-crew coordination';
COMMENT ON COLUMN crew_jobs.milestone_integration IS 'EPC Enhancement: JSONB configuration for milestone-specific crew assignments';
COMMENT ON COLUMN crew_jobs.crew_coordination_config IS 'EPC Enhancement: Configuration for coordinating multiple crews on single projects';

COMMENT ON TABLE crew_applications IS 'Applications from crew members for posted jobs';
COMMENT ON TABLE crew_assignments IS 'Accepted crew assignments linking jobs to crew members with performance tracking';

COMMENT ON COLUMN crew_assignments.quality_rating IS 'Quality of work rating (1-5 scale)';
COMMENT ON COLUMN crew_assignments.timeliness_rating IS 'Timeliness rating (1-5 scale)';
COMMENT ON COLUMN crew_assignments.communication_rating IS 'Communication rating (1-5 scale)';