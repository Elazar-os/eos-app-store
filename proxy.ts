import { NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const token = request.cookies.get('github_access_token')?.value
  const { pathname } = request.nextUrl

  // List of routes that require authentication
  const protectedRoutes = ['/dashboard']

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
  matcher: ['/dashboard/:path*'],
}
