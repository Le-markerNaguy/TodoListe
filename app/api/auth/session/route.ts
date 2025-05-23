import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { verify } from "jsonwebtoken"

export async function GET() {
  try {
    const sessionToken = (await cookies()).get("session_token")?.value

    if (!sessionToken) {
      return NextResponse.json(null)
    }

    try {
      // Vérifier le token
      const decoded = verify(sessionToken, process.env.JWT_SECRET || "secret") as { id: string }

      // Vérifier si la session existe
      const session = await prisma.session.findFirst({
        where: {
          sessionToken,
          expires: {
            gt: new Date(),
          },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })

      if (!session) {
        return NextResponse.json(null)
      }

      return NextResponse.json(session.user)
    } catch (error) {
      console.error("Token invalide:", error)
      return NextResponse.json(null)
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de la session:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération de la session" }, { status: 500 })
  }
}
