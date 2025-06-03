import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromToken } from "@/lib/auth"
import { z } from "zod"

// Récupérer toutes les tâches de l'utilisateur
export async function GET(req: NextRequest) {
  // Accept JWT from either Authorization header or cookie for flexibility
  let auth = req.headers.get("authorization") || undefined
  if (!auth && req.cookies.has("jwt_token")) {
    auth = req.cookies.get("jwt_token")?.value
  }
  const user = await getUserFromToken(auth)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const tasks = await prisma.task.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } })
  return NextResponse.json(tasks)
}

// Créer une nouvelle tâche
const taskSchema = z.object({
  title: z.string().min(1, { message: "Le titre est requis" }),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.string().optional().nullable(),
})

export async function POST(request: NextRequest) {
  // Accept JWT from either Authorization header or cookie for flexibility
  let auth = request.headers.get("authorization") || undefined
  if (!auth && request.cookies.has("jwt_token")) {
    auth = request.cookies.get("jwt_token")?.value
  }
  const user = await getUserFromToken(auth)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
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
        userId: user.id,
      },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de la création de la tâche:", error)
    return NextResponse.json({ error: "Erreur lors de la création de la tâche" }, { status: 500 })
  }
}
