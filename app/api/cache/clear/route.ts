import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(request: Request) {
  try {
    const origin = new URL(request.url).origin
    await fetch(`${origin}/api/screen-state`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ incrementVersion: true }),
    })
  } catch {
    // Keep endpoint best-effort for static mode.
  }

  return NextResponse.json({ success: true, message: 'Cache clear requested.' })
}
