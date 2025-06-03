import { verify } from "jsonwebtoken"

// Stateless JWT authentication: get user from JWT in Authorization header
export async function getUserFromToken(token: string | undefined) {
  if (!token) return null
  try {
    // Remove 'Bearer ' prefix if present
    const jwt = token.startsWith("Bearer ") ? token.slice(7) : token
    const decoded = verify(jwt, process.env.JWT_SECRET || "secret") as { id: string; name?: string; email?: string }
    return { id: decoded.id, name: decoded.name, email: decoded.email }
  } catch (error) {
    console.error("Invalid JWT:", error)
    return null
  }
}
