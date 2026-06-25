import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Verificando usuarios en la base de datos...');
  
  const users = await prisma.user.findMany();
  console.log(`Total de usuarios: ${users.length}`);
  
  if (users.length === 0) {
    console.log('No hay usuarios. Creando usuario admin...');
    
    const password = '7c9Lr7,W2N.';
    const hash = await bcrypt.hash(password, 10);
    
    const admin = await prisma.user.create({
      data: {
        email: 'admin@ufro.cl',
        nombre: 'Administrador UFRO',
        passwordHash: hash,
        rol: 'ADMIN',
        verificado: true,
      },
    });
    
    console.log('Usuario admin creado:', admin.email);
  } else {
    console.log('Usuarios existentes:');
    users.forEach(user => {
      console.log(`- ${user.email} (${user.rol}) - passwordHash: ${user.passwordHash ? 'EXISTS' : 'NULL'}`);
    });
  }
  
  // Verificar si el admin existe y tiene password
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@ufro.cl' },
  });
  
  if (admin) {
    console.log('\nVerificando usuario admin:');
    console.log(`- Email: ${admin.email}`);
    console.log(`- Nombre: ${admin.nombre}`);
    console.log(`- Rol: ${admin.rol}`);
    console.log(`- PasswordHash: ${admin.passwordHash ? 'EXISTS' : 'NULL'}`);
    console.log(`- Verificado: ${admin.verificado}`);
    
    if (!admin.passwordHash) {
      console.log('\n⚠️ El usuario admin no tiene passwordHash. Asignando...');
      const password = '7c9Lr7,W2N.';
      const hash = await bcrypt.hash(password, 10);
      
      await prisma.user.update({
        where: { email: 'admin@ufro.cl' },
        data: { passwordHash: hash },
      });
      
      console.log('PasswordHash asignado correctamente');
    }
    
    if (!admin.verificado) {
      console.log('\n⚠️ El usuario admin no está verificado. Marcando como verificado...');
      await prisma.user.update({
        where: { email: 'admin@ufro.cl' },
        data: { verificado: true },
      });
      console.log('Usuario marcado como verificado');
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
