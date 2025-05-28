"use client"

import type React from "react"

import { createContext, useContext } from "react"
import { useState, useEffect } from "react"
import { jwtDecode } from "jwt-decode"

type User = {
  id: string
  name: string
  email: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Décoder le JWT pour obtenir l'utilisateur
  function decodeUser(token: string): User | null {
    try {
      const decoded: any = jwtDecode(token)
      return { id: decoded.id, name: decoded.name || "", email: decoded.email }
    } catch {
      return null
    }
  }

  // Charger le token au démarrage
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (token) {
      const user = decodeUser(token)
      setUser(user)
    }
    setLoading(false)
  }, [])

  // Login
  const login = async (email: string, password: string) => {
    setLoading(true)
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (data.token) {
      localStorage.setItem("token", data.token)
      setUser(decodeUser(data.token))
    } else {
      setUser(null)
    }
    setLoading(false)
  }

  // Register
  const register = async (name: string, email: string, password: string) => {
    setLoading(true)
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })
    const data = await res.json()
    if (data.token) {
      localStorage.setItem("token", data.token)
      setUser(decodeUser(data.token))
    } else {
      setUser(null)
    }
    setLoading(false)
  }

  // Logout
  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider")
  }
  return context
}
