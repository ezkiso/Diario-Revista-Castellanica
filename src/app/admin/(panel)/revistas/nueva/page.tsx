import { NuevaRevistaConContenido } from "@/components/admin/nueva-revista-con-contenido";
import { requireAuth } from "@/lib/auth-utils";

export default async function NuevaRevistaPage() {
  await requireAuth();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Nueva revista anual</h1>
      <NuevaRevistaConContenido />
    </div>
  );
}
