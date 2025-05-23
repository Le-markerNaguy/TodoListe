"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { type Task, useTaskContext } from "@/components/task-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { ArrowLeft, Calendar, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { TaskForm } from "@/components/task-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Image from "next/image"

export default function TaskDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { tasks, deleteTask } = useTaskContext()
  const [task, setTask] = useState<Task | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`/api/tasks/${params.id}`)

        if (!response.ok) {
          if (response.status === 404) {
            router.push("/tasks")
            return
          }
          throw new Error("Erreur lors de la récupération de la tâche")
        }

        const data = await response.json()
        setTask(data)
      } catch (error) {
        console.error("Erreur:", error)
        router.push("/tasks")
      }
    }

    if (params.id) {
      fetchTask()
    }
  }, [params.id, router])

  if (!task) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p className="text-white">Chargement...</p>
      </div>
    )
  }

  const priorityColors = {
    low: "bg-white/10 text-[#56D7EA] border border-[#56D7EA]/30",
    medium: "bg-[#B0FCF5]/10 text-[#B0FCF5] border border-[#B0FCF5]/30",
    high: "bg-red-500/10 text-red-400 border border-red-400/30",
  }

  const priorityLabels = {
    low: "Basse",
    medium: "Moyenne",
    high: "Haute",
  }

  const handleDelete = async () => {
    await deleteTask(task.id)
    router.push("/tasks")
  }

  return (
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
        <header className="border-b border-white/10 bg-black/30 backdrop-blur-md">
          <div className="container flex h-16 items-center justify-between py-4">
            <Link href="/" className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">TaskMaster</h1>
            </Link>
          </div>
        </header>
        <main className="flex-1 container py-6">
          <div className="mb-6">
            <Button variant="outline" asChild className="border-white/20 text-white hover:bg-white/10">
              <Link href="/tasks" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Retour aux tâches
              </Link>
            </Button>
          </div>

          <Card className="max-w-3xl mx-auto bg-black/30 backdrop-blur-md border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl text-white">{task.title}</CardTitle>
              <Badge variant="outline" className={priorityColors[task.priority]}>
                {priorityLabels[task.priority]}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-1 text-white">Description</h3>
                <p className="text-white/70">{task.description || "Aucune description"}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div>
                  <h3 className="font-medium mb-1 text-white">Statut</h3>
                  <Badge
                    variant={task.completed ? "success" : "secondary"}
                    className="bg-white/10 text-white border-white/20"
                  >
                    {task.completed ? "Terminée" : "À faire"}
                  </Badge>
                </div>
                {task.dueDate && (
                  <div>
                    <h3 className="font-medium mb-1 text-white">Date d'échéance</h3>
                    <div className="flex items-center text-white/70">
                      <Calendar className="h-4 w-4 mr-1" />
                      {format(new Date(task.dueDate), "d MMMM yyyy", {
                        locale: fr,
                      })}
                    </div>
                  </div>
                )}
                <div>
                  <h3 className="font-medium mb-1 text-white">Créée le</h3>
                  <div className="text-white/70">
                    {format(new Date(task.createdAt), "d MMMM yyyy", {
                      locale: fr,
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(true)}
                className="border-blue-500 text-blue-500 hover:bg-blue-500/10 hover:text-blue-600"
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
              <Button
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="bg-red-800 text-white hover:bg-red-600 border-none"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </CardFooter>
          </Card>
        </main>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px] bg-black/80 backdrop-blur-md border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">Modifier la tâche</DialogTitle>
            </DialogHeader>
            <TaskForm task={task} onSuccess={() => setIsEditDialogOpen(false)} />
          </DialogContent>
        </Dialog>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent className="bg-black/80 backdrop-blur-md border-white/10">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Êtes-vous sûr ?</AlertDialogTitle>
              <AlertDialogDescription className="text-white/70">
                Cette action ne peut pas être annulée. La tâche sera définitivement supprimée.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-white/20 text-white hover:bg-white/10">Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-500 text-white hover:bg-red-600">
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
