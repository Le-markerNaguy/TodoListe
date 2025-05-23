import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/auth"

// Basculer l'état d'une tâche (complétée/non complétée)
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    // Vérifier que la tâche existe et appartient à l'utilisateur
    const existingTask = await prisma.task.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!existingTask) {
      return NextResponse.json({ error: "Tâche non trouvée" }, { status: 404 })
    }

    if (existingTask.userId !== session.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }

    const updatedTask = await prisma.task.update({
      where: {
        id: params.id,
      },
      data: {
        completed: !existingTask.completed,
      },
    })

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error("Erreur lors du basculement de l'état de la tâche:", error)
    return NextResponse.json({ error: "Erreur lors du basculement de l'état de la tâche" }, { status: 500 })
  }
}
