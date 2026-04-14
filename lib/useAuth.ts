'use client'

import { useState, useEffect } from 'react'
import type { User } from './auth'
import { getUserFromCookie, isAuthenticated } from './auth'

/**
 * Hook to access the currently logged-in user
 * Returns null if not authenticated
 * Example:
 *   const user = useUser()
 *   if (!user) return <Login />
 *   return <div>Welcome, {user.name}!</div>
 */
export function useUser(): User | null {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setUser(getUserFromCookie())
    setIsLoading(false)
  }, [])

  return isLoading ? null : user
}

/**
 * Hook to check authentication status
 * Example:
 *   const authenticated = useAuth()
 *   return authenticated ? <Dashboard /> : <Login />
 */
export function useAuth(): boolean {
  const [authenticated, setAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setAuthenticated(isAuthenticated())
    setIsLoading(false)
  }, [])

  return isLoading ? false : authenticated
}
