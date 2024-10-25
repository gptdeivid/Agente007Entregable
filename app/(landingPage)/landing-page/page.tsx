import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowRight, Target, Rocket, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F5] text-[#333333] overflow-x-hidden">
      <header className="px-4 lg:px-6 h-14 flex items-center justify-between border-b border-[#60A2B1] bg-white">
        <Link className="flex items-center justify-center" href="#">
          <span className="font-bold text-2xl text-[#60A2B1]">Agente007</span>
        </Link>
        <nav className="flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-[#60A2B1] transition-colors" href="#features">
            Características
          </Link>
          <Link className="text-sm font-medium hover:text-[#60A2B1] transition-colors" href="#how-it-works">
            Cómo Funciona
          </Link>
          <Link className="text-sm font-medium hover:text-[#60A2B1] transition-colors" href="#contact">
            Contacto
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-[#60A2B1] text-white">
          <div className="container mx-auto px-4 md:px-6 max-w-full">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">

                <div className="flex items-center justify-center mb-20">

                <Image src="https://placehold.co/2400x1200/png" alt="Logo" width={1000} height={1000} className="rounded-lg" />  
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none font-primary
                tracking-wide">
                  Valida tu Idea de Negocio con Agente007
                </h1>
                <p className="mx-auto max-w-[700px] text-white md:text-xl">
                  Guía integral para emprendedores que buscan alcanzar el Product Market Fit de manera rápida y eficiente.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/">
                <Button className="bg-[#FFCE4F] text-[#333333] hover:bg-[#FFD873] transition-colors font-secondary" > 
                  Comienza Ahora
                </Button>
                </Link>
                <Button variant="outline" className="text-black border-white hover:bg-white hover:text-[#60A2B1] transition-colors font-secondary">
                  Aprende Más
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container mx-auto px-4 md:px-6 max-w-full">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 text-[#60A2B1]">
              Características Principales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-[#F5F5F5] text-[#333333] border-[#60A2B1] border-2">
                <CardHeader>
                  <Target className="w-8 h-8 mb-2 text-[#60A2B1]" />
                  <CardTitle>Validación Integral</CardTitle>
                </CardHeader>
                <CardContent>
                  Proceso completo de validación de ideas para asegurar el éxito de tu negocio.
                </CardContent>
              </Card>
              <Card className="bg-[#F5F5F5] text-[#333333] border-[#60A2B1] border-2">
                <CardHeader>
                  <Rocket className="w-8 h-8 mb-2 text-[#60A2B1]" />
                  <CardTitle>Rápido Product Market Fit</CardTitle>
                </CardHeader>
                <CardContent>
                  Alcanza el ajuste producto-mercado en las etapas tempranas de tu emprendimiento.
                </CardContent>
              </Card>
              <Card className="bg-[#F5F5F5] text-[#333333] border-[#60A2B1] border-2">
                <CardHeader>
                  <Users className="w-8 h-8 mb-2 text-[#60A2B1]" />
                  <CardTitle>Guía Experta</CardTitle>
                </CardHeader>
                <CardContent>
                  Asesoramiento personalizado para navegar el proceso de validación con confianza.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-[#F5F5F5]">
          <div className="container mx-auto px-4 md:px-6 max-w-full">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 text-[#60A2B1]">
              Cómo Funciona
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                "Análisis de tu idea de negocio",
                "Identificación del mercado objetivo",
                "Desarrollo de prototipos rápidos",
                "Pruebas con usuarios reales",
                "Iteración basada en feedback",
                "Validación del Product Market Fit"
              ].map((step, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <CheckCircle className="w-6 h-6 text-[#60A2B1]" />
                  <p className="text-lg font-medium text-[#333333]">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="cta" className="w-full py-12 md:py-24 lg:py-32 bg-[#60A2B1] text-white">
          <div className="container mx-auto px-4 md:px-6 max-w-full">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                Comienza tu Viaje hacia el Éxito
              </h2>
              <p className="mx-auto max-w-[600px] text-white md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                No esperes más para validar tu idea de negocio. Agente007 te guiará en cada paso del camino.
              </p>
              <Button className="bg-[#FFCE4F] text-[#333333] hover:bg-[#FFD873] transition-colors">
                Contacta con Nosotros
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center justify-between px-4 md:px-6 border-t border-[#60A2B1] bg-white">
        <p className="text-xs text-[#60A2B1]">© 2024 Agente007. Todos los derechos reservados.</p>
        <nav className="flex gap-4 sm:gap-6">
          <Link className="text-xs hover:text-[#60A2B1] transition-colors" href="#">
            Términos de Servicio
          </Link>
          <Link className="text-xs hover:text-[#60A2B1] transition-colors" href="#">
            Privacidad
          </Link>
        </nav>
      </footer>
    </div>
  )
}