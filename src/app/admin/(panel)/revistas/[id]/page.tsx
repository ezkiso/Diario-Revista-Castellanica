import Link from "next/link";
import { notFound } from "next/navigation";
import { RevistaForm } from "@/components/admin/revista-form";
import { ContenidoRevistaForm } from "@/components/admin/contenido-revista-form";
import { ContenidoRevistaList } from "@/components/admin/contenido-revista-list";
import { DeleteRevistaButton } from "@/components/admin/delete-revista-button";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { Separator } from "@/components/ui/separator";

type Props = { params: Promise<{ id: string }> };

export default async function EditarRevistaPage({ params }: Props) {
  await requireAuth();
  const { id } = await params;

  const revista = await prisma.revista.findUnique({
    where: { id },
    include: { contenidos: { orderBy: { createdAt: "asc" } } },
  });
  if (!revista) notFound();

  return (
    <div className="max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Editar revista</h1>
        <div className="flex gap-2 items-center">
          {revista.publicada && (
            <Link
              href={`/revista-castellanica/${revista.anio}`}
              target="_blank"
              className="text-sm text-ufro-blue hover:underline"
            >
              Ver edición →
            </Link>
          )}
          <DeleteRevistaButton id={revista.id} nombre={revista.nombre} />
        </div>
      </div>

      <RevistaForm revista={revista} />

      <Separator className="my-10" />

      <section>
        <h2 className="text-xl font-bold mb-4">Contenidos literarios</h2>
        <ContenidoRevistaForm revistaId={revista.id} />
        <ContenidoRevistaList contenidos={revista.contenidos} />
      </section>
    </div>
  );
}
