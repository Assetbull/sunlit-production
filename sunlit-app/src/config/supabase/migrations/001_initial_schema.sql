-- 001_initial_schema.sql
-- Description: Core schema initialization for Sunlit Energy Marketplace
-- Enforces Row-Level Security (RLS) on all tables per GEMINI.md
-- H5 fix: Immutability constraints on audit/event tables
-- H7 fix: Auto-update trigger for updated_at columns

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. ENUM TYPES
-- ==========================================

CREATE TYPE user_role AS ENUM (
    'project_owner', 
    'installer', 
    'crewlink', 
    'epc_contractor', 
    'admin'
);

CREATE TYPE project_status AS ENUM (
    'draft', 'bidding', 'in_progress', 'completed', 'cancelled'
);

CREATE TYPE rfq_status AS ENUM (
    'open', 'matched', 'closed', 'expired'
);

CREATE TYPE bid_status AS ENUM (
    'submitted', 'accepted', 'rejected', 'withdrawn'
);

CREATE TYPE escrow_status AS ENUM (
    'pending', 'funded', 'held', 'released', 'disputed', 'refunded'
);

CREATE TYPE payment_status AS ENUM (
    'pending', 'successful', 'failed', 'refunded'
);

CREATE TYPE kyc_status AS ENUM (
    'pending', 'verified', 'rejected', 'needs_review'
);

CREATE TYPE subscription_tier AS ENUM (
    'free', 'pro', 'premium'
);

-- ==========================================
-- 2. HELPER FUNCTIONS
-- ==========================================

-- H7 fix: Auto-update trigger function for updated_at columns
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- H5 fix: Function to prevent UPDATE/DELETE on immutable tables
CREATE OR REPLACE FUNCTION prevent_modification()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Modifications to % are not allowed. This table is append-only.', TG_TABLE_NAME;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- 3. TABLES
-- ==========================================

-- USERS (Maps to Clerk users)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clerk_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone_number VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE TRIGGER set_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ROLES
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_name user_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, role_name)
);

-- KYC_RECORDS
CREATE TABLE kyc_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    status kyc_status DEFAULT 'pending',
    provider_reference VARCHAR(255),
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE TRIGGER set_kyc_records_updated_at BEFORE UPDATE ON kyc_records FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- PROJECTS
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES users(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location_state VARCHAR(100),
    location_city VARCHAR(100),
    status project_status DEFAULT 'draft',
    system_size_kw NUMERIC,
    installer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE TRIGGER set_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- RFQS (Request for Quotations)
CREATE TABLE rfqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE UNIQUE,
    status rfq_status DEFAULT 'open',
    budget_range_min NUMERIC,
    budget_range_max NUMERIC,
    timeline_days INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE TRIGGER set_rfqs_updated_at BEFORE UPDATE ON rfqs FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- BIDS
CREATE TABLE bids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfq_id UUID REFERENCES rfqs(id) ON DELETE CASCADE,
    installer_id UUID REFERENCES users(id) ON DELETE RESTRICT,
    amount NUMERIC NOT NULL,
    proposed_timeline_days INTEGER,
    proposal_text TEXT,
    status bid_status DEFAULT 'submitted',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(rfq_id, installer_id)
);
CREATE TRIGGER set_bids_updated_at BEFORE UPDATE ON bids FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- MILESTONES
CREATE TABLE milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    amount NUMERIC NOT NULL,
    position INTEGER DEFAULT 1,
    is_completed BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE TRIGGER set_milestones_updated_at BEFORE UPDATE ON milestones FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ESCROW
CREATE TABLE escrow (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE RESTRICT,
    milestone_id UUID REFERENCES milestones(id) ON DELETE RESTRICT,
    amount NUMERIC NOT NULL,
    status escrow_status DEFAULT 'pending',
    released_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(milestone_id)
);
CREATE TRIGGER set_escrow_updated_at BEFORE UPDATE ON escrow FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- PAYMENTS
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE RESTRICT,
    escrow_id UUID REFERENCES escrow(id) ON DELETE SET NULL,
    amount NUMERIC NOT NULL,
    currency VARCHAR(3) DEFAULT 'NGN',
    provider VARCHAR(50) NOT NULL,
    provider_reference VARCHAR(255) UNIQUE NOT NULL,
    status payment_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE TRIGGER set_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- DISPUTES
CREATE TABLE disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    escrow_id UUID REFERENCES escrow(id) ON DELETE CASCADE,
    raised_by UUID REFERENCES users(id) ON DELETE RESTRICT,
    reason TEXT NOT NULL,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE TRIGGER set_disputes_updated_at BEFORE UPDATE ON disputes FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- AUDIT_LOGS (Immutable — append-only)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action_type VARCHAR(100) NOT NULL,
    correlation_id UUID,
    payload_hash VARCHAR(255),
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- H5 fix: Prevent UPDATE and DELETE on audit_logs (immutability constraint)
CREATE TRIGGER prevent_audit_logs_update BEFORE UPDATE ON audit_logs FOR EACH ROW EXECUTE FUNCTION prevent_modification();
CREATE TRIGGER prevent_audit_logs_delete BEFORE DELETE ON audit_logs FOR EACH ROW EXECUTE FUNCTION prevent_modification();

-- EVENT_LOGS (Immutable — append-only)
CREATE TABLE event_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(100) NOT NULL,
    payload JSONB,
    emitted_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- H5 fix: Prevent UPDATE and DELETE on event_logs (immutability constraint)
CREATE TRIGGER prevent_event_logs_update BEFORE UPDATE ON event_logs FOR EACH ROW EXECUTE FUNCTION prevent_modification();
CREATE TRIGGER prevent_event_logs_delete BEFORE DELETE ON event_logs FOR EACH ROW EXECUTE FUNCTION prevent_modification();

-- SUBSCRIPTIONS
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    tier subscription_tier DEFAULT 'free',
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE TRIGGER set_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ==========================================
-- 4. PERFORMANCE INDEXES
-- ==========================================

CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_roles_user_id ON roles(user_id);
CREATE INDEX idx_projects_owner_id ON projects(owner_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_rfqs_project_id ON rfqs(project_id);
CREATE INDEX idx_rfqs_status ON rfqs(status);
CREATE INDEX idx_bids_rfq_id ON bids(rfq_id);
CREATE INDEX idx_bids_installer_id ON bids(installer_id);
CREATE INDEX idx_milestones_project_id ON milestones(project_id);
CREATE INDEX idx_escrow_project_id ON escrow(project_id);
CREATE INDEX idx_escrow_status ON escrow(status);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_provider_reference ON payments(provider_reference);
CREATE INDEX idx_disputes_project_id ON disputes(project_id);
CREATE INDEX idx_disputes_escrow_id ON disputes(escrow_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action_type ON audit_logs(action_type);
CREATE INDEX idx_audit_logs_correlation_id ON audit_logs(correlation_id);
CREATE INDEX idx_event_logs_event_type ON event_logs(event_type);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);

-- ==========================================
-- 5. ROW-LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on ALL tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrow ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_logs ENABLE ROW LEVEL SECURITY;

-- Default deny-all policies for ALL tables
-- The Node.js API layer uses the Service Role key which bypasses RLS.
-- These policies ensure that if the anon key is ever exposed, no data leaks.
CREATE POLICY "Deny all public access to users" ON users FOR ALL USING (false);
CREATE POLICY "Deny all public access to roles" ON roles FOR ALL USING (false);
CREATE POLICY "Deny all public access to kyc_records" ON kyc_records FOR ALL USING (false);
CREATE POLICY "Deny all public access to projects" ON projects FOR ALL USING (false);
CREATE POLICY "Deny all public access to rfqs" ON rfqs FOR ALL USING (false);
CREATE POLICY "Deny all public access to bids" ON bids FOR ALL USING (false);
CREATE POLICY "Deny all public access to milestones" ON milestones FOR ALL USING (false);
CREATE POLICY "Deny all public access to escrow" ON escrow FOR ALL USING (false);
CREATE POLICY "Deny all public access to payments" ON payments FOR ALL USING (false);
CREATE POLICY "Deny all public access to disputes" ON disputes FOR ALL USING (false);
CREATE POLICY "Deny all public access to subscriptions" ON subscriptions FOR ALL USING (false);
CREATE POLICY "Deny all public access to audit_logs" ON audit_logs FOR ALL USING (false);
CREATE POLICY "Deny all public access to event_logs" ON event_logs FOR ALL USING (false);
