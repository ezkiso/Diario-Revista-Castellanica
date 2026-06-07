export const dynamic = "force-dynamic";
export const revalidate = 300; // Revalidar cada 5 minutos

import type { Metadata } from "next";
import { TipoArticulo } from "@prisma/client";
import { CategoryPage } from "@/components/articles/category-page";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Columnas de Opinión",
  description: `Análisis y reflexión en ${SITE_NAME}`,
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
