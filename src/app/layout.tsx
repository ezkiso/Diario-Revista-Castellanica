// src/app/layout.tsx

import type { Metadata } from "next";
import { Lora, Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

import { Toaster } from "@/components/ui/toaster";
import { OrganizationJsonLd } from "@/components/seo/article-jsonld";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, NAV_LINKS } from "@/lib/constants";

// ─── Fuentes ──────────────────────────────────────────────────────────────────

const serif = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// ─── Metadata global ──────────────────────────────────────────────────────────

const OG_IMAGE = `${SITE_URL}/og-image.png`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons:{
    icon: "/images/logo.ico",
  },
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: SITE_URL,
    languages: { "es-CL": SITE_URL },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    locale: "es_CL",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    site: "@DiarioCastellananicoUFRO",
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

// ─── RootLayout ───────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${serif.variable} ${sans.variable}`}>
      <body className="min-h-screen bg-ufro-gray font-sans antialiased">

        {/* JSON-LD — invisible, solo para Google */}
        <OrganizationJsonLd />

        {/* ── 1. Barra institucional (bg-ufro-blue) ── */}
        <div className="bg-ufro-blue text-white text-xs py-1.5 px-4 text-center tracking-wide">
          Universidad de La Frontera — Temuco, Chile ·{" "}
          <span className="opacity-80">Pedagogía en Castellano y Comunicación</span>
        </div>

        {/* ── 2. Sección logo + título (separada del navbar) ── */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
            {/* Logo UFRO */}
            <Link href="/" aria-label={`${SITE_NAME} — Inicio`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo.png"
                alt="Logo Universidad de La Frontera"
                width={56}
                height={56}
                className="rounded"
              />
            </Link>

            {/* Títulos */}
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <p className="text-ufro-red font-serif font-bold text-sm tracking-widest uppercase leading-tight">
                Universidad de La Frontera
              </p>
              <p className="text-ufro-ink font-serif text-xl font-semibold leading-tight">
                Diario Castellananico UFRO
              </p>
            </Link>
          </div>
        </div>

        {/* ── 3. Navbar (sticky, separado del logo) ── */}
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
          <nav
            aria-label="Navegación principal"
            className="max-w-6xl mx-auto px-4"
          >
            <ul className="flex items-center gap-0 overflow-x-auto">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="block text-xs text-gray-600 hover:text-ufro-red px-3 py-3.5
                               hover:bg-gray-50 transition-colors font-medium whitespace-nowrap
                               border-b-2 border-transparent hover:border-ufro-red"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        {/* ── 4. Contenido ── */}
        <main id="main-content" className="max-w-6xl mx-auto px-4 py-8">
          {children}
        </main>

        {/* ── 5. Footer (mismo bg-ufro-blue que la barra de arriba) ── */}
        <footer className="bg-ufro-blue text-white mt-16">
          <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Identidad */}
            <div>
              <p className="font-serif text-base font-semibold mb-2">{SITE_NAME}</p>
              <p className="text-sm text-blue-200 leading-relaxed">{SITE_DESCRIPTION}</p>
            </div>

            {/* Secciones */}
            <div>
              <p className="text-xs font-semibold text-blue-300 uppercase tracking-widest mb-3">
                Secciones
              </p>
              <ul className="space-y-2">
                {NAV_LINKS.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-blue-200 hover:text-white transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Institución */}
            <div>
              <p className="text-xs font-semibold text-blue-300 uppercase tracking-widest mb-3">
                Universidad de La Frontera
              </p>
              <address className="not-italic text-sm text-blue-200 leading-relaxed">
                Av. Francisco Salazar 01145
                <br />
                Temuco, Chile
              </address>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-white/10">
            <div className="max-w-6xl mx-auto px-4 py-4">
              <p className="text-xs text-blue-300">
                © {new Date().getFullYear()} {SITE_NAME}. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </footer>

        <Toaster />

      </body>
    </html>
  );
}