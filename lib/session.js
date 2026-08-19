import { auth } from "@/auth";

/**
 * Devuelve la sesión del admin autenticado o null.
 * Úsalo en Server Components / route handlers para lectura de sesión.
 */
export async function getSession() {
  return auth();
}

/**
 * Exige una sesión de administrador válida.
 * Lánzala al inicio de toda Server Action o route handler que mute datos —
 * el middleware protege la navegación, pero las mutaciones nunca deben
 * confiar solo en eso.
 *
 * @throws {Error} si no hay sesión autenticada
 * @returns {Promise<{id: string, name: string, email: string, role: string}>}
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("No autorizado: se requiere iniciar sesión como administrador.");
  }
  return session.user;
}
