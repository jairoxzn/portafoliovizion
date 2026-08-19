import { Cpu } from "lucide-react";
import { listActiveTechnologies } from "@/actions/technologies";
import { SectionHeading } from "@/components/public/section-heading";
import { EmptyState } from "@/components/ui/empty-state";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Tecnologías",
  description: "Stack tecnológico utilizado por viziontech: Next.js, React, PostgreSQL, Prisma, Tailwind CSS y más.",
  path: "/tecnologias",
});

export default async function TechnologiesPage() {
  const technologies = await listActiveTechnologies();

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 lg:px-6">
      <SectionHeading
        eyebrow="Stack"
        title="Tecnologías"
        description="Herramientas y frameworks que utilizamos para construir sistemas modernos, rápidos y escalables."
      />

      <div className="mt-12">
        {technologies.length === 0 ? (
          <EmptyState icon={Cpu} title="Aún no hay tecnologías registradas" />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {technologies.map((tech) => (
              <div
                key={tech.id}
                className="flex flex-col items-center gap-3 rounded-xl border border-border bg-surface p-6 text-center shadow-sm transition-shadow hover:shadow-md"
              >
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold text-white"
                  style={{ backgroundColor: tech.color || "#1C4E80" }}
                >
                  {tech.icon || tech.name.charAt(0)}
                </span>
                <span className="text-sm font-medium">{tech.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
