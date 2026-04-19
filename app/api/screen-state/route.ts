import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export async function GET() {
  const supabase = getSupabase()

  if (supabase) {
    const { data, error } = await supabase
      .from('menu_sync_state')
      .select('*')
      .eq('id', 'global')
      .single()

    if (!error && data) {
      return NextResponse.json({
        frozen: data.frozen,
        version: `v${data.version}`,
        featured: data.featured ?? null,
        updatedAt: data.updated_at,
      })
    }
  }

  return NextResponse.json({
    frozen: false,
    version: 'v1',
    featured: null,
    updatedAt: new Date().toISOString(),
  })
}

export async function POST(request: Request) {
  const supabase = getSupabase()
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'Supabase is not configured' }, { status: 500 })
  }

  const body = await request.json()
  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }

  if ('frozen' in body) updates.frozen = Boolean(body.frozen)
  if ('featured' in body) updates.featured = body.featured
  if ('incrementVersion' in body && body.incrementVersion) {
    const { data } = await supabase
      .from('menu_sync_state')
      .select('version')
      .eq('id', 'global')
      .single()
    updates.version = (data?.version ?? 1) + 1
  }

  const { data, error } = await supabase
    .from('menu_sync_state')
    .upsert({ id: 'global', ...updates })
    .select('*')
    .single()

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data })
}
