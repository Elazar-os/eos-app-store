import { NextRequest, NextResponse } from 'next/server'

/**
 * Middleware to protect authenticated routes
 * Redirects unauthenticated users to login page
 */
export function middleware(request: NextRequest) {
  const token = request.cookies.get('github_access_token')?.value
  const { pathname } = request.nextUrl

  // List of routes that require authentication
  const protectedRoutes = ['/dashboard', '/profile']

  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  )

  // If route is protected and no token, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// Apply middleware to specific routes
export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'],
}
