import { NextResponse } from "next/server"
import { compare } from "bcrypt"
import { prisma } from "@/lib/prisma"
import { sign } from "jsonwebtoken"
import { cookies } from "next/headers"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(1, { message: "Le mot de passe est requis" }),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validation des données
    const result = loginSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Données invalides", details: result.error.format() }, { status: 400 })
    }

    const { email, password } = result.data

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 })
    }

    // Vérifier le mot de passe
    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 })
    }

    // Créer un token JWT
    const token = sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "secret", { expiresIn: "7d" })

    // Créer une session
    const session = await prisma.session.create({
      data: {
        sessionToken: token,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours
        userId: user.id,
      },
    })

    // Définir le cookie de session
    const cookieStore = await cookies();
    cookieStore.set("session_token", token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60, // 7 jours
    })

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
    })
  } catch (error) {
    console.error("Erreur lors de la connexion:", error)
    return NextResponse.json({ error: "Erreur lors de la connexion" }, { status: 500 })
  }
}
