"use client"

import { useTaskContext } from "@/components/task-provider"
import { TaskCard } from "@/components/task-card"
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProps } from "react-beautiful-dnd"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export function TaskList() {
  const { filteredTasks, toggleTaskCompletion } = useTaskContext()
  const [tasks, setTasks] = useState(filteredTasks)
  const [isMounted, setIsMounted] = useState(false)

  // Mettre à jour les tâches lorsque les filtres changent
  useEffect(() => {
    setTasks(filteredTasks)
  }, [filteredTasks])

  // Éviter l'erreur d'hydratation avec react-beautiful-dnd
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Remplacer DropResult par any pour éviter l'erreur de namespace
  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(tasks)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setTasks(items)
  }

  if (!isMounted) {
    // Rendu sans drag-and-drop pendant le SSR
    return (
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12 border border-dashed border-white/30 rounded-lg bg-black/20 backdrop-blur-sm"
          >
            <p className="text-white/70">Aucune tâche trouvée. Créez votre première tâche !</p>
          </motion.div>
        ) : (
          tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <TaskCard task={task} onToggleComplete={() => toggleTaskCompletion(task.id)} />
            </motion.div>
          ))
        )}
      </div>
    )
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="tasks" isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false}>
        {(provided: any) => {
          return (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {tasks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-12 border border-dashed border-white/30 rounded-lg bg-black/20 backdrop-blur-sm"
                >
                  <p className="text-white/70">Aucune tâche trouvée. Créez votre première tâche !</p>
                </motion.div>
              ) : (
                tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided: any) => (
                      <motion.div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <TaskCard task={task} onToggleComplete={() => toggleTaskCompletion(task.id)} />
                      </motion.div>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </div>
          )
        }}
      </Droppable>
    </DragDropContext>
  )
}
