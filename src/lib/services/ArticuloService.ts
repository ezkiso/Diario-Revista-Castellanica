// src/lib/services/ArticuloService.ts

import { prisma } from '@/lib/prisma';
import { TipoArticulo, Rol } from '@prisma/client';
import { articuloSchema } from '@/lib/validations';
import { generateSlug } from '@/lib/slug';
import { sanitizeHtml } from '@/lib/sanitize';
import { verifyArticleOwnership, verifyPublishPermission } from '@/lib/authorization';

interface ArticuloData {
  titulo: string;
  resumen: string;
  contenido: string;
  imagenDestacada?: string;
  tipo: TipoArticulo;
  fechaPublicacion: Date;
  publicado: boolean;
  autorId: string;
  slug?: string;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export class ArticuloService {
  // ─────────────────────────────────────
  // VALIDAR antes de guardar
  // ─────────────────────────────────────
  validate(data: Partial<ArticuloData>): ValidationResult {
    const errors: string[] = [];

    if (!data.titulo || data.titulo.trim().length < 5) {
      errors.push('El título debe tener al menos 5 caracteres');
    }

    if (!data.resumen || data.resumen.trim().length < 20) {
      errors.push('El resumen debe tener al menos 20 caracteres');
    }

    if (!data.contenido || data.contenido.trim().length < 10) {
      errors.push('El contenido debe tener al menos 10 caracteres');
    }

    if (!data.tipo) {
      errors.push('El tipo de artículo es obligatorio');
    }

    if (!data.autorId) {
      errors.push('El artículo debe tener un autor');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  // ─────────────────────────────────────
  // PUBLICAR un artículo
  // ─────────────────────────────────────
  async publicar(articuloId: string, userId: string, userRol: Rol) {
    // 1. Verificar permisos de publicación
    verifyPublishPermission(userRol);

    // 2. Verificar que el artículo existe
    const articulo = await prisma.articulo.findUnique({
      where: { id: articuloId },
    });

    if (!articulo) {
      throw new Error(`Artículo ${articuloId} no encontrado`);
    }

    // 3. Verificar ownership (solo admin puede publicar artículos de otros)
    await verifyArticleOwnership(userId, articuloId, userRol);

    // 4. Verificar que no esté ya publicado
    if (articulo.publicado) {
      throw new Error('El artículo ya está publicado');
    }

    // 5. Validar contenido antes de publicar
    const validation = this.validate({
      titulo: articulo.titulo,
      resumen: articulo.resumen,
      contenido: articulo.contenido,
      tipo: articulo.tipo,
      autorId: articulo.autorId,
    });

    if (!validation.valid) {
      throw new Error(`No se puede publicar: ${validation.errors.join(', ')}`);
    }

    // 6. Actualizar en base de datos
    return await prisma.articulo.update({
      where: { id: articuloId },
      data: {
        publicado: true,
      },
    });
  }

  // ─────────────────────────────────────
  // PASAR A BORRADOR
  // ─────────────────────────────────────
  async borrador(articuloId: string, userId: string, userRol: Rol) {
    // 1. Verificar que el artículo existe
    const articulo = await prisma.articulo.findUnique({
      where: { id: articuloId },
    });

    if (!articulo) {
      throw new Error(`Artículo ${articuloId} no encontrado`);
    }

    // 2. Verificar ownership
    await verifyArticleOwnership(userId, articuloId, userRol);

    // 3. Verificar que no esté ya en borrador
    if (!articulo.publicado) {
      throw new Error('El artículo ya está en borrador');
    }

    return await prisma.articulo.update({
      where: { id: articuloId },
      data: {
        publicado: false,
      },
    });
  }

  // ─────────────────────────────────────
  // CREAR artículo nuevo
  // ─────────────────────────────────────
  async create(data: ArticuloData) {
    // Validar usando Zod schema
    const parsed = articuloSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(parsed.error.errors[0]?.message || 'Datos inválidos');
    }

    // Generar slug si no se proporciona
    let slug = data.slug?.trim() || generateSlug(data.titulo);
    const existing = await prisma.articulo.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    return await prisma.articulo.create({
      data: {
        titulo: data.titulo,
        slug,
        resumen: data.resumen,
        contenido: sanitizeHtml(data.contenido),
        imagenDestacada: data.imagenDestacada || null,
        tipo: data.tipo,
        fechaPublicacion: data.fechaPublicacion,
        publicado: data.publicado,
        autorId: data.autorId,
      },
    });
  }

  // ─────────────────────────────────────
  // ACTUALIZAR artículo existente
  // ─────────────────────────────────────
  async update(id: string, data: Partial<ArticuloData>, userId: string, userRol: Rol) {
    // 1. Verificar ownership
    await verifyArticleOwnership(userId, id, userRol);

    // 2. Validar usando Zod schema
    const parsed = articuloSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(parsed.error.errors[0]?.message || 'Datos inválidos');
    }

    // 3. Generar slug si se cambia el título
    let slug = data.slug;
    if (data.titulo && !data.slug) {
      slug = generateSlug(data.titulo);
    }

    return await prisma.articulo.update({
      where: { id },
      data: {
        ...(data.titulo && { titulo: data.titulo }),
        ...(slug && { slug }),
        ...(data.resumen && { resumen: data.resumen }),
        ...(data.contenido && { contenido: sanitizeHtml(data.contenido) }),
        ...(data.imagenDestacada !== undefined && { imagenDestacada: data.imagenDestacada || null }),
        ...(data.tipo && { tipo: data.tipo }),
        ...(data.fechaPublicacion && { fechaPublicacion: data.fechaPublicacion }),
        ...(data.publicado !== undefined && { publicado: data.publicado }),
      },
    });
  }

  // ─────────────────────────────────────
  // ELIMINAR artículo
  // ─────────────────────────────────────
  async delete(id: string, userId: string, userRol: Rol) {
    // 1. Verificar ownership
    await verifyArticleOwnership(userId, id, userRol);

    return await prisma.articulo.delete({
      where: { id },
    });
  }

  // ─────────────────────────────────────
  // OBTENER artículo por ID
  // ─────────────────────────────────────
  async getById(id: string) {
    return await prisma.articulo.findUnique({
      where: { id },
    });
  }
}
