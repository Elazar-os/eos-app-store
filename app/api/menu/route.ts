import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

type MenuItem = {
  id: string
  item_name: string
  description: string | null
  price: string
  category: string
  screen_type: 'main' | 'sushi'
  screen_number: number
  priority: number
  enabled: boolean
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

async function loadStaticMenu(request: NextRequest, type: string, screenNumber: number) {
  const jsonPath = `/menu-${type}-${screenNumber}.json`
  const response = await fetch(`${request.nextUrl.origin}${jsonPath}`)
  if (!response.ok) {
    throw new Error(`Unable to load ${jsonPath}`)
  }
  const payload = await response.json()
  return payload.data ?? payload
}

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get('screentype') ?? 'main'
  const number = request.nextUrl.searchParams.get('screennumber') ?? '1'

  if (!['main', 'sushi'].includes(type)) {
    return NextResponse.json({ success: false, error: 'Invalid screentype' }, { status: 400 })
  }

  const parsed = Number(number)
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 3) {
    return NextResponse.json({ success: false, error: 'Invalid screennumber' }, { status: 400 })
  }

  const supabase = getSupabase()

  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('menu_sync_items')
        .select('*')
        .eq('screen_type', type)
        .eq('screen_number', parsed)
        .eq('enabled', true)
        .order('priority', { ascending: true })

      if (!error && data && data.length > 0) {
        return NextResponse.json({
          success: true,
          data,
          source: 'supabase',
          timestamp: new Date().toISOString(),
        })
      }
    }

    const payload = await loadStaticMenu(request, type, parsed)
    return NextResponse.json({
      success: true,
      data: payload,
      source: 'static',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Menu fetch failed'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const supabase = getSupabase()
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'Supabase is not configured' }, { status: 500 })
  }

  const body = await request.json()
  const payload = {
    item_name: String(body.item_name ?? '').trim(),
    description: body.description ? String(body.description) : null,
    price: String(body.price ?? '').trim(),
    category: String(body.category ?? '').trim(),
    screen_type: body.screen_type,
    screen_number: Number(body.screen_number),
    priority: Number(body.priority ?? 0),
    enabled: body.enabled !== false,
  }

  if (!payload.item_name || !payload.price || !payload.category) {
    return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
  }
  if (!['main', 'sushi'].includes(payload.screen_type)) {
    return NextResponse.json({ success: false, error: 'Invalid screen_type' }, { status: 400 })
  }
  if (!Number.isInteger(payload.screen_number) || payload.screen_number < 1 || payload.screen_number > 3) {
    return NextResponse.json({ success: false, error: 'Invalid screen_number' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('menu_sync_items')
    .insert(payload)
    .select('*')
    .single<MenuItem>()

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data })
}

export async function PATCH(request: NextRequest) {
  const supabase = getSupabase()
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'Supabase is not configured' }, { status: 500 })
  }

  const body = await request.json()
  const id = String(body.id ?? '')
  if (!id) {
    return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 })
  }

  const updates: Partial<MenuItem> = {}
  const fields: Array<keyof MenuItem> = ['item_name', 'description', 'price', 'category', 'screen_type', 'screen_number', 'priority', 'enabled']

  for (const field of fields) {
    if (field in body) {
      ;(updates as Record<string, unknown>)[field] = body[field]
    }
  }

  const { data, error } = await supabase
    .from('menu_sync_items')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single<MenuItem>()

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data })
}

export async function DELETE(request: NextRequest) {
  const supabase = getSupabase()
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'Supabase is not configured' }, { status: 500 })
  }

  const id = request.nextUrl.searchParams.get('id')
  if (!id) {
    return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 })
  }

  const { error } = await supabase.from('menu_sync_items').delete().eq('id', id)
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
