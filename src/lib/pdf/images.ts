export type PdfImage = { data: Buffer; format: "jpg" | "png" };

function sniff(buf: Buffer): "jpg" | "png" | "other" {
    if (buf[0] === 0xff && buf[1] === 0xd8) return "jpg";
    if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "png";
    return "other";
}

async function getSharp() {
    try {
        const mod = await import("sharp");
        return mod.default;
    } catch (error) {
        console.error("[pdf] sharp no está disponible, se usarán las imágenes sin convertir:", error);
        return null;
    }
}

export async function loadPdfImage(src: string, origin: string): Promise<PdfImage | null> {
    try {
        const res = await fetch(new URL(src, origin), { signal: AbortSignal.timeout(15000) });
        if (!res.ok) return null;
        const input = Buffer.from(await res.arrayBuffer());
        const kind = sniff(input);

        const sharp = await getSharp();
        if (!sharp) {
        return kind === "other" ? null : { data: input, format: kind };
        }

        const base = sharp(input).rotate().resize({ width: 2400, withoutEnlargement: true });
        if (kind === "png") {
        return { data: await base.png().toBuffer(), format: "png" };
        }
        return {
        data: await base.flatten({ background: "#ffffff" }).jpeg({ quality: 90 }).toBuffer(),
        format: "jpg",
        };
    } catch (error) {
        console.error("[pdf] no se pudo cargar la imagen:", src, error);
        return null;
    }
}