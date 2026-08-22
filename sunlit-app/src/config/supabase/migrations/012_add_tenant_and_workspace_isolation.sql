-- 012_add_tenant_and_workspace_isolation.sql
-- Description: Adds three-dimensional tenant & workspace isolation columns and indexes.
-- Conforms to: ORGANIZATION_ISOLATION_OS.md, WORKSPACE_KERNEL.md, DATABASE_ENGINE_OS.md.
--
-- Security Properties:
-- 1. Explicit multi-tenant scoping via organization_id and workspace_id.
-- 2. Performance indexes on organization_id and workspace_id for sub-second query latency.
-- 3. Additive and backward compatible (nullable columns with progressive enforcement).

-- ======================================================================
-- 1. ADD ISOLATION COLUMNS TO CORE DOMAIN TABLES
-- ======================================================================

-- PROJECTS
ALTER TABLE projects ADD COLUMN IF NOT EXISTS organization_id UUID;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS workspace_id UUID;

-- RFQS
ALTER TABLE rfqs ADD COLUMN IF NOT EXISTS organization_id UUID;
ALTER TABLE rfqs ADD COLUMN IF NOT EXISTS workspace_id UUID;

-- BIDS
ALTER TABLE bids ADD COLUMN IF NOT EXISTS organization_id UUID;
ALTER TABLE bids ADD COLUMN IF NOT EXISTS workspace_id UUID;

-- MILESTONES
ALTER TABLE milestones ADD COLUMN IF NOT EXISTS organization_id UUID;
ALTER TABLE milestones ADD COLUMN IF NOT EXISTS workspace_id UUID;

-- ESCROW
ALTER TABLE escrow ADD COLUMN IF NOT EXISTS organization_id UUID;
ALTER TABLE escrow ADD COLUMN IF NOT EXISTS workspace_id UUID;

-- PAYMENTS
ALTER TABLE payments ADD COLUMN IF NOT EXISTS organization_id UUID;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS workspace_id UUID;

-- DISPUTES
ALTER TABLE disputes ADD COLUMN IF NOT EXISTS organization_id UUID;
ALTER TABLE disputes ADD COLUMN IF NOT EXISTS workspace_id UUID;

-- KYC_RECORDS
ALTER TABLE kyc_records ADD COLUMN IF NOT EXISTS organization_id UUID;
ALTER TABLE kyc_records ADD COLUMN IF NOT EXISTS workspace_id UUID;

-- SUBSCRIPTIONS
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS organization_id UUID;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS workspace_id UUID;

-- CONTRACTS (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'contracts') THEN
        ALTER TABLE contracts ADD COLUMN IF NOT EXISTS organization_id UUID;
        ALTER TABLE contracts ADD COLUMN IF NOT EXISTS workspace_id UUID;
    END IF;
END $$;

-- CREW_JOBS (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'crew_jobs') THEN
        ALTER TABLE crew_jobs ADD COLUMN IF NOT EXISTS organization_id UUID;
        ALTER TABLE crew_jobs ADD COLUMN IF NOT EXISTS workspace_id UUID;
    END IF;
END $$;

-- CREW_APPLICATIONS (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'crew_applications') THEN
        ALTER TABLE crew_applications ADD COLUMN IF NOT EXISTS organization_id UUID;
        ALTER TABLE crew_applications ADD COLUMN IF NOT EXISTS workspace_id UUID;
    END IF;
END $$;

-- CREW_ASSIGNMENTS (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'crew_assignments') THEN
        ALTER TABLE crew_assignments ADD COLUMN IF NOT EXISTS organization_id UUID;
        ALTER TABLE crew_assignments ADD COLUMN IF NOT EXISTS workspace_id UUID;
    END IF;
END $$;

-- REVIEWS (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'reviews') THEN
        ALTER TABLE reviews ADD COLUMN IF NOT EXISTS organization_id UUID;
        ALTER TABLE reviews ADD COLUMN IF NOT EXISTS workspace_id UUID;
    END IF;
END $$;

-- MESSAGES (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'messages') THEN
        ALTER TABLE messages ADD COLUMN IF NOT EXISTS organization_id UUID;
        ALTER TABLE messages ADD COLUMN IF NOT EXISTS workspace_id UUID;
    END IF;
END $$;

-- AUDIT_LOGS
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS organization_id UUID;
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS workspace_id UUID;

-- ======================================================================
-- 2. CREATE HIGH-PERFORMANCE TENANT & WORKSPACE INDEXES
-- ======================================================================

CREATE INDEX IF NOT EXISTS idx_projects_org_workspace ON projects(organization_id, workspace_id);
CREATE INDEX IF NOT EXISTS idx_projects_org_created ON projects(organization_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_rfqs_org_workspace ON rfqs(organization_id, workspace_id);
CREATE INDEX IF NOT EXISTS idx_bids_org_workspace ON bids(organization_id, workspace_id);
CREATE INDEX IF NOT EXISTS idx_milestones_org_workspace ON milestones(organization_id, workspace_id);
CREATE INDEX IF NOT EXISTS idx_escrow_org_workspace ON escrow(organization_id, workspace_id);
CREATE INDEX IF NOT EXISTS idx_payments_org_workspace ON payments(organization_id, workspace_id);
CREATE INDEX IF NOT EXISTS idx_disputes_org_workspace ON disputes(organization_id, workspace_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_org_created ON audit_logs(organization_id, created_at DESC);

-- ======================================================================
-- 3. ROW LEVEL SECURITY (RLS) HELPER FUNCTIONS
-- ======================================================================

-- Helper to extract requesting user's organization from JWT claim or auth context
CREATE OR REPLACE FUNCTION current_organization_id()
RETURNS UUID AS $$
BEGIN
    RETURN NULLIF(current_setting('request.jwt.claim.organization_id', true), '')::UUID;
EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public, pg_temp;

-- Helper to extract requesting user's workspace from JWT claim or auth context
CREATE OR REPLACE FUNCTION current_workspace_id()
RETURNS UUID AS $$
BEGIN
    RETURN NULLIF(current_setting('request.jwt.claim.workspace_id', true), '')::UUID;
EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public, pg_temp;
