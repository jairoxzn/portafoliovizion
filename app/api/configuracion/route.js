import { getSettings, updateSettings } from "@/actions/settings";
import { jsonOk, jsonError, withApiErrors } from "@/lib/api";

// GET /api/configuracion — configuración pública de la empresa
export async function GET() {
  const settings = await getSettings();
  return jsonOk(settings);
}

// PUT /api/configuracion — actualiza la configuración (admin)
export async function PUT(request) {
  return withApiErrors(async () => {
    const body = await request.json();
    const result = await updateSettings(body);
    if (!result.success) return jsonError(result.error, 400);
    return jsonOk(result.data);
  });
}
