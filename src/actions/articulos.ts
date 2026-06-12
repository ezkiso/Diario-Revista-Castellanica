"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { ArticuloService } from "@/lib/services/ArticuloService";
import { TipoArticulo } from "@prisma/client";

type ActionResult = { success: boolean; error?: string; id?: string };

async function getSessionUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autorizado");
  return session.user.id;
}

const service = new ArticuloService();

export async function createArticulo(
  formData: FormData
): Promise<ActionResult> {
  try {
    const userId = await getSessionUserId();
    const raw = Object.fromEntries(formData);

    const articulo = await service.create({
      titulo: raw.titulo as string,
      resumen: raw.resumen as string,
      contenido: raw.contenido as string,
      imagenDestacada: raw.imagenDestacada as string || undefined,
      tipo: raw.tipo as TipoArticulo,
      fechaPublicacion: new Date(raw.fechaPublicacion as string),
      publicado: raw.publicado === "true" || raw.publicado === "on",
      autorId: userId,
      slug: raw.slug as string || undefined,
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

    await service.update(id, {
      titulo: raw.titulo as string,
      resumen: raw.resumen as string,
      contenido: raw.contenido as string,
      imagenDestacada: raw.imagenDestacada as string || undefined,
      tipo: raw.tipo as TipoArticulo,
      fechaPublicacion: new Date(raw.fechaPublicacion as string),
      publicado: raw.publicado === "true" || raw.publicado === "on",
      slug: raw.slug as string || undefined,
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
    await service.delete(id);
    revalidatePaths();
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Error al eliminar" };
  }
}

export async function publicarArticulo(id: string): Promise<ActionResult> {
  try {
    const userId = await getSessionUserId();
    await service.publicar(id, userId);
    revalidatePaths();
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Error al publicar" };
  }
}

export async function borradorArticulo(id: string): Promise<ActionResult> {
  try {
    await getSessionUserId();
    await service.borrador(id);
    revalidatePaths();
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Error al pasar a borrador" };
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
