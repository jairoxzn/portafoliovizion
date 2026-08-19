import { listCategories, createCategory } from "@/actions/categories";
import { jsonOk, jsonError, withApiErrors } from "@/lib/api";

// GET /api/categorias — lista pública de categorías
export async function GET() {
  const categories = await listCategories();
  return jsonOk(categories);
}

// POST /api/categorias — crea una categoría (admin)
export async function POST(request) {
  return withApiErrors(async () => {
    const body = await request.json();
    const result = await createCategory(body);
    if (!result.success) return jsonError(result.error, 400);
    return jsonOk(result.data, 201);
  });
}
