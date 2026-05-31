export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { TipoArticulo } from "@prisma/client";
import { CategoryPage } from "@/components/articles/category-page";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Cartas al Director",
  description: `Cartas de lectores en ${SITE_NAME}`,
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
