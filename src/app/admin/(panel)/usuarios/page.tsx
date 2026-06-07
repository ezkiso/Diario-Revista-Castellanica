import { format } from "date-fns";
import { es } from "date-fns/locale";
import { requireAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { CreateUserForm } from "@/components/admin/create-user-form";
import { UsersTable } from "@/components/admin/users-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminUsuariosPage() {
  await requireAdmin();

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      nombre: true,
      rol: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Verificar si ya existe un administrador
  const adminCount = await prisma.user.count({
    where: { rol: "ADMIN" },
  });
  const canCreateAdmin = adminCount === 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Usuarios</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Crear nuevo usuario</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateUserForm canCreateAdmin={canCreateAdmin} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usuarios existentes</CardTitle>
          </CardHeader>
          <CardContent>
            <UsersTable users={users} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
