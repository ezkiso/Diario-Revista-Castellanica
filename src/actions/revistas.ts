"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sanitizeHtml } from "@/lib/sanitize";
import { revistaSchema, contenidoRevistaSchema } from "@/lib/validations";

type ActionResult = { success: boolean; error?: string; id?: string };

async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autorizado");
}

export async function createRevista(formData: FormData): Promise<ActionResult> {
  try {
    await requireAuth();
    const raw = Object.fromEntries(formData);
    const parsed = revistaSchema.safeParse({
      ...raw,
      publicada: raw.publicada === "true" || raw.publicada === "on",
    });
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message };
    }

    const data = parsed.data;
    const revista = await prisma.revista.create({
      data: {
        nombre: data.nombre,
        anio: data.anio,
        descripcion: data.descripcion,
        portada: data.portada || null,
        publicada: data.publicada,
      },
    });

    revalidateRevistaPaths();
    return { success: true, id: revista.id };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Error al crear revista" };
  }
}

export async function updateRevista(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAuth();
    const raw = Object.fromEntries(formData);
    const parsed = revistaSchema.safeParse({
      ...raw,
      publicada: raw.publicada === "true" || raw.publicada === "on",
    });
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message };
    }

    const data = parsed.data;
    await prisma.revista.update({
      where: { id },
      data: {
        nombre: data.nombre,
        anio: data.anio,
        descripcion: data.descripcion,
        portada: data.portada || null,
        publicada: data.publicada,
      },
    });

    revalidateRevistaPaths();
    return { success: true, id };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Error al actualizar" };
  }
}

export async function deleteRevista(id: string): Promise<ActionResult> {
  try {
    await requireAuth();
    await prisma.revista.delete({ where: { id } });
    revalidateRevistaPaths();
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Error al eliminar" };
  }
}

export async function createContenidoRevista(
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAuth();
    const raw = Object.fromEntries(formData);
    const parsed = contenidoRevistaSchema.safeParse(raw);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message };
    }

    const data = parsed.data;
    const item = await prisma.contenidoRevista.create({
      data: {
        titulo: data.titulo,
        autor: data.autor,
        contenido: sanitizeHtml(data.contenido),
        imagen: data.imagen || null,
        revistaId: data.revistaId,
      },
    });

    revalidateRevistaPaths();
    return { success: true, id: item.id };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Error al agregar contenido" };
  }
}

export async function deleteContenidoRevista(id: string): Promise<ActionResult> {
  try {
    await requireAuth();
    await prisma.contenidoRevista.delete({ where: { id } });
    revalidateRevistaPaths();
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Error al eliminar contenido" };
  }
}

function revalidateRevistaPaths() {
  revalidatePath("/revista-castellanica");
  revalidatePath("/admin");
  revalidatePath("/admin/revistas");
}
