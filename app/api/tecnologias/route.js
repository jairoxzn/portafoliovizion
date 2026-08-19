import { listTechnologies, createTechnology } from "@/actions/technologies";
import { jsonOk, jsonError, withApiErrors } from "@/lib/api";

// GET /api/tecnologias — lista pública de tecnologías
export async function GET() {
  const technologies = await listTechnologies();
  return jsonOk(technologies);
}

// POST /api/tecnologias — crea una tecnología (admin)
export async function POST(request) {
  return withApiErrors(async () => {
    const body = await request.json();
    const result = await createTechnology(body);
    if (!result.success) return jsonError(result.error, 400);
    return jsonOk(result.data, 201);
  });
}
