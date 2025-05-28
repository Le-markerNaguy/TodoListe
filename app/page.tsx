import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

export default function Home() {
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
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">TaskMaster</h1>
            </div>
            <nav className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" className="text-white hover:text-white/80 hover:bg-white/10">
                  Connexion
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-[#56D7EA] hover:bg-[#56D7EA]/90">Inscription</Button>
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1 flex items-center">
          <section className="container py-12 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tighter text-white">
                    Gérez vos tâches efficacement
                    <span className="block text-[#B0FCF5]">avec une interface moderne et intuitive</span>
                  </h1>
                  <p className="max-w-[700px] text-lg text-white/80">
                    TaskMaster vous aide à organiser votre travail, suivre vos progrès et atteindre vos objectifs.
                    Simple, rapide et sécurisé.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/register">
                    <Button size="lg" className="gap-2 bg-[#56D7EA] hover:bg-[#56D7EA]/90 w-full sm:w-auto">
                      Commencer maintenant
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border border-white bg-white text-black hover:bg-gray-100 transition-colors duration-200 w-full sm:w-auto"
                    >
                      Se connecter
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-xl">
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white">Comment ça marche</h2>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-[#56D7EA] flex items-center justify-center text-[#FFFFFF] shrink-0">
                        1
                      </div>
                      <div>
                        <h3 className="font-medium text-white">Créez un compte</h3>
                        <p className="text-sm text-white/70">Inscrivez-vous en quelques secondes</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-[#B0FCF5] flex items-center justify-center text-[#1A1A1A] shrink-0">
                        2
                      </div>
                      <div>
                        <h3 className="font-medium text-white">Ajoutez vos tâches</h3>
                        <p className="text-sm text-white/70">Organisez votre travail avec des priorités</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-[#56D7EA] flex items-center justify-center text-[#FFFFFF] shrink-0">
                        3
                      </div>
                      <div>
                        <h3 className="font-medium text-white">Suivez votre progression</h3>
                        <p className="text-sm text-white/70">Visualisez et gérez vos tâches facilement</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <footer className="border-t border-white/10 py-6 bg-black/20 backdrop-blur-sm">
          <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-white/70">
              &copy; {new Date().getFullYear()} TaskMaster. Tous droits réservés.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
