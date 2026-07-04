
ALTER TABLE public.scans ADD COLUMN IF NOT EXISTS github_data JSONB;

CREATE OR REPLACE FUNCTION public.match_threat_signatures(
  query_embedding vector(1536),
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  apt_group_name text,
  description text,
  indicators jsonb,
  similarity float
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    t.id,
    t.apt_group_name,
    t.description,
    t.indicators,
    1 - (t.embedding <=> query_embedding) AS similarity
  FROM public.threat_signatures t
  WHERE t.embedding IS NOT NULL
  ORDER BY t.embedding <=> query_embedding
  LIMIT match_count;
$$;

GRANT EXECUTE ON FUNCTION public.match_threat_signatures(vector, int) TO authenticated;
