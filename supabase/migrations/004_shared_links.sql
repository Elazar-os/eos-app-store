-- Shared Links Table for secure profile sharing with expiration
CREATE TABLE IF NOT EXISTS public.shared_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  token TEXT NOT NULL UNIQUE,
  profile_type TEXT NOT NULL CHECK (profile_type IN ('professional', 'personal', 'both')),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0
);

-- Index for fast token lookups
CREATE INDEX idx_shared_links_token ON public.shared_links(token);
CREATE INDEX idx_shared_links_expires_at ON public.shared_links(expires_at);

-- RLS Policies
ALTER TABLE public.shared_links ENABLE ROW LEVEL SECURITY;

-- Users can manage their own shared links
CREATE POLICY "Users can manage their own shared links" ON public.shared_links
  FOR ALL USING (auth.uid() = user_id);

-- Anyone can view active, non-expired shared links (for the shared page access)
CREATE POLICY "Anyone can view active shared links" ON public.shared_links
  FOR SELECT USING (is_active = true AND expires_at > NOW());

-- Function to clean up expired links
CREATE OR REPLACE FUNCTION cleanup_expired_shared_links()
RETURNS void AS $$
BEGIN
  UPDATE public.shared_links 
  SET is_active = false 
  WHERE expires_at < NOW() AND is_active = true;
END;
$$ LANGUAGE plpgsql;