import { renderToBuffer } from "@react-pdf/renderer";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import slugify from "slugify";
import type { ContenidoRevista } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { htmlToBlocks, type Block } from "@/lib/pdf/html-to-blocks";
import { loadPdfImage, type PdfImage } from "@/lib/pdf/images";
import { RevistaPdf, registerFonts } from "@/lib/pdf/revista-pdf";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

const noStoreHeaders = { "Cache-Control": "no-store" };

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "No autorizado" }, { status: 401, headers: noStoreHeaders });
  }

  const { id } = await params;
  const url = new URL(req.url);

  const revista = await prisma.revista.findUnique({
    where: { id },
    include: { contenidos: { orderBy: { createdAt: "asc" } } },
  });
  if (!revista) {
    return Response.json({ error: "No encontrada" }, { status: 404, headers: noStoreHeaders });
  }

  const origin = url.origin;
  registerFonts(origin);

  const contenidos = revista.contenidos.map((c: ContenidoRevista) => ({
    id: c.id,
    titulo: c.titulo,
    autor: c.autor,
    imagenSrc: c.imagen,
    blocks: htmlToBlocks(c.contenido),
  }));

  // Reúne todas las imágenes y las carga en paralelo
  const srcs = new Set<string>();
  if (revista.portada) srcs.add(revista.portada);
  for (const c of contenidos) {
    if (c.imagenSrc) srcs.add(c.imagenSrc);
    c.blocks.forEach((b: Block) => {
      if (b.type === "img") srcs.add(b.src);
    });
  }

  const images = new Map<string, PdfImage>();
  await Promise.all(
    [...srcs].map(async (src) => {
      const img = await loadPdfImage(src, origin);
      if (img) {
        images.set(src, img);
      }
    })
  );

  const data = {
    nombre: revista.nombre,
    anio: revista.anio,
    descripcion: revista.descripcion,
    portada: revista.portada ? images.get(revista.portada) ?? null : null,
    contenidos: contenidos.map((c) => ({
      id: c.id,
      titulo: c.titulo,
      autor: c.autor,
      imagen: c.imagenSrc ? images.get(c.imagenSrc) ?? null : null,
      blocks: c.blocks,
    })),
  };

  const pageNumbers = new Map<string, number>();
  await renderToBuffer(<RevistaPdf images={images} data={data} pageNumbers={pageNumbers} />);
  const renderedPdf = await renderToBuffer(
    <RevistaPdf images={images} data={data} pageNumbers={pageNumbers} />
  );
  const pdf = await PDFDocument.load(renderedPdf);
  const pageNumberFont = await pdf.embedFont(StandardFonts.Helvetica);
  const pages = pdf.getPages();
  pages.forEach((page, index) => {
    const label = String(index + 1);
    const fontSize = 9;
    const textWidth = pageNumberFont.widthOfTextAtSize(label, fontSize);
    page.drawText(label, {
      x: (page.getWidth() - textWidth) / 2,
      y: 20,
      size: fontSize,
      font: pageNumberFont,
      color: rgb(0.47, 0.47, 0.47),
    });
  });
  const buffer = await pdf.save();

  const filename = `${slugify(revista.nombre, { lower: true, strict: true }) || "revista"}-${revista.anio}.pdf`;
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      ...noStoreHeaders,
    },
  });
}