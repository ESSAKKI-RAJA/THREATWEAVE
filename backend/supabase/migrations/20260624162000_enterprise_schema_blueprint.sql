-- ============== 1. app_role enum check ==============
-- In PostgreSQL, altering type values inside transaction blocks can fail. 
-- We map roles to the existing public.app_role enum ('admin', 'analyst', 'user') to ensure smooth backwards compatibility.

-- ============== 2. public.organizations Table ==============
CREATE TABLE IF NOT EXISTS public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  industry_code text NOT NULL DEFAULT '9999',
  region text NOT NULL DEFAULT 'Global',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============== 3. public.profiles Table ==============
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============== 4. Backfill existing users & create default organizations ==============
DO $$
DECLARE
  u record;
  org_id uuid;
BEGIN
  FOR u IN SELECT id, email, raw_user_meta_data FROM auth.users LOOP
    -- Create profile and default organization only if they do not exist
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = u.id) THEN
      INSERT INTO public.organizations (name, industry_code, region)
      VALUES (
        coalesce(u.raw_user_meta_data->>'organization_name', 'Org - ' || split_part(u.email, '@', 2)),
        '9999',
        'Global'
      ) RETURNING id INTO org_id;

      INSERT INTO public.profiles (id, organization_id, email, full_name)
      VALUES (
        u.id,
        org_id,
        u.email,
        coalesce(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1))
      );
    END IF;
  END LOOP;
END;
$$;

-- ============== 5. Add and backfill organization_id in public.vendors ==============
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE;

-- Update existing vendor rows
UPDATE public.vendors v
SET organization_id = p.organization_id
FROM public.profiles p
WHERE v.user_id = p.id AND v.organization_id IS NULL;

-- Handle any orphaned vendors by assigning a fallback organization if necessary
DO $$
DECLARE
  fallback_org_id uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM public.vendors WHERE organization_id IS NULL) THEN
    INSERT INTO public.organizations (name, industry_code, region)
    VALUES ('Fallback Global Org', '9999', 'Global')
    RETURNING id INTO fallback_org_id;

    UPDATE public.vendors SET organization_id = fallback_org_id WHERE organization_id IS NULL;
  END IF;
END;
$$;

-- Enforce constraints
ALTER TABLE public.vendors ALTER COLUMN organization_id SET NOT NULL;
ALTER TABLE public.vendors DROP CONSTRAINT IF EXISTS unique_org_vendor_domain;
ALTER TABLE public.vendors ADD CONSTRAINT unique_org_vendor_domain UNIQUE (organization_id, domain);

-- ============== 6. Registration Trigger for new auth users ==============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  default_org_id uuid;
BEGIN
  -- Create default organization
  INSERT INTO public.organizations (name, industry_code, region)
  VALUES (
    coalesce(new.raw_user_meta_data->>'organization_name', 'Org - ' || split_part(new.email, '@', 2)),
    '9999',
    'Global'
  ) RETURNING id INTO default_org_id;

  -- Create profile
  INSERT INTO public.profiles (id, organization_id, email, full_name)
  VALUES (
    new.id,
    default_org_id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );

  -- Assign user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============== 7. Create New Advanced Sub-Component Tables ==============

-- Supply Chain Relationships
CREATE TABLE IF NOT EXISTS public.vendor_dependencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_vendor_id uuid NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  child_vendor_id uuid NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  depth integer NOT NULL CHECK (depth >= 1),
  dependency_weight numeric(3,2) NOT NULL DEFAULT 1.00 CHECK (dependency_weight BETWEEN 0.00 AND 1.00),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT unique_dependency_link UNIQUE (parent_vendor_id, child_vendor_id)
);

-- Discoveries / Exposed Assets
CREATE TABLE IF NOT EXISTS public.assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  ip_address inet NOT NULL,
  hostname text,
  hosting_provider text,
  country_code text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Exposed Ports & Services
CREATE TABLE IF NOT EXISTS public.exposures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id uuid NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  port integer NOT NULL CHECK (port BETWEEN 1 AND 65535),
  service_name text,
  cpe text,
  banner text,
  last_seen timestamptz NOT NULL DEFAULT now()
);

-- Vulnerabilities (CVE/CPE references)
CREATE TABLE IF NOT EXISTS public.vulnerabilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id uuid NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  cve_id text NOT NULL,
  cvss_score numeric(3,1) CHECK (cvss_score BETWEEN 0.0 AND 10.0),
  epss_score numeric(4,3),
  known_exploited boolean DEFAULT false,
  remediation_status text NOT NULL DEFAULT 'open',
  detected_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);

-- Leak Discovery (GitHub credentials / API leaks)
CREATE TABLE IF NOT EXISTS public.credential_leaks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  source_repository text NOT NULL,
  file_path text NOT NULL,
  leak_url text NOT NULL,
  matched_pattern text NOT NULL,
  leak_date timestamptz NOT NULL DEFAULT now()
);

-- Threat Matches Correlation Table
CREATE TABLE IF NOT EXISTS public.threat_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id uuid NOT NULL REFERENCES public.scans(id) ON DELETE CASCADE,
  threat_signature_id uuid NOT NULL REFERENCES public.threat_signatures(id) ON DELETE CASCADE,
  similarity_score numeric(4,3) NOT NULL CHECK (similarity_score BETWEEN -1.000 AND 1.000),
  analyst_notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Security Benchmarking Records
CREATE TABLE IF NOT EXISTS public.benchmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  industry_average_score numeric(5,2) NOT NULL,
  regional_average_score numeric(5,2) NOT NULL,
  percentile_rank numeric(5,2) NOT NULL,
  calculated_at timestamptz NOT NULL DEFAULT now()
);

-- ML Predictions Table
CREATE TABLE IF NOT EXISTS public.risk_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  days_ahead integer NOT NULL CHECK (days_ahead IN (30, 90, 180)),
  predicted_risk_score numeric(5,2) NOT NULL,
  confidence_interval_low numeric(5,2) NOT NULL,
  confidence_interval_high numeric(5,2) NOT NULL,
  exposure_probability numeric(3,2) NOT NULL,
  leak_probability numeric(3,2) NOT NULL,
  vuln_growth_probability numeric(3,2) NOT NULL,
  calculated_at timestamptz NOT NULL DEFAULT now()
);

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  ip_address inet,
  details jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============== 8. Performance Indexes ==============
CREATE INDEX IF NOT EXISTS idx_vendors_org_id ON public.vendors(organization_id);
CREATE INDEX IF NOT EXISTS idx_profiles_org_id ON public.profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_assets_vendor_id ON public.assets(vendor_id);
CREATE INDEX IF NOT EXISTS idx_exposures_asset_port ON public.exposures(asset_id, port);
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_cve ON public.vulnerabilities(cve_id);
CREATE INDEX IF NOT EXISTS idx_credential_leaks_vendor ON public.credential_leaks(vendor_id);

-- Upgrade vector search index from IVFFlat to HNSW for enterprise scalability
DROP INDEX IF EXISTS public.threat_signatures_embedding_idx;
CREATE INDEX IF NOT EXISTS threat_signatures_embedding_idx
  ON public.threat_signatures USING hnsw (embedding vector_cosine_ops);

-- ============== 9. Row Level Security helper ==============
CREATE OR REPLACE FUNCTION public.get_user_org()
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT organization_id FROM public.profiles WHERE id = auth.uid();
$$;

GRANT EXECUTE ON FUNCTION public.get_user_org() TO authenticated;

-- ============== 10. Configure Row Level Security (RLS) ==============

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exposures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vulnerabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credential_leaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threat_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Reset and create new RLS policies for vendors and scans to use get_user_org()
DROP POLICY IF EXISTS "Users manage their own vendors" ON public.vendors;
CREATE POLICY "Users manage their own vendors" ON public.vendors
  FOR ALL TO authenticated
  USING (organization_id = public.get_user_org())
  WITH CHECK (organization_id = public.get_user_org());

DROP POLICY IF EXISTS "Users manage their own scans" ON public.scans;
CREATE POLICY "Users manage their own scans" ON public.scans
  FOR ALL TO authenticated
  USING (vendor_id IN (SELECT id FROM public.vendors WHERE organization_id = public.get_user_org()));

-- Define RLS policies for new tables
CREATE POLICY "Users view their own organization" ON public.organizations
  FOR SELECT TO authenticated USING (id = public.get_user_org());

CREATE POLICY "Users manage their own profile" ON public.profiles
  FOR ALL TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE POLICY "Users view organization profiles" ON public.profiles
  FOR SELECT TO authenticated USING (organization_id = public.get_user_org());

CREATE POLICY "Users manage dependencies of organization vendors" ON public.vendor_dependencies
  FOR ALL TO authenticated
  USING (
    parent_vendor_id IN (SELECT id FROM public.vendors WHERE organization_id = public.get_user_org())
    OR child_vendor_id IN (SELECT id FROM public.vendors WHERE organization_id = public.get_user_org())
  );

CREATE POLICY "Users view assets of organization vendors" ON public.assets
  FOR ALL TO authenticated
  USING (vendor_id IN (SELECT id FROM public.vendors WHERE organization_id = public.get_user_org()));

CREATE POLICY "Users view exposures of organization assets" ON public.exposures
  FOR ALL TO authenticated
  USING (asset_id IN (SELECT id FROM public.assets WHERE vendor_id IN (SELECT id FROM public.vendors WHERE organization_id = public.get_user_org())));

CREATE POLICY "Users view vulnerabilities of organization assets" ON public.vulnerabilities
  FOR ALL TO authenticated
  USING (asset_id IN (SELECT id FROM public.assets WHERE vendor_id IN (SELECT id FROM public.vendors WHERE organization_id = public.get_user_org())));

CREATE POLICY "Users view credential leaks of organization vendors" ON public.credential_leaks
  FOR ALL TO authenticated
  USING (vendor_id IN (SELECT id FROM public.vendors WHERE organization_id = public.get_user_org()));

CREATE POLICY "Users view threat matches of organization scans" ON public.threat_matches
  FOR ALL TO authenticated
  USING (scan_id IN (SELECT id FROM public.scans WHERE vendor_id IN (SELECT id FROM public.vendors WHERE organization_id = public.get_user_org())));

CREATE POLICY "Users view benchmarks of organization vendors" ON public.benchmarks
  FOR ALL TO authenticated
  USING (vendor_id IN (SELECT id FROM public.vendors WHERE organization_id = public.get_user_org()));

CREATE POLICY "Users view predictions of organization vendors" ON public.risk_predictions
  FOR ALL TO authenticated
  USING (vendor_id IN (SELECT id FROM public.vendors WHERE organization_id = public.get_user_org()));

CREATE POLICY "Users view their own organization audit logs" ON public.audit_logs
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());
