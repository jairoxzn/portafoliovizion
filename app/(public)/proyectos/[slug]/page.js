import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink, Calendar, User, Tag, CheckCircle2, ArrowLeft } from "lucide-react";
import { getProjectBySlugPublic, registerProjectView } from "@/actions/projects";
import { ProjectGallery } from "@/components/public/project-gallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";
import { formatDate, statusLabel, statusStyle, linkTypeLabel } from "@/lib/utils";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlugPublic(slug);
  if (!project) return {};

  return buildMetadata({
    title: project.metaTitle || project.name,
    description: project.metaDescription || project.shortDescription,
    keywords: project.metaKeywords || undefined,
    path: `/proyectos/${project.slug}`,
    image: project.mainImage || undefined,
  });
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlugPublic(slug);

  if (!project) notFound();

  await registerProjectView(project.id);

  const techs = project.technologies.map((pt) => pt.technology);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 lg:px-6">
      <Link href="/proyectos" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Volver a proyectos
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          {project.category && (
            <Badge variant="brand" className="mb-3">
              {project.category.name}
            </Badge>
          )}
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{project.name}</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">{project.shortDescription}</p>
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium ${statusStyle(project.status)}`}>
          {statusLabel(project.status)}
        </span>
      </div>

      <div className="mt-8">
        <ProjectGallery mainImage={project.mainImage} images={project.images} name={project.name} />
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        <div className="space-y-10 lg:col-span-2">
          <section>
            <h2 className="text-xl font-semibold">Descripción</h2>
            <p className="mt-3 whitespace-pre-line text-muted-foreground">{project.description}</p>
          </section>

          {project.problem && (
            <section>
              <h2 className="text-xl font-semibold">Problema que resuelve</h2>
              <p className="mt-3 whitespace-pre-line text-muted-foreground">{project.problem}</p>
            </section>
          )}

          {project.features.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold">Características principales</h2>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {project.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-electric" />
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="text-sm font-semibold">Detalles del proyecto</h3>
            <dl className="mt-4 space-y-3 text-sm">
              {project.client && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <dt className="text-muted-foreground">Cliente:</dt>
                  <dd className="font-medium">{project.client}</dd>
                </div>
              )}
              {project.developmentDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <dt className="text-muted-foreground">Desarrollo:</dt>
                  <dd className="font-medium">{formatDate(project.developmentDate)}</dd>
                </div>
              )}
              {project.category && (
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <dt className="text-muted-foreground">Categoría:</dt>
                  <dd className="font-medium">{project.category.name}</dd>
                </div>
              )}
            </dl>
          </div>

          {techs.length > 0 && (
            <div className="rounded-xl border border-border bg-surface p-5">
              <h3 className="text-sm font-semibold">Tecnologías</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {techs.map((tech) => (
                  <span key={tech.id} className="flex items-center gap-1.5 rounded-full bg-surface-muted px-2.5 py-1 text-xs font-medium">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: tech.color || "#999" }} />
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {project.links.length > 0 && (
            <div className="rounded-xl border border-border bg-surface p-5">
              <h3 className="text-sm font-semibold">Enlaces</h3>
              <div className="mt-3 flex flex-col gap-2">
                {project.links.map((link) => (
                  <Button key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" variant="outline" size="sm" className="justify-between">
                    {link.name || linkTypeLabel(link.type)}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
