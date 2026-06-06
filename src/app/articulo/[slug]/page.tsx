export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/articles/article-card";
import { ArticleContent } from "@/components/articles/article-content";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/ui/back-button";
import { getArticleBySlug, getRelatedArticles } from "@/lib/articles";
import {
  PLACEHOLDER_IMAGE,
  SITE_NAME,
  SITE_URL,
  TIPO_ARTICULO_LABELS,
  TIPO_ARTICULO_ROUTES,
} from "@/lib/constants";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Artículo no encontrado" };

  const url = `${SITE_URL}/articulo/${slug}`;

  return {
    title: article.titulo,
    description: article.resumen,
    openGraph: {
      title: article.titulo,
      description: article.resumen,
      type: "article",
      publishedTime: article.fechaPublicacion.toISOString(),
      authors: [article.autor.nombre],
      images: article.imagenDestacada ? [article.imagenDestacada] : undefined,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: article.titulo,
      description: article.resumen,
    },
    alternates: { canonical: url },
  };
}

export default async function ArticuloPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const related = await getRelatedArticles(article.tipo, slug);
  const imageSrc = article.imagenDestacada || PLACEHOLDER_IMAGE;

  return (
    <>
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-8 relative">
          <div className="absolute top-0 right-0">
            <Badge>{TIPO_ARTICULO_LABELS[article.tipo]}</Badge>
          </div>
          <Link
            href="/"
            className="text-sm text-ufro-red hover:underline mb-3 inline-block"
          >
            ← Inicio
          </Link>
          <h1 className="font-serif text-3xl md:text-5xl font-bold leading-tight mb-4">
            {article.titulo}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span>
              Por <strong className="text-foreground">{article.autor.nombre}</strong>
            </span>
            <time dateTime={article.fechaPublicacion.toISOString()}>
              {format(article.fechaPublicacion, "d 'de' MMMM yyyy · HH:mm 'hrs'", {
                locale: es,
              })}
            </time>
          </div>
        </header>

        <div className="relative aspect-[16/9] mb-8 rounded overflow-hidden">
          <Image
            src={imageSrc}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="(max-width: 896px) 100vw, 896px"
          />
        </div>

        <ArticleContent html={article.contenido} />

        {related.length > 0 && (
          <section className="mt-16 pt-8 border-t" aria-labelledby="relacionados">
            <h2 id="relacionados" className="font-serif text-2xl font-bold mb-6">
              Artículos relacionados
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((a) => (
                <ArticleCard key={a.id} {...a} />
              ))}
            </div>
          </section>
        )}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NewsArticle",
              headline: article.titulo,
              description: article.resumen,
              datePublished: article.fechaPublicacion.toISOString(),
              author: { "@type": "Person", name: article.autor.nombre },
              publisher: { "@type": "Organization", name: SITE_NAME },
              image: imageSrc,
            }),
          }}
        />
      </article>
      <BackButton label="Inicio" href="/" />
    </>
  );
}