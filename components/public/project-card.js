import Image from "next/image";
import Link from "next/link";
import { ExternalLink, ArrowRight, ImageOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { truncate, statusLabel, statusStyle } from "@/lib/utils";

function primaryLink(links) {
  if (!links?.length) return null;
  return (
    links.find((l) => l.type === "SISTEMA") ||
    links.find((l) => l.type === "DEMO") ||
    links[0]
  );
}

export function ProjectCard({ project }) {
  const visitLink = primaryLink(project.links);
  const techs = project.technologies?.map((pt) => pt.technology) || [];

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/proyectos/${project.slug}`} className="relative block aspect-video overflow-hidden bg-surface-muted">
        {project.mainImage ? (
          <Image
            src={project.mainImage}
            alt={project.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <ImageOff className="h-8 w-8" />
          </div>
        )}
        <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle(project.status)}`}>
          {statusLabel(project.status)}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        {project.category && (
          <Badge variant="brand" className="mb-2 self-start">
            {project.category.name}
          </Badge>
        )}

        <Link href={`/proyectos/${project.slug}`}>
          <h3 className="font-semibold leading-snug hover:text-brand-electric">{project.name}</h3>
        </Link>

        <p className="mt-2 flex-1 text-sm text-muted-foreground">{truncate(project.shortDescription, 120)}</p>

        {techs.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {techs.slice(0, 4).map((tech) => (
              <span
                key={tech.id}
                className="rounded-md bg-surface-muted px-2 py-0.5 text-xs text-muted-foreground"
              >
                {tech.name}
              </span>
            ))}
            {techs.length > 4 && (
              <span className="rounded-md bg-surface-muted px-2 py-0.5 text-xs text-muted-foreground">
                +{techs.length - 4}
              </span>
            )}
          </div>
        )}

        <div className="mt-5 flex gap-2">
          <Button href={`/proyectos/${project.slug}`} variant="outline" size="sm" className="flex-1">
            Ver proyecto
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
          {visitLink && (
            <Button
              href={visitLink.url}
              target="_blank"
              rel="noopener noreferrer"
              size="sm"
              className="flex-1"
            >
              Visitar sistema
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
