import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// API route to clean expired sessions from the database
export async function POST(req: NextRequest) {
  const now = new Date()
  const result = await prisma.session.deleteMany({
    where: {
      expires: {
        lt: now,
      },
    },
  })
  return NextResponse.json({ deleted: result.count })
}

