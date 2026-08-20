/**
 * Configuración de Auth.js segura para Edge (sin Prisma ni bcrypt aquí).
 * Se usa tanto en `auth.js` (config completa) como en `middleware.js`
 * (config liviana, para no cargar el cliente de Prisma en el runtime del middleware).
 */
export const authConfig = {
  // Necesario fuera de Vercel: Auth.js v5 solo confía automáticamente en el
  // host de la petición cuando detecta que corre en Vercel. En un VPS (o
  // cualquier otro hosting) sin esto, rechaza la petición y termina en
  // /api/auth/error con un genérico "Configuration" — no es un error real
  // de configuración, es este flag.
  trustHost: true,
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isLoginPage = nextUrl.pathname === "/admin/login";
      const isAdminArea = nextUrl.pathname.startsWith("/admin");

      if (isLoginPage) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/admin/dashboard", nextUrl));
        }
        return true;
      }

      if (isAdminArea) {
        return isLoggedIn;
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  providers: [], // se completa en auth.js
};
