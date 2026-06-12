"use client";

import { useTransition } from "react";
import { publicarArticulo, borradorArticulo } from "@/actions/articulos";
import { Button } from "@/components/ui/button";

export function ToggleArticuloStatusButton({ 
  id, 
  publicado 
}: { 
  id: string; 
  publicado: boolean;
}) {
  const [pending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      if (publicado) {
        await borradorArticulo(id);
      } else {
        await publicarArticulo(id);
      }
    });
  };

  return (
    <Button
      variant={publicado ? "outline" : "default"}
      size="sm"
      disabled={pending}
      onClick={handleToggle}
    >
      {pending ? "Procesando..." : publicado ? "Pasar a borrador" : "Publicar"}
    </Button>
  );
}
