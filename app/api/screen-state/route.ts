import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET() {
  return NextResponse.json({
    frozen: false,
    version: 'v1',
    featured: null,
    updatedAt: new Date().toISOString(),
  })
}
