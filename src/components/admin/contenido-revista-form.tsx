"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createContenidoRevista } from "@/actions/revistas";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ContenidoRevistaForm({ revistaId }: { revistaId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [contenido, setContenido] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    formData.set("contenido", contenido);
    formData.set("revistaId", revistaId);

    startTransition(async () => {
      const result = await createContenidoRevista(formData);
      if (!result.success) {
        setError(result.error ?? "Error");
        return;
      }
      setContenido("");
      router.refresh();
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4 border p-4 rounded-lg bg-muted/20">
      <h3 className="font-semibold">Agregar contenido literario</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="titulo">Título</Label>
          <Input id="titulo" name="titulo" required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="autor">Autor</Label>
          <Input id="autor" name="autor" required className="mt-1" />
        </div>
      </div>
      <div>
        <Label htmlFor="imagen">URL imagen (opcional)</Label>
        <Input id="imagen" name="imagen" type="text" placeholder="https://... o /uploads/..." className="mt-1" />
      </div>
      <div>
        <Label>Contenido</Label>
        <RichTextEditor value={contenido} onChange={setContenido} className="mt-1" />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Agregando…" : "Agregar texto"}
      </Button>
    </form>
  );
}
