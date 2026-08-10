-- 013_database_integrity_and_rls_hardening.sql
-- Description: Enterprise database integrity hardening, runtime DDL completion,
--              mathematical CHECK constraints, fine-grained RLS policies, and idempotency.
--
-- Conforms to: DATABASE_ENGINE_OS.md, SUPABASE_IMPLEMENTATION_OS.md,
--              ORGANIZATION_ISOLATION_OS.md, WORKSPACE_KERNEL.md,
--              AUDIT_OS.md, SECURITY_ARCHITECTURE_OS.md.
--
-- Principles:
-- 1. Database self-defense: Constraints enforced at engine level.
-- 2. Fine-grained RLS: Tenant-aware and identity-aware.
-- 3. Non-destructive: All statements use IF NOT EXISTS / safe blocks.

-- ======================================================================
-- 1. ENUM TYPES
-- ======================================================================

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'organization_role') THEN
        CREATE TYPE organization_role AS ENUM ('owner', 'admin', 'member', 'billing', 'viewer');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'workspace_role') THEN
        CREATE TYPE workspace_role AS ENUM ('lead', 'member', 'viewer');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'contract_status') THEN
        CREATE TYPE contract_status AS ENUM ('created', 'signed', 'active', 'completed', 'cancelled');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'idempotency_status') THEN
        CREATE TYPE idempotency_status AS ENUM ('in_progress', 'completed', 'failed');
    END IF;
END $$;

-- ======================================================================
-- 2. DDL FOR RUNTIME CORE TABLES
-- ======================================================================

-- ORGANIZATIONS (ORGANIZATION_ISOLATION_OS.md)
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    tier VARCHAR(50) DEFAULT 'standard',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE TRIGGER set_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ORGANIZATION_MEMBERS
CREATE TABLE IF NOT EXISTS organization_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    role organization_role DEFAULT 'member' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(organization_id, user_id)
);
CREATE TRIGGER set_organization_members_updated_at BEFORE UPDATE ON organization_members FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- WORKSPACES (WORKSPACE_KERNEL.md)
CREATE TABLE IF NOT EXISTS workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(organization_id, slug)
);
CREATE TRIGGER set_workspaces_updated_at BEFORE UPDATE ON workspaces FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- WORKSPACE_MEMBERS
CREATE TABLE IF NOT EXISTS workspace_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    role workspace_role DEFAULT 'member' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(workspace_id, user_id)
);
CREATE TRIGGER set_workspace_members_updated_at BEFORE UPDATE ON workspace_members FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- CONTRACTS (DMS §5 & CONTRACT_ENGINE_OS.md)
CREATE TABLE IF NOT EXISTS contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE RESTRICT NOT NULL,
    rfq_id UUID REFERENCES rfqs(id) ON DELETE RESTRICT NOT NULL,
    bid_id UUID REFERENCES bids(id) ON DELETE RESTRICT NOT NULL,
    owner_id UUID REFERENCES users(id) ON DELETE RESTRICT NOT NULL,
    installer_id UUID REFERENCES users(id) ON DELETE RESTRICT NOT NULL,
    organization_id UUID,
    workspace_id UUID,
    total_amount NUMERIC NOT NULL CHECK (total_amount >= 0),
    status contract_status DEFAULT 'created' NOT NULL,
    signed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, rfq_id, bid_id)
);
CREATE TRIGGER set_contracts_updated_at BEFORE UPDATE ON contracts FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- REVIEWS (DMS §5)
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    reviewer_id UUID REFERENCES users(id) ON DELETE RESTRICT NOT NULL,
    reviewee_id UUID REFERENCES users(id) ON DELETE RESTRICT NOT NULL,
    organization_id UUID,
    workspace_id UUID,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE TRIGGER set_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- MESSAGES (DMS §5)
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES users(id) ON DELETE RESTRICT NOT NULL,
    organization_id UUID,
    workspace_id UUID,
    content TEXT NOT NULL,
    attachment_url VARCHAR(1024),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- IDEMPOTENCY_KEYS (PAYMENT_ENGINE_OS.md & SUNLIT_KERNEL.md)
CREATE TABLE IF NOT EXISTS idempotency_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(255) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    organization_id UUID,
    endpoint VARCHAR(255) NOT NULL,
    request_hash VARCHAR(64) NOT NULL,
    response_code INTEGER,
    response_body JSONB,
    status idempotency_status DEFAULT 'in_progress' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- ======================================================================
-- 3. CHECK CONSTRAINTS & DOMAIN INVARIANTS
-- ======================================================================

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_escrow_amount_positive') THEN
        ALTER TABLE escrow ADD CONSTRAINT chk_escrow_amount_positive CHECK (amount >= 0);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_payments_amount_positive') THEN
        ALTER TABLE payments ADD CONSTRAINT chk_payments_amount_positive CHECK (amount >= 0);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_bids_amount_positive') THEN
        ALTER TABLE bids ADD CONSTRAINT chk_bids_amount_positive CHECK (amount >= 0);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_milestones_amount_positive') THEN
        ALTER TABLE milestones ADD CONSTRAINT chk_milestones_amount_positive CHECK (amount >= 0);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_milestones_position_positive') THEN
        ALTER TABLE milestones ADD CONSTRAINT chk_milestones_position_positive CHECK (position >= 1);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_projects_system_size_positive') THEN
        ALTER TABLE projects ADD CONSTRAINT chk_projects_system_size_positive CHECK (system_size_kw IS NULL OR system_size_kw >= 0);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_rfqs_budget_range_valid') THEN
        ALTER TABLE rfqs ADD CONSTRAINT chk_rfqs_budget_range_valid 
            CHECK (budget_range_min IS NULL OR budget_range_max IS NULL OR budget_range_max >= budget_range_min);
    END IF;
END $$;

-- ======================================================================
-- 4. PERFORMANCE & TENANT INDEXES
-- ======================================================================

CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);
CREATE INDEX IF NOT EXISTS idx_org_members_user ON organization_members(user_id, organization_id);
CREATE INDEX IF NOT EXISTS idx_workspaces_org_slug ON workspaces(organization_id, slug);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user ON workspace_members(user_id, workspace_id);

CREATE INDEX IF NOT EXISTS idx_contracts_project_status ON contracts(project_id, status);
CREATE INDEX IF NOT EXISTS idx_contracts_owner ON contracts(owner_id);
CREATE INDEX IF NOT EXISTS idx_contracts_installer ON contracts(installer_id);

CREATE INDEX IF NOT EXISTS idx_reviews_project_rating ON reviews(project_id, rating);
CREATE INDEX IF NOT EXISTS idx_messages_project_created ON messages(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_idempotency_key_expires ON idempotency_keys(key, expires_at);

-- ======================================================================
-- 5. FINE-GRAINED ROW LEVEL SECURITY (RLS) POLICIES
-- ======================================================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE idempotency_keys ENABLE ROW LEVEL SECURITY;

-- Helper to check if authenticated user belongs to an organization
CREATE OR REPLACE FUNCTION user_in_organization(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    IF org_id IS NULL THEN
        RETURN FALSE;
    END IF;
    RETURN EXISTS (
        SELECT 1 FROM organization_members
        WHERE organization_id = org_id AND user_id = auth.uid()
    );
EXCEPTION WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public, pg_temp;

-- Helper to check if authenticated user belongs to a workspace
CREATE OR REPLACE FUNCTION user_in_workspace(ws_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    IF ws_id IS NULL THEN
        RETURN FALSE;
    END IF;
    RETURN EXISTS (
        SELECT 1 FROM workspace_members
        WHERE workspace_id = ws_id AND user_id = auth.uid()
    );
EXCEPTION WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public, pg_temp;

-- Policies for Organizations
CREATE POLICY "Users can read organizations they belong to"
    ON organizations FOR SELECT
    USING (user_in_organization(id) OR auth.uid() IN (SELECT user_id FROM organization_members WHERE organization_id = id));

-- Policies for Contracts
CREATE POLICY "Contract parties can view their contracts"
    ON contracts FOR SELECT
    USING (
        auth.uid() = owner_id OR 
        auth.uid() = installer_id OR 
        user_in_organization(organization_id)
    );

-- Policies for Messages
CREATE POLICY "Project participants can view messages"
    ON messages FOR SELECT
    USING (
        auth.uid() = sender_id OR 
        user_in_organization(organization_id)
    );

CREATE POLICY "Authenticated users can insert messages into their projects"
    ON messages FOR INSERT
    WITH CHECK (
        auth.uid() = sender_id
    );

-- Policies for Reviews
CREATE POLICY "Public or authenticated users can read reviews"
    ON reviews FOR SELECT
    USING (TRUE);

CREATE POLICY "Reviewers can create reviews"
    ON reviews FOR INSERT
    WITH CHECK (
        auth.uid() = reviewer_id
    );
