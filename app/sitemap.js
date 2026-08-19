import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/seo";

// Evita que "next build" falle si la DB no responde en ese momento (ver
// app/(public)/layout.js para el mismo razonamiento).
export const dynamic = "force-dynamic";

export default async function sitemap() {
  const siteUrl = getSiteUrl();

  const staticRoutes = [
    "",
    "/sobre-nosotros",
    "/servicios",
    "/proyectos",
    "/tecnologias",
    "/contacto",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  let projectRoutes = [];
  try {
    const projects = await prisma.project.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });
    projectRoutes = projects.map((project) => ({
      url: `${siteUrl}/proyectos/${project.slug}`,
      lastModified: project.updatedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    }));
  } catch {
    // Si la DB no responde, el sitemap igual sirve las rutas estáticas en
    // vez de devolver un error 500 a los crawlers.
  }

  return [...staticRoutes, ...projectRoutes];
}
