// src/lib/articles.ts — versión corregida (agrega updatedAt al select)

import { TipoArticulo, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const publishedArticleSelect = {
  id: true,
  titulo: true,
  slug: true,
  resumen: true,
  contenido: true,
  imagenDestacada: true,
  tipo: true,
  fechaPublicacion: true,
  updatedAt: true,      // ← AÑADIDO
  publicado: true,
  createdAt: true,
  autor: {
    select: { id: true, nombre: true },
  },
} satisfies Prisma.ArticuloSelect;

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

  return prisma.articulo.findMany({
    where,
    select: publishedArticleSelect,
    orderBy: { fechaPublicacion: "desc" },
    take: options?.limit,
  });
}

export async function getArticleBySlug(slug: string) {
  return prisma.articulo.findFirst({
    where: { slug, publicado: true },
    select: publishedArticleSelect,
  });
}

export async function getRelatedArticles(
  tipo: TipoArticulo,
  excludeSlug: string,
  limit = 3
) {
  return getPublishedArticles({ tipo, limit: limit + 1, excludeSlug }).then(
    (items) => items.slice(0, limit)
  );
}