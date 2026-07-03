export const dynamic = "force-dynamic";
export const revalidate = 300;

import type { Metadata } from "next";
import { TipoArticulo } from "@prisma/client";
import { CategoryPage } from "@/components/articles/category-page";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Difusión",
  description: `Seminarios, convocatorias y actividades de difusión de la Carrera de Pedagogía en Castellano y Comunicación de la UFRO. Mantente informado sobre los eventos de ${SITE_NAME}.`,
  alternates: { canonical: `${SITE_URL}/difusion` },
  openGraph: {
    title: `Difusión | ${SITE_NAME}`,
    description: `Actividades, seminarios y publicaciones de difusión de la carrera.`,
    url: `${SITE_URL}/difusion`,
    type: "website",
  },
};

export default function DifusionPage() {
  return (
    <CategoryPage
      tipo={TipoArticulo.DIFUSION}
      title="Difusión"
      description="Seminarios, actividades y publicaciones de difusión de la carrera."
    />
  );
}
