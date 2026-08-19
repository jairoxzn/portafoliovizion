import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] dark:opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-brand-electric), transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-24 lg:px-6 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-brand-electric" />
            Desarrollo de software a medida
          </span>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Transformamos ideas en{" "}
            <span className="brand-gradient-text">soluciones digitales</span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground">
            Desarrollamos sistemas, plataformas y soluciones tecnológicas a medida para potenciar tu negocio.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/proyectos" size="lg">
              Ver proyectos
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/contacto" size="lg" variant="outline">
              Solicitar proyecto
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
