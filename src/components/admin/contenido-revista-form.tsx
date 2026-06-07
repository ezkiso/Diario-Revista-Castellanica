"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createContenidoRevista } from "@/actions/revistas";
import dynamic from "next/dynamic";
const RichTextEditor = dynamic(
  () => import("@/components/editor/rich-text-editor").then(mod => ({ default: mod.RichTextEditor })),
  { 
    loading: () => <p className="text-sm text-muted-foreground">Cargando editor...</p>,
    ssr: false 
  }
);
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";

export function ContenidoRevistaForm({ revistaId }: { revistaId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [contenido, setContenido] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [imagenUrl, setImagenUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setImagenUrl(data.url);
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
    setImagenUrl("");
  };

  function handleSubmit(formData: FormData) {
    formData.set("contenido", contenido);
    formData.set("revistaId", revistaId);
    formData.set("imagen", imagenUrl);

    startTransition(async () => {
      const result = await createContenidoRevista(formData);
      if (!result.success) {
        setError(result.error ?? "Error");
        return;
      }
      setContenido("");
      setImagenUrl("");
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

      <div className="space-y-3">
        <Label>Imagen (opcional)</Label>

        {imagenUrl && (
          <div className="relative w-full max-w-md">
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
              <Image
                src={imagenUrl}
                alt="Imagen del contenido"
                fill
                className="object-cover"
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
              htmlFor="fileUploadContenido"
              className="cursor-pointer flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Upload className="h-4 w-4" />
              Hacer clic para subir una imagen
            </Label>
            <input
              id="fileUploadContenido"
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
          id="imagen"
          name="imagen"
          type="text"
          placeholder="https://... o /uploads/..."
          value={imagenUrl}
          onChange={(e) => setImagenUrl(e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <Label>Contenido</Label>
        <RichTextEditor value={contenido} onChange={setContenido} className="mt-1" />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" size="sm" disabled={pending || uploadingImage}>
        {pending ? "Agregando…" : "Agregar texto"}
      </Button>
    </form>
  );
}
