import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Rate limiting — máx 5 intentos por IP cada 15 minutos
const tokenAttempts = new Map<string, { count: number; resetTime: number }>();

export async function POST(req: Request) {
    const ip = (req.headers as Headers).get('x-forwarded-for') ?? 'unknown';
    const now = Date.now();
    const record = tokenAttempts.get(ip);

    if (record && now < record.resetTime) {
        if (record.count >= 5) {
        return NextResponse.json(
            { error: 'Demasiados intentos. Espera 15 minutos.' },
            { status: 429 }
        );
        }
        record.count++;
    } else {
        tokenAttempts.set(ip, { count: 1, resetTime: now + 15 * 60 * 1000 });
    }

    const { token, password } = await req.json();

    if (!token || !password || password.length < 8) {
        return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    const usuario = await prisma.user.findUnique({
        where: { verificationToken: token },
    });

    if (!usuario) {
        return NextResponse.json(
        { error: 'Link inválido o ya utilizado' },
        { status: 400 }
        );
    }

    if (!usuario.verificationTokenExpiry || usuario.verificationTokenExpiry < new Date()) {
        return NextResponse.json(
        { error: 'El link ha expirado. Pide al admin que reenvíe la invitación.' },
        { status: 400 }
        );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.update({
        where: { id: usuario.id },
        data: {
        passwordHash,
        verificado: true,
        verificationToken: null,
        verificationTokenExpiry: null,
        },
    });

    return NextResponse.json({ ok: true });
    }