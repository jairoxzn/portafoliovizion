"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { categorySchema } from "@/schemas/category";
import { generateUniqueSlug } from "@/lib/slug";

export async function listCategories() {
  return prisma.category.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
    include: { _count: { select: { projects: true } } },
  });
}

export async function createCategory(input) {
  await requireAdmin();

  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Datos inválidos" };
  }

  const data = parsed.data;
  const slug = data.slug
    ? data.slug
    : await generateUniqueSlug(data.name, (s) => categoryExists(s));

  try {
    const category = await prisma.category.create({ data: { ...data, slug } });
    revalidatePath("/admin/categorias");
    revalidatePath("/proyectos");
    revalidatePath("/");
    return { success: true, data: category };
  } catch (error) {
    if (error.code === "P2002") {
      return { success: false, error: "Ya existe una categoría con ese slug." };
    }
    return { success: false, error: "No se pudo crear la categoría." };
  }
}

export async function updateCategory(id, input) {
  await requireAdmin();
  if (!id) return { success: false, error: "ID requerido" };

  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Datos inválidos" };
  }

  try {
    const category = await prisma.category.update({ where: { id }, data: parsed.data });
    revalidatePath("/admin/categorias");
    revalidatePath("/proyectos");
    revalidatePath("/");
    return { success: true, data: category };
  } catch (error) {
    if (error.code === "P2002") {
      return { success: false, error: "Ya existe una categoría con ese slug." };
    }
    return { success: false, error: "No se pudo actualizar la categoría." };
  }
}

export async function deleteCategory(id) {
  await requireAdmin();
  if (!id) return { success: false, error: "ID requerido" };

  const projectCount = await prisma.project.count({ where: { categoryId: id } });
  if (projectCount > 0) {
    return {
      success: false,
      error: `No se puede eliminar: hay ${projectCount} proyecto(s) asignado(s) a esta categoría.`,
    };
  }

  try {
    await prisma.category.delete({ where: { id } });
    revalidatePath("/admin/categorias");
    revalidatePath("/proyectos");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "No se pudo eliminar la categoría." };
  }
}

async function categoryExists(slug, excludeId) {
  const found = await prisma.category.findUnique({ where: { slug } });
  return !!found && found.id !== excludeId;
}

export async function checkCategorySlugAvailable(slug, excludeId) {
  await requireAdmin();
  const found = await prisma.category.findUnique({ where: { slug } });
  return !found || found.id === excludeId;
}
