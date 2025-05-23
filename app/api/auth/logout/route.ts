import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { verify } from "jsonwebtoken"

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token")?.value;

    if (sessionToken) {
      try {
        // Vérifier le token
        const decoded = verify(sessionToken, process.env.JWT_SECRET || "secret");

        // Supprimer la session
        await prisma.session.deleteMany({
          where: {
            sessionToken,
          },
        });
      } catch (error) {
        console.error("Token invalide:", error);
      }

      // Supprimer le cookie de façon fiable
      cookieStore.set("session_token", "", { path: "/", expires: new Date(0) });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    return NextResponse.json({ error: "Erreur lors de la déconnexion" }, { status: 500 });
  }
}
