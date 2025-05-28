"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

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
  const router = useRouter()
  const pathname = usePathname()

  // Vérifier si l'utilisateur est connecté au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/session")
        const contentType = response.headers.get("content-type")
        let data = null
        if (contentType && contentType.includes("application/json")) {
          data = await response.json()
        } else {
          const text = await response.text()
          throw new Error("Réponse inattendue du serveur: " + text)
        }

        if (data && data.id) {
          setUser(data)
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Rediriger l'utilisateur en fonction de son état d'authentification
  useEffect(() => {
    if (!loading) {
      const publicRoutes = ["/", "/login", "/register"]
      const isPublicRoute = publicRoutes.includes(pathname)

      if (!user && !isPublicRoute) {
        router.push("/login")
      } else if (user && (pathname === "/login" || pathname === "/register")) {
        router.push("/tasks")
      }
    }
  }, [user, loading, pathname, router])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Erreur de connexion")
      }

      const userData = await response.json()
      setUser(userData)
      // Redirige vers /tasks/[id] si id existe, sinon /tasks
      if (userData && userData.id) {
        router.push(`/tasks/${userData.id}`)
      } else {
        router.push("/tasks")
      }
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur TaskMaster!",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    setLoading(true)
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Erreur d'inscription")
      }

      const userData = await response.json()
      setUser(userData)
      // Redirige vers /tasks/[id] si id existe, sinon /tasks
      if (userData && userData.id) {
        router.push(`/tasks/${userData.id}`)
      } else {
        router.push("/tasks")
      }
      toast({
        title: "Inscription réussie",
        description: "Bienvenue sur TaskMaster!",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })

      setUser(null)
      router.push("/login")
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
      })
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
      toast({
        variant: "destructive",
        title: "Erreur de déconnexion",
        description: "Une erreur est survenue lors de la déconnexion.",
      })
    }
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
