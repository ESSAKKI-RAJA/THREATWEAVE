-- Add dashboard sprint columns to public.vendors
ALTER TABLE public.vendors 
  ADD COLUMN IF NOT EXISTS sector text,
  ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'completed' CHECK (status IN ('queued', 'scanning', 'completed', 'failed')),
  ADD COLUMN IF NOT EXISTS scan_progress integer DEFAULT 100 CHECK (scan_progress BETWEEN 0 AND 100);
