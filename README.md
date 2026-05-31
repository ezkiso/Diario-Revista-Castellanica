# Diario Castellano UFRO

Portal digital de la **Carrera de Pedagogía en Castellano y Comunicación** — Universidad de La Frontera (Temuco, Chile).

Stack: **Next.js 15**, **TypeScript**, **Tailwind CSS**, **Shadcn/UI**, **Prisma**, **PostgreSQL**, **Auth.js**, **TipTap**, **Zod**, despliegue en **Vercel**.

Documentación de arquitectura: [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## Elección de base de datos: Neon PostgreSQL

| Criterio | Neon | Railway | Turso | Aiven | CockroachDB |
|----------|------|---------|-------|-------|-------------|
| Sin sleep (free) | ✅ | ⚠️ límites | ✅ (edge) | ❌ trial | ⚠️ |
| Prisma nativo | ✅ PostgreSQL | ✅ | ⚠️ SQLite/libSQL | ✅ | ✅ |
| Vercel | ✅ integración oficial | ✅ | ✅ | Manual | Manual |
| Mantenimiento | Muy bajo | Medio | Medio (modelo distinto) | Alto | Alto |
| Costo futuro | Escalable, pooler | Créditos | Por uso | Enterprise | Complejo |

**Decisión: [Neon](https://neon.tech)** — PostgreSQL serverless sin modo sleep en el tier gratuito actual, connection pooling para serverless (Vercel), driver 100% compatible con Prisma y documentación oficial de Vercel + Neon.

No se usa Supabase según requerimiento.

---

## Requisitos

- Node.js 20+
- Cuenta [Neon](https://neon.tech) (PostgreSQL)
- Cuenta [Vercel](https://vercel.com) (opcional, despliegue)

---

## Instalación local

### 1. Clonar e instalar dependencias

```bash
cd web
npm install
```

### 2. Variables de entorno

```bash
cp .env.example .env
```

Editar `.env`:

```env
DATABASE_URL="postgresql://...@ep-xxx.aws.neon.tech/neondb?sslmode=require"
AUTH_SECRET="generar-con-openssl-rand-base64-32"
AUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@ufro.cl"
ADMIN_PASSWORD="TuClaveSegura123!"
ADMIN_NAME="Administrador UFRO"
```

Generar `AUTH_SECRET`:

```bash
openssl rand -base64 32
```

### 3. Base de datos

```bash
npx prisma db push
npm run db:seed
```

### 4. Desarrollo

```bash
npm run dev
```

- Sitio público: http://localhost:3000  
- Panel admin: http://localhost:3000/admin  
- Login: credenciales del seed (`ADMIN_EMAIL` / `ADMIN_PASSWORD`)

---

## Despliegue en Vercel

1. Importar repositorio en Vercel.
2. Variables de entorno en el proyecto:
   - `DATABASE_URL` (Neon, usar **pooled** connection string para serverless)
   - `AUTH_SECRET`
   - `AUTH_URL` = `https://tu-dominio.vercel.app`
3. Región recomendada: **São Paulo (gru1)** — configurada en `vercel.json`.
4. Tras el primer deploy, ejecutar migración/seed desde máquina local apuntando a la BD de producción, o usar `prisma db push` en CI.

```bash
DATABASE_URL="..." npx prisma db push
DATABASE_URL="..." npm run db:seed
```

---

## Rutas principales

| Ruta | Descripción |
|------|-------------|
| `/` | Home con noticia principal + grid |
| `/noticias` | Categoría noticias |
| `/opinion` | Columnas de opinión |
| `/cartas-al-director` | Cartas |
| `/difusion` | Difusión |
| `/articulo/[slug]` | Artículo completo + SEO |
| `/revista-castellanica` | Archivo de ediciones |
| `/revista-castellanica/[anio]` | Edición anual |
| `/admin` | Dashboard (autenticado) |
| `/admin/login` | Inicio de sesión |

---

## Roles

- **ADMIN**: acceso completo al panel (futuras restricciones vía `requireAdmin`).
- **EDITOR**: gestión de artículos y revistas.

---

## Editor de contenido

[TipTap](https://tiptap.dev) — gratuito, mantenido, extensible. Soporta encabezados, listas, negrita, cursiva, enlaces, imágenes y citas. El HTML se sanitiza con **DOMPurify** al guardar.

---

## Scripts

| Comando | Uso |
|---------|-----|
| `npm run dev` | Desarrollo |
| `npm run build` | Build producción |
| `npm run db:push` | Sincronizar schema |
| `npm run db:seed` | Datos iniciales |
| `npm run db:studio` | Prisma Studio |

---

## Licencia

Proyecto académico — Universidad de La Frontera.
