import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromToken } from "@/lib/auth"

// Basculer l'état d'une tâche (complétée/non complétée)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = req.headers.get("authorization") || undefined
  const user = await getUserFromToken(auth)

  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  // Vérifier que la tâche existe et appartient à l'utilisateur
  const existingTask = await prisma.task.findUnique({
    where: {
      id: params.id,
    },
  })

  if (!existingTask || existingTask.userId !== user.id) {
    return NextResponse.json({ error: "Tâche non trouvée" }, { status: 404 })
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
}
