-- Add scheduling fields to vendors
ALTER TABLE public.vendors 
  ADD COLUMN IF NOT EXISTS scan_interval text DEFAULT 'none' CHECK (scan_interval IN ('none', 'daily', 'weekly', 'monthly')),
  ADD COLUMN IF NOT EXISTS last_successful_scan timestamptz,
  ADD COLUMN IF NOT EXISTS next_scheduled_scan timestamptz;

-- Add granular metrics and explainability to scans
ALTER TABLE public.scans 
  ADD COLUMN IF NOT EXISTS risk_breakdown jsonb,
  ADD COLUMN IF NOT EXISTS confidence integer CHECK (confidence BETWEEN 0 AND 100),
  ADD COLUMN IF NOT EXISTS provider_health jsonb,
  ADD COLUMN IF NOT EXISTS scan_metadata jsonb;
