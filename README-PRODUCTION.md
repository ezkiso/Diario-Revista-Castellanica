# Guía de Producción - Diario Castellano UFRO

Esta guía contiene instrucciones específicas para desplegar y mantener el proyecto en producción.

## 📋 Checklist Pre-Despliegue

- [ ] Repositorio en GitHub configurado
- [ ] Cuenta en Vercel creada
- [ ] Base de datos Neon PostgreSQL configurada
- [ ] Variables de entorno definidas
- [ ] Redis (Upstash) configurado (opcional pero recomendado)
- [ ] Vercel Blob configurado (para almacenamiento de imágenes)

---

## 🔧 Configuración en Vercel

### 1. Importar Proyecto

1. Ve a [vercel.com](https://vercel.com)
2. Clic en "Add New" → "Project"
3. Importa tu repositorio de GitHub
4. Vercel detectará automáticamente Next.js

### 2. Variables de Entorno

En `Settings` → `Environment Variables`, agrega:

**Obligatorias:**
```
DATABASE_URL=postgresql://usuario:password@ep-xxx.aws.neon.tech/neondb?sslmode=require&pgbouncer=true
DIRECT_URL=postgresql://usuario:password@ep-xxx.aws.neon.tech/neondb?sslmode=require
AUTH_SECRET=tu-secret-generado-con-openssl
AUTH_URL=https://diario-revista-castellanica.vercel.app
ADMIN_EMAIL=admin@ufro.cl
ADMIN_PASSWORD=TuClaveSegura123!
ADMIN_NAME=Administrador UFRO
BLOB_READ_WRITE_TOKEN=vercel_blob_token_xxxxx
```

**Opcionales (recomendadas):**
```
REDIS_URL=rediss://default:password@host.upstash.io:port
```

### 3. Generar AUTH_SECRET

```bash
openssl rand -base64 32
```

### 4. Configurar Neon PostgreSQL

**Connection Strings:**
- **DATABASE_URL**: Usa la **pooled** connection string (con `?pgbouncer=true`)
- **DIRECT_URL**: Usa la connection string directa (sin pgbouncer)

Esto es necesario para Prisma en entornos serverless.

### 5. Configurar Vercel Blob (opcional)

Si usas almacenamiento de imágenes:

1. Ve a [vercel.com/storage](https://vercel.com/storage)
2. Crea un store de Blob
3. Copia el `BLOB_READ_WRITE_TOKEN`
4. Agrégalo a las variables de entorno

---

## 🚀 Primer Despliegue

### Paso 1: Deploy Inicial

Vercel hará deploy automático al importar el repositorio. Espera a que termine.

### Paso 2: Migración de Base de Datos

Desde tu terminal local, apunta a la base de datos de producción:

```bash
# Sincronizar schema
DATABASE_URL="tu-url-produccion" DIRECT_URL="tu-url-produccion" npx prisma db push

# Insertar datos iniciales
DATABASE_URL="tu-url-produccion" DIRECT_URL="tu-url-produccion" npm run db:seed
```

### Paso 3: Verificar Despliegue

1. Visita `https://diario-revista-castellanica.vercel.app`
2. Prueba `/admin` para verificar login
3. Crea un artículo de prueba
4. Sube una imagen de prueba

---

## 🔒 Configurar Redis (Upstash)

### Por qué usar Redis

- Persistencia entre reinicios del servidor
- Mejor rendimiento en entornos serverless
- Rate limiting distribuido

### Pasos de Configuración

1. **Crear cuenta en Upstash**
   - Ve a [upstash.com](https://upstash.com)
   - Sign up con GitHub
   - Crea una base de datos Redis

2. **Obtener REDIS_URL**
   - En tu dashboard de Upstash
   - Copia la `REST API URL` o `REDIS_URL`

3. **Agregar en Vercel**
   - En tu proyecto Vercel
   - Settings → Environment Variables
   - Agrega `REDIS_URL` con la URL de Upstash

4. **Hacer deploy**
   - Push a GitHub o deploy manual en Vercel

### Verificar Redis

El código usa Redis automáticamente si está configurado. No necesitas cambiar código.

---

## 📊 Monitoreo

### Vercel Analytics

Vercel incluye analytics básicos. Actívalo en:
`Settings` → `Analytics`

### Logs

Ve a `Deployments` → selecciona un deploy → `Build Logs` o `Function Logs`

### Base de Datos

Usa Prisma Studio para inspeccionar datos:

```bash
DATABASE_URL="tu-url-produccion" npx prisma studio
```

---

## 🔐 Seguridad en Producción

### Headers de Seguridad

Ya configurados en `next.config.ts`:
- HSTS (HTTPS obligatorio)
- X-Frame-Options (previene clickjacking)
- Content-Security-Policy (controla recursos)
- X-Content-Type-Options (previene MIME sniffing)

### Rate Limiting

- **Uploads**: 10 por minuto por usuario
- **Login**: 5 intentos fallidos en 15 minutos
- Usa Redis si está configurado, fallback a memoria

### Validación de Archivos

- Solo imágenes: JPEG, PNG, WebP, GIF
- Máximo 5MB por archivo
- Sanitización de nombres de archivo

---

## 🔄 Actualizaciones

### Flujo de Trabajo

1. Hacer cambios en rama `main`
2. Push a GitHub
3. Vercel hace deploy automático
4. Verificar en producción

### Migraciones de Base de Datos

Si cambias el schema de Prisma:

```bash
# Localmente
npx prisma migrate dev --name nombre-migracion

# En producción
DATABASE_URL="tu-url-produccion" DIRECT_URL="tu-url-produccion" npx prisma migrate deploy
```

---

## 🆘 Troubleshooting

### Error: "Database connection failed"

- Verifica `DATABASE_URL` y `DIRECT_URL` en Vercel
- Asegúrate de usar la pooled connection para `DATABASE_URL`
- Verifica que Neon esté activo

### Error: "AUTH_SECRET is required"

- Genera un nuevo secret: `openssl rand -base64 32`
- Agrégalo a las variables de entorno en Vercel
- Haz redeploy

### Error: "Rate limit exceeded"

- Si usas Redis, verifica `REDIS_URL`
- Si no usas Redis, espera 1 minuto (uploads) o 15 minutos (login)
- Verifica logs en Vercel para ver errores de Redis

### Imágenes no se suben

- Verifica `BLOB_READ_WRITE_TOKEN` en Vercel
- Asegúrate de tener Vercel Blob configurado
- Verifica que el archivo sea una imagen válida

---

## 📞 Soporte

- **Documentación principal**: [README.md](./README.md)
- **Arquitectura**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Neon Docs**: [neon.tech/docs](https://neon.tech/docs)
- **Upstash Docs**: [upstash.com/docs](https://upstash.com/docs)

---

## 📝 Notas Importantes

- La región está configurada en São Paulo (gru1) para mejor latencia en Chile
- El proyecto usa Next.js 15 con App Router
- La base de datos es PostgreSQL serverless (Neon)
- El almacenamiento de imágenes es Vercel Blob
- Redis es opcional pero recomendado para producción

---

**Última actualización**: Junio 2026
**Versión**: 1.0.0
