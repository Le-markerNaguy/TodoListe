import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromToken } from "@/lib/auth"
import { z } from "zod"

// Récupérer une tâche spécifique
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = req.headers.get("authorization") || undefined
  const user = await getUserFromToken(auth)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const task = await prisma.task.findUnique({ where: { id: params.id } })
  if (!task || task.userId !== user.id) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(task)
}

// Mettre à jour une tâche
const taskUpdateSchema = z.object({
  title: z.string().min(1, { message: "Le titre est requis" }).optional(),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  dueDate: z.string().optional().nullable(),
  completed: z.boolean().optional(),
})

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = req.headers.get("authorization") || undefined
  const user = await getUserFromToken(auth)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const existingTask = await prisma.task.findUnique({ where: { id: params.id } })
  if (!existingTask || existingTask.userId !== user.id) return NextResponse.json({ error: "Not found" }, { status: 404 })
  const data = await req.json()
  const updated = await prisma.task.update({ where: { id: params.id }, data })
  return NextResponse.json(updated)
}

// Supprimer une tâche
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = req.headers.get("authorization") || undefined
  const user = await getUserFromToken(auth)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const existingTask = await prisma.task.findUnique({ where: { id: params.id } })
  if (!existingTask || existingTask.userId !== user.id) return NextResponse.json({ error: "Not found" }, { status: 404 })
  await prisma.task.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
