const BREVO_API_KEY = process.env.BREVO_API_KEY!;
const BASE_URL = process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000';

async function enviarEmail({
    to,
    nombre,
    subject,
    html,
    }: {
    to: string;
    nombre: string;
    subject: string;
    html: string;
}){const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        sender: { name: 'Diario Castellánica UFRO', email: 'affa65001@smtp-brevo.com' },
        to: [{ email: to, name: nombre }],
        subject,
        htmlContent: html,
        }),
});

    if (!res.ok) {
        const error = await res.json();
        throw new Error(JSON.stringify(error));
    }
    }

    export async function enviarEmailConfigurarCuenta({
    email,
    nombre,
    token,
    }: {
    email: string;
    nombre: string;
    token: string;
    }) {
    const link = `${BASE_URL}/configurar-cuenta?token=${token}`;

    await enviarEmail({
        to: email,
        nombre,
        subject: 'Configura tu cuenta — Diario Castellánica UFRO',
        html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 32px;">
            <h1 style="color: #1a1a1a; font-size: 24px;">Bienvenido/a, ${nombre}</h1>
            <p style="color: #444; font-size: 16px; line-height: 1.6;">
            El administrador del <strong>Diario Castellánica UFRO</strong> ha creado una cuenta para ti.
            </p>
            <a href="${link}"
            style="display: inline-block; background: #7c3aed; color: white;
                    padding: 12px 28px; border-radius: 6px; text-decoration: none;
                    font-size: 16px; margin: 16px 0;">
            Configurar mi cuenta
            </a>
            <p style="color: #888; font-size: 13px; margin-top: 32px;">
            Este link expira en 48 horas.
            </p>
        </div>
        `,
    });
    }

    export async function enviarEmailRecuperarContrasena({
    email,
    nombre,
    token,
    }: {
    email: string;
    nombre: string;
    token: string;
    }) {
    const link = `${BASE_URL}/nueva-contrasena?token=${token}`;

    await enviarEmail({
        to: email,
        nombre,
        subject: 'Recupera tu contraseña — Diario Castellánica UFRO',
        html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 32px;">
            <h1 style="color: #1a1a1a; font-size: 24px;">Hola, ${nombre}</h1>
            <p style="color: #444; font-size: 16px; line-height: 1.6;">
            Recibimos una solicitud para restablecer tu contraseña.
            </p>
            <a href="${link}"
            style="display: inline-block; background: #7c3aed; color: white;
                    padding: 12px 28px; border-radius: 6px; text-decoration: none;
                    font-size: 16px; margin: 16px 0;">
            Restablecer contraseña
            </a>
            <p style="color: #888; font-size: 13px; margin-top: 32px;">
            Este link expira en 1 hora. Si no solicitaste esto, ignora este correo.
            </p>
        </div>
        `,
    });
}