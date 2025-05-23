import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/auth"
import { z } from "zod"

// Récupérer une tâche spécifique
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const task = await prisma.task.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!task) {
      return NextResponse.json({ error: "Tâche non trouvée" }, { status: 404 })
    }

    // Vérifier que la tâche appartient à l'utilisateur
    if (task.userId !== session.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error("Erreur lors de la récupération de la tâche:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération de la tâche" }, { status: 500 })
  }
}

// Mettre à jour une tâche
const taskUpdateSchema = z.object({
  title: z.string().min(1, { message: "Le titre est requis" }).optional(),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  dueDate: z.string().optional().nullable(),
  completed: z.boolean().optional(),
})

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const body = await request.json()

    // Validation des données
    const result = taskUpdateSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Données invalides", details: result.error.format() }, { status: 400 })
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

    const { title, description, priority, dueDate, completed } = result.data

    const updatedTask = await prisma.task.update({
      where: {
        id: params.id,
      },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(priority && { priority }),
        ...(dueDate !== undefined && {
          dueDate: dueDate ? new Date(dueDate) : null,
        }),
        ...(completed !== undefined && { completed }),
      },
    })

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la tâche:", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour de la tâche" }, { status: 500 })
  }
}

// Supprimer une tâche
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
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

    await prisma.task.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur lors de la suppression de la tâche:", error)
    return NextResponse.json({ error: "Erreur lors de la suppression de la tâche" }, { status: 500 })
  }
}
