"use client"

import type React from "react"

import { useAuth } from "@/components/auth-provider"
import { useTaskContext } from "@/components/task-provider"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Clock, ListTodo, Star } from "lucide-react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function UserDashboard() {
  const { user } = useAuth()
  const { tasks } = useTaskContext()
  const [completionRate, setCompletionRate] = useState(0)

  useEffect(() => {
    if (tasks.length > 0) {
      const completedTasks = tasks.filter((task) => task.completed).length
      const rate = Math.round((completedTasks / tasks.length) * 100)

      // Animation progressive de la barre de progression
      let start = 0
      const interval = setInterval(() => {
        start += 1
        setCompletionRate(start)
        if (start >= rate) clearInterval(interval)
      }, 20)

      return () => clearInterval(interval)
    }
  }, [tasks])

  const completedTasks = tasks.filter((task) => task.completed).length
  const pendingTasks = tasks.length - completedTasks
  const highPriorityTasks = tasks.filter((task) => task.priority === "high").length

  // Obtenir l'heure actuelle pour personnaliser le message
  const currentHour = new Date().getHours()
  let greeting = "Bonjour"
  if (currentHour < 12) greeting = "Bonjour"
  else if (currentHour < 18) greeting = "Bon après-midi"
  else greeting = "Bonsoir"

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-xl"
      >
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-2">
              {greeting}, {user?.name || "Utilisateur"}
            </h2>
            <p className="text-white/70 mb-4">
              {pendingTasks === 0
                ? "Félicitations ! Toutes vos tâches sont terminées."
                : `Vous avez ${pendingTasks} tâche${pendingTasks > 1 ? "s" : ""} en attente.`}
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/80">Progression</span>
                <span className="text-white font-medium">{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-2 bg-white/20" indicatorClassName="bg-[#56D7EA]" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
            <StatCard icon={<ListTodo className="h-5 w-5 text-[#56D7EA]" />} value={tasks.length} label="Total" />
            <StatCard
              icon={<CheckCircle2 className="h-5 w-5 text-green-400" />}
              value={completedTasks}
              label="Terminées"
            />
            <StatCard icon={<Clock className="h-5 w-5 text-amber-400" />} value={pendingTasks} label="En attente" />
            <StatCard icon={<Star className="h-5 w-5 text-red-400" />} value={highPriorityTasks} label="Prioritaires" />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card className="bg-white/10 backdrop-blur-sm border-white/5 p-3 flex flex-col items-center justify-center text-center h-full">
        <div className="mb-1">{icon}</div>
        <div className="text-xl font-bold text-white">{value}</div>
        <div className="text-xs text-white/70">{label}</div>
      </Card>
    </motion.div>
  )
}
