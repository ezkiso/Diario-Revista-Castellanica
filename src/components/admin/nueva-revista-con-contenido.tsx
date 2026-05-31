"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createRevista, createContenidoRevista } from "@/actions/revistas";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, Plus, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

type ContenidoTemp = {
  id: string;
  titulo: string;
  autor: string;
  contenido: string;
  imagen: string;
};

export function NuevaRevistaConContenido() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [portadaUrl, setPortadaUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estado del formulario de revista
  const [nombre, setNombre] = useState("");
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [descripcion, setDescripcion] = useState("");

  // Estado para contenidos temporales (antes de guardar la revista)
  const [contenidosTemp, setContenidosTemp] = useState<ContenidoTemp[]>([]);
  const [mostrarFormContenido, setMostrarFormContenido] = useState(false);
  const [contenidoForm, setContenidoForm] = useState({
    titulo: "",
    autor: "",
    contenido: "",
    imagen: "",
  });
  const [uploadingContenidoImage, setUploadingContenidoImage] = useState(false);
  const fileInputContenidoRef = useRef<HTMLInputElement>(null);

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

  const handleContenidoImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingContenidoImage(true);

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
      setContenidoForm((prev) => ({ ...prev, imagen: data.url }));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al subir la imagen"
      );
    } finally {
      setUploadingContenidoImage(false);
      if (fileInputContenidoRef.current) {
        fileInputContenidoRef.current.value = "";
      }
    }
  };

  const handleRemovePortada = () => {
    setPortadaUrl("");
  };

  const handleRemoveContenidoImage = () => {
    setContenidoForm((prev) => ({ ...prev, imagen: "" }));
  };

  const agregarContenidoTemp = () => {
    if (!contenidoForm.titulo || !contenidoForm.autor || !contenidoForm.contenido) {
      setError("Por favor completa todos los campos del contenido");
      return;
    }

    const nuevoContenido: ContenidoTemp = {
      id: Date.now().toString(),
      ...contenidoForm,
    };

    setContenidosTemp([...contenidosTemp, nuevoContenido]);
    setContenidoForm({
      titulo: "",
      autor: "",
      contenido: "",
      imagen: "",
    });
    setMostrarFormContenido(false);
  };

  const eliminarContenidoTemp = (id: string) => {
    setContenidosTemp(contenidosTemp.filter((c) => c.id !== id));
  };

  function handleSubmit(formData: FormData) {
    if (!nombre || !descripcion) {
      setError("Por favor completa los datos de la revista");
      return;
    }

    formData.set("nombre", nombre);
    formData.set("anio", String(anio));
    formData.set("descripcion", descripcion);
    formData.set("portada", portadaUrl);
    formData.set("publicada", "false");

    startTransition(async () => {
      try {
        // Crear la revista
        const result = await createRevista(formData);
        if (!result.success) {
          setError(result.error ?? "Error al crear revista");
          return;
        }

        const revistaId = result.id!;

        // Crear los contenidos
        for (const contenido of contenidosTemp) {
          const contenidoFormData = new FormData();
          contenidoFormData.set("titulo", contenido.titulo);
          contenidoFormData.set("autor", contenido.autor);
          contenidoFormData.set("contenido", contenido.contenido);
          contenidoFormData.set("imagen", contenido.imagen);
          contenidoFormData.set("revistaId", revistaId);

          const contentResult = await createContenidoRevista(contenidoFormData);
          if (!contentResult.success) {
            console.error(
              `Error al crear contenido "${contenido.titulo}":`,
              contentResult.error
            );
          }
        }

        router.push(`/admin/revistas/${revistaId}`);
        router.refresh();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Error al crear revista con contenidos"
        );
      }
    });
  }

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Formulario de revista */}
      <div className="space-y-6 border p-6 rounded-lg bg-muted/10">
        <h2 className="text-lg font-semibold">Datos de la revista</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(new FormData());
          }}
          className="space-y-6"
        >
          <div>
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Revista Castellánica 2027"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="anio">Año</Label>
            <Input
              id="anio"
              type="number"
              required
              min={2000}
              max={2100}
              value={anio}
              onChange={(e) => setAnio(parseInt(e.target.value))}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              required
              rows={4}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
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
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRemovePortada}
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
              placeholder="https://example.com/imagen.jpg"
              value={portadaUrl}
              onChange={(e) => setPortadaUrl(e.target.value)}
              className="mt-1"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={pending}>
            {pending ? "Creando…" : "Crear revista"}
          </Button>
        </form>
      </div>

      <Separator />

      {/* Sección de contenidos literarios */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Contenidos literarios (opcional)</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMostrarFormContenido(!mostrarFormContenido)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            {mostrarFormContenido ? "Cancelar" : "Agregar contenido"}
          </Button>
        </div>

        {mostrarFormContenido && (
          <div className="border p-4 rounded-lg bg-blue-50/30 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="titulo-contenido">Título</Label>
                <Input
                  id="titulo-contenido"
                  value={contenidoForm.titulo}
                  onChange={(e) =>
                    setContenidoForm((prev) => ({
                      ...prev,
                      titulo: e.target.value,
                    }))
                  }
                  placeholder="Título del contenido"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="autor-contenido">Autor</Label>
                <Input
                  id="autor-contenido"
                  value={contenidoForm.autor}
                  onChange={(e) =>
                    setContenidoForm((prev) => ({
                      ...prev,
                      autor: e.target.value,
                    }))
                  }
                  placeholder="Nombre del autor"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Imagen (opcional)</Label>

              {contenidoForm.imagen && (
                <div className="relative w-full max-w-md">
                  <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                    <Image
                      src={contenidoForm.imagen}
                      alt="Imagen del contenido"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveContenidoImage}
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
                    ref={fileInputContenidoRef}
                    type="file"
                    accept="image/*"
                    onChange={handleContenidoImageUpload}
                    disabled={uploadingContenidoImage}
                    className="hidden"
                  />
                  <p className="text-xs text-muted-foreground">
                    Máximo 5 MB • PNG, JPG, WebP, etc.
                  </p>
                  {uploadingContenidoImage && (
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
                id="imagen-contenido"
                type="text"
                placeholder="https://... o /uploads/..."
                value={contenidoForm.imagen}
                onChange={(e) =>
                  setContenidoForm((prev) => ({
                    ...prev,
                    imagen: e.target.value,
                  }))
                }
                className="mt-1"
              />
            </div>

            <div>
              <Label>Contenido</Label>
              <RichTextEditor
                value={contenidoForm.contenido}
                onChange={(html) =>
                  setContenidoForm((prev) => ({ ...prev, contenido: html }))
                }
                className="mt-1"
              />
            </div>

            <Button
              onClick={agregarContenidoTemp}
              disabled={uploadingContenidoImage}
              className="w-full"
            >
              Agregar a la lista
            </Button>
          </div>
        )}

        {/* Lista de contenidos temporales */}
        {contenidosTemp.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {contenidosTemp.length} contenido(s) para crear
            </p>
            {contenidosTemp.map((c) => (
              <div
                key={c.id}
                className="border rounded-lg p-4 bg-muted/10 space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold">{c.titulo}</h4>
                    <p className="text-sm text-muted-foreground">por {c.autor}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => eliminarContenidoTemp(c.id)}
                    className="text-destructive hover:text-destructive/80 p-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {c.imagen && (
                  <div className="mt-2">
                    <img
                      src={c.imagen}
                      alt={c.titulo}
                      className="max-w-xs rounded-lg max-h-32 object-cover"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
