import { cookies } from "next/headers"
import { prisma } from "./prisma"
import { verify } from "jsonwebtoken"

export async function getServerSession() {
  return null
}
