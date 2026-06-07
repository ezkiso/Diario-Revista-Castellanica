import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import type { Revista } from "@prisma/client";

type RevistaFeaturedProps = {
  revista: Revista & { _count: { contenidos: number } };
};

function RevistaFeaturedComponent({ revista }: RevistaFeaturedProps) {
  if (!revista) return null;

  return (
    <Link
      href={`/revista-castellanica/${revista.anio}`}
      className="group block border border-border bg-card hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {revista.portada ? (
          <Image
            src={revista.portada}
            alt={`Portada Revista Castellánica ${revista.anio}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-ufro-blue/10">
            <span className="font-serif text-4xl font-bold text-ufro-blue/30">
              {revista.anio}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <span className="inline-block bg-ufro-gold text-ufro-blue text-xs font-bold px-2 py-0.5 rounded mb-2">
            NUEVA EDICIÓN
          </span>
          <h3 className="font-serif text-lg font-bold text-white">
            Revista Castellánica {revista.anio}
          </h3>
          <p className="text-sm text-white/80">
            {revista._count.contenidos} textos literarios
          </p>
        </div>
      </div>
    </Link>
  );
}

export const RevistaFeatured = memo(RevistaFeaturedComponent);
