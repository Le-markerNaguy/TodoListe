import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    // Supprimer le cookie JWT côté client (optionnel, pour compatibilité)
    const cookieStore = await cookies();
    cookieStore.set("session_token", "", { path: "/", expires: new Date(0) });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    return NextResponse.json({ error: "Erreur lors de la déconnexion" }, { status: 500 });
  }
}
