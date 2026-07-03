export const dynamic = "force-dynamic";
export const revalidate = 300;

import type { Metadata } from "next";
import { TipoArticulo } from "@prisma/client";
import { CategoryPage } from "@/components/articles/category-page";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Cartas al Director",
  description: `Lee las cartas de estudiantes, académicos y lectores dirigidas a la redacción del ${SITE_NAME}, medio digital de Pedagogía en Castellano y Comunicación de la UFRO.`,
  alternates: { canonical: `${SITE_URL}/cartas-al-director` },
  openGraph: {
    title: `Cartas al Director | ${SITE_NAME}`,
    description: `Voces de la comunidad universitaria dirigidas a la redacción del ${SITE_NAME}.`,
    url: `${SITE_URL}/cartas-al-director`,
    type: "website",
  },
};

export default function CartasPage() {
  return (
    <CategoryPage
      tipo={TipoArticulo.CARTA_DIRECTOR}
      title="Cartas al Director"
      description="Voces de estudiantes, académicos y lectores dirigidas a la redacción."
    />
  );
}