"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GradientButton } from "@/components/gradient-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { z } from "zod"
import { useTaskContext, type Task, type TaskPriority } from "@/components/task-provider"

const taskSchema = z.object({
  title: z.string().min(1, { message: "Le titre est requis" }),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.string().optional().nullable(),
})

type TaskFormProps = {
  task?: Task
  onSuccess: () => void
}

export function TaskForm({ task, onSuccess }: TaskFormProps) {
  const { addTask, updateTask } = useTaskContext()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<{
    title: string
    description: string
    priority: TaskPriority
    dueDate: string | null
  }>({
    title: task?.title || "",
    description: task?.description || "",
    priority: task?.priority || "medium",
    dueDate: task?.dueDate || null,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Effacer l'erreur lorsque l'utilisateur modifie le champ
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handlePriorityChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      priority: value as TaskPriority,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Valider les données du formulaire
      const result = taskSchema.safeParse(formData)

      if (!result.success) {
        const formattedErrors: Record<string, string> = {}
        result.error.errors.forEach((error) => {
          if (error.path[0]) {
            formattedErrors[error.path[0].toString()] = error.message
          }
        })
        setErrors(formattedErrors)
        return
      }

      // Si la validation réussit, ajouter ou mettre à jour la tâche
      if (task) {
        updateTask(task.id, {
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          dueDate: formData.dueDate,
        })
      } else {
        addTask({
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          dueDate: formData.dueDate,
          completed: false,
        })
      }

      onSuccess()
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-white">
            Titre *
          </Label>
          <Input
            id="title"
            name="title"
            placeholder="Titre de la tâche"
            value={formData.title}
            onChange={handleChange}
            disabled={isLoading}
            className={`${errors.title ? "border-destructive" : "border-white/20"} bg-white/10 text-white placeholder:text-white/50`}
          />
          {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-white">
            Description
          </Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Description de la tâche"
            value={formData.description}
            onChange={handleChange}
            disabled={isLoading}
            rows={3}
            className="border-white/20 bg-white/10 text-white placeholder:text-white/50"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="priority" className="text-white">
              Priorité
            </Label>
            <Select value={formData.priority} onValueChange={handlePriorityChange} disabled={isLoading}>
              <SelectTrigger id="priority" className="border-white/20 bg-white/10 text-white">
                <SelectValue placeholder="Sélectionner une priorité" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 backdrop-blur-md border-white/10 text-white">
                <SelectItem value="low">Basse</SelectItem>
                <SelectItem value="medium">Moyenne</SelectItem>
                <SelectItem value="high">Haute</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate" className="text-white">
              Date d'échéance
            </Label>
            <Input
              id="dueDate"
              name="dueDate"
              type="date"
              value={formData.dueDate || ""}
              onChange={handleChange}
              disabled={isLoading}
              className="border-white/20 bg-white/10 text-white"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onSuccess}
          disabled={isLoading}
          className="border-white/20 text-white hover:bg-white/10"
        >
          Annuler
        </Button>
        <GradientButton type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {task ? "Mise à jour..." : "Création..."}
            </>
          ) : task ? (
            "Mettre à jour"
          ) : (
            "Créer"
          )}
        </GradientButton>
      </div>
    </form>
  )
}
