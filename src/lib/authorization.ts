// src/lib/authorization.ts

import { prisma } from '@/lib/prisma';
import { Rol } from '@prisma/client';

/**
 * Verifica si el usuario tiene permiso para realizar una acción sobre un artículo
 * @param userId - ID del usuario que intenta la acción
 * @param articuloId - ID del artículo
 * @param userRol - Rol del usuario (ADMIN, EDITOR)
 * @throws Error si no tiene permiso
 */
export async function verifyArticleOwnership(
  userId: string,
  articuloId: string,
  userRol: Rol
): Promise<void> {
  // Los administradores pueden modificar cualquier artículo
  if (userRol === 'ADMIN') {
    return;
  }

  // Los editores y usuarios regulares solo pueden modificar sus propios artículos
  const articulo = await prisma.articulo.findUnique({
    where: { id: articuloId },
    select: { autorId: true },
  });

  if (!articulo) {
    throw new Error('Artículo no encontrado');
  }

  if (articulo.autorId !== userId) {
    throw new Error('No tienes permiso para modificar este artículo');
  }
}

/**
 * Verifica si el usuario tiene rol de administrador o editor
 * @param userRol - Rol del usuario
 * @returns true si es ADMIN o EDITOR
 */
export function isAdminOrEditor(userRol: Rol): boolean {
  return userRol === 'ADMIN' || userRol === 'EDITOR';
}

/**
 * Verifica si el usuario es administrador
 * @param userRol - Rol del usuario
 * @returns true si es ADMIN
 */
export function isAdmin(userRol: Rol): boolean {
  return userRol === 'ADMIN';
}

/**
 * Verifica si el usuario tiene permiso para publicar artículos
 * @param userRol - Rol del usuario
 * @throws Error si no tiene permiso
 */
export function verifyPublishPermission(userRol: Rol): void {
  if (!isAdminOrEditor(userRol)) {
    throw new Error('Solo administradores y editores pueden publicar artículos');
  }
}
