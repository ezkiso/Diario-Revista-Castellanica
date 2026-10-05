export const dynamic = "force-dynamic";
export const revalidate = 300;

import type { Metadata } from "next";
import { TipoArticulo } from "@prisma/client";
import { CategoryPage } from "@/components/articles/category-page";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Pensamiento y Crítica",
  description: `Lee artículos de pensamiento y crítica de estudiantes, académicos y lectores del ${SITE_NAME}, medio digital de Pedagogía en Castellano y Comunicación de la UFRO.`,
  alternates: { canonical: `${SITE_URL}/pensamiento-y-critica` },
  openGraph: {
    title: `Pensamiento y Crítica | ${SITE_NAME}`,
    description: `Análisis y reflexiones de la comunidad universitaria en ${SITE_NAME}.`,
    url: `${SITE_URL}/pensamiento-y-critica`,
    type: "website",
  },
};

export default function PensamientoPage() {
  return (
    <CategoryPage
      tipo={TipoArticulo.CARTA_DIRECTOR}
      title="Pensamiento y Crítica"
      description="Análisis y reflexiones de estudiantes, académicos y lectores."
    />
  );
}
