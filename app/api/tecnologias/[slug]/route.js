import { prisma } from "@/lib/prisma";
import { updateTechnology, deleteTechnology } from "@/actions/technologies";
import { jsonOk, jsonError, withApiErrors } from "@/lib/api";

// PUT /api/tecnologias/:slug — actualiza una tecnología (admin)
export async function PUT(request, { params }) {
  return withApiErrors(async () => {
    const { slug } = await params;
    const existing = await prisma.technology.findUnique({ where: { slug }, select: { id: true } });
    if (!existing) return jsonError("Tecnología no encontrada", 404);

    const body = await request.json();
    const result = await updateTechnology(existing.id, body);
    if (!result.success) return jsonError(result.error, 400);
    return jsonOk(result.data);
  });
}

// DELETE /api/tecnologias/:slug — elimina una tecnología (admin)
export async function DELETE(_request, { params }) {
  return withApiErrors(async () => {
    const { slug } = await params;
    const existing = await prisma.technology.findUnique({ where: { slug }, select: { id: true } });
    if (!existing) return jsonError("Tecnología no encontrada", 404);

    const result = await deleteTechnology(existing.id);
    if (!result.success) return jsonError(result.error, 400);
    return jsonOk({ success: true });
  });
}
