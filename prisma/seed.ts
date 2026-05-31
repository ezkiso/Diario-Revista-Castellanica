import { PrismaClient, Rol, TipoArticulo } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@ufro.cl";
  const password = process.env.ADMIN_PASSWORD ?? "AdminUFRO2026!";
  const nombre = process.env.ADMIN_NAME ?? "Administrador UFRO";

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      nombre,
      passwordHash,
      rol: Rol.ADMIN,
    },
  });

  const editor = await prisma.user.upsert({
    where: { email: "editor@ufro.cl" },
    update: {},
    create: {
      email: "editor@ufro.cl",
      nombre: "Editor Pedagogía Castellano",
      passwordHash: await bcrypt.hash("EditorUFRO2026!", 12),
      rol: Rol.EDITOR,
    },
  });

  const sampleArticles = [
    {
      titulo: "Carrera de Pedagogía en Castellano celebra nueva cohorte",
      slug: "pedagogia-castellano-nueva-cohorte",
      resumen:
        "La Carrera de Pedagogía en Castellano y Comunicación de la UFRO da la bienvenida a estudiantes de la generación 2026.",
      contenido:
        "<p>Con una ceremonia en el campus de Temuco, la carrera inauguró el año académico destacando el compromiso con la formación docente en lengua castellana.</p><p>Autoridades universitarias subrayaron la importancia de la comunicación educativa en el contexto regional.</p>",
      tipo: TipoArticulo.NOTICIA,
      imagenDestacada:
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80",
    },
    {
      titulo: "La enseñanza de la literatura en tiempos digitales",
      slug: "ensenanza-literatura-tiempos-digitales",
      resumen:
        "Reflexión sobre cómo integrar herramientas digitales sin perder la profundidad del análisis literario.",
      contenido:
        "<p>Las aulas ya no son el único espacio de lectura. Los futuros docentes deben articular crítica textual y competencias mediáticas.</p><blockquote><p>Leer sigue siendo un acto político y formativo.</p></blockquote>",
      tipo: TipoArticulo.OPINION,
      imagenDestacada:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=80",
    },
    {
      titulo: "Carta: Por una prensa universitaria independiente",
      slug: "carta-prensa-universitaria-independiente",
      resumen: "Un lector solicita fortalecer los espacios de opinión estudiantil.",
      contenido:
        "<p>Estimado director: Creo indispensable que el Diario Castellano UFRO mantenga su línea editorial abierta y rigurosa.</p>",
      tipo: TipoArticulo.CARTA_DIRECTOR,
      imagenDestacada: null,
    },
    {
      titulo: "Seminario de comunicación educativa — convocatoria abierta",
      slug: "seminario-comunicacion-educativa",
      resumen: "Actividad de difusión dirigida a la comunidad universitaria.",
      contenido:
        "<p>El seminario se realizará en modalidad híbrida. Inscripciones en secretaría de la carrera.</p>",
      tipo: TipoArticulo.DIFUSION,
      imagenDestacada:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80",
    },
  ];

  for (const [i, article] of sampleArticles.entries()) {
    await prisma.articulo.upsert({
      where: { slug: article.slug },
      update: {},
      create: {
        ...article,
        publicado: true,
        fechaPublicacion: new Date(Date.now() - i * 86400000),
        autorId: i % 2 === 0 ? admin.id : editor.id,
      },
    });
  }

  const revista2026 = await prisma.revista.upsert({
    where: { anio: 2026 },
    update: {},
    create: {
      nombre: "Revista Castellánica 2026",
      anio: 2026,
      descripcion:
        "Primera edición digital de la revista literaria anual de la Carrera de Pedagogía en Castellano y Comunicación.",
      portada:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
      publicada: true,
    },
  });

  await prisma.contenidoRevista.deleteMany({ where: { revistaId: revista2026.id } });

  await prisma.contenidoRevista.createMany({
    data: [
      {
        revistaId: revista2026.id,
        titulo: "Temuco al atardecer",
        autor: "María González",
        contenido:
          "<p>La lluvia fina dibuja calles que el poema no termina de nombrar.</p>",
        imagen: null,
      },
      {
        revistaId: revista2026.id,
        titulo: "Carta a quien enseña",
        autor: "Diego Morales",
        contenido:
          "<p>No fue el aula la que me enseñó a leer, sino la voz de quien creyó que podía.</p>",
      },
    ],
  });

  console.log("Seed completado:", { admin: admin.email, editor: editor.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
