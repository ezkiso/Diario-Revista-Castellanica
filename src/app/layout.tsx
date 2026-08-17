// src/app/layout.tsx

import type { Metadata } from "next";
import { Lora, Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

import { Toaster } from "@/components/ui/toaster";
import { OrganizationJsonLd } from "@/components/seo/article-jsonld";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, NAV_LINKS } from "@/lib/constants";

const serif = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  preload: true,
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

const OG_IMAGE = `${SITE_URL}/images/og-image.png`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: "/images/favicon.ico",
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
  verification: {
    google: "8hG1PXfzuhfEu4J_mN8AktmJR42FMC8Rj5EqPG85UH0",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${serif.variable} ${sans.variable} m-0 p-0 border-0 outline-none`}>
      <body className="min-h-screen bg-white font-sans antialiased m-0 p-0 border-0 outline-none">

        <OrganizationJsonLd />

        {/* ── 1. Barra institucional ── */}
        <div style={{ backgroundColor: "#7B1E3A" }} className="text-white text-xs py-1.5 px-4 text-center tracking-wide">
          Estudiantes de Ped. en Castellano{" "}
          <span className="opacity-80">UFRO - Temuco</span>
        </div>

        {/* ── 2. Logo + título ── */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
            <Link href="/" aria-label={`${SITE_NAME} — Inicio`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/icon.png"
                alt="Logo Mal Sentados"
                width={100}
                height={100}
                className="rounded"
              />
            </Link>
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <p className="text-ufro-red font-serif font-bold text-sm tracking-widest uppercase leading-tight">
                Diario y Revista
              </p>
              <p className="text-ufro-ink font-serif text-xl font-semibold leading-tight">
                Mal Sentados
              </p>
            </Link>
          </div>
        </div>

        {/* ── 3. Navbar ── */}
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
          <nav aria-label="Navegación principal" className="max-w-6xl mx-auto px-4">
            <ul className="flex items-center gap-0 overflow-x-auto">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    prefetch={true}
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

        {/* ── 5. Footer ── */}
        <footer style={{ backgroundColor: "#7B1E3A" }} className="text-white mt-16">
          <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Identidad */}
            <div>
              <p className="font-serif text-base font-semibold mb-2">{SITE_NAME}</p>
              <p className="text-sm text-rose-100 leading-relaxed">{SITE_DESCRIPTION}</p>
            </div>

            {/* Institución */}
            <div>
              <p className="text-xs font-semibold text-rose-200 uppercase tracking-widest mb-3">
                Universidad de La Frontera
              </p>
              <address className="not-italic text-sm text-rose-100 leading-relaxed">
                Av. Francisco Salazar 01145
                <br />
                Temuco, Chile
              </address>
            </div>

            {/* Secciones */}
            <div>
              <p className="text-xs font-semibold text-rose-200 uppercase tracking-widest mb-3">
                Secciones
              </p>
              <ul className="space-y-2">
                {NAV_LINKS.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-rose-100 hover:text-white transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            

            {/* Redes Sociales — dentro del grid */}
            <div>
              <p className="text-xs font-semibold text-rose-200 uppercase tracking-widest mb-3">
                Redes Sociales
              </p>
              <div className="flex flex-col gap-3">

                
                <a  href="https://www.youtube.com/@Castellanocomunica777"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-rose-100 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/>
                  </svg>
                  YouTube
                </a>

                
                <a  href="https://www.instagram.com/castellanoufro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-rose-100 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8 0 3.2 0 3.6-.1 4.8-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1-3.2 0-3.6 0-4.8-.1-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12c0-3.2 0-3.6.1-4.8C2.4 3.9 4 2.3 7.2 2.3c1.2-.1 1.6-.1 4.8-.1zM12 0C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1.0 8.3 0 8.7 0 12c0 3.3 0 3.7.1 4.9.2 4.4 2.6 6.8 7 7C8.3 24 8.7 24 12 24c3.3 0 3.7 0 4.9-.1 4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9 0-3.3 0-3.7-.1-4.9C23.7 2.7 21.3.3 16.9.1 15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4A6.2 6.2 0 0 0 12 5.8zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.8a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z"/>
                  </svg>
                  Instagram
                </a>

              </div>
            </div>

          </div>
          {/* Copyright */}
          <div className="border-t border-white/10">
            <div className="max-w-6xl mx-auto px-4 py-4">
              <p className="text-xs text-rose-200">
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
