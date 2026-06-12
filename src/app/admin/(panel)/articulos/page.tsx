import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { TIPO_ARTICULO_LABELS } from "@/lib/constants";
import { ToggleArticuloStatusButton } from "@/components/admin/toggle-articulo-status-button";

export default async function AdminArticulosPage() {
  await requireAuth();

  const articulos = await prisma.articulo.findMany({
    orderBy: { updatedAt: "desc" },
    include: { autor: { select: { nombre: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Artículos</h1>
        <Button asChild>
          <Link href="/admin/articulos/nuevo">Nuevo artículo</Link>
        </Button>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3">Título</th>
              <th className="text-left p-3">Tipo</th>
              <th className="text-left p-3">Estado</th>
              <th className="text-left p-3">Acciones</th>
              <th className="text-left p-3">Fecha pub.</th>
              <th className="text-left p-3">Autor</th>
            </tr>
          </thead>
          <tbody>
            {articulos.map((a) => (
              <tr key={a.id} className="border-t hover:bg-muted/30">
                <td className="p-3">
                  <Link
                    href={`/admin/articulos/${a.id}`}
                    className="font-medium hover:text-ufro-red"
                  >
                    {a.titulo}
                  </Link>
                </td>
                <td className="p-3">{TIPO_ARTICULO_LABELS[a.tipo]}</td>
                <td className="p-3">
                  <span
                    className={
                      a.publicado ? "text-green-700 font-medium" : "text-muted-foreground"
                    }
                  >
                    {a.publicado ? "Publicado" : "Borrador"}
                  </span>
                </td>
                <td className="p-3">
                  <ToggleArticuloStatusButton id={a.id} publicado={a.publicado} />
                </td>
                <td className="p-3 text-muted-foreground">
                  {format(a.fechaPublicacion, "d MMM yyyy HH:mm", { locale: es })}
                </td>
                <td className="p-3">{a.autor.nombre}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
