"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Search, Filter, X } from "lucide-react"
import { useTaskContext } from "@/components/task-provider"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { motion } from "framer-motion"

export function TaskFilters() {
  const { filters, setFilters } = useTaskContext()
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false)

  const resetFilters = () => {
    setFilters({
      status: "all",
      priority: "all",
      search: "",
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-white">Mes tâches</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            className="md:flex border-blue-500 text-blue-500 hover:bg-blue-500/10 hover:text-blue-600"
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Réinitialiser
          </Button>
        </div>
      </div>

      {/* Filtres pour desktop */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Label htmlFor="search-desktop" className="sr-only">
            Rechercher
          </Label>
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/50" />
          <Input
            id="search-desktop"
            placeholder="Rechercher des tâches..."
            className="pl-8 bg-white/10 border-white/10 text-white placeholder:text-white/50"
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="status-filter-desktop" className="sr-only">
            Filtrer par statut
          </Label>
          <Select
            value={filters.status}
            onValueChange={(value) => setFilters({ status: value as "all" | "active" | "completed" })}
          >
            <SelectTrigger id="status-filter-desktop" className="bg-white/10 border-white/10 text-white">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 backdrop-blur-md border-white/10 text-white">
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="active">À faire</SelectItem>
              <SelectItem value="completed">Terminées</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="priority-filter-desktop" className="sr-only">
            Filtrer par priorité
          </Label>
          <Select
            value={filters.priority}
            onValueChange={(value) =>
              setFilters({
                priority: value as "all" | "low" | "medium" | "high",
              })
            }
          >
            <SelectTrigger id="priority-filter-desktop" className="bg-white/10 border-white/10 text-white">
              <SelectValue placeholder="Filtrer par priorité" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 backdrop-blur-md border-white/10 text-white">
              <SelectItem value="all">Toutes les priorités</SelectItem>
              <SelectItem value="low">Basse</SelectItem>
              <SelectItem value="medium">Moyenne</SelectItem>
              <SelectItem value="high">Haute</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filtres pour mobile */}
      <div className="md:hidden flex items-center gap-2">
        <div className="relative flex-1">
          <Label htmlFor="search-mobile" className="sr-only">
            Rechercher
          </Label>
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/50" />
          <Input
            id="search-mobile"
            placeholder="Rechercher des tâches..."
            className="pl-8 bg-white/10 border-white/10 text-white placeholder:text-white/50"
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
          />
        </div>

        <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="border-white/20 text-white">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filtres</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[50vh] bg-black/80 backdrop-blur-md border-white/10">
            <SheetHeader className="mb-4">
              <SheetTitle className="text-white">Filtres</SheetTitle>
            </SheetHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="status-filter-mobile" className="text-white">
                  Statut
                </Label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => setFilters({ status: value as "all" | "active" | "completed" })}
                >
                  <SelectTrigger id="status-filter-mobile" className="bg-white/10 border-white/10 text-white">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 backdrop-blur-md border-white/10 text-white">
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="active">À faire</SelectItem>
                    <SelectItem value="completed">Terminées</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority-filter-mobile" className="text-white">
                  Priorité
                </Label>
                <Select
                  value={filters.priority}
                  onValueChange={(value) =>
                    setFilters({
                      priority: value as "all" | "low" | "medium" | "high",
                    })
                  }
                >
                  <SelectTrigger id="priority-filter-mobile" className="bg-white/10 border-white/10 text-white">
                    <SelectValue placeholder="Filtrer par priorité" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 backdrop-blur-md border-white/10 text-white">
                    <SelectItem value="all">Toutes les priorités</SelectItem>
                    <SelectItem value="low">Basse</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="high">Haute</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={resetFilters} className="border-white/20 text-white">
                  <X className="h-3.5 w-3.5 mr-1" />
                  Réinitialiser
                </Button>
                <SheetClose asChild>
                  <Button className="bg-[#56D7EA] hover:bg-[#56D7EA]/90">Appliquer</Button>
                </SheetClose>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.div>
  )
}
