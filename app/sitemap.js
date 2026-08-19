import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/seo";

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

  const projects = await prisma.project.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });

  const projectRoutes = projects.map((project) => ({
    url: `${siteUrl}/proyectos/${project.slug}`,
    lastModified: project.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes];
}
