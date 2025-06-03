// This route is deprecated. Stateless JWT auth is used; no session is stored or checked.
import { NextResponse } from "next/server"

export async function GET() {
  // Always return null for session (stateless)
  return NextResponse.json(null)
}
