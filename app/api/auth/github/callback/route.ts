import { NextRequest, NextResponse } from 'next/server'

const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token'
const GITHUB_API_URL = 'https://api.github.com'

interface GitHubUser {
  id: number
  login: string
  email: string | null
  name: string | null
  avatar_url: string
}

/**
 * Exchange GitHub authorization code for access token and user info
 */
async function exchangeCodeForToken(code: string): Promise<{
  accessToken: string
  user: GitHubUser
}> {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('GitHub OAuth credentials not configured')
  }

  // Exchange code for access token
  const tokenResponse = await fetch(GITHUB_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }),
  })

  const tokenData = await tokenResponse.json()

  if (tokenData.error) {
    throw new Error(`GitHub OAuth error: ${tokenData.error}`)
  }

  if (!tokenData.access_token) {
    throw new Error('No access token received from GitHub')
  }

  // Fetch user information using access token
  const userResponse = await fetch(`${GITHUB_API_URL}/user`, {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  })

  if (!userResponse.ok) {
    throw new Error('Failed to fetch GitHub user information')
  }

  const user: GitHubUser = await userResponse.json()

  return {
    accessToken: tokenData.access_token,
    user,
  }
}

/**
 * Authentication postback handler for OAuth tunnel/callback
 * This endpoint handles GitHub OAuth callback with the authorization code
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    // Handle OAuth errors
    if (error) {
      const errorDescription = searchParams.get('error_description')
      const redirectUrl = new URL('/auth/error', request.url)
      redirectUrl.searchParams.set('error', error)
      if (errorDescription) {
        redirectUrl.searchParams.set('description', errorDescription)
      }
      return NextResponse.redirect(redirectUrl)
    }

    // Validate authorization code
    if (!code) {
      const redirectUrl = new URL('/auth/error', request.url)
      redirectUrl.searchParams.set('error', 'missing_code')
      redirectUrl.searchParams.set('description', 'Authorization code not provided')
      return NextResponse.redirect(redirectUrl)
    }

    // Exchange code for token and get user info
    const { accessToken, user } = await exchangeCodeForToken(code)

    // Create response and set secure cookie
    const response = NextResponse.redirect(new URL('/dashboard', request.url))

    // Set httpOnly, secure cookie with session data
    // In production, you should store the session in a database/cache
    response.cookies.set('github_access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    })

    response.cookies.set(
      'user',
      JSON.stringify({
        id: user.id,
        login: user.login,
        email: user.email,
        name: user.name,
        avatar_url: user.avatar_url,
      }),
      {
        httpOnly: false, // Allow client-side access for user profile display
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      }
    )

    return response
  } catch (error) {
    console.error('Auth postback error:', error)
    const redirectUrl = new URL('/auth/error', request.url)
    redirectUrl.searchParams.set('error', 'authentication_failed')
    redirectUrl.searchParams.set(
      'description',
      error instanceof Error ? error.message : 'An unknown error occurred'
    )
    return NextResponse.redirect(redirectUrl)
  }
}

export async function POST(request: NextRequest) {
  // Support POST requests as well
  return GET(request)
}
