import { cookies } from "next/headers"
import { prisma } from "./prisma"
import { verify } from "jsonwebtoken"

export async function getServerSession() {
  const sessionToken = (await cookies()).get("session_token")?.value

  if (!sessionToken) {
    return null
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
      return null
    }

    return session.user
  } catch (error) {
    console.error("Token invalide:", error)
    return null
  }
}
