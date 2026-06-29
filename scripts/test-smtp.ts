import 'dotenv/config';
import nodemailer from 'nodemailer';

async function testSMTPConfig(port: number, secure: boolean, label: string) {
  console.log(`\n🔧 Probando configuración: ${label} (puerto ${port}, secure: ${secure})`);
  
  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port,
    secure,
    auth: {
      user: process.env.BREVO_SMTP_USER,
      pass: process.env.BREVO_SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false, // Desactivar verificación estricta SSL
    },
  });

  try {
    await transporter.verify();
    console.log(`✅ ${label}: Conexión exitosa`);
    
    const info = await transporter.sendMail({
      from: '"Test" <affa65001@smtp-brevo.com>',
      to: process.env.BREVO_SMTP_USER,
      subject: `Test SMTP - ${label}`,
      text: 'Este es un email de prueba',
    });
    
    console.log(`✅ ${label}: Email enviado:`, info.messageId);
    return true;
  } catch (error) {
    console.error(`❌ ${label}:`, (error as Error).message);
    return false;
  }
}

async function testSMTP() {
  console.log('Probando conexión SMTP con Brevo...');
  console.log('SMTP User:', process.env.BREVO_SMTP_USER);
  console.log('SMTP Pass:', process.env.BREVO_SMTP_PASS ? '***' : 'MISSING');
  
  if (!process.env.BREVO_SMTP_USER || !process.env.BREVO_SMTP_PASS) {
    console.error('❌ Faltan credenciales SMTP en .env');
    return;
  }
  
  // Probar diferentes configuraciones
  await testSMTPConfig(587, false, 'STARTTLS (puerto 587)');
  await testSMTPConfig(465, true, 'SSL/TLS (puerto 465)');
  await testSMTPConfig(25, false, 'Sin encriptación (puerto 25)');
}

testSMTP();
