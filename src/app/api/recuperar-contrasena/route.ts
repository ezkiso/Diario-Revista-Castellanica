import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';
import { enviarEmailRecuperarContrasena } from '@/lib/email';

export async function POST(req: Request) {
    const { email } = await req.json();

    if (!email) {
        return NextResponse.json({ error: 'Email requerido' }, { status: 400 });
    }

    const usuario = await prisma.user.findUnique({ where: { email } });

    // Siempre responder OK aunque el email no exista (seguridad)
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

    try {
        await enviarEmailRecuperarContrasena({
            email,
            nombre: usuario.nombre,
            token,
        });
    } catch (error) {
        console.error('Error enviando email de recuperación:', error);
        // No fallar la petición si el email no se envía
        // En producción, podrías querer registrar este error
    }

    return NextResponse.json({ ok: true });
}