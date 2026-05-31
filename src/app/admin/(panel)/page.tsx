import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { TIPO_ARTICULO_LABELS } from "@/lib/constants";

export default async function AdminDashboardPage() {
  const session = await requireAuth();

  const [
    totalArticulos,
    publicados,
    borradores,
    totalRevistas,
    ultimosArticulos,
  ] = await Promise.all([
    prisma.articulo.count(),
    prisma.articulo.count({ where: { publicado: true } }),
    prisma.articulo.count({ where: { publicado: false } }),
    prisma.revista.count(),
    prisma.articulo.findMany({
      orderBy: { updatedAt: "desc" },
      take: 8,
      include: { autor: { select: { nombre: true } } },
    }),
  ]);

  const stats = [
    { label: "Total artículos", value: totalArticulos },
    { label: "Publicados", value: publicados },
    { label: "Borradores", value: borradores },
    { label: "Revistas", value: totalRevistas },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
      <p className="text-muted-foreground mb-8">
        Bienvenido/a, {session.user.name} ({session.user.rol})
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {s.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-3 mb-6">
        <Button asChild>
          <Link href="/admin/articulos/nuevo">Nuevo artículo</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/admin/revistas/nueva">Nueva revista</Link>
        </Button>
      </div>

      <h2 className="text-lg font-semibold mb-4">Últimas publicaciones</h2>
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3">Título</th>
              <th className="text-left p-3 hidden md:table-cell">Tipo</th>
              <th className="text-left p-3 hidden md:table-cell">Estado</th>
              <th className="text-left p-3">Actualizado</th>
            </tr>
          </thead>
          <tbody>
            {ultimosArticulos.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="p-3">
                  <Link
                    href={`/admin/articulos/${a.id}`}
                    className="font-medium hover:text-ufro-red"
                  >
                    {a.titulo}
                  </Link>
                </td>
                <td className="p-3 hidden md:table-cell">
                  {TIPO_ARTICULO_LABELS[a.tipo]}
                </td>
                <td className="p-3 hidden md:table-cell">
                  {a.publicado ? "Publicado" : "Borrador"}
                </td>
                <td className="p-3 text-muted-foreground">
                  {format(a.updatedAt, "d MMM yyyy", { locale: es })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
