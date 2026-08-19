"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { projectSchema } from "@/schemas/project";
import { generateUniqueSlug } from "@/lib/slug";
import { deleteFile } from "@/lib/storage";
import { hashIp, getRequestIp, getRequestUserAgent } from "@/lib/analytics";

const PUBLIC_INCLUDE = {
  category: true,
  technologies: { include: { technology: true } },
  images: { orderBy: { order: "asc" } },
  links: true,
};

// ---------- Lecturas públicas ----------

export async function listPublicProjects({ q = "", category = "" } = {}) {
  return prisma.project.findMany({
    where: {
      published: true,
      ...(category ? { category: { slug: category } } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { shortDescription: { contains: q, mode: "insensitive" } },
              { client: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: PUBLIC_INCLUDE,
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
}

export async function getFeaturedProjects(limit = 6) {
  return prisma.project.findMany({
    where: { published: true, featured: true },
    include: PUBLIC_INCLUDE,
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    take: limit,
  });
}

export async function getProjectBySlugPublic(slug) {
  return prisma.project.findFirst({
    where: { slug, published: true },
    include: PUBLIC_INCLUDE,
  });
}

/** Registra una visita a un proyecto (usado desde la página de detalle pública). */
export async function registerProjectView(projectId) {
  try {
    const ip = await getRequestIp();
    const userAgent = await getRequestUserAgent();
    await prisma.projectView.create({
      data: { projectId, ipHash: hashIp(ip), userAgent },
    });
  } catch {
    // No interrumpe la navegación del visitante si falla el registro de vista.
  }
}

// ---------- Lecturas admin ----------

export async function listProjectsAdmin({ q = "", category = "", status = "" } = {}) {
  await requireAdmin();

  return prisma.project.findMany({
    where: {
      ...(category ? { categoryId: category } : {}),
      ...(status ? { status } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { client: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: {
      category: true,
      _count: { select: { views: true } },
    },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
}

export async function getProjectById(id) {
  await requireAdmin();
  return prisma.project.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: "asc" } },
      links: true,
      technologies: { include: { technology: true } },
    },
  });
}

export async function checkProjectSlugAvailable(slug, excludeId) {
  await requireAdmin();
  const found = await prisma.project.findUnique({ where: { slug } });
  return !found || found.id === excludeId;
}

// ---------- Mutaciones admin ----------

function toProjectData(parsed) {
  const { technologyIds, images, links, developmentDate, ...rest } = parsed;
  return {
    scalars: {
      ...rest,
      developmentDate: developmentDate ? new Date(developmentDate) : null,
    },
    technologyIds,
    images,
    links,
  };
}

export async function createProject(input) {
  await requireAdmin();

  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Datos inválidos" };
  }

  const existing = await prisma.project.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return { success: false, error: "Ese slug ya está en uso por otro proyecto." };
  }

  const { scalars, technologyIds, images, links } = toProjectData(parsed.data);

  try {
    const project = await prisma.project.create({
      data: {
        ...scalars,
        images: { create: images.map((img, i) => ({ ...img, order: img.order ?? i })) },
        links: { create: links },
        technologies: { create: technologyIds.map((technologyId) => ({ technologyId })) },
      },
    });

    revalidateProject(project.slug);
    return { success: true, data: project };
  } catch (error) {
    if (error.code === "P2002") {
      return { success: false, error: "Ese slug ya está en uso por otro proyecto." };
    }
    return { success: false, error: "No se pudo crear el proyecto." };
  }
}

export async function updateProject(id, input) {
  await requireAdmin();
  if (!id) return { success: false, error: "ID requerido" };

  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Datos inválidos" };
  }

  const current = await prisma.project.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!current) return { success: false, error: "Proyecto no encontrado." };

  const slugTaken = await prisma.project.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
  });
  if (slugTaken) {
    return { success: false, error: "Ese slug ya está en uso por otro proyecto." };
  }

  const { scalars, technologyIds, images, links } = toProjectData(parsed.data);

  // Elimina del storage local las imágenes que ya no están en el formulario.
  const newUrls = new Set([scalars.mainImage, ...images.map((i) => i.url)].filter(Boolean));
  const removedUrls = current.images
    .map((i) => i.url)
    .filter((url) => !newUrls.has(url));
  if (current.mainImage && !newUrls.has(current.mainImage)) {
    removedUrls.push(current.mainImage);
  }
  await Promise.all(removedUrls.map((url) => deleteFile(url)));

  try {
    const project = await prisma.$transaction(async (tx) => {
      await tx.projectImage.deleteMany({ where: { projectId: id } });
      await tx.projectLink.deleteMany({ where: { projectId: id } });
      await tx.projectTechnology.deleteMany({ where: { projectId: id } });

      return tx.project.update({
        where: { id },
        data: {
          ...scalars,
          images: { create: images.map((img, i) => ({ ...img, order: img.order ?? i })) },
          links: { create: links },
          technologies: { create: technologyIds.map((technologyId) => ({ technologyId })) },
        },
      });
    });

    revalidateProject(project.slug);
    if (current.slug !== project.slug) revalidateProject(current.slug);
    return { success: true, data: project };
  } catch (error) {
    if (error.code === "P2002") {
      return { success: false, error: "Ese slug ya está en uso por otro proyecto." };
    }
    return { success: false, error: "No se pudo actualizar el proyecto." };
  }
}

export async function deleteProject(id) {
  await requireAdmin();
  if (!id) return { success: false, error: "ID requerido" };

  const project = await prisma.project.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!project) return { success: false, error: "Proyecto no encontrado." };

  const filesToRemove = [project.mainImage, ...project.images.map((i) => i.url)].filter(Boolean);
  await Promise.all(filesToRemove.map((url) => deleteFile(url)));

  await prisma.project.delete({ where: { id } });
  revalidateProject(project.slug);
  return { success: true };
}

export async function toggleProjectPublished(id, published) {
  await requireAdmin();
  if (!id) return { success: false, error: "ID requerido" };

  const project = await prisma.project.update({ where: { id }, data: { published } });
  revalidateProject(project.slug);
  return { success: true, data: project };
}

export async function toggleProjectFeatured(id, featured) {
  await requireAdmin();
  if (!id) return { success: false, error: "ID requerido" };

  const project = await prisma.project.update({ where: { id }, data: { featured } });
  revalidateProject(project.slug);
  return { success: true, data: project };
}

export async function duplicateProject(id) {
  await requireAdmin();
  if (!id) return { success: false, error: "ID requerido" };

  const original = await prisma.project.findUnique({
    where: { id },
    include: { images: true, links: true, technologies: true },
  });
  if (!original) return { success: false, error: "Proyecto no encontrado." };

  const baseName = `${original.name} (copia)`;
  const slug = await generateUniqueSlug(baseName, async (s) => {
    const found = await prisma.project.findUnique({ where: { slug: s } });
    return !!found;
  });

  const copy = await prisma.project.create({
    data: {
      name: baseName,
      slug,
      shortDescription: original.shortDescription,
      description: original.description,
      problem: original.problem,
      features: original.features,
      client: original.client,
      categoryId: original.categoryId,
      mainImage: original.mainImage,
      status: original.status,
      published: false,
      featured: false,
      order: original.order,
      developmentDate: original.developmentDate,
      metaTitle: original.metaTitle,
      metaDescription: original.metaDescription,
      metaKeywords: original.metaKeywords,
      images: {
        create: original.images.map(({ url, alt, order }) => ({ url, alt, order })),
      },
      links: {
        create: original.links.map(({ name, url, type }) => ({ name, url, type })),
      },
      technologies: {
        create: original.technologies.map(({ technologyId }) => ({ technologyId })),
      },
    },
  });

  revalidateProject(copy.slug);
  return { success: true, data: copy };
}

// ---------- Dashboard ----------

export async function getDashboardStats() {
  await requireAdmin();

  const [total, published, draft, categories, technologies, totalViews, topProjects, latestProjects] =
    await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { published: true } }),
      prisma.project.count({ where: { published: false } }),
      prisma.category.count(),
      prisma.technology.count(),
      prisma.projectView.count(),
      prisma.project.findMany({
        take: 5,
        orderBy: { views: { _count: "desc" } },
        select: { id: true, name: true, slug: true, _count: { select: { views: true } } },
      }),
      prisma.project.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { category: true },
      }),
    ]);

  return {
    total,
    published,
    draft,
    categories,
    technologies,
    totalViews,
    topProjects,
    latestProjects,
  };
}

function revalidateProject(slug) {
  revalidatePath("/admin/proyectos");
  revalidatePath("/admin/dashboard");
  revalidatePath("/proyectos");
  revalidatePath("/");
  if (slug) revalidatePath(`/proyectos/${slug}`);
}
