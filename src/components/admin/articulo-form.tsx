"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { TipoArticulo } from "@prisma/client";
import { createArticulo, updateArticulo } from "@/actions/articulos";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TIPO_ARTICULO_LABELS } from "@/lib/constants";
import { Upload, X } from "lucide-react";

type ArticuloFormProps = {
  articulo?: {
    id: string;
    titulo: string;
    slug: string;
    resumen: string;
    contenido: string;
    imagenDestacada: string | null;
    tipo: TipoArticulo;
    fechaPublicacion: Date;
    publicado: boolean;
  };
};

function toLocalDatetime(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function ArticuloForm({ articulo }: ArticuloFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [contenido, setContenido] = useState(articulo?.contenido ?? "");
  const [tipo, setTipo] = useState<TipoArticulo>(
    articulo?.tipo ?? TipoArticulo.NOTICIA
  );
  const [publicado, setPublicado] = useState(articulo?.publicado ?? false);
  const [imagenUrl, setImagenUrl] = useState(articulo?.imagenDestacada ?? "");
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEdit = !!articulo;

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
    formData.set("tipo", tipo);
    formData.set("publicado", String(publicado));
    formData.set("imagenDestacada", imagenUrl);

    startTransition(async () => {
      const result = isEdit
        ? await updateArticulo(articulo.id, formData)
        : await createArticulo(formData);

      if (!result.success) {
        setError(result.error ?? "Error desconocido");
        return;
      }
      router.push("/admin/articulos");
      router.refresh();
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6 max-w-3xl">
      <div>
        <Label htmlFor="titulo">Título</Label>
        <Input
          id="titulo"
          name="titulo"
          required
          defaultValue={articulo?.titulo}
          className="mt-1"
        />
      </div>

      {isEdit && (
        <div>
          <Label htmlFor="slug">Slug (URL)</Label>
          <Input
            id="slug"
            name="slug"
            defaultValue={articulo.slug}
            className="mt-1 font-mono text-sm"
          />
        </div>
      )}

      <div>
        <Label htmlFor="resumen">Resumen</Label>
        <Textarea
          id="resumen"
          name="resumen"
          required
          rows={3}
          defaultValue={articulo?.resumen}
          className="mt-1"
        />
      </div>

      <div className="space-y-3">
        <Label>Imagen destacada</Label>

        {imagenUrl && (
          <div className="relative w-full max-w-md">
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
              <Image
                src={imagenUrl}
                alt="Imagen destacada"
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
              htmlFor="fileUpload"
              className="cursor-pointer flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Upload className="h-4 w-4" />
              Hacer clic para subir una imagen
            </Label>
            <input
              id="fileUpload"
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
          id="imagenDestacada"
          name="imagenDestacada"
          type="text"
          placeholder="https://... o /uploads/..."
          value={imagenUrl}
          onChange={(e) => setImagenUrl(e.target.value)}
          className="mt-1"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label>Tipo</Label>
          <Select value={tipo} onValueChange={(v) => setTipo(v as TipoArticulo)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(TIPO_ARTICULO_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="fechaPublicacion">Fecha y hora de publicación</Label>
          <Input
            id="fechaPublicacion"
            name="fechaPublicacion"
            type="datetime-local"
            required
            defaultValue={toLocalDatetime(
              articulo?.fechaPublicacion ?? new Date()
            )}
            className="mt-1"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Switch id="publicado" checked={publicado} onCheckedChange={setPublicado} />
        <Label htmlFor="publicado">Publicado</Label>
      </div>

      <div>
        <Label>Contenido</Label>
        <RichTextEditor
          value={contenido}
          onChange={setContenido}
          className="mt-1"
        />
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={pending || uploadingImage}>
          {pending ? "Guardando…" : isEdit ? "Actualizar" : "Crear artículo"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
