"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createRevista, updateRevista } from "@/actions/revistas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Upload, X } from "lucide-react";

type RevistaFormProps = {
  revista?: {
    id: string;
    nombre: string;
    anio: number;
    descripcion: string;
    portada: string | null;
    publicada: boolean;
  };
};

export function RevistaForm({ revista }: RevistaFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [publicada, setPublicada] = useState(revista?.publicada ?? false);
  const [portadaUrl, setPortadaUrl] = useState(revista?.portada ?? "");
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEdit = !!revista;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al subir la imagen");
      }

      const data = await response.json();
      setPortadaUrl(data.url);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al subir la imagen"
      );
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = () => {
    setPortadaUrl("");
  };

  function handleSubmit(formData: FormData) {
    formData.set("publicada", String(publicada));
    formData.set("portada", portadaUrl);

    startTransition(async () => {
      const result = isEdit
        ? await updateRevista(revista.id, formData)
        : await createRevista(formData);

      if (!result.success) {
        setError(result.error ?? "Error desconocido");
        return;
      }
      router.push(
        isEdit ? `/admin/revistas/${revista.id}` : `/admin/revistas/${result.id}`
      );
      router.refresh();
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <Label htmlFor="nombre">Nombre</Label>
        <Input
          id="nombre"
          name="nombre"
          required
          defaultValue={revista?.nombre}
          placeholder="Revista Castellánica 2027"
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="anio">Año</Label>
        <Input
          id="anio"
          name="anio"
          type="number"
          required
          min={2000}
          max={2100}
          defaultValue={revista?.anio ?? new Date().getFullYear()}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea
          id="descripcion"
          name="descripcion"
          required
          rows={4}
          defaultValue={revista?.descripcion}
          className="mt-1"
        />
      </div>

      <div className="space-y-3">
        <Label>Portada</Label>

        {portadaUrl && (
          <div className="relative w-full max-w-md">
            <div className="relative aspect-[2/3] bg-muted rounded-lg overflow-hidden">
              <Image
                src={portadaUrl}
                alt="Portada de revista"
                fill
                className="object-cover"
                onError={() => {
                  console.error("Error al cargar imagen");
                }}
              />
            </div>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-destructive text-white p-1 rounded hover:bg-destructive/90 transition-colors"
              title="Eliminar imagen"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="border-2 border-dashed rounded-lg p-4 bg-muted/20">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="fileUploadPortada"
              className="cursor-pointer flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Upload className="h-4 w-4" />
              Hacer clic para subir una imagen
            </Label>
            <input
              id="fileUploadPortada"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImage}
              className="hidden"
            />
            <p className="text-xs text-muted-foreground">
              Máximo 5 MB • PNG, JPG, WebP, etc.
            </p>
            {uploadingImage && (
              <p className="text-sm text-blue-600">Subiendo imagen...</p>
            )}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-muted-foreground/20" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              O ingresa una URL
            </span>
          </div>
        </div>

        <Input
          id="portada"
          name="portada"
          type="text"
          placeholder="https://... o /uploads/..."
          value={portadaUrl}
          onChange={(e) => setPortadaUrl(e.target.value)}
          className="mt-1"
        />
      </div>
      <div className="flex items-center gap-3">
        <Switch id="publicada" checked={publicada} onCheckedChange={setPublicada} />
        <Label htmlFor="publicada">Publicada</Label>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-3">
        <Button type="submit" disabled={pending || uploadingImage}>
          {pending ? "Guardando…" : isEdit ? "Actualizar" : "Crear revista"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
