export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleContent } from "@/components/articles/article-content";
import { BackButton } from "@/components/ui/back-button";
import { getRevistaByAnio } from "@/lib/revistas";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

type Props = { params: Promise<{ anio: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { anio } = await params;
  const revista = await getRevistaByAnio(parseInt(anio, 10));
  if (!revista) return { title: "Edición no encontrada" };

  return {
    title: revista.nombre,
    description: revista.descripcion,
    openGraph: {
      title: revista.nombre,
      description: revista.descripcion,
      images: revista.portada ? [revista.portada] : undefined,
      url: `${SITE_URL}/revista-castellanica/${revista.anio}`,
    },
  };
}

export default async function RevistaAnioPage({ params }: Props) {
  const { anio } = await params;
  const year = parseInt(anio, 10);
  if (Number.isNaN(year)) notFound();

  const revista = await getRevistaByAnio(year);
  if (!revista) notFound();

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/revista-castellanica"
          className="text-sm text-ufro-red hover:underline mb-6 inline-block"
        >
          ← Todas las ediciones
        </Link>

        <header className="grid md:grid-cols-[240px_1fr] gap-8 mb-12">
          {revista.portada && (
            <div className="relative aspect-[3/4] max-w-[240px] border shadow-md">
              <Image
                src={revista.portada}
                alt={`Portada ${revista.nombre}`}
                fill
                className="object-cover"
                sizes="240px"
              />
            </div>
          )}
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-ufro-blue">
              {revista.nombre}
            </h1>
            <p className="text-ufro-gold font-semibold mt-1">Edición {revista.anio}</p>
            <p className="text-muted-foreground mt-4 leading-relaxed">{revista.descripcion}</p>
          </div>
        </header>

        <section aria-labelledby="contenidos-literarios">
          <h2
            id="contenidos-literarios"
            className="font-serif text-2xl font-bold border-b border-border pb-2 mb-8"
          >
            Contenidos literarios
          </h2>
          {revista.contenidos.length === 0 ? (
            <p className="text-muted-foreground">Esta edición aún no tiene textos publicados.</p>
          ) : (
            <div className="space-y-12">
              {revista.contenidos.map((item) => (
                <article
                  key={item.id}
                  id={`texto-${item.id}`}
                  className="max-w-3xl border-b border-border pb-12 last:border-0"
                >
                  <h3 className="font-serif text-2xl font-bold">{item.titulo}</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">por {item.autor}</p>
                  {item.imagen && (
                    <div className="relative aspect-video max-w-lg mb-6 rounded overflow-hidden">
                      <Image
                        src={item.imagen}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 512px) 100vw, 512px"
                      />
                    </div>
                  )}
                  <ArticleContent html={item.contenido} />
                </article>
              ))}
            </div>
          )}
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "PublicationIssue",
              name: revista.nombre,
              description: revista.descripcion,
              datePublished: `${revista.anio}-01-01`,
              publisher: { "@type": "Organization", name: SITE_NAME },
            }),
          }}
        />
      </div>
      <BackButton label="Ediciones" href="/revista-castellanica" />
    </>
  );
}
