import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  trustHost: false,
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

      if (isAdminRoute && !isLoginPage) {
        return !!auth?.user;
      }
      if (isLoginPage && auth?.user) {
        return Response.redirect(new URL("/admin", request.nextUrl));
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
