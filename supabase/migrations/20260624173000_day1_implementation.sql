-- ==============================================================
-- THREATWEAVE Day 1: NVD, Supply Chain, Forecasting & Threats
-- ==============================================================

-- 1. NVD Integration (Live CVE Intelligence)
CREATE TABLE IF NOT EXISTS public.nvd_cves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cve_id TEXT NOT NULL UNIQUE,
    cvss_v3_vector TEXT,
    base_score FLOAT,
    severity TEXT,
    published_date TIMESTAMPTZ,
    last_modified TIMESTAMPTZ,
    full_json JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_nvd_cves_cve_id ON public.nvd_cves(cve_id);
CREATE INDEX IF NOT EXISTS idx_nvd_cves_severity ON public.nvd_cves(severity);

-- 2. Scalable Supply-Chain Analytics
-- Drop the existing vendor_dependencies to align with new source/target schema
DROP TABLE IF EXISTS public.vendor_dependencies CASCADE;

CREATE TABLE public.vendor_dependencies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    source_vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
    target_vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
    relationship_type TEXT DEFAULT 'uses',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(source_vendor_id, target_vendor_id)
);

CREATE INDEX IF NOT EXISTS idx_vd_source ON public.vendor_dependencies(source_vendor_id);
CREATE INDEX IF NOT EXISTS idx_vd_target ON public.vendor_dependencies(target_vendor_id);

-- Downstream Recursive Query
CREATE OR REPLACE FUNCTION public.get_downstream_vendors(root_id UUID, max_depth INT DEFAULT 5)
RETURNS TABLE (
    vendor_id UUID,
    depth INT,
    path UUID[]
) AS $$
WITH RECURSIVE downstream AS (
    SELECT target_vendor_id AS vendor_id, 1 AS depth, ARRAY[target_vendor_id] AS path
    FROM public.vendor_dependencies
    WHERE source_vendor_id = root_id
    
    UNION ALL
    
    SELECT vd.target_vendor_id, d.depth + 1, d.path || vd.target_vendor_id
    FROM public.vendor_dependencies vd
    INNER JOIN downstream d ON vd.source_vendor_id = d.vendor_id
    WHERE d.depth < max_depth
      AND NOT (vd.target_vendor_id = ANY(d.path)) -- prevent cycles
)
SELECT DISTINCT vendor_id, depth, path FROM downstream;
$$ LANGUAGE sql STABLE;

-- Upstream Recursive Query
CREATE OR REPLACE FUNCTION public.get_upstream_vendors(leaf_id UUID, max_depth INT DEFAULT 5)
RETURNS TABLE (
    vendor_id UUID,
    depth INT,
    path UUID[]
) AS $$
WITH RECURSIVE upstream AS (
    SELECT source_vendor_id AS vendor_id, 1 AS depth, ARRAY[source_vendor_id] AS path
    FROM public.vendor_dependencies
    WHERE target_vendor_id = leaf_id
    
    UNION ALL
    
    SELECT vd.source_vendor_id, u.depth + 1, u.path || vd.source_vendor_id
    FROM public.vendor_dependencies vd
    INNER JOIN upstream u ON vd.target_vendor_id = u.vendor_id
    WHERE u.depth < max_depth
      AND NOT (vd.source_vendor_id = ANY(u.path))
)
SELECT DISTINCT vendor_id, depth, path FROM upstream;
$$ LANGUAGE sql STABLE;

-- Materialized View for Cascading Risk
CREATE MATERIALIZED VIEW IF NOT EXISTS public.supply_chain_risk_scores AS
WITH downstream_ids AS (
    SELECT v.id AS root_id, d.vendor_id
    FROM public.vendors v,
    LATERAL public.get_downstream_vendors(v.id, 5) d
)
SELECT
    di.root_id AS vendor_id,
    COALESCE(AVG(v.risk_score), 0) AS avg_downstream_risk,
    COALESCE(MAX(v.risk_score), 0) AS max_downstream_risk,
    COUNT(di.vendor_id) AS downstream_count
FROM downstream_ids di
JOIN public.vendors v ON v.id = di.vendor_id
GROUP BY di.root_id;

CREATE INDEX IF NOT EXISTS idx_scrs_vendor ON public.supply_chain_risk_scores(vendor_id);

-- 3. Advanced Forecasting Setup
CREATE TABLE IF NOT EXISTS public.vendor_risk_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
    snapshot_date DATE NOT NULL,
    risk_score FLOAT,
    exposure_count INT,
    vulnerability_count INT,
    epss_avg FLOAT,
    port_count INT,
    UNIQUE(vendor_id, snapshot_date)
);

CREATE TABLE IF NOT EXISTS public.vendor_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
    feature_date DATE NOT NULL,
    risk_score FLOAT,
    exposure_count INT,
    vuln_count INT,
    epss_avg FLOAT,
    port_count INT,
    kev_count INT,
    reputation_score FLOAT,
    UNIQUE(vendor_id, feature_date)
);

-- 4. Expand Threat Intelligence Feeds
CREATE TABLE IF NOT EXISTS public.abuseipdb_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_address INET NOT NULL,
    abuse_confidence_score INT,
    total_reports INT,
    last_reported_at TIMESTAMPTZ,
    country TEXT,
    isp TEXT,
    domain TEXT,
    categories TEXT[],
    full_response JSONB,
    checked_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(ip_address)
);

CREATE TABLE IF NOT EXISTS public.greynoise_ip_context (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_address INET NOT NULL,
    classification TEXT,
    name TEXT,
    last_seen TIMESTAMPTZ,
    metadata JSONB,
    checked_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(ip_address)
);

CREATE TABLE IF NOT EXISTS public.otx_pulses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    indicator TEXT NOT NULL,
    indicator_type TEXT,
    pulse_id TEXT,
    pulse_name TEXT,
    created TIMESTAMPTZ,
    tags TEXT[],
    full_data JSONB,
    fetched_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(indicator, pulse_id)
);

CREATE TABLE IF NOT EXISTS public.cve_attck_mapping (
    cve_id TEXT PRIMARY KEY,
    technique_ids TEXT[],
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.nvd_cves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_risk_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.abuseipdb_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.greynoise_ip_context ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otx_pulses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cve_attck_mapping ENABLE ROW LEVEL SECURITY;

-- Simple read policies (assuming internal intelligence data is readable by authenticated users)
CREATE POLICY "Allow authenticated read access to nvd_cves" ON public.nvd_cves FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to vendor_dependencies" ON public.vendor_dependencies FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to vendor_risk_history" ON public.vendor_risk_history FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to vendor_features" ON public.vendor_features FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to threat intelligence" ON public.abuseipdb_reports FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to greynoise" ON public.greynoise_ip_context FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to otx_pulses" ON public.otx_pulses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access to cve_attck_mapping" ON public.cve_attck_mapping FOR SELECT TO authenticated USING (true);
