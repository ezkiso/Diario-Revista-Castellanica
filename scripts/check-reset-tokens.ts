import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Verificando tokens de recuperación de contraseña...\n');
  
  const users = await prisma.user.findMany({
    where: {
      resetToken: { not: null },
    },
    select: {
      email: true,
      nombre: true,
      resetToken: true,
      resetTokenExpiry: true,
    },
  });

  if (users.length === 0) {
    console.log('No hay tokens de recuperación activos.');
  } else {
    console.log(`Usuarios con tokens de recuperación: ${users.length}\n`);
    
    const BASE_URL = 'http://localhost:3000';
    
    users.forEach(user => {
      const isExpired = user.resetTokenExpiry && new Date() > user.resetTokenExpiry;
      console.log(`Email: ${user.email}`);
      console.log(`Nombre: ${user.nombre}`);
      console.log(`Token: ${user.resetToken}`);
      console.log(`Expira: ${user.resetTokenExpiry?.toISOString()}`);
      console.log(`Estado: ${isExpired ? 'EXPIRADO' : 'VÁLIDO'}`);
      
      if (!isExpired && user.resetToken) {
        console.log(`Link de recuperación: ${BASE_URL}/nueva-contrasena?token=${user.resetToken}`);
      }
      console.log('---');
    });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
