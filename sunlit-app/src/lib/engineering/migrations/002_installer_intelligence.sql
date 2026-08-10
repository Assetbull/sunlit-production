-- ============================================================
-- Sunlit Installer Intelligence Network — Database Migration
-- ============================================================
-- 
-- This migration creates the public-facing Installer Intelligence
-- layer tables. It does NOT modify any existing tables.
--
-- Architecture: Read-optimized public projection over private platform.
-- All tables have RLS enabled. Public profiles readable only where 
-- status = 'published'. Write operations require authenticated installer
-- matching the organization_id.
--
-- Slug format: company-name-short-opaque-id (immutable)
-- ============================================================

-- ============================================================
-- 1. SERVICE TAXONOMY (reference data)
-- ============================================================
CREATE TABLE IF NOT EXISTS service_taxonomy (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN (
    'solar_installation', 'commercial_solar', 'industrial_solar',
    'battery_storage', 'microgrids', 'solar_maintenance',
    'ev_infrastructure', 'energy_audit', 'system_design', 'monitoring'
  )),
  description TEXT,
  icon TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE service_taxonomy ENABLE ROW LEVEL SECURITY;

-- Public read for active services
CREATE POLICY "service_taxonomy_public_read" ON service_taxonomy
  FOR SELECT USING (is_active = true);

-- Admin write
CREATE POLICY "service_taxonomy_admin_write" ON service_taxonomy
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM roles WHERE user_id = auth.uid()::text AND role_name = 'admin'
    )
  );

-- ============================================================
-- 2. LOCATIONS (normalized location entities)
-- ============================================================
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state TEXT NOT NULL,
  state_slug TEXT NOT NULL,
  city TEXT,
  city_slug TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  installer_count INTEGER NOT NULL DEFAULT 0,
  project_count INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(state_slug, city_slug)
);

CREATE INDEX idx_locations_state_slug ON locations(state_slug);
CREATE INDEX idx_locations_city_slug ON locations(state_slug, city_slug);

ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "locations_public_read" ON locations
  FOR SELECT USING (is_active = true);

CREATE POLICY "locations_admin_write" ON locations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM roles WHERE user_id = auth.uid()::text AND role_name = 'admin'
    )
  );

-- ============================================================
-- 3. INSTALLER PROFILES (core public projection)
-- ============================================================
CREATE TABLE IF NOT EXISTS installer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(clerk_id),
  organization_id TEXT,
  
  -- Immutable slug: company-name-short-opaque-id
  slug TEXT NOT NULL UNIQUE,
  
  -- Public identity
  business_name TEXT NOT NULL,
  business_description TEXT,
  business_type TEXT NOT NULL DEFAULT 'installer' CHECK (business_type IN ('installer', 'epc_contractor')),
  logo_url TEXT,
  cover_image_url TEXT,
  website_url TEXT,
  
  -- Public contact (ONLY designated public contact info)
  public_email TEXT,
  public_phone TEXT,
  
  -- Location
  headquarters_state TEXT,
  headquarters_city TEXT,
  headquarters_address TEXT,
  
  -- Capabilities
  residential BOOLEAN NOT NULL DEFAULT false,
  commercial BOOLEAN NOT NULL DEFAULT false,
  industrial BOOLEAN NOT NULL DEFAULT false,
  battery_storage BOOLEAN NOT NULL DEFAULT false,
  microgrid BOOLEAN NOT NULL DEFAULT false,
  ev_infrastructure BOOLEAN NOT NULL DEFAULT false,
  system_size_min_kw NUMERIC,
  system_size_max_kw NUMERIC,
  
  -- Trust & verification
  verification_level TEXT NOT NULL DEFAULT 'unverified' CHECK (verification_level IN (
    'unverified', 'basic', 'standard', 'advanced', 'enterprise'
  )),
  verified_at TIMESTAMPTZ,
  verification_expires_at TIMESTAMPTZ,
  
  -- Score (computed)
  sunlit_score NUMERIC CHECK (sunlit_score >= 0 AND sunlit_score <= 100),
  score_version TEXT,
  score_calculated_at TIMESTAMPTZ,
  
  -- Activity & freshness
  availability_status TEXT NOT NULL DEFAULT 'accepting_projects' CHECK (availability_status IN (
    'accepting_projects', 'limited_availability', 'not_accepting', 'unavailable'
  )),
  availability_updated_at TIMESTAMPTZ,
  last_project_at TIMESTAMPTZ,
  last_review_at TIMESTAMPTZ,
  last_activity_at TIMESTAMPTZ,
  profile_updated_at TIMESTAMPTZ,
  
  -- Aggregated stats
  completed_projects_count INTEGER NOT NULL DEFAULT 0,
  active_projects_count INTEGER NOT NULL DEFAULT 0,
  total_capacity_installed_kw NUMERIC NOT NULL DEFAULT 0,
  average_rating NUMERIC CHECK (average_rating >= 1 AND average_rating <= 5),
  review_count INTEGER NOT NULL DEFAULT 0,
  years_experience INTEGER,
  
  -- Social
  linkedin_url TEXT,
  instagram_url TEXT,
  facebook_url TEXT,
  twitter_url TEXT,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'suspended')),
  published_at TIMESTAMPTZ,
  
  -- Warranty & maintenance
  offers_warranty BOOLEAN NOT NULL DEFAULT false,
  warranty_description TEXT,
  offers_maintenance BOOLEAN NOT NULL DEFAULT false,
  maintenance_description TEXT,
  offers_financing BOOLEAN NOT NULL DEFAULT false,
  financing_description TEXT,
  
  -- Full-text search vector
  search_vector TSVECTOR,
  
  -- Audit
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by TEXT NOT NULL
);

-- Indexes
CREATE INDEX idx_installer_profiles_slug ON installer_profiles(slug);
CREATE INDEX idx_installer_profiles_user_id ON installer_profiles(user_id);
CREATE INDEX idx_installer_profiles_status ON installer_profiles(status);
CREATE INDEX idx_installer_profiles_state ON installer_profiles(headquarters_state);
CREATE INDEX idx_installer_profiles_city ON installer_profiles(headquarters_state, headquarters_city);
CREATE INDEX idx_installer_profiles_score ON installer_profiles(sunlit_score DESC NULLS LAST);
CREATE INDEX idx_installer_profiles_rating ON installer_profiles(average_rating DESC NULLS LAST);
CREATE INDEX idx_installer_profiles_verification ON installer_profiles(verification_level);
CREATE INDEX idx_installer_profiles_search ON installer_profiles USING GIN(search_vector);

-- Trigger: auto-update search vector
CREATE OR REPLACE FUNCTION update_installer_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.business_name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.business_description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.headquarters_state, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.headquarters_city, '')), 'C');
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: prevent installer user from tampering with verification, scores, or immutable slug
CREATE OR REPLACE FUNCTION prevent_installer_privileged_field_tampering()
RETURNS TRIGGER AS $$
DECLARE
  is_admin BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM roles WHERE user_id = auth.uid()::text AND role_name = 'admin'
  ) INTO is_admin;

  IF NOT is_admin AND auth.uid() IS NOT NULL THEN
    -- Slug is immutable
    IF NEW.slug <> OLD.slug THEN
      RAISE EXCEPTION 'Installer slug is immutable and cannot be changed.';
    END IF;
    -- Verification fields cannot be updated by installer
    IF NEW.verification_level <> OLD.verification_level OR NEW.verified_at IS DISTINCT FROM OLD.verified_at THEN
      RAISE EXCEPTION 'Installer verification status cannot be self-modified.';
    END IF;
    -- SunlitScore cannot be updated by installer
    IF NEW.sunlit_score IS DISTINCT FROM OLD.sunlit_score OR NEW.score_calculated_at IS DISTINCT FROM OLD.score_calculated_at THEN
      RAISE EXCEPTION 'SunlitScore is computed by platform algorithms and cannot be modified by user.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_prevent_installer_tamper
  BEFORE UPDATE ON installer_profiles
  FOR EACH ROW EXECUTE FUNCTION prevent_installer_privileged_field_tampering();

-- RLS
ALTER TABLE installer_profiles ENABLE ROW LEVEL SECURITY;

-- Public: read published profiles only
CREATE POLICY "installer_profiles_public_read" ON installer_profiles
  FOR SELECT USING (status = 'published');

-- Installer: read own profile (any status)
CREATE POLICY "installer_profiles_owner_read" ON installer_profiles
  FOR SELECT USING (user_id = auth.uid()::text);

-- Installer: insert own profile
CREATE POLICY "installer_profiles_owner_insert" ON installer_profiles
  FOR INSERT WITH CHECK (user_id = auth.uid()::text);

-- Installer: update own profile
CREATE POLICY "installer_profiles_owner_update" ON installer_profiles
  FOR UPDATE USING (user_id = auth.uid()::text);

-- Admin: full access
CREATE POLICY "installer_profiles_admin_all" ON installer_profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM roles WHERE user_id = auth.uid()::text AND role_name = 'admin'
    )
  );

-- ============================================================
-- 4. INSTALLER SERVICES (M2M)
-- ============================================================
CREATE TABLE IF NOT EXISTS installer_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  installer_id UUID NOT NULL REFERENCES installer_profiles(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES service_taxonomy(id) ON DELETE CASCADE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(installer_id, service_id)
);

ALTER TABLE installer_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "installer_services_public_read" ON installer_services
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM installer_profiles WHERE id = installer_id AND status = 'published'
    )
  );

CREATE POLICY "installer_services_owner_write" ON installer_services
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM installer_profiles WHERE id = installer_id AND user_id = auth.uid()::text
    )
  );

-- ============================================================
-- 5. INSTALLER SERVICE AREAS (M2M)
-- ============================================================
CREATE TABLE IF NOT EXISTS installer_service_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  installer_id UUID NOT NULL REFERENCES installer_profiles(id) ON DELETE CASCADE,
  state TEXT NOT NULL,
  city TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(installer_id, state, city)
);

CREATE INDEX idx_installer_service_areas_state ON installer_service_areas(state);
CREATE INDEX idx_installer_service_areas_city ON installer_service_areas(state, city);

ALTER TABLE installer_service_areas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "installer_service_areas_public_read" ON installer_service_areas
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM installer_profiles WHERE id = installer_id AND status = 'published'
    )
  );

CREATE POLICY "installer_service_areas_owner_write" ON installer_service_areas
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM installer_profiles WHERE id = installer_id AND user_id = auth.uid()::text
    )
  );

-- ============================================================
-- 6. INSTALLER CERTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS installer_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  installer_id UUID NOT NULL REFERENCES installer_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  issuing_body TEXT NOT NULL,
  certificate_number TEXT,
  issued_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'expired', 'rejected')),
  verified_at TIMESTAMPTZ,
  verified_by TEXT,
  document_url TEXT, -- Private storage only
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE installer_certifications ENABLE ROW LEVEL SECURITY;

-- Public: only verified certs of published profiles
CREATE POLICY "installer_certifications_public_read" ON installer_certifications
  FOR SELECT USING (
    status = 'verified' AND
    EXISTS (
      SELECT 1 FROM installer_profiles WHERE id = installer_id AND status = 'published'
    )
  );

CREATE POLICY "installer_certifications_owner_write" ON installer_certifications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM installer_profiles WHERE id = installer_id AND user_id = auth.uid()::text
    )
  );

CREATE POLICY "installer_certifications_admin_all" ON installer_certifications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM roles WHERE user_id = auth.uid()::text AND role_name = 'admin'
    )
  );

-- ============================================================
-- 7. INSTALLER VERIFICATIONS (internal)
-- ============================================================
CREATE TABLE IF NOT EXISTS installer_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  installer_id UUID NOT NULL REFERENCES installer_profiles(id) ON DELETE CASCADE,
  signal TEXT NOT NULL CHECK (signal IN (
    'cac_verified', 'identity_verified', 'address_verified', 'technical_verified',
    'portfolio_verified', 'project_verified', 'certification_verified',
    'review_verified', 'insurance_verified', 'warranty_verified'
  )),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  verified_at TIMESTAMPTZ,
  verified_by TEXT,
  expires_at TIMESTAMPTZ,
  evidence_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(installer_id, signal)
);

ALTER TABLE installer_verifications ENABLE ROW LEVEL SECURITY;

-- Verifications are NEVER public - internal only
CREATE POLICY "installer_verifications_owner_read" ON installer_verifications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM installer_profiles WHERE id = installer_id AND user_id = auth.uid()::text
    )
  );

CREATE POLICY "installer_verifications_admin_all" ON installer_verifications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM roles WHERE user_id = auth.uid()::text AND role_name = 'admin'
    )
  );

-- ============================================================
-- 8. INSTALLER DOCUMENTS (private - NEVER public)
-- ============================================================
CREATE TABLE IF NOT EXISTS installer_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  installer_id UUID NOT NULL REFERENCES installer_profiles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN (
    'cac_certificate', 'identity_document', 'tax_clearance',
    'insurance_certificate', 'professional_license', 
    'portfolio_evidence', 'bank_verification', 'other'
  )),
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected', 'expired')),
  verified_at TIMESTAMPTZ,
  verified_by TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE installer_documents ENABLE ROW LEVEL SECURITY;

-- Documents are NEVER publicly accessible
CREATE POLICY "installer_documents_owner_read" ON installer_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM installer_profiles WHERE id = installer_id AND user_id = auth.uid()::text
    )
  );

CREATE POLICY "installer_documents_owner_insert" ON installer_documents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM installer_profiles WHERE id = installer_id AND user_id = auth.uid()::text
    )
  );

CREATE POLICY "installer_documents_admin_all" ON installer_documents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM roles WHERE user_id = auth.uid()::text AND role_name = 'admin'
    )
  );

-- ============================================================
-- 9. INSTALLER SCORES (computed)
-- ============================================================
CREATE TABLE IF NOT EXISTS installer_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  installer_id UUID NOT NULL REFERENCES installer_profiles(id) ON DELETE CASCADE,
  total_score NUMERIC NOT NULL CHECK (total_score >= 0 AND total_score <= 100),
  version TEXT NOT NULL,
  
  -- Component scores
  technical_capability NUMERIC NOT NULL DEFAULT 0,
  verified_experience NUMERIC NOT NULL DEFAULT 0,
  customer_satisfaction NUMERIC NOT NULL DEFAULT 0,
  response_reliability NUMERIC NOT NULL DEFAULT 0,
  completion_reliability NUMERIC NOT NULL DEFAULT 0,
  experience NUMERIC NOT NULL DEFAULT 0,
  documentation_verification NUMERIC NOT NULL DEFAULT 0,
  
  evidence_snapshot JSONB NOT NULL DEFAULT '{}',
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_installer_scores_installer ON installer_scores(installer_id, calculated_at DESC);

ALTER TABLE installer_scores ENABLE ROW LEVEL SECURITY;

-- Public: read scores only for published profiles (score breakdown is public per SunlitScore Explanation screen)
CREATE POLICY "installer_scores_public_read" ON installer_scores
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM installer_profiles WHERE id = installer_id AND status = 'published' AND sunlit_score IS NOT NULL
    )
  );

CREATE POLICY "installer_scores_admin_all" ON installer_scores
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM roles WHERE user_id = auth.uid()::text AND role_name = 'admin'
    )
  );

-- ============================================================
-- 10. INSTALLER ACTIVITY (event feed)
-- ============================================================
CREATE TABLE IF NOT EXISTS installer_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  installer_id UUID NOT NULL REFERENCES installer_profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB,
  is_public BOOLEAN NOT NULL DEFAULT false,
  is_moderated BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_installer_activity_installer ON installer_activity(installer_id, created_at DESC);
CREATE INDEX idx_installer_activity_public ON installer_activity(is_public, created_at DESC);

ALTER TABLE installer_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "installer_activity_public_read" ON installer_activity
  FOR SELECT USING (
    is_public = true AND is_moderated = true AND
    EXISTS (
      SELECT 1 FROM installer_profiles WHERE id = installer_id AND status = 'published'
    )
  );

CREATE POLICY "installer_activity_owner_read" ON installer_activity
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM installer_profiles WHERE id = installer_id AND user_id = auth.uid()::text
    )
  );

-- ============================================================
-- 11. PUBLIC PROJECTS (portfolio)
-- ============================================================
CREATE TABLE IF NOT EXISTS public_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  installer_id UUID NOT NULL REFERENCES installer_profiles(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  customer_type TEXT NOT NULL DEFAULT 'residential' CHECK (customer_type IN ('residential', 'commercial', 'industrial')),
  state TEXT,
  city TEXT,
  system_size_kw NUMERIC,
  battery_capacity_kwh NUMERIC,
  technology TEXT,
  equipment_details JSONB,
  completion_date TIMESTAMPTZ,
  images TEXT[],
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected', 'expired')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_public_projects_installer ON public_projects(installer_id);
CREATE INDEX idx_public_projects_slug ON public_projects(slug);
CREATE INDEX idx_public_projects_status ON public_projects(status, verification_status);

ALTER TABLE public_projects ENABLE ROW LEVEL SECURITY;

-- Public: only published + approved projects of published installers
CREATE POLICY "public_projects_public_read" ON public_projects
  FOR SELECT USING (
    status = 'published' AND verification_status = 'approved' AND
    EXISTS (
      SELECT 1 FROM installer_profiles WHERE id = installer_id AND status = 'published'
    )
  );

CREATE POLICY "public_projects_owner_write" ON public_projects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM installer_profiles WHERE id = installer_id AND user_id = auth.uid()::text
    )
  );

CREATE POLICY "public_projects_admin_all" ON public_projects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM roles WHERE user_id = auth.uid()::text AND role_name = 'admin'
    )
  );

-- ============================================================
-- 12. PUBLIC REVIEWS (moderated)
-- ============================================================
CREATE TABLE IF NOT EXISTS public_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  installer_id UUID NOT NULL REFERENCES installer_profiles(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public_projects(id),
  reviewer_user_id TEXT NOT NULL,
  reviewer_type TEXT NOT NULL DEFAULT 'unverified' CHECK (reviewer_type IN ('verified_customer', 'verified_project', 'unverified')),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT,
  moderation_status TEXT NOT NULL DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected', 'flagged')),
  installer_response TEXT,
  installer_response_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_public_reviews_installer ON public_reviews(installer_id, created_at DESC);
CREATE INDEX idx_public_reviews_rating ON public_reviews(installer_id, rating);

ALTER TABLE public_reviews ENABLE ROW LEVEL SECURITY;

-- Public: only approved reviews of published installers
CREATE POLICY "public_reviews_public_read" ON public_reviews
  FOR SELECT USING (
    moderation_status = 'approved' AND
    EXISTS (
      SELECT 1 FROM installer_profiles WHERE id = installer_id AND status = 'published'
    )
  );

CREATE POLICY "public_reviews_author_insert" ON public_reviews
  FOR INSERT WITH CHECK (reviewer_user_id = auth.uid()::text);

CREATE POLICY "public_reviews_installer_respond" ON public_reviews
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM installer_profiles WHERE id = installer_id AND user_id = auth.uid()::text
    )
  );

CREATE POLICY "public_reviews_admin_all" ON public_reviews
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM roles WHERE user_id = auth.uid()::text AND role_name = 'admin'
    )
  );

-- ============================================================
-- 13. SAVED INSTALLERS (authenticated users)
-- ============================================================
CREATE TABLE IF NOT EXISTS saved_installers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  installer_id UUID NOT NULL REFERENCES installer_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(user_id, installer_id)
);

ALTER TABLE saved_installers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "saved_installers_owner_all" ON saved_installers
  FOR ALL USING (user_id = auth.uid()::text);

-- ============================================================
-- 14. SEARCH EVENTS (analytics - internal only)
-- ============================================================
CREATE TABLE IF NOT EXISTS installer_search_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT,
  filters JSONB,
  results_count INTEGER NOT NULL DEFAULT 0,
  user_id TEXT,
  session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE installer_search_events ENABLE ROW LEVEL SECURITY;

-- Search events are write-only from API, read by admin
CREATE POLICY "installer_search_events_insert" ON installer_search_events
  FOR INSERT WITH CHECK (true); -- Anyone can log a search

CREATE POLICY "installer_search_events_admin_read" ON installer_search_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM roles WHERE user_id = auth.uid()::text AND role_name = 'admin'
    )
  );

-- ============================================================
-- 15. RFQ MATCHES
-- ============================================================
CREATE TABLE IF NOT EXISTS rfq_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id TEXT NOT NULL,
  installer_id UUID NOT NULL REFERENCES installer_profiles(id) ON DELETE CASCADE,
  match_score NUMERIC NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
  match_reasons JSONB NOT NULL DEFAULT '[]',
  algorithm_version TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_rfq_matches_rfq ON rfq_matches(rfq_id, match_score DESC);

ALTER TABLE rfq_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rfq_matches_owner_read" ON rfq_matches
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM installer_profiles WHERE id = installer_id AND user_id = auth.uid()::text
    )
  );

CREATE POLICY "rfq_matches_admin_all" ON rfq_matches
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM roles WHERE user_id = auth.uid()::text AND role_name = 'admin'
    )
  );

-- ============================================================
-- 16. MODERATION QUEUE (admin only)
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_moderation_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('installer', 'review', 'project', 'certification')),
  entity_id UUID NOT NULL,
  action TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'skipped')),
  admin_user_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_moderation_queue_status ON admin_moderation_queue(status, created_at);

ALTER TABLE admin_moderation_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "moderation_queue_admin_all" ON admin_moderation_queue
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM roles WHERE user_id = auth.uid()::text AND role_name = 'admin'
    )
  );

-- ============================================================
-- 17. KNOWLEDGE RELATIONS (Sanity ↔ Marketplace entities)
-- ============================================================
CREATE TABLE IF NOT EXISTS knowledge_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sanity_article_id TEXT NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('installer', 'location', 'service', 'project')),
  entity_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(sanity_article_id, entity_type, entity_id)
);

ALTER TABLE knowledge_relations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "knowledge_relations_public_read" ON knowledge_relations
  FOR SELECT USING (true);

CREATE POLICY "knowledge_relations_admin_write" ON knowledge_relations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM roles WHERE user_id = auth.uid()::text AND role_name = 'admin'
    )
  );

-- ============================================================
-- SEED: Service Taxonomy
-- ============================================================
INSERT INTO service_taxonomy (name, slug, category, description, icon, display_order) VALUES
  ('Solar Panel Installation', 'solar-panel-installation', 'solar_installation', 'Residential and commercial solar panel installation services', 'solar_power', 1),
  ('Commercial Solar Systems', 'commercial-solar-systems', 'commercial_solar', 'Large-scale commercial solar energy solutions', 'business', 2),
  ('Industrial Solar Solutions', 'industrial-solar-solutions', 'industrial_solar', 'Industrial-grade solar power systems', 'factory', 3),
  ('Battery Storage Systems', 'battery-storage-systems', 'battery_storage', 'Energy storage and battery backup solutions', 'battery_charging_full', 4),
  ('Microgrid Design & Installation', 'microgrid-design-installation', 'microgrids', 'Custom microgrid solutions for communities and facilities', 'grid_on', 5),
  ('Solar Maintenance & Repair', 'solar-maintenance-repair', 'solar_maintenance', 'Preventive maintenance, monitoring, and repair services', 'build', 6),
  ('EV Charging Infrastructure', 'ev-charging-infrastructure', 'ev_infrastructure', 'Electric vehicle charging station installation', 'ev_station', 7),
  ('Energy Audit & Assessment', 'energy-audit-assessment', 'energy_audit', 'Comprehensive energy usage analysis and recommendations', 'assessment', 8),
  ('System Design & Engineering', 'system-design-engineering', 'system_design', 'Custom solar system design and engineering services', 'architecture', 9),
  ('Remote Monitoring & Analytics', 'remote-monitoring-analytics', 'monitoring', 'IoT-based solar system monitoring and performance analytics', 'monitoring', 10)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- SEED: Locations (Nigeria initial set)
-- ============================================================
INSERT INTO locations (state, state_slug, city, city_slug, latitude, longitude) VALUES
  ('Lagos', 'lagos', NULL, NULL, 6.5244, 3.3792),
  ('Lagos', 'lagos', 'Lekki', 'lekki', 6.4281, 3.4219),
  ('Lagos', 'lagos', 'Victoria Island', 'victoria-island', 6.4281, 3.4084),
  ('Lagos', 'lagos', 'Ikoyi', 'ikoyi', 6.4504, 3.4368),
  ('Lagos', 'lagos', 'Ikeja', 'ikeja', 6.6018, 3.3515),
  ('Lagos', 'lagos', 'Ajah', 'ajah', 6.4673, 3.5852),
  ('Abuja', 'abuja', NULL, NULL, 9.0579, 7.4951),
  ('Abuja', 'abuja', 'Maitama', 'maitama', 9.0826, 7.4861),
  ('Abuja', 'abuja', 'Wuse', 'wuse', 9.0677, 7.4825),
  ('Ogun', 'ogun', NULL, NULL, 7.1608, 3.3486),
  ('Rivers', 'rivers', NULL, NULL, 4.8156, 7.0498),
  ('Rivers', 'rivers', 'Port Harcourt', 'port-harcourt', 4.8156, 7.0498),
  ('Kano', 'kano', NULL, NULL, 12.0022, 8.5920)
ON CONFLICT (state_slug, city_slug) DO NOTHING;
