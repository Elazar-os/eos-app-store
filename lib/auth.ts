/**
 * Utility functions for authentication
 */

export interface User {
  id: number
  login: string
  email: string | null
  name: string | null
  avatar_url: string
}

/**
 * Get user data from the 'user' cookie
 * Note: This only works in client components
 */
export function getUserFromCookie(): User | null {
  if (typeof document === 'undefined') {
    return null
  }

  try {
    const userCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('user='))

    if (!userCookie) {
      return null
    }

    const userJson = userCookie.substring('user='.length)
    return JSON.parse(decodeURIComponent(userJson))
  } catch (error) {
    console.error('Failed to parse user cookie:', error)
    return null
  }
}

/**
 * Check if user is authenticated by checking for the github token cookie
 * Note: This check is client-side only and can be spoofed
 * Always validate tokens server-side
 */
export function isAuthenticated(): boolean {
  if (typeof document === 'undefined') {
    return false
  }

  return document.cookie.includes('github_access_token=')
}
