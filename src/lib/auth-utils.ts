import { auth } from "@/auth";
import { Rol } from "@prisma/client";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();
  if (session.user.rol !== Rol.ADMIN) {
    redirect("/admin");
  }
  return session;
}
