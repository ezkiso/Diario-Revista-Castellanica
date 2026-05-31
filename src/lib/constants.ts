import { TipoArticulo } from "@prisma/client";

export const SITE_NAME = "Diario Castellano UFRO";
export const SITE_DESCRIPTION =
  "Portal de noticias, opinión y cultura de la Carrera de Pedagogía en Castellano y Comunicación — Universidad de La Frontera, Temuco, Chile.";
export const SITE_URL = process.env.AUTH_URL ?? "https://diario-revista-castellanica.vercel.app";

export const TIPO_ARTICULO_LABELS: Record<TipoArticulo, string> = {
  NOTICIA: "Noticias",
  OPINION: "Columnas de Opinión",
  CARTA_DIRECTOR: "Cartas al Director",
  DIFUSION: "Difusión",
};

export const TIPO_ARTICULO_ROUTES: Record<TipoArticulo, string> = {
  NOTICIA: "/noticias",
  OPINION: "/opinion",
  CARTA_DIRECTOR: "/cartas-al-director",
  DIFUSION: "/difusion",
};

export const NAV_LINKS = [
  { href: "/noticias", label: "Noticias" },
  { href: "/opinion", label: "Columnas de Opinión" },
  { href: "/cartas-al-director", label: "Cartas al Director" },
  { href: "/difusion", label: "Difusión" },
  { href: "/revista-castellanica", label: "Revista Castellánica" },
] as const;

export const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1504711434966-e33886168f5c?w=800&q=80";
