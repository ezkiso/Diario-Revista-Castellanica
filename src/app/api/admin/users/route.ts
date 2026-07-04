import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createUserSchema } from "@/lib/validations";
import type { Rol } from "@prisma/client";
import { enviarEmailConfigurarCuenta } from "@/lib/email";
import Redis from "ioredis";

// Redis client for rate limiting
const redis = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL, {
      tls: process.env.REDIS_URL.startsWith("rediss://") ? {} : undefined,
      maxRetriesPerRequest: 3,
    })
  : null;

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 60 * 60;

async function checkRateLimit(userId: string): Promise<boolean> {
  if (redis) {
    try {
      const key = `ratelimit:create-user:${userId}`;
      const count = await redis.incr(key);
      if (count === 1) await redis.expire(key, RATE_LIMIT_WINDOW);
      return count <= RATE_LIMIT_MAX;
    } catch (error) {
      console.error("Redis error, falling back to in-memory:", error);
    }
  }

  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW * 1000 });
    return true;
  }
  if (userLimit.count >= RATE_LIMIT_MAX) return false;
  userLimit.count++;
  return true;
}

// GET /api/admin/users
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    if (session.user.rol !== "ADMIN") {
      return NextResponse.json({ error: "Solo administradores pueden ver usuarios" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: { id: true, email: true, nombre: true, rol: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 });
  }
}

// POST /api/admin/users
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    if (session.user.rol !== "ADMIN") {
      return NextResponse.json({ error: "Solo administradores pueden crear usuarios" }, { status: 403 });
    }
    if (!await checkRateLimit(session.user.id)) {
      return NextResponse.json({ error: "Demasiadas creaciones de usuarios. Intenta más tarde." }, { status: 429 });
    }

    const body = await request.json();
    const parsed = createUserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos", details: parsed.error.errors }, { status: 400 });
    }

    const { email, nombre, rol } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "El email ya está registrado" }, { status: 409 });
    }

    const editorCount = await prisma.user.count({ where: { rol: "EDITOR" } });
    if (editorCount >= 3) {
      return NextResponse.json({ error: "Se alcanzó el límite máximo de 3 editores." }, { status: 403 });
    }

    if (rol === "ADMIN") {
      const adminCount = await prisma.user.count({ where: { rol: "ADMIN" } });
      if (adminCount > 0) {
        return NextResponse.json({ error: "Solo puede haber un administrador." }, { status: 403 });
      }
    }

    // Generar token de verificación
    const { randomBytes } = await import("crypto");
    const token  = randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48h

    // Crear usuario SIN contraseña
    const user = await prisma.user.create({
      data: {
        email,
        nombre,
        rol: rol as Rol,
        verificado: false,
        verificationToken: token,
        verificationTokenExpiry: expiry,
      },
      select: { id: true, email: true, nombre: true, rol: true, createdAt: true },
    });

    // Intentar enviar email (no falla si no hay dominio)
    try {
      await enviarEmailConfigurarCuenta({ email, nombre, token });
    } catch (error) {
      console.error("Email no enviado:", error);
    }

    return NextResponse.json(
      { message: "Usuario creado exitosamente", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear usuario:", error);
    return NextResponse.json({ error: "Error al crear usuario" }, { status: 500 });
  }
}