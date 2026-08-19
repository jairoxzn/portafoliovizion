import { createHash } from "crypto";
import { headers } from "next/headers";

/**
 * Hashea una IP con SHA-256 para poder detectar visitas sin almacenar
 * información personal identificable en claro.
 */
export function hashIp(ip) {
  const salt = process.env.AUTH_SECRET || "viziontech";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

/** Obtiene la IP del visitante a partir de los headers de la petición actual. */
export async function getRequestIp() {
  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return headerList.get("x-real-ip") || "0.0.0.0";
}

export async function getRequestUserAgent() {
  const headerList = await headers();
  return headerList.get("user-agent") || null;
}
