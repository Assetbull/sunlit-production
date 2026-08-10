-- ====================================================================
-- Sunlit Migration 014: Financial Integrity, Immutable Ledger & Payment Intents
--
-- Implements:
-- - PAYMENT_ENGINE_OS.md (Registry ID 31)
-- - PAYMENT_ORCHESTRATOR_ENGINE_OS.md (Registry ID 32)
-- - PAYMENT_LEDGER_ENGINE_OS.md (Registry ID 34)
-- - SECURE_PAYMENT_ENGINE_OS.md (Registry ID 33)
-- - ORGANIZATION_ISOLATION_OS.md (Registry ID 62)
-- ====================================================================

-- 1. Ledger Accounts Table
CREATE TABLE IF NOT EXISTS public.ledger_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE SET NULL,
    account_code TEXT NOT NULL,
    account_name TEXT NOT NULL,
    account_type TEXT NOT NULL CHECK (account_type IN ('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE')),
    currency TEXT NOT NULL DEFAULT 'NGN',
    balance_minor_units BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_ledger_account UNIQUE (organization_id, account_code)
);

-- 2. Ledger Transactions Table
CREATE TABLE IF NOT EXISTS public.ledger_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE SET NULL,
    reference_type TEXT NOT NULL,
    reference_id TEXT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'NGN',
    correlation_id TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Ledger Entries Table (Append-Only)
CREATE TABLE IF NOT EXISTS public.ledger_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL REFERENCES public.ledger_transactions(id) ON DELETE RESTRICT,
    account_id UUID NOT NULL REFERENCES public.ledger_accounts(id) ON DELETE RESTRICT,
    entry_type TEXT NOT NULL CHECK (entry_type IN ('DEBIT', 'CREDIT')),
    amount_minor_units BIGINT NOT NULL CHECK (amount_minor_units > 0),
    currency TEXT NOT NULL DEFAULT 'NGN',
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Payment Intents Table
CREATE TABLE IF NOT EXISTS public.payment_intents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE SET NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    milestone_id UUID REFERENCES public.milestones(id) ON DELETE SET NULL,
    amount_minor_units BIGINT NOT NULL CHECK (amount_minor_units > 0),
    currency TEXT NOT NULL DEFAULT 'NGN',
    provider TEXT NOT NULL,
    provider_reference TEXT,
    status TEXT NOT NULL DEFAULT 'CREATED',
    idempotency_key TEXT UNIQUE NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_provider_reference UNIQUE (provider, provider_reference)
);

-- Indexes for performance & tenant isolation
CREATE INDEX IF NOT EXISTS idx_ledger_accounts_org ON public.ledger_accounts(organization_id);
CREATE INDEX IF NOT EXISTS idx_ledger_transactions_org ON public.ledger_transactions(organization_id);
CREATE INDEX IF NOT EXISTS idx_ledger_entries_tx ON public.ledger_entries(transaction_id);
CREATE INDEX IF NOT EXISTS idx_ledger_entries_account ON public.ledger_entries(account_id);
CREATE INDEX IF NOT EXISTS idx_payment_intents_org ON public.payment_intents(organization_id);
CREATE INDEX IF NOT EXISTS idx_payment_intents_provider_ref ON public.payment_intents(provider, provider_reference);

-- Enable RLS
ALTER TABLE public.ledger_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ledger_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_intents ENABLE ROW LEVEL SECURITY;

-- Tenant Isolation RLS Policies
CREATE POLICY ledger_accounts_tenant_isolation ON public.ledger_accounts
    FOR ALL
    USING (
        organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid
        OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    );

CREATE POLICY ledger_transactions_tenant_isolation ON public.ledger_transactions
    FOR ALL
    USING (
        organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid
        OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    );

CREATE POLICY payment_intents_tenant_isolation ON public.payment_intents
    FOR ALL
    USING (
        organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid
        OR user_id = auth.uid()
        OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    );
