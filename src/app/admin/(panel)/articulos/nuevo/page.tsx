import { ArticuloForm } from "@/components/admin/articulo-form";
import { requireAuth } from "@/lib/auth-utils";

export default async function NuevoArticuloPage() {
  await requireAuth();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Nuevo artículo</h1>
      <ArticuloForm />
    </div>
  );
}
