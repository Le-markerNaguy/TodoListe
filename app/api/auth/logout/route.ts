import { NextResponse } from "next/server"

export async function POST() {
  // No-op for stateless JWT logout
  return NextResponse.json({ message: "Logged out (stateless)" })
}
