import { listPublicProjects, createProject } from "@/actions/projects";
import { jsonOk, jsonError, withApiErrors } from "@/lib/api";

// GET /api/proyectos?q=&category= — lista pública de proyectos publicados
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const projects = await listPublicProjects({
    q: searchParams.get("q") || "",
    category: searchParams.get("category") || "",
  });
  return jsonOk(projects);
}

// POST /api/proyectos — crea un proyecto (requiere sesión de administrador)
export async function POST(request) {
  return withApiErrors(async () => {
    const body = await request.json();
    const result = await createProject(body);
    if (!result.success) return jsonError(result.error, 400);
    return jsonOk(result.data, 201);
  });
}
