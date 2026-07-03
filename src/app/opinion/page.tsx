export const dynamic = "force-dynamic";
export const revalidate = 300;

import type { Metadata } from "next";
import { TipoArticulo } from "@prisma/client";
import { CategoryPage } from "@/components/articles/category-page";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Columnas de Opinión",
  description: `Columnas de análisis y debate desde la pedagogía y la comunicación en ${SITE_NAME}. Reflexiones de académicos y estudiantes de la UFRO sobre educación, lenguaje y cultura.`,
  alternates: { canonical: `${SITE_URL}/opinion` },
  openGraph: {
    title: `Columnas de Opinión | ${SITE_NAME}`,
    description: `Espacio de análisis y debate desde la pedagogía y la comunicación.`,
    url: `${SITE_URL}/opinion`,
    type: "website",
  },
};

export default function OpinionPage() {
  return (
    <CategoryPage
      tipo={TipoArticulo.OPINION}
      title="Columnas de Opinión"
      description="Espacio de análisis y debate desde la pedagogía y la comunicación."
    />
  );
}