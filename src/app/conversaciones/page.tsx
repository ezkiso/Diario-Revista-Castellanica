export const dynamic = "force-dynamic";
export const revalidate = 300;

import type { Metadata } from "next";
import { TipoArticulo } from "@prisma/client";
import { CategoryPage } from "@/components/articles/category-page";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Conversaciones",
  description: `Discusiones y reflexiones sobre la pedagogía en castellano y la comunidad educativa de ${SITE_NAME} — Universidad de La Frontera.`,
  alternates: { canonical: `${SITE_URL}/conversaciones` },
  openGraph: {
    title: `Conversaciones | ${SITE_NAME}`,
    description: `Discusiones y reflexiones sobre la pedagogía en castellano y la comunidad educativa.`,
    url: `${SITE_URL}/conversaciones`,
    type: "website",
  },
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