"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import Link from "next/link"
import { LogOut, Plus, Menu, X, Home } from "lucide-react"
import { useState } from "react"
import { TaskForm } from "@/components/task-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { motion } from "framer-motion"

export function TaskHeader() {
  const { user, logout } = useAuth()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="border-b border-white/10 bg-black/30 backdrop-blur-md sticky top-0 z-50"
    >
      <div className="container flex h-16 items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-white">TaskMaster</h1>
        </Link>

        {/* Version desktop */}
        <div className="hidden md:flex items-center gap-4">
          <span className="text-white font-medium mr-2">{user?.name || "Utilisateur"}</span>
          <Button onClick={() => setIsDialogOpen(true)} className="bg-[#56D7EA] hover:bg-[#56D7EA]/90 gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle tâche
          </Button>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-white hover:text-white/80 hover:bg-white/10">
                <Home className="h-4 w-4" />
                <span className="sr-only">Accueil</span>
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              title="Déconnexion"
              className="text-white hover:text-white/80 hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Déconnexion</span>
            </Button>
          </div>
        </div>

        {/* Version mobile */}
        <div className="md:hidden flex items-center">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px] bg-black/80 backdrop-blur-md border-white/10">
              <div className="flex flex-col h-full py-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-white">Menu</h2>
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} className="text-white">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4 flex-1">
                  <div className="border-b border-white/10 pb-4">
                    <p className="text-sm font-medium text-white">{user?.name || "Utilisateur"}</p>
                    <p className="text-xs text-white/70">{user?.email || ""}</p>
                  </div>
                  <Button
                    onClick={() => {
                      setIsDialogOpen(true)
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full bg-[#56D7EA] hover:bg-[#56D7EA]/90 gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Nouvelle tâche
                  </Button>
                  <Link href="/" className="block">
                    <Button variant="ghost" className="w-full text-white justify-start">
                      <Home className="h-4 w-4 mr-2" />
                      Accueil
                    </Button>
                  </Link>
                </div>
                <Button
                  variant="outline"
                  onClick={logout}
                  className="mt-auto w-full border-white/20 text-white hover:bg-white/10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-black/80 backdrop-blur-md border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Ajouter une nouvelle tâche</DialogTitle>
          </DialogHeader>
          <TaskForm onSuccess={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </motion.header>
  )
}
