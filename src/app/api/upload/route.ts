import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { auth } from "@/auth";
import Redis from "ioredis";

// Redis client for rate limiting
const redis = process.env.REDIS_URL 
  ? new Redis(process.env.REDIS_URL, {
      tls: process.env.REDIS_URL.startsWith('rediss://') ? {} : undefined,
      maxRetriesPerRequest: 3,
    })
  : null;

// Fallback to in-memory if Redis is not configured
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW = 60; // 60 seconds

async function checkRateLimit(userId: string): Promise<boolean> {
  if (redis) {
    try {
      const key = `ratelimit:upload:${userId}`;
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

// Allowed MIME types for images
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    // Rate limiting
    if (!checkRateLimit(session.user.id)) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Intenta más tarde." },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No se proporcionó archivo" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de archivo no permitido. Solo JPEG, PNG, WebP y GIF." },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "La imagen no debe superar 5MB" },
        { status: 400 }
      );
    }

    // Validate file name (prevent path traversal)
    if (file.name.includes("..") || file.name.includes("/") || file.name.includes("\\")) {
      return NextResponse.json(
        { error: "Nombre de archivo inválido" },
        { status: 400 }
      );
    }

    // Convertir archivo a buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Generar nombre seguro y único
    const ext = file.type.split("/")[1];
    const filename = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
    
    // Subir a Vercel Blob
    const blob = await put(filename, buffer, {
      access: 'public',
    });

    // Retornar URL
    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("Error al subir imagen:", error);
    return NextResponse.json(
      { error: "Error al subir la imagen" },
      { status: 500 }
    );
  }
}
