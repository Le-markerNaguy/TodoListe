import { RegisterForm } from "@/components/register-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function RegisterPage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Image de fond */}
      <div className="absolute inset-0 z-0">
        <Image src="/images/background.png" alt="Background" fill priority className="object-cover" quality={100} />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Contenu */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="container flex h-16 items-center justify-between py-4">
            <Link href="/" className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">TaskMaster</h1>
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  Connexion
                </Button>
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md space-y-8">
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-8 border border-white/10 shadow-xl">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-white">Créer un compte</h1>
                <p className="text-sm text-white/70 mt-2">Inscrivez-vous pour commencer à gérer vos tâches</p>
              </div>
              <RegisterForm />
              <div className="text-center text-sm mt-6">
                <p className="text-white/70">
                  Vous avez déjà un compte?{" "}
                  <Link href="/login" className="font-medium text-[#B0FCF5] hover:underline">
                    Connectez-vous
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
