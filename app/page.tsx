import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Users, Award, Calendar, BookOpen } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 px-6 py-20 text-white">
        <div className="absolute inset-0 bg-[url('/pathfinder-scouts-camping.jpg')] bg-cover bg-center opacity-10" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-5xl font-bold leading-tight md:text-6xl lg:text-7xl">
            Plataforma Digital de Conquistadores
          </h1>
          <p className="mb-8 text-xl text-blue-100 md:text-2xl">
            Gestiona tu club, completa especialidades y conecta con conquistadores de todo el mundo
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              <Link href="/auth/sign-up">
                Comenzar ahora <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 bg-transparent"
            >
              <Link href="/auth/login">Iniciar sesión</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-4xl font-bold text-gray-900">Todo lo que necesitas en un solo lugar</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Gestión de Clubes</h3>
              <p className="text-gray-600">Administra miembros, directores y coordinadores de tu club digital</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
                <Award className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Especialidades</h3>
              <p className="text-gray-600">Completa cursos en línea y obtén certificados de especialidades</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Eventos</h3>
              <p className="text-gray-600">Participa en camporees, entrenamientos y actividades especiales</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100">
                <BookOpen className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Recursos</h3>
              <p className="text-gray-600">Accede a blogs, materiales educativos y contenido exclusivo</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-20 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-4xl font-bold">¿Listo para comenzar tu aventura?</h2>
          <p className="mb-8 text-xl text-blue-100">
            Únete a miles de conquistadores que ya están usando nuestra plataforma
          </p>
          <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
            <Link href="/auth/sign-up">
              Crear cuenta gratis <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 px-6 py-8 text-center text-gray-400">
        <p>&copy; 2025 Conquistadores. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}
