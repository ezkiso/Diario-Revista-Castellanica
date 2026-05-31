"use client";

import { useState } from "react";
import { ContenidoRevista } from "@prisma/client";
import { EditarContenidoRevistaForm } from "@/components/admin/editar-contenido-revista-form";
import { DeleteContenidoButton } from "@/components/admin/delete-contenido-button";
import { ArticleContent } from "@/components/articles/article-content";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";

type ContenidoRevistaListProps = {
  contenidos: ContenidoRevista[];
};

export function ContenidoRevistaList({ contenidos }: ContenidoRevistaListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="mt-8 space-y-6">
      {contenidos.map((c) =>
        editingId === c.id ? (
          <EditarContenidoRevistaForm
            key={c.id}
            contenido={c}
            onCancel={() => setEditingId(null)}
          />
        ) : (
          <div key={c.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h3 className="font-semibold">{c.titulo}</h3>
                <p className="text-sm text-muted-foreground">por {c.autor}</p>
              </div>
              <div className="flex gap-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingId(c.id)}
                  className="gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  Editar
                </Button>
                <DeleteContenidoButton id={c.id} />
              </div>
            </div>
            <ArticleContent html={c.contenido} />
            {c.imagen && (
              <div className="mt-3">
                <img
                  src={c.imagen}
                  alt={c.titulo}
                  className="max-w-sm rounded-lg"
                />
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}
