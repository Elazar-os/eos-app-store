import { NextRequest, NextResponse } from 'next/server'

/**
 * Logout endpoint - clears session cookies and redirects to home
 */
export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/', request.url))

  // Clear auth cookies
  response.cookies.delete('github_access_token')
  response.cookies.delete('user')
  response.cookies.delete('oauth_state')

  return response
}
