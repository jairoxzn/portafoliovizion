import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Instancia liviana de Auth.js (sin Prisma) usada solo para proteger rutas /admin.
// Convención "proxy" (Next.js 16) — reemplaza al middleware.js deprecado.
const { auth } = NextAuth(authConfig);

export const proxy = auth;

export const config = {
  matcher: ["/admin/:path*"],
};
