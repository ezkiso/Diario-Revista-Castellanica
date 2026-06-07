export const dynamic = "force-dynamic";
export const revalidate = 300; // Revalidar cada 5 minutos

import type { Metadata } from "next";
import { TipoArticulo } from "@prisma/client";
import { CategoryPage } from "@/components/articles/category-page";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Difusión",
  description: `Actividades y convocatorias — ${SITE_NAME}`,
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
