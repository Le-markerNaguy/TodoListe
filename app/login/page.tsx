import { LoginForm } from "@/components/login-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function LoginPage() {
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
              <Link href="/register">
                <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-500/10 hover:text-blue-600">
                  Inscription
                </Button>
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md space-y-8">
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-8 border border-white/10 shadow-xl">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-white">Connexion</h1>
                <p className="text-sm text-white/70 mt-2">Entrez vos identifiants pour accéder à votre compte</p>
              </div>
              <LoginForm />
              <div className="text-center text-sm mt-6">
                <p className="text-white/70">
                  Vous n&apos;avez pas de compte?{" "}
                  <Link href="/register" className="font-medium text-[#B0FCF5] hover:underline">
                    Inscrivez-vous
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
