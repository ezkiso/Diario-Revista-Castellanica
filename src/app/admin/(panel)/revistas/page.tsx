import Link from "next/link";
import { Button } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export default async function AdminRevistasPage() {
  await requireAuth();

  const revistas = await prisma.revista.findMany({
    orderBy: { anio: "desc" },
    include: { _count: { select: { contenidos: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Revistas Castellánica</h1>
        <Button asChild>
          <Link href="/admin/revistas/nueva">Nueva revista</Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {revistas.map((r) => (
          <Link
            key={r.id}
            href={`/admin/revistas/${r.id}`}
            className="block border rounded-lg p-4 hover:bg-muted/30 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-semibold text-lg">{r.nombre}</h2>
                <p className="text-sm text-muted-foreground">
                  Año {r.anio} · {r._count.contenidos} textos ·{" "}
                  {r.publicada ? "Publicada" : "Borrador"}
                </p>
              </div>
              {r.publicada && (
                <span className="text-xs text-ufro-blue">
                  /revista-castellanica/{r.anio}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
