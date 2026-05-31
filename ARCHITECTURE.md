# Arquitectura — Diario Castellano UFRO

## Visión general

Aplicación **monolito full-stack** con Next.js 15 App Router: renderizado en servidor (RSC) para el sitio público y panel admin, mutaciones vía **Server Actions**, persistencia en **PostgreSQL** mediante **Prisma**.

```
┌─────────────────────────────────────────────────────────────┐
│                     Cliente (navegador)                      │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│              Next.js 15 (Vercel — región gru1)                 │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐ │
│  │ Rutas públicas│  │ /admin panel │  │ API Auth.js       │ │
│  │ RSC + SEO     │  │ RSC + Forms  │  │ /api/auth/*       │ │
│  └──────┬────────┘  └──────┬───────┘  └──────────┬────────┘ │
│         │                  │                      │           │
│         └──────────────────┼──────────────────────┘           │
│                            │                                   │
│              Middleware (protección /admin)                    │
│              Server Actions (CRUD + Zod + DOMPurify)           │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│           Neon PostgreSQL (serverless, sin sleep)              │
└─────────────────────────────────────────────────────────────┘
```

## Estructura de carpetas

```
web/
├── prisma/
│   ├── schema.prisma      # Modelos User, Articulo, Revista, ContenidoRevista
│   └── seed.ts            # Usuario admin + datos demo
├── src/
│   ├── app/               # App Router
│   │   ├── page.tsx       # Home (hero + grid)
│   │   ├── noticias|opinion|cartas-al-director|difusion/
│   │   ├── articulo/[slug]/
│   │   ├── revista-castellanica/[anio]/
│   │   ├── admin/
│   │   │   ├── login/
│   │   │   └── (panel)/   # Dashboard, CRUD
│   │   └── api/auth/
│   ├── actions/           # Server Actions (articulos, revistas)
│   ├── auth.ts            # Auth.js v5
│   ├── middleware.ts
│   ├── components/
│   │   ├── ui/            # Shadcn/UI
│   │   ├── layout/
│   │   ├── articles/
│   │   ├── editor/        # TipTap
│   │   └── admin/
│   └── lib/               # Prisma, validaciones, queries, sanitize
├── vercel.json
└── .env.example
```

## Capas

| Capa | Responsabilidad |
|------|-----------------|
| **Presentación** | React Server Components, Tailwind, Shadcn |
| **Aplicación** | Server Actions, auth, roles |
| **Dominio** | Zod schemas, tipos Prisma, slugs |
| **Datos** | Prisma Client → PostgreSQL |

## Seguridad

- **Auth.js** con JWT (8 h), credenciales + bcrypt (12 rounds)
- **Middleware** en `/admin/*` (excepto login)
- **Roles** ADMIN | EDITOR (extensible en `requireAdmin`)
- **Zod** en todas las mutaciones
- **DOMPurify** al guardar HTML del editor
- **CSRF**: protección nativa de Server Actions en Next.js 15
- Panel con `robots: noindex`

## Base de datos elegida: Neon

Ver justificación completa en `README.md`.

## SEO

- `generateMetadata` en artículos y revistas
- JSON-LD (NewsArticle, PublicationIssue)
- Open Graph y canonical
