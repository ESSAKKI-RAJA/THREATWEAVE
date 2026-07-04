-- Add Clerk user ID support to profiles
-- This allows mapping Clerk authentication to Supabase RLS policies

-- Add clerk_id column to profiles table
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'clerk_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN clerk_id TEXT UNIQUE;
  END IF;
END $$;

-- Add role column if not present
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'analyst'
      CHECK (role IN ('admin', 'analyst', 'viewer'));
  END IF;
END $$;

-- Add image_url column if not present
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN image_url TEXT;
  END IF;
END $$;

-- Add last_login column if not present
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'last_login'
  ) THEN
    ALTER TABLE profiles ADD COLUMN last_login TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- Index on clerk_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_profiles_clerk_id ON profiles(clerk_id);
