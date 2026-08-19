"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { technologySchema } from "@/schemas/technology";
import { generateUniqueSlug } from "@/lib/slug";

export async function listTechnologies() {
  return prisma.technology.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { projects: true } } },
  });
}

/** Solo tecnologías activas, para mostrar en el sitio público. */
export async function listActiveTechnologies() {
  return prisma.technology.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });
}

export async function createTechnology(input) {
  await requireAdmin();

  const parsed = technologySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Datos inválidos" };
  }

  const data = parsed.data;
  const slug = data.slug ? data.slug : await generateUniqueSlug(data.name, technologyExists);

  try {
    const technology = await prisma.technology.create({ data: { ...data, slug } });
    revalidatePath("/admin/tecnologias");
    revalidatePath("/tecnologias");
    revalidatePath("/proyectos");
    return { success: true, data: technology };
  } catch (error) {
    if (error.code === "P2002") {
      return { success: false, error: "Ya existe una tecnología con ese slug." };
    }
    return { success: false, error: "No se pudo crear la tecnología." };
  }
}

export async function updateTechnology(id, input) {
  await requireAdmin();
  if (!id) return { success: false, error: "ID requerido" };

  const parsed = technologySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Datos inválidos" };
  }

  try {
    const technology = await prisma.technology.update({ where: { id }, data: parsed.data });
    revalidatePath("/admin/tecnologias");
    revalidatePath("/tecnologias");
    revalidatePath("/proyectos");
    return { success: true, data: technology };
  } catch (error) {
    if (error.code === "P2002") {
      return { success: false, error: "Ya existe una tecnología con ese slug." };
    }
    return { success: false, error: "No se pudo actualizar la tecnología." };
  }
}

export async function deleteTechnology(id) {
  await requireAdmin();
  if (!id) return { success: false, error: "ID requerido" };

  const projectCount = await prisma.projectTechnology.count({ where: { technologyId: id } });
  if (projectCount > 0) {
    return {
      success: false,
      error: `No se puede eliminar: está en uso por ${projectCount} proyecto(s).`,
    };
  }

  try {
    await prisma.technology.delete({ where: { id } });
    revalidatePath("/admin/tecnologias");
    revalidatePath("/tecnologias");
    revalidatePath("/proyectos");
    return { success: true };
  } catch {
    return { success: false, error: "No se pudo eliminar la tecnología." };
  }
}

async function technologyExists(slug, excludeId) {
  const found = await prisma.technology.findUnique({ where: { slug } });
  return !!found && found.id !== excludeId;
}

export async function checkTechnologySlugAvailable(slug, excludeId) {
  await requireAdmin();
  const found = await prisma.technology.findUnique({ where: { slug } });
  return !found || found.id === excludeId;
}
