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

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` con estas variables:

```env
DATABASE_URL="postgresql://usuario:password@host:puerto/database?sslmode=require"
DIRECT_URL="postgresql://usuario:password@host:puerto/database?sslmode=require"
AUTH_SECRET="tu-secret-aqui-generado-con-openssl"
AUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@ufro.cl"
ADMIN_PASSWORD="TuClaveSegura123!"
ADMIN_NAME="Administrador UFRO"
BLOB_READ_WRITE_TOKEN="token-de-vercel-blob"
```

**Para generar AUTH_SECRET** (obligatorio para seguridad):
```bash
openssl rand -base64 32
```

### 3. Configurar base de datos

```bash
npx prisma db push
npm run db:seed
```

### 4. Iniciar desarrollo

```bash
npm run dev
```

Abre en tu navegador:
- Sitio público: http://localhost:3000
- Panel admin: http://localhost:3000/admin
- Login: usa el email y password que configuraste en `.env`

---

## Despliegue en Vercel

### Paso 1: Conectar repositorio a Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Clic en "Add New" → "Project"
3. Importa tu repositorio de GitHub
4. Vercel detectará automáticamente que es un proyecto Next.js

### Paso 2: Configurar variables de entorno

En la configuración del proyecto en Vercel, agrega estas variables:

**Variables obligatorias:**
- `DATABASE_URL` - Tu URL de Neon PostgreSQL (usa la **pooled** connection string)
- `DIRECT_URL` - Tu URL de Neon PostgreSQL (connection string directo)
- `AUTH_SECRET` - Genera con: `openssl rand -base64 32`
- `AUTH_URL` - Tu dominio de Vercel: `https://tu-proyecto.vercel.app`
- `ADMIN_EMAIL` - Email del administrador
- `ADMIN_PASSWORD` - Contraseña del administrador
- `ADMIN_NAME` - Nombre del administrador
- `BLOB_READ_WRITE_TOKEN` - Token de Vercel Blob (si usas almacenamiento de imágenes)

**Variables opcionales para Redis (recomendado para producción):**
- `REDIS_URL` - URL de tu instancia de Redis (ej: Upstash, Redis Cloud, etc.)

### Paso 3: Configurar región

En `vercel.json` ya está configurada la región **São Paulo (gru1)** para mejor latencia en Chile.

### Paso 4: Ejecutar migración y seed en producción

Después del primer deploy, desde tu terminal local:

```bash
# Apunta a la base de datos de producción
DATABASE_URL="tu-url-produccion" DIRECT_URL="tu-url-produccion" npx prisma db push

# Inserta datos iniciales
DATABASE_URL="tu-url-produccion" DIRECT_URL="tu-url-produccion" npm run db:seed
```

### Paso 5: Verificar despliegue

1. Vercel te dará una URL como `https://tu-proyecto.vercel.app`
2. Visita `/admin` para verificar que funciona el login
3. Prueba crear un artículo para verificar que todo funciona

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

## Seguridad

### Implementaciones actuales

- **Headers de seguridad**: HSTS, X-Frame-Options, CSP, etc. (configurados en `next.config.ts`)
- **Rate limiting**: Límite de 10 uploads/minuto por usuario (Redis si está configurado, fallback a memoria)
- **Login attempt monitoring**: Bloqueo tras 5 intentos fallidos en 15 minutos (Redis si está configurado, fallback a memoria)
- **Validación de archivos**: Solo imágenes JPEG, PNG, WebP, GIF (máx 5MB)
- **Sanitización HTML**: sanitize-html en contenido
- **Autenticación**: bcrypt para passwords, JWT con 8h de expiración
- **trustHost**: Desactivado para prevenir spoofing

### Configurar Redis en producción (opcional pero recomendado)

Para mejor rendimiento y persistencia en producción, configura Redis:

1. **Crear cuenta en Upstash** (Redis gratuito para Vercel):
   - Ve a [upstash.com](https://upstash.com)
   - Crea una base de datos Redis
   - Copia la `REDIS_URL`

2. **Agregar variable en Vercel**:
   - En tu proyecto de Vercel, agrega `REDIS_URL` con la URL de Upstash

3. **El código ya está preparado**:
   - Si `REDIS_URL` está configurada, usa Redis automáticamente
   - Si no está configurada, usa memoria como fallback
   - No necesitas cambiar código

**Beneficios de Redis:**
- Persistencia entre reinicios del servidor
- Mejor rendimiento en entornos serverless
- Rate limiting distribuido entre múltiples instancias

---

## Licencia

Proyecto académico — Universidad de La Frontera.
