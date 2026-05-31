import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { TipoArticulo } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { PLACEHOLDER_IMAGE, TIPO_ARTICULO_LABELS } from "@/lib/constants";

type HeroArticleProps = {
  slug: string;
  titulo: string;
  resumen: string;
  imagenDestacada: string | null;
  fechaPublicacion: Date;
  tipo: TipoArticulo;
};

export function HeroArticle({
  slug,
  titulo,
  resumen,
  imagenDestacada,
  fechaPublicacion,
  tipo,
}: HeroArticleProps) {
  const href = `/articulo/${slug}`;
  const imageSrc = imagenDestacada || PLACEHOLDER_IMAGE;

  return (
    <section className="mb-10" aria-labelledby="noticia-principal">
      <h2 id="noticia-principal" className="sr-only">
        Noticia principal
      </h2>
      <div className="grid lg:grid-cols-2 gap-0 border border-border overflow-hidden bg-card">
        <Link href={href} className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[400px] block">
          <Image
            src={imageSrc}
            alt=""
            fill
            className="object-cover hover:opacity-95 transition-opacity"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </Link>
        <div className="p-6 lg:p-10 flex flex-col justify-center">
          <Badge className="w-fit mb-4">{TIPO_ARTICULO_LABELS[tipo]}</Badge>
          <h3 className="font-serif text-3xl lg:text-4xl font-bold leading-tight mb-4">
            <Link href={href} className="hover:text-ufro-red transition-colors">
              {titulo}
            </Link>
          </h3>
          <p className="text-lg text-muted-foreground mb-6 line-clamp-4">{resumen}</p>
          <time
            dateTime={fechaPublicacion.toISOString()}
            className="text-sm text-muted-foreground"
          >
            {format(fechaPublicacion, "EEEE d 'de' MMMM yyyy · HH:mm 'hrs'", {
              locale: es,
            })}
          </time>
        </div>
      </div>
    </section>
  );
}
