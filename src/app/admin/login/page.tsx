import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ufro-gray p-4">
      <div className="w-full max-w-md border bg-card p-8 shadow-lg rounded-lg">
        <h1 className="font-serif text-2xl font-bold text-ufro-blue mb-2">
          Acceso administrativo
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          Diario Castellano UFRO — solo personal autorizado
        </p>
        <Suspense fallback={<p>Cargando…</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
