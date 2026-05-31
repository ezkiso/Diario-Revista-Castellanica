import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticuloForm } from "@/components/admin/articulo-form";
import { DeleteArticuloButton } from "@/components/admin/delete-articulo-button";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export default async function EditarArticuloPage({ params }: Props) {
  await requireAuth();
  const { id } = await params;

  const articulo = await prisma.articulo.findUnique({ where: { id } });
  if (!articulo) notFound();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Editar artículo</h1>
        <div className="flex gap-2">
          {articulo.publicado && (
            <Link
              href={`/articulo/${articulo.slug}`}
              className="text-sm text-ufro-blue hover:underline"
              target="_blank"
            >
              Ver en sitio →
            </Link>
          )}
          <DeleteArticuloButton id={articulo.id} titulo={articulo.titulo} />
        </div>
      </div>
      <ArticuloForm articulo={articulo} />
    </div>
  );
}
