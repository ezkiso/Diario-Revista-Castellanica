// src/app/sitemap.ts
import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL = "https://diario-revista-castellanica.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Rutas estáticas
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/noticias`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/opinion`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/cartas-al-director`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/difusion`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/revista-castellanica`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Artículos publicados
  const articulos = await prisma.articulo.findMany({
    where: { publicado: true },
    select: { slug: true, updatedAt: true },
    orderBy: { fechaPublicacion: "desc" },
  });

  const articuloRoutes: MetadataRoute.Sitemap = articulos.map((a) => ({
    url: `${BASE_URL}/articulo/${a.slug}`,
    lastModified: a.updatedAt,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  // Revistas publicadas
  const revistas = await prisma.revista.findMany({
    where: { publicada: true },
    select: { anio: true, createdAt: true },
  });

  const revistaRoutes: MetadataRoute.Sitemap = revistas.map((r) => ({
    url: `${BASE_URL}/revista-castellanica/${r.anio}`,
    lastModified: r.createdAt,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...articuloRoutes, ...revistaRoutes];
}