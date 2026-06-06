// next.config.ts — versión mejorada
// El wildcard "**" en remotePatterns es un riesgo de seguridad:
// cualquier dominio puede servir imágenes a través de tu app.
// Acota a los dominios que realmente usas.

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Vercel Blob (tus imágenes subidas)
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      // Unsplash (usado en el seed)
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Agrega aquí otros dominios que uses explícitamente
      // { protocol: "https", hostname: "ejemplo.com" },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;