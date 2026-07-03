import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';
import { enviarEmailRecuperarContrasena } from '@/lib/email';

// Rate limiting por IP — máx 3 solicitudes cada 30 minutos
const resetAttempts = new Map<string, { count: number; resetTime: number }>();
const MAX_INTENTOS = 3;
const VENTANA_MS = 30 * 60 * 1000;

export async function POST(req: Request) {
    const ip = (req.headers as Headers).get('x-forwarded-for') ?? 'unknown';
    const now = Date.now();
    const record = resetAttempts.get(ip);

    if (record && now < record.resetTime) {
        if (record.count >= MAX_INTENTOS) {
        return NextResponse.json({ ok: true });
        }
        record.count++;
    } else {
        resetAttempts.set(ip, { count: 1, resetTime: now + VENTANA_MS });
    }

    const { email } = await req.json();

    if (!email) {
        return NextResponse.json({ error: 'Email requerido' }, { status: 400 });
    }

    const usuario = await prisma.user.findUnique({ where: { email } });

    if (!usuario) {
        return NextResponse.json({ ok: true });
    }

    const token  = randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    await prisma.user.update({
        where: { email },
        data: {
        resetToken: token,
        resetTokenExpiry: expiry,
        },
    });

    // En desarrollo mostrar link directo
    if (process.env.NODE_ENV === 'development') {
        const link = `${process.env.NEXT_PUBLIC_URL}/nueva-contrasena?token=${token}`;
        return NextResponse.json({ ok: true, devLink: link });
    }

    try {
        await enviarEmailRecuperarContrasena({
        email,
        nombre: usuario.nombre,
        token,
        });
    } catch (error) {
        console.error('Error enviando email de recuperación:', error);
    }

    return NextResponse.json({ ok: true });
    }