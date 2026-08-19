import { ClipboardList, Palette, Code2, Rocket } from "lucide-react";
import { SERVICES } from "@/lib/data/services";
import { SectionHeading } from "@/components/public/section-heading";
import { CtaSection } from "@/components/public/cta-section";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Servicios",
  description: "Sistemas empresariales, e-commerce, POS, aplicaciones móviles, automatización e IA a medida.",
  path: "/servicios",
});

const PROCESS = [
  { icon: ClipboardList, title: "Descubrimiento", description: "Entendemos tu negocio y definimos el alcance del sistema." },
  { icon: Palette, title: "Diseño", description: "Diseñamos la arquitectura y la experiencia de usuario." },
  { icon: Code2, title: "Desarrollo", description: "Construimos el sistema con tecnología moderna y buenas prácticas." },
  { icon: Rocket, title: "Lanzamiento", description: "Desplegamos a producción y acompañamos el crecimiento del sistema." },
];

export default function ServicesPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <SectionHeading
          eyebrow="Servicios"
          title="Qué hacemos"
          description="Desarrollamos sistemas, plataformas y soluciones tecnológicas a medida, cubriendo todo el ciclo de vida del producto."
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

        <div className="mt-20">
          <SectionHeading eyebrow="Proceso" title="Cómo trabajamos" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map(({ icon: Icon, title, description }, index) => (
              <div key={title} className="relative rounded-xl border border-border bg-surface p-6 text-center">
                <span className="absolute -top-3 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full brand-gradient text-xs font-bold text-white">
                  {index + 1}
                </span>
                <span className="mx-auto mt-3 flex h-11 w-11 items-center justify-center rounded-lg bg-brand-electric/10 text-brand-electric">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-20">
        <CtaSection />
      </div>
    </div>
  );
}
