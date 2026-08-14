import { TipoArticulo } from "@prisma/client";

export const SITE_NAME = "Mal Sentados";
export const SITE_DESCRIPTION =
  "Proyecto creado y autogestionado por estudiantes de la carrera de Pedagogía en Castellano de la Universidad de La Frontera.";
export const SITE_URL = process.env.AUTH_URL ?? "https://diario-revista-castellanica.vercel.app";

export const TIPO_ARTICULO_LABELS: Record<TipoArticulo, string> = {
  CONVERSACIONES: "Conversaciones",
  OPINION: "Opinión",
  CARTA_DIRECTOR: "Cartas al Director",
  DIFUSION: "Difusión",
};

export const TIPO_ARTICULO_ROUTES: Record<TipoArticulo, string> = {
  CONVERSACIONES: "/conversaciones",
  OPINION: "/opinion",
  CARTA_DIRECTOR: "/cartas-al-director",
  DIFUSION: "/difusion",
};

export const NAV_LINKS = [
  { href: "/conversaciones", label: "Conversaciones" },
  { href: "/opinion", label: "Opinión" },
  { href: "/cartas-al-director", label: "Cartas al Director" },
  { href: "/difusion", label: "Difusión" },
  { href: "/revista-castellanica", label: "Revista Castellánica" },
] as const;

export const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1504711434966-e33886168f5c?w=800&q=80";

  export const TIPO_LABELS: Record<TipoArticulo, string> = {
    CONVERSACIONES: "Conversaciones",
    OPINION:        "Opinión",
    CARTA_DIRECTOR: "Cartas al Director",
    DIFUSION:       "Difusión",
  };

  export const TIPO_HREFS: Record<TipoArticulo, string> = {
    CONVERSACIONES: "/conversaciones",
    OPINION:        "/opinion",
    CARTA_DIRECTOR: "/cartas-al-director",
    DIFUSION:       "/difusion",
  };