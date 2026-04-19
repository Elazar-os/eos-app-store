-- Menu SyncScreen tables for editable menu and live screen state

CREATE TABLE IF NOT EXISTS public.menu_sync_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  item_name TEXT NOT NULL,
  description TEXT,
  price TEXT NOT NULL,
  category TEXT NOT NULL,
  screen_type TEXT NOT NULL CHECK (screen_type IN ('sushi', 'main')),
  screen_number INT NOT NULL CHECK (screen_number BETWEEN 1 AND 3),
  priority INT NOT NULL DEFAULT 0,
  enabled BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_menu_sync_items_screen ON public.menu_sync_items (screen_type, screen_number, priority);

CREATE TABLE IF NOT EXISTS public.menu_sync_state (
  id TEXT PRIMARY KEY DEFAULT 'global',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  version INT NOT NULL DEFAULT 1,
  frozen BOOLEAN NOT NULL DEFAULT FALSE,
  featured JSONB
);

INSERT INTO public.menu_sync_state (id)
VALUES ('global')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.menu_sync_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_sync_state ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read menu sync items" ON public.menu_sync_items;
DROP POLICY IF EXISTS "Public can insert menu sync items" ON public.menu_sync_items;
DROP POLICY IF EXISTS "Public can update menu sync items" ON public.menu_sync_items;
DROP POLICY IF EXISTS "Public can delete menu sync items" ON public.menu_sync_items;

CREATE POLICY "Public can read menu sync items" ON public.menu_sync_items FOR SELECT USING (true);
CREATE POLICY "Public can insert menu sync items" ON public.menu_sync_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update menu sync items" ON public.menu_sync_items FOR UPDATE USING (true);
CREATE POLICY "Public can delete menu sync items" ON public.menu_sync_items FOR DELETE USING (true);

DROP POLICY IF EXISTS "Public can read menu sync state" ON public.menu_sync_state;
DROP POLICY IF EXISTS "Public can insert menu sync state" ON public.menu_sync_state;
DROP POLICY IF EXISTS "Public can update menu sync state" ON public.menu_sync_state;
CREATE POLICY "Public can read menu sync state" ON public.menu_sync_state FOR SELECT USING (true);
CREATE POLICY "Public can insert menu sync state" ON public.menu_sync_state FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update menu sync state" ON public.menu_sync_state FOR UPDATE USING (true);
