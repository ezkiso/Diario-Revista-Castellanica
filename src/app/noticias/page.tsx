export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { TipoArticulo } from "@prisma/client";
import { CategoryPage } from "@/components/articles/category-page";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Noticias",
  description: `Noticias de ${SITE_NAME} — Universidad de La Frontera`,
};

export default function NoticiasPage() {
  return (
    <CategoryPage
      tipo={TipoArticulo.NOTICIA}
      title="Noticias"
      description="Actualidad de la carrera, la universidad y la comunidad educativa."
    />
  );
}
