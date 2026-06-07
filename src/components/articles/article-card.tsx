import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { TipoArticulo } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { PLACEHOLDER_IMAGE, TIPO_ARTICULO_LABELS } from "@/lib/constants";

type ArticleCardProps = {
  slug: string;
  titulo: string;
  resumen: string;
  imagenDestacada: string | null;
  fechaPublicacion: Date;
  tipo: TipoArticulo;
};

export function ArticleCard({
  slug,
  titulo,
  resumen,
  imagenDestacada,
  fechaPublicacion,
  tipo,
}: ArticleCardProps) {
  const href = `/articulo/${slug}`;
  const imageSrc = imagenDestacada || PLACEHOLDER_IMAGE;
  const fecha = fechaPublicacion instanceof Date ? fechaPublicacion : new Date(fechaPublicacion);

  return (
    <article className="group flex flex-col border border-border bg-card overflow-hidden hover:shadow-md transition-shadow">
      <Link href={href} className="relative aspect-[16/10] overflow-hidden block">
        <Image
          src={imageSrc}
          alt=""
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, 33vw"
          loading="lazy"
        />
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <Badge variant="secondary" className="w-fit mb-2 text-xs">
          {TIPO_ARTICULO_LABELS[tipo]}
        </Badge>
        <h2 className="font-serif text-lg font-bold leading-snug mb-2">
          <Link href={href} className="hover:text-ufro-red transition-colors">
            {titulo}
          </Link>
        </h2>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3 flex-1">
          {resumen}
        </p>
        <time
          dateTime={fecha.toISOString()}
          className="text-xs text-muted-foreground"
        >
          {format(fecha, "d 'de' MMMM yyyy, HH:mm", { locale: es })}
        </time>
      </div>
    </article>
  );
}
