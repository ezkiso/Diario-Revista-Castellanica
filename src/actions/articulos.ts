"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/slug";
import { sanitizeHtml } from "@/lib/sanitize";
import { articuloSchema } from "@/lib/validations";

type ActionResult = { success: boolean; error?: string; id?: string };

async function getSessionUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autorizado");
  return session.user.id;
}

export async function createArticulo(
  formData: FormData
): Promise<ActionResult> {
  try {
    const userId = await getSessionUserId();
    const raw = Object.fromEntries(formData);
    const parsed = articuloSchema.safeParse({
      ...raw,
      publicado: raw.publicado === "true" || raw.publicado === "on",
    });
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message };
    }

    const data = parsed.data;
    let slug = data.slug?.trim() || generateSlug(data.titulo);
    const existing = await prisma.articulo.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    const articulo = await prisma.articulo.create({
      data: {
        titulo: data.titulo,
        slug,
        resumen: data.resumen,
        contenido: sanitizeHtml(data.contenido),
        imagenDestacada: data.imagenDestacada || null,
        tipo: data.tipo,
        fechaPublicacion: new Date(data.fechaPublicacion),
        publicado: data.publicado,
        autorId: userId,
      },
    });

    revalidatePaths();
    return { success: true, id: articulo.id };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Error al crear" };
  }
}

export async function updateArticulo(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    await getSessionUserId();
    const raw = Object.fromEntries(formData);
    const parsed = articuloSchema.safeParse({
      ...raw,
      publicado: raw.publicado === "true" || raw.publicado === "on",
    });
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message };
    }

    const data = parsed.data;
    const slug = data.slug?.trim() || generateSlug(data.titulo);

    await prisma.articulo.update({
      where: { id },
      data: {
        titulo: data.titulo,
        slug,
        resumen: data.resumen,
        contenido: sanitizeHtml(data.contenido),
        imagenDestacada: data.imagenDestacada || null,
        tipo: data.tipo,
        fechaPublicacion: new Date(data.fechaPublicacion),
        publicado: data.publicado,
      },
    });

    revalidatePaths();
    return { success: true, id };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Error al actualizar" };
  }
}

export async function deleteArticulo(id: string): Promise<ActionResult> {
  try {
    await getSessionUserId();
    await prisma.articulo.delete({ where: { id } });
    revalidatePaths();
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Error al eliminar" };
  }
}

function revalidatePaths() {
  revalidatePath("/");
  revalidatePath("/noticias");
  revalidatePath("/opinion");
  revalidatePath("/cartas-al-director");
  revalidatePath("/difusion");
  revalidatePath("/admin");
  revalidatePath("/admin/articulos");
}
