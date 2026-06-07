// src/lib/articles.ts — versión optimizada con caching

import { TipoArticulo, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export const publishedArticleSelect = {
  id: true,
  titulo: true,
  slug: true,
  resumen: true,
  contenido: true,
  imagenDestacada: true,
  tipo: true,
  fechaPublicacion: true,
  updatedAt: true,
  publicado: true,
  createdAt: true,
  autor: {
    select: { id: true, nombre: true },
  },
} satisfies Prisma.ArticuloSelect;

// Cache de 5 minutos para artículos publicados
export async function getPublishedArticles(options?: {
  tipo?: TipoArticulo;
  limit?: number;
  excludeSlug?: string;
}) {
  const where: Prisma.ArticuloWhereInput = {
    publicado: true,
    ...(options?.tipo && { tipo: options.tipo }),
    ...(options?.excludeSlug && { slug: { not: options.excludeSlug } }),
  };

  return unstable_cache(
    async () => {
      return prisma.articulo.findMany({
        where,
        select: publishedArticleSelect,
        orderBy: { fechaPublicacion: "desc" },
        take: options?.limit,
      });
    },
    ["published-articles", options?.tipo || "all", options?.limit?.toString() || "all", options?.excludeSlug || "none"],
    {
      revalidate: 300, // 5 minutos
      tags: ["articles"]
    }
  )();
}

// Cache de 10 minutos para artículo individual
export async function getArticleBySlug(slug: string) {
  return unstable_cache(
    async () => {
      return prisma.articulo.findFirst({
        where: { slug, publicado: true },
        select: publishedArticleSelect,
      });
    },
    ["article", slug],
    {
      revalidate: 600, // 10 minutos
      tags: ["articles", `article-${slug}`]
    }
  )();
}

// Cache de 5 minutos para artículos relacionados
export async function getRelatedArticles(
  tipo: TipoArticulo,
  excludeSlug: string,
  limit = 3
) {
  return unstable_cache(
    async () => {
      const items = await getPublishedArticles({ tipo, limit: limit + 1, excludeSlug });
      return items.slice(0, limit);
    },
    ["related-articles", tipo, excludeSlug, limit.toString()],
    {
      revalidate: 300, // 5 minutos
      tags: ["articles", `related-${tipo}`]
    }
  )();
}