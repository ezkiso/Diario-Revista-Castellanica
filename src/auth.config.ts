import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8,
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isAdminRoute = pathname.startsWith("/admin");
      const isLoginPage = pathname === "/admin/login";

      // Si ya está autenticado y está en login, redirigir a admin
      if (isLoginPage && auth?.user) {
        return Response.redirect(new URL("/admin", request.nextUrl));
      }

      // Si es ruta de admin y no está autenticado, redirigir a login
      if (isAdminRoute && !isLoginPage && !auth?.user) {
        return false;
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
