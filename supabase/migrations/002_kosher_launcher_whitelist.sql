-- Kosher launcher whitelist profiles and approved apps

CREATE TABLE IF NOT EXISTS kosher_launcher_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  owner_github_id BIGINT NOT NULL,
  owner_login TEXT NOT NULL,
  profile_name TEXT NOT NULL DEFAULT 'Primary Device',
  platform TEXT NOT NULL DEFAULT 'android' CHECK (platform IN ('android', 'ios', 'shared')),
  strict_mode BOOLEAN NOT NULL DEFAULT TRUE,
  install_code TEXT UNIQUE DEFAULT encode(gen_random_bytes(9), 'hex'),
  UNIQUE (owner_github_id, profile_name)
);

CREATE TABLE IF NOT EXISTS kosher_launcher_apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  profile_id UUID NOT NULL REFERENCES kosher_launcher_profiles(id) ON DELETE CASCADE,
  app_name TEXT NOT NULL,
  app_id TEXT,
  category TEXT NOT NULL DEFAULT 'General',
  is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (profile_id, app_name)
);

ALTER TABLE kosher_launcher_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE kosher_launcher_apps ENABLE ROW LEVEL SECURITY;

-- MVP policy: open CRUD while auth is cookie-based and not Supabase Auth.
-- Replace with owner-based policies when moving auth into Supabase.
CREATE POLICY "Public can read launcher profiles"
  ON kosher_launcher_profiles FOR SELECT USING (true);
CREATE POLICY "Public can insert launcher profiles"
  ON kosher_launcher_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update launcher profiles"
  ON kosher_launcher_profiles FOR UPDATE USING (true);
CREATE POLICY "Public can delete launcher profiles"
  ON kosher_launcher_profiles FOR DELETE USING (true);

CREATE POLICY "Public can read launcher apps"
  ON kosher_launcher_apps FOR SELECT USING (true);
CREATE POLICY "Public can insert launcher apps"
  ON kosher_launcher_apps FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update launcher apps"
  ON kosher_launcher_apps FOR UPDATE USING (true);
CREATE POLICY "Public can delete launcher apps"
  ON kosher_launcher_apps FOR DELETE USING (true);

DROP TRIGGER IF EXISTS update_kosher_launcher_profiles_updated_at ON kosher_launcher_profiles;
CREATE TRIGGER update_kosher_launcher_profiles_updated_at
  BEFORE UPDATE ON kosher_launcher_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
