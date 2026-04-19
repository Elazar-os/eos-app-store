import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

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

  const jsonPath = `/menu-${type}-${parsed}.json`
  const origin = request.nextUrl.origin

  try {
    const response = await fetch(`${origin}${jsonPath}`)
    if (!response.ok) {
      throw new Error(`Unable to load ${jsonPath}`)
    }

    const payload = await response.json()
    return NextResponse.json({
      success: true,
      data: payload.data ?? payload,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Menu fetch failed'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
