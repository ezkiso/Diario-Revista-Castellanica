import { TipoArticulo } from "@prisma/client";
import { z } from "zod";

// Validador personalizado para URLs o rutas relativas de imágenes
const imageUrlOrPath = z.string().refine(
  (val) => {
    if (!val) return true; // Permitir vacío
    // Aceptar URLs completas (http/https) o rutas relativas (/uploads/...)
    return /^(https?:\/\/.+|\/uploads\/.+)$/.test(val);
  },
  { message: "Debe ser una URL válida o ruta de imagen subida" }
);

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

export const articuloSchema = z.object({
  titulo: z.string().min(5, "Mínimo 5 caracteres").max(200),
  resumen: z.string().min(20, "Mínimo 20 caracteres").max(500),
  contenido: z.string().min(10, "El contenido es obligatorio"),
  imagenDestacada: imageUrlOrPath.optional().or(z.literal("")),
  tipo: z.nativeEnum(TipoArticulo),
  fechaPublicacion: z.string().min(1, "Fecha requerida"),
  publicado: z.boolean(),
  slug: z.string().optional(),
});

export const revistaSchema = z.object({
  nombre: z.string().min(3).max(120),
  anio: z.coerce.number().int().min(2000).max(2100),
  descripcion: z.string().min(10),
  portada: imageUrlOrPath.optional().or(z.literal("")),
  publicada: z.boolean(),
});

export const contenidoRevistaSchema = z.object({
  titulo: z.string().min(2).max(200),
  autor: z.string().min(2).max(120),
  contenido: z.string().min(10),
  imagen: imageUrlOrPath.optional().or(z.literal("")),
  revistaId: z.string().cuid(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ArticuloInput = z.infer<typeof articuloSchema>;
export type RevistaInput = z.infer<typeof revistaSchema>;
export type ContenidoRevistaInput = z.infer<typeof contenidoRevistaSchema>;
