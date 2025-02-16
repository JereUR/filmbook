"use client"

import { useEffect, useState } from "react"
import type { User } from "@prisma/client"

type AuthState = {
  user: User | null
  isLoading: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
  })

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/auth/user")
        if (response.ok) {
          const user = await response.json()
          setAuthState({
            user,
            isLoading: false,
          })
        } else {
          setAuthState({
            user: null,
            isLoading: false,
          })
        }
      } catch (error) {
        console.error("Error checking auth:", error)
        setAuthState({
          user: null,
          isLoading: false,
        })
      }
    }

    checkAuth()
  }, [])

  return authState
}
