"use server";

import { prisma } from "@/lib/prisma";

/** Estadísticas agregadas, seguras para mostrar en el sitio público (sin datos sensibles). */
export async function getDashboardStatsPublic() {
  const [projects, categories, technologies, clients] = await Promise.all([
    prisma.project.count({ where: { published: true } }),
    prisma.category.count(),
    prisma.technology.count({ where: { active: true } }),
    prisma.project.findMany({
      where: { published: true, client: { not: null } },
      select: { client: true },
      distinct: ["client"],
    }),
  ]);

  return {
    projects,
    categories,
    technologies,
    clients: clients.filter((c) => c.client?.trim()).length,
  };
}
