"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import Link from "next/link"; // ← NUEVO

export function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);

    const result = await signIn("credentials", {
      email: form.get("email") as string,
      password: form.get("password") as string,
      redirect: false,
    });

    if (!result?.ok || result.error) {
      setLoading(false);
      setError("Credenciales incorrectas");
      return;
    }

    // Confirma que el navegador ya puede leer la cookie antes de entrar al panel.
    const sessionResponse = await fetch("/api/auth/session", {
      cache: "no-store",
    });
    const session = (await sessionResponse.json()) as {
      user?: { id?: string };
    };

    if (!session.user?.id) {
      setLoading(false);
      setError("No se pudo confirmar la sesión. Intenta nuevamente.");
      return;
    }

    window.location.assign(callbackUrl);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="password">Contraseña</Label>
        <PasswordInput
          id="password"
          name="password"
          required
          autoComplete="current-password"
          className="mt-1"
        />
      </div>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Ingresando…" : "Ingresar"}
      </Button>
                       {/* ← NUEVO */}
        {/* PENDIENTE: activar cuando se configure dominio en Brevo
        <Link
          href="/recuperar-contrasena"
          className="text-sm text-muted-foreground hover:underline block text-center"
        >
          ¿Olvidaste tu contraseña?
        </Link>
        */}
    </form>
  );
}