import { getFeaturedProjects } from "@/actions/projects";
import { SectionHeading } from "@/components/public/section-heading";
import { ProjectCard } from "@/components/public/project-card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export async function FeaturedProjectsSection() {
  const projects = await getFeaturedProjects(6);

  if (projects.length === 0) return null;

  return (
    <section className="bg-surface-muted/40 py-20">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <SectionHeading
          eyebrow="Portafolio"
          title="Proyectos destacados"
          description="Una selección de sistemas y plataformas que hemos desarrollado para nuestros clientes."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button href="/proyectos" variant="outline">
            Ver todos los proyectos
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
