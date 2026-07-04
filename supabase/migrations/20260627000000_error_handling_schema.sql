-- supabase/migrations/20260627000000_error_handling_schema.sql
CREATE TABLE error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  error_message TEXT NOT NULL,
  error_stack TEXT,
  context JSONB,
  user_id UUID REFERENCES profiles(id),
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_error_logs_timestamp ON error_logs(timestamp DESC);
CREATE INDEX idx_error_logs_user_id ON error_logs(user_id);

ALTER TABLE scans ADD COLUMN IF NOT EXISTS data_completeness JSONB;
ALTER TABLE scans ADD COLUMN IF NOT EXISTS confidence_score FLOAT;

-- Enable RLS
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own errors"
  ON error_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all errors"
  ON error_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
