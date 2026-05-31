-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMIN', 'EDITOR');

-- CreateEnum
CREATE TYPE "TipoArticulo" AS ENUM ('NOTICIA', 'OPINION', 'CARTA_DIRECTOR', 'DIFUSION');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "rol" "Rol" NOT NULL DEFAULT 'EDITOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "articulos" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "resumen" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "imagenDestacada" TEXT,
    "tipo" "TipoArticulo" NOT NULL,
    "fechaPublicacion" TIMESTAMP(3) NOT NULL,
    "publicado" BOOLEAN NOT NULL DEFAULT false,
    "autorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "articulos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "revistas" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "anio" INTEGER NOT NULL,
    "descripcion" TEXT NOT NULL,
    "portada" TEXT,
    "publicada" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "revistas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contenidos_revista" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "imagen" TEXT,
    "revistaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contenidos_revista_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "articulos_slug_key" ON "articulos"("slug");

-- CreateIndex
CREATE INDEX "articulos_tipo_publicado_fechaPublicacion_idx" ON "articulos"("tipo", "publicado", "fechaPublicacion");

-- CreateIndex
CREATE INDEX "articulos_slug_idx" ON "articulos"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "revistas_anio_key" ON "revistas"("anio");

-- CreateIndex
CREATE INDEX "contenidos_revista_revistaId_idx" ON "contenidos_revista"("revistaId");

-- AddForeignKey
ALTER TABLE "articulos" ADD CONSTRAINT "articulos_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contenidos_revista" ADD CONSTRAINT "contenidos_revista_revistaId_fkey" FOREIGN KEY ("revistaId") REFERENCES "revistas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
