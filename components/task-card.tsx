"use client"

import { useState } from "react"
import { type Task, useTaskContext } from "@/components/task-provider"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, GripVertical, Calendar } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
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

type TaskCardProps = {
  task: Task
  onToggleComplete: () => void
}

export function TaskCard({ task, onToggleComplete }: TaskCardProps) {
  const { deleteTask } = useTaskContext()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

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

  return (
    <>
      <Card
        className={`${task.completed ? "opacity-70" : ""} border border-white/10 hover:shadow-md transition-shadow bg-black/30 backdrop-blur-sm`}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex items-center h-6 mt-0.5">
              <GripVertical className="h-4 w-4 text-white/50 cursor-grab" />
            </div>
            <Checkbox
              checked={task.completed}
              onCheckedChange={onToggleComplete}
              id={`task-${task.id}`}
              className="mt-0.5 border-white/30 data-[state=checked]:bg-[#56D7EA] data-[state=checked]:border-[#56D7EA]"
            />
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <label
                    htmlFor={`task-${task.id}`}
                    className={`font-medium text-white ${task.completed ? "line-through text-white/50" : ""}`}
                  >
                    {task.title}
                  </label>
                  <p className={`text-sm text-white/70 ${task.completed ? "line-through text-white/40" : ""}`}>
                    {task.description}
                  </p>
                </div>
                <Badge variant="outline" className={priorityColors[task.priority]}>
                  {priorityLabels[task.priority]}
                </Badge>
              </div>
              {task.dueDate && (
                <div className="flex items-center text-sm text-white/60">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  {format(new Date(task.dueDate), "d MMMM yyyy", {
                    locale: fr,
                  })}
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditDialogOpen(true)}
            className="border-blue-500 text-blue-500 hover:bg-blue-500/10 hover:text-blue-600"
          >
            <Edit className="h-3.5 w-3.5 mr-1" />
            Modifier
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="bg-red-500 text-white hover:bg-red-600 border-none"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Supprimer
          </Button>
        </CardFooter>
      </Card>

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
            <AlertDialogAction
              onClick={() => {
                deleteTask(task.id)
                setIsDeleteDialogOpen(false)
              }}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
