import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createUserSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";
import Redis from "ioredis";
import type { Rol } from "@prisma/client";

// Redis client for rate limiting
const redis = process.env.REDIS_URL 
  ? new Redis(process.env.REDIS_URL, {
      tls: process.env.REDIS_URL.startsWith('rediss://') ? {} : undefined,
      maxRetriesPerRequest: 3,
    })
  : null;

// Fallback to in-memory if Redis is not configured
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5; // 5 user creations per hour
const RATE_LIMIT_WINDOW = 60 * 60; // 1 hour in seconds

async function checkRateLimit(userId: string): Promise<boolean> {
  if (redis) {
    try {
      const key = `ratelimit:create-user:${userId}`;
      const count = await redis.incr(key);
      
      if (count === 1) {
        await redis.expire(key, RATE_LIMIT_WINDOW);
      }
      
      return count <= RATE_LIMIT_MAX;
    } catch (error) {
      console.error("Redis error, falling back to in-memory:", error);
      // Fallback to in-memory on Redis error
    }
  }
  
  // In-memory fallback
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW * 1000 });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT_MAX) {
    return false;
  }

  userLimit.count++;
  return true;
}

// GET /api/admin/users - Listar usuarios (solo ADMIN)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    // Verificar que sea ADMIN
    if (session.user.rol !== "ADMIN") {
      return NextResponse.json(
        { error: "Solo administradores pueden ver usuarios" },
        { status: 403 }
      );
    }

    // Obtener usuarios (sin excluir el password hash)
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        nombre: true,
        rol: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return NextResponse.json(
      { error: "Error al obtener usuarios" },
      { status: 500 }
    );
  }
}

// POST /api/admin/users - Crear usuario (solo ADMIN)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    // Verificar que sea ADMIN
    if (session.user.rol !== "ADMIN") {
      return NextResponse.json(
        { error: "Solo administradores pueden crear usuarios" },
        { status: 403 }
      );
    }

    // Rate limiting
    if (!checkRateLimit(session.user.id)) {
      return NextResponse.json(
        { error: "Demasiadas creaciones de usuarios. Intenta más tarde." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validar datos con Zod
    const parsed = createUserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.errors },
        { status: 400 }
      );
    }

    const { email, password, nombre, rol } = parsed.data;

    // Verificar que el email no exista
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "El email ya está registrado" },
        { status: 409 }
      );
    }

    // Restricción: Solo permitir crear usuarios ADMIN si no existe ninguno
    // Esto mantiene un solo administrador por seguridad
    if (rol === "ADMIN") {
      const adminCount = await prisma.user.count({
        where: { rol: "ADMIN" },
      });

      if (adminCount > 0) {
        return NextResponse.json(
          { error: "Solo puede haber un administrador. Para crear otro administrador, contacte al soporte técnico." },
          { status: 403 }
        );
      }
    }

    // Hashear password con bcrypt (cost factor 12 para seguridad)
    const passwordHash = await bcrypt.hash(password, 12);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email,
        nombre,
        passwordHash,
        rol: rol as Rol,
      },
      select: {
        id: true,
        email: true,
        nombre: true,
        rol: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { 
        message: "Usuario creado exitosamente",
        user 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear usuario:", error);
    return NextResponse.json(
      { error: "Error al crear usuario" },
      { status: 500 }
    );
  }
}
