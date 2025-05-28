import { NextResponse } from "next/server"

export async function POST() {
  try {
    // Ne plus gérer de session ni de cookie
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    return NextResponse.json({ error: "Erreur lors de la déconnexion" }, { status: 500 });
  }
}
