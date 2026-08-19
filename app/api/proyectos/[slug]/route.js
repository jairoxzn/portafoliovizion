import { prisma } from "@/lib/prisma";
import { getProjectBySlugPublic, updateProject, deleteProject } from "@/actions/projects";
import { jsonOk, jsonError, withApiErrors } from "@/lib/api";

// GET /api/proyectos/:slug — detalle público de un proyecto publicado
export async function GET(_request, { params }) {
  const { slug } = await params;
  const project = await getProjectBySlugPublic(slug);
  if (!project) return jsonError("Proyecto no encontrado", 404);
  return jsonOk(project);
}

// PUT /api/proyectos/:slug — actualiza un proyecto (admin)
export async function PUT(request, { params }) {
  return withApiErrors(async () => {
    const { slug } = await params;
    const existing = await prisma.project.findUnique({ where: { slug }, select: { id: true } });
    if (!existing) return jsonError("Proyecto no encontrado", 404);

    const body = await request.json();
    const result = await updateProject(existing.id, body);
    if (!result.success) return jsonError(result.error, 400);
    return jsonOk(result.data);
  });
}

// DELETE /api/proyectos/:slug — elimina un proyecto (admin)
export async function DELETE(_request, { params }) {
  return withApiErrors(async () => {
    const { slug } = await params;
    const existing = await prisma.project.findUnique({ where: { slug }, select: { id: true } });
    if (!existing) return jsonError("Proyecto no encontrado", 404);

    const result = await deleteProject(existing.id);
    if (!result.success) return jsonError(result.error, 400);
    return jsonOk({ success: true });
  });
}
