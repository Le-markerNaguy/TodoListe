'use client'

import { TaskList } from "@/components/task-list"
import { TaskHeader } from "@/components/task-header"
import { TaskFilters } from "@/components/task-filters"
import { TaskProvider, useTaskContext } from "@/components/task-provider"
import { UserDashboard } from "@/components/user-dashboard"
import Image from "next/image"
import { useAuth } from "@/components/auth-provider"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

function TasksContent() {
  const { tasksLoading } = useTaskContext()

  if (tasksLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black/60">
        <span className="text-white text-lg animate-pulse">Chargement...</span>
      </div>
    )
  }
  return (
    <>
      <TaskHeader />
      <main className="flex-1 container py-6">
        <UserDashboard />
        <div className="mt-8 space-y-6">
          <TaskFilters />
          <TaskList />
        </div>
      </main>
    </>
  )
}

export default function TasksPage() {
  const { loading, user } = useAuth()
  const router = useRouter()

  // Redirection si non connecté (sécurité côté client)
  useEffect(() => {
    if (!loading && !user) {
      router?.push("/login")
    }
  }, [loading, user, router])

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black/60">
        <span className="text-white text-lg animate-pulse">Chargement...</span>
      </div>
    )
  }

  return (
    <TaskProvider>
      <div className="flex min-h-screen flex-col">
        {/* Image de fond */}
        <div className="fixed inset-0 z-0">
          <Image
            src="/images/user-background.png"
            alt="Background"
            fill
            priority
            className="object-cover"
            quality={100}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />
        </div>

        {/* Contenu */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <TasksContent />
        </div>
      </div>
    </TaskProvider>
  )
}
