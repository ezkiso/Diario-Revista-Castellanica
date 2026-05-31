"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteContenidoRevista } from "@/actions/revistas";
import { Button } from "@/components/ui/button";

export function DeleteContenidoButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-destructive"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await deleteContenidoRevista(id);
          router.refresh();
        })
      }
    >
      Eliminar
    </Button>
  );
}
