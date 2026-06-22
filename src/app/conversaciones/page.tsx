export const dynamic = "force-dynamic";
export const revalidate = 300; // Revalidar cada 5 minutos

import type { Metadata } from "next";
import { TipoArticulo } from "@prisma/client";
import { CategoryPage } from "@/components/articles/category-page";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Conversaciones",
  description: `Conversaciones de ${SITE_NAME} — Universidad de La Frontera`,
};

export default function ConversacionesPage() {
  return (
    <CategoryPage
      tipo={TipoArticulo.CONVERSACIONES}
      title="Conversaciones"
      description="Discusiones y reflexiones sobre la pedagogía en castellano y la comunidad educativa."
    />
  );
}
