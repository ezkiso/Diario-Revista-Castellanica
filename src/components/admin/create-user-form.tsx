"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Rol } from "@prisma/client";

type CreateUserFormProps = {
  canCreateAdmin: boolean;
};

export function CreateUserForm({ canCreateAdmin }: CreateUserFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const nombre = form.get("nombre") as string;
    const rol = form.get("rol") as Rol;

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, nombre, rol }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Error al crear usuario");
        return;
      }

      setSuccess("Usuario creado exitosamente");
      formRef.current?.reset();
      router.refresh();
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="nombre">Nombre completo</Label>
          <Input
            id="nombre"
            name="nombre"
            type="text"
            required
            minLength={2}
            maxLength={100}
            className="mt-1"
            placeholder="Juan Pérez"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1"
            placeholder="usuario@ejemplo.com"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={12}
            className="mt-1"
            placeholder="Mínimo 12 caracteres, mayúscula, minúscula, número y símbolo"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Requisitos: 12+ caracteres, mayúscula, minúscula, número, símbolo
          </p>
        </div>
        <div>
          <Label htmlFor="rol">Rol</Label>
          <Select name="rol" required defaultValue="EDITOR">
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Seleccionar rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EDITOR">Editor</SelectItem>
              {canCreateAdmin && (
                <SelectItem value="ADMIN">Administrador</SelectItem>
              )}
            </SelectContent>
          </Select>
          {!canCreateAdmin && (
            <p className="text-xs text-muted-foreground mt-1">
              Solo puede haber un administrador
            </p>
          )}
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {success && (
        <p className="text-sm text-green-700" role="alert">
          {success}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creando usuario…" : "Crear usuario"}
      </Button>
    </form>
  );
}
