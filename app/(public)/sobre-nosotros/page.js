import { Target, Rocket, ShieldCheck, Users } from "lucide-react";
import { getDashboardStatsPublic } from "@/actions/stats";
import { SectionHeading } from "@/components/public/section-heading";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Sobre nosotros",
  description: "Conoce a viziontech: empresa de desarrollo de software especializada en soluciones a medida.",
  path: "/sobre-nosotros",
});

const VALUES = [
  {
    icon: Target,
    title: "Enfoque en resultados",
    description: "Cada sistema se diseña para resolver un problema real del negocio, no solo para verse bien.",
  },
  {
    icon: Rocket,
    title: "Tecnología moderna",
    description: "Trabajamos con stacks actuales y probados en producción, priorizando rendimiento y escalabilidad.",
  },
  {
    icon: ShieldCheck,
    title: "Calidad y seguridad",
    description: "Código limpio, buenas prácticas y seguridad desde el diseño en cada proyecto que entregamos.",
  },
  {
    icon: Users,
    title: "Cercanía con el cliente",
    description: "Acompañamos todo el proceso, desde la idea inicial hasta el sistema funcionando en producción.",
  },
];

export default async function AboutPage() {
  const stats = await getDashboardStatsPublic();

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 lg:px-6">
      <SectionHeading
        eyebrow="Sobre nosotros"
        title="Somos viziontech"
        description="Una empresa de desarrollo de software enfocada en transformar ideas en soluciones digitales reales, funcionales y listas para producción."
      />

      <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat value={stats.projects} label="Proyectos" />
        <Stat value={stats.categories} label="Categorías" />
        <Stat value={stats.technologies} label="Tecnologías" />
        <Stat value={stats.clients} label="Clientes" />
      </div>

      <div className="mt-16 grid gap-5 sm:grid-cols-2">
        {VALUES.map(({ icon: Icon, title, description }) => (
          <div key={title} className="rounded-xl border border-border bg-surface p-6 shadow-sm">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-electric/10 text-brand-electric">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 rounded-2xl border border-border bg-surface p-8 lg:p-10">
        <h2 className="text-xl font-semibold">Nuestra misión</h2>
        <p className="mt-3 text-muted-foreground">
          Ayudar a negocios de todos los tamaños a digitalizar y optimizar sus operaciones mediante sistemas a
          medida, combinando tecnología moderna con un acompañamiento cercano en cada etapa del proyecto.
        </p>
      </div>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 text-center shadow-sm">
      <p className="text-2xl font-bold text-brand-electric">{value}+</p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
