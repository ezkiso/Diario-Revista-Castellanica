const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const Redis = require('ioredis');

const prisma = new PrismaClient();

// Generar contraseña segura
function generateSecurePassword() {
  const chars = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    special: '!@#$%^&*-_+=?'
  };
  
  const password = [
    chars.uppercase[Math.floor(Math.random() * chars.uppercase.length)],
    chars.lowercase[Math.floor(Math.random() * chars.lowercase.length)],
    chars.numbers[Math.floor(Math.random() * chars.numbers.length)],
    chars.special[Math.floor(Math.random() * chars.special.length)]
  ];
  
  const allChars = chars.uppercase + chars.lowercase + chars.numbers + chars.special;
  for (let i = password.length; i < 16; i++) {
    password.push(allChars[Math.floor(Math.random() * allChars.length)]);
  }
  
  return password.sort(() => Math.random() - 0.5).join('');
}

(async () => {
  try {
    const newPassword = generateSecurePassword();
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    console.log('🔄 Actualizando usuario admin...');
    
    const user = await prisma.user.findUnique({
      where: { email: 'admin@ufro.cl' }
    });

    if (!user) {
      console.log('❌ Usuario admin no existe. Creando...');
      const newUser = await prisma.user.create({
        data: {
          email: 'admin@ufro.cl',
          nombre: 'Administrador UFRO',
          passwordHash: hashedPassword,
          rol: 'ADMIN'
        }
      });
      console.log('✅ Usuario admin creado');
    } else {
      await prisma.user.update({
        where: { email: 'admin@ufro.cl' },
        data: { passwordHash: hashedPassword }
      });
      console.log('✅ Contraseña de admin actualizada');
    }

    console.log('📧 Email: admin@ufro.cl');
    console.log('🔐 Nueva contraseña: ' + newPassword);

    // Resetear contador de intentos en Redis si está configurado
    if (process.env.REDIS_URL) {
      try {
        console.log('\n🔄 Limpiando contador de intentos en Redis...');
        const redis = new Redis(process.env.REDIS_URL, {
          tls: process.env.REDIS_URL.startsWith('rediss://') ? {} : undefined,
          maxRetriesPerRequest: 3,
        });
        
        await redis.del('login:attempts:admin@ufro.cl');
        console.log('✅ Contador de intentos reseteado');
        
        await redis.disconnect();
      } catch (redisError) {
        console.warn('⚠️ No se pudo resetear Redis:', redisError.message);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
