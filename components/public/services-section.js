import { SERVICES } from "@/lib/data/services";
import { SectionHeading } from "@/components/public/section-heading";

export function ServicesSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 lg:px-6">
      <SectionHeading
        eyebrow="Servicios"
        title="Qué hacemos"
        description="Cubrimos todo el ciclo de vida de tu producto digital, del diseño a la puesta en producción."
      />

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map(({ icon: Icon, title, description }) => (
          <div key={title} className="rounded-xl border border-border bg-surface p-6 shadow-sm transition-shadow hover:shadow-md">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-electric/10 text-brand-electric">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
