// Script para migrar imágenes de public/uploads a Vercel Blob
import { PrismaClient } from "@prisma/client";
import { put } from "@vercel/blob";
import { readFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

async function migrateImages() {
  console.log("🚀 Iniciando migración de imágenes a Vercel Blob...");

  try {
    // Obtener todos los artículos con imagenDestacada
    const articulos = await prisma.articulo.findMany({
      where: {
        imagenDestacada: {
          not: null,
        },
      },
      select: {
        id: true,
        imagenDestacada: true,
      },
    });

    console.log(`📊 Encontrados ${articulos.length} artículos con imágenes`);

    for (const articulo of articulos) {
      const imageUrl = articulo.imagenDestacada!;
      
      // Verificar si es una imagen local (uploads/)
      if (imageUrl.startsWith("/uploads/")) {
        console.log(`📸 Migrando imagen para artículo ${articulo.id}: ${imageUrl}`);
        
        try {
          // Extraer nombre del archivo
          const filename = imageUrl.split("/").pop()!;
          
          // Leer archivo local
          const filePath = join(process.cwd(), "public", "uploads", filename);
          const buffer = readFileSync(filePath);
          
          // Subir a Vercel Blob
          const blob = await put(filename, buffer, {
            access: "public",
          });
          
          // Actualizar URL en base de datos
          await prisma.articulo.update({
            where: { id: articulo.id },
            data: { imagenDestacada: blob.url },
          });
          
          console.log(`✅ Migrado: ${filename} -> ${blob.url}`);
        } catch (error) {
          console.error(`❌ Error migrando ${imageUrl}:`, error);
        }
      } else {
        console.log(`⏭️  Ya está en Blob o URL externa: ${imageUrl}`);
      }
    }

    console.log("✨ Migración completada!");
  } catch (error) {
    console.error("❌ Error en migración:", error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateImages();
