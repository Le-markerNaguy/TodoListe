"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"

export type TaskPriority = "low" | "medium" | "high"

export type Task = {
  id: string
  title: string
  description: string
  completed: boolean
  priority: TaskPriority
  dueDate: string | null
  createdAt: string
}

type TaskFilters = {
  status: "all" | "active" | "completed"
  priority: "all" | TaskPriority
  search: string
}

type TaskContextType = {
  tasks: Task[]
  filters: TaskFilters
  setFilters: (filters: Partial<TaskFilters>) => void
  filteredTasks: Task[]
  addTask: (task: Omit<Task, "id" | "createdAt">) => Promise<void>
  updateTask: (id: string, updates: Partial<Omit<Task, "id" | "createdAt">>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  toggleTaskCompletion: (id: string) => Promise<void>
  tasksLoading: boolean // Ajouté ici
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filters, setFilters] = useState<TaskFilters>({
    status: "all",
    priority: "all",
    search: "",
  })
  const { toast } = useToast()
  const [tasksLoading, setTasksLoading] = useState(true)

  // Charger les tâches au démarrage
  const fetchTasks = async () => {
    setTasksLoading(true)
    try {
      // Get JWT from localStorage
      const token = typeof window !== "undefined" ? localStorage.getItem("jwt_token") : null
      const response = await fetch("/api/tasks", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const contentType = response.headers.get("content-type")
      let data = null
      if (contentType && contentType.includes("application/json")) {
        data = await response.json()
      } else {
        const text = await response.text()
        throw new Error("Réponse inattendue du serveur: " + text)
      }
      setTasks(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Erreur lors du chargement des tâches:", error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger vos tâches. Veuillez réessayer.",
      })
    } finally {
      setTasksLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [toast])

  // Filtrer les tâches en fonction des filtres actuels
  const filteredTasks = tasks.filter((task) => {
    // Filtre par statut
    if (filters.status === "active" && task.completed) return false
    if (filters.status === "completed" && !task.completed) return false

    // Filtre par priorité
    if (filters.priority !== "all" && task.priority !== filters.priority) return false

    // Filtre par recherche
    if (
      filters.search &&
      !task.title.toLowerCase().includes(filters.search.toLowerCase()) &&
      !task.description.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false
    }

    return true
  })

  // Ajouter une nouvelle tâche
  const addTask = async (task: Omit<Task, "id" | "createdAt">) => {
    try {
      // Récupérer le JWT du localStorage
      const token = typeof window !== "undefined" ? localStorage.getItem("jwt_token") : null
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(task),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout de la tâche")
      }

      const newTask = await response.json()
      setTasks((prev) => [newTask, ...prev])

      toast({
        title: "Tâche ajoutée",
        description: "La tâche a été ajoutée avec succès.",
      })
    } catch (error) {
      console.error("Erreur lors de l'ajout de la tâche:", error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter la tâche. Veuillez réessayer.",
      })
      throw error
    }
  }

  // Mettre à jour une tâche existante
  const updateTask = async (id: string, updates: Partial<Omit<Task, "id" | "createdAt">>) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour de la tâche")
      }

      const updatedTask = await response.json()
      setTasks((prev) => prev.map((task) => (task.id === id ? updatedTask : task)))

      toast({
        title: "Tâche mise à jour",
        description: "La tâche a été mise à jour avec succès.",
      })
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la tâche:", error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour la tâche. Veuillez réessayer.",
      })
      throw error
    }
  }

  // Supprimer une tâche
  const deleteTask = async (id: string) => {
    try {
      // Récupérer le JWT du localStorage
      const token = typeof window !== "undefined" ? localStorage.getItem("jwt_token") : null
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de la tâche")
      }

      setTasks((prev) => prev.filter((task) => task.id !== id))

      toast({
        title: "Tâche supprimée",
        description: "La tâche a été supprimée avec succès.",
      })
    } catch (error) {
      console.error("Erreur lors de la suppression de la tâche:", error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la tâche. Veuillez réessayer.",
      })
      throw error
    }
  }

  // Basculer l'état d'achèvement d'une tâche
  const toggleTaskCompletion = async (id: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}/toggle`, {
        method: "PATCH",
      })

      if (!response.ok) {
        throw new Error("Erreur lors du basculement de l'état de la tâche")
      }

      const updatedTask = await response.json()
      setTasks((prev) => prev.map((task) => (task.id === id ? updatedTask : task)))
    } catch (error) {
      console.error("Erreur lors du basculement de l'état de la tâche:", error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour l'état de la tâche. Veuillez réessayer.",
      })
      throw error
    }
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filters,
        setFilters: (newFilters) => setFilters((prev) => ({ ...prev, ...newFilters })),
        filteredTasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        tasksLoading,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export function useTaskContext() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error("useTaskContext doit être utilisé à l'intérieur d'un TaskProvider")
  }
  return context
}
