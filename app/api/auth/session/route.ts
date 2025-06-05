// This route is deprecated. Stateless JWT auth is used; no session is stored or checked.
import { NextRequest, NextResponse } from "next/server"
import { getUserFromToken } from "@/lib/auth"

export async function GET(req: NextRequest) {
  // Récupère le JWT depuis le cookie httpOnly
  const token = req.cookies.get("jwt_token")?.value
  const user = await getUserFromToken(token)
  if (!user) return NextResponse.json({ user: null }, { status: 200 })
  return NextResponse.json({ user }, { status: 200 })
}
