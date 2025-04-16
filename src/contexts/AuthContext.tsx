"use client"

import { createContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "@/types"
import {
  login as loginService,
  register as registerService,
  logout as logoutService,
  getCurrentUser,
} from "@/services/authService"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: Omit<User, "id" | "teams"> & { password: string }) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const userData = await getCurrentUser()
        setUser(userData)
      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const userData = await loginService(email, password)
      setUser(userData)
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: Omit<User, "id" | "teams"> & { password: string }) => {
    setLoading(true)
    try {
      await registerService(userData)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    logoutService()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
