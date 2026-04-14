import { NextRequest, NextResponse } from 'next/server'

const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize'

/**
 * Initiates GitHub OAuth login flow
 * Redirects user to GitHub authorization page
 */
export async function GET(request: NextRequest) {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID
  const redirectUri = process.env.GITHUB_OAUTH_REDIRECT_URI

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: 'GitHub OAuth is not properly configured' },
      { status: 500 }
    )
  }

  // Generate random state for CSRF protection
  const state = Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)

  // Store state in cookie
  const response = NextResponse.redirect(
    `${GITHUB_AUTHORIZE_URL}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email&state=${state}`
  )

  response.cookies.set('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10, // 10 minutes
    path: '/',
  })

  return response
}
