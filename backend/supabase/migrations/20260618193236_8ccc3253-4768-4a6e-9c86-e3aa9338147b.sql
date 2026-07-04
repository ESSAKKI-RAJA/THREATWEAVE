
-- Extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============== updated_at helper ==============
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ============== role enum + user_roles (RBAC) ==============
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin','analyst','user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can read their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ============== vendors ==============
CREATE TABLE public.vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  domain text NOT NULL,
  risk_score integer NOT NULL DEFAULT 0 CHECK (risk_score BETWEEN 0 AND 100),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, domain)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vendors TO authenticated;
GRANT ALL ON public.vendors TO service_role;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own vendors" ON public.vendors
  FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER vendors_set_updated_at BEFORE UPDATE ON public.vendors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX vendors_user_idx ON public.vendors(user_id);
CREATE INDEX vendors_domain_idx ON public.vendors(domain);

-- ============== scans ==============
CREATE TABLE public.scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scan_date timestamptz NOT NULL DEFAULT now(),
  crt_sh_data jsonb,
  shodan_data jsonb,
  virustotal_data jsonb,
  narrative jsonb,
  risk_score integer CHECK (risk_score BETWEEN 0 AND 100),
  errors jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.scans TO authenticated;
GRANT ALL ON public.scans TO service_role;
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own scans" ON public.scans
  FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX scans_vendor_idx ON public.scans(vendor_id);
CREATE INDEX scans_user_idx ON public.scans(user_id);
CREATE INDEX scans_date_idx ON public.scans(scan_date DESC);

-- ============== threat_signatures ==============
CREATE TABLE public.threat_signatures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  apt_group_name text NOT NULL,
  description text,
  indicators jsonb NOT NULL DEFAULT '{}'::jsonb,
  embedding vector(1536),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.threat_signatures TO authenticated;
GRANT ALL ON public.threat_signatures TO service_role;
ALTER TABLE public.threat_signatures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Any signed-in user can read threat signatures"
  ON public.threat_signatures FOR SELECT TO authenticated USING (true);

CREATE POLICY "Only admins can insert threat signatures"
  ON public.threat_signatures FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update threat signatures"
  ON public.threat_signatures FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete threat signatures"
  ON public.threat_signatures FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER threat_signatures_set_updated_at BEFORE UPDATE ON public.threat_signatures
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX threat_signatures_embedding_idx
  ON public.threat_signatures USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
