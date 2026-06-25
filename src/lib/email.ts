import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASS,
    },
    });

    export async function enviarEmailConfigurarCuenta({
    email,
    nombre,
    token,
    }: {
    email: string;
    nombre: string;
    token: string;
    }) {
    const BASE_URL = process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000';
    const link = `${BASE_URL}/configurar-cuenta?token=${token}`;

    await transporter.sendMail({
        from: '"Diario Castellánica UFRO" <affa65001@smtp-brevo.com>',
        to: email,
        subject: 'Configura tu cuenta — Diario Castellánica UFRO',
        html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 32px;">
            <h1 style="color: #1a1a1a; font-size: 24px;">Bienvenido/a, ${nombre}</h1>
            <p style="color: #444; font-size: 16px; line-height: 1.6;">
            El administrador del <strong>Diario Castellánica UFRO</strong> 
            ha creado una cuenta para ti.
            </p>
            <p style="color: #444; font-size: 16px; line-height: 1.6;">
            Para activarla, haz click en el botón y crea tu contraseña:
            </p>
            <a href="${link}"
            style="display: inline-block; background: #7c3aed; color: white;
                    padding: 12px 28px; border-radius: 6px; text-decoration: none;
                    font-size: 16px; margin: 16px 0;">
            Configurar mi cuenta
            </a>
            <p style="color: #888; font-size: 13px; margin-top: 32px;">
            Este link expira en 48 horas. Si no esperabas este correo, ignóralo.
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
            <p style="color: #aaa; font-size: 12px;">
            Pedagogía en Castellano y Comunicación — Universidad de La Frontera
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
    const BASE_URL = process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000';
    const link = `${BASE_URL}/nueva-contrasena?token=${token}`;

    await transporter.sendMail({
        from: '"Diario Castellánica UFRO" <affa65001@smtp-brevo.com>',
        to: email,
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
            <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
            <p style="color: #aaa; font-size: 12px;">
            Pedagogía en Castellano y Comunicación — Universidad de La Frontera
            </p>
        </div>
        `,
});
}