import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST() {
  return NextResponse.json({ success: true, message: 'Cache clear acknowledged (static mode).' })
}
