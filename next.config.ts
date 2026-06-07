// next.config.ts — versión mejorada
// El wildcard "**" en remotePatterns es un riesgo de seguridad:
// cualquier dominio puede servir imágenes a través de tu app.
// Acota a los dominios que realmente usas.

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Deshabilitar optimización globalmente para evitar timeouts con Vercel Blob
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
  // Optimización de rendimiento
  compress: true, // Habilitar compresión gzip
  // Optimización de producción
  productionBrowserSourceMaps: false, // Deshabilitar source maps en producción para reducir bundle size
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on"
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload"
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN"
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff"
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block"
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin"
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()"
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: *.unsplash.com *.vercel-storage.com; font-src 'self'; connect-src 'self' https:; frame-src 'self';"
          }
        ]
      },
      // Headers de caché para assets estáticos
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable"
          }
        ]
      },
      // Headers de caché para imágenes
      {
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable"
          }
        ]
      }
    ]
  }
};

export default nextConfig;