import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 lg:px-6">
      <div className="brand-gradient relative overflow-hidden rounded-2xl px-6 py-14 text-center text-white sm:px-12">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">¿Tienes un proyecto en mente?</h2>
        <p className="mx-auto mt-4 max-w-xl text-white/90">
          Cuéntanos qué necesitas y te ayudamos a convertirlo en un sistema real, funcional y listo para producción.
        </p>
        <div className="mt-8">
          <Button href="/contacto" variant="outline" size="lg" className="border-white bg-white text-brand-cobalt hover:bg-white/90">
            Solicitar proyecto
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
