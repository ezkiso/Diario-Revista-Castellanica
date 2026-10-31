import {
  Document,
  Page,
  Text,
  View,
  Image as PdfImageElement,
  Link,
  Font,
  StyleSheet,
} from "@react-pdf/renderer";
import type { Block, Inline } from "./html-to-blocks";
import type { PdfImage } from "./images";

const PAGE = "A5";
const MARGIN = 42; // ~15 mm
const FONT = "Lora";

const registeredOrigins = new Set<string>();
export function registerFonts(origin: string) {
  if (registeredOrigins.has(origin)) return;
  Font.register({
    family: FONT,
    fonts: [
      { src: `${origin}/fonts/Lora-Regular.ttf` },
      { src: `${origin}/fonts/Lora-Bold.ttf`, fontWeight: "bold" },
      { src: `${origin}/fonts/Lora-Italic.ttf`, fontStyle: "italic" },
      { src: `${origin}/fonts/Lora-BoldItalic.ttf`, fontWeight: "bold", fontStyle: "italic" },
    ],
  });
  Font.registerHyphenationCallback((word) => [word]); // sin cortes de palabra raros
  registeredOrigins.add(origin);
}

const s = StyleSheet.create({
  page: {
    fontFamily: FONT,
    padding: MARGIN,
    paddingBottom: MARGIN + 10,
    fontSize: 10.5,
    lineHeight: 1.5,
  },
  // Portada
  coverTitle: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 12 },
  coverEdition: { fontSize: 13, textAlign: "center", marginBottom: 18, color: "#555555" },
  coverImg: { width: "100%", height: 340, objectFit: "contain" },
  // Presentación
  introTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 12 },
  // Contenidos
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 4, lineHeight: 1.25 },
  author: { fontSize: 11, fontStyle: "italic", color: "#555555", marginBottom: 14 },
  featuredImg: { width: "100%", height: 200, objectFit: "contain", marginBottom: 14 },
  p: { textAlign: "justify", marginBottom: 8 },
  h1: { fontSize: 18, fontWeight: "bold", marginTop: 10, marginBottom: 6 },
  h2: { fontSize: 15, fontWeight: "bold", marginTop: 10, marginBottom: 6 },
  h3: { fontSize: 13, fontWeight: "bold", marginTop: 8, marginBottom: 4 },
  h4: { fontSize: 11, fontWeight: "bold", marginTop: 8, marginBottom: 4 },
  quote: {
    fontStyle: "italic",
    marginLeft: 16,
    marginBottom: 8,
    paddingLeft: 8,
    borderLeftWidth: 1.5,
    borderLeftColor: "#999999",
  },
  li: { flexDirection: "row", marginBottom: 3, paddingLeft: 8 },
  marker: { width: 16 },
  liText: { flex: 1 },
  hr: { borderBottomWidth: 0.5, borderBottomColor: "#999999", marginVertical: 10 },
  bodyImg: { width: "100%", height: 220, objectFit: "contain", marginVertical: 8 },
  pageNumber: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 9,
    color: "#777777",
  },
});

function Inlines({ inlines }: { inlines: Inline[] }) {
  return (
    <>
      {inlines.map((i, k) => {
        if ("br" in i) return <Text key={k}>{"\n"}</Text>;
        const style = {
          fontWeight: i.bold ? ("bold" as const) : ("normal" as const),
          fontStyle: i.italic ? ("italic" as const) : ("normal" as const),
          textDecoration: i.underline ? ("underline" as const) : ("none" as const),
        };
        if (i.href) {
          return (
            <Link key={k} src={i.href} style={style}>
              {i.text}
            </Link>
          );
        }
        return (
          <Text key={k} style={style}>
            {i.text}
          </Text>
        );
      })}
    </>
  );
}

function Blocks({ blocks, images }: { blocks: Block[]; images: Map<string, PdfImage> }) {
  return (
    <>
      {blocks.map((b, k) => {
        switch (b.type) {
          case "hr":
            return <View key={k} style={s.hr} />;
          case "img": {
            const img = images.get(b.src);
            return img ? <PdfImageElement key={k} src={img} style={s.bodyImg} /> : null;
          }
          case "li":
            return (
              <View key={k} style={s.li} wrap={false}>
                <Text style={s.marker}>{b.marker}</Text>
                <Text style={s.liText}>
                  <Inlines inlines={b.inlines} />
                </Text>
              </View>
            );
          case "quote":
            return (
              <Text key={k} style={s.quote}>
                <Inlines inlines={b.inlines} />
              </Text>
            );
          case "p":
            return (
              <Text key={k} style={s.p}>
                <Inlines inlines={b.inlines} />
              </Text>
            );
          default:
            return (
              <Text key={k} style={s[b.type]}>
                <Inlines inlines={b.inlines} />
              </Text>
            );
        }
      })}
    </>
  );
}

export type RevistaPdfData = {
  nombre: string;
  anio: number;
  descripcion: string;
  portada: PdfImage | null;
  contenidos: {
    id: string;
    titulo: string;
    autor: string;
    imagen: PdfImage | null;
    blocks: Block[];
  }[];
};

export function RevistaPdf({
  data,
  images,
}: {
  data: RevistaPdfData;
  images: Map<string, PdfImage>;
}) {
  return (
    <Document title={data.nombre} author="Revista Castellanica" creator="Revista Castellanica">
      {/* 1. Título + portada */}
      <Page size={PAGE} style={s.page}>
        <Text style={s.coverTitle}>{data.nombre}</Text>
        <Text style={s.coverEdition}>Edición {data.anio}</Text>
        {data.portada && <PdfImageElement src={data.portada} style={s.coverImg} />}
      </Page>

      {/* 2. Presentación */}
      {data.descripcion.trim() && (
        <Page size={PAGE} style={s.page}>
          <Text style={s.introTitle}>Presentación</Text>
          <Text style={s.p}>{data.descripcion}</Text>
        </Page>
      )}

      {/* 3. Contenidos: cada uno en página nueva */}
      {data.contenidos.map((c) => (
        <Page key={c.id} size={PAGE} style={s.page} wrap>
          <Text style={s.title}>{c.titulo}</Text>
          <Text style={s.author}>por {c.autor}</Text>
          {c.imagen && <PdfImageElement src={c.imagen} style={s.featuredImg} />}
          <Blocks blocks={c.blocks} images={images} />
          <Text style={s.pageNumber} render={({ pageNumber }) => `${pageNumber}`} />
        </Page>
      ))}
    </Document>
  );
}