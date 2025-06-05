import { NextResponse } from "next/server"

export async function POST() {
  // Supprimer le cookie httpOnly
  const response = NextResponse.json({ message: "Déconnecté" })
  response.headers.set(
    "Set-Cookie",
    "jwt_token=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax"
  )
  return response
}
