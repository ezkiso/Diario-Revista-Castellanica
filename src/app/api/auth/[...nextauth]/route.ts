import { handlers } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = handlers.GET;

// Rate limiting en memoria por IP
const loginAttempts = new Map<string, { count: number; resetTime: number }>();
const MAX_INTENTOS = 5;
const VENTANA_MS = 15 * 60 * 1000; // 15 minutos

export async function POST(req: NextRequest) {
    const ip = req.headers.get('x-forwarded-for') 
        ?? req.headers.get('x-real-ip') 
        ?? 'unknown';

    const now = Date.now();
    const record = loginAttempts.get(ip);

    if (record && now < record.resetTime) {
        if (record.count >= MAX_INTENTOS) {
        return NextResponse.json(
            { error: 'Demasiados intentos fallidos. Espera 15 minutos.' },
            { status: 429 }
        );
        }
        record.count++;
    } else {
        loginAttempts.set(ip, { count: 1, resetTime: now + VENTANA_MS });
    }

    return handlers.POST(req);
}