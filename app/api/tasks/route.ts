import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/auth"
import { z } from "zod"

// Récupérer toutes les tâches de l'utilisateur
export async function GET() {
  try {
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const tasks = await prisma.task.findMany({
      where: {
        userId: session.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des tâches" }, { status: 500 })
  }
}

// Créer une nouvelle tâche
const taskSchema = z.object({
  title: z.string().min(1, { message: "Le titre est requis" }),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.string().optional().nullable(),
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const body = await request.json()

    // Validation des données
    const result = taskSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Données invalides", details: result.error.format() }, { status: 400 })
    }

    const { title, description, priority, dueDate } = result.data

    const task = await prisma.task.create({
      data: {
        title,
        description: description || "",
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: session.id,
      },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de la création de la tâche:", error)
    return NextResponse.json({ error: "Erreur lors de la création de la tâche" }, { status: 500 })
  }
}
