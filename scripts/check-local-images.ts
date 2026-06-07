// Script para verificar artículos con imágenes locales
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkLocalImages() {
  console.log("🔍 Verificando artículos con imágenes locales...");

  try {
    const articulos = await prisma.articulo.findMany({
      where: {
        imagenDestacada: {
          not: null,
        },
      },
      select: {
        id: true,
        titulo: true,
        imagenDestacada: true,
      },
    });

    const localImages = articulos.filter(a => 
      a.imagenDestacada?.startsWith("/uploads/")
    );

    if (localImages.length === 0) {
      console.log("✅ No hay artículos con imágenes locales (/uploads/)");
    } else {
      console.log(`⚠️  Encontrados ${localImages.length} artículos con imágenes locales:`);
      localImages.forEach(a => {
        console.log(`   - ${a.titulo}: ${a.imagenDestacada}`);
      });
    }

    console.log("\n📊 Resumen:");
    console.log(`   Total artículos con imágenes: ${articulos.length}`);
    console.log(`   Imágenes locales (/uploads/): ${localImages.length}`);
    console.log(`   Imágenes en Blob/externas: ${articulos.length - localImages.length}`);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkLocalImages();
