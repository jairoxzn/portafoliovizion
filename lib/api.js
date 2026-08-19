import { NextResponse } from "next/server";

export function jsonOk(data, status = 200) {
  return NextResponse.json(data, { status });
}

export function jsonError(message, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Ejecuta un handler de API y traduce errores de autorización (lanzados por
 * requireAdmin()) a un 401 JSON consistente, en vez de un 500 genérico.
 */
export async function withApiErrors(handler) {
  try {
    return await handler();
  } catch (error) {
    if (error?.message?.startsWith("No autorizado")) {
      return jsonError("No autorizado", 401);
    }
    console.error(error);
    return jsonError("Error interno del servidor", 500);
  }
}
