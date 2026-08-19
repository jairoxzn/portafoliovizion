import { prisma } from "@/lib/prisma";
import { updateCategory, deleteCategory } from "@/actions/categories";
import { jsonOk, jsonError, withApiErrors } from "@/lib/api";

// PUT /api/categorias/:slug — actualiza una categoría (admin)
export async function PUT(request, { params }) {
  return withApiErrors(async () => {
    const { slug } = await params;
    const existing = await prisma.category.findUnique({ where: { slug }, select: { id: true } });
    if (!existing) return jsonError("Categoría no encontrada", 404);

    const body = await request.json();
    const result = await updateCategory(existing.id, body);
    if (!result.success) return jsonError(result.error, 400);
    return jsonOk(result.data);
  });
}

// DELETE /api/categorias/:slug — elimina una categoría (admin)
export async function DELETE(_request, { params }) {
  return withApiErrors(async () => {
    const { slug } = await params;
    const existing = await prisma.category.findUnique({ where: { slug }, select: { id: true } });
    if (!existing) return jsonError("Categoría no encontrada", 404);

    const result = await deleteCategory(existing.id);
    if (!result.success) return jsonError(result.error, 400);
    return jsonOk({ success: true });
  });
}
