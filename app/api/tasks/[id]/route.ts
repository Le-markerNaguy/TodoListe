import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { verify } from "jsonwebtoken"

function getUserFromAuthHeader(request: Request) {
  const auth = request.headers.get("authorization")
  if (!auth || !auth.startsWith("Bearer ")) return null
  const token = auth.replace("Bearer ", "")
  try {
    return verify(token, process.env.JWT_SECRET || "secret") as { id: string; email: string }
  } catch {
    return null
  }
}

// Récupérer une tâche spécifique
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const user = getUserFromAuthHeader(request)
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }
  try {
    const task = await prisma.task.findUnique({
      where: { id: params.id },
    })
    if (!task) {
      return NextResponse.json({ error: "Tâche non trouvée" }, { status: 404 })
    }
    if (task.userId !== user.id) {
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
  const user = getUserFromAuthHeader(request)
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }
  try {
    const body = await request.json()
    // Validation des données
    const result = taskUpdateSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Données invalides", details: result.error.format() }, { status: 400 })
    }
    // Vérifier que la tâche existe
    const existingTask = await prisma.task.findUnique({
      where: { id: params.id },
    })
    if (!existingTask) {
      return NextResponse.json({ error: "Tâche non trouvée" }, { status: 404 })
    }
    if (existingTask.userId !== user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }
    const { title, description, priority, dueDate, completed } = result.data
    const updatedTask = await prisma.task.update({
      where: { id: params.id },
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
  const user = getUserFromAuthHeader(request)
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }
  try {
    // Vérifier que la tâche existe
    const existingTask = await prisma.task.findUnique({
      where: { id: params.id },
    })
    if (!existingTask) {
      return NextResponse.json({ error: "Tâche non trouvée" }, { status: 404 })
    }
    if (existingTask.userId !== user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }
    await prisma.task.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur lors de la suppression de la tâche:", error)
    return NextResponse.json({ error: "Erreur lors de la suppression de la tâche" }, { status: 500 })
  }
}
