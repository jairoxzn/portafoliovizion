import { FolderKanban } from "lucide-react";
import { listPublicProjects } from "@/actions/projects";
import { listCategories } from "@/actions/categories";
import { ProjectsSearch } from "@/components/public/projects-search";
import { ProjectCard } from "@/components/public/project-card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/public/section-heading";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Proyectos",
  description: "Explora los sistemas, plataformas y soluciones tecnológicas desarrolladas por viziontech.",
  path: "/proyectos",
});

export default async function ProjectsPage({ searchParams }) {
  const params = await searchParams;
  const q = params?.q || "";
  const category = params?.category || "";

  const [projects, categories] = await Promise.all([
    listPublicProjects({ q, category }),
    listCategories(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 lg:px-6">
      <SectionHeading
        eyebrow="Portafolio"
        title="Nuestros proyectos"
        description="Sistemas, plataformas y soluciones tecnológicas desarrolladas por viziontech."
      />

      <div className="mt-10">
        <ProjectsSearch categories={categories} />
      </div>

      <div className="mt-12">
        {projects.length === 0 ? (
          <EmptyState
            icon={FolderKanban}
            title="No encontramos proyectos"
            description="Prueba con otra búsqueda o revisa más tarde: seguimos agregando proyectos nuevos."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
