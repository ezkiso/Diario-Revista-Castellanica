// src/components/seo/article-jsonld.tsx
// Uso: importar en src/app/articulo/[slug]/page.tsx
// y renderizar <ArticleJsonLd {...props} /> dentro del return

interface ArticleJsonLdProps {
  titulo: string;
  resumen: string;
  slug: string;
  imagenDestacada?: string | null;
  fechaPublicacion: Date;
  updatedAt: Date;
  autorNombre: string;
}

const BASE_URL = "https://diario-revista-castellanica.vercel.app";
const LOGO_URL = `${BASE_URL}/logo.png`; // ajusta si tienes otro path

export function ArticleJsonLd({
  titulo,
  resumen,
  slug,
  imagenDestacada,
  fechaPublicacion,
  updatedAt,
  autorNombre,
}: ArticleJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: titulo,
    description: resumen,
    url: `${BASE_URL}/articulo/${slug}`,
    datePublished: fechaPublicacion.toISOString(),
    dateModified: updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: autorNombre,
    },
    publisher: {
      "@type": "Organization",
      name: "Diario Castellano UFRO",
      logo: {
        "@type": "ImageObject",
        url: LOGO_URL,
      },
    },
    ...(imagenDestacada && {
      image: {
        "@type": "ImageObject",
        url: imagenDestacada,
      },
    }),
    inLanguage: "es-CL",
    isAccessibleForFree: true,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// JSON-LD para la ORGANIZACIÓN (agregar en src/app/layout.tsx una sola vez)
// ─────────────────────────────────────────────────────────────────────────────
export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: "Diario Castellano UFRO",
    url: BASE_URL,
    logo: LOGO_URL,
    description:
      "Portal de noticias, opinión y cultura de la Carrera de Pedagogía en Castellano y Comunicación — Universidad de La Frontera, Temuco, Chile.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. Francisco Salazar 01145",
      addressLocality: "Temuco",
      addressRegion: "Araucanía",
      addressCountry: "CL",
    },
    parentOrganization: {
      "@type": "CollegeOrUniversity",
      name: "Universidad de La Frontera",
      url: "https://www.ufro.cl",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// JSON-LD para BREADCRUMB (agregar en la página del artículo)
// ─────────────────────────────────────────────────────────────────────────────
interface BreadcrumbJsonLdProps {
  tipo: string;          // "Noticias" | "Columnas de Opinión" | etc.
  tipoHref: string;      // "/noticias" | "/opinion" | etc.
  articuloTitulo: string;
  articuloSlug: string;
}

export function BreadcrumbJsonLd({
  tipo,
  tipoHref,
  articuloTitulo,
  articuloSlug,
}: BreadcrumbJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: tipo,
        item: `${BASE_URL}${tipoHref}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: articuloTitulo,
        item: `${BASE_URL}/articulo/${articuloSlug}`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}