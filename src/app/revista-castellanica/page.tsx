export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPublishedRevistas } from "@/lib/revistas";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Revista Castellánica",
  description: `Archivo histórico de la revista literaria anual — ${SITE_NAME}`,
};

export default async function RevistaIndexPage() {
  const revistas = await getPublishedRevistas();

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-10 border-b-2 border-ufro-gold pb-4">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-ufro-blue">
          Revista Castellánica
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Archivo permanente de ediciones anuales. Cada año se conserva su portada,
          descripción y contenidos literarios.
        </p>
      </header>

      {revistas.length === 0 ? (
        <p className="text-muted-foreground">Próximamente nuevas ediciones.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {revistas.map((revista) => (
            <Link
              key={revista.id}
              href={`/revista-castellanica/${revista.anio}`}
              className="group border border-border overflow-hidden bg-card hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-[3/4] bg-ufro-gray">
                {revista.portada ? (
                  <Image
                    src={revista.portada}
                    alt={`Portada ${revista.nombre}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center font-serif text-4xl text-ufro-blue/30">
                    {revista.anio}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="font-serif text-xl font-bold group-hover:text-ufro-red transition-colors">
                  {revista.nombre}
                </h2>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {revista.descripcion}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {revista._count.contenidos} textos literarios
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
