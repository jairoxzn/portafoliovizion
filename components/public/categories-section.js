import { ExternalLink, ArrowRight } from "lucide-react";
import { listPublicCategoriesWithProjects } from "@/actions/categories";
import { SectionHeading } from "@/components/public/section-heading";
import { Button } from "@/components/ui/button";
import { truncate, primaryProjectLink } from "@/lib/utils";

export async function CategoriesSection() {
  const categories = await listPublicCategoriesWithProjects();

  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 lg:px-6">
      <SectionHeading
        eyebrow="Soluciones"
        title="Soluciones por rubro"
        description="Sistemas de venta, páginas web y catálogos con panel administrativo, organizados por tipo de negocio."
      />

      <div className="mt-12 space-y-14">
        {categories.map((category) => (
          <div key={category.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
              <h3 className="text-xl font-bold">{category.name}</h3>
              <Button
                href={`/proyectos?category=${category.slug}`}
                variant="link"
                size="sm"
              >
                Ver todo
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
            {category.description && (
              <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
            )}

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {category.projects.map((project) => {
                const link = primaryProjectLink(project.links);
                return (
                  <div
                    key={project.id}
                    className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface p-5 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{project.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {truncate(project.shortDescription, 90)}
                      </p>
                    </div>
                    {link ? (
                      <Button
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="sm"
                        className="shrink-0"
                      >
                        Ver
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    ) : (
                      <Button
                        href={`/proyectos/${project.slug}`}
                        variant="outline"
                        size="sm"
                        className="shrink-0"
                      >
                        Ver
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
