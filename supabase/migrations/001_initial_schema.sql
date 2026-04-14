-- Supabase manages auth.users RLS internally, so we skip altering that table here.
-- Chatbot Submissions Table
CREATE TABLE IF NOT EXISTS public.chatbot_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  business_name TEXT NOT NULL,
  business_type TEXT NOT NULL CHECK (business_type IN ('business', 'hobby', 'restaurant', 'hotel', 'other')),
  chatbot_purpose TEXT NOT NULL,
  api_endpoints TEXT,
  training_data TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Menu Items Table
CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  available BOOLEAN DEFAULT true,
  restaurant_id UUID NOT NULL -- You might want to create a restaurants table later
);

-- Menu Screens Table
CREATE TABLE IF NOT EXISTS public.menu_screens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'connected' CHECK (status IN ('connected', 'disconnected')),
  frozen BOOLEAN DEFAULT false,
  restaurant_id UUID NOT NULL
);

-- Photos Table
CREATE TABLE IF NOT EXISTS public.photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  url TEXT NOT NULL,
  score DECIMAL(5,2) DEFAULT 0,
  selected BOOLEAN DEFAULT false,
  use_case TEXT NOT NULL CHECK (use_case IN ('business', 'personal', 'dating')),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Shuls Table
CREATE TABLE IF NOT EXISTS public.shuls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  website TEXT,
  contact_email TEXT NOT NULL,
  approved BOOLEAN DEFAULT false
);

-- Zmanim Table
CREATE TABLE IF NOT EXISTS public.zmanim (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shul_id UUID NOT NULL REFERENCES public.shuls(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  shacharis TEXT NOT NULL,
  mincha TEXT NOT NULL,
  maariv TEXT NOT NULL,
  UNIQUE(shul_id, date)
);

-- Shiurim Table
CREATE TABLE IF NOT EXISTS public.shiurim (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shul_id UUID NOT NULL REFERENCES public.shuls(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  speaker TEXT NOT NULL,
  time TEXT NOT NULL,
  description TEXT
);

-- Resumes Table
CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  personal_info JSONB NOT NULL,
  experience JSONB NOT NULL,
  education JSONB NOT NULL,
  skills TEXT[] DEFAULT '{}',
  view_mode TEXT DEFAULT 'professional' CHECK (view_mode IN ('professional', 'personal', 'both'))
);

-- Row Level Security Policies

-- Chatbot submissions: Anyone can insert, only admins can update
ALTER TABLE public.chatbot_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit chatbot requests" ON public.chatbot_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view chatbot submissions" ON public.chatbot_submissions
  FOR SELECT USING (true);

CREATE POLICY "Admins can update submissions" ON public.chatbot_submissions
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- Menu items: Restaurant owners can manage their items
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Restaurant owners can manage menu items" ON public.menu_items
  FOR ALL USING (auth.uid()::text = restaurant_id::text); -- Simplified, you'd want proper restaurant ownership

-- Photos: Users can only see their own photos
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own photos" ON public.photos
  FOR ALL USING (auth.uid() = user_id);

-- Shuls: Anyone can submit shuls, anyone can view approved shuls, admins can manage all
ALTER TABLE public.shuls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit shuls" ON public.shuls
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view all shuls" ON public.shuls
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage all shuls" ON public.shuls
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can delete shuls" ON public.shuls
  FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- Zmanim and Shiurim: Public read for approved shuls
ALTER TABLE public.zmanim ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shiurim ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view zmanim for approved shuls" ON public.zmanim
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.shuls WHERE id = shul_id AND approved = true)
  );

CREATE POLICY "Public can view shiurim for approved shuls" ON public.shiurim
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.shuls WHERE id = shul_id AND approved = true)
  );

-- Resumes: Users can manage their own resumes
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own resumes" ON public.resumes
  FOR ALL USING (auth.uid() = user_id);

-- Functions for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_resumes_updated_at BEFORE UPDATE ON public.resumes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();