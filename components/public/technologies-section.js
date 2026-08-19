import { listActiveTechnologies } from "@/actions/technologies";
import { SectionHeading } from "@/components/public/section-heading";

export async function TechnologiesSection() {
  const technologies = await listActiveTechnologies();

  if (technologies.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 lg:px-6">
      <SectionHeading
        eyebrow="Stack"
        title="Tecnologías con las que trabajamos"
        description="Elegimos la herramienta correcta para cada proyecto, priorizando rendimiento y escalabilidad."
      />

      <div className="mt-12 flex flex-wrap justify-center gap-3">
        {technologies.map((tech) => (
          <span
            key={tech.id}
            className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium shadow-sm"
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: tech.color || "#999" }} />
            {tech.name}
          </span>
        ))}
      </div>
    </section>
  );
}
